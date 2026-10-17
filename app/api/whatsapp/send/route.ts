import { NextResponse } from 'next/server';
import { sendOpenWaMessage, personalizeMessage, WELCOME_MESSAGE_TEMPLATE, ORDER_CONFIRMATION_TEMPLATE } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawPhone = body.phone || body.recipient || body.chatId || '';

    if (!rawPhone) {
      return NextResponse.json(
        { success: false, message: 'Recipient phone number is required' },
        { status: 400 }
      );
    }

    const type = body.type || body.template || 'welcome';
    const customText = body.customText || body.text || body.message || '';
    const incomingVars = {
      ...(body.variables || {}),
      ...(body.templateVars || {}),
    };

    const recipientName = (body.name || incomingVars.name || '').trim() || 'Valued Patron';
    const allVars: Record<string, string | number | undefined | null> = {
      name: recipientName,
      customerName: recipientName,
      brand: 'NOOR-E-FLAMES Atelier',
      siteUrl: 'https://nooreflames.vercel.app',
      coupon: body.coupon || incomingVars.coupon || 'WELCOME10',
      ...incomingVars,
    };

    let messageText = '';

    if (customText) {
      // Always personalize custom text so {name} or [name] becomes recipientName
      messageText = personalizeMessage(customText, allVars);
    } else if (type === 'order') {
      messageText = personalizeMessage(ORDER_CONFIRMATION_TEMPLATE, {
        name: recipientName,
        orderId: incomingVars.orderId || '',
        itemsSummary: incomingVars.itemsSummary || '',
        totalAmount: incomingVars.totalAmount || '0',
        codBreakdown: incomingVars.codBreakdown || '',
        address: incomingVars.address || '',
        pincode: incomingVars.pincode || '',
      });
    } else {
      // Default to welcome template
      messageText = personalizeMessage(WELCOME_MESSAGE_TEMPLATE, allVars);
    }

    const result = await sendOpenWaMessage({
      phone: String(rawPhone),
      text: messageText,
    });

    const isLive = result.success && result.provider !== 'simulated' && result.provider !== 'fallback';

    return NextResponse.json({
      success: isLive,
      result,
      message: isLive
        ? `WhatsApp message delivered via ${result.provider}!`
        : (result.error || 'WhatsApp gateway not connected. Please scan QR or click Direct WA.')
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to dispatch WhatsApp message' },
      { status: 500 }
    );
  }
}
