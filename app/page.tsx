import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import VideoReelsSection from '../components/VideoReelsSection';
import ProductCollection from '../components/ProductCollection';
import RoyalOudCollection from '../components/RoyalOudCollection';
import AttarCollection from '../components/AttarCollection';
import DiscoveryBanner from '../components/DiscoveryBanner';
import CandleCollection from '../components/CandleCollection';
import FloralCollection from '../components/FloralCollection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import BlogsSection from '../components/BlogsSection';
import AboutUsSection from '../components/AboutUsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';
import { getStoreDataAsync } from '../lib/store';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const store = await getStoreDataAsync();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nooreflames.com';

  // ItemList schema highlighting key creations across Perfumes, Candles, Ouds & Attars
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'NOOR-E-FLAMES Bestselling Perfumes, Candles, Ouds & Attars',
    description: 'Explore the definitive artisanal collection of luxury perfumes, soy candles, royal ouds, and pure attars.',
    numberOfItems: store.products.length,
    itemListElement: store.products.slice(0, 15).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        description: product.subtitle || product.shortDescription,
        image: product.image.startsWith('http') ? product.image : `${siteUrl}${product.image}`,
        url: `${siteUrl}/product/${product.slug || product.id}`,
        sku: product.sku || product.id,
        brand: {
          '@type': 'Brand',
          name: 'NOOR-E-FLAMES',
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.price,
          availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      },
    })),
  };

  return (
    <div className="page-wrapper" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* 1. Header & Announcement Bar */}
      <Navbar
        announcements={store.siteSettings.announcements}
        brandName={store.siteSettings.brandName}
      />

      {/* 2. Main Full-Bleed Cinematic Hero Section */}
      <HeroSection
        hero={{
          title: store.hero.headline,
          tagline: store.hero.subtitle,
          buttonText: store.hero.primaryCtaText,
          buttonLink: store.hero.primaryCtaLink,
          secondaryCtaText: store.hero.secondaryCtaText,
          secondaryCtaLink: store.hero.secondaryCtaLink,
          desktopImage: '/images/hero/hero-stone-bottle.jpg',
          video: store.hero.video,
          mediaType: store.hero.mediaType,
          videoPlaylist: store.hero.videoPlaylist,
        }}
      />

      {/* 3. Section 2: People's Choice - Watch, Discover & Shop (Autoplaying Video Carousel) */}
      <VideoReelsSection />

      {/* 4. Section 3: Master Olfactory Showcase (All Creations / Interactive Category Switcher) */}
      <ProductCollection products={store.products} />

      {/* 5. Section 4: Haute Parfumerie · Signature 20% Eau de Parfum Flacons (Large Towering Cards) */}
      <RoyalOudCollection products={store.products} />

      {/* 6. Section 5: Pure Artisanal Attars & Crystal Flacons (100% Alcohol-Free Concentrated Oils) */}
      <AttarCollection products={store.products} />

      {/* 7. Section 6: Signature Rose Pink Banner ("Scented With Love, Wrapped in Comfort") */}
      <DiscoveryBanner initialData={store.discoveryBanner} />

      {/* 8. Section 7: Sculptural & Secret Message Candle Atelier (Hand-Poured Soy Candles) */}
      <CandleCollection products={store.products} />

      {/* 10. Section 9: Blossom & Velvet Rose Notes Spotlight */}
      <FloralCollection products={store.products} />

      {/* 11. Section 10: Why Choose NOOR - E - FLAMES (Golden Flame Banner + 7 Icons) */}
      <WhyChooseUsSection />

      {/* 12. Section 11: Chronicles & Atelier Journal (Blogs) */}
      <BlogsSection />

      {/* 13. Section 12: About Us (The Atelier Story) */}
      <AboutUsSection />

      {/* 14. Section 13: Voices of NOOR - E - FLAMES (Customer Reviews & Photos) */}
      <TestimonialsSection />

      {/* 15. Minimalist Luxury Black Footer */}
      <Footer />
    </div>
  );
}
