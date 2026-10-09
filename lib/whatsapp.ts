/**
 * Open-WA WhatsApp Integration Library
 * Reference: https://www.open-wa.org/
 * 
 * Provides automated, personalized WhatsApp messaging for:
 * 1. Customer Sign-Up Welcome messages (with customer name & welcome gift)
 * 2. Order Confirmation & COD Tracking (with order details & live tracking)
 * 3. Marketing broadcast messages from Admin Commerce Hub
 */

export const WHATSAPP_SENDER_PHONE = process.env.WHATSAPP_SENDER_PHONE || '+919302306478';

export interface WhatsAppMessageResult {
  success: boolean;
  messageId?: string;
  senderPhone: string;
  recipientPhone: string;
  chatId: string;
  personalizedText: string;
  provider: 'meta-cloud-api' | 'open-wa' | 'simulated' | 'fallback';
  error?: string;
  directWaLink: string;
}

export const WELCOME_MESSAGE_TEMPLATE = `✨ *Welcome to Noor-E-Flames Atelier, {name}!* ✨

Your account is now activated. Explore our signature handcrafted candles and luxury extrait de parfums.

🎁 *Enjoy 10% OFF your first purchase*
VIP Coupon Code: *WELCOME10*

🕯️ *Explore Our Catalog:*
https://nooreflames.vercel.app

If you ever need personalized scent recommendations or custom gift boxes, simply reply to this message!

Warm regards,
*NOOR-E-FLAMES Atelier*
_Where Fragrance Meets Flames_`;

export const ORDER_CONFIRMATION_TEMPLATE = `✨ *Order Confirmed! Hello {name},* ✨

Thank you for your order *#{orderId}* at Noor-E-Flames Atelier!

📦 *Order Details:*
{itemsSummary}

💰 *Total Order Value:* ₹{totalAmount}
{codBreakdown}
📍 *Shipping Address:* {address}, {pincode}

Our artisans are now hand-blending and preparing your order. You can view your live order updates anytime at:
https://nooreflames.vercel.app

Warmly,
*NOOR-E-FLAMES*`;

export const BROADCAST_VIP_OFFER_TEMPLATE = `✨ *Exclusive Atelier Invitation for {name}!* ✨

Hello {name},

We have reserved a limited artisanal batch of our signature extrait flacons and sculptural candles for our registered patrons.

🎁 Enjoy an exclusive *15% OFF* your order today with VIP Code: *{coupon}*

🕯️ *Explore Collections:*
{siteUrl}

Reply directly to this WhatsApp chat for bespoke fragrance recommendations!

Warm regards,
*NOOR-E-FLAMES Atelier*
_Where Fragrance Meets Flames_`;

export const BROADCAST_NEW_LAUNCH_TEMPLATE = `🕯️ *New Artisanal Drop for {name}!* 🕯️

Dear {name},

Our master perfumers have just unveiled our newest botanical collection at Noor-E-Flames Atelier. Hand-poured with pure soy wax and rare botanical extraits.

✨ As a registered patron, enjoy *20% OFF* orders above ₹999 with code: *{coupon}*

🌟 *Discover The New Creations:*
{siteUrl}

Best wishes,
*NOOR-E-FLAMES Atelier*`;

/**
 * Normalizes phone numbers:
 * Converts 10-digit Indian numbers (e.g. 9302306478), 0-prefixed (09302306478), or with country code
 * Produces @c.us chatId required by Open-WA
 */
export function formatWhatsAppChatId(phone: string): { digits: string; chatId: string } {
  let cleaned = String(phone || '').replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.slice(2);
  }
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return {
    digits: cleaned,
    chatId: `${cleaned}@c.us`,
  };
}

/**
 * Replaces placeholders like {name}, [name], { customerName }, etc. with real user data
 */
export function personalizeMessage(
  template: string,
  vars: Record<string, string | number | undefined | null> = {}
): string {
  if (!template) return '';

  const rawName = String(vars.name || vars.customerName || '').trim() || 'Valued Patron';
  const nameParts = rawName.split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || 'Valued Patron';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  const extendedVars: Record<string, string | number | undefined | null> = {
    name: rawName,
    customerName: rawName,
    firstName,
    first_name: firstName,
    lastName,
    last_name: lastName,
    brand: 'NOOR-E-FLAMES Atelier',
    brandName: 'NOOR-E-FLAMES Atelier',
    siteUrl: 'https://nooreflames.vercel.app',
    url: 'https://nooreflames.vercel.app',
    coupon: 'WELCOME10',
    year: new Date().getFullYear(),
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    ...vars,
  };

  let result = template;
  for (const [key, val] of Object.entries(extendedVars)) {
    const safeVal = val !== undefined && val !== null ? String(val) : '';
    const curlyRegex = new RegExp(`\\{\\s*${key}\\s*\\}`, 'gi');
    const squareRegex = new RegExp(`\\[\\s*${key}\\s*\\]`, 'gi');
    result = result.replace(curlyRegex, safeVal).replace(squareRegex, safeVal);
  }
  return result;
}

/**
 * Dispatches automated message via Open-WA API (https://www.open-wa.org/)
 * Falls back safely to direct WhatsApp Web URL / logging if Open-WA service is offline
 */
export async function sendOpenWaMessage({
  phone,
  text,
}: {
  phone: string;
  text: string;
}): Promise<WhatsAppMessageResult> {
  const { digits, chatId } = formatWhatsAppChatId(phone);
  const directWaLink = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;

  if (!digits || digits.length < 10) {
    return {
      success: false,
      senderPhone: WHATSAPP_SENDER_PHONE,
      recipientPhone: phone,
      chatId,
      personalizedText: text,
      provider: 'open-wa',
      error: 'Invalid recipient phone number',
      directWaLink,
    };
  }

  // 1. Check for Meta WhatsApp Cloud API (Native Serverless REST API for Vercel)
  const metaToken = process.env.WHATSAPP_CLOUD_TOKEN || process.env.WHATSAPP_TOKEN;
  const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (metaToken && metaPhoneId) {
    try {
      const res = await fetch(`https://graph.facebook.com/v18.0/${metaPhoneId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${metaToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: digits,
          type: 'text',
          text: { preview_url: true, body: text },
        }),
      });
      const data = await res.json();
      if (res.ok && data?.messages?.[0]?.id) {
        return {
          success: true,
          messageId: data.messages[0].id,
          senderPhone: WHATSAPP_SENDER_PHONE,
          recipientPhone: digits,
          chatId,
          personalizedText: text,
          provider: 'meta-cloud-api',
          directWaLink,
        };
      }
    } catch (err: any) {
      console.warn('[Meta WhatsApp Cloud API Error]:', err?.message);
    }
  }

  const openWaUrl = process.env.OPENWA_API_URL || 'http://localhost:8080';
  const openWaKey = process.env.OPENWA_API_KEY || '';

  // 2. Attempt dispatch via Open-WA REST API service
  try {
    const endpoints = [
      `${openWaUrl.replace(/\/+$/, '')}/sendText`,
      `${openWaUrl.replace(/\/+$/, '')}/api/sendText`,
    ];

    let lastError: string | null = null;
    let delivered = false;
    let messageId: string | undefined;

    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (openWaKey) {
          headers['api_key'] = openWaKey;
          headers['Authorization'] = `Bearer ${openWaKey}`;
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            chatId,
            to: chatId,
            text,
            content: text,
            from: WHATSAPP_SENDER_PHONE,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          delivered = true;
          messageId = data?.response || data?.id || data?.messageId || 'open-wa-ok';
          break;
        } else {
          lastError = `Open-WA status ${res.status}: ${res.statusText}`;
        }
      } catch (err: any) {
        lastError = err?.message || 'Open-WA server connection error';
      }
    }

    if (delivered) {
      return {
        success: true,
        messageId,
        senderPhone: WHATSAPP_SENDER_PHONE,
        recipientPhone: digits,
        chatId,
        personalizedText: text,
        provider: 'open-wa',
        directWaLink,
      };
    }

    // Unconnected / Simulated mode (QR code not scanned or server offline)
    console.log(`[WhatsApp Automated Dispatch from ${WHATSAPP_SENDER_PHONE}] (Gateway offline/unlinked) To: ${digits}\nMessage:\n${text}`);
    return {
      success: false,
      messageId: 'simulated-' + Date.now(),
      senderPhone: WHATSAPP_SENDER_PHONE,
      recipientPhone: digits,
      chatId,
      personalizedText: text,
      provider: 'simulated',
      error: lastError || 'Open-WA WhatsApp gateway is not linked yet. Scan the QR code or click Direct WA.',
      directWaLink,
    };
  } catch (err: any) {
    return {
      success: false,
      messageId: 'simulated-' + Date.now(),
      senderPhone: WHATSAPP_SENDER_PHONE,
      recipientPhone: digits,
      chatId,
      personalizedText: text,
      provider: 'fallback',
      error: err?.message,
      directWaLink,
    };
  }
}

/**
 * Checks connectivity status of Open-WA server
 */
export async function getWhatsAppStatus(): Promise<{
  connected: boolean;
  senderPhone: string;
  serviceUrl: string;
  error?: string;
  info?: any;
}> {
  const openWaUrl = process.env.OPENWA_API_URL || 'http://localhost:8080';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${openWaUrl.replace(/\/+$/, '')}/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        connected: data?.connected !== false,
        senderPhone: WHATSAPP_SENDER_PHONE,
        serviceUrl: openWaUrl,
        info: data,
      };
    }

    return {
      connected: false,
      senderPhone: WHATSAPP_SENDER_PHONE,
      serviceUrl: openWaUrl,
      error: `Open-WA server responded with ${res.status}`,
    };
  } catch (err: any) {
    return {
      connected: false,
      senderPhone: WHATSAPP_SENDER_PHONE,
      serviceUrl: openWaUrl,
      error: err?.message || 'Open-WA server unreachable',
    };
  }
}

/**
 * Sends personalized welcome WhatsApp message to new customer
 */
export async function sendPersonalizedWelcomeWhatsApp({
  name,
  phone,
}: {
  name: string;
  phone: string;
}): Promise<WhatsAppMessageResult> {
  const personalizedText = personalizeMessage(WELCOME_MESSAGE_TEMPLATE, {
    name: name?.trim() || 'Valued Patron',
  });

  return sendOpenWaMessage({
    phone,
    text: personalizedText,
  });
}
