'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Award,
  Flame,
  Droplets,
  Heart,
  Clock,
  ShieldCheck,
  Sparkles,
  Camera,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText } from './visual-edit/EditableElements';

const initialIconsData = [
  {
    icon: <Sparkles size={24} color="#BBA58E" />,
    title: 'Beautiful Fragrances',
    desc: 'Carefully selected blends to make surroundings smell inviting',
  },
  {
    icon: <Flame size={24} color="#BBA58E" />,
    title: '100% Soy Wax',
    desc: 'Smooth & premium finish with clean, non-toxic burn',
  },
  {
    icon: <Award size={24} color="#BBA58E" />,
    title: 'Perfect for Gifting',
    desc: 'From birthdays to small surprises, made to feel special',
  },
  {
    icon: <Clock size={24} color="#BBA58E" />,
    title: 'Made to Be Enjoyed',
    desc: 'Candles last 1–2 months & perfumes linger 14+ hours',
  },
  {
    icon: <Heart size={24} color="#BBA58E" />,
    title: 'Handcrafted with Love',
    desc: 'Artisanal details making each piece special & unique',
  },
  {
    icon: <Droplets size={24} color="#BBA58E" />,
    title: '20% EAU DE PARFUM',
    desc: 'High-performance luxury oils & pure concentrated attars',
  },
  {
    icon: <ShieldCheck size={24} color="#BBA58E" />,
    title: 'Safe & Clean Formulations',
    desc: 'Lead-free wicks, cruelty-free & safe for pet-loving homes',
  },
];

export default function WhyChooseUsSection() {
  const { storeData, updateField, isEditing, isAdminAuthenticated, openMediaPicker } = useVisualEdit();

  const savedItems = storeData?.siteSettings?.whyUsItems;
  const items = initialIconsData.map((item, idx) => ({
    ...item,
    title: savedItems?.[idx]?.title ?? item.title,
    desc: savedItems?.[idx]?.desc ?? item.desc,
  }));

  const bannerBadge = storeData?.siteSettings?.whyUsBadge || "IT'S ALL IN THE DETAIL";
  const bannerTitle = storeData?.siteSettings?.whyUsTitle || "Why Choose NOOR - E - FLAMES";
  
  // High-resolution responsive background graphics
  const customBg = storeData?.siteSettings?.whyUsBackground;
  const desktopBg = customBg && customBg !== '/images/noor-flame-signature-gradient.jpg'
    ? customBg
    : '/images/why-us-luxury-flame-ambient.jpg';
  const mobileBg = customBg && customBg !== '/images/noor-flame-signature-gradient.jpg'
    ? customBg
    : '/images/why-us-luxury-flame-ambient-mobile.jpg';

  // Slider State & Refs
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse Drag Tracking
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStartLeft, setScrollStartLeft] = useState(0);

  const checkScrollState = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);

    const firstCard = sliderRef.current.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth : 180;
    const gap = 16;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(items.length - 1, Math.max(0, index)));
  }, [items.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);
    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [checkScrollState]);

  // Auto-slide every 4.5s unless hovered or dragging
  useEffect(() => {
    if (isHovered || isDragging) return;
    const timer = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft >= scrollWidth - clientWidth - 16) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const firstCard = sliderRef.current.firstElementChild as HTMLElement | null;
        const step = firstCard ? firstCard.offsetWidth + 16 : 200;
        sliderRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [isHovered, isDragging]);

  const scrollPrev = () => {
    if (!sliderRef.current) return;
    const firstCard = sliderRef.current.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth * 1.5 + 16 : 240;
    sliderRef.current.scrollBy({ left: -step, behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!sliderRef.current) return;
    const firstCard = sliderRef.current.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth * 1.5 + 16 : 240;
    sliderRef.current.scrollBy({ left: step, behavior: 'smooth' });
  };

  const scrollToIndex = (idx: number) => {
    if (!sliderRef.current) return;
    const firstCard = sliderRef.current.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth : 180;
    const gap = 16;
    sliderRef.current.scrollTo({ left: idx * (cardWidth + gap), behavior: 'smooth' });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollStartLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    sliderRef.current.scrollLeft = scrollStartLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const updateItem = (index: number, key: 'title' | 'desc', val: string) => {
    const currentList = items.map((it) => ({ title: it.title, desc: it.desc }));
    currentList[index] = { ...currentList[index], [key]: val };
    updateField('siteSettings.whyUsItems', currentList);
  };

  const handleEditBg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openMediaPicker({
      type: 'image',
      currentUrl: desktopBg,
      label: 'Why Choose Us Banner Background',
      onSave: (newUrl) => updateField('siteSettings.whyUsBackground', newUrl),
    });
  };

  return (
    <section className="why-choose-us-banner-section" id="why-us">
      {/* Bespoke Responsive Noor-e-Flames Ambient Flame Banner */}
      <div
        className="why-us-banner-ambient visual-editable-media-wrap"
        style={{
          position: 'relative',
          border: '1px solid rgba(212, 175, 55, 0.28)',
          boxShadow: '0 25px 65px rgba(0, 0, 0, 0.42), 0 0 50px rgba(201, 147, 90, 0.18)',
        }}
      >
        {/* Responsive Background Styles via Style Tag */}
        <style jsx>{`
          .why-us-banner-ambient {
            background-image: linear-gradient(180deg, rgba(14, 11, 9, 0.22) 0%, rgba(14, 11, 9, 0.55) 100%), url('${desktopBg}');
            background-size: cover;
            background-position: center 40%;
            background-repeat: no-repeat;
            background-color: #17110e;
          }
          @media (max-width: 768px) {
            .why-us-banner-ambient {
              background-image: linear-gradient(180deg, rgba(14, 11, 9, 0.2) 0%, rgba(14, 11, 9, 0.6) 100%), url('${mobileBg}');
              background-position: center center;
            }
          }
        `}</style>

        {/* Admin Background Switcher */}
        {isAdminAuthenticated && isEditing && (
          <button
            type="button"
            onClick={handleEditBg}
            className="visual-edit-media-btn"
            style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 100 }}
            title="Replace Banner Background"
          >
            <Camera size={13} />
            <span>Change Background</span>
          </button>
        )}

        {/* Ambient Top Glow Accents */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '140px',
            background: 'radial-gradient(ellipse at center, rgba(230, 185, 128, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Section Subtitle */}
        <EditableText
          as="span"
          value={bannerBadge}
          onValueChange={(val) => updateField('siteSettings.whyUsBadge', val)}
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#f5dfb8',
            marginBottom: '12px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.75)',
            position: 'relative',
            zIndex: 2,
          }}
        />

        {/* Section Heading */}
        <EditableText
          as="h2"
          value={bannerTitle}
          onValueChange={(val) => updateField('siteSettings.whyUsTitle', val)}
          className="font-serif why-us-main-title"
          style={{
            fontWeight: 400,
            letterSpacing: '0.08em',
            color: '#ffffff',
            marginBottom: '38px',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.75), 0 0 35px rgba(230, 185, 128, 0.45)',
            position: 'relative',
            zIndex: 2,
          }}
        />

        {/* Floating White Rounded Card with Interactive Responsive Slider */}
        <div
          className="why-us-card-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleMouseUpOrLeave();
          }}
          style={{
            position: 'relative',
            zIndex: 3,
          }}
        >
          {/* Navigation Chevron Left */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollLeft}
            aria-label="Previous Slide"
            className="why-us-slider-nav-btn prev"
            style={{
              position: 'absolute',
              left: '-14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1.5px solid #C4A482',
              color: '#8A7258',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollLeft ? 'pointer' : 'default',
              opacity: canScrollLeft ? 1 : 0.25,
              zIndex: 10,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Navigation Chevron Right */}
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollRight}
            aria-label="Next Slide"
            className="why-us-slider-nav-btn next"
            style={{
              position: 'absolute',
              right: '-14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1.5px solid #C4A482',
              color: '#8A7258',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollRight ? 'pointer' : 'default',
              opacity: canScrollRight ? 1 : 0.25,
              zIndex: 10,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Horizontal Scrollable Slider Track */}
          <div
            ref={sliderRef}
            className="why-us-slider-track"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: '16px',
              overflowX: 'auto',
              scrollBehavior: isDragging ? 'auto' : 'smooth',
              scrollSnapType: isDragging ? 'none' : 'x mandatory',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              padding: '6px 4px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                className="why-us-slide-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '12px 10px',
                  borderRadius: '16px',
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                  transition: 'transform 0.25s ease, background 0.25s ease',
                }}
              >
                {/* Circular Outlined Icon Badge */}
                <div
                  className="why-us-badge-ring"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '1.5px solid #BBA58E',
                    background: 'linear-gradient(135deg, rgba(250, 246, 240, 0.95) 0%, rgba(240, 230, 218, 0.7) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    boxShadow: '0 4px 12px rgba(187, 165, 142, 0.2)',
                    transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease',
                  }}
                >
                  {item.icon}
                </div>

                {/* Title */}
                <EditableText
                  as="h3"
                  value={item.title}
                  onValueChange={(val) => updateItem(idx, 'title', val)}
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#121212',
                    marginBottom: '5px',
                    lineHeight: 1.3,
                  }}
                />

                {/* Description */}
                <EditableText
                  as="p"
                  value={item.desc}
                  onValueChange={(val) => updateItem(idx, 'desc', val)}
                  style={{
                    fontSize: '10.5px',
                    color: '#666666',
                    lineHeight: 1.38,
                    margin: 0,
                    maxWidth: '180px',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Slider Pagination Dots & Mobile Indicators */}
          <div
            className="why-us-slider-dots"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '16px',
            }}
          >
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  height: '6px',
                  width: activeIndex === i ? '22px' : '6px',
                  borderRadius: '10px',
                  background: activeIndex === i ? '#8A7258' : '#D6C7B7',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: activeIndex === i ? '0 1px 4px rgba(138, 114, 88, 0.4)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
