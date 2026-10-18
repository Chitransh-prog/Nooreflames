import type { Metadata, Viewport } from 'next';
import './globals.css';
import './commerce.css';
import './pdp.css';
import './legal.css';
import './category.css';
import Providers from '../components/Providers';
import { getStoreDataAsync } from '../lib/store';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#121212',
};

export const metadata: Metadata = {
  title: 'NOOR-E-FLAMES — Luxury EDPs, Attars & Handcrafted Soy Candles',
  description:
    'Shop NOOR-E-FLAMES long-lasting luxury perfumes, artisanal attars, and handcrafted soy candles. Where fragrance meets flames.',
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

  return (
    <html lang="en">
      <body>
        <Providers coupons={store.coupons}>{children}</Providers>
      </body>
    </html>
  );
}
