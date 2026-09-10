import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, Server, Mail, Phone, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Privacy Policy — NOOR-E-FLAMES | Atelier Data Protection',
  description:
    'Learn how NOOR-E-FLAMES protects your personal information. We do not sell or trade customer data, utilizing 256-bit SSL encryption for secure fragrance orders.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="legal-hero">
        <div className="legal-hero-container">
          <div className="legal-crest-badge">
            <span className="legal-crest-dot" />
            <span className="legal-crest-text">NOOR-E-FLAMES ATELIER · COMPLIANCE</span>
          </div>

          <h1 className="legal-hero-title">Privacy Policy</h1>
          <p className="legal-hero-subtitle">
            At NOOR - E - FLAMES, your privacy is paramount to our craft. We honor the trust you place in our atelier and maintain the strictest confidentiality standards.
          </p>

          <div className="legal-hero-meta">
            <span>Last Updated: September 2024</span>
            <span className="legal-meta-divider">✦</span>
            <span>256-Bit SSL Encryption</span>
            <span className="legal-meta-divider">✦</span>
            <span>Zero Third-Party Data Selling</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="legal-container">
        <div className="legal-card">
          {/* Quick Summary Highlights */}
          <div className="legal-highlight-row">
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Data Privacy</span>
              <p className="legal-highlight-card-desc">We never sell, rent, or trade your personal information to third-party marketers.</p>
            </div>
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Encrypted Checkout</span>
              <p className="legal-highlight-card-desc">Industry-standard SSL encryption safeguards all transactions and payment gateways.</p>
            </div>
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Order Fulfillment Only</span>
              <p className="legal-highlight-card-desc">Contact info is used solely for dispatch notifications, delivery tracking & support.</p>
            </div>
          </div>

          {/* Section 1 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">01</span>
              <h2 className="legal-section-title">Introduction & Atelier Philosophy</h2>
            </div>
            <p className="legal-text">
              NOOR - E - FLAMES (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the digital boutique and atelier studio located in New Delhi, India. We are committed to safeguarding your personal information and respecting your privacy rights. This Privacy Policy details how we collect, handle, protect, and utilize your personal data when you browse our website, explore our handcrafted artisanal candles and fine fragrances, or place an order.
            </p>
            <div className="legal-callout-box">
              <p>
                &ldquo;True luxury is intentional and respectful. We treat your personal data with the same uncompromising care that goes into hand-pouring our botanical extraits.&rdquo;
              </p>
            </div>
          </article>

          {/* Section 2 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">02</span>
              <h2 className="legal-section-title">Information We Collect</h2>
            </div>
            <p className="legal-text">
              We only collect information necessary to deliver exceptional artisanal fragrance experiences and fulfill your orders seamlessly:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <strong>Contact & Delivery Details:</strong> Full name, shipping destination address, billing address, active email address, and mobile phone number for delivery coordination.
              </li>
              <li className="legal-list-item">
                <strong>Transaction Records:</strong> Order identification numbers, purchased fragrance products, order values, date of purchase, and chosen payment method. (Note: We do not store full credit/debit card numbers; all payments are processed through PCI-DSS certified payment gateways).
              </li>
              <li className="legal-list-item">
                <strong>Customer Communications:</strong> Messages, feedback, WhatsApp concierge chats, and inquiries regarding custom bridal hampers or scent recommendations.
              </li>
              <li className="legal-list-item">
                <strong>Device & Browsing Data:</strong> IP address, device type, browser cookies, and interaction metrics used to enhance store responsiveness and speed.
              </li>
            </ul>
          </article>

          {/* Section 3 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">03</span>
              <h2 className="legal-section-title">How We Use Your Information</h2>
            </div>
            <p className="legal-text">
              The data gathered through our boutique is strictly employed for the following purposes:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">Processing and dispatching your artisanal candle and perfume orders across India.</li>
              <li className="legal-list-item">Sending automated shipping tracking updates via SMS, WhatsApp, and email.</li>
              <li className="legal-list-item">Providing dedicated customer care, addressing transit issues, and processing rapid replacements.</li>
              <li className="legal-list-item">Delivering bespoke scent recommendations, seasonal drop alerts, and VIP private previews (only if you have opted into our newsletter).</li>
              <li className="legal-list-item">Preventing fraudulent transactions and ensuring overall digital boutique security.</li>
            </ul>
          </article>

          {/* Section 4 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">04</span>
              <h2 className="legal-section-title">Data Protection & Security Architecture</h2>
            </div>
            <p className="legal-text">
              We implement comprehensive technical and organizational safeguards. All communications between your browser and our store are encrypted via 256-bit Transport Layer Security (TLS/SSL). Our database infrastructure is hosted in secure data centers adhering to high international compliance benchmarks.
            </p>
          </article>

          {/* Section 5 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">05</span>
              <h2 className="legal-section-title">Sharing with Trusted Service Partners</h2>
            </div>
            <p className="legal-text">
              We strictly do not monetize or exchange customer information. Your details are shared solely with operational partners necessary to bring your purchase to life:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <strong>Express Courier Partners:</strong> Bluedart, Delhivery, DTDC, and Shiprocket for parcel transit and secure doorstep delivery.
              </li>
              <li className="legal-list-item">
                <strong>Payment Processors:</strong> RBI-licensed payment gateways (e.g. Razorpay, UPI networks) ensuring encrypted, tamper-proof monetary transactions.
              </li>
              <li className="legal-list-item">
                <strong>Communication Channels:</strong> Automated transactional SMS/WhatsApp gateways for order dispatch tracking.
              </li>
            </ul>
          </article>

          {/* Section 6 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">06</span>
              <h2 className="legal-section-title">Cookies & Digital Preferences</h2>
            </div>
            <p className="legal-text">
              Our website uses essential session cookies to remember items in your shopping bag, preserve your visual preferences, and analyze anonymized site traffic. You may choose to disable cookies through your browser settings, though certain interactive checkout features may require cookies to function optimally.
            </p>
          </article>

          {/* Section 7 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">07</span>
              <h2 className="legal-section-title">Your Data Rights & Concierge Support</h2>
            </div>
            <p className="legal-text">
              You maintain the absolute right to inspect the personal data we hold about you, request corrections, or request complete removal of your profile from our systems. You can unsubscribe from atelier marketing at any time with a single click.
            </p>

            <div className="legal-support-bar">
              <div className="legal-support-text">
                <h4>Have questions about your personal data?</h4>
                <p>Reach out directly to our Atelier Director for prompt assistance.</p>
              </div>
              <Link href="/contact" className="legal-support-btn">
                Contact Atelier Concierge <ChevronRight size={14} />
              </Link>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
