import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CollectionsDirectoryView from '@/components/collections/CollectionsDirectoryView';
import { getAllCategories } from '@/lib/categories';
import { getStoreDataAsync } from '@/lib/store';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooreflames.com';

export const metadata: Metadata = {
  title: 'Shop Luxury Perfumes, Scented Soy Candles, Royal Ouds & Pure Attars | NOOR-E-FLAMES',
  description:
    'Explore handcrafted luxury perfumes, scented soy candles, royal Cambodian ouds, and artisanal alcohol-free attars at NOOR-E-FLAMES Atelier. Hand-poured with clean botanical ingredients in New Delhi.',
  keywords: [
    'noor-e-flames',
    'noor e flames',
    'nooreflames',
    'perfumes',
    'candles',
    'ouds',
    'attars',
    'luxury perfumes india',
    'scented soy candles',
    'royal oud perfumes',
    'pure attars',
    'handcrafted candles delhi',
  ],
  alternates: {
    canonical: `${siteUrl}/shop`,
  },
  openGraph: {
    title: 'Shop Luxury Perfumes, Scented Candles, Ouds & Attars | NOOR-E-FLAMES',
    description:
      'Immerse in pure botanical perfumes, artisanal alcohol-free attars, and hand-poured sculptural soy candles.',
    url: `${siteUrl}/shop`,
    siteName: 'NOOR-E-FLAMES',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: `${siteUrl}/images/hero/hero-candle.jpg` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Luxury Perfumes, Candles, Ouds & Attars | NOOR-E-FLAMES',
    description: 'Artisanal fragrances and hand-poured soy candles handcrafted in New Delhi.',
    images: [`${siteUrl}/images/hero/hero-candle.jpg`],
  },
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const store = await getStoreDataAsync();
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
