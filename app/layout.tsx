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
        <style
          dangerouslySetInnerHTML={{
            __html: `
              *, *::before, *::after { box-sizing: border-box; }
              html, body {
                margin: 0;
                padding: 0;
                background-color: #121212;
                color: #ffffff;
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                -webkit-font-smoothing: antialiased;
                overflow-x: hidden;
              }
              .announcement-bar {
                overflow: hidden !important;
                white-space: nowrap !important;
                display: flex !important;
                width: 100% !important;
              }
              .announcement-marquee {
                display: flex !important;
                width: max-content !important;
                flex-shrink: 0 !important;
                white-space: nowrap !important;
              }
              .announcement-marquee-content {
                display: flex !important;
                align-items: center !important;
                white-space: nowrap !important;
                flex-shrink: 0 !important;
              }
              @media (max-width: 900px) {
                .desktop-nav {
                  display: none !important;
                }
              }
            `,
          }}
        />
      </head>
      <body>
        <Providers coupons={store.coupons}>{children}</Providers>
      </body>
    </html>
  );
}
