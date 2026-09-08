import React from 'react';
import Navbar from '../../components/Navbar';
import WhyChooseUsSection from '../../components/WhyChooseUsSection';
import TestimonialsSection from '../../components/TestimonialsSection';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'About Us — NOOR-E-FLAMES | Artisanal Perfumes & Soy Candles',
  description:
    'Discover the heritage of NOOR-E-FLAMES. Handcrafted luxury EDPs, artisanal non-alcoholic attars, and clean-burning soy candles crafted with pure botanical oils.',
};

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      {/* Exact Same Luxury Navbar */}
      <Navbar />

      {/* About Us Hero Banner */}
      <section className="about-hero-section" style={{
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
        color: '#ffffff',
        padding: 'clamp(50px, 8vw, 90px) 20px clamp(40px, 6vw, 70px)',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            fontSize: '12px',
            letterSpacing: '0.25em',
            color: '#BBA58E',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '16px',
            display: 'block'
          }}>
            OUR HERITAGE & VISION
          </span>
          <h1 className="font-serif" style={{ fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: 1.15, marginBottom: '24px' }}>
            Where Fragrance Meets Flames
          </h1>
          <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: '#E5E0D8', lineHeight: 1.6, fontWeight: 300 }}>
            NOOR-E-FLAMES was born out of a passion for authentic olfactory artistry. We craft long-lasting luxury perfumes, artisanal alcohol-free attars, and hand-poured soy wax candles that elevate your daily ritual.
          </p>
        </div>
      </section>

      {/* Brand Story & Philosophy */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(24px, 4vw, 48px)',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#BBA58E', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              THE ART OF PERFUMERY
            </span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(24px, 4vw, 38px)', color: '#121212', marginBottom: '20px', lineHeight: 1.2 }}>
              Crafted at Extrait Concentration for Unrivaled Longevity
            </h2>
            <p style={{ color: '#707070', fontSize: '15px', lineHeight: 1.7, marginBottom: '18px' }}>
              Unlike mass-produced scents, every NOOR-E-FLAMES creation is formulated with high concentrations of pure botanical essential oils, ethically harvested spices, and rare woods.
            </p>
            <p style={{ color: '#707070', fontSize: '15px', lineHeight: 1.7 }}>
              Our signature non-alcoholic attars honor traditional Middle Eastern and Indian distillation techniques while our soy candles use 100% natural wax for a clean, non-toxic burn.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f7e8db 0%, #edd4c0 100%)',
            borderRadius: '20px',
            padding: 'clamp(24px, 5vw, 48px) clamp(18px, 4vw, 36px)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.06)',
            border: '1px solid #ebd7c7'
          }}>
            <h3 className="font-serif" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: '#121212', marginBottom: '16px' }}>
              Our Promise to You
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', color: '#333333', fontSize: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#BBA58E' }}>✦</span> 100% Cruelty-Free & Vegan Ingredients
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#BBA58E' }}>✦</span> Alcohol-Free Attars Gentle on Sensitive Skin
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#BBA58E' }}>✦</span> Hand-Poured Soy Wax with Zero Toxins or Paraffin
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#BBA58E' }}>✦</span> Sustainable Luxury Packaging & Heavy Flacons
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Standards Section */}
      <WhyChooseUsSection />

      {/* Testimonials */}
      <TestimonialsSection testimonials={[]} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
