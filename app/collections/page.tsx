import React from 'react';
import { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CollectionsDirectoryView from '../../components/collections/CollectionsDirectoryView';
import { getAllCategories } from '../../lib/categories';
import { getStoreDataAsync } from '../../lib/store';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooreflames.com';

export const metadata: Metadata = {
  title: 'Luxury Perfumes, Soy Candles, Royal Ouds & Attar Collections | NOOR-E-FLAMES',
  description:
    'Discover NOOR-E-FLAMES signature collections: Luxury Perfumes, Sculptural Scented Soy Candles, Royal Cambodian Ouds, Pure Artisanal Attars, and Discovery Sets.',
  keywords: [
    'noor-e-flames',
    'noor e flames',
    'nooreflames',
    'perfumes',
    'candles',
    'ouds',
    'attars',
    'fragrance collections',
    'scented candle gift sets',
    'luxury oud collection',
    'pure attars india',
  ],
  alternates: {
    canonical: `${siteUrl}/collections`,
  },
  openGraph: {
    title: 'Luxury Fragrance & Candle Collections | NOOR-E-FLAMES Atelier',
    description:
      'Immerse in pure botanical perfumes, artisanal alcohol-free attars, and hand-poured sculptural candles.',
    url: `${siteUrl}/collections`,
    siteName: 'NOOR-E-FLAMES',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: `${siteUrl}/images/hero/hero-candle.jpg` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Collections | NOOR-E-FLAMES',
    description: 'Perfumes, scented candles, royal ouds, and artisanal attars.',
    images: [`${siteUrl}/images/hero/hero-candle.jpg`],
  },
};

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
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
