'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

export default function DiscoveryBanner() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { storeData } = useVisualEdit();
  const live = storeData?.discoveryBanner;

  return (
    <section
      className="scented-with-love-section"
      id="discovery"
      style={{
        padding: '30px 24px 60px',
        maxWidth: '1360px',
        margin: '0 auto',
      }}
    >
      {/* Wide Vibrant Rose Pink Card Container */}
      <div
        style={{
          position: 'relative',
          borderRadius: '28px',
          overflow: 'hidden',
          background:
            'radial-gradient(ellipse at 80% 40%, rgba(255, 180, 205, 0.45) 0%, rgba(214, 75, 119, 0.95) 45%, #a82654 100%)',
          minHeight: '420px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 60px',
          color: '#ffffff',
          boxShadow: '0 20px 50px rgba(184, 51, 95, 0.28)',
          flexWrap: 'wrap',
          gap: '30px',
        }}
      >
        {/* Subtle decorative wavy pattern lines on left */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '-10px',
            color: '#ffffff',
            opacity: 0.25,
            fontSize: '24px',
            lineHeight: '14px',
            userSelect: 'none',
            fontFamily: 'monospace',
            letterSpacing: '-2px',
          }}
        >
          ≈≈≈<br />≈≈≈<br />≈≈≈
        </div>

        {/* Left Side: Editorial Typography with Visual Editing */}
        <div style={{ maxWidth: '480px', zIndex: 2 }}>
          <EditableText
            as="span"
            fieldPath="discoveryBanner.badge"
            value={live?.badge || '✦ SIGNATURE COMFORT COLLECTION'}
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '16px',
            }}
          />

          <EditableText
            as="h2"
            fieldPath="discoveryBanner.title"
            value={live?.title || 'SCENTED WITH LOVE, WRAPPED IN COMFORT.'}
            className="font-serif"
            style={{
              fontSize: 'clamp(32px, 4vw, 54px)',
              fontWeight: 400,
              letterSpacing: '0.08em',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              color: '#ffffff',
              marginBottom: '20px',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.15)',
            }}
          />

          <EditableText
            as="p"
            fieldPath="discoveryBanner.subtitle"
            value={
              live?.subtitle ||
              'Hand-poured floral wax sculptures and delicate rose extraits crafted to bring warmth, romance, and tranquility to your sacred living space.'
            }
            style={{
              fontSize: '14px',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.92)',
              marginBottom: '28px',
            }}
          />

          <Link
            href={live?.buttonLink || '#candles'}
            style={{
              display: 'inline-block',
              padding: '13px 32px',
              background: '#ffffff',
              color: '#991f4a',
              borderRadius: '30px',
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
            }}
          >
            <EditableText
              as="span"
              fieldPath="discoveryBanner.buttonText"
              value={live?.buttonText || 'DISCOVER THE COLLECTION'}
            />
          </Link>
        </div>

        {/* Right Side: Rose & Blue Fluted Candle Visual with Visual Editing */}
        <div
          style={{
            zIndex: 2,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1 1 360px',
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '440px',
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              border: '3px solid rgba(255, 255, 255, 0.4)',
            }}
          >
            <EditableImage
              src={live?.showcaseImage || '/images/products/rose-bear-duo.jpg'}
              fieldPath="discoveryBanner.showcaseImage"
              label="Signature Showcase Image"
              alt="Scented with Love — Fresh Rose & Handcrafted Soy Candle"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>

        {/* Bottom Carousel Indicator Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 3,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => setActiveSlide(dot)}
              aria-label={`Slide ${dot + 1}`}
              style={{
                width: dot === activeSlide ? '20px' : '7px',
                height: '7px',
                borderRadius: '10px',
                border: 'none',
                background: dot === activeSlide ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
