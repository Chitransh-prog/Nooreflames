import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import VideoReelsSection from '../components/VideoReelsSection';
import ProductCollection from '../components/ProductCollection';
import DiscoveryBanner from '../components/DiscoveryBanner';
import RoyalOudCollection from '../components/RoyalOudCollection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';
import { getStoreData } from '../lib/store';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const store = getStoreData();

  return (
    <div className="page-wrapper" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
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

      {/* 4. Section 3 & 4: Curated Showcase (3 Cards) & Sculptural Collection (4 Cards) */}
      <ProductCollection products={store.products} />

      {/* 5. Section 5: Signature Rose Pink Banner ("Scented With Love, Wrapped in Comfort") */}
      <DiscoveryBanner initialData={store.discoveryBanner} />

      {/* 6. Section 6: Curated Signature Fragrances Row (4 Bottles) */}
      <RoyalOudCollection products={store.products} />

      {/* 7. Section 7: Why Choose NOOR - E - FLAMES (Golden Flame Banner + 7 Icons) */}
      <WhyChooseUsSection />

      {/* 8. Section 8: Voices of NOOR - E - FLAMES (2 Quote Cards + 2 Customer Photos) */}
      <TestimonialsSection />

      {/* 9. Section 9: Minimalist Luxury Black Footer */}
      <Footer />
    </div>
  );
}
