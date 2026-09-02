'use client';

import React, { useState } from 'react';
import { Play, X, ArrowUpRight } from 'lucide-react';
import { urlForImage } from '../sanity/lib/image';

export interface VideoReelItem {
  _id?: string;
  title: string;
  thumbnail?: any;
  videoUrl?: string;
  videoFileUrl?: string;
  views?: string;
  productLink?: string;
}

const defaultReels: VideoReelItem[] = [
  {
    title: 'Unboxing Royal Oud Extrait',
    views: '124.5K views',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-perfume-bottle-in-a-glass-box-42984-large.mp4',
  },
  {
    title: 'How to make attar last 24+ hours',
    views: '98.2K views',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-spraying-perfume-on-her-neck-43003-large.mp4',
  },
  {
    title: 'Smells like luxury hotel lobby',
    views: '215.1K views',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-perfume-into-a-bottle-43004-large.mp4',
  },
  {
    title: 'Hand-poured Soy Candle Burn Test',
    views: '84.3K views',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-candle-flame-burning-in-the-dark-42999-large.mp4',
  },
  {
    title: 'Honest perfume review from customer',
    views: '176.9K views',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-applying-perfume-43005-large.mp4',
  },
];

export default function VideoReelsSection({ reels }: { reels?: VideoReelItem[] }) {
  const displayReels = reels && reels.length > 0 ? reels : defaultReels;
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="reels-section" id="reels">
      <div className="section-header-center">
        <span className="section-overline">COMMUNITY & SHOWCASE</span>
        <h2 className="section-title font-serif">Trending Fragrance Reels</h2>
        <p className="section-subtitle">
          Real reactions, unboxings, and scent stories from our fragrance community.
        </p>
      </div>

      <div className="reels-scroll-container">
        {displayReels.map((reel, idx) => {
          const thumbUrl = reel.thumbnail ? urlForImage(reel.thumbnail).url() : null;
          const mediaSrc = reel.videoFileUrl || reel.videoUrl || defaultReels[idx % defaultReels.length].videoUrl;

          return (
            <div
              key={reel._id || idx}
              className="reel-card"
              onClick={() => setActiveVideo(mediaSrc || null)}
            >
              <div className="reel-thumbnail-wrap">
                {thumbUrl ? (
                  <img src={thumbUrl} alt={reel.title} className="reel-cover-img" />
                ) : (
                  <video
                    src={mediaSrc}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="reel-video-preview"
                  />
                )}
                <div className="reel-overlay-gradient"></div>
                <div className="reel-play-icon">
                  <Play size={18} fill="#121212" color="#121212" />
                </div>
                {reel.views && <span className="reel-views-badge">{reel.views}</span>}
              </div>
              <div className="reel-info">
                <h3 className="reel-title">{reel.title}</h3>
                <span className="reel-shop-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Tap to watch video <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Full Screen Video Modal */}
      {activeVideo && (
        <div className="video-modal-backdrop" onClick={() => setActiveVideo(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setActiveVideo(null)}>
              <X size={24} />
            </button>
            <video src={activeVideo} controls autoPlay className="modal-video-element" />
          </div>
        </div>
      )}
    </section>
  );
}
