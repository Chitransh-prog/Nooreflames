import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer-dark">
      <div className="footer-top-container">
        {/* Brand Column */}
        <div className="footer-col-brand">
          <div style={{ marginBottom: '16px' }}>
            <Logo size="small" />
          </div>
          <p className="footer-brand-desc">
            Crafting luxury EDPs, alcohol-free attars, and hand-poured soy candles inspired by heritage oriental perfumery and modern minimalist elegance.
          </p>
        </div>

        {/* Quick Collections */}
        <div className="footer-col">
          <h4 className="footer-col-heading font-serif">Collections</h4>
          <ul className="footer-links-list">
            <li><Link href="#ocean-fresh">Oceanic & Fresh Blends</Link></li>
            <li><Link href="#floral-rose">Blossom & Velvet Rose</Link></li>
            <li><Link href="#discovery">Discovery Miniature Sets</Link></li>
            <li><Link href="#royal-oud">Royal Oud & Amber</Link></li>
            <li><Link href="#why-us">Craftsmanship Standards</Link></li>
          </ul>
        </div>

        {/* CMS & Support Links */}
        <div className="footer-col">
          <h4 className="footer-col-heading font-serif">Manage & Support</h4>
          <ul className="footer-links-list">
            <li>
              <Link href="/studio" target="_blank" style={{ color: '#c9935a', fontWeight: 600 }}>
                ⚙ Sanity Content Studio
              </Link>
            </li>
            <li><Link href="#reels">Customer Video Reels</Link></li>
            <li><Link href="#reviews">Verified Buyer Reviews</Link></li>
            <li><Link href="#shipping">Shipping & Returns Policy</Link></li>
            <li><Link href="#contact">Track Your Order</Link></li>
          </ul>
        </div>

        {/* Concierge & Contact Info */}
        <div className="footer-col">
          <h4 className="footer-col-heading font-serif">Concierge Care</h4>
          <p className="footer-contact-info">
            Email: <a href="mailto:concierge@nooreflames.com">concierge@nooreflames.com</a><br />
            Phone: +91 (800) 447-2372<br />
            Hours: Mon - Sat, 10:00 AM - 7:00 PM IST<br />
            Studio: Mumbai • New Delhi • Dubai
          </p>
        </div>
      </div>

      {/* Footer Bottom Copyright & Payment Methods */}
      <div className="footer-bottom-bar">
        <div>
          &copy; {new Date().getFullYear()} NOOR-E-FLAMES Perfumery. All Rights Reserved.
        </div>
        <div className="payment-badges-row">
          <span>💳 VISA</span>
          <span>💳 Mastercard</span>
          <span>📲 UPI / GPay</span>
          <span>⚡ GoKwik Checkout</span>
        </div>
      </div>
    </footer>
  );
}
