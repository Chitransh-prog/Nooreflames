import type { Metadata, Viewport } from 'next';
import './globals.css';
import './commerce.css';
import './pdp.css';
import './legal.css';
import './category.css';
import Providers from '../components/Providers';
import { getStoreDataAsync } from '../lib/store';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooreflames.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#121212',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NOOR-E-FLAMES — Luxury Perfumes, Sculptural Candles, Royal Ouds & Pure Attars',
    template: '%s | NOOR-E-FLAMES',
  },
  description:
    'Discover NOOR-E-FLAMES — India’s luxury fragrance atelier. Shop long-lasting 20% Eau de Parfum perfumes, handcrafted 100% soy wax candles with secret message reveals, rare aged Cambodian ouds, and pure alcohol-free botanical attars.',
  keywords: [
    'noor-e-flames',
    'noor e flames',
    'nooreflames',
    'noor-e-flame',
    'perfumes',
    'luxury perfumes',
    'eau de parfum',
    'long lasting perfumes',
    'niche perfumes india',
    'buy perfume online',
    'candles',
    'scented candles',
    'soy wax candles',
    'secret message candle',
    'dessert candles',
    'handcrafted candles',
    'sculptural candles',
    'ouds',
    'royal oud',
    'oud perfume',
    'cambodian oud',
    'agarwood perfume',
    'oud and amber',
    'attars',
    'pure attars',
    'alcohol free attars',
    'perfume oils',
    'traditional attars india',
    'handcrafted luxury fragrance',
  ],
  authors: [{ name: 'NOOR-E-FLAMES Atelier', url: SITE_URL }],
  creator: 'NOOR-E-FLAMES',
  publisher: 'NOOR-E-FLAMES',
  category: 'Luxury Fragrance & Scented Candles',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'NOOR-E-FLAMES',
    title: 'NOOR-E-FLAMES — Luxury Perfumes, Sculptural Candles, Royal Ouds & Pure Attars',
    description:
      'Immerse in handcrafted luxury perfumes with 20% EDP concentration, secret message soy candles, royal ouds, and pure alcohol-free attars. Where fragrance meets flames.',
    images: [
      {
        url: '/images/hero/hero-candle.jpg',
        width: 1200,
        height: 630,
        alt: 'NOOR-E-FLAMES — Luxury Perfumes, Scented Candles, Ouds & Attars',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOOR-E-FLAMES — Luxury Perfumes, Candles, Ouds & Attars',
    description:
      'Shop NOOR-E-FLAMES luxury perfumes, handcrafted soy wax candles, royal ouds, and pure attars.',
    images: ['/images/hero/hero-candle.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await getStoreDataAsync();

  // Organization + WebSite + Store JSON-LD schemas
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'NOOR-E-FLAMES',
    alternateName: ['Noor-e-Flames', 'Nooreflames', 'Noor E Flames', 'Noor-E-Flames Atelier'],
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description:
      'India’s luxury fragrance atelier crafting long-lasting 20% Eau de Parfum perfumes, artisanal alcohol-free attars, royal ouds, and handcrafted 100% botanical soy wax candles.',
    email: store.siteSettings?.email || 'nooreflames@gmail.com',
    telephone: store.siteSettings?.phone || '+91 83682 91472',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New Delhi',
      postalCode: '110043',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.instagram.com/nooreflames',
      'https://www.linkedin.com/company/nooreflames',
      'https://facebook.com/nooreflames',
      'https://youtube.com/@nooreflames',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'NOOR-E-FLAMES',
    description: 'Luxury Perfumes, Sculptural Soy Candles, Royal Ouds & Pure Attars',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${SITE_URL}/#store`,
    name: 'NOOR-E-FLAMES Atelier',
    image: `${SITE_URL}/images/hero/hero-candle.jpg`,
    url: SITE_URL,
    telephone: store.siteSettings?.phone || '+91 83682 91472',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, UPI, Net Banking, Razorpay',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'New Delhi',
      addressLocality: 'New Delhi',
      postalCode: '110043',
      addressCountry: 'IN',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'NOOR-E-FLAMES Olfactory Collections',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Luxury Perfumes (20% Eau De Parfum)',
          url: `${SITE_URL}/category/perfumes`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Handcrafted Soy Wax Candles & Secret Message Candles',
          url: `${SITE_URL}/category/candles`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Royal Ouds & Cambodian Agarwood Blends',
          url: `${SITE_URL}/category/ouds`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Artisanal Pure Attars (100% Alcohol-Free)',
          url: `${SITE_URL}/category/attars`,
        },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
      </head>
      <body>
        <Providers coupons={store.coupons}>{children}</Providers>
      </body>
    </html>
  );
}
