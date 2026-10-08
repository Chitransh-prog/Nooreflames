import { NextResponse } from 'next/server';
import { getStoreDataAsync, saveStoreData } from '@/lib/store';
import {
  sendOpenWaMessage,
  personalizeMessage,
  formatWhatsAppChatId,
} from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/whatsapp/broadcast
 * Returns audience metrics and preview data for bulk WhatsApp broadcast
 */
export async function GET() {
  try {
    const store = await getStoreDataAsync();
    const rawCustomers: any[] = Array.isArray(store.customers) ? store.customers : [];
    const orders: any[] = Array.isArray(store.orders) ? store.orders : [];

    const phoneMap = new Map<string, any>();

    for (const c of rawCustomers) {
      let cleanPhone = String(c.phone || '').replace(/\D/g, '');
      if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(-10);
      if (cleanPhone.length === 10) {
        phoneMap.set(cleanPhone, {
          id: c.id,
          name: c.name || 'Valued Patron',
          phone: cleanPhone,
          email: c.email || '',
          createdAt: c.createdAt,
          lastBroadcastAt: c.lastBroadcastAt,
        });
      }
    }

    for (const o of orders) {
      let oPhone = String(o.phone || '').replace(/\D/g, '');
      if (oPhone.length > 10) oPhone = oPhone.slice(-10);
      if (oPhone.length === 10 && !phoneMap.has(oPhone)) {
        phoneMap.set(oPhone, {
          id: 'ord_' + o.id,
          name: o.customer || 'Valued Patron',
          phone: oPhone,
          email: o.email || '',
          createdAt: o.createdAt,
        });
      }
    }

    const eligibleList = Array.from(phoneMap.values());

    return NextResponse.json({
      success: true,
      totalRegistered: rawCustomers.length,
      eligibleRecipientsCount: eligibleList.length,
      recipients: eligibleList,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to fetch broadcast audience' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/whatsapp/broadcast
 * Dispatches personalized messages to all signed-up users (or selected subset)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      recipients: requestedRecipients,
      template,
      coupon = 'WELCOME10',
      delayMs = 800,
    } = body;

    if (!template || typeof template !== 'string' || !template.trim()) {
      return NextResponse.json(
        { success: false, message: 'Message template text is required' },
        { status: 400 }
      );
    }

    const store = await getStoreDataAsync();
    let recipientsToProcess: any[] = [];

    if (Array.isArray(requestedRecipients) && requestedRecipients.length > 0) {
      recipientsToProcess = requestedRecipients;
    } else {
      // Query all database users who signed up and provided a phone number
      const allCustomers: any[] = Array.isArray(store.customers) ? store.customers : [];
      const orders: any[] = Array.isArray(store.orders) ? store.orders : [];

      const phoneMap = new Map<string, any>();

      for (const c of allCustomers) {
        let cleanPhone = String(c.phone || '').replace(/\D/g, '');
        if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(-10);
        if (cleanPhone.length === 10) {
          phoneMap.set(cleanPhone, {
            id: c.id,
            name: c.name || 'Valued Patron',
            phone: cleanPhone,
            email: c.email || '',
            createdAt: c.createdAt,
          });
        }
      }

      for (const o of orders) {
        let oPhone = String(o.phone || '').replace(/\D/g, '');
        if (oPhone.length > 10) oPhone = oPhone.slice(-10);
        if (oPhone.length === 10 && !phoneMap.has(oPhone)) {
          phoneMap.set(oPhone, {
            id: 'ord_' + o.id,
            name: o.customer || 'Valued Patron',
            phone: oPhone,
            email: o.email || '',
            createdAt: o.createdAt,
          });
        }
      }

      recipientsToProcess = Array.from(phoneMap.values());
    }

    if (recipientsToProcess.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No recipients with valid 10-digit phone numbers found in the signed-up user database.',
        },
        { status: 400 }
      );
    }

    const results: any[] = [];
    let successfulSends = 0;
    let failedSends = 0;
    const safeDelay = Math.max(100, Math.min(Number(delayMs) || 800, 5000));
    const broadcastTimestamp = new Date().toISOString();

    for (let i = 0; i < recipientsToProcess.length; i++) {
      const recipient = recipientsToProcess[i];
      let cleanPhone = String(recipient.phone || '').replace(/\D/g, '');
      if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(-10);

      const recipientName = String(recipient.name || recipient.customerName || '').trim() || 'Valued Patron';
      const nameParts = recipientName.split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] || 'Valued Patron';

      if (!cleanPhone || cleanPhone.length !== 10) {
        failedSends++;
        results.push({
          id: recipient.id,
          name: recipientName,
          phone: recipient.phone || 'Invalid',
          success: false,
          isLiveDelivered: false,
          error: 'Invalid 10-digit phone number',
          provider: 'none',
          directWaLink: '',
          sentAt: new Date().toISOString(),
        });
        continue;
      }

      // Personalize message specifically for this user
      const personalizedText = personalizeMessage(template, {
        name: recipientName,
        customerName: recipientName,
        firstName,
        phone: cleanPhone,
        email: recipient.email || '',
        coupon: coupon || 'WELCOME10',
        brand: 'NOOR-E-FLAMES Atelier',
        siteUrl: 'https://nooreflames.vercel.app',
        ...(recipient.templateVars || {}),
      });

      // Send via Open-WA / WhatsApp Cloud API / Baileys
      const dispatchResult = await sendOpenWaMessage({
        phone: cleanPhone,
        text: personalizedText,
      });

      const isLiveDelivered =
        dispatchResult.success &&
        dispatchResult.provider !== 'simulated' &&
        dispatchResult.provider !== 'fallback';

      if (isLiveDelivered) {
        successfulSends++;
      } else {
        // Count as simulated / fallback (direct link ready)
        failedSends++;
      }

      results.push({
        id: recipient.id,
        name: recipientName,
        phone: cleanPhone,
        email: recipient.email || '',
        personalizedText,
        success: dispatchResult.success,
        isLiveDelivered,
        provider: dispatchResult.provider,
        messageId: dispatchResult.messageId,
        error: dispatchResult.error,
        directWaLink: dispatchResult.directWaLink,
        sentAt: new Date().toISOString(),
      });

      // Update customer record in store
      if (Array.isArray(store.customers)) {
        const cIdx = store.customers.findIndex(
          (c) => String(c.phone || '').replace(/\D/g, '').slice(-10) === cleanPhone
        );
        if (cIdx !== -1) {
          store.customers[cIdx].lastBroadcastAt = broadcastTimestamp;
          store.customers[cIdx].lastBroadcastMessage = personalizedText.slice(0, 120);
        }
      }

      // Delay between sends to avoid rate limiting
      if (i < recipientsToProcess.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, safeDelay));
      }
    }

    // Persist timestamp updates to store
    try {
      await saveStoreData(store);
    } catch (saveErr) {
      console.warn('Store update after broadcast non-fatal warning:', saveErr);
    }

    return NextResponse.json({
      success: true,
      totalRecipients: recipientsToProcess.length,
      successfulSends,
      failedSends,
      results,
      message: `Personalized broadcast completed for ${recipientsToProcess.length} patrons.`,
    });
  } catch (err: any) {
    console.error('Broadcast dispatch error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Server error processing broadcast' },
      { status: 500 }
    );
  }
}
