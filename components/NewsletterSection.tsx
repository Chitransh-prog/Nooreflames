'use client';

import React, { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-card">
        {/* Envelope Seal Icon matching input_file_0.png */}
        <div className="envelope-seal-badge">
          <div className="wax-seal-inner font-serif">N | F</div>
        </div>

        <h2 className="newsletter-title font-serif">Unlock Exclusive Fragrance Drops</h2>
        <p className="newsletter-sub">
          Subscribe to receive VIP access to limited-edition extraits, private sales, and complimentary sample vials.
        </p>

        {submitted ? (
          <div className="newsletter-success-msg font-serif">
            ✦ Welcome to NOOR-E-FLAMES Club. Check your inbox for your 10% discount code! ✦
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-submit-btn">
              SUBSCRIBE
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
