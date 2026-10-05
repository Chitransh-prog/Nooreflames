import http from 'http';
import { URL } from 'url';

const PORT = parseInt(process.env.PORT || '8080', 10);
const SENDER_PHONE = process.env.WHATSAPP_SENDER_PHONE || '+919289289800';
const cleanSender = SENDER_PHONE.replace(/\D/g, '');

let waClient = null;
let connectionState = 'INITIALIZING';
let connectionError = null;

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

  // GET / or /status -> Gateway Status
  if (req.method === 'GET' && (pathname === '/' || pathname === '/status' || pathname === '/api/status')) {
    const isReady = waClient !== null && connectionState === 'CONNECTED';
    let hostNumber = cleanSender;
    
    try {
      if (waClient && typeof waClient.getHostNumber === 'function') {
        const liveHost = await waClient.getHostNumber();
        if (liveHost) hostNumber = liveHost;
      }
    } catch (_) {}

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
          // If WA client is not yet linked via QR, return informative message with simulated fallback
          console.warn(`[Open-WA Gateway] WhatsApp client is not yet linked (State: ${connectionState}). Recipient: ${chatId}`);
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: false,
              error: `WhatsApp sender (+${cleanSender}) not linked yet. Scan QR code in terminal to link device.`,
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
  console.log('================================================================\n');

  try {
    const { create } = await import('@open-wa/wa-automate');
    connectionState = 'SCAN_QR_CODE';

    console.log(`[Open-WA] Launching session for ${SENDER_PHONE}...`);
    console.log('[Open-WA] Please scan the QR code below on your WhatsApp app:');
    console.log('           (WhatsApp > Settings/Menu > Linked Devices > Link a Device)\n');

    waClient = await create({
      sessionId: `NOOREFLAMES_${cleanSender}`,
      multiDevice: true,
      authTimeout: 0,
      qrTimeout: 0,
      blockCrashLogs: true,
      disableSpins: true,
      headless: true,
      cacheEnabled: true,
      useChrome: true,
      onError: (err) => {
        console.error('[Open-WA Error]:', err);
      },
      statusFind: (status) => {
        console.log('[Open-WA Status]:', status);
        if (status === 'isLogged' || status === 'chatsAvailable') {
          connectionState = 'CONNECTED';
          connectionError = null;
        }
      },
    });

    connectionState = 'CONNECTED';
    console.log('\n================================================================');
    console.log(`✅ WHATSAPP CONNECTED SUCCESSFULLY!`);
    console.log(`📱 Active Sender: ${SENDER_PHONE}`);
    console.log(`🚀 Automated messages will now be sent from this phone number.`);
    console.log('================================================================\n');

    // Handle incoming events or reconnections
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
    console.log('\n💡 Note: If you have not run "npm i @open-wa/wa-automate", run it first or use docker run -p 8080:8080 openwa/wa-automate');
  }
}

server.listen(PORT, () => {
  console.log(`[Open-WA Gateway] REST API listening at http://localhost:${PORT}`);
  initOpenWa();
});
