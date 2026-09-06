'use client';

import React, { useState } from 'react';
import { Quote, Play, X } from 'lucide-react';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials?: any[];
} = {}) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const { storeData, updateField } = useVisualEdit();

  const title = storeData?.siteSettings?.testimonialsTitle || 'Voices of NOOR - E - FLAMES';
  const badge = storeData?.siteSettings?.testimonialsBadge || '★ LOVED BY 5000+ CUSTOMERS ★';
  const review1Photo = storeData?.siteSettings?.review1Photo || '/images/reviews/review-photo-1.jpg';
  const review2Photo = storeData?.siteSettings?.review2Photo || '/images/reviews/review-photo-2.jpg';

  const [t1, setT1] = useState({
    quote: 'The longevity is unreal. Royal Oud lasted 14 hours on my coat, and the Whispered Surprises candle secret message melted into view perfectly!',
    author: 'Priya S.',
    location: '• Verified Buyer, Mumbai',
  });

  const [t2, setT2] = useState({
    quote: 'Best discovery set in India. The scent profile rivals niche French houses at 1/5th the price. Truly extraordinary craftsmanship and sillage.',
    author: 'Kunal M.',
    location: '• Verified Buyer, Bengaluru',
  });

  return (
    <section
      className="voices-section"
      id="reviews"
      style={{
        padding: '50px 24px 80px',
        maxWidth: '1360px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Decorative Wavy Lines on Right (matching screenshot) */}
      <div
        style={{
          position: 'absolute',
          right: '16px',
          top: '40px',
          color: '#5db0a8',
          opacity: 0.6,
          fontSize: '24px',
          lineHeight: '14px',
          userSelect: 'none',
          fontFamily: 'monospace',
          letterSpacing: '-2px',
        }}
      >
        ≈≈≈<br />≈≈≈<br />≈≈≈
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <EditableText
          as="h2"
          value={title}
          onValueChange={(val) => updateField('siteSettings.testimonialsTitle', val)}
          className="font-serif"
          style={{
            fontSize: 'clamp(26px, 3.5vw, 42px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            color: '#1a1a1a',
            marginBottom: '10px',
          }}
        />

        {/* Pink Badge Sticker */}
        <div style={{ display: 'inline-block' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              color: '#ffffff',
              fontSize: '10.5px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.25)',
            }}
          >
            <EditableText
              as="span"
              value={badge}
              onValueChange={(val) => updateField('siteSettings.testimonialsBadge', val)}
            />
          </span>
        </div>
      </div>

      {/* Soft Warm Cream Container */}
      <div
        style={{
          background: '#fcf6ee',
          borderRadius: '24px',
          padding: '28px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            alignItems: 'stretch',
          }}
        >
          {/* Card 1: Teal Quote Card */}
          <div
            style={{
              background: '#2b5853',
              borderRadius: '16px',
              padding: '24px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 6px 20px rgba(43, 88, 83, 0.18)',
            }}
          >
            <Quote size={28} color="#dfab72" style={{ marginBottom: '12px', opacity: 0.9 }} />
            <EditableText
              as="p"
              value={t1.quote}
              onValueChange={(val) => setT1((p) => ({ ...p, quote: val }))}
              style={{ fontSize: '13px', lineHeight: 1.6, fontStyle: 'italic', color: '#e8f3f1', margin: 0 }}
            />
            <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <EditableText
                as="span"
                value={t1.author}
                onValueChange={(val) => setT1((p) => ({ ...p, author: val }))}
                style={{ fontSize: '12px', fontWeight: 700, color: '#dfab72' }}
              />
              <EditableText
                as="span"
                value={t1.location}
                onValueChange={(val) => setT1((p) => ({ ...p, location: val }))}
                style={{ fontSize: '11px', color: '#a3c2be', marginLeft: '6px' }}
              />
            </div>
          </div>

          {/* Card 2: Photo of Customer with Blue Gift Box */}
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              height: '320px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <EditableImage
              src={review1Photo}
              alt="Happy customer with Noor-e-Flames gift box"
              label="Review Customer 1"
              onImageChange={(url) => updateField('siteSettings.review1Photo', url)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div
              onClick={() => setActiveVideo('/videos/reels/IMG_5931.MP4')}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <Play size={14} fill="#ffffff" />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px 14px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 600,
                zIndex: 10,
              }}
            >
              Sneha S. · Unboxing Experience
            </div>
          </div>

          {/* Card 3: Teal Quote Card */}
          <div
            style={{
              background: '#2b5853',
              borderRadius: '16px',
              padding: '24px',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 6px 20px rgba(43, 88, 83, 0.18)',
            }}
          >
            <Quote size={28} color="#dfab72" style={{ marginBottom: '12px', opacity: 0.9 }} />
            <EditableText
              as="p"
              value={t2.quote}
              onValueChange={(val) => setT2((p) => ({ ...p, quote: val }))}
              style={{ fontSize: '13px', lineHeight: 1.6, fontStyle: 'italic', color: '#e8f3f1', margin: 0 }}
            />
            <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <EditableText
                as="span"
                value={t2.author}
                onValueChange={(val) => setT2((p) => ({ ...p, author: val }))}
                style={{ fontSize: '12px', fontWeight: 700, color: '#dfab72' }}
              />
              <EditableText
                as="span"
                value={t2.location}
                onValueChange={(val) => setT2((p) => ({ ...p, location: val }))}
                style={{ fontSize: '11px', color: '#a3c2be', marginLeft: '6px' }}
              />
            </div>
          </div>

          {/* Card 4: Photo of Customer with Flacon */}
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              height: '320px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <EditableImage
              src={review2Photo}
              alt="Happy customer with Noor-e-Flames perfume flacon"
              label="Review Customer 2"
              onImageChange={(url) => updateField('siteSettings.review2Photo', url)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div
              onClick={() => setActiveVideo('/videos/reels/IMG_5927.MP4')}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <Play size={14} fill="#ffffff" />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px 14px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 600,
                zIndex: 10,
              }}
            >
              Aarav D. · Signature Scent Review
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Video Modal */}
      {activeVideo && (
        <div
          className="video-modal-backdrop"
          onClick={() => setActiveVideo(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 20, 19, 0.94)',
            backdropFilter: 'blur(14px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '440px',
              width: '100%',
              borderRadius: '20px',
              background: '#0f2422',
              border: '1px solid rgba(201, 147, 90, 0.4)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderBottom: '1px solid rgba(201, 147, 90, 0.2)',
                color: '#dfab72',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700 }}>✦ CUSTOMER SCENT STORY</span>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <X size={22} />
              </button>
            </div>
            <video
              src={activeVideo}
              controls
              autoPlay
              playsInline
              style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
