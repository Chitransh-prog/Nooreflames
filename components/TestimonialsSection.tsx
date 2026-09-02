'use client';

import React, { useState } from 'react';
import { Play, X, Star, Quote } from 'lucide-react';
import { urlForImage } from '../sanity/lib/image';

export interface TestimonialItem {
  _id?: string;
  authorName: string;
  authorRole?: string;
  quote?: string;
  rating?: number;
  authorImage?: any;
  videoUrl?: string;
  isVideo?: boolean;
}

const defaultTestimonials: TestimonialItem[] = [
  {
    authorName: 'Raghav V.',
    authorRole: 'Mumbai • Verified Buyer',
    quote:
      '"Royal Oud EDP is literally insane. I got 5 compliments on my first day at office. Sillage is unbelievable!"',
    rating: 5,
    isVideo: false,
  },
  {
    authorName: 'Sneha Sharma',
    authorRole: 'Delhi • Perfume Collector',
    quote: '"The alcohol-free attars are pure perfection. Velvet Rose stays on skin for over 24 hours without irritating."',
    rating: 5,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-applying-perfume-43005-large.mp4',
    isVideo: true,
  },
  {
    authorName: 'Karan Mehra',
    authorRole: 'Bengaluru • Verified Buyer',
    quote:
      '"I was skeptical about buying perfume online, but Oceanic Mist smells exactly like high-end designer brands."',
    rating: 5,
    isVideo: false,
  },
  {
    authorName: 'Aarav Gupta',
    authorRole: 'Hyderabad • Verified Buyer',
    quote: '"Hand-poured soy candle transformed my living space. Warm Sandalwood scent throw fills the entire 2BHK."',
    rating: 5,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-spraying-perfume-on-her-neck-43003-large.mp4',
    isVideo: true,
  },
];

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials?: TestimonialItem[];
}) {
  const displayItems =
    testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;
  const [activeModalVideo, setActiveModalVideo] = useState<string | null>(null);

  return (
    <section className="testimonials-section" id="reviews">
      <div className="section-header-center">
        <span className="section-overline gold">REAL REVIEWS & STORIES</span>
        <h2 className="section-title font-serif">Voices of NOOR-E-FLAMES</h2>
        <div className="as-featured-pill">
          <span>AS FEATURED ON</span>
          <span className="featured-channel-tag font-serif">LALLANTOP</span>
          <span>•</span>
          <span className="featured-channel-tag font-serif">VOGUE</span>
          <span>•</span>
          <span className="featured-channel-tag font-serif">GQ INDIA</span>
        </div>
      </div>

      <div className="testimonials-grid">
        {displayItems.map((item, idx) => {
          const imgUrl = item.authorImage ? urlForImage(item.authorImage).url() : null;

          return (
            <div key={item._id || idx} className="testimonial-card">
              {item.isVideo ? (
                <div
                  className="testimonial-video-box"
                  onClick={() => item.videoUrl && setActiveModalVideo(item.videoUrl)}
                >
                  {imgUrl ? (
                    <img src={imgUrl} alt={item.authorName} className="testimonial-cover" />
                  ) : (
                    <video
                      src={item.videoUrl}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="testimonial-video-preview"
                    />
                  )}
                  <div className="video-play-overlay">
                    <span className="play-btn-circle">
                      <Play size={20} fill="#121212" color="#121212" />
                    </span>
                  </div>
                  <div className="testimonial-video-info">
                    <div className="testimonial-quote-snippet">{item.quote}</div>
                    <div className="testimonial-author-name">{item.authorName}</div>
                  </div>
                </div>
              ) : (
                <div className="testimonial-quote-box">
                  <Quote size={32} color="#c9935a" style={{ marginBottom: '12px' }} />
                  <div className="rating-stars-gold" style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="#c9935a" color="#c9935a" />
                    ))}
                  </div>
                  <p className="testimonial-quote-text">{item.quote}</p>
                  <div className="testimonial-author-meta">
                    <div className="author-avatar-circle">
                      {imgUrl ? (
                        <img src={imgUrl} alt={item.authorName} />
                      ) : (
                        <span>{item.authorName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="author-name-text">{item.authorName}</div>
                      <div className="author-role-text">{item.authorRole || 'Verified Customer'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Video Review Modal */}
      {activeModalVideo && (
        <div className="video-modal-backdrop" onClick={() => setActiveModalVideo(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setActiveModalVideo(null)}>
              <X size={24} />
            </button>
            <video src={activeModalVideo} controls autoPlay className="modal-video-element" />
          </div>
        </div>
      )}
    </section>
  );
}
