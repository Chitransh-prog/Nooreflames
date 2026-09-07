'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, X, ArrowUpRight, Sparkles, Award } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

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

const defaultTrendingCards: VideoReelItem[] = [
  {
    id: 'reel-1',
    title: 'Teddy & Balloon Candle',
    subtitle: 'Pure soy wax · Hidden love note melts into view',
    price: 1199,
    originalPrice: 1599,
    badge: 'HAND-POURED',
    thumbnail: '/images/products/teddy-bear-candle.jpg',
    videoUrl: '/videos/hero/noor_header_hero_video.mp4',
    productId: 'prod-7',
  },
  {
    id: 'reel-2',
    title: 'Lavender Dream Flame',
    subtitle: 'Soothing French lavender & botanical notes',
    price: 1099,
    originalPrice: 1499,
    badge: 'LAVENDER BLISS',
    thumbnail: '/images/products/whispered-surprises-lavender.jpg',
    videoUrl: '/videos/reels/IMG_5927.MP4',
    productId: 'prod-1',
  },
  {
    id: 'reel-3',
    title: 'Velvet Secret Message',
    subtitle: 'Romantic rose petals & warm amber glow',
    price: 1199,
    originalPrice: 1599,
    badge: 'SIGNATURE SWIRL',
    thumbnail: '/images/products/whispered-surprises.jpg',
    videoUrl: '/videos/reels/IMG_5931.MP4',
    productId: 'prod-1',
  },
  {
    id: 'reel-4',
    title: 'Whispered Surprises White',
    subtitle: 'Lead-free cotton wicks, 45+ hours clean burn',
    price: 1199,
    originalPrice: 1599,
    badge: 'PURE SOY WICK',
    thumbnail: '/images/products/whispered-surprises-blue.jpg',
    videoUrl: '/videos/hero/noor_header_hero_video.mp4',
    productId: 'prod-1',
  },
];

export default function VideoReelsSection() {
  const { addToCart, setIsCheckoutOpen } = useCart();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleBuy = (item: VideoReelItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: item.productId,
      sku: `NF-REEL-${item.id}`,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.thumbnail,
      category: 'candles',
      inStock: true,
      stockCount: 50,
    });
    setIsCheckoutOpen(true);
  };

  return (
    <section
      className="trending-reels-section"
      id="trending-reels"
      style={{
        padding: '50px 24px 70px',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Wavy Lines on left */}
      <div
        style={{
          position: 'absolute',
          left: '12px',
          top: '40px',
          color: '#5db0a8',
          opacity: 0.6,
          fontSize: '24px',
          lineHeight: '14px',
          userSelect: 'none',
          fontFamily: 'monospace',
          letterSpacing: '-2px',
        }}
      >
        ≈≈≈<br />≈≈≈<br />≈≈≈
      </div>

      <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative' }}>
        {/* 4-Card Horizontal Grid Matching Screenshot */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            alignItems: 'stretch',
          }}
        >
          {defaultTrendingCards.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveVideo(item.videoUrl)}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                border: '1px solid rgba(0, 0, 0, 0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
            >
              {/* Media Thumbnail */}
              <div style={{ position: 'relative', width: '100%', height: '340px', overflow: 'hidden' }}>
                <EditableImage
                  src={item.thumbnail}
                  alt={item.title}
                  label={`${item.title} Thumbnail`}
                  onImageChange={(url) => {
                    item.thumbnail = url;
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {/* Top Category Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 36, 34, 0.85)',
                    color: '#dfab72',
                    padding: '4px 10px',
                    borderRadius: '14px',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    backdropFilter: 'blur(6px)',
                    zIndex: 10,
                  }}
                >
                  <EditableText
                    as="span"
                    value={item.badge}
                    onValueChange={(val) => {
                      item.badge = val;
                    }}
                  />
                </div>

                {/* Play Button Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    zIndex: 10,
                  }}
                >
                  <Play size={13} fill="#ffffff" />
                </div>
              </div>

              {/* Bottom Card Details */}
              <div
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <Link
                    href={`/product/${item.productId}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <EditableText
                      as="h3"
                      value={item.title}
                      onValueChange={(val) => {
                        item.title = val;
                      }}
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        marginBottom: '4px',
                        fontFamily: 'var(--font-heading-family)',
                        cursor: 'pointer',
                      }}
                    />
                  </Link>
                  <EditableText
                    as="p"
                    value={item.subtitle}
                    onValueChange={(val) => {
                      item.subtitle = val;
                    }}
                    style={{
                      fontSize: '11px',
                      color: '#6e7a78',
                      marginBottom: '14px',
                      lineHeight: 1.4,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>{' '}
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#9ba6a4',
                        textDecoration: 'line-through',
                        marginLeft: '4px',
                      }}
                    >
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleBuy(item, e)}
                    style={{
                      padding: '7px 16px',
                      background: '#121212',
                      color: '#ffffff',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#c9935a')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#121212')}
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Heritage Wax Seal Medallion Stamp (matching screenshot on right) */}
        <div
          style={{
            position: 'absolute',
            right: '-16px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '82px',
            height: '82px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #e6c594 0%, #b88648 100%)',
            boxShadow: '0 8px 24px rgba(184, 134, 72, 0.35)',
            border: '2px dashed rgba(255, 255, 255, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#3d2508',
            fontSize: '7.5px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          <Award size={16} color="#3d2508" style={{ marginBottom: '2px' }} />
          <span>NOOR</span>
          <span style={{ fontSize: '6px', opacity: 0.85 }}>ATELIER</span>
        </div>
      </div>

      {/* Interactive Video Modal */}
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
              background: '#0f2422',
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
                color: '#dfab72',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700 }}>✦ NOOR ATELIER STORY</span>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <X size={22} />
              </button>
            </div>
            <video
              src={activeVideo}
              controls
              autoPlay
              playsInline
              style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
