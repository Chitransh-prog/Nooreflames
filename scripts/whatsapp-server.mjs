import http from 'http';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

// Run zstd patch for Windows environment
try {
  const zstdFile = path.resolve('node_modules', 'simple-zstd', 'dist', 'src', 'index.js');
  if (fs.existsSync(zstdFile)) {
    let content = fs.readFileSync(zstdFile, 'utf8');
    if (content.includes("throw new Error('Can not access zstd! Is it installed?');")) {
      content = content.replace(
        /let bin;\s*try\s*\{[^}]*throw new Error\('Can not access zstd! Is it installed\?'\);[^}]*throw new Error\('zstd is not executable'\);\s*\}/s,
        `let bin = '';
try {
    bin = (0, node_child_process_1.execSync)(find, { env: process.env }).toString().replace(/\\n$/, '').replace(/\\r$/, '');
    debug(bin);
    node_fs_1.default.accessSync(bin, node_fs_1.default.constants.X_OK);
} catch {}`
      );
      fs.writeFileSync(zstdFile, content, 'utf8');
    }
  }
} catch (e) {}

const PORT = parseInt(process.env.PORT || '8080', 10);
const SENDER_PHONE = process.env.WHATSAPP_SENDER_PHONE || '+919289289800';
const cleanSender = SENDER_PHONE.replace(/\D/g, '');

let waClient = null;
let connectionState = 'INITIALIZING';
let connectionError = null;

// Detect Chrome or Edge executable on Windows
let chromePath = undefined;
if (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')) {
  chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
} else if (fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')) {
  chromePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
}

function normalizeChatId(phoneOrChatId) {
  if (!phoneOrChatId) return null;
  const str = String(phoneOrChatId).trim();
  if (str.endsWith('@c.us') || str.endsWith('@g.us')) {
    return str;
  }
  let digits = str.replace(/\D/g, '');
  if (digits.length === 10) {
    digits = '91' + digits;
  }
  return `${digits}@c.us`;
}

// Start HTTP REST server
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, api_key');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost:8080'}`);
  const pathname = reqUrl.pathname;

  // GET / or /status -> Gateway Status & Control Page
  if (req.method === 'GET' && (pathname === '/' || pathname === '/status' || pathname === '/api/status')) {
    const isReady = waClient !== null && connectionState === 'CONNECTED';
    let hostNumber = cleanSender;
    
    try {
      if (waClient && typeof waClient.getHostNumber === 'function') {
        const liveHost = await waClient.getHostNumber();
        if (liveHost) hostNumber = liveHost;
      }
    } catch (_) {}

    // Check if client expects JSON
    const accept = req.headers.accept || '';
    if (accept.includes('application/json') || pathname.includes('status')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          service: 'Noor-e-Flames Open-WA Automation Gateway',
          designatedSender: SENDER_PHONE,
          activeSender: hostNumber ? `+${hostNumber}` : SENDER_PHONE,
          connected: isReady,
          state: connectionState,
          error: connectionError,
          endpoints: ['POST /sendText', 'POST /api/sendText', 'GET /status'],
        })
      );
      return;
    }

    // HTML Dashboard Page
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Noor-e-Flames — WhatsApp Automation Gateway</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0c0d0e; color: #fff; padding: 40px 20px; line-height: 1.6; }
            .card { max-width: 620px; margin: 0 auto; background: #16181a; border: 1px solid #2a2e33; border-radius: 12px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
            .badge-success { background: #25d366; color: #000; }
            .badge-pending { background: #d4af37; color: #000; }
            .phone-pill { font-size: 24px; font-weight: 800; color: #25d366; letter-spacing: 0.5px; margin: 12px 0; }
            code { background: #23272b; padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #ffb86c; }
            .btn { display: inline-block; background: #25d366; color: #000; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; margin-top: 14px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>🕯️ Noor-e-Flames Atelier</h2>
            <h3>WhatsApp Automation Gateway</h3>
            <div class="phone-pill">${SENDER_PHONE}</div>
            <p>
              Status: <span class="badge ${isReady ? 'badge-success' : 'badge-pending'}">${connectionState}</span>
            </p>
            ${
              isReady
                ? '<p style="color: #25d366;">✓ Connected and ready! Any automated customer welcome, order notification, or admin message will now be dispatched from this number.</p>'
                : '<p style="color: #d4af37;">⏳ WhatsApp Web window is open. Please scan the QR code using WhatsApp on phone <strong>' + SENDER_PHONE + '</strong> (Linked Devices > Link a Device).</p>'
            }
            <hr style="border: 0; border-top: 1px solid #2a2e33; margin: 24px 0;" />
            <p style="font-size: 13px; color: #888;">
              Connected to: <code>http://localhost:${PORT}</code><br/>
              Session: <code>NOOREFLAMES_${cleanSender}</code>
            </p>
            <a href="http://localhost:3000/admin" class="btn">Return to Store Admin Hub</a>
          </div>
        </body>
      </html>
    `);
    return;
  }

  // POST /sendText or /api/sendText -> Dispatches automated personalized message
  if (req.method === 'POST' && (pathname === '/sendText' || pathname === '/api/sendText')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const target = payload.chatId || payload.to || payload.phone || payload.recipient;
        const message = payload.text || payload.content || payload.message;

        if (!target || !message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: false,
              error: 'Missing target phone number or message content',
            })
          );
          return;
        }

        const chatId = normalizeChatId(target);
        if (!chatId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid recipient phone format' }));
          return;
        }

        if (!waClient || connectionState !== 'CONNECTED') {
          console.warn(`[Open-WA Gateway] WhatsApp client is not yet linked (State: ${connectionState}). Recipient: ${chatId}`);
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: false,
              error: `WhatsApp sender (+${cleanSender}) not linked yet. Scan QR code to link device.`,
              state: connectionState,
              directWaLink: `https://wa.me/${chatId.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
            })
          );
          return;
        }

        console.log(`[Open-WA Gateway] Dispatching message from +${cleanSender} to ${chatId}...`);
        const sendResult = await waClient.sendText(chatId, message);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: true,
            messageId: sendResult || 'delivered',
            from: SENDER_PHONE,
            to: chatId,
            timestamp: new Date().toISOString(),
          })
        );
      } catch (err) {
        console.error('[Open-WA Gateway] Message dispatch failed:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: false,
            error: err?.message || 'Failed to dispatch message via Open-WA',
          })
        );
      }
    });
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

// Launch Open-WA Daemon
async function initOpenWa() {
  console.log('================================================================');
  console.log('🕯️  NOOR-E-FLAMES ATELIER — WHATSAPP AUTOMATION GATEWAY');
  console.log(`📱 Sender Phone Number : ${SENDER_PHONE}`);
  console.log(`🌐 REST API Port        : http://localhost:${PORT}`);
  if (chromePath) {
    console.log(`🖥️  Chrome Executable   : ${chromePath}`);
  }
  console.log('================================================================\n');

  try {
    const { create } = await import('@open-wa/wa-automate');
    connectionState = 'SCAN_QR_CODE';

    console.log(`[Open-WA] Initializing session NOOREFLAMES_${cleanSender}...`);
    console.log('[Open-WA] Chrome browser will open with WhatsApp Web.');
    console.log('[Open-WA] Scan the QR code with WhatsApp on phone ' + SENDER_PHONE);
    console.log('           (WhatsApp > Settings/Menu > Linked Devices > Link a Device)\n');

    waClient = await create({
      sessionId: `NOOREFLAMES_${cleanSender}`,
      multiDevice: true,
      authTimeout: 0,
      qrTimeout: 0,
      blockCrashLogs: true,
      disableSpins: true,
      headless: false, // Opens visible browser on desktop for easy 1-click scanning!
      popup: true,
      ezqr: true,
      cacheEnabled: true,
      executablePath: chromePath,
      useChrome: true,
      onError: 'LOG_AND_FALSE',
    });

    connectionState = 'CONNECTED';
    console.log('\n================================================================');
    console.log(`✅ WHATSAPP CONNECTED SUCCESSFULLY!`);
    console.log(`📱 Active Sender: ${SENDER_PHONE}`);
    console.log(`🚀 Automated messages will now be sent from this phone number.`);
    console.log('================================================================\n');

    waClient.onStateChanged((state) => {
      console.log('[Open-WA State]:', state);
      if (state === 'CONFLICT' || state === 'UNPAIRED') {
        connectionState = state;
      }
    });
  } catch (err) {
    connectionState = 'ERROR';
    connectionError = err?.message || String(err);
    console.error('[Open-WA Startup Error]:', err?.message || err);
  }
}

server.listen(PORT, () => {
  console.log(`[Open-WA Gateway] REST API listening at http://localhost:${PORT}`);
  initOpenWa();
});
