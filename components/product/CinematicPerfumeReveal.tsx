'use client';

import React, { useRef } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Product } from '../../lib/store';
import LuxuryProduct3DCanvas from '../3d/LuxuryProduct3DCanvas';

interface CinematicPerfumeRevealProps {
  product: Product;
  onSkip?: () => void;
}

export default function CinematicPerfumeReveal({ product, onSkip }: CinematicPerfumeRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSkipClick = () => {
    if (onSkip) {
      onSkip();
      return;
    }
    const el = document.getElementById('pdp-main-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine category badge text
  const isCandle = product.category === 'candles';
  const isAttar =
    product.id === 'prod-11' ||
    product.id === 'prod-13' ||
    product.id === 'prod-16' ||
    product.title.toLowerCase().includes('attar');

  const badgeText = isCandle
    ? 'ARTISANAL SOY CANDLE'
    : isAttar
    ? '100% PURE CONCENTRATED ATTAR'
    : product.concentration || 'EXTRAIT DE PARFUM · 35%';

  // Extract notes or highlight
  const notesHighlight =
    product.scentFamily ||
    (product.topNotes && product.topNotes.length > 0 ? product.topNotes.join(' · ') : product.subtitle);

  return (
    <section
      ref={containerRef}
      className="cinematic-hero-section"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#050505',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Dynamic Obsidian Glow Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, rgba(26, 21, 16, 0.95) 0%, rgba(5, 5, 5, 1) 78%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top and Bottom Vignette Shadow Gradients */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '110px',
          background: 'linear-gradient(to bottom, #050505 0%, rgba(5, 5, 5, 0) 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '130px',
          background: 'linear-gradient(to top, #050505 0%, rgba(5, 5, 5, 0) 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* Top Floating Header & Skip Controls */}
      <div
        className="cinematic-header-bar"
        style={{
          position: 'absolute',
          top: '24px',
          left: '28px',
          right: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 25,
        }}
      >
        {/* Brand & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            className="cinematic-brand-logo"
            style={{
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.22em',
              fontFamily: 'var(--font-heading-family)',
              opacity: 0.92,
            }}
          >
            NOOR-E-FLAMES
          </span>
          <span
            className="cinematic-brand-badge"
            style={{
              background: 'rgba(201, 147, 90, 0.15)',
              border: '1px solid rgba(201, 147, 90, 0.4)',
              color: '#BBA58E',
              fontSize: '9px',
              padding: '3px 10px',
              borderRadius: '20px',
              letterSpacing: '0.12em',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {badgeText}
          </span>
        </div>

        {/* Skip to Buy Box Action Button */}
        <button
          type="button"
          onClick={handleSkipClick}
          className="cinematic-skip-btn"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(223, 171, 114, 0.35)',
            color: '#ffffff',
            padding: '8px 18px',
            borderRadius: '24px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201, 147, 90, 0.28)';
            e.currentTarget.style.borderColor = '#BBA58E';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(223, 171, 114, 0.35)';
          }}
        >
          <span>EXPLORE DETAILS</span>
          <ChevronDown size={14} color="#BBA58E" />
        </button>
      </div>

      {/* Real-time 3D WebGL Canvas Layer (Full Stage, Centered Model) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 5,
        }}
      >
        <LuxuryProduct3DCanvas
          product={product}
          isInteractive={true}
          compact={false}
        />
      </div>

      {/* Subtle Floating Bottom Card Framing the Model */}
      <div
        className="cinematic-bottom-info"
        style={{
          position: 'absolute',
          bottom: '22px',
          left: '24px',
          zIndex: 20,
          pointerEvents: 'none',
          maxWidth: '380px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#BBA58E',
            fontSize: '10px',
            letterSpacing: '0.18em',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          <Sparkles size={11} />
          <span>SIGNATURE CREATION</span>
        </div>
        <h2
          style={{
            color: '#ffffff',
            fontFamily: 'var(--font-heading-family)',
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 400,
            margin: '0 0 4px 0',
            letterSpacing: '0.03em',
            textShadow: '0 2px 14px rgba(0,0,0,0.8)',
          }}
        >
          {product.title}
        </h2>
        {notesHighlight && (
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.68)',
              fontSize: '12px',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {notesHighlight}
          </p>
        )}
      </div>

      {/* Bottom Center Scroll Cue */}
      <button
        type="button"
        onClick={handleSkipClick}
        className="cinematic-scroll-cue"
        style={{
          position: 'absolute',
          bottom: '16px',
          zIndex: 25,
          background: 'transparent',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          color: '#ffffff',
          opacity: 0.85,
          transition: 'opacity 0.2s ease',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.65)',
            fontWeight: 600,
          }}
        >
          SCROLL FOR BUY BOX
        </span>
        <ChevronDown
          size={16}
          color="#BBA58E"
          style={{ animation: 'bounceSlow 1.8s infinite' }}
        />
      </button>

      <style jsx>{`
        @keyframes bounceSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(5px);
          }
        }
        @media (max-width: 768px) {
          .cinematic-header-bar {
            top: 14px !important;
            left: 14px !important;
            right: 14px !important;
          }
          .cinematic-brand-logo {
            font-size: 11px !important;
          }
          .cinematic-brand-badge {
            font-size: 8px !important;
            padding: 2px 7px !important;
          }
          .cinematic-skip-btn {
            padding: 6px 12px !important;
            font-size: 10px !important;
          }
          .cinematic-bottom-info {
            display: none !important;
          }
          .cinematic-scroll-cue {
            bottom: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}
