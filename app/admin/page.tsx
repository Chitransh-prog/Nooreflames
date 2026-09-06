import React from 'react';
import AdminClient from './AdminClient';
import { getStoreData } from '@/lib/store';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Commerce Hub — Executive Dashboard | NOOR-E-FLAMES',
  description: 'Manage store catalog, customer orders, shipments, banners and promotional codes.',
};

export default function AdminPage() {
  const store = getStoreData();
  return <AdminClient initialData={store} />;
}
