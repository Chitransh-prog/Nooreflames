import React from 'react';
import Link from 'next/link';
import { Truck, Package, Clock, ShieldCheck, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Shipping Policy — NOOR-E-FLAMES | Express Pan-India Delivery',
  description:
    'Express courier delivery across 28,000+ PIN codes in India. 24-hour dispatch, free shipping over ₹999, and triple-boxed custom cushioning for fragile candles and flacons.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="legal-page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="legal-hero">
        <div className="legal-hero-container">
          <div className="legal-crest-badge">
            <span className="legal-crest-dot" />
            <span className="legal-crest-text">NOOR-E-FLAMES LOGISTICS · PAN-INDIA TRANSIT</span>
          </div>

          <h1 className="legal-hero-title">Shipping & Dispatch Policy</h1>
          <p className="legal-hero-subtitle">
            Every bottle of extrait and hand-poured candle is prepared with meticulous care, insulated against temperature variations, and dispatched via India&apos;s leading express couriers.
          </p>

          <div className="legal-hero-meta">
            <span>24-Hour Dispatch</span>
            <span className="legal-meta-divider">✦</span>
            <span>28,000+ PIN Codes</span>
            <span className="legal-meta-divider">✦</span>
            <span>Free Shipping Over ₹999</span>
            <span className="legal-meta-divider">✦</span>
            <span>Triple-Box Protection</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="legal-container">
        <div className="legal-card">
          {/* Quick Summary Highlights */}
          <div className="legal-highlight-row">
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Dispatch Speed</span>
              <p className="legal-highlight-card-desc">Orders placed before 2 PM are hand-packed & dispatched within 24 hours.</p>
            </div>
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Transit Timeline</span>
              <p className="legal-highlight-card-desc">Metro cities: 2-3 business days. Rest of India: 3-5 business days.</p>
            </div>
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Free Shipping</span>
              <p className="legal-highlight-card-desc">Complimentary express shipping automatically applied to all orders above ₹999.</p>
            </div>
          </div>

          {/* Section 1 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">01</span>
              <h2 className="legal-section-title">Pan-India Courier Network</h2>
            </div>
            <p className="legal-text">
              We deliver to all serviceable PIN codes across India (spanning 28,000+ postal zones). We partner exclusively with tier-1 air and surface express couriers including Blue Dart, Delhivery Express, and DTDC Air Cargo to ensure your precious fragrance bottles and soy candles arrive swiftly and securely.
            </p>
          </article>

          {/* Section 2 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">02</span>
              <h2 className="legal-section-title">Processing & Dispatch Timelines</h2>
            </div>
            <p className="legal-text">
              Because our scented candles are hand-poured in artisanal small batches, each unit undergoes a final visual inspection and wick check before being sealed into its keepsake box:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <strong>Standard Orders:</strong> Processed and handed over to courier hubs within 24 hours of confirmation (Monday through Saturday).
              </li>
              <li className="legal-list-item">
                <strong>Metro Deliveries (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> Estimated 2 to 3 business days from dispatch.
              </li>
              <li className="legal-list-item">
                <strong>Tier 2 & 3 Cities / Regional Towns:</strong> Estimated 3 to 5 business days from dispatch.
              </li>
              <li className="legal-list-item">
                <strong>Northeast & Remote Locations:</strong> Estimated 5 to 7 business days depending on terrain and regional logistics hubs.
              </li>
            </ul>
          </article>

          {/* Section 3 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">03</span>
              <h2 className="legal-section-title">Shipping Charges & Free Delivery Threshold</h2>
            </div>
            <p className="legal-text">
              We believe in transparent, honest pricing with zero hidden shipping fees at checkout:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <strong>Orders Above ₹999:</strong> 100% Free Express Shipping across all of India.
              </li>
              <li className="legal-list-item">
                <strong>Orders Below ₹999:</strong> A nominal flat shipping charge of ₹79 is applied to cover insured express transit packaging.
              </li>
              <li className="legal-list-item">
                <strong>Cash on Delivery (COD):</strong> Available for select PIN codes with an optional verification call or WhatsApp prompt prior to dispatch.
              </li>
            </ul>
          </article>

          {/* Section 4 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">04</span>
              <h2 className="legal-section-title">Artisanal Packaging & Fragile Handling</h2>
            </div>
            <p className="legal-text">
              Perfume glass bottles, crystal atomizers, and secret message candles require specialized care. Every NOOR - E - FLAMES package is engineered to withstand rough transit:
            </p>
            <div className="legal-callout-box">
              <p>
                <strong>The Triple-Box Insulation Standard:</strong> Your product rests inside its signature embossed keepsake box, enclosed in shock-absorbing die-cut foam, and sealed inside an impact-resistant outer corrugated shipping carton with tamper-evident security tape.
              </p>
            </div>
          </article>

          {/* Section 5 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">05</span>
              <h2 className="legal-section-title">Real-Time Order Tracking</h2>
            </div>
            <p className="legal-text">
              As soon as your parcel is scanned at our New Delhi atelier dispatch hub, you will receive an automated tracking link via SMS, WhatsApp, and email. You can view real-time transit milestones right until the parcel is out for delivery with your courier executive.
            </p>
          </article>

          {/* Section 6 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">06</span>
              <h2 className="legal-section-title">Damaged in Transit Guarantee</h2>
            </div>
            <p className="legal-text">
              In the unlikely event that your package encounters mishandling and arrives broken or leaking, please rest assured. Our <strong>7-Day Hassle-Free Replacement Guarantee</strong> has you completely protected. Simply photograph the parcel and message our WhatsApp concierge for an immediate fresh dispatch within 24 hours.
            </p>

            <div className="legal-support-bar">
              <div className="legal-support-text">
                <h4>Need an urgent address change or delivery update?</h4>
                <p>Connect with our fulfillment concierge directly on WhatsApp (+91 8700531607).</p>
              </div>
              <Link href="/contact" className="legal-support-btn">
                Contact Concierge <ChevronRight size={14} />
              </Link>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
