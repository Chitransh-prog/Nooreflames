import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooreflames.com';

export const metadata: Metadata = {
  title: 'Atelier Stories & Fragrance Journal | NOOR-E-FLAMES',
  description:
    'Discover stories on artisanal perfumery, clean soy candle care, royal oud origins, and rare hydro-distilled attars by NOOR-E-FLAMES Atelier.',
  keywords: [
    'noor-e-flames',
    'perfumes blog',
    'candle care rituals',
    'scented candles',
    'oud perfumes guide',
    'pure attars',
    'fragrance blog india',
  ],
  alternates: {
    canonical: `${siteUrl}/blogs`,
  },
  openGraph: {
    title: 'Atelier Stories & Fragrance Journal | NOOR-E-FLAMES',
    description:
      'Immerse in the sensory art of botanical perfumery, soy candle rituals, and Indian fragrance heritage.',
    url: `${siteUrl}/blogs`,
    siteName: 'NOOR-E-FLAMES',
    images: [{ url: `${siteUrl}/images/hero/hero-candle.jpg` }],
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
