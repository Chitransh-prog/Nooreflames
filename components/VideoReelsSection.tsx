'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, X } from 'lucide-react';
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
    thumbnail: '/images/products/teddy-bear-candle.jpg',
    videoUrl: '/videos/hero/noor_header_hero_video.mp4',
    productId: 'prod-3',
  },
  {
    id: 'reel-2',
    title: 'Chocolate Cupcake Scented Candle',
    subtitle: 'Rich Cocoa & Sweet Vanilla',
    price: 799,
    originalPrice: 1299,
    badge: 'BESTSELLER',
    thumbnail: '/images/social/candle-craft-1.jpg',
    videoUrl: '/videos/reels/IMG_5927.MP4',
    productId: 'prod-8',
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
    thumbnail: '/images/products/whispered-surprises-blue.jpg',
    videoUrl: '/videos/hero/noor_header_hero_video.mp4',
    productId: 'prod-10',
  },
  {
    id: 'reel-5',
    title: 'Rose Velvet Secret Candle',
    subtitle: 'Damask Rose & Vanilla Extract',
    price: 799,
    originalPrice: 1299,
    badge: 'FLORAL',
    thumbnail: '/images/products/rose-bear-duo.jpg',
    videoUrl: '/videos/reels/IMG_5931.MP4',
    productId: 'prod-4',
  },
  {
    id: 'reel-6',
    title: 'Whispered Surprises White',
    subtitle: 'Lead-free cotton wicks, 45+ hours clean burn',
    price: 799,
    originalPrice: 1299,
    badge: 'LIMITED EDITION',
    thumbnail: '/images/products/whispered-surprises-lavender.jpg',
    videoUrl: '/videos/reels/IMG_5927.MP4',
    productId: 'prod-1',
  },
];

export default function VideoReelsSection() {
  const [activeVideo, setActiveVideo] = useState<VideoReelItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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

  // Smooth Autoplay scrolling for full-width slider
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let isPaused = false;
    const onEnter = () => { isPaused = true; };
    const onLeave = () => { isPaused = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchstart', onEnter, { passive: true });
    el.addEventListener('touchend', onLeave, { passive: true });

    const timer = setInterval(() => {
      if (isPaused || !el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 15) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }, 3800);

    return () => {
      clearInterval(timer);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchstart', onEnter);
      el.removeEventListener('touchend', onLeave);
    };
  }, []);

  return (
    <section className="watch-discover-section" id="watch-discover-shop">
      <div className="watch-discover-inner">
        {/* Top Centered Header: People's choice */}
        <div className="watch-discover-top-label">
          <EditableText
            as="h2"
            value="People's choice"
            onValueChange={() => {}}
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

        {/* Section Header Row: Centered Subtitle and Title (Chevrons removed) */}
        <div className="watch-discover-header-row" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '32px' }}>
          <div className="watch-discover-title-wrap" style={{ alignItems: 'center' }}>
            <EditableText
              as="span"
              value="CINEMATIC FRAGRANCE STORIES"
              onValueChange={() => {}}
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
              value="Watch, Discover & Shop"
              onValueChange={() => {}}
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

        {/* Horizontal Carousel Track - Clip any scrollbar completely */}
        <div className="watch-discover-carousel-wrapper" style={{ overflow: 'hidden', width: '100%' }}>
          <div
            className="watch-discover-carousel-track no-scrollbar"
            ref={scrollContainerRef}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              overflowX: 'auto',
            }}
          >
            {defaultWatchDiscoverCards.map((item, idx) => (
            <div
              key={item.id}
              className="watch-discover-card"
              onClick={() => setActiveVideo(item)}
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
                      item.badge = val;
                    }}
                  />
                </div>

                {/* Top-Right Play Overlay Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVideo(item);
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
                    onClick={(e) => e.stopPropagation()}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <EditableText
                      as="h4"
                      value={item.title}
                      onValueChange={(val) => {
                        item.title = val;
                      }}
                      className="watch-discover-card-title"
                    />
                  </Link>
                  <EditableText
                    as="p"
                    value={item.subtitle}
                    onValueChange={(val) => {
                      item.subtitle = val;
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
