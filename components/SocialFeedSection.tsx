import React from 'react';
import { Flame, Sparkles, Flower2, Package } from 'lucide-react';

const socialPosts = [
  { icon: <Flame size={44} color="#1b3d39" />, tag: '#CandleMagic', desc: 'Hand-poured evening rituals' },
  { icon: <Sparkles size={44} color="#1b3d39" />, tag: '#Sillageday', desc: 'Compliments guaranteed' },
  { icon: <Flower2 size={44} color="#1b3d39" />, tag: '#AttarLovers', desc: 'Pure concentrated botanical oils' },
  { icon: <Package size={44} color="#1b3d39" />, tag: '#Unboxing', desc: 'Luxury velvet box reveal' },
];

export default function SocialFeedSection() {
  return (
    <section className="social-feed-section">
      <div className="section-header-center">
        <span className="section-overline gold">INSTAGRAM & COMMUNITY</span>
        <h2 className="section-title font-serif">Join the #NoorEFlames Club</h2>
        <p className="section-subtitle">
          Tag @nooreflames on Instagram to be featured in our monthly fragrance highlight gallery.
        </p>
      </div>

      <div className="social-grid">
        {socialPosts.map((post, idx) => (
          <div key={idx} className="social-card">
            <div className="social-card-inner">
              <div className="social-icon-wrap">{post.icon}</div>
              <div className="social-card-hover font-serif">
                <span className="social-tag">{post.tag}</span>
                <span className="social-desc">{post.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
