import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooreflames.com';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | NOOR-E-FLAMES Perfumes & Candles',
  description:
    'Answers to questions about NOOR-E-FLAMES artisanal perfumes, 100% pure soy candles, secret message candles, royal ouds, pure attars, delivery, and bespoke orders.',
  keywords: [
    'noor-e-flames faq',
    'candle care faq',
    'perfumes questions',
    'scented soy candles help',
    'secret message candle questions',
    'pure attars questions',
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: 'FAQ | NOOR-E-FLAMES Atelier',
    description:
      'Everything you need to know about our handcrafted perfumes, candles, ouds, and attars.',
    url: `${siteUrl}/faq`,
    siteName: 'NOOR-E-FLAMES',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a Whispered Surprises secret message candle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our Whispered Surprises candles conceal an artisanal, heat-resistant keepsake message submerged beneath the top layer of pure soy wax. As the candle burns and the molten wax turns transparent (approx. 20–30 minutes into the first burn), your hidden quote or personalized message slowly reveals itself.',
      },
    },
    {
      '@type': 'Question',
      name: 'What wax is used in NOOR-E-FLAMES candles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We use 100% pure, natural plant-based soy wax sourced ethically. Unlike commercial paraffin candles derived from petroleum, our candles produce zero toxic black soot, burn up to 50% longer, and feature unbleached, lead-free organic cotton braided wicks.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes NOOR-E-FLAMES luxury perfumes long-lasting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our perfumes are compounded at true Extrait and Haute Eau de Parfum concentrations (20% to 28% pure perfume oils) using aged Cambodian agarwood, rare florals, and premium fixatives for 10 to 14+ hours of lasting sillage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are NOOR-E-FLAMES attars 100% alcohol-free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, our artisanal attars are 100% pure, alcohol-free concentrated perfume oils traditionally hydro-distilled into pure sandalwood or botanical bases.',
      },
    },
  ],
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
