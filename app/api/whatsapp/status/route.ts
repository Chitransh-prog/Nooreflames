import { NextResponse } from 'next/server';
import { getWhatsAppStatus, WHATSAPP_SENDER_PHONE } from '@/lib/whatsapp';
import { getStoreDataAsync, saveStoreData } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const store = await getStoreDataAsync().catch(() => null);
    const status = await getWhatsAppStatus().catch(() => ({
      connected: false,
      senderPhone: WHATSAPP_SENDER_PHONE,
      serviceUrl: process.env.OPENWA_API_URL || 'https://nooreflames.onrender.com',
    }));

    const liveNumber =
      (status as any)?.info?.senderPhone ||
      status?.senderPhone ||
      store?.siteSettings?.whatsappPhone ||
      store?.siteSettings?.phone ||
      process.env.WHATSAPP_SENDER_PHONE ||
      '+918368291472';

    return NextResponse.json({
      success: true,
      ...status,
      senderPhone: liveNumber,
      gatewayUrl: process.env.OPENWA_API_URL || 'https://nooreflames.onrender.com',
      adminUrl: 'https://nooreflames.vercel.app/admin',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        connected: false,
        senderPhone: process.env.WHATSAPP_SENDER_PHONE || '+918368291472',
        gatewayUrl: process.env.OPENWA_API_URL || 'https://nooreflames.onrender.com',
        error: error?.message || 'Failed to check WhatsApp status',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPhone = String(body?.senderPhone || '').trim();

    if (newPhone) {
      const store = await getStoreDataAsync();
      const updatedSiteSettings = {
        ...(store?.siteSettings || {}),
        whatsappPhone: newPhone,
        phone: newPhone,
      };

      await saveStoreData({
        ...store,
        siteSettings: updatedSiteSettings,
      });

      return NextResponse.json({
        success: true,
        message: 'WhatsApp sender phone updated successfully',
        senderPhone: newPhone,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Missing senderPhone in request body' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update phone' },
      { status: 500 }
    );
  }
}
