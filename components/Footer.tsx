'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import Logo from './Logo';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText } from './visual-edit/EditableElements';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { storeData, updateField } = useVisualEdit();

  const philosophy =
    storeData?.siteSettings?.footerPhilosophy ||
    'Where fragrance meets flames and scent craft comes alive. Handcrafted with pure botanicals and clean soy wax.';
  const newsletterTitle = storeData?.siteSettings?.footerNewsletterTitle || 'SUBSCRIBE FOR OFFERS';
  const newsletterDesc =
    storeData?.siteSettings?.footerNewsletterDesc ||
    'Be the first to access limited edition seasonal candle drops, secret message reveals, and private extrait releases.';
  const copyright =
    storeData?.siteSettings?.footerCopyright ||
    `© ${new Date().getFullYear()} NOOR - E - FLAMES. Handcrafted with passion in India. All Rights Reserved.`;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer
      style={{
        backgroundColor: '#0c1211',
        color: '#ffffff',
        padding: '70px 24px 40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top Centered Brand Crest & Philosophy */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-block', marginBottom: '14px' }}>
            <Logo size="medium" variant="light" />
          </div>
          <EditableText
            as="p"
            value={philosophy}
            onValueChange={(val) => updateField('siteSettings.footerPhilosophy', val)}
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.65)',
              letterSpacing: '0.04em',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* 3 Main Columns Matching Screenshot */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '60px',
            paddingBottom: '40px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Col 1: Fine Print */}
          <div>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#dfab72',
                marginBottom: '18px',
              }}
            >
              FINE PRINT
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/about" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}>
                  About Our Atelier
                </Link>
              </li>
              <li>
                <Link href="/#edps" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}>
                  Botanical Extraits & Sillage
                </Link>
              </li>
              <li>
                <Link href="/#candles" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}>
                  Hand-Poured Soy Wax Rituals
                </Link>
              </li>
              <li>
                <Link href="/#why-us" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}>
                  IFRA Safety & Clean Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Help & Support */}
          <div>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#dfab72',
                marginBottom: '18px',
              }}
            >
              HELP & SUPPORT
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/admin" style={{ color: '#dfab72', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
                  ⚙ Commerce Hub Admin
                </Link>
              </li>
              <li>
                <Link href="#reviews" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px' }}>
                  Verified Reviews & Stories
                </Link>
              </li>
              <li>
                <Link href="#trending-reels" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '13px' }}>
                  Customer Video Reels
                </Link>
              </li>
              <li>
                <span style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '13px' }}>
                  Express Delivery Across India (2-3 Days)
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Subscribe for Offers */}
          <div>
            <EditableText
              as="h4"
              value={newsletterTitle}
              onValueChange={(val) => updateField('siteSettings.footerNewsletterTitle', val)}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#dfab72',
                marginBottom: '18px',
              }}
            />
            <EditableText
              as="p"
              value={newsletterDesc}
              onValueChange={(val) => updateField('siteSettings.footerNewsletterDesc', val)}
              style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.5,
                marginBottom: '16px',
              }}
            />

            <form onSubmit={handleSubscribe} style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#dfab72',
                  border: 'none',
                  borderRadius: '4px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0c1211',
                  cursor: 'pointer',
                }}
              >
                {subscribed ? <Check size={16} /> : <ArrowRight size={16} />}
              </button>
            </form>
            {subscribed && (
              <span style={{ fontSize: '11px', color: '#4ade80', marginTop: '6px', display: 'block' }}>
                ✓ Thank you for subscribing to Noor-e-Flames!
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '11.5px',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <div>
            <EditableText
              as="span"
              value={copyright}
              onValueChange={(val) => updateField('siteSettings.footerCopyright', val)}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
