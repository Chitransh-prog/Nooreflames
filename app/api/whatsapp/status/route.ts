import { NextResponse } from 'next/server';
import { getWhatsAppStatus, WHATSAPP_SENDER_PHONE } from '@/lib/whatsapp';

export async function GET() {
  try {
    const status = await getWhatsAppStatus();
    return NextResponse.json({
      success: true,
      ...status,
      senderPhone: WHATSAPP_SENDER_PHONE,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        connected: false,
        senderPhone: WHATSAPP_SENDER_PHONE,
        error: error?.message || 'Failed to check WhatsApp status',
      },
      { status: 500 }
    );
  }
}
