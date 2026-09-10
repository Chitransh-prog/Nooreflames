'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  MessageCircle,
  Sparkles,
  Send,
  CheckCircle2,
  Gift,
  HelpCircle
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('order');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    // After 6 seconds, reset form
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 6000);
  };

  return (
    <div className="legal-page-wrapper">
      <Navbar />

      {/* Hero Banner */}
      <section className="legal-hero">
        <div className="legal-hero-container">
          <div className="legal-crest-badge">
            <span className="legal-crest-dot" />
            <span className="legal-crest-text">NOOR-E-FLAMES CONCIERGE · ATELIER STUDIO</span>
          </div>

          <h1 className="legal-hero-title">Contact Our Atelier</h1>
          <p className="legal-hero-subtitle">
            Whether you seek bespoke fragrance recommendations, custom bridal hampers, or order support, our studio concierge is here to assist you with personal warmth.
          </p>

          <div className="legal-hero-meta">
            <span>New Delhi, India</span>
            <span className="legal-meta-divider">✦</span>
            <span>Mon–Sat: 10 AM – 7 PM IST</span>
            <span className="legal-meta-divider">✦</span>
            <span>Direct WhatsApp Concierge</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="legal-container legal-container-wide">
        <div className="contact-layout-grid">
          {/* Left Column: Direct Info Cards */}
          <div className="contact-info-column">
            {/* WhatsApp Priority Banner */}
            <div className="contact-whatsapp-banner">
              <div>
                <h4>Instant WhatsApp Concierge</h4>
                <p>Chat directly with our fragrance team for rapid recommendations & order help.</p>
              </div>
              <a
                href="https://wa.me/918700531607?text=Hi%20Noor-E-Flames%20Atelier,%20I%20would%20like%20assistance."
                target="_blank"
                rel="noreferrer"
                className="contact-whatsapp-btn"
              >
                Chat Now →
              </a>
            </div>

            {/* Studio Address */}
            <div className="contact-info-card">
              <div className="contact-icon-wrapper">
                <MapPin size={22} />
              </div>
              <div className="contact-card-content">
                <h3>Atelier Studio & Workshop</h3>
                <p>
                  Plot no-13, Kashmiri colony, Khaira,<br />
                  Najafgarh, New Delhi - 110043, India.
                </p>
                <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--legal-gold-deep)', fontWeight: 600 }}>
                  Crafted & hand-poured with love in the heart of India.
                </p>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="contact-info-card">
              <div className="contact-icon-wrapper">
                <Phone size={22} />
              </div>
              <div className="contact-card-content">
                <h3>Direct Phone & WhatsApp</h3>
                <p>
                  <a href="tel:+918700531607">+91 8700531607</a>
                </p>
                <p style={{ marginTop: '4px' }}>
                  Available Monday through Saturday, 10:00 AM to 7:00 PM IST.
                </p>
              </div>
            </div>

            {/* Atelier Email */}
            <div className="contact-info-card">
              <div className="contact-icon-wrapper">
                <Mail size={22} />
              </div>
              <div className="contact-card-content">
                <h3>Atelier Email</h3>
                <p>
                  <a href="mailto:nooreflames@gmail.com">nooreflames@gmail.com</a>
                </p>
                <p style={{ marginTop: '4px' }}>
                  Inquiries answered typically within 2-4 business hours.
                </p>
              </div>
            </div>

            {/* Leadership / Founder Note */}
            <div className="contact-info-card">
              <div className="contact-icon-wrapper">
                <User size={22} />
              </div>
              <div className="contact-card-content">
                <h3>Founder & Atelier Director</h3>
                <p><strong>Priyanshu</strong></p>
                <p style={{ marginTop: '4px' }}>
                  Direct concierge for custom bridal registries, luxury event favors & corporate collaborations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Concierge Form */}
          <div className="contact-form-card">
            <h2>Send Us a Message</h2>
            <p>Fill out the details below and our fragrance concierge will get back to you promptly.</p>

            {submitted ? (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '16px',
                  padding: '32px 24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: '#16a34a', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                  <CheckCircle2 size={42} />
                </div>
                <h3 style={{ fontFamily: 'var(--legal-serif)', fontSize: '22px', marginBottom: '8px' }}>
                  Thank You, {name}!
                </h3>
                <p style={{ color: 'var(--legal-slate)', fontSize: '14px', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto' }}>
                  Your message has been received by our New Delhi atelier. A member of our concierge team will reach out to you at <strong>{email}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group-row">
                  <div className="form-field">
                    <label htmlFor="contact-name">Your Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-email">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="e.g. aarav@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-field">
                    <label htmlFor="contact-phone">Phone / WhatsApp Number</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-inquiry">Inquiry Category</label>
                    <select
                      id="contact-inquiry"
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                    >
                      <option value="order">Order Tracking & Delivery</option>
                      <option value="scent">Bespoke Fragrance Recommendation</option>
                      <option value="wedding">Bridal / Wedding Registry & Favors</option>
                      <option value="corporate">Corporate Gifting & Bulk Orders</option>
                      <option value="feedback">General Feedback & Atelier Hello</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message">How Can We Assist You? *</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Describe your question, fragrance preference, or event details..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="form-submit-btn">
                  Send Message to Atelier →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
