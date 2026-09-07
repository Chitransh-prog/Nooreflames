'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useVisualEdit } from '@/context/VisualEditContext';
import { CreativeSlideData } from '@/lib/store';

const defaultSlides: CreativeSlideData[] = [
  {
    id: 'slide-her',
    badge: 'DISCOVERY SET · FOR HER',
    title: 'Scented Across Four Moods',
    subtitle: 'DISCOVER YOUR FAVOURITES',
    description: 'Love Letters, Summer Afternoons, Wine Tasting & Red Flag.',
    desktopImage: '/images/creatives/noor-discovery-her.jpg',
    mobileImage: '/images/creatives/noor-discovery-her-mobile.jpg',
    buttonText: 'EXPLORE DISCOVERY SET — ₹999',
    buttonLink: '#edps',
    tag: 'BESTSELLER',
    themeColor: '#d67d73',
  },
  {
    id: 'slide-him',
    badge: 'DISCOVERY SET · FOR HIM',
    title: 'Built For Every Version Of You',
    subtitle: 'TRY THEM ALL BEFORE YOU DECIDE',
    description: 'Dive Club, Oak & Smoke, Off The Grid & After Hours.',
    desktopImage: '/images/creatives/noor-discovery-him.jpg',
    mobileImage: '/images/creatives/noor-discovery-him-mobile.jpg',
    buttonText: 'EXPLORE FOR HIM — ₹999',
    buttonLink: '#edps',
    tag: 'NEW ARRIVAL',
    themeColor: '#4f7285',
  },
  {
    id: 'slide-dual',
    badge: 'THE COMPLETE ATELIER SET',
    title: 'Find Your Signature Scent',
    subtitle: 'ONE DISCOVERY SET. ENDLESS IMPRESSIONS.',
    description: 'Experience all 8 master extraits across moods and moments.',
    desktopImage: '/images/creatives/noor-discovery-dual.jpg',
    mobileImage: '/images/creatives/noor-discovery-dual-mobile.jpg',
    buttonText: 'SHOP BOTH SETS — ₹1,799',
    buttonLink: '#edps',
    tag: 'LUXURY VALUE',
    themeColor: '#3d3a36',
  },
  {
    id: 'slide-citrus',
    badge: 'GENDER NEUTRAL PARFUM',
    title: 'Wear It Your Way',
    subtitle: 'SKIP THE LABELS · SUMMER AFTERNOONS',
    description: 'Sunlit citrus & sparkling bergamot bottled in sheer extrait.',
    desktopImage: '/images/creatives/noor-citrus-summer.jpg',
    mobileImage: '/images/creatives/noor-citrus-summer.jpg',
    buttonText: 'SHOP SUMMER AFTERNOONS — ₹1,499',
    buttonLink: '#edps',
    tag: 'FRESH CITRUS',
    themeColor: '#e07a2c',
  },
  {
    id: 'slide-rose',
    badge: 'ROMANTIC EXTRAIT COLLECTION',
    title: 'Scented With Roses',
    subtitle: 'WRAPPED IN LOVE · VELVET DAMASCENA',
    description: 'Velvet Damascena rose petals steeped in rich golden amber.',
    desktopImage: '/images/creatives/noor-rose-love.jpg',
    mobileImage: '/images/creatives/noor-rose-love-mobile.jpg',
    buttonText: 'EXPLORE VELVET ROSE — ₹1,499',
    buttonLink: '#candles',
    tag: 'ROMANTIC',
    themeColor: '#d14373',
  },
  {
    id: 'slide-ocean',
    badge: 'AQUATIC FRESH EXTRAIT',
    title: 'Smells Like A Dip In The Ocean',
    subtitle: 'COLD MARINE OZONE & DRIFTWOOD CEDAR',
    description: 'Pure cold sea breeze and marine salt for effortless freshness.',
    desktopImage: '/images/creatives/noor-ocean-dip.jpg',
    mobileImage: '/images/creatives/noor-ocean-dip-mobile.jpg',
    buttonText: 'EXPLORE DIVE CLUB — ₹1,499',
    buttonLink: '#edps',
    tag: 'AQUA NOIR',
    themeColor: '#1d5e82',
  },
  {
    id: 'slide-alpha',
    badge: 'INTENSE MASCULINE EXTRAIT',
    title: 'Invoke The Alpha In You',
    subtitle: 'SMOKED OAK, SPICED RUM & DARK OUD',
    description: 'Commanding sillage crafted with aged oak and royal oud.',
    desktopImage: '/images/creatives/noor-alpha-smoke.jpg',
    mobileImage: '/images/creatives/noor-alpha-smoke-mobile.jpg',
    buttonText: 'EXPLORE OAK & SMOKE — ₹1,499',
    buttonLink: '#edps',
    tag: 'ROYAL OUD',
    themeColor: '#2b2929',
  },
];

export default function DiscoveryBanner() {
  const { storeData } = useVisualEdit();
  const live = storeData?.discoveryBanner;
  const slides = live?.slides && live.slides.length > 0 ? live.slides : defaultSlides;

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-play timer (5.5s per slide), pauses on hover
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  return (
    <section
      className="creative-slider-section"
      id="discovery"
      style={{
        padding: '30px 24px 60px',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      {/* Editorial Luxury Slider Container */}
      <div
        style={{
          position: 'relative',
          borderRadius: '28px',
          overflow: 'hidden',
          background: '#0d0d0f',
          boxShadow: '0 25px 65px -12px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding Track Viewport */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: `translateX(-${activeSlide * 100}%)`,
          }}
        >
          {slides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              style={{
                minWidth: '100%',
                position: 'relative',
                display: 'block',
                cursor: 'pointer',
              }}
            >
              <Link
                href={slide.buttonLink || '#edps'}
                style={{ display: 'block', textDecoration: 'none', position: 'relative' }}
              >
                {/* Responsive Creative Banner Image */}
                <div
                  className="creative-slide-frame"
                  style={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                    backgroundColor: '#161616',
                  }}
                >
                  <picture>
                    {slide.mobileImage && (
                      <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
                    )}
                    <img
                      src={slide.desktopImage}
                      alt={`${slide.title} — ${slide.subtitle}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                      }}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </picture>

                  {/* Subtle Gradient Shadow Vignette for CTA Buttons and Badges */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.25) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Top Header Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '24px',
                      left: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      zIndex: 3,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        background: 'rgba(20, 20, 22, 0.65)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '30px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#ffffff',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      <Sparkles size={12} color="#f59e0b" />
                      {slide.badge}
                    </span>

                    {slide.tag && (
                      <span
                        style={{
                          padding: '5px 12px',
                          background: 'rgba(245, 158, 11, 0.9)',
                          color: '#1a1005',
                          borderRadius: '20px',
                          fontSize: '10px',
                          fontWeight: 800,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {slide.tag}
                      </span>
                    )}
                  </div>

                  {/* Slide Counter (Top Right) */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '24px',
                      right: '28px',
                      zIndex: 3,
                      padding: '6px 14px',
                      background: 'rgba(20, 20, 22, 0.55)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '30px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                    }}
                  >
                    0{idx + 1} / 0{slides.length}
                  </div>

                  {/* Bottom Interactive CTA Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '26px',
                      right: '28px',
                      zIndex: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 26px',
                        background: '#ffffff',
                        color: '#111111',
                        borderRadius: '30px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.45)';
                        e.currentTarget.style.background = '#f7f7f7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.35)';
                        e.currentTarget.style.background = '#ffffff';
                      }}
                    >
                      <span>{slide.buttonText || 'EXPLORE NOW'}</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Previous Slide Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous Slide"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 5,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: 'none',
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            e.currentTarget.style.background = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next Slide Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next Slide"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 5,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: 'none',
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            e.currentTarget.style.background = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Bottom Pagination Dots / Pills */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 5,
            padding: '8px 14px',
            background: 'rgba(15, 15, 18, 0.5)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {slides.map((_, dotIdx) => {
            const isActive = dotIdx === activeSlide;
            return (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(dotIdx);
                }}
                aria-label={`Jump to creative slide ${dotIdx + 1}`}
                style={{
                  width: isActive ? '32px' : '8px',
                  height: '7px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 0 10px rgba(255, 255, 255, 0.6)' : 'none',
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
