import React from 'react';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';
import { getStoreDataAsync } from '@/lib/store';
import { getAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Commerce Hub — Executive Dashboard | NOOR-E-FLAMES',
  description: 'Manage store catalog, customer orders, shipments, banners and promotional codes.',
};

export default async function AdminPage() {
  const session = getAdminSession();

  if (!session.authenticated) {
    redirect('/admin/login');
  }

  const store = await getStoreDataAsync();
  return <AdminClient initialData={store} />;
}
