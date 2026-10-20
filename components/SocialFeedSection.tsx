'use client';

import React from 'react';
import { useVisualEdit } from '@/context/VisualEditContext';

const InstagramIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const socialPosts = [
  { image: '/images/social/whispered-surprises-hands.jpg', tag: '#WhisperedSurprises', desc: 'Secret message reveals as wax melts' },
  { image: '/images/products/cutting-chai-candle.jpg', tag: '#CuttingChai', desc: 'Cardamom & spiced tea nostalgia' },
  { image: '/images/products/mango-berry-bliss.jpg', tag: '#DessertCandles', desc: 'Artisanal fruit coupe creations' },
  { image: '/images/products/rose-bear-duo.jpg', tag: '#RoseBear', desc: 'Heart-holding soy wax bears' },
  { image: '/images/products/strawberry-dessert-candle.jpg', tag: '#StrawberryDelight', desc: 'Hand-poured soy wax pastries' },
  { image: '/images/products/signature-white-giftbox.jpg', tag: '#UnboxingLuxury', desc: 'Signature Noor-e-Flames packaging' },
];

export default function SocialFeedSection() {
  const { storeData } = useVisualEdit();
  const instagramUrl =
    storeData?.siteSettings?.socialLinks?.instagram ||
    'https://www.instagram.com/nooreflames?mdxt=OW4zcnJ2MXRlaGZ5';

  return (
    <section className="social-feed-section">
      <div className="section-header-center">
        <span className="section-overline gold">INSTAGRAM & COMMUNITY</span>
        <h2 className="section-title font-serif">Join the #NoorEFlames Club</h2>
        <p className="section-subtitle">
          Tag{' '}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#c5a059', textDecoration: 'underline', fontWeight: 600 }}
          >
            @nooreflames
          </a>{' '}
          on Instagram to be featured in our monthly fragrance highlight gallery.
        </p>
      </div>

      <div className="social-grid">
        {socialPosts.map((post, idx) => (
          <a
            key={idx}
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div className="social-card-inner" style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden', borderRadius: '12px' }}>
              <img
                src={post.image}
                alt={post.tag}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              />
              <div className="social-card-hover font-serif">
                <span className="social-tag">{post.tag}</span>
                <span className="social-desc">{post.desc}</span>
                <span style={{ marginTop: '8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#c5a059', letterSpacing: '0.08em' }}>
                  <InstagramIcon /> View on Instagram ↗
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

