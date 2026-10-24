import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooreflames.com';

export const metadata: Metadata = {
  title: 'Contact NOOR-E-FLAMES Atelier | Concierge & Bespoke Gifting',
  description:
    'Connect with NOOR-E-FLAMES Atelier in New Delhi for luxury fragrance consultations, custom secret message candle orders, bulk corporate gifting, and customer support.',
  keywords: [
    'contact noor-e-flames',
    'luxury candle custom orders',
    'perfume gifting india',
    'bespoke attars inquiry',
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Us | NOOR-E-FLAMES Atelier',
    description: 'Bespoke fragrance inquiries, wedding gifting, and customer care.',
    url: `${siteUrl}/contact`,
    siteName: 'NOOR-E-FLAMES',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
