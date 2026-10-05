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

    let messageText = customText || '';

    if (type === 'welcome') {
      messageText = personalizeMessage(WELCOME_MESSAGE_TEMPLATE, {
        name: name || templateVars?.name || 'Valued Patron',
      });
    } else if (type === 'order') {
      messageText = personalizeMessage(ORDER_CONFIRMATION_TEMPLATE, {
        name: name || templateVars?.name || 'Valued Patron',
        orderId: templateVars?.orderId || '',
        itemsSummary: templateVars?.itemsSummary || '',
        totalAmount: templateVars?.totalAmount || '0',
        codBreakdown: templateVars?.codBreakdown || '',
        address: templateVars?.address || '',
        pincode: templateVars?.pincode || '',
      });
    } else if (customText && templateVars) {
      messageText = personalizeMessage(customText, templateVars);
    }

    const result = await sendOpenWaMessage({
      phone,
      text: messageText,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to dispatch WhatsApp message' },
      { status: 500 }
    );
  }
}
