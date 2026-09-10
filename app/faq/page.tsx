'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Sparkles, MessageCircle, HelpCircle, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface FAQItem {
  id: string;
  category: 'candles' | 'perfumes' | 'shipping' | 'orders';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'secret-message',
    category: 'candles',
    question: 'What is a Whispered Surprises secret message candle?',
    answer:
      'Our Whispered Surprises candles conceal an artisanal, heat-resistant golden keepsake message submerged beneath the top layer of pure soy wax. As the candle burns and the molten wax turns transparent (approx. 20–30 minutes into the first burn), your hidden quote or personalized message slowly and magically reveals itself.',
  },
  {
    id: 'candle-wax',
    category: 'candles',
    question: 'What wax do you use, and are your candles non-toxic?',
    answer:
      'We use 100% pure, natural plant-based soy wax sourced ethically. Unlike commercial paraffin candles derived from petroleum, our candles produce zero toxic black soot, burn up to 50% longer, and feature unbleached, lead-free organic cotton braided wicks. They are completely safe for households, pets, and children when burned responsibly.',
  },
  {
    id: 'first-burn',
    category: 'candles',
    question: 'What is the "Golden Rule" of the first candle burn?',
    answer:
      'Always allow the candle to burn for 2 to 3 hours during its very first lighting, or until the melted wax pool reaches the entire outer circumference of the glass jar. Soy wax has "memory"—establishing a full melt pool prevents tunneling, ensuring your candle burns cleanly all the way down to the base.',
  },
  {
    id: 'wick-trimming',
    category: 'candles',
    question: 'Why and how should I trim the wick?',
    answer:
      'Before every subsequent burn, gently trim the cotton wick to 1/4 inch (6mm) using a wick trimmer or small scissors, and discard any charred wick "mushrooms." This guarantees a steady, smoke-free flame, preserves fragrance purity, and extends the candle’s total lifespan.',
  },
  {
    id: 'extrait-vs-edp',
    category: 'perfumes',
    question: 'What makes your Extrait de Parfum different from standard Eau de Parfum (EDP)?',
    answer:
      'Most commercial EDPs contain 12%–18% fragrance oil diluted in denatured alcohol. NOOR-E-FLAMES Extraits de Parfum are blended at a luxury 30%–35% pure oil concentration. This high-density formulation provides exceptional projection and an intoxicating 12 to 14+ hours of enduring longevity on skin, hair, and clothing.',
  },
  {
    id: 'attars-alcohol',
    category: 'perfumes',
    question: 'Are your traditional Indian Attars 100% alcohol-free?',
    answer:
      'Yes, absolutely. Our artisanal attars are distilled using age-old hydro-distillation traditions and blended into rich, pure botanical and sandalwood bases. They are completely alcohol-free, skin-nourishing, Halal-compliant, and intimate in projection.',
  },
  {
    id: 'layering-scents',
    category: 'perfumes',
    question: 'Can I layer NOOR-E-FLAMES fragrances together?',
    answer:
      'Yes! Our perfumers specifically formulate complementary scent accords. For instance, pairing the oceanic crispness of Sunlit Waves with the deep woody warmth of Royal Oud Amber creates an alluring, bespoke personal signature.',
  },
  {
    id: 'shipping-speed',
    category: 'shipping',
    question: 'How fast will my order arrive across India?',
    answer:
      'Orders are hand-packed and dispatched within 24 hours. Metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata) generally receive parcels within 2 to 4 business days. Regional and tier-2/3 cities arrive within 3 to 5 business days.',
  },
  {
    id: 'shipping-cost',
    category: 'shipping',
    question: 'Do you offer Free Shipping?',
    answer:
      'Yes! All orders exceeding ₹999 receive complimentary Express Shipping anywhere in India. For smaller orders under ₹999, a flat insured packaging rate of ₹79 is applied.',
  },
  {
    id: 'damaged-transit',
    category: 'shipping',
    question: 'What happens if my crystal flacon or candle arrives broken?',
    answer:
      'We offer an unconditional 7-Day Hassle-Free Transit Replacement Warranty. Simply take a photo of the damaged package and WhatsApp our concierge (+91 8700531607). We will dispatch a fresh replacement within 24 hours without asking you to return the broken item.',
  },
  {
    id: 'custom-gifting',
    category: 'orders',
    question: 'Can I order custom candles or bridal gift hampers for weddings?',
    answer:
      'Yes! We specialize in bespoke bridal favors, customized secret message quotes, engraved packaging, and luxury corporate gift boxes. Connect directly with Atelier Director Priyanshu via WhatsApp (+91 8700531607) or our Contact form for custom quotations and sample sets.',
  },
  {
    id: 'cod-available',
    category: 'orders',
    question: 'Is Cash on Delivery (COD) available?',
    answer:
      'Yes, COD is available for select postal codes across India. For seamless, contactless delivery, we also support all major UPI apps (Google Pay, PhonePe, Paytm), Credit/Debit cards, and Net Banking through our secure 256-bit encrypted checkout.',
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'secret-message': true,
    'extrait-vs-edp': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="legal-page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="legal-hero">
        <div className="legal-hero-container">
          <div className="legal-crest-badge">
            <span className="legal-crest-dot" />
            <span className="legal-crest-text">NOOR-E-FLAMES CONCIERGE · KNOWLEDGE BASE</span>
          </div>

          <h1 className="legal-hero-title">Frequently Asked Questions</h1>
          <p className="legal-hero-subtitle">
            Find immediate clarity on our hand-poured soy candles, whispered surprise secret messages, high-concentration botanical extraits, and doorstep courier transit.
          </p>
        </div>
      </section>

      {/* Interactive Main FAQ Container */}
      <div className="legal-container">
        {/* Search Bar */}
        <div className="faq-search-wrap">
          <Search size={20} className="faq-search-icon" />
          <input
            type="text"
            className="faq-search-input"
            placeholder="Search questions (e.g. soy wax, secret message, longevity, shipping)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="faq-category-nav">
          <button
            type="button"
            className={`faq-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Questions ({FAQ_DATA.length})
          </button>
          <button
            type="button"
            className={`faq-cat-btn ${activeCategory === 'candles' ? 'active' : ''}`}
            onClick={() => setActiveCategory('candles')}
          >
            Soy Candles & Surprises
          </button>
          <button
            type="button"
            className={`faq-cat-btn ${activeCategory === 'perfumes' ? 'active' : ''}`}
            onClick={() => setActiveCategory('perfumes')}
          >
            Extraits & Attars
          </button>
          <button
            type="button"
            className={`faq-cat-btn ${activeCategory === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveCategory('shipping')}
          >
            Shipping & Packaging
          </button>
          <button
            type="button"
            className={`faq-cat-btn ${activeCategory === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveCategory('orders')}
          >
            Orders & Bridal Gifting
          </button>
        </div>

        {/* FAQ Accordion List */}
        {filteredFAQs.length === 0 ? (
          <div className="legal-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <HelpCircle size={40} color="var(--legal-gold-deep)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'var(--legal-serif)', fontSize: '20px', marginBottom: '8px' }}>
              No matching answers found
            </h3>
            <p style={{ color: 'var(--legal-slate)', fontSize: '14px', marginBottom: '20px' }}>
              We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;. Try another search term or ask our concierge directly.
            </p>
            <button
              type="button"
              className="faq-cat-btn active"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="faq-accordion-list">
            {filteredFAQs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div key={faq.id} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-trigger"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <h3 className="faq-question">{faq.question}</h3>
                    <ChevronDown size={18} className="faq-icon-arrow" />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p style={{ margin: 0 }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions CTA */}
        <div className="legal-support-bar" style={{ marginTop: '48px' }}>
          <div className="legal-support-text">
            <h4>Still have a question our FAQ didn&apos;t answer?</h4>
            <p>Our fragrance concierge is available 7 days a week for personalized guidance.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/contact" className="legal-support-btn">
              Contact Concierge <ChevronRight size={14} />
            </Link>
            <a
              href="https://wa.me/918700531607?text=Hi%20Noor-E-Flames%20Atelier,%20I%20have%20a%20question."
              target="_blank"
              rel="noreferrer"
              className="legal-support-btn"
              style={{ backgroundColor: '#128C7E' }}
            >
              <MessageCircle size={15} /> WhatsApp (+91 8700531607)
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
