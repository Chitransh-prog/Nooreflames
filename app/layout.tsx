import type { Metadata, Viewport } from 'next';
import './globals.css';
import './commerce.css';
import './pdp.css';
import './legal.css';
import Providers from '../components/Providers';
import { getStoreData } from '../lib/store';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = getStoreData();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Montserrat:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers coupons={store.coupons}>{children}</Providers>
      </body>
    </html>
  );
}
