import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Heart, Sparkles, Clock, AlertTriangle, CheckCircle2, ChevronRight, Gift } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Candle Care & Safety Guide — NOOR-E-FLAMES',
  description:
    'Essential candle care rituals and safety instructions for NOOR-E-FLAMES handcrafted soy wax candles. Because every fragrance tells a story, and every flame creates a moment.',
};

export default function CandleCarePage() {
  return (
    <div className="legal-page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="legal-hero">
        <div className="legal-hero-container">
          <div className="legal-crest-badge">
            <span className="legal-crest-dot" />
            <span className="legal-crest-text">NOOR-E-FLAMES ATELIER · CANDLE RITUALS</span>
          </div>

          <h1 className="legal-hero-title">Candle Care & Safety</h1>
          <p className="legal-hero-subtitle" style={{ fontStyle: 'italic', color: '#BBA58E' }}>
            “Because every fragrance tells a story, and every flame creates a moment.”
          </p>

          <div className="legal-hero-meta">
            <span>100% Pure Soy Wax</span>
            <span className="legal-meta-divider">✦</span>
            <span>Clean Botanical Fragrances</span>
            <span className="legal-meta-divider">✦</span>
            <span>Handcrafted with Love in India</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="legal-container">
        <div className="legal-card">
          {/* Quick Pillars */}
          <div className="legal-highlight-row">
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Pure Soy Wax</span>
              <p className="legal-highlight-card-desc">Smooth, premium finish with a non-toxic clean burn.</p>
            </div>
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Made to Be Enjoyed</span>
              <p className="legal-highlight-card-desc">With proper care, enjoy for 1–2 months of memorable moments.</p>
            </div>
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Handcrafted Details</span>
              <p className="legal-highlight-card-desc">Sculpted wax designs and secret messages waiting inside.</p>
            </div>
          </div>

          {/* Section 1: Why Our Soy Wax Candles? */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">01</div>
              <h2 className="legal-section-title">Why Our Soy Wax Candles?</h2>
            </div>
            <p className="legal-text">
              At NOOR - E - FLAMES, each candle is thoughtfully poured using pure, ethical soy wax to bring warmth, comfort, and sensory magic into your personal living sanctuary.
            </p>

            <div className="candle-pillars-grid">
              <div style={{ background: '#fdfbf9', padding: '20px', borderRadius: '10px', border: '1px solid #ebd9c8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#162024' }}>
                  <Sparkles size={18} color="#BBA58E" />
                  <strong style={{ fontSize: '15px' }}>Beautiful Fragrances</strong>
                </div>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#555' }}>
                  Each candle is created with carefully selected fragrance blends to make your surroundings smell beautiful and inviting.
                </p>
              </div>

              <div style={{ background: '#fdfbf9', padding: '20px', borderRadius: '10px', border: '1px solid #ebd9c8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#162024' }}>
                  <Flame size={18} color="#BBA58E" />
                  <strong style={{ fontSize: '15px' }}>100% Soy Wax</strong>
                </div>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#555' }}>
                  Our candles are made using soy wax, giving them a smooth and premium finish that burns cleanly with zero paraffin.
                </p>
              </div>

              <div style={{ background: '#fdfbf9', padding: '20px', borderRadius: '10px', border: '1px solid #ebd9c8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#162024' }}>
                  <Gift size={18} color="#BBA58E" />
                  <strong style={{ fontSize: '15px' }}>Perfect for Gifting</strong>
                </div>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#555' }}>
                  From birthdays and anniversaries to small everyday surprises, our candles are made to make every occasion feel special.
                </p>
              </div>

              <div style={{ background: '#fdfbf9', padding: '20px', borderRadius: '10px', border: '1px solid #ebd9c8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#162024' }}>
                  <Clock size={18} color="#BBA58E" />
                  <strong style={{ fontSize: '15px' }}>Made to Be Enjoyed</strong>
                </div>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#555' }}>
                  Depending on the size of the candle and how frequently it is used, it can be enjoyed over an extended period. With occasional and proper use, it may last around 1–2 months.
                </p>
              </div>

              <div style={{ background: '#fdfbf9', padding: '20px', borderRadius: '10px', border: '1px solid #ebd9c8', gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#162024' }}>
                  <Heart size={18} color="#BBA58E" />
                  <strong style={{ fontSize: '15px' }}>Handcrafted with Love</strong>
                </div>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#555' }}>
                  Every candle is designed with beautiful details, making each piece special, unique, and deeply personal.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Candle Care & Safety Guidelines */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">02</div>
              <h2 className="legal-section-title">Essential Candle Care & Safety Rules</h2>
            </div>
            <p className="legal-text">
              To enjoy a safe, optimal, and soot-free burn every single time, please observe these guidelines:
            </p>

            <ul className="legal-list" style={{ marginTop: '16px' }}>
              <li>
                <strong>Never leave a burning candle unattended.</strong> Always extinguish before leaving the room or retiring for the evening.
              </li>
              <li>
                <strong>Keep away from children and pets.</strong> Ensure candles are placed well out of reach of curious hands and paws.
              </li>
              <li>
                <strong>Place the candle on a stable, heat-resistant surface.</strong> Never set on fragile, heat-sensitive, or uneven furniture.
              </li>
              <li>
                <strong>Keep away from curtains, paper, and other flammable objects.</strong> Maintain at least 1–2 feet of clearance on all sides.
              </li>
              <li>
                <strong>Do not touch or move the candle while the wax is hot.</strong> Liquid wax can spill and the container will retain heat.
              </li>
              <li>
                <strong>Trim the wick before each use for a better burning experience.</strong> Trim to 1/4 inch (or approx. 5mm) to maintain a steady, clean flame and prevent tunneling or excessive flame height.
              </li>
              <li>
                <strong>Decorative wax elements are part of the candle design—please do not consume them.</strong> Hand-piped wax berries, sculpted biscuits, and wax hearts look delicious but are crafted solely from fragrance wax for ambiance.
              </li>
            </ul>
          </div>

          {/* Section 3: The Secret Message Candle Ritual */}
          <div className="legal-section">
            <div className="legal-section-header">
              <div className="legal-section-num">03</div>
              <h2 className="legal-section-title">The Secret Message Candle Ritual</h2>
            </div>
            <p className="legal-text">
              For candles featuring hidden messages (like our viral Whispered Surprises), light the wooden wick and allow the candle to burn continuously for 60 to 90 minutes. As the pure golden soy wax forms a shimmering, translucent melt pool across the surface, your embossed heartfelt note floats gently into view.
            </p>
          </div>

          {/* Call to action */}
          <div style={{ textAlign: 'center', marginTop: '40px', padding: '30px', background: '#faf8f5', borderRadius: '12px', border: '1px solid #ebd9c8' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#162024', marginBottom: '8px' }}>
              Explore Our Handcrafted Candle Collection
            </h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
              From Secret Message candles to Cutting Chai & dessert coupes, crafted to make every moment unforgettable.
            </p>
            <Link
              href="/#candles"
              style={{
                display: 'inline-block',
                background: '#162024',
                color: '#ffffff',
                padding: '12px 28px',
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Shop Candles
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
