import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Fragrances & Candles | NOOR-E-FLAMES',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
