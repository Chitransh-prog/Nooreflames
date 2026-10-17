'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Droplets,
  Award,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText } from './visual-edit/EditableElements';

export default function AboutUsSection() {
  const { storeData, updateField } = useVisualEdit();

  const badge =
    storeData?.siteSettings?.aboutSectionBadge || '✦ THE ATELIER HERITAGE · EST. NEW DELHI ✦';
  const title =
    storeData?.siteSettings?.aboutSectionTitle || 'Where Fragrance Meets Flames';
  const subtitle =
    storeData?.siteSettings?.aboutSectionSubtitle ||
    '“Luxury inspired by nature. Crafted with passion. Remembered through fragrance.”';
  const leadQuote =
    storeData?.siteSettings?.aboutSectionLeadQuote ||
    'At NOOR-E-FLAMES, we believe true luxury isn’t loud. It’s pure. It’s intentional. It’s timeless.';
  const paragraph1 =
    storeData?.siteSettings?.aboutSectionPara1 ||
    'Founded in New Delhi, NOOR-E-FLAMES was born from a desire to bring soul back into olfactory living. We craft experiences that linger in minds and hearts—rejecting fleeting trends in favor of authentic Indian botanical heritage, clean-burning soy candles with secret messages, and 20% EAU DE PARFUM concentrations.';

  return (
    <section className="about-home-section" id="about">
      <div className="about-home-container">
        {/* Section Header */}
        <div className="about-home-header">
          <div className="about-home-badge-wrapper">
            <span className="about-home-badge">
              <Sparkles size={12} className="about-home-badge-icon" />
              <EditableText
                as="span"
                value={badge}
                onValueChange={(val) => updateField('siteSettings.aboutSectionBadge', val)}
              />
            </span>
          </div>

          <EditableText
            as="h2"
            value={title}
            onValueChange={(val) => updateField('siteSettings.aboutSectionTitle', val)}
            className="about-home-title font-serif"
          />

          <EditableText
            as="p"
            value={subtitle}
            onValueChange={(val) => updateField('siteSettings.aboutSectionSubtitle', val)}
            className="about-home-subtitle"
          />
        </div>

        {/* Atmospheric Split Content Grid */}
        <div className="about-home-grid">
          {/* Left Column: Brand Manifesto & Pillars */}
          <div className="about-home-content">
            <div className="about-home-quote-card">
              <p className="about-home-quote-text font-serif">
                &ldquo;{leadQuote}&rdquo;
              </p>
            </div>

            <EditableText
              as="p"
              value={paragraph1}
              onValueChange={(val) => updateField('siteSettings.aboutSectionPara1', val)}
              className="about-home-body-text"
            />

            {/* Three Pillars Micro-Cards */}
            <div className="about-home-pillars">
              <div className="about-home-pillar-item">
                <div className="about-home-pillar-icon-box">
                  <Droplets size={18} color="#BBA58E" />
                </div>
                <div>
                  <h4 className="about-home-pillar-title">Pillar I · Pure</h4>
                  <p className="about-home-pillar-desc">
                    100% natural soy wax, clean formulation, non-toxic and zero paraffin.
                  </p>
                </div>
              </div>

              <div className="about-home-pillar-item">
                <div className="about-home-pillar-icon-box">
                  <Heart size={18} color="#BBA58E" />
                </div>
                <div>
                  <h4 className="about-home-pillar-title">Pillar II · Intentional</h4>
                  <p className="about-home-pillar-desc">
                    Hand-poured in small batches with embedded secret keepsake message reveals.
                  </p>
                </div>
              </div>

              <div className="about-home-pillar-item">
                <div className="about-home-pillar-icon-box">
                  <Award size={18} color="#BBA58E" />
                </div>
                <div>
                  <h4 className="about-home-pillar-title">Pillar III · Timeless</h4>
                  <p className="about-home-pillar-desc">
                    Unrivaled 20% EAU DE PARFUM concentration delivering 14+ hours of lasting sillage.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="about-home-actions">
              <Link href="/about" className="about-home-btn-primary">
                <span>Read Full Atelier Heritage</span>
                <ArrowRight size={15} />
              </Link>

              <a
                href="https://wa.me/919289289800?text=Hello%20NOOR-E-FLAMES%20Atelier,%20I%20would%20like%20to%20learn%20more%20about%20your%20story%20and%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="about-home-btn-secondary"
              >
                <MessageCircle size={15} />
                <span>Chat with Atelier Concierge</span>
              </a>
            </div>
          </div>

          {/* Right Column: Layered Luxury Visual Showcase */}
          <div className="about-home-media-wrapper">
            <div className="about-home-media-card">
              <img
                src="/images/banners/brand-packaging-banner.jpg"
                alt="NOOR-E-FLAMES Handcrafted Packaging & Atelier Craft"
                className="about-home-main-image"
                loading="lazy"
              />

              {/* Top Luxury Badge */}
              <div className="about-home-media-badge">
                <MapPin size={13} style={{ color: '#D4AF37' }} />
                <span>HANDCRAFTED IN NEW DELHI · INDIA</span>
              </div>

              {/* Bottom Floating Glass Card */}
              <div className="about-home-floating-card">
                <div className="about-home-floating-avatar">
                  <span>N</span>
                </div>
                <div className="about-home-floating-text">
                  <h5 className="about-home-floating-title">Artisanal Batch Promise</h5>
                  <p className="about-home-floating-quote font-serif">
                    &ldquo;We don’t follow trends—we create memories that stay with you forever.&rdquo;
                  </p>
                  <span className="about-home-floating-author">
                    NOOR-E-FLAMES Atelier
                  </span>
                </div>
              </div>
            </div>

            {/* Ambient Background Glow Frame */}
            <div className="about-home-media-backdrop" />
          </div>
        </div>
      </div>
    </section>
  );
}
