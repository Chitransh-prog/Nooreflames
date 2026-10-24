'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { EditableText } from './visual-edit/EditableElements';

export interface VideoReelItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  badge: string;
  thumbnail: string;
  videoUrl: string;
  productId: string;
}

const defaultWatchDiscoverCards: VideoReelItem[] = [
  {
    id: 'reel-1',
    title: 'Mango Berry Bliss Sundae Candle',
    subtitle: 'Organic Soy Wax • Dual Cotton Wick',
    price: 799,
    originalPrice: 1299,
    badge: 'TRENDING',
    thumbnail: '/images/Candles/Mango Berry Bliss/1.png',
    videoUrl: '/videos/hero/noor_header_hero_video.mp4',
    productId: 'prod-3',
  },
  {
    id: 'reel-2',
    title: 'Chocolate Cupcake Scented Candle',
    subtitle: 'Rich Cocoa & Sweet Vanilla',
    price: 649,
    originalPrice: 899,
    badge: 'BESTSELLER',
    thumbnail: '/images/Candles/Chocolate cupcake candle/1.png',
    videoUrl: '/videos/reels/IMG_5927.MP4',
    productId: 'prod-chocolate-cupcake',
  },
  {
    id: 'reel-3',
    title: 'Sunshine Citrus Glow Candle',
    subtitle: 'Zesty Orange & Golden Amber',
    price: 799,
    originalPrice: 1099,
    badge: 'ORGANIC SOY',
    thumbnail: '/images/creatives/noor-rose-love.jpg',
    videoUrl: '/videos/reels/IMG_5931.MP4',
    productId: 'prod-11',
  },
  {
    id: 'reel-4',
    title: 'Midnight Ocean Breeze Candle',
    subtitle: 'Sea Mineral Salt & White Cedar',
    price: 799,
    originalPrice: 1199,
    badge: 'NEW LAUNCH',
    thumbnail: '/images/Candles/Evil Eye/1.png',
    videoUrl: '/videos/hero/noor_header_hero_video.mp4',
    productId: 'prod-22',
  },
  {
    id: 'reel-5',
    title: 'Rose Whimsy Heart Candle',
    subtitle: 'Damask Rose & Vanilla Heart Melts',
    price: 599,
    originalPrice: 999,
    badge: 'FLORAL',
    thumbnail: '/images/Candles/Rose Whimpsy/1.png',
    videoUrl: '/videos/reels/IMG_5931.MP4',
    productId: 'prod-23',
  },
  {
    id: 'reel-6',
    title: 'Whispered Surprises Secret Message',
    subtitle: 'Hidden love message slowly reveals in warm wax',
    price: 999,
    originalPrice: 1200,
    badge: 'LIMITED EDITION',
    thumbnail: '/images/Candles/Whispered Surprise/1.png',
    videoUrl: '/videos/reels/IMG_5927.MP4',
    productId: 'prod-1',
  },
];

import { useVisualEdit } from '@/context/VisualEditContext';

export default function VideoReelsSection() {
  const { storeData, updateField, isEditing } = useVisualEdit();
  const [activeVideo, setActiveVideo] = useState<VideoReelItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const rawReels: VideoReelItem[] = storeData?.siteSettings?.videoReels || defaultWatchDiscoverCards;
  const reels = rawReels.map((item, idx) => ({
    ...defaultWatchDiscoverCards[idx],
    ...item,
  }));

  // Autoplay all videos in mute on mount and when visible
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = true;
        video.defaultMuted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Browser autoplay fallback if uninitiated
          });
        }
      }
    });
  }, []);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    const idx = Math.round(el.scrollLeft / width);
    setActiveSlideIndex(Math.min(Math.max(idx, 0), reels.length - 1));
  }, [reels.length]);

  // Smooth Autoplay scrolling for full-width slider (paused during visual editing)
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || isEditing) return;

    let isPaused = false;
    const onEnter = () => { isPaused = true; };
    const onLeave = () => { isPaused = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchstart', onEnter, { passive: true });
    el.addEventListener('touchend', onLeave, { passive: true });

    const timer = setInterval(() => {
      if (isPaused || !el) return;
      const isMobile = window.innerWidth <= 768;
      const step = isMobile ? el.clientWidth : 320;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 15) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3800);

    return () => {
      clearInterval(timer);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchstart', onEnter);
      el.removeEventListener('touchend', onLeave);
    };
  }, [isEditing]);

  const scrollLeft = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const isMobile = window.innerWidth <= 768;
      const step = isMobile ? el.clientWidth : 320;
      el.scrollBy({ left: -step, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const isMobile = window.innerWidth <= 768;
      const step = isMobile ? el.clientWidth : 320;
      el.scrollBy({ left: step, behavior: 'smooth' });
    }
  }, []);

  return (
    <section className="watch-discover-section" id="reels">
      <span id="watch-discover-shop" style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }} />
      <div className="watch-discover-inner">
        {/* Top Centered Header: People's choice */}
        <div className="watch-discover-top-label">
          <EditableText
            as="h2"
            value={storeData?.siteSettings?.reelsTopLabel || "People's choice"}
            fieldPath="siteSettings.reelsTopLabel"
            onValueChange={(val) => updateField('siteSettings.reelsTopLabel', val)}
            style={{
              fontFamily: "var(--font-heading-family), 'Bodoni Moda', Georgia, serif",
              fontSize: '44px',
              fontWeight: 400,
              color: '#121212',
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              textAlign: 'center',
              margin: '0 0 36px 0',
            }}
          />
        </div>

        {/* Section Header Row: Centered Subtitle and Title */}
        <div className="watch-discover-header-row" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '32px' }}>
          <div className="watch-discover-title-wrap" style={{ alignItems: 'center' }}>
            <EditableText
              as="span"
              value={storeData?.siteSettings?.reelsBadge || "CINEMATIC FRAGRANCE STORIES"}
              fieldPath="siteSettings.reelsBadge"
              onValueChange={(val) => updateField('siteSettings.reelsBadge', val)}
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#8C7355',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            />
            <EditableText
              as="h3"
              value={storeData?.siteSettings?.reelsTitle || "Watch, Discover & Shop"}
              fieldPath="siteSettings.reelsTitle"
              onValueChange={(val) => updateField('siteSettings.reelsTitle', val)}
              style={{
                fontFamily: "var(--font-heading-family), 'Bodoni Moda', Georgia, serif",
                fontSize: '40px',
                fontWeight: 400,
                color: '#121212',
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            />
          </div>
        </div>

        {/* Horizontal Carousel Track with Desktop Navigation */}
        <div className="watch-discover-carousel-wrapper" style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous Reels"
            className="watch-discover-nav-arrow prev"
            style={{
              position: 'absolute',
              left: '12px',
              top: '40%',
              transform: 'translateY(-50%)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              backdropFilter: 'blur(10px)',
              color: '#121212',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 15,
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next Reels"
            className="watch-discover-nav-arrow next"
            style={{
              position: 'absolute',
              right: '12px',
              top: '40%',
              transform: 'translateY(-50%)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              backdropFilter: 'blur(10px)',
              color: '#121212',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 15,
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronRight size={20} />
          </button>

          <div
            className="watch-discover-carousel-track no-scrollbar"
            ref={scrollContainerRef}
            onScroll={handleScroll}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              overflowX: 'auto',
            }}
          >
            {reels.map((item, idx) => (
            <div
              key={item.id || idx}
              className="watch-discover-card"
              onClick={() => {
                if (!isEditing) setActiveVideo(item);
              }}
            >
              {/* Autoplaying Video Media Container */}
              <div className="watch-discover-media">
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                    if (el) {
                      el.muted = true;
                      el.defaultMuted = true;
                      el.play().catch(() => {});
                    }
                  }}
                  src={item.videoUrl}
                  poster={item.thumbnail}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="watch-discover-video"
                />

                {/* Top-Left Category Tag */}
                <div className="watch-discover-badge">
                  <EditableText
                    as="span"
                    value={item.badge}
                    onValueChange={(val) => {
                      const updated = [...reels];
                      updated[idx] = { ...updated[idx], badge: val };
                      updateField('siteSettings.videoReels', updated);
                    }}
                  />
                </div>

                {/* Top-Right Play Overlay Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isEditing) setActiveVideo(item);
                  }}
                  aria-label={`Watch ${item.title}`}
                  className="watch-discover-play-btn"
                >
                  <Play size={12} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px' }} />
                </button>
              </div>

              {/* Bottom Card Content */}
              <div className="watch-discover-card-body">
                <div className="watch-discover-card-info">
                  <Link
                    href={`/product/${item.productId}`}
                    onClick={(e) => {
                      if (isEditing) e.preventDefault();
                      e.stopPropagation();
                    }}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <EditableText
                      as="h4"
                      value={item.title}
                      onValueChange={(val) => {
                        const updated = [...reels];
                        updated[idx] = { ...updated[idx], title: val };
                        updateField('siteSettings.videoReels', updated);
                      }}
                      className="watch-discover-card-title"
                    />
                  </Link>
                  <EditableText
                    as="p"
                    value={item.subtitle}
                    onValueChange={(val) => {
                      const updated = [...reels];
                      updated[idx] = { ...updated[idx], subtitle: val };
                      updateField('siteSettings.videoReels', updated);
                    }}
                    className="watch-discover-card-subtitle"
                  />
                </div>

                {/* Price and View Product CTA */}
                <div className="watch-discover-card-footer">
                  <div className="watch-discover-price-row">
                    <span className="watch-discover-price">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="watch-discover-original-price">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link
                    href={`/product/${item.productId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="watch-discover-view-btn"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Mobile Pagination Indicator Dots */}
          <div className="watch-discover-mobile-indicators">
            {reels.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      left: idx * scrollContainerRef.current.clientWidth,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={`watch-discover-indicator-dot ${activeSlideIndex === idx ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Full-Screen Cinematic Video Modal */}
      {activeVideo && (
        <div
          className="video-modal-backdrop"
          onClick={() => setActiveVideo(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 20, 19, 0.94)',
            backdropFilter: 'blur(14px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '440px',
              width: '100%',
              borderRadius: '20px',
              background: '#121212',
              border: '1px solid rgba(201, 147, 90, 0.4)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderBottom: '1px solid rgba(201, 147, 90, 0.2)',
                color: '#BBA58E',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em' }}>
                ✦ {activeVideo.badge} · {activeVideo.title.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close modal"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={22} />
              </button>
            </div>
            <video
              src={activeVideo.videoUrl}
              controls
              autoPlay
              playsInline
              style={{
                width: '100%',
                maxHeight: '62vh',
                objectFit: 'contain',
                display: 'block',
                background: '#000000',
              }}
            />
            <div
              style={{
                padding: '16px 20px',
                background: '#161616',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <h4
                  style={{
                    color: '#ffffff',
                    fontSize: '14.5px',
                    fontWeight: 600,
                    margin: 0,
                    marginBottom: '3px',
                  }}
                >
                  {activeVideo.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ color: '#c5a987', fontSize: '14px', fontWeight: 700 }}>
                    ₹{activeVideo.price.toLocaleString('en-IN')}
                  </span>
                  <span
                    style={{
                      color: '#888888',
                      fontSize: '11px',
                      textDecoration: 'line-through',
                    }}
                  >
                    ₹{activeVideo.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <Link
                href={`/product/${activeVideo.productId}`}
                onClick={() => setActiveVideo(null)}
                style={{
                  padding: '9px 18px',
                  background: '#ffffff',
                  color: '#121212',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                View Product
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
