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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
              *, *::before, *::after {
                box-sizing: border-box;
              }
              html {
                overflow-x: hidden;
                width: 100%;
                max-width: 100vw;
                -webkit-text-size-adjust: 100%;
                text-size-adjust: 100%;
              }
              body {
                margin: 0;
                padding: 0;
                width: 100%;
                max-width: 100vw;
                background-color: #121212;
                color: #ffffff;
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                -webkit-font-smoothing: antialiased;
                overflow-x: hidden;
                position: relative;
                min-height: 100vh;
                min-height: 100dvh;
              }
              img, video {
                max-width: 100%;
                height: auto;
              }
              input, select, textarea, button {
                font-family: inherit;
              }
              .announcement-bar {
                overflow: hidden !important;
                white-space: nowrap !important;
                display: flex !important;
                width: 100% !important;
                max-width: 100vw !important;
                box-sizing: border-box !important;
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
