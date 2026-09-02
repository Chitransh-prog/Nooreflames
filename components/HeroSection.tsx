import React from 'react';
import Link from 'next/link';
import { Waves } from 'lucide-react';
import { urlForImage } from '../sanity/lib/image';

interface HeroData {
  title?: string;
  tagline?: string;
  buttonText?: string;
  buttonLink?: string;
  desktopImage?: any;
  mobileImage?: any;
}

export default function HeroSection({ hero }: { hero?: HeroData }) {
  const title = hero?.title || 'SMELLS LIKE A DIP IN THE OCEAN';
  const tagline =
    hero?.tagline ||
    'Experience the invigorating breeze of marine notes, bergamot, and sun-kissed amber.';
  const buttonText = hero?.buttonText || 'EXPLORE COLLECTION';
  const buttonLink = hero?.buttonLink || '#ocean-fresh';

  const bgImageUrl = hero?.desktopImage ? urlForImage(hero.desktopImage).url() : null;

  return (
    <section className="hero-banner-section" id="hero">
      <div
        className="hero-backdrop"
        style={{
          backgroundImage: bgImageUrl
            ? `linear-gradient(135deg, rgba(220, 240, 248, 0.85) 0%, rgba(200, 230, 242, 0.95) 100%), url('${bgImageUrl}')`
            : undefined,
        }}
      >
        <div className="hero-content-wrapper">
          {/* Main Typography & Headline */}
          <div className="hero-text-block">
            <span className="hero-sub-tag">NOOR-E-FLAMES SIGNATURE</span>
            <h1 className="hero-main-title font-serif">{title}</h1>
            <p className="hero-description">{tagline}</p>
            <div className="hero-cta-group">
              <Link href={buttonLink} className="btn-hero-primary">
                {buttonText}
              </Link>
              <Link href="#discovery" className="btn-hero-secondary">
                TRY DISCOVERY SET — ₹999
              </Link>
            </div>
          </div>

          {/* Model / Perfume Bottle Visual */}
          <div className="hero-visual-block">
            <div className="hero-image-frame">
              {bgImageUrl ? (
                <img src={bgImageUrl} alt="Noor-E-Flames Ocean EDP" className="hero-main-img" />
              ) : (
                <div className="hero-fallback-visual">
                  <div className="perfume-bottle-mockup">
                    <span className="bottle-cap"></span>
                    <span className="bottle-label">NOOR-E-FLAMES</span>
                    <span className="bottle-sub">OCEANIC MIST</span>
                  </div>
                </div>
              )}

              {/* Floating Product Preview Tag Card */}
              <div className="hero-floating-card">
                <div className="floating-card-thumb">
                  <Waves size={24} color="#1b3d39" />
                </div>
                <div className="floating-card-info">
                  <div className="floating-card-title">Oceanic Mist Extrait</div>
                  <div className="floating-card-price">
                    ₹1,499 <span className="orig">₹1,999</span>
                  </div>
                </div>
                <Link href="#ocean-fresh" className="floating-card-buy-btn">
                  BUY NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
