import React from 'react';
import fs from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';
import { getStoreDataAsync } from '@/lib/store';
import { getAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Commerce Hub — Executive Dashboard | NOOR-E-FLAMES',
  description: 'Manage store catalog, customer orders, shipments, banners, team roles and promotional codes.',
};

function getLiveEnvPhone(): string {
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
  return process.env.WHATSAPP_SENDER_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_SENDER_PHONE || '+918368291472';
}

export default async function AdminPage() {
  const session = getAdminSession();

  if (!session.authenticated) {
    redirect('/admin/login');
  }

  const store = await getStoreDataAsync();
  const envPhone = getLiveEnvPhone();

  return <AdminClient initialData={store} currentUser={session.user} envSenderPhone={envPhone} />;
}
