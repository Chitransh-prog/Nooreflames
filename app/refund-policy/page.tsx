import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, HeartHandshake, Camera, Zap, ChevronRight, MessageCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Refund & Replacement Policy — NOOR-E-FLAMES | 7-Day Transit Warranty',
  description:
    '7-day hassle-free replacement warranty on all NOOR-E-FLAMES orders damaged in transit. Rapid 24-hour fresh dispatch with zero return shipping friction.',
};

export default function RefundPolicyPage() {
  return (
    <div className="legal-page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="legal-hero">
        <div className="legal-hero-container">
          <div className="legal-crest-badge">
            <span className="legal-crest-dot" />
            <span className="legal-crest-text">NOOR-E-FLAMES ATELIER · 100% SATISFACTION PROMISE</span>
          </div>

          <h1 className="legal-hero-title">Refund & Replacement Policy</h1>
          <p className="legal-hero-subtitle">
            We hold ourselves to uncompromising standards of craftsmanship. If your fragrance arrives compromised by transit mishandling, we ensure an instant, stress-free resolution.
          </p>

          <div className="legal-hero-meta">
            <span>7-Day Replacement Warranty</span>
            <span className="legal-meta-divider">✦</span>
            <span>Zero Return Shipping Required</span>
            <span className="legal-meta-divider">✦</span>
            <span>24-Hour Fresh Dispatch</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="legal-container">
        <div className="legal-card">
          {/* Quick Summary Highlights */}
          <div className="legal-highlight-row">
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Hassle-Free Warranty</span>
              <p className="legal-highlight-card-desc">7-day coverage on broken flacons, damaged wicks, or leaked perfume bottles.</p>
            </div>
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Instant Photo Verification</span>
              <p className="legal-highlight-card-desc">Simply snap a picture or short video—no tedious packing or return parcels.</p>
            </div>
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Priority Replacement</span>
              <p className="legal-highlight-card-desc">A fresh handcrafted replacement unit is dispatched within 24 hours of notification.</p>
            </div>
          </div>

          {/* Section 1 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">01</span>
              <h2 className="legal-section-title">The NOOR-E-FLAMES Transit Guarantee</h2>
            </div>
            <p className="legal-text">
              Fine perfumes and hand-poured glass candles are delicate creations. While our triple-box foam insulation safeguards 99.8% of dispatches across India, logistics mishandling can occasionally occur.
            </p>
            <div className="legal-callout-box">
              <p>
                <strong>No Tedious Return Shipping:</strong> We understand that handling broken glass is unsafe and frustrating. You will <em>never</em> be asked to pack, seal, or courier back broken glass. Your photographic verification is all we require to honor our guarantee.
              </p>
            </div>
          </article>

          {/* Section 2 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">02</span>
              <h2 className="legal-section-title">How to Claim a Complimentary Replacement</h2>
            </div>
            <p className="legal-text">
              Claiming a replacement is quick, direct, and customer-first:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <strong>Step 1: Capture Proof</strong> — Take 1 to 2 clear photos or a short video showing the compromised item, broken seal, or leaked bottle along with the courier shipping label.
              </li>
              <li className="legal-list-item">
                <strong>Step 2: Message Concierge</strong> — Send the photos via WhatsApp to <strong>+91 8700531607</strong> or email them to <strong>nooreflames@gmail.com</strong> with your Order ID.
              </li>
              <li className="legal-list-item">
                <strong>Step 3: Immediate Approval & Dispatch</strong> — Our atelier team will verify the claim within 2-4 business hours and prepare a brand-new, complimentary handcrafted replacement unit for dispatch within 24 hours.
              </li>
            </ul>
          </article>

          {/* Section 3 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">03</span>
              <h2 className="legal-section-title">Refunds & Order Cancellations</h2>
            </div>
            <p className="legal-text">
              We offer fair, transparent policies regarding cancellations and financial refunds:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <strong>Pre-Dispatch Cancellation:</strong> If you wish to cancel an order, please message us within 12 hours of placing it. If the parcel has not yet been handed over to the courier, we will cancel the order immediately and issue a 100% full refund back to your original payment method within 3 to 5 business days.
              </li>
              <li className="legal-list-item">
                <strong>Out-of-Stock Scents:</strong> If a specific seasonal extrait batch or limited-edition candle is sold out before fulfilling your order, you will be offered your choice of a complimentary upgrade, store credit, or an immediate 100% refund.
              </li>
            </ul>
          </article>

          {/* Section 4 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">04</span>
              <h2 className="legal-section-title">Non-Returnable Items & Artisanal Variance</h2>
            </div>
            <p className="legal-text">
              Due to the personal and cosmetic nature of luxury fine fragrances and hand-poured candles:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                Items that have been lit, sprayed extensively, or opened for personal olfactory trials cannot be returned due to hygiene and safety standards.
              </li>
              <li className="legal-list-item">
                Natural soy wax frosting, subtle botanical wax crystallization, and minor wick bends are natural characteristics of non-toxic, paraffin-free wax and do not constitute defects.
              </li>
              <li className="legal-list-item">
                Customized bespoke bridal gifts or personalized engraved candles cannot be refunded once poured and cured.
              </li>
            </ul>
          </article>

          {/* Section 5 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">05</span>
              <h2 className="legal-section-title">Direct Atelier Concierge Support</h2>
            </div>
            <p className="legal-text">
              We are dedicated to your complete delight with every scent. If you ever have a concern regarding your order, our Founder & Atelier Director Priyanshu and the support team are directly accessible:
            </p>

            <div className="legal-support-bar">
              <div className="legal-support-text">
                <h4>Need to initiate a replacement right now?</h4>
                <p>Send a photo of the damaged package directly to our WhatsApp concierge.</p>
              </div>
              <a
                href="https://wa.me/918700531607?text=Hi%20Noor-E-Flames%20Atelier,%20I%20need%20assistance%20with%20my%20order."
                target="_blank"
                rel="noreferrer"
                className="legal-support-btn"
                style={{ backgroundColor: '#128C7E' }}
              >
                <MessageCircle size={16} /> WhatsApp Us (+91 8700531607)
              </a>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
