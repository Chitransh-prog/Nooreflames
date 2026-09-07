'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronDown, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Product } from '../../lib/store';

interface CinematicPerfumeRevealProps {
  product: Product;
  onSkip?: () => void;
}

const TOTAL_FRAMES = 12;
const FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return `/images/reveal/frame-${num.length === 2 ? num : '0' + num}.jpg`;
});

export default function CinematicPerfumeReveal({ product, onSkip }: CinematicPerfumeRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Animation / Smooth lerp state
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Preload frame images progressively
  useEffect(() => {
    let mounted = true;
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    // Load first 3 frames eagerly for instant first-paint
    FRAME_PATHS.forEach((path, idx) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        if (!mounted) return;
        loadedCount++;
        // As soon as first 3 frames or all are ready, mark ready
        if (loadedCount >= 3) {
          setIsLoaded(true);
        }
      };
      images[idx] = img;
    });

    imagesRef.current = images;

    return () => {
      mounted = false;
    };
  }, []);

  // Canvas drawing function for dual-buffer frame interpolation
  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images = imagesRef.current;
    if (images.length === 0) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear background to pure obsidian black
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);

    // Compute continuous frame index
    const clampedP = Math.max(0, Math.min(1, progress));
    const continuousFrame = clampedP * (TOTAL_FRAMES - 1);
    const indexA = Math.floor(continuousFrame);
    const indexB = Math.min(TOTAL_FRAMES - 1, indexA + 1);
    const blendFactor = continuousFrame - indexA;

    const imgA = images[indexA];
    const imgB = images[indexB];

    // Subtle physical dolly-in scale: scale from 0.94 up to 1.03
    const baseScale = 0.94 + clampedP * 0.09;

    const renderImg = (img: HTMLImageElement, alpha: number) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Calculate 'contain' dimensions centered
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;

      let drawW = w;
      let drawH = h;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawH = h * 0.92 * baseScale;
        drawW = drawH * imgRatio;
        offsetX = (w - drawW) / 2;
        offsetY = (h - drawH) / 2;
      } else {
        drawW = w * 0.92 * baseScale;
        drawH = drawW / imgRatio;
        offsetX = (w - drawW) / 2;
        offsetY = (h - drawH) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      ctx.restore();
    };

    if (imgA && imgA.complete) {
      renderImg(imgA, 1.0 - blendFactor);
    }
    if (imgB && imgB.complete && blendFactor > 0.001) {
      renderImg(imgB, blendFactor);
    }

    // Dynamic amber aura backlight in canvas
    if (clampedP > 0.15) {
      const auraAlpha = Math.min(0.25, (clampedP - 0.15) * 0.35);
      const radGrad = ctx.createRadialGradient(
        w / 2,
        h * 0.52,
        w * 0.05,
        w / 2,
        h * 0.52,
        w * 0.35
      );
      radGrad.addColorStop(0, `rgba(215, 140, 50, ${auraAlpha})`);
      radGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');

      ctx.save();
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
  }, []);

  // Animation render loop with smooth lerp
  useEffect(() => {
    const loop = () => {
      // Lerp current towards target for buttery 60fps smoothing
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * 0.14;
        setScrollProgress(currentProgressRef.current);
        drawFrame(currentProgressRef.current);
      }
      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [drawFrame]);

  // Handle scroll events
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const rawProgress = -rect.top / totalScrollable;
      const clamped = Math.max(0, Math.min(1, rawProgress));
      targetProgressRef.current = clamped;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  // Resize canvas to match display resolution & DPR
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const displayW = canvas.clientWidth || window.innerWidth;
      const displayH = canvas.clientHeight || window.innerHeight;

      if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
        drawFrame(currentProgressRef.current);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawFrame]);

  const handleSkipClick = () => {
    if (onSkip) {
      onSkip();
      return;
    }
    const container = containerRef.current;
    if (container) {
      const targetY = container.offsetTop + container.offsetHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  // Phase calculation for cinematic narrative typography
  const p = scrollProgress;
  const isPhase1 = p >= 0.04 && p < 0.32;
  const isPhase2 = p >= 0.34 && p < 0.64;
  const isPhase3 = p >= 0.66 && p < 0.94;
  const isPhase4 = p >= 0.94; // Unlocking into PDP

  return (
    <section
      ref={containerRef}
      className={`cinematic-reveal-track ${prefersReducedMotion ? 'reduced-motion' : ''}`}
      style={{
        position: 'relative',
        height: prefersReducedMotion ? '100vh' : '260vh',
        backgroundColor: '#050505',
      }}
    >
      {/* Sticky Fullscreen Stage */}
      <div
        className="cinematic-reveal-sticky"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#050505',
          display: 'flex',
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
              'radial-gradient(circle at 50% 50%, rgba(20, 16, 12, 0.9) 0%, rgba(5, 5, 5, 1) 75%)',
            pointerEvents: 'none',
          }}
        />

        {/* Ambient Top & Bottom Vignette Shadow Gradients */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '140px',
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
            height: '160px',
            background: 'linear-gradient(to top, #050505 0%, rgba(5, 5, 5, 0) 100%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />

        {/* Main Canvas Frame Scrubber */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            zIndex: 2,
            transition: 'opacity 0.4s ease',
            opacity: isLoaded ? 1 : 0,
          }}
        />

        {/* Loading Pulse Placeholder */}
        {!isLoaded && (
          <div
            style={{
              position: 'absolute',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '2px solid rgba(201, 147, 90, 0.2)',
                borderTopColor: '#c9935a',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span
              style={{
                color: '#c9935a',
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-heading-family)',
              }}
            >
              PREPARING ATELIER REVEAL
            </span>
          </div>
        )}

        {/* Top Floating Header & Controls */}
        <div
          className="cinematic-header-bar"
          style={{
            position: 'absolute',
            top: '28px',
            left: '32px',
            right: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 20,
          }}
        >
          {/* Brand Signature Monogram */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              className="cinematic-brand-logo"
              style={{
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.24em',
                fontFamily: 'var(--font-heading-family)',
                opacity: 0.9,
              }}
            >
              NOOR-E-FLAMES
            </span>
            <span
              className="cinematic-brand-badge"
              style={{
                background: 'rgba(201, 147, 90, 0.15)',
                border: '1px solid rgba(201, 147, 90, 0.35)',
                color: '#d4a366',
                fontSize: '9px',
                padding: '2px 8px',
                borderRadius: '20px',
                letterSpacing: '0.12em',
                fontWeight: 700,
              }}
            >
              EXTRAIT 35%
            </span>
          </div>

          {/* Quick Skip to Details Action */}
          <button
            type="button"
            onClick={handleSkipClick}
            className="cinematic-skip-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
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
              e.currentTarget.style.background = 'rgba(201, 147, 90, 0.25)';
              e.currentTarget.style.borderColor = '#c9935a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
            }}
          >
            <span>SKIP TO DETAILS</span>
            <ChevronDown size={14} color="#c9935a" />
          </button>
        </div>

        {/* Phase-Aware Typographic Narrative Overlays */}
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            left: 0,
            right: 0,
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 24px',
            pointerEvents: 'none',
          }}
        >
          {/* Phase 1: Emergence from Darkness */}
          <div
            style={{
              position: 'absolute',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              opacity: isPhase1 ? 1 : 0,
              transform: isPhase1 ? 'translateY(0)' : 'translateY(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: '#c9935a',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              ✦ THE GENESIS ✦
            </span>
            <h2
              style={{
                color: '#ffffff',
                fontFamily: 'var(--font-heading-family)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 400,
                letterSpacing: '0.04em',
                margin: 0,
                textShadow: '0 4px 24px rgba(0,0,0,0.8)',
              }}
            >
              Born from Obsidian Shadows
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: '14px',
                maxWidth: '480px',
                marginTop: '8px',
                lineHeight: 1.5,
              }}
            >
              Before the first flame is kindled, the silhouette awaits in nocturnal stillness.
            </p>
          </div>

          {/* Phase 2: Refraction & Rare Ingredients */}
          <div
            style={{
              position: 'absolute',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              opacity: isPhase2 ? 1 : 0,
              transform: isPhase2 ? 'translateY(0)' : 'translateY(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: '#c9935a',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              ✦ THE CRAFT ✦
            </span>
            <h2
              style={{
                color: '#ffffff',
                fontFamily: 'var(--font-heading-family)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 400,
                letterSpacing: '0.04em',
                margin: 0,
                textShadow: '0 4px 24px rgba(0,0,0,0.8)',
              }}
            >
              35% Extrait De Parfum
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: '14px',
                maxWidth: '520px',
                marginTop: '8px',
                lineHeight: 1.5,
              }}
            >
              Hand-poured into heavy crystal flacons with antique filigree bronze and amber oils.
            </p>
          </div>

          {/* Phase 3: The Full Hero Revelation */}
          <div
            style={{
              position: 'absolute',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              opacity: isPhase3 ? 1 : 0,
              transform: isPhase3 ? 'translateY(0)' : 'translateY(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: '#c9935a',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              ✦ THE MASTERPIECE ✦
            </span>
            <h2
              style={{
                color: '#ffffff',
                fontFamily: 'var(--font-heading-family)',
                fontSize: 'clamp(30px, 4.5vw, 50px)',
                fontWeight: 400,
                letterSpacing: '0.04em',
                margin: 0,
                textShadow: '0 4px 30px rgba(0,0,0,0.9)',
              }}
            >
              {product.title}
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '15px',
                maxWidth: '540px',
                marginTop: '8px',
                lineHeight: 1.5,
              }}
            >
              {product.subtitle || 'An olfactory journey crafted to linger in memory.'}
            </p>
          </div>
        </div>

        {/* Left Side Vertical Scroll Progress Gauge */}
        <div
          style={{
            position: 'absolute',
            left: '32px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 20,
            opacity: p > 0.02 && p < 0.98 ? 0.9 : 0.3,
            transition: 'opacity 0.3s ease',
          }}
        >
          <span
            style={{
              color: '#c9935a',
              fontSize: '9px',
              letterSpacing: '0.14em',
              fontWeight: 700,
            }}
          >
            {Math.round(p * 100)}%
          </span>
          <div
            style={{
              width: '2px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${Math.round(p * 100)}%`,
                background: 'linear-gradient(to bottom, #c9935a, #f7d59b)',
                transition: 'height 0.1s linear',
              }}
            />
          </div>
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '8px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            REVEAL
          </span>
        </div>

        {/* Bottom Scroll Cue (Fades out when user begins scrolling) */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'none',
            opacity: p < 0.08 ? 1 : 0,
            transform: p < 0.08 ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            SCROLL TO EXPERIENCE THE REVEAL
          </span>
          <ChevronDown
            size={18}
            color="#c9935a"
            style={{ animation: 'bounceSlow 1.8s infinite' }}
          />
        </div>

        {/* Transition Horizon Bar for Smooth Exit into PDP */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background:
              p >= 0.96
                ? 'linear-gradient(90deg, transparent, #c9935a, transparent)'
                : 'transparent',
            transition: 'background 0.3s ease',
            zIndex: 25,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes bounceSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
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
            letter-spacing: 0.16em !important;
          }
          .cinematic-brand-badge {
            font-size: 8px !important;
            padding: 1px 6px !important;
          }
          .cinematic-skip-btn {
            padding: 6px 12px !important;
            font-size: 10px !important;
            letter-spacing: 0.06em !important;
          }
        }
      `}</style>
    </section>
  );
}
