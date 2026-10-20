'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { storeData, updateField } = useVisualEdit();

  const envelopeImage = storeData?.siteSettings?.footerEnvelopeImage || '/images/envelope-wax-seal.png';
  const newsletterDesc =
    storeData?.siteSettings?.footerNewsletterDesc ||
    'Be the first to know about new drops, samples & exclusive scents.';
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
        backgroundColor: '#162024',
        color: '#ffffff',
        padding: '56px 24px 38px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* Top Centered Envelope with Golden Wax Seal & Brand Slogan */}
        <div style={{ textAlign: 'center', marginBottom: '38px' }}>
          <div style={{ display: 'inline-block', width: '58px', marginBottom: '12px' }}>
            <EditableImage
              src={envelopeImage}
              alt="Noor-e-Flames Wax Sealed Envelope"
              label="Footer Wax Sealed Envelope"
              onImageChange={(url) => updateField('siteSettings.footerEnvelopeImage', url)}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
          <h3
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#ffffff',
              margin: '0 0 5px 0',
              fontFamily: 'inherit',
            }}
          >
            WHERE FRAGRANCE MEETS FLAMES
          </h3>
          <p
            style={{
              fontSize: '11px',
              fontStyle: 'italic',
              fontWeight: 400,
              letterSpacing: '0.02em',
              color: 'rgba(255, 255, 255, 0.88)',
              margin: 0,
              fontFamily: 'inherit',
            }}
          >
            “Because every fragrance tells a story, and every flame creates a moment.”
          </p>
        </div>

        {/* 3 Main Columns Matching Reference Layout */}
        <div
          className="footer-columns-grid"
        >
          {/* Col 1: FINE PRINT */}
          <div className="footer-col footer-col-1">
            <h4
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '18px',
                fontFamily: 'inherit',
              }}
            >
              FINE PRINT
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <li>
                <Link
                  href="/privacy-policy"
                  style={{
                    color: 'rgba(255, 255, 255, 0.82)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  style={{
                    color: 'rgba(255, 255, 255, 0.82)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  style={{
                    color: 'rgba(255, 255, 255, 0.82)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  style={{
                    color: 'rgba(255, 255, 255, 0.82)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: LEARN MORE */}
          <div className="footer-col footer-col-2">
            <h4
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '18px',
                fontFamily: 'inherit',
              }}
            >
              LEARN MORE
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <li>
                <Link
                  href="/about"
                  style={{
                    color: 'rgba(255, 255, 255, 0.82)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  style={{
                    color: 'rgba(255, 255, 255, 0.82)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  style={{
                    color: 'rgba(255, 255, 255, 0.82)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  style={{
                    color: 'rgba(255, 255, 255, 0.82)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/candle-care"
                  style={{
                    color: '#BBA58E',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#BBA58E')}
                >
                  Candle Care & Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: SUBSCRIBE FOR OFFERS */}
          <div className="footer-col footer-col-3">
            <h4
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '12px',
                fontFamily: 'inherit',
              }}
            >
              SUBSCRIBE FOR OFFERS
            </h4>
            <EditableText
              as="p"
              value={newsletterDesc}
              onValueChange={(val) => updateField('siteSettings.footerNewsletterDesc', val)}
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.72)',
                lineHeight: 1.45,
                marginBottom: '16px',
                maxWidth: '360px',
              }}
            />

            {/* Outlined Pill Input with Inside Dark JOIN Button */}
            <form onSubmit={handleSubscribe} style={{ maxWidth: '360px', marginBottom: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.38)',
                  borderRadius: '9999px',
                  padding: '3px 4px 3px 18px',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#111618',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '9999px',
                    transition: 'background 0.2s, opacity 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0b0f10')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111618')}
                >
                  {subscribed ? 'JOINED ✓' : 'JOIN →'}
                </button>
              </div>
              {subscribed && (
                <span
                  style={{
                    fontSize: '11.5px',
                    color: '#86efac',
                    marginTop: '8px',
                    display: 'block',
                    fontWeight: 500,
                  }}
                >
                  ✓ You&apos;re subscribed! Welcome to Noor-E-Flames.
                </span>
              )}
            </form>

            {/* Social Outlined Circles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {(() => {
                const social = storeData?.siteSettings?.socialLinks;
                const items: { id: string; label: string; href: string; icon: React.ReactNode }[] = [];

                const ig = social?.instagram || 'https://www.instagram.com/nooreflames?mdxt=OW4zcnJ2MXRlaGZ5';
                if (ig) items.push({ id: 'instagram', label: 'Instagram', href: ig, icon: <InstagramIcon /> });

                const wa = social?.whatsapp || 'https://wa.me/918368291472';
                if (wa) {
                  const href = wa.startsWith('http') ? wa : `https://wa.me/${wa.replace(/\D/g, '')}`;
                  items.push({ id: 'whatsapp', label: 'WhatsApp', href, icon: <WhatsAppIcon /> });
                }

                const em = social?.email || 'nooreflames@gmail.com';
                if (em) {
                  const href = em.startsWith('mailto:') ? em : `mailto:${em}`;
                  items.push({ id: 'email', label: 'Email', href, icon: <MailIcon /> });
                }

                if (social?.linkedin) {
                  items.push({ id: 'linkedin', label: 'LinkedIn', href: social.linkedin, icon: <LinkedInIcon /> });
                }
                if (social?.facebook) {
                  items.push({ id: 'facebook', label: 'Facebook', href: social.facebook, icon: <FacebookIcon /> });
                }
                if (social?.youtube) {
                  items.push({ id: 'youtube', label: 'YouTube', href: social.youtube, icon: <YoutubeIcon /> });
                }
                if (social?.twitter) {
                  items.push({ id: 'twitter', label: 'Twitter / X', href: social.twitter, icon: <TwitterIcon /> });
                }
                if (social?.customLinks && Array.isArray(social.customLinks)) {
                  social.customLinks.forEach((cl) => {
                    if (cl.url && cl.active !== false) {
                      items.push({ id: cl.id, label: cl.label || 'Link', href: cl.url, icon: <GlobeIcon /> });
                    }
                  });
                }

                return items.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255, 255, 255, 0.28)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255, 255, 255, 0.85)',
                      textDecoration: 'none',
                      transition: 'border-color 0.2s, background 0.2s, color 0.2s, transform 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#c5a059';
                      e.currentTarget.style.backgroundColor = 'rgba(197, 160, 89, 0.18)';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {item.icon}
                  </a>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Minimalist Bottom Copyright Row */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '20px',
            marginTop: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          <div>
            <EditableText
              as="span"
              value={copyright}
              onValueChange={(val) => updateField('siteSettings.footerCopyright', val)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/admin"
              style={{
                color: 'rgba(255, 255, 255, 0.55)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)')}
            >
              ⚙ Commerce Hub Admin
            </Link>
          </div>
        </div>
      </div>


    </footer>
  );
}
