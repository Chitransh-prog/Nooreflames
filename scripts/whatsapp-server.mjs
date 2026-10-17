import http from 'http';
import fs from 'fs';
import path from 'path';
import { URL as NodeURL, fileURLToPath } from 'url';
import QRCode from 'qrcode';

// ── 1. Environment Configuration ─────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const envPath    = path.resolve(__dirname, '..', '.env.local');

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (k && !process.env[k]) process.env[k] = v;
  }
  console.log('[ENV] Loaded .env.local');
}

const PORT         = parseInt(process.env.PORT || '8080', 10);
const HOST         = '0.0.0.0';
const SENDER_PHONE = process.env.WHATSAPP_SENDER_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_SENDER_PHONE || '+918368291472';
let activeSenderPhone = SENDER_PHONE;
const cleanSender  = () => activeSenderPhone.replace(/\D/g, '');
const ADMIN_PANEL_URL = process.env.ADMIN_PANEL_URL || 'https://nooreflames.vercel.app/admin';
const DB_URL       = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const authDir = path.resolve(__dirname, '..', '.wa_auth');
if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

// ── 2. Global State ──────────────────────────────────────────────────────────
let sock               = null;
let state              = 'INITIALIZING';
let pairingCode        = null;
let qrCodeDataUrl      = null;
let connError          = null;
let hasCloudSession    = false;
let isPairingRequested = false;
let dbClient           = null;

// ── 3. Neon PostgreSQL Session Sync ──────────────────────────────────────────
async function getDb() {
  if (dbClient) return dbClient;
  if (!DB_URL) return null;
  try {
    const { neon } = await import('@neondatabase/serverless');
    dbClient = neon(DB_URL);
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_session (
        key TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('[Neon DB] whatsapp_session table verified');
    return dbClient;
  } catch (err) {
    console.warn('[Neon DB] Connection failed:', err?.message);
    return null;
  }
}

async function restoreSessionFromDB() {
  try {
    const sql = await getDb();
    if (!sql) return false;

    const rows = await sql.query('SELECT key, data FROM whatsapp_session');
    if (!rows || rows.length === 0) {
      console.log('[Neon DB] No saved WhatsApp session in cloud storage');
      hasCloudSession = false;
      return false;
    }

    if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

    let restored = 0;
    for (const r of rows) {
      if (r.key && r.data) {
        fs.writeFileSync(path.join(authDir, r.key), r.data, 'utf8');
        restored++;
      }
    }

    hasCloudSession = restored > 0;
    console.log(`[Neon DB] Restored ${restored} session file(s) from cloud!`);

    try {
      const pRows = await sql.query("SELECT data FROM whatsapp_session WHERE key = 'active_sender_phone' LIMIT 1");
      if (pRows && pRows[0]?.data) {
        activeSenderPhone = pRows[0].data;
        console.log(`[Neon DB] Restored active phone from cloud: ${activeSenderPhone}`);
      }
    } catch (_) {}

    return true;
  } catch (err) {
    console.warn('[Neon DB] Restore error:', err?.message);
    return false;
  }
}

let syncTimer = null;
function scheduleDBSync(delayMs = 1200) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    await persistSessionToDB();
  }, delayMs);
}

async function persistSessionToDB() {
  try {
    const sql = await getDb();
    if (!sql || !fs.existsSync(authDir)) return;

    const files = fs.readdirSync(authDir);
    if (files.length === 0) return;

    for (const file of files) {
      const filePath = path.join(authDir, file);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const content = fs.readFileSync(filePath, 'utf8');
        await sql.query(`
          INSERT INTO whatsapp_session (key, data, updated_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
        `, [file, content]);
      }
    }
    hasCloudSession = true;
    console.log(`[Neon DB] Cloud session synced (${files.length} files saved)`);
  } catch (err) {
    console.warn('[Neon DB] Persist error:', err?.message);
  }
}

async function clearDBSession() {
  try {
    const sql = await getDb();
    if (!sql) return;
    await sql.query('DELETE FROM whatsapp_session');
    hasCloudSession = false;
    console.log('[Neon DB] Cloud session cleared');
  } catch (err) {
    console.warn('[Neon DB] Clear error:', err?.message);
  }
}

// ── 4. Helper Functions ──────────────────────────────────────────────────────
function normalizeChatId(phone) {
  if (!phone) return null;
  let d = String(phone).replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  if (d.length === 10) d = '91' + d;
  return d + '@s.whatsapp.net';
}

async function requestPairingCodeManual() {
  if (!sock) throw new Error('WhatsApp service initializing. Please retry in 3 seconds.');
  if (state === 'CONNECTED') throw new Error('WhatsApp is already connected!');
  try {
    const cleanNum = cleanSender();
    console.log(`[Baileys] Requesting pairing code for +${cleanNum}...`);
    isPairingRequested = true;
    const code = await sock.requestPairingCode(cleanNum);
    pairingCode = code;
    connError = null;
    console.log('\n=================================================================');
    console.log(`  YOUR PAIRING CODE:   ${code}`);
    console.log('  On your phone: WhatsApp > Linked Devices > Link with phone number');
    console.log('=================================================================\n');
    return code;
  } catch (err) {
    console.warn('[Baileys] Pairing code error:', err?.message);
    connError = `Pairing Code Notice: WhatsApp cloud security restricts pairing codes from cloud hosting IPs (Render/AWS). Please scan the QR code above on this page, or run 'npm run whatsapp' once locally on your PC to sync credentials to Neon DB.`;
    throw err;
  }
}

// ── 5. HTTP API & Luxury Dashboard Server ───────────────────────────────────
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, api_key');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const parsedUrl = new NodeURL(req.url || '/', `http://${req.headers.host || 'localhost:' + PORT}`);
  const pathname  = parsedUrl.pathname;
  const isReady   = state === 'CONNECTED';

  // ── JSON Status ──
  if (req.method === 'GET' && (pathname === '/status' || pathname === '/api/status')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      connected: isReady,
      state,
      senderPhone: activeSenderPhone,
      adminPanelUrl: ADMIN_PANEL_URL,
      pairingCode,
      hasQr: !!qrCodeDataUrl,
      hasCloudSession,
      error: connError,
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // ── Request Pairing Code endpoint ──
  if ((req.method === 'POST' || req.method === 'GET') && pathname === '/api/request-pairing') {
    try {
      const code = await requestPairingCodeManual();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, pairingCode: code }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message, notice: connError }));
    }
    return;
  }

  // ── Disconnect / Unlink endpoint ──
  if (req.method === 'POST' && pathname === '/api/disconnect') {
    try {
      if (sock) {
        try { await sock.logout(); } catch (_) {}
      }
      try {
        if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true });
        await clearDBSession();
      } catch (_) {}
      state = 'AWAITING_SCAN';
      pairingCode = null;
      qrCodeDataUrl = null;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Logged out and session cleared' }));
      setTimeout(initBaileys, 1500);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message }));
    }
    return;
  }

  // ── POST /sendText (standard Open-WA / Baileys endpoint used by Next.js) ──
  if (req.method === 'POST' && (pathname === '/sendText' || pathname === '/api/sendText' || pathname === '/api/send-test')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const pl     = JSON.parse(body || '{}');
        const target = pl.chatId || pl.to || pl.phone || pl.recipient;
        const msg    = pl.text  || pl.content || pl.message;
        if (!target || !msg) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Missing phone number or message text' }));
          return;
        }
        const jid = normalizeChatId(target);
        if (!sock || !isReady) {
          const digits = (jid || '').replace('@s.whatsapp.net', '');
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: `WhatsApp not connected (${state})`,
            directWaLink: `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`
          }));
          return;
        }
        const sent = await sock.sendMessage(jid, { text: msg });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          from: activeSenderPhone || SENDER_PHONE,
          to: jid,
          messageId: sent?.key?.id,
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.error('[Gateway] Send error:', err?.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err?.message }));
      }
    });
    return;
  }

  // ── HTML Dashboard ──
  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderDashboardHtml());
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

// ── 6. Dashboard Template ────────────────────────────────────────────────────
function renderDashboardHtml() {
  const isReady = state === 'CONNECTED';
  const qrDisplay = qrCodeDataUrl
    ? `<div class="qr-container">
         <img src="${qrCodeDataUrl}" alt="WhatsApp QR Code" class="qr-image" />
         <div class="qr-pulse"></div>
       </div>`
    : `<div class="spinner-container">
         <div class="spinner"></div>
         <p>Generating secure QR code...</p>
       </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Noor-E-Flames — WhatsApp Automation Gateway</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #090a0b;
    --card: #131518;
    --card-border: #22262b;
    --gold: #d4af37;
    --gold-glow: rgba(212, 175, 55, 0.2);
    --green: #25d366;
    --green-glow: rgba(37, 211, 102, 0.25);
    --text-primary: #f0f2f5;
    --text-muted: #8a929a;
    --accent: #1e2227;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: radial-gradient(circle at 50% 20%, #15181c 0%, var(--bg) 100%);
    color: var(--text-primary);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .wrapper {
    max-width: 620px;
    width: 100%;
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: 24px;
    box-shadow: 0 30px 90px rgba(0,0,0,0.65), 0 0 40px var(--gold-glow);
    padding: 44px 36px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .brand-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--gold);
    background: rgba(212, 175, 55, 0.1);
    border: 1px solid rgba(212, 175, 55, 0.25);
    padding: 6px 14px;
    border-radius: 30px;
    margin-bottom: 12px;
    font-weight: 600;
  }
  h1 {
    font-family: 'Cinzel', serif;
    font-size: 28px;
    letter-spacing: 1.5px;
    color: #fff;
    margin-bottom: 6px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }
  .subtitle {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 22px;
  }
  .status-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 30px;
  }
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .status-connected {
    background: rgba(37, 211, 102, 0.15);
    color: var(--green);
    border: 1px solid rgba(37, 211, 102, 0.35);
  }
  .status-pending {
    background: rgba(212, 175, 55, 0.15);
    color: var(--gold);
    border: 1px solid rgba(212, 175, 55, 0.35);
  }
  .phone-pill {
    background: #181c20;
    color: #fff;
    border: 1px solid #2a3038;
  }
  .cloud-pill {
    background: #141f17;
    color: #4ade80;
    border: 1px solid rgba(74, 222, 128, 0.25);
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 8px currentColor;
    display: inline-block;
  }

  /* Connected Card */
  .connected-box {
    background: linear-gradient(180deg, rgba(37,211,102,0.06) 0%, rgba(19,21,24,0) 100%);
    border: 1px solid rgba(37, 211, 102, 0.25);
    border-radius: 18px;
    padding: 32px 24px;
    margin-bottom: 24px;
  }
  .check-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--green-glow);
    border: 2px solid var(--green);
    color: var(--green);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin: 0 auto 16px;
  }
  .connected-box h2 {
    font-size: 20px;
    color: #fff;
    margin-bottom: 8px;
  }
  .connected-box p {
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.6;
  }

  /* Test Message Box */
  .test-box {
    background: #16191d;
    border: 1px solid #282f37;
    border-radius: 16px;
    padding: 20px;
    text-align: left;
    margin-top: 24px;
  }
  .test-box h3 {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--gold);
    margin-bottom: 12px;
    font-weight: 700;
  }
  .input-group {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }
  input[type="text"], textarea {
    width: 100%;
    background: #0d0e10;
    border: 1px solid #2e343d;
    border-radius: 10px;
    color: #fff;
    padding: 10px 14px;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color .2s;
  }
  input[type="text"]:focus, textarea:focus {
    border-color: var(--gold);
  }
  .btn-send {
    background: var(--green);
    color: #000;
    border: none;
    border-radius: 10px;
    padding: 10px 18px;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
    transition: transform .15s, opacity .15s;
  }
  .btn-send:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-disconnect {
    background: transparent;
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 12px;
    cursor: pointer;
    margin-top: 14px;
    transition: all .2s;
  }
  .btn-disconnect:hover { background: rgba(239, 68, 68, 0.1); }

  /* Pairing view */
  .qr-container {
    background: #ffffff;
    padding: 16px;
    border-radius: 18px;
    display: inline-block;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    margin: 12px 0 20px;
    position: relative;
  }
  .qr-image {
    display: block;
    width: 240px;
    height: 240px;
    border-radius: 8px;
  }
  .steps-card {
    background: #171a1d;
    border: 1px solid #262c33;
    border-radius: 14px;
    padding: 18px 22px;
    text-align: left;
    margin: 18px 0;
  }
  .steps-title {
    font-size: 13px;
    color: var(--gold);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }
  .steps-card ol {
    padding-left: 20px;
    color: #cfd5dc;
    font-size: 13px;
    line-height: 2;
  }
  .steps-card strong { color: #fff; }

  /* Code option */
  .code-section {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #22262b;
  }
  .code-display {
    font-family: 'Courier New', monospace;
    font-size: 38px;
    font-weight: 800;
    letter-spacing: 8px;
    color: #fff;
    background: #0d0f11;
    border: 2px solid var(--gold);
    border-radius: 12px;
    padding: 14px;
    display: inline-block;
    margin: 12px 0;
    box-shadow: 0 0 20px var(--gold-glow);
  }
  .btn-outline {
    background: #1a1e23;
    color: var(--text-primary);
    border: 1px solid #333a44;
    border-radius: 10px;
    padding: 9px 18px;
    font-size: 13px;
    cursor: pointer;
    font-weight: 600;
    transition: all .2s;
  }
  .btn-outline:hover {
    border-color: var(--gold);
    color: var(--gold);
  }

  .cloud-tip {
    background: rgba(212, 175, 55, 0.05);
    border: 1px dashed rgba(212, 175, 55, 0.3);
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 12px;
    color: #b5bcc6;
    text-align: left;
    line-height: 1.6;
    margin-top: 22px;
  }
  .cloud-tip strong { color: var(--gold); }

  .spinner-container {
    padding: 40px 0;
    color: var(--text-muted);
    font-size: 13px;
  }
  .spinner {
    width: 44px;
    height: 44px;
    border: 3px solid #2a2e33;
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .admin-top-nav {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }
  .btn-admin-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.14) 0%, rgba(212, 175, 55, 0.04) 100%);
    border: 1px solid rgba(212, 175, 55, 0.45);
    color: #f7e4ca;
    padding: 10px 22px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-decoration: none;
    box-shadow: 0 4px 18px rgba(0,0,0,0.4);
    transition: all 0.25s ease;
  }
  .btn-admin-pill:hover {
    background: #d4af37;
    color: #0d0f11;
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(212, 175, 55, 0.35);
  }
  .btn-admin-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    margin-top: 18px;
    padding: 14px 24px;
    background: linear-gradient(135deg, #FAF6F0 0%, #E3D1BC 100%);
    color: #121212;
    border-radius: 12px;
    font-size: 13.5px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-decoration: none;
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
    transition: all 0.25s ease;
  }
  .btn-admin-cta:hover {
    background: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(212, 175, 55, 0.3);
  }
  #notice { margin-top: 10px; font-size: 12px; }
</style>
</head>
<body>

<div class="wrapper">
  <div class="admin-top-nav">
    <a href="${ADMIN_PANEL_URL}" class="btn-admin-pill" title="Return to Commerce Hub Admin Panel">
      <span>⬅️ Return to Admin Panel</span>
      <span style="font-size: 11px; opacity: 0.8; font-weight: 500;">(nooreflames.vercel.app/admin)</span>
    </a>
  </div>

  <div class="brand-badge">✨ Noor-E-Flames Atelier</div>
  <h1>WhatsApp Automation Gateway</h1>
  <div class="subtitle">Cloud CRM Dispatcher for Customer Signups, Welcome Gifts & Orders</div>

  <div class="status-bar">
    <div class="status-pill ${isReady ? 'status-connected' : 'status-pending'}">
      <span class="dot"></span>
      <span id="state-text">${state}</span>
    </div>
    <div class="status-pill phone-pill">📱 ${activeSenderPhone}</div>
    <div class="status-pill cloud-pill">☁️ Neon DB Sync: ${hasCloudSession ? 'Active' : 'Standby'}</div>
  </div>

  ${isReady ? `
    <!-- CONNECTED VIEW -->
    <div class="connected-box">
      <div class="check-icon">✓</div>
      <h2>WhatsApp Connected & Live!</h2>
      <p>Automated sign-up welcome messages, promo codes, and order updates are actively streaming from <strong>${activeSenderPhone}</strong>.</p>
      <p style="margin-top: 8px; color: #4ade80; font-size: 12px;">✓ Auth session is synced to Neon PostgreSQL. Survives Render restarts permanently.</p>
      <a href="${ADMIN_PANEL_URL}" class="btn-admin-cta">
        🚀 Open Commerce Hub Admin Panel →
      </a>
    </div>

    <!-- TEST SENDER -->
    <div class="test-box">
      <h3>🚀 Quick Live Message Test</h3>
      <div class="input-group">
        <input type="text" id="test-phone" placeholder="Enter 10-digit phone (e.g. 9289289800)" />
        <button class="btn-send" onclick="sendTestMessage()">Send Test</button>
      </div>
      <input type="text" id="test-msg" value="✨ Welcome to Noor-E-Flames Atelier! Your 10% OFF code is WELCOME10" />
      <div id="notice"></div>
      <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #22262b; font-size: 12px;">
        <a href="${ADMIN_PANEL_URL}" style="color: #d4af37; text-decoration: none; font-weight: 600;">
          ← Switch to Admin Panel to send bulk broadcasts & customer coupons
        </a>
      </div>
    </div>

    <button class="btn-disconnect" onclick="disconnectWhatsApp()">Unlink / Re-pair Account</button>
  ` : `
    <!-- PAIRING VIEW -->
    <div>
      <p style="font-size: 14px; color: #e1e6eb; margin-bottom: 6px;">
        <strong>Scan QR Code with WhatsApp</strong>
      </p>
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">
        Instant, reliable, and bypasses cloud datacenter IP blocks on Render.
      </p>

      ${qrDisplay}

      <div class="steps-card">
        <div class="steps-title">📱 How to Link:</div>
        <ol>
          <li>Open <strong>WhatsApp</strong> on your phone (<strong>${SENDER_PHONE}</strong>)</li>
          <li>Tap <strong>Settings / Menu (⋮) → Linked Devices → Link a Device</strong></li>
          <li>Point your camera at the QR code above</li>
        </ol>
      </div>

      <div class="code-section">
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Prefer phone number pairing code?</p>
        ${pairingCode ? `
          <div class="code-display">${pairingCode}</div>
          <p style="font-size: 12px; color: var(--text-muted);">Enter this 8-digit code in WhatsApp → "Link with phone number instead"</p>
        ` : `
          <button class="btn-outline" onclick="requestPairingCode()">Generate 8-Digit Code</button>
        `}
      </div>

      <div class="cloud-tip">
        <strong>💡 Pro Tip for Render Deployments:</strong><br>
        If pairing code fails on Render due to WhatsApp's datacenter security, simply scan the QR code above. Alternatively, you can run <code>npm run whatsapp</code> once on your local laptop to link via phone number; your credentials will automatically sync to Neon DB, making Render immediately connected!
      </div>
    </div>
  `}
</div>

<script>
  // Live polling for instantaneous connection updates without reload
  let wasConnected = ${isReady};
  setInterval(async () => {
    try {
      const res = await fetch('/status');
      const data = await res.json();
      if (data.connected !== wasConnected) {
        location.reload();
      }
    } catch (_) {}
  }, 2500);

  async function requestPairingCode() {
    const btn = event?.target;
    if (btn) { btn.disabled = true; btn.innerText = 'Requesting...'; }
    try {
      const res = await fetch('/api/request-pairing', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        location.reload();
      } else {
        alert(data.notice || data.error || 'Failed to request pairing code');
        if (btn) { btn.disabled = false; btn.innerText = 'Generate 8-Digit Code'; }
      }
    } catch (e) {
      alert('Error: ' + e.message);
      if (btn) { btn.disabled = false; btn.innerText = 'Generate 8-Digit Code'; }
    }
  }

  async function sendTestMessage() {
    const phone = document.getElementById('test-phone').value.trim();
    const text  = document.getElementById('test-msg').value.trim();
    const notice = document.getElementById('notice');
    if (!phone) { alert('Please enter a recipient phone number'); return; }
    notice.style.color = '#d4af37';
    notice.innerText = 'Sending message to ' + phone + '...';
    try {
      const res = await fetch('/sendText', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, text })
      });
      const data = await res.json();
      if (data.success) {
        notice.style.color = '#25d366';
        notice.innerText = '✓ Message delivered successfully at ' + new Date().toLocaleTimeString();
      } else {
        notice.style.color = '#ef4444';
        notice.innerText = 'Failed: ' + (data.error || 'Unknown error');
      }
    } catch (e) {
      notice.style.color = '#ef4444';
      notice.innerText = 'Network error: ' + e.message;
    }
  }

  async function disconnectWhatsApp() {
    if (!confirm('Are you sure you want to unlink WhatsApp? This will clear the session.')) return;
    try {
      await fetch('/api/disconnect', { method: 'POST' });
      location.reload();
    } catch (e) {
      alert('Error unlinking: ' + e.message);
    }
  }
</script>

</body>
</html>`;
}

// ── 7. Baileys WhatsApp Client Engine ─────────────────────────────────────────
async function initBaileys() {
  console.log('\n================================================================');
  console.log('  NOOR-E-FLAMES WHATSAPP GATEWAY (Baileys Engine)');
  console.log(`  Sender Phone : ${SENDER_PHONE}`);
  console.log(`  Listen URL   : http://${HOST}:${PORT}`);
  console.log('================================================================\n');

  try {
    const {
      default: makeWASocket,
      useMultiFileAuthState,
      DisconnectReason,
      makeCacheableSignalKeyStore,
      fetchLatestBaileysVersion,
      Browsers,
    } = await import('@whiskeysockets/baileys');

    const P      = (await import('pino')).default;
    const logger = P({ level: 'silent' });

    // Step A: Restore from Neon PostgreSQL if session exists in cloud
    console.log('[Init] Checking Neon PostgreSQL for saved session...');
    await restoreSessionFromDB();

    // Step B: Initialize multi-file auth state
    const { state: authState, saveCreds } = await useMultiFileAuthState(authDir);
    const { version } = await fetchLatestBaileysVersion();

    state = 'CONNECTING';
    console.log(`[Baileys] Launching socket with WA version ${version.join('.')}...`);

    sock = makeWASocket({
      version,
      logger,
      auth: authState,
      browser: Browsers.ubuntu('Chrome'),
      printQRInTerminal: false,
    });

    // Save creds event
    sock.ev.on('creds.update', async () => {
      await saveCreds();
      scheduleDBSync(1500);
    });

    // Connection lifecycle
    sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
      // 1. New QR Code event
      if (qr) {
        try {
          qrCodeDataUrl = await QRCode.toDataURL(qr, { margin: 2, scale: 6 });
          state = 'AWAITING_SCAN';
          console.log('\n[Baileys] New QR Code generated. Ready to scan on web dashboard:');
          console.log(`          http://localhost:${PORT} or your Render deployment URL`);
        } catch (qrErr) {
          console.error('[QR] DataURL generation error:', qrErr?.message);
        }
      }

      // 2. Open / Connected
      if (connection === 'open') {
        state = 'CONNECTED';
        qrCodeDataUrl = null;
        pairingCode = null;
        connError = null;

        if (sock?.user?.id) {
          const rawNum = sock.user.id.split(':')[0].replace(/\D/g, '');
          if (rawNum) {
            activeSenderPhone = '+' + rawNum;
          }
        }

        console.log('\n================================================================');
        console.log(`  === WHATSAPP CONNECTED! Automated messages LIVE ===`);
        console.log(`  Connected Phone: ${activeSenderPhone}`);
        console.log('================================================================\n');

        try {
          const sql = await getDb();
          if (sql) {
            await sql.query(`
              INSERT INTO whatsapp_session (key, data, updated_at)
              VALUES ('active_sender_phone', $1, NOW())
              ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
            `, [activeSenderPhone]);
          }
        } catch (dbErr) {
          console.warn('[Neon DB] Failed to save active phone:', dbErr?.message);
        }

        await persistSessionToDB();
      }

      // 3. Disconnected
      if (connection === 'close') {
        const statusCode  = lastDisconnect?.error?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 401;
        sock = null;
        console.warn(`[Baileys] Connection closed (code: ${statusCode}). Logged out: ${isLoggedOut}`);

        if (isLoggedOut) {
          state = 'LOGGED_OUT';
          qrCodeDataUrl = null;
          pairingCode = null;
          try {
            if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true });
            await clearDBSession();
          } catch (_) {}
          console.log('[Baileys] Cleared stale session. Restarting gateway in 3s...');
          setTimeout(initBaileys, 3000);
        } else {
          state = 'RECONNECTING';
          console.log('[Baileys] Reconnecting in 5s...');
          setTimeout(initBaileys, 5000);
        }
      }
    });

    // If running in development / local mode and not registered, attempt pairing code automatically
    const isCloudEnv = !!(process.env.RENDER || process.env.RENDER_EXTERNAL_URL || process.env.PORT && process.env.PORT !== '8080');
    if (!authState.creds.registered && !isCloudEnv) {
      setTimeout(async () => {
        if (state !== 'CONNECTED' && !isPairingRequested) {
          try {
            await requestPairingCodeManual();
          } catch (_) {}
        }
      }, 3500);
    }

  } catch (err) {
    state     = 'ERROR';
    connError = err?.message || String(err);
    console.error('[Baileys Init Error]:', connError);
  }
}

// ── 8. Render Free Tier Keep-Alive ───────────────────────────────────────────
const keepAliveUrl = process.env.RENDER_EXTERNAL_URL || process.env.KEEP_ALIVE_URL;
if (keepAliveUrl) {
  console.log(`[Keep-Alive] Configured for ${keepAliveUrl}. Pinging every 10 minutes...`);
  setInterval(async () => {
    try {
      const pingEndpoint = `${keepAliveUrl.replace(/\/+$/, '')}/status`;
      await fetch(pingEndpoint);
      console.log(`[Keep-Alive] Pinged ${pingEndpoint} at ${new Date().toLocaleTimeString()}`);
    } catch (e) {
      console.warn('[Keep-Alive] Ping failed:', e?.message);
    }
  }, 10 * 60 * 1000);
}

// ── 9. Start Server ──────────────────────────────────────────────────────────
server.listen(PORT, HOST, () => {
  console.log(`[Gateway] HTTP Server listening on http://${HOST}:${PORT}`);
  initBaileys();
});
