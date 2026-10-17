import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getWhatsAppStatus, WHATSAPP_SENDER_PHONE } from '@/lib/whatsapp';
import { getStoreDataAsync, saveStoreData } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

function getLiveEnvPhone(): string | null {
  try {
    const files = [
      path.resolve(process.cwd(), '.env.local'),
      path.resolve(process.cwd(), '.env'),
    ];
    for (const f of files) {
      if (fs.existsSync(f)) {
        const text = fs.readFileSync(f, 'utf8');
        for (const line of text.split('\n')) {
          const trimmed = line.trim();
          if (
            trimmed.startsWith('WHATSAPP_SENDER_PHONE=') ||
            trimmed.startsWith('NEXT_PUBLIC_WHATSAPP_SENDER_PHONE=')
          ) {
            const val = trimmed.split('=')[1]?.trim();
            if (val) return val;
          }
        }
      }
    }
  } catch (_) {}
  return null;
}

export async function GET() {
  try {
    const store = await getStoreDataAsync().catch(() => null);
    const status = await getWhatsAppStatus().catch(() => ({
      connected: false,
      senderPhone: WHATSAPP_SENDER_PHONE,
      serviceUrl: 'https://nooreflames.onrender.com',
    }));

    const fileEnv = getLiveEnvPhone();
    const liveNumber =
      fileEnv ||
      (status as any)?.info?.senderPhone ||
      status?.senderPhone ||
      process.env.WHATSAPP_SENDER_PHONE ||
      process.env.NEXT_PUBLIC_WHATSAPP_SENDER_PHONE ||
      store?.siteSettings?.whatsappPhone ||
      '+918368291472';

    return NextResponse.json({
      success: true,
      ...status,
      senderPhone: liveNumber,
      gatewayUrl: status?.serviceUrl || 'https://nooreflames.onrender.com',
      adminUrl: 'https://nooreflames.vercel.app/admin',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        connected: false,
        senderPhone: getLiveEnvPhone() || process.env.WHATSAPP_SENDER_PHONE || '+918368291472',
        gatewayUrl: 'https://nooreflames.onrender.com',
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
