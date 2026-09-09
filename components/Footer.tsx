'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Check } from 'lucide-react';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
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

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
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

  const modalContent: Record<string, { title: string; content: string[] }> = {
    privacy: {
      title: 'PRIVACY POLICY',
      content: [
        'At NOOR - E - FLAMES, your privacy is paramount to our craft. We do not sell, rent, or trade your personal information with any third-party marketers.',
        'Information gathered during checkout (including name, shipping address, contact phone, and email) is encrypted and strictly used for order fulfillment, delivery tracking updates, and customer support.',
        'We adhere to high-grade SSL encryption and European-compliant data security standards.',
      ],
    },
    shipping: {
      title: 'SHIPPING & DISPATCH POLICY',
      content: [
        'We provide Express Delivery across all 28,000+ PIN codes in India. Orders are processed within 24 hours of placement.',
        'Standard Express transit timeline is 2 to 4 business days. Free shipping is automatically applied to all orders exceeding ₹999.',
        'Fragile items, secret message candles, and crystal extrait flacons are triple-boxed in custom foam cushioning to guarantee pristine arrival.',
      ],
    },
    terms: {
      title: 'TERMS OF SERVICE',
      content: [
        'All candles and botanical extraits from NOOR - E - FLAMES are handcrafted in artisanal small batches using 100% natural soy wax, IFRA-certified fragrance oils, and lead-free cotton wicks.',
        'Minor visual nuances in hand-poured candle frosting or glass tint are natural hallmarks of authentic artisan batch production.',
        'Prices listed are in Indian Rupees (INR) and are inclusive of all applicable domestic taxes.',
      ],
    },
    refund: {
      title: 'REFUND & REPLACEMENT POLICY',
      content: [
        'We offer a 7-day hassle-free replacement warranty on any order damaged during shipping transit.',
        'If your package arrives compromised, simply take a photo and contact our atelier team at support@noor-e-flames.com or via WhatsApp.',
        'We will dispatch a fresh, complimentary handcrafted unit within 24 hours — no tedious return shipping required.',
      ],
    },
    contact: {
      title: 'CONTACT OUR ATELIER',
      content: [
        'Need bespoke fragrance recommendations, gifting inquiries, or bridal registry support? Our concierge is available 7 days a week.',
        'Atelier Email: nooreflames@gmail.com',
        'Direct Phone / WhatsApp: +91 8700531607 (Mon–Sat, 10 AM – 7 PM IST)',
        'NOOR - E - FLAMES Atelier Studio, Plot no-13, Kashmiri colony, Khaira, Najafgarh, New Delhi - 110043, India.',
        'Founder & Atelier Director: Priyanshu',
      ],
    },
    faq: {
      title: 'FREQUENTLY ASKED QUESTIONS',
      content: [
        'Q: What is a Whispered Surprises secret message candle?\nA: As the 100% soy wax melts into a clear pool (approx. 20-30 mins into first burn), an embossed secret golden message emerges cleanly from the molten wax.',
        'Q: What makes your Extraits different from normal EDPs?\nA: Our botanical perfumes feature 35% pure fragrance oil concentration (Extrait de Parfum), providing 14+ hours of lasting sillage on skin and garments.',
        'Q: Are your candles pet-friendly?\nA: Yes! 100% paraffin-free soy wax with non-toxic lead-free wicks and phthalate-free European certified oils.',
      ],
    },
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
              fontSize: '10.5px',
              fontWeight: 400,
              letterSpacing: '0.02em',
              color: 'rgba(255, 255, 255, 0.72)',
              margin: 0,
              fontFamily: 'inherit',
            }}
          >
            Modern artisanal scented candles & luxury fine perfumes.
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
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.82)',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('shipping')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.82)',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('terms')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.82)',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('refund')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.82)',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  Refund Policy
                </button>
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
                <button
                  type="button"
                  onClick={() => setActiveModal('contact')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.82)',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('faq')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.82)',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)')}
                >
                  FAQ
                </button>
              </li>
              <li>
                <Link
                  href="/about#story"
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
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
                  transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                }}
              >
                <InstagramIcon />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
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
                  transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                }}
              >
                <FacebookIcon />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
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
                  transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                }}
              >
                <YoutubeIcon />
              </a>
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

      {/* Interactive Policy Information Modal */}
      {activeModal && modalContent[activeModal] && (
        <div
          className="footer-legal-modal-backdrop"
          onClick={() => setActiveModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 16, 18, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="footer-legal-modal-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1a2529',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              color: '#ffffff',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
            >
              <X size={18} />
            </button>

            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                marginBottom: '18px',
                color: '#ffffff',
              }}
            >
              {modalContent[activeModal].title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {modalContent[activeModal].content.map((paragraph, idx) => (
                <p
                  key={idx}
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.88)',
                    margin: 0,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div style={{ marginTop: '26px', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{
                  background: '#ffffff',
                  color: '#162024',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                }}
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
