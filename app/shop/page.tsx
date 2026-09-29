import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CollectionsDirectoryView from '@/components/collections/CollectionsDirectoryView';
import { getAllCategories } from '@/lib/categories';
import { getStoreData } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Shop All Fragrance & Candle Collections — NOOR-E-FLAMES',
  description:
    'Explore all NOOR-E-FLAMES luxury collections: Men’s Extraits, Women’s Haute Parfumerie, Artisanal Gift Shop, and Signature Discovery Sets.',
  openGraph: {
    title: 'Shop All Signature Collections | NOOR-E-FLAMES Atelier',
    description:
      'Immerse in pure botanical extraits, artisanal alcohol-free attars, and hand-poured sculptural candles.',
    images: [{ url: '/images/hero/hero-stone-bottle.jpg' }],
  },
};

export const dynamic = 'force-dynamic';

export default function ShopPage() {
  const store = getStoreData();
  const categories = getAllCategories();

  return (
    <div className="collections-page-wrapper">
      <Navbar
        announcements={store.siteSettings.announcements}
        brandName={store.siteSettings.brandName}
      />
      <main>
        <CollectionsDirectoryView categories={categories} allProducts={store.products} />
      </main>
      <Footer />
    </div>
  );
}
