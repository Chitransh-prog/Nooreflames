'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { urlForImage } from '../lib/image';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage, EditableVideo } from './visual-edit/EditableElements';

export interface VideoPlaylistItem {
  id: string;
  title: string;
  label: string;
  url: string;
  badge?: string;
}

interface HeroData {
  title?: string;
  tagline?: string;
  buttonText?: string;
  buttonLink?: string;
  desktopImage?: any;
  video?: string;
  mediaType?: 'video' | 'image';
  videoPlaylist?: VideoPlaylistItem[];
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export default function HeroSection({ hero }: { hero?: HeroData }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { storeData } = useVisualEdit();
  const liveHero = storeData?.hero;

  const title = liveHero?.headline || hero?.title || 'WHERE FRAGRANCE MEETS FLAMES';
  const tagline =
    liveHero?.subtitle ||
    hero?.tagline ||
    'Botanical extraits, artisanal alcohol-free attars, and hand-poured sculptural candles crafted for timeless rituals.';
  const primaryButtonText = liveHero?.primaryCtaText || hero?.buttonText || '✦ SHOP PERFUMES';
  const primaryButtonLink = liveHero?.primaryCtaLink || hero?.buttonLink || '#edps';
  const secondaryButtonText = liveHero?.secondaryCtaText || hero?.secondaryCtaText || '✦ EXPLORE DISCOVERY SET';
  const secondaryButtonLink = liveHero?.secondaryCtaLink || hero?.secondaryCtaLink || '#discovery';

  const videoUrl = liveHero?.video || hero?.video || '/videos/hero/noor_header_hero_video.mp4';

  const bgImageUrl = liveHero?.image
    ? liveHero.image
    : hero?.desktopImage
    ? (typeof hero.desktopImage === 'string' ? hero.desktopImage : urlForImage(hero.desktopImage).url())
    : '/images/hero/hero-stone-bottle.jpg';

  const showVideo = (liveHero?.mediaType || hero?.mediaType) !== 'image' && Boolean(videoUrl);

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '84vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0e1e1c',
      }}
    >
      {/* 1. Full-Bleed Video or Image Canvas with Visual Editing */}
      {showVideo ? (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <EditableVideo
            src={videoUrl}
            fieldPath="hero.video"
            label="Hero 4K Background Video"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <EditableImage
            src={bgImageUrl}
            fieldPath="hero.image"
            label="Hero Background Artwork"
            alt="Noor-E-Flames Fragrance & Flame Atelier"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* 2. Atmospheric Dark Vignette Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(10, 23, 22, 0.15) 0%, rgba(10, 23, 22, 0.5) 60%, rgba(10, 23, 22, 0.88) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* 3. Centered Content Overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: '860px',
          padding: '0 24px',
          textAlign: 'center',
          color: '#ffffff',
          marginTop: '60px',
        }}
      >
        {/* Subtle pill badge */}
        <div style={{ marginBottom: '18px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 18px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              background: 'rgba(15, 36, 34, 0.65)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <Sparkles size={11} color="#dfab72" />
            <EditableText
              as="span"
              fieldPath="hero.badge"
              value={liveHero?.badge || 'WHERE FRAGRANCE MEETS FLAMES'}
            />
          </span>
        </div>

        {/* Main Headline */}
        <EditableText
          as="h1"
          fieldPath="hero.headline"
          value={title}
          className="font-serif"
          style={{
            fontSize: 'clamp(28px, 4.5vw, 54px)',
            fontWeight: 400,
            letterSpacing: '0.12em',
            lineHeight: 1.15,
            textTransform: 'uppercase',
            color: '#ffffff',
            marginBottom: '16px',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.7)',
          }}
        />

        {/* Subtitle */}
        <EditableText
          as="p"
          fieldPath="hero.subtitle"
          value={tagline}
          style={{
            fontSize: 'clamp(13px, 1.2vw, 15px)',
            color: 'rgba(255, 255, 255, 0.88)',
            maxWidth: '620px',
            margin: '0 auto 32px',
            lineHeight: 1.65,
            letterSpacing: '0.02em',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.8)',
          }}
        />

        {/* CTA Buttons Pair */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href={primaryButtonLink}
            style={{
              padding: '13px 30px',
              background: 'rgba(15, 36, 34, 0.85)',
              border: '1px solid rgba(201, 147, 90, 0.55)',
              color: '#ffffff',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.25s ease',
            }}
          >
            <EditableText
              as="span"
              fieldPath="hero.primaryCtaText"
              value={primaryButtonText}
            />
          </Link>

          <Link
            href={secondaryButtonLink}
            style={{
              padding: '13px 30px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.25s ease',
            }}
          >
            <EditableText
              as="span"
              fieldPath="hero.secondaryCtaText"
              value={secondaryButtonText}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
