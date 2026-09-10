import React from 'react';
import Link from 'next/link';
import { Award, Flame, ShieldCheck, Scale, CheckCircle2, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Terms of Service — NOOR-E-FLAMES | Atelier Guidelines & Terms',
  description:
    'Review the terms of service for NOOR-E-FLAMES. Handcrafted artisanal soy candles, 100% vegan IFRA-certified fragrance formulations, safe candle burning, and store policies.',
};

export default function TermsOfServicePage() {
  return (
    <div className="legal-page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="legal-hero">
        <div className="legal-hero-container">
          <div className="legal-crest-badge">
            <span className="legal-crest-dot" />
            <span className="legal-crest-text">NOOR-E-FLAMES ATELIER · LEGAL TERMS</span>
          </div>

          <h1 className="legal-hero-title">Terms of Service</h1>
          <p className="legal-hero-subtitle">
            Welcome to NOOR - E - FLAMES. By visiting our digital atelier or purchasing our handcrafted fragrances, you agree to the terms, conditions, and artisan standards outlined below.
          </p>

          <div className="legal-hero-meta">
            <span>Effective Date: September 2024</span>
            <span className="legal-meta-divider">✦</span>
            <span>IFRA 51st Amendment Standards</span>
            <span className="legal-meta-divider">✦</span>
            <span>Governing Law: New Delhi, India</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="legal-container">
        <div className="legal-card">
          {/* Quick Summary Highlights */}
          <div className="legal-highlight-row">
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Handcrafted Batches</span>
              <p className="legal-highlight-card-desc">100% pure soy wax, natural botanicals, and lead-free cotton wicks.</p>
            </div>
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Honest Pricing</span>
              <p className="legal-highlight-card-desc">All prices in Indian Rupees (INR) inclusive of GST and domestic taxes.</p>
            </div>
            <div className="legal-highlight-card">
              <span className="legal-highlight-card-title">Safe Candle Care</span>
              <p className="legal-highlight-card-desc">Guidelines provided to ensure safe, soot-free, and luxurious candle burns.</p>
            </div>
          </div>

          {/* Section 1 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">01</span>
              <h2 className="legal-section-title">Overview & Agreement</h2>
            </div>
            <p className="legal-text">
              These Terms of Service govern your use of the NOOR - E - FLAMES website, mobile shopping experiences, and our bespoke fragrance services. By browsing our catalog, registering an account, or placing an order, you confirm that you are at least 18 years of age or possess parental consent, and agree to be bound by these provisions.
            </p>
          </article>

          {/* Section 2 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">02</span>
              <h2 className="legal-section-title">Artisanal Handcrafted Quality & Natural Nuances</h2>
            </div>
            <p className="legal-text">
              Every NOOR - E - FLAMES candle, attar, and Extrait de Parfum is hand-blended and hand-poured in micro-batches in our New Delhi studio.
            </p>
            <div className="legal-callout-box">
              <p>
                <strong>The Beauty of Natural Soy Wax:</strong> Because we strictly refuse synthetic paraffin wax, paraffin hardeners, or chemical smoothing agents, minor visual frosting, subtle crystalline textures on the surface, or slight hue shifts in the soy wax are authentic hallmarks of genuine plant-based wax. These characteristics do not affect scent throw or burning performance in any way.
              </p>
            </div>
          </article>

          {/* Section 3 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">03</span>
              <h2 className="legal-section-title">IFRA Certification & Clean Formulation Standards</h2>
            </div>
            <p className="legal-text">
              All fragrance oils, essential extracts, and aromachemicals used in our formulations conform strictly to the 51st Amendment of the International Fragrance Association (IFRA) safety standards. Our products are:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">100% Vegan & Cruelty-Free (Never tested on animals).</li>
              <li className="legal-list-item">Formulated without phthalates, parabens, carcinogens, or toxic heavy metals.</li>
              <li className="legal-list-item">Fitted with 100% unbleached, lead-free organic cotton braided wicks.</li>
              <li className="legal-list-item">Pet-friendly when burned in well-ventilated living spaces according to standard safety guidelines.</li>
            </ul>
          </article>

          {/* Section 4 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">04</span>
              <h2 className="legal-section-title">Pricing, Billing & Promotions</h2>
            </div>
            <p className="legal-text">
              All prices displayed across our boutique are in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST). We reserve the right to modify pricing, launch promotional discount coupons, or adjust catalog offerings at our discretion. In the rare event of a pricing typo or system error, we will notify you before dispatch to confirm or cancel your order without penalty.
            </p>
          </article>

          {/* Section 5 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">05</span>
              <h2 className="legal-section-title">Candle Safety & Burn Responsibility</h2>
            </div>
            <p className="legal-text">
              To enjoy our candles safely and maximize longevity, you agree to observe basic fire safety protocols:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">Never leave a burning candle unattended or within reach of unattended children or pets.</li>
              <li className="legal-list-item">Always trim your cotton wick to 1/4 inch (6mm) before lighting to prevent mushrooming and soot.</li>
              <li className="legal-list-item">Allow a full melt pool to reach the container edges during the first burn (approx. 2 hours) to avoid wax tunneling.</li>
              <li className="legal-list-item">Burn only on heat-resistant, level surfaces away from open drafts, curtains, and air conditioners.</li>
              <li className="legal-list-item">Extinguish candle when 1/2 inch of wax remains at the bottom of the glass vessel.</li>
            </ul>
          </article>

          {/* Section 6 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">06</span>
              <h2 className="legal-section-title">Intellectual Property & Copyright</h2>
            </div>
            <p className="legal-text">
              All branding, trade names (&ldquo;NOOR - E - FLAMES&rdquo;, &ldquo;Where Fragrance Meets Flames&rdquo;, &ldquo;Whispered Surprises&rdquo;), custom bottle designs, label typography, photography, reel footage, and descriptive storytelling are the proprietary intellectual property of NOOR - E - FLAMES. Reproduction or commercial exploitation without written consent is strictly prohibited.
            </p>
          </article>

          {/* Section 7 */}
          <article className="legal-section">
            <div className="legal-section-header">
              <span className="legal-section-num">07</span>
              <h2 className="legal-section-title">Governing Jurisdiction</h2>
            </div>
            <p className="legal-text">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of your purchases or interactions with our atelier shall fall under the exclusive jurisdiction of the competent courts in New Delhi, India.
            </p>

            <div className="legal-support-bar">
              <div className="legal-support-text">
                <h4>Questions regarding our terms or bulk contracts?</h4>
                <p>Contact our concierge for legal & wholesale corporate inquiries.</p>
              </div>
              <Link href="/contact" className="legal-support-btn">
                Contact Atelier <ChevronRight size={14} />
              </Link>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
