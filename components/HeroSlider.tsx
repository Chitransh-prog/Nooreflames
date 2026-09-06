import React from 'react';
import Link from 'next/link';
import { urlForImage } from '../lib/image';

interface HeroSlideData {
  title?: string;
  tagline?: string;
  buttonText?: string;
  buttonLink?: string;
  desktopImage?: any;
  mobileImage?: any;
}

export default function HeroSlider({ slides }: { slides?: HeroSlideData[] }) {
  const currentSlide = slides && slides.length > 0 ? slides[0] : {
    title: 'Where Fragrance Meets Flames',
    tagline: 'Long-lasting luxury perfumes, artisanal attars & handcrafted soy candles.',
    buttonText: 'EXPLORE COLLECTION',
    buttonLink: '#edps',
  };

  const bgImageUrl = currentSlide.desktopImage
    ? urlForImage(currentSlide.desktopImage).url()
    : null;

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: bgImageUrl
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${bgImageUrl}')`
          : `radial-gradient(ellipse at center, #2e1d17 0%, #121212 100%)`,
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title font-serif">{currentSlide.title}</h1>
        <p className="hero-tagline">{currentSlide.tagline}</p>
        <Link href={currentSlide.buttonLink || '#edps'} className="btn-primary">
          {currentSlide.buttonText || 'EXPLORE COLLECTION'}
        </Link>
      </div>
    </section>
  );
}

