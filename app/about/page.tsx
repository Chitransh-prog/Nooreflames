import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Flame,
  Droplets,
  Heart,
  ShieldCheck,
  Award,
  MapPin,
  Phone,
  Mail,
  User,
  ExternalLink,
  ChevronRight,
  MessageCircle,
  Clock,
  Compass,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import WhyChooseUsSection from '../../components/WhyChooseUsSection';
import Footer from '../../components/Footer';
import './about.css';

export const metadata = {
  title: 'About Us — NOOR-E-FLAMES | Where Fragrance Meets Flames',
  description:
    'Discover the heritage of NOOR-E-FLAMES. Handcrafted luxury perfumes, authentic alcohol-free attars, and clean-burning scented candles with meaningful quotes crafted in New Delhi.',
};

export default function AboutPage() {
  return (
    <div className="about-page-wrapper">
      {/* Luxury Light Navbar */}
      <Navbar />

      {/* ----------------------------------------------------------------------
          1. ATELIER OVERTURE HERO
          ---------------------------------------------------------------------- */}
      <section className="about-hero">
        <div className="about-hero-container">
          <div className="about-crest-badge">
            <span className="about-crest-dot" />
            <span className="about-crest-text">NOOR-E-FLAMES ATELIER · EST. NEW DELHI</span>
          </div>

          <h1 className="about-hero-title">
            Where Fragrance <span>Meets Flames</span>
          </h1>

          <p className="about-hero-creed">
            &ldquo;Luxury inspired by nature. Crafted with passion. Remembered through fragrance.&rdquo;
          </p>

          <div className="about-hero-meta">
            <span>Handcrafted in India</span>
            <span className="about-meta-divider">✦</span>
            <span>Clean-Burning Natural Wax</span>
            <span className="about-meta-divider">✦</span>
            <span>Authentic Traditional Attars</span>
            <span className="about-meta-divider">✦</span>
            <span>Extrait Concentration Perfumes</span>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          2. THE MANIFESTO: "TRUE LUXURY ISN'T LOUD"
          ---------------------------------------------------------------------- */}
      <section className="about-manifesto-section">
        <div className="about-manifesto-quote-wrap">
          <span className="about-quote-mark">&ldquo;</span>
          <h2 className="about-manifesto-quote">
            At NOOREFLAMES, we believe true luxury isn&apos;t loud. It&apos;s pure. It&apos;s intentional. It&apos;s timeless.
          </h2>
          <p className="about-manifesto-lead">
            We don&apos;t believe in following trends—we believe in creating experiences that stay with people. We are here for those who choose quality over quantity, authenticity over trends, and meaningful experiences over ordinary products.
          </p>
        </div>

        <div className="about-pillars-grid">
          {/* Pillar 1: Pure */}
          <div className="about-pillar-card">
            <span className="about-pillar-num">Pillar I</span>
            <h3 className="about-pillar-title">Pure</h3>
            <p className="about-pillar-desc">
              Every creation begins with pure natural ingredients, ethically sourced botanicals, and high-grade essential oils. Our candles are formulated with 100% clean-burning natural wax—completely free from toxic paraffin, harsh chemicals, and lead wicks.
            </p>
          </div>

          {/* Pillar 2: Intentional */}
          <div className="about-pillar-card">
            <span className="about-pillar-num">Pillar II</span>
            <h3 className="about-pillar-title">Intentional</h3>
            <p className="about-pillar-desc">
              Nothing is mass-produced. Each candle is hand-poured with love and features unique, aesthetic, and meaningful quotes. They become far more than decor—they become intimate memories, thoughtful gifts, and sanctuaries of daily comfort.
            </p>
          </div>

          {/* Pillar 3: Timeless */}
          <div className="about-pillar-card">
            <span className="about-pillar-num">Pillar III</span>
            <h3 className="about-pillar-title">Timeless</h3>
            <p className="about-pillar-desc">
              Drawing inspiration from ancient Indian and Middle Eastern distillation, our traditional attars and high-concentration extraits possess profound depth and lasting character that outlives seasonal hype.
            </p>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. THE CURATED OLFACTORY TRIAD (8 SIGNATURE OFFERINGS)
          ---------------------------------------------------------------------- */}
      <section className="about-triad-section">
        <div className="about-triad-container">
          <div className="about-section-header">
            <span className="about-kicker">CURATED CRAFTSMANSHIP</span>
            <h2 className="about-title">Our Three Signature Pillars</h2>
            <p className="about-subtitle">
              We offer a carefully curated collection of 8 signature products, thoughtfully made using natural ingredients, premium essential oils, and clean-burning wax.
            </p>
          </div>

          <div className="about-triad-grid">
            {/* Card 1: Luxury Perfumes */}
            <div className="about-triad-card">
              <div className="about-triad-media">
                <Image
                  src="/images/products/saffron-tobacco-oud.jpg"
                  alt="NOOR-E-FLAMES Luxury Extrait Perfumes"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <span className="about-triad-badge">Extrait de Parfum</span>
              </div>
              <div className="about-triad-body">
                <span className="about-triad-tag">Pillar 01 · Perfumery</span>
                <h3 className="about-triad-name">Luxury Perfumes</h3>
                <p className="about-triad-text">
                  Crafted at high extrait concentrations for unrivaled longevity. Formulated to evoke emotion, quiet confidence, and unforgettable presence across every room you enter.
                </p>
                <ul className="about-triad-highlights">
                  <li>
                    <span className="about-highlight-bullet">✦</span> 35% Pure Botanical Extrait Oil Concentration
                  </li>
                  <li>
                    <span className="about-highlight-bullet">✦</span> 14+ Hours Lasting Sillage on Skin & Fabric
                  </li>
                  <li>
                    <span className="about-highlight-bullet">✦</span> Complex Pyramidal Notes (Oud, Saffron, Amber)
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Traditional Attars */}
            <div className="about-triad-card">
              <div className="about-triad-media">
                <Image
                  src="/images/products/imperial-jasmine-attar.jpg"
                  alt="NOOR-E-FLAMES Traditional Attars"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <span className="about-triad-badge">Alcohol-Free Pure Oil</span>
              </div>
              <div className="about-triad-body">
                <span className="about-triad-tag">Pillar 02 · Heritage Oils</span>
                <h3 className="about-triad-name">Traditional Attars</h3>
                <p className="about-triad-text">
                  Honoring centuries of authentic Middle Eastern and Indian steam distillation. 100% non-alcoholic botanical oils that are exceptionally gentle on skin with warm, intimate sillage.
                </p>
                <ul className="about-triad-highlights">
                  <li>
                    <span className="about-highlight-bullet">✦</span> 100% Non-Alcoholic, Skin-Nourishing Base
                  </li>
                  <li>
                    <span className="about-highlight-bullet">✦</span> Heritage Distillation of Precious Woods & Florals
                  </li>
                  <li>
                    <span className="about-highlight-bullet">✦</span> Deep, Personal Olfactory Aura
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Handcrafted Scented Candles */}
            <div className="about-triad-card">
              <div className="about-triad-media">
                <Image
                  src="/images/products/whispered-surprises.jpg"
                  alt="NOOR-E-FLAMES Handcrafted Scented Candles"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <span className="about-triad-badge">Hand-Poured Soy</span>
              </div>
              <div className="about-triad-body">
                <span className="about-triad-tag">Pillar 03 · Artisanal Flames</span>
                <h3 className="about-triad-name">Candles with Quotes</h3>
                <p className="about-triad-text">
                  Handmade with love and featuring unique, aesthetic, and meaningful quotes. Each candle becomes a lasting memory, a treasured gift, and a calming ritual for your sacred spaces.
                </p>
                <ul className="about-triad-highlights">
                  <li>
                    <span className="about-highlight-bullet">✦</span> 100% Clean-Burning Natural Soy Wax
                  </li>
                  <li>
                    <span className="about-highlight-bullet">✦</span> Unique Literary & Aesthetic Quote Inscriptions
                  </li>
                  <li>
                    <span className="about-highlight-bullet">✦</span> Lead-Free Pure Cotton Wicks & Non-Toxic Throw
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          4. THE DISTINCTIVE WOMEN'S COLLECTION SPOTLIGHT
          ---------------------------------------------------------------------- */}
      <section className="about-women-section">
        <div className="about-women-card">
          <div className="about-women-content">
            <span className="about-kicker">AURA OF ELEGANCE & INDIVIDUALITY</span>
            <h2 className="about-women-quote">
              &ldquo;For women, we have created a distinctive collection that celebrates <em>confidence, grace, and individuality</em>.&rdquo;
            </h2>
            <p className="about-women-text">
              Each fragrance is designed to complement her presence, elevate her everyday elegance, and become a signature part of her unique aura. From the velvety romanticism of Damascus Rose to luminous citrus sambac harmonies, every blend honors her multifaceted journey.
            </p>

            <div className="about-women-features">
              <div className="about-women-pill">
                <h4>Signature Aura</h4>
                <p>Designed to linger gracefully without overwhelming the room.</p>
              </div>
              <div className="about-women-pill">
                <h4>Empowering Grace</h4>
                <p>Curated with uplifting botanical notes of jasmine, vanilla & amber.</p>
              </div>
              <div className="about-women-pill">
                <h4>Meaningful Gifts</h4>
                <p>Paired with our bespoke quote candles for cherished moments.</p>
              </div>
              <div className="about-women-pill">
                <h4>Kind to Sensitive Skin</h4>
                <p>Formulated with alcohol-free oils and IFRA-certified essences.</p>
              </div>
            </div>
          </div>

          <div className="about-women-media">
            <Image
              src="/images/products/velvet-rose.jpg"
              alt="NOOR-E-FLAMES Distinctive Women's Collection"
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
            <div className="about-women-media-caption">
              <span>Velvet Rose Extrait & Botanical Flame</span>
              <span style={{ color: '#8A7258', fontWeight: 600 }}>Atelier Women&apos;s Edit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          5. CRAFTED FOR THE DISCERNING (OUR AUDIENCE)
          ---------------------------------------------------------------------- */}
      <section className="about-audience-section">
        <div className="about-audience-container">
          <div className="about-section-header">
            <span className="about-kicker">OUR COMMUNITY</span>
            <h2 className="about-title">Crafted for the Discerning</h2>
            <p className="about-subtitle">
              Our collections are crafted for young professionals, fragrance enthusiasts, and mature individuals who seek fragrances with depth, character, and true sophistication.
            </p>
          </div>

          <div className="about-audience-grid">
            {/* Persona 1 */}
            <div className="about-audience-card">
              <div className="about-audience-icon-wrap">
                <Compass size={22} />
              </div>
              <h3 className="about-audience-title">The Young Professional</h3>
              <p className="about-audience-text">
                Ambitious individuals navigating modern spaces who demand an effortless, polished presence. Fragrances that project subtle authority, refinement, and magnetic poise from sunrise meetings to evening soirees.
              </p>
            </div>

            {/* Persona 2 */}
            <div className="about-audience-card">
              <div className="about-audience-icon-wrap">
                <Sparkles size={22} />
              </div>
              <h3 className="about-audience-title">The Fragrance Enthusiast</h3>
              <p className="about-audience-text">
                Olfactory connoisseurs who understand raw botanical terroir, extraction techniques, and complex note pyramids. Those who crave rare oud, real saffron, and high extrait concentration over diluted department store bottles.
              </p>
            </div>

            {/* Persona 3 */}
            <div className="about-audience-card">
              <div className="about-audience-icon-wrap">
                <Clock size={22} />
              </div>
              <h3 className="about-audience-title">The Mature Individual</h3>
              <p className="about-audience-text">
                Discerning clients who have refined their taste through the years. People who value quiet luxury, authenticity over fleeting micro-trends, and the artisanal heritage of traditional hand-poured flames and attars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          6. OUR MISSION & ATELIER STANDARDS
          ---------------------------------------------------------------------- */}
      <section className="about-mission-section">
        <div className="about-mission-frame">
          <div className="about-mission-seal">
            <Award size={26} />
          </div>

          <span className="about-kicker">OUR SIMPLE MISSION</span>
          <h2 className="about-mission-title">The NOOR-E-FLAMES Creed</h2>

          <blockquote className="about-mission-statement">
            &ldquo;To create luxurious perfumes, authentic attars, and handcrafted scented candles that are natural, reliable, beautifully crafted, and truly different from the ordinary.&rdquo;
          </blockquote>

          <span className="about-mission-quote-author">
            — NOOR - E - FLAMES ATELIER · NEW DELHI
          </span>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          7. STUDIO HERITAGE & ATELIER CONCIERGE
          ---------------------------------------------------------------------- */}
      <section className="about-studio-section">
        <div className="about-studio-container">
          <div className="about-studio-grid">
            {/* Atelier Details Card */}
            <div className="about-studio-card">
              <span className="about-kicker">ATELIER STUDIO & CONTACT</span>
              <h3>Visit or Connect with Our Atelier</h3>
              <p>
                Every blend and candle is formulated and hand-packaged with artisanal care at our New Delhi studio. Whether you are seeking bespoke bridal registries, corporate gifting, or personal scent consultation, our atelier team is here for you.
              </p>

              <div className="about-details-list">
                <div className="about-detail-row">
                  <div className="about-detail-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="about-detail-info">
                    <span className="about-detail-label">Atelier Address</span>
                    <span className="about-detail-val">
                      Plot no-13, Kashmiri colony, Khaira, Najafgarh, New Delhi - 110043, India
                    </span>
                  </div>
                </div>

                <div className="about-detail-row">
                  <div className="about-detail-icon">
                    <User size={18} />
                  </div>
                  <div className="about-detail-info">
                    <span className="about-detail-label">Primary Contact Person</span>
                    <span className="about-detail-val">Priyanshu (Founder & Atelier Director)</span>
                  </div>
                </div>

                <div className="about-detail-row">
                  <div className="about-detail-icon">
                    <Phone size={18} />
                  </div>
                  <div className="about-detail-info">
                    <span className="about-detail-label">Direct Concierge</span>
                    <span className="about-detail-val">
                      <a href="tel:+918700531607">+91 8700531607</a>
                    </span>
                  </div>
                </div>

                <div className="about-detail-row">
                  <div className="about-detail-icon">
                    <Mail size={18} />
                  </div>
                  <div className="about-detail-info">
                    <span className="about-detail-label">Official Inquiries</span>
                    <span className="about-detail-val">
                      <a href="mailto:nooreflames@gmail.com">nooreflames@gmail.com</a>
                    </span>
                  </div>
                </div>
              </div>

              <div className="about-studio-actions">
                <a
                  href="https://wa.me/918700531607?text=Hello%20NOOR-E-FLAMES%20Atelier,%20I%20would%20like%20to%20inquire%20about%20your%20fragrances%20and%20candles."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-btn-primary"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Concierge</span>
                </a>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Plot+no-13+Kashmiri+colony+Khaira+Najafgarh+New+Delhi+110043"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-btn-secondary"
                >
                  <MapPin size={16} />
                  <span>View on Google Maps</span>
                  <ExternalLink size={13} style={{ marginLeft: 2 }} />
                </a>
              </div>
            </div>

            {/* Atelier Ambient Visual Box */}
            <div className="about-studio-ambient-box">
              <span className="about-studio-ambient-kicker">AUTHENTIC ATELIER SEAL</span>
              <h4 className="about-studio-ambient-title">Artisanal Batch Promise</h4>
              <p className="about-studio-ambient-text">
                &ldquo;We don&apos;t believe in following trends—we believe in creating experiences that stay with people.&rdquo;
              </p>
              <div className="about-signature-signoff">
                NOOR - E - FLAMES
              </div>
              <span style={{ fontSize: '11px', color: '#8A7258', letterSpacing: '0.15em', marginTop: '6px', textTransform: 'uppercase' }}>
                New Delhi, India
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          8. WHY CHOOSE US (SIGNATURE GRADIENT SECTION)
          ---------------------------------------------------------------------- */}
      <WhyChooseUsSection />

      {/* ----------------------------------------------------------------------
          9. ATELIER INVITATION CALL TO ACTION
          ---------------------------------------------------------------------- */}
      <section className="about-cta-section">
        <div className="about-cta-container">
          <span className="about-kicker">DISCOVER OUR EDITIONS</span>
          <h2 className="about-cta-title">Experience NOOR - E - FLAMES</h2>
          <p className="about-cta-desc">
            Explore our curated collections of extrait perfumes, traditional attars, and quote-inscribed scented candles crafted for discerning connoisseurs.
          </p>
          <div className="about-cta-actions">
            <Link href="/#edps" className="about-btn-primary">
              <span>Explore Perfumes</span>
              <ChevronRight size={15} />
            </Link>
            <Link href="/#attars" className="about-btn-secondary">
              <span>Discover Attars</span>
            </Link>
            <Link href="/#candles" className="about-btn-secondary">
              <span>Candles with Quotes</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
