import http from 'http';
import fs from 'fs';
import path from 'path';
import { URL as NodeURL } from 'url';
import { fileURLToPath } from 'url';

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const envPath    = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (k && !process.env[k]) process.env[k] = v;
  }
  console.log('[ENV] Loaded .env.local');
}

const PORT         = parseInt(process.env.PORT || '8080', 10);
const SENDER_PHONE = process.env.WHATSAPP_SENDER_PHONE || '+919289289800';
const cleanSender  = SENDER_PHONE.replace(/\D/g, '');

let sock        = null;
let state       = 'INITIALIZING';
let pairingCode = null;
let connError   = null;

function normalizeChatId(phone) {
  if (!phone) return null;
  let d = String(phone).replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  if (d.length === 10) d = '91' + d;
  return d + '@s.whatsapp.net';
}

// ── HTTP Server ──────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, api_key');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url      = new NodeURL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const isReady  = state === 'CONNECTED';

  // JSON status
  if (req.method === 'GET' && (pathname === '/status' || pathname === '/api/status')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, connected: isReady, state, senderPhone: SENDER_PHONE, error: connError }));
    return;
  }

  // HTML dashboard
  if (req.method === 'GET' && pathname === '/') {
    const inner = isReady
      ? `<div class="ok-box"><div class="check">✓</div><h2>WhatsApp Connected!</h2><p>Automated messages are now live<br>from <strong>${SENDER_PHONE}</strong></p></div>`
      : pairingCode
      ? `<p class="hint">Enter this code on your phone:</p>
         <div class="code">${pairingCode}</div>
         <div class="steps">
           <p>📱 On your phone:</p>
           <ol>
             <li>Open <strong>WhatsApp</strong></li>
             <li>Tap <strong>⋮ → Linked Devices → Link a Device</strong></li>
             <li>Tap <strong>"Link with phone number instead"</strong></li>
             <li>Enter the code shown above</li>
           </ol>
         </div>
         <p class="note">Code refreshes every ~60s. Page auto-reloads.</p>
         <script>setTimeout(()=>location.reload(),12000)</script>`
      : `<div class="waiting"><div class="spin"></div><p>Starting... <em>${state}</em></p><p class="note">Pairing code will appear here shortly.</p></div>
         <script>setTimeout(()=>location.reload(),4000)</script>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>WhatsApp Gateway — Noor-e-Flames</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0c0d0e;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.card{background:#16181a;border:1px solid #2a2e33;border-radius:20px;padding:48px 40px;max-width:520px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.logo{font-size:28px;font-weight:900;color:#25d366;margin-bottom:4px}
.sub{color:#555;font-size:13px;margin-bottom:6px}
.phone{display:inline-block;background:#1a2a1e;color:#25d366;border:1px solid #25d36633;border-radius:20px;padding:4px 14px;font-size:12px;font-weight:600;margin-bottom:24px}
.badge{padding:5px 14px;border-radius:20px;font-size:11px;font-weight:700;display:inline-block;margin-bottom:28px;letter-spacing:.5px}
.ok{background:#25d36622;color:#25d366;border:1px solid #25d36644}
.pend{background:#d4af3722;color:#d4af37;border:1px solid #d4af3744}
.hint{color:#aaa;font-size:15px;margin-bottom:16px}
.code{font-size:52px;font-weight:900;letter-spacing:14px;color:#fff;background:#0f1a12;border:2px solid #25d36655;border-radius:16px;padding:18px 28px;display:inline-block;font-family:'Courier New',monospace;margin-bottom:22px}
.steps{background:#1a1c1f;border-radius:12px;padding:20px 24px;text-align:left;margin-bottom:18px}
.steps p{color:#888;font-size:13px;margin-bottom:10px}
.steps ol{padding-left:20px;color:#ccc;font-size:14px;line-height:2.2}
.steps strong{color:#fff}
.note{color:#555;font-size:12px}
.ok-box{padding:16px}
.check{font-size:60px;margin-bottom:14px}
.ok-box h2{color:#25d366;font-size:22px;margin-bottom:10px}
.ok-box p{color:#888;line-height:1.8}
.waiting{padding:16px}
.spin{width:40px;height:40px;border:3px solid #2a2e33;border-top-color:#25d366;border-radius:50%;animation:s .8s linear infinite;margin:0 auto 18px}
@keyframes s{to{transform:rotate(360deg)}}
.waiting p{color:#888;margin-bottom:8px}
.waiting em{color:#d4af37;font-style:normal}
hr{border:0;border-top:1px solid #2a2e33;margin:28px 0}
.btn{display:inline-block;background:#25d366;color:#000;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px}
</style>
</head>
<body>
<div class="card">
  <div class="logo">Noor-e-Flames</div>
  <div class="sub">WhatsApp Automation Gateway</div>
  <div class="phone">${SENDER_PHONE}</div><br>
  <span class="badge ${isReady ? 'ok' : 'pend'}">${state}</span>
  ${inner}
  <hr>
  <a href="http://localhost:3000/admin" class="btn">Return to Admin Hub</a>
</div>
</body></html>`);
    return;
  }

  // POST /sendText → send message
  if (req.method === 'POST' && (pathname === '/sendText' || pathname === '/api/sendText')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const pl     = JSON.parse(body || '{}');
        const target = pl.chatId || pl.to || pl.phone || pl.recipient;
        const msg    = pl.text  || pl.content || pl.message;
        if (!target || !msg) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Missing phone number or message' }));
          return;
        }
        const jid = normalizeChatId(target);
        if (!sock || !isReady) {
          const digits = (jid || '').replace('@s.whatsapp.net', '');
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: `WhatsApp not connected (${state})`, directWaLink: `https://wa.me/${digits}?text=${encodeURIComponent(msg)}` }));
          return;
        }
        await sock.sendMessage(jid, { text: msg });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, from: SENDER_PHONE, to: jid, timestamp: new Date().toISOString() }));
      } catch (err) {
        console.error('[Gateway] Send error:', err?.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err?.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// ── Baileys Client ───────────────────────────────────────────────────────────
async function initBaileys() {
  console.log('\n================================================================');
  console.log('  NOOR-E-FLAMES WHATSAPP GATEWAY (Baileys — no browser needed)');
  console.log(`  Sender : ${SENDER_PHONE}`);
  console.log(`  URL    : http://localhost:${PORT}`);
  console.log('================================================================\n');

  try {
    const {
      default: makeWASocket,
      useMultiFileAuthState,
      DisconnectReason,
      makeCacheableSignalKeyStore,
      fetchLatestBaileysVersion,
    } = await import('@whiskeysockets/baileys');

    const P      = (await import('pino')).default;
    const logger = P({ level: 'silent' });

    const authDir = path.resolve(__dirname, '..', '.wa_auth');
    if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

    const { state: authState, saveCreds } = await useMultiFileAuthState(authDir);
    const { version } = await fetchLatestBaileysVersion();

    state = 'STARTING';
    console.log('[Baileys] Initializing connection...');

    sock = makeWASocket({
      version,
      logger,
      auth: {
        creds: authState.creds,
        keys: makeCacheableSignalKeyStore(authState.keys, logger),
      },
      printQRInTerminal: false,
    });

    // Phone number pairing code (no QR scan needed)
    if (!authState.creds.registered) {
      setTimeout(async () => {
        try {
          state = 'AWAITING_CODE';
          console.log(`[Baileys] Requesting pairing code for +${cleanSender}...`);
          const code = await sock.requestPairingCode(cleanSender);
          pairingCode = code;
          console.log('\n=================================================================');
          console.log(`  YOUR PAIRING CODE:   ${code}`);
          console.log('\n  On your phone:');
          console.log('  WhatsApp > Linked Devices > Link a Device');
          console.log('  > "Link with phone number instead" > enter the code above');
          console.log('=================================================================');
          console.log(`  Or open http://localhost:${PORT} in your browser\n`);
        } catch (e) {
          console.error('[Pairing Code Error]:', e?.message);
          connError = e?.message;
        }
      }, 3000);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
      if (connection === 'open') {
        state = 'CONNECTED'; pairingCode = null; connError = null;
        console.log(`\n=== WHATSAPP CONNECTED! Automated messages LIVE from ${SENDER_PHONE} ===\n`);
      }
      if (connection === 'close') {
        const statusCode  = lastDisconnect?.error?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 401;
        sock  = null;
        console.warn(`[Baileys] Disconnected (${statusCode}). Logged out: ${isLoggedOut}`);
        if (isLoggedOut) {
          state = 'AWAITING_CODE';
          try {
            if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true });
          } catch (_) {}
          console.log('[Baileys] Stale session cleared. Requesting fresh pairing code in 3s...');
          setTimeout(initBaileys, 3000);
        } else {
          state = 'RECONNECTING';
          console.log('[Baileys] Reconnecting in 5s...');
          setTimeout(initBaileys, 5000);
        }
      }
    });

    sock.ev.on('messages.upsert', () => {});

  } catch (err) {
    state     = 'ERROR';
    connError = err?.message || String(err);
    console.error('[Baileys Error]:', connError);
  }
}

server.listen(PORT, () => {
  console.log(`[Gateway] REST API at http://localhost:${PORT}`);
  initBaileys();
});

