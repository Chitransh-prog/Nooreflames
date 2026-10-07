import { NextResponse } from 'next/server';
import { sendOpenWaMessage, personalizeMessage, WELCOME_MESSAGE_TEMPLATE, ORDER_CONFIRMATION_TEMPLATE } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, name, type, customText, templateVars } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Recipient phone number is required' },
        { status: 400 }
      );
    }

    const recipientName = (name || templateVars?.name || '').trim() || 'Valued Patron';
    const allVars: Record<string, string | number | undefined | null> = {
      name: recipientName,
      customerName: recipientName,
      ...(templateVars || {}),
    };

    let messageText = '';

    if (type === 'welcome' && !customText) {
      messageText = personalizeMessage(WELCOME_MESSAGE_TEMPLATE, allVars);
    } else if (type === 'order' && !customText) {
      messageText = personalizeMessage(ORDER_CONFIRMATION_TEMPLATE, {
        name: recipientName,
        orderId: templateVars?.orderId || '',
        itemsSummary: templateVars?.itemsSummary || '',
        totalAmount: templateVars?.totalAmount || '0',
        codBreakdown: templateVars?.codBreakdown || '',
        address: templateVars?.address || '',
        pincode: templateVars?.pincode || '',
      });
    } else if (customText) {
      // Always personalize custom text so {name} or [name] becomes recipientName
      messageText = personalizeMessage(customText, allVars);
    } else {
      messageText = personalizeMessage(WELCOME_MESSAGE_TEMPLATE, allVars);
    }

    const result = await sendOpenWaMessage({
      phone,
      text: messageText,
    });

    return NextResponse.json({
      success: result.success,
      result,
      message: result.success
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
