import React from 'react';
import { Flame, Sparkles, Flower2, Package } from 'lucide-react';

const socialPosts = [
  { image: '/images/social/whispered-surprises-hands.jpg', tag: '#WhisperedSurprises', desc: 'Secret message reveals as wax melts' },
  { image: '/images/products/cutting-chai-candle.jpg', tag: '#CuttingChai', desc: 'Cardamom & spiced tea nostalgia' },
  { image: '/images/products/mango-berry-bliss.jpg', tag: '#DessertCandles', desc: 'Artisanal fruit coupe creations' },
  { image: '/images/products/rose-bear-duo.jpg', tag: '#RoseBear', desc: 'Heart-holding soy wax bears' },
  { image: '/images/products/strawberry-dessert-candle.jpg', tag: '#StrawberryDelight', desc: 'Hand-poured soy wax pastries' },
  { image: '/images/products/signature-white-giftbox.jpg', tag: '#UnboxingLuxury', desc: 'Signature Noor-e-Flames packaging' },
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
            <div className="social-card-inner" style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden', borderRadius: '12px' }}>
              <img
                src={post.image}
                alt={post.tag}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              />
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
