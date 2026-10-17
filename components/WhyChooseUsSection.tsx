'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Droplets,
  Gift,
  ArrowRight,
  ShieldCheck,
  Award,
  Camera,
  Pause,
  Play,
} from 'lucide-react';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText } from './visual-edit/EditableElements';

export interface LuxurySliderSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  pillars: string[];
}

const defaultSlides: LuxurySliderSlide[] = [
  {
    id: 'perfumes',
    badge: '20% EAU DE PARFUM · HAUTE PARFUMERIE',
    title: 'Haute Parfumerie & Indelible Distinction',
    subtitle: 'METICULOUSLY MACERATED FRENCH ESSENCES',
    description:
      'Formulated with an exacting 20% concentration of French perfume oils. Patiently aged to deliver an intoxicating 14+ hour sillage that lingers in every room you grace.',
    image: '/images/slider/slider-1-perfumes.jpg',
    primaryCtaText: 'EXPLORE PARFUMS',
    primaryCtaLink: '#candles',
    secondaryCtaText: 'OUR FORMULATIONS',
    secondaryCtaLink: '/about',
    pillars: ['20% Extrait Concentration', '14+ Hours Longevity', 'French Luxury Oils'],
  },
  {
    id: 'candles',
    badge: '100% PURE SOY WAX · HAND-POURED ATELIER',
    title: 'Whispered Secrets & Sculptural Flames',
    subtitle: 'HAND-POURED WITH DEVOTION & PURPOSE',
    description:
      '100% clean-burning soy wax poured in bespoke vessels with lead-free cotton wicks, revealing intimate golden secret messages as the wax pools into liquid amber light.',
    image: '/images/slider/slider-2-candles.jpg',
    primaryCtaText: 'DISCOVER CANDLE ATELIER',
    primaryCtaLink: '#candles',
    secondaryCtaText: 'GIFT A SECRET MESSAGE',
    secondaryCtaLink: '/product/prod-whispered-surprises',
    pillars: ['100% Pure Soy Wax', 'Lead-Free Cotton Wicks', 'Secret Message Reveal'],
  },
  {
    id: 'attars',
    badge: '100% ALCOHOL-FREE · ROYAL HERITAGE',
    title: 'Pure Artisanal Attars in Crystal Flacons',
    subtitle: 'CONCENTRATED RARE BOTANICAL DISTILLATES',
    description:
      'Slow-distilled Cambodian Royal Oud, velvet Bulgarian Damask Rose, and imperial white jasmine nectar encased in handcrafted crystal flacons with gold-tipped applicator rods.',
    image: '/images/slider/slider-3-attars.jpg',
    primaryCtaText: 'DISCOVER ARTISANAL ATTARS',
    primaryCtaLink: '#candles',
    secondaryCtaText: 'ROYAL OUD VAULT',
    secondaryCtaLink: '/product/prod-royal-smokey-oud',
    pillars: ['100% Alcohol-Free', 'Pure Oil Extract', 'Hand-Cut Crystal Flacons'],
  },
  {
    id: 'gifting',
    badge: 'BESPOKE GIFTING · LUXURY TROUSSEAU',
    title: 'Curated Keepsake Boxes & Wax-Sealed Coffrets',
    subtitle: 'HANDCRAFTED FOR LIFE’S UNFORGETTABLE MOMENTS',
    description:
      'From intimate birthdays to lavish celebrations, every creation arrives in ivory gold-embossed coffrets, cushioned in black velvet, tied with satin ribbon and authentic wax seals.',
    image: '/images/slider/slider-4-gifting.jpg',
    primaryCtaText: 'EXPLORE GIFT SETS',
    primaryCtaLink: '#candles',
    secondaryCtaText: 'BESPOKE ENQUIRIES',
    secondaryCtaLink: 'https://wa.me/917985474320',
    pillars: ['Bespoke Velvet Coffrets', 'Authentic Wax Seals', 'Cruelty-Free & Pet Safe'],
  },
];

export default function WhyChooseUsSection() {
  const { storeData, updateField, isEditing, isAdminAuthenticated, openMediaPicker } =
    useVisualEdit();

  const savedSlides = storeData?.siteSettings?.luxurySliderSlides as LuxurySliderSlide[] | undefined;
  const slides = (savedSlides && savedSlides.length > 0) ? savedSlides : defaultSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Touch Swipe State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const SLIDE_DURATION = 6000; // 6s per slide

  // Autoplay timer with progress bar
  useEffect(() => {
    if (isPaused) return;

    const intervalStep = 50; // update progress every 50ms
    const stepIncrement = (intervalStep / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch gestures for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleEditImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openMediaPicker({
      type: 'image',
      currentUrl: slides[index].image,
      label: `Slider Graphic (Slide ${index + 1})`,
      onSave: (newUrl) => {
        const updated = [...slides];
        updated[index] = { ...updated[index], image: newUrl };
        updateField('siteSettings.luxurySliderSlides', updated);
      },
    });
  };

  const updateSlideField = (index: number, key: keyof LuxurySliderSlide, value: any) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [key]: value };
    updateField('siteSettings.luxurySliderSlides', updated);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="luxury-fullwidth-slider-section"
      id="why-us"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Atelier Highlights and Craftsmanship Carousel"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        backgroundColor: '#0E0B09',
        margin: '50px 0 0',
      }}
    >
      {/* Slide Visual Backgrounds */}
      <div
        className="luxury-slider-viewport"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '620px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id || idx}
              className={`luxury-slide-item ${isActive ? 'active' : ''}`}
              aria-hidden={!isActive}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                visibility: isActive ? 'visible' : 'hidden',
                transition: 'opacity 0.85s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isActive ? 'scale(1)' : 'scale(1.05)',
                zIndex: isActive ? 1 : 0,
              }}
            >
              {/* Background Image Frame */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url('${slide.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 38%',
                  backgroundRepeat: 'no-repeat',
                }}
              />

              {/* Cinematic Luxury Dark Gradient Overlays */}
              <div
                className="luxury-slider-overlay-desktop"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(14, 11, 9, 0.94) 0%, rgba(14, 11, 9, 0.82) 42%, rgba(14, 11, 9, 0.45) 70%, rgba(14, 11, 9, 0.25) 100%)',
                }}
              />

              {/* Ambient Golden Light Bleed */}
              <div
                style={{
                  position: 'absolute',
                  top: '-10%',
                  left: '10%',
                  width: '45%',
                  height: '60%',
                  background: 'radial-gradient(circle, rgba(230, 185, 128, 0.15) 0%, rgba(0,0,0,0) 70%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          );
        })}

        {/* Content Container (Constrained Luxury Editorial Layout) */}
        <div
          className="luxury-slider-content-wrap"
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '70px 48px 90px',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              maxWidth: '680px',
              animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Top Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '30px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                backdropFilter: 'blur(10px)',
                marginBottom: '16px',
              }}
            >
              <Sparkles size={12} color="#F2D19D" />
              <EditableText
                as="span"
                value={currentSlide.badge}
                onValueChange={(val) => updateSlideField(currentIndex, 'badge', val)}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  color: '#F5E1C3',
                  textTransform: 'uppercase',
                }}
              />
            </div>

            {/* Subtitle Accent */}
            <EditableText
              as="p"
              value={currentSlide.subtitle}
              onValueChange={(val) => updateSlideField(currentIndex, 'subtitle', val)}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: '#C4A482',
                textTransform: 'uppercase',
                margin: '0 0 10px',
                fontFamily: 'var(--font-body-family)',
              }}
            />

            {/* Main Title */}
            <EditableText
              as="h2"
              value={currentSlide.title}
              onValueChange={(val) => updateSlideField(currentIndex, 'title', val)}
              style={{
                fontFamily: 'var(--font-heading-family), serif',
                fontSize: 'clamp(32px, 4.4vw, 52px)',
                lineHeight: 1.14,
                color: '#FFFFFF',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                margin: '0 0 18px',
                textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              }}
            />

            {/* Editorial Description */}
            <EditableText
              as="p"
              value={currentSlide.description}
              onValueChange={(val) => updateSlideField(currentIndex, 'description', val)}
              style={{
                fontFamily: 'var(--font-body-family)',
                fontSize: 'clamp(14px, 1.25vw, 16px)',
                lineHeight: 1.65,
                color: 'rgba(255, 255, 255, 0.82)',
                margin: '0 0 26px',
                maxWidth: '600px',
                fontWeight: 300,
              }}
            />

            {/* Pillar Pills */}
            <div
              className="luxury-slider-pillars-row"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '32px',
              }}
            >
              {currentSlide.pillars.map((pill, pIdx) => (
                <span
                  key={pIdx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    backdropFilter: 'blur(8px)',
                    color: '#F5EBDD',
                    fontSize: '11.5px',
                    letterSpacing: '0.04em',
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: '#C4A482',
                      boxShadow: '0 0 6px #C4A482',
                    }}
                  />
                  {pill}
                </span>
              ))}
            </div>

            {/* Dual Action Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href={currentSlide.primaryCtaLink}
                className="luxury-slider-primary-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 34px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #FAF6F0 0%, #E3D1BC 100%)',
                  color: '#121212',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span>{currentSlide.primaryCtaText}</span>
                <ArrowRight size={14} />
              </Link>

              {currentSlide.secondaryCtaText && (
                <Link
                  href={currentSlide.secondaryCtaLink}
                  className="luxury-slider-secondary-cta"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '13px 26px',
                    borderRadius: '30px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    backdropFilter: 'blur(6px)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {currentSlide.secondaryCtaText}
                </Link>
              )}
            </div>

            {/* Admin Image Replace Action */}
            {isAdminAuthenticated && isEditing && (
              <div style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={(e) => handleEditImage(currentIndex, e)}
                  className="visual-edit-media-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#121212',
                    border: '1px solid #C4A482',
                    color: '#C4A482',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  <Camera size={13} />
                  <span>Change Slide Image ({currentIndex + 1}/4)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Left Navigation Arrow */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="luxury-slider-nav-arrow prev"
          style={{
            position: 'absolute',
            left: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'rgba(20, 16, 14, 0.65)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            backdropFilter: 'blur(12px)',
            color: '#F5E1C3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'all 0.25s ease',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Floating Right Navigation Arrow */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="luxury-slider-nav-arrow next"
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'rgba(20, 16, 14, 0.65)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            backdropFilter: 'blur(12px)',
            color: '#F5E1C3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'all 0.25s ease',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Bottom Slide Indicators & Play/Pause */}
        <div
          className="luxury-slider-bottom-bar"
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '48px',
            zIndex: 25,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(14, 11, 9, 0.68)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            backdropFilter: 'blur(12px)',
            borderRadius: '30px',
            padding: '8px 16px',
          }}
        >
          {/* Play/Pause Toggle */}
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? 'Resume Autoplay' : 'Pause Autoplay'}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#C4A482',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px',
            }}
          >
            {isPaused ? <Play size={13} fill="#C4A482" /> : <Pause size={13} fill="#C4A482" />}
          </button>

          <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.2)' }} />

          {/* Slide Dots / Thumb Indicators */}
          {slides.map((s, idx) => {
            const isCurr = idx === currentIndex;
            return (
              <button
                key={s.id || idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${s.title}`}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    height: '5px',
                    width: isCurr ? '24px' : '6px',
                    borderRadius: '10px',
                    background: isCurr ? '#F5E1C3' : 'rgba(255, 255, 255, 0.28)',
                    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                />
                {isCurr && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#F5E1C3',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                    }}
                  >
                    0{idx + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Animated Autoplay Progress Line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.08)',
            zIndex: 30,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #997B5E 0%, #D4AF37 50%, #F5E1C3 100%)',
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.6)',
              transition: isPaused ? 'none' : 'width 50ms linear',
            }}
          />
        </div>
      </div>

      {/* Responsive Media Query Styles */}
      <style jsx>{`
        .luxury-fullwidth-slider-section {
          width: 100vw;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }

        .luxury-slider-primary-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px rgba(212, 175, 55, 0.25), 0 6px 16px rgba(0, 0, 0, 0.5);
          background: #ffffff !important;
        }

        .luxury-slider-secondary-cta:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: #f5e1c3 !important;
          color: #f5e1c3 !important;
        }

        .luxury-slider-nav-arrow:hover {
          background: rgba(212, 175, 55, 0.25) !important;
          border-color: #f5e1c3 !important;
          transform: translateY(-50%) scale(1.08) !important;
        }

        @media (max-width: 900px) {
          .luxury-slider-content-wrap {
            padding: 50px 24px 80px !important;
          }
          .luxury-slider-bottom-bar {
            right: 24px !important;
            bottom: 16px !important;
          }
          .luxury-slider-nav-arrow {
            display: none !important;
          }
          .luxury-slider-overlay-desktop {
            background: linear-gradient(
              180deg,
              rgba(14, 11, 9, 0.3) 0%,
              rgba(14, 11, 9, 0.75) 45%,
              rgba(14, 11, 9, 0.94) 100%
            ) !important;
          }
        }

        @media (max-width: 600px) {
          .luxury-slider-viewport {
            min-height: 520px !important;
          }
          .luxury-slider-content-wrap {
            padding: 40px 18px 75px !important;
          }
          .luxury-slider-pillars-row {
            display: none !important;
          }
          .luxury-slider-bottom-bar {
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%) !important;
            bottom: 14px !important;
            padding: 6px 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
