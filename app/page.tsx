import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import VideoReelsSection from '../components/VideoReelsSection';
import OceanicCollection from '../components/OceanicCollection';
import FloralCollection from '../components/FloralCollection';
import DiscoveryBanner from '../components/DiscoveryBanner';
import TickerMarquee from '../components/TickerMarquee';
import RoyalOudCollection from '../components/RoyalOudCollection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PressSection from '../components/PressSection';
import SocialFeedSection from '../components/SocialFeedSection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';

import { client } from '../sanity/lib/client';
import {
  productsQuery,
  heroSlidesQuery,
  siteSettingsQuery,
  videoReelsQuery,
  promoBannersQuery,
  whyChooseUsQuery,
  testimonialsQuery,
  pressLogosQuery,
} from '../sanity/lib/queries';

export const revalidate = 30; // Revalidate content every 30s for Sanity CMS updates

async function getPageData() {
  try {
    const [
      products,
      heroSlides,
      siteSettings,
      videoReels,
      promoBanner,
      whyChooseUs,
      testimonials,
      pressLogos,
    ] = await Promise.all([
      client.fetch(productsQuery),
      client.fetch(heroSlidesQuery),
      client.fetch(siteSettingsQuery),
      client.fetch(videoReelsQuery),
      client.fetch(promoBannersQuery),
      client.fetch(whyChooseUsQuery),
      client.fetch(testimonialsQuery),
      client.fetch(pressLogosQuery),
    ]);

    return {
      products: products || [],
      heroSlide: heroSlides && heroSlides.length > 0 ? heroSlides[0] : null,
      siteSettings: siteSettings || null,
      videoReels: videoReels || [],
      promoBanner: promoBanner || null,
      whyChooseUs: whyChooseUs || null,
      testimonials: testimonials || [],
      pressLogos: pressLogos || [],
    };
  } catch (error) {
    // If Sanity is not connected or fetching fails, graceful fallbacks kick in inside components
    return {
      products: [],
      heroSlide: null,
      siteSettings: null,
      videoReels: [],
      promoBanner: null,
      whyChooseUs: null,
      testimonials: [],
      pressLogos: [],
    };
  }
}

export default async function HomePage() {
  const {
    products,
    heroSlide,
    siteSettings,
    videoReels,
    promoBanner,
    whyChooseUs,
    testimonials,
    pressLogos,
  } = await getPageData();

  return (
    <div className="page-wrapper">
      {/* 1. Header & Announcement Bar */}
      <Navbar
        announcementText={siteSettings?.announcementBarText}
        brandName={siteSettings?.brandName}
      />

      {/* 2. Main Hero Section */}
      <HeroSection hero={heroSlide} />

      {/* 3. Section 2: Trending Fragrance Video Reels */}
      <VideoReelsSection reels={videoReels} />

      {/* 4. Section 3: Oceanic & Fresh Blends Collection */}
      <OceanicCollection products={products} />

      {/* 5. Section 4: Blossom & Velvet Rose Collection */}
      <FloralCollection products={products} />

      {/* 6. Section 5: Discovery Set Promotional Banner */}
      <DiscoveryBanner banner={promoBanner} />

      {/* 7. Section 6: Animated Scrolling Marquee Ticker */}
      <TickerMarquee />

      {/* 8. Section 7: Royal Oud & Amber Collection */}
      <RoyalOudCollection products={products} />

      {/* 9. Section 8: Why Choose Noor-E-Flames Feature Grid */}
      <WhyChooseUsSection data={whyChooseUs} />

      {/* 10. Section 9: Customer Reviews & Video Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 11. Section 10: As Featured In Press Logos */}
      <PressSection logos={pressLogos} />

      {/* 12. Section 11: Instagram / Social Gallery */}
      <SocialFeedSection />

      {/* 13. Section 12: Newsletter Envelope Subscription */}
      <NewsletterSection />

      {/* 14. Section 13: Luxury Footer */}
      <Footer />
    </div>
  );
}
