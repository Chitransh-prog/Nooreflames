'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Calendar, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface BlogPost {
  id: string;
  slug: string;
  category: 'fragrance' | 'candles' | 'stories' | 'gifting';
  categoryLabel: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'sacred-art-of-attars',
    category: 'fragrance',
    categoryLabel: 'Heritage Perfumery',
    title: 'The Sacred Art of Attars: From Kannauj Copper Degs to the Modern Flacon',
    excerpt:
      'Explore the centuries-old traditional hydro-distillation techniques of Deg-Bhapka, where pure morning botanicals and aged sandalwood unite into alcohol-free nectar.',
    image: '/images/banners/brand-packaging-banner.jpg',
    author: 'Atelier Director Priyanshu',
    date: 'Sep 2, 2024',
    readTime: '6 min read',
    featured: true,
  },
  {
    id: '2',
    slug: 'science-of-soy-wax',
    category: 'candles',
    categoryLabel: 'Candle Craftsmanship',
    title: 'The Science of Soy Wax: Why Clean Burning Changes Your Living Space',
    excerpt:
      'Why commercial paraffin emits toxic petroleum soot, and how pure plant-based soy wax provides an unpolluted, slow-burning sanctuary for modern homes.',
    image: '/images/social/candle-craft-1.jpg',
    author: 'Noor-E-Flames Studio',
    date: 'Aug 24, 2024',
    readTime: '4 min read',
  },
  {
    id: '3',
    slug: 'art-of-scent-layering',
    category: 'fragrance',
    categoryLabel: 'Olfactory Mastery',
    title: 'The Art of Fragrance Layering: Pairing Oceanic Freshness with Royal Oud',
    excerpt:
      'Learn the secret accords of luxury layering. Discover how pairing crisp aquatic notes with deep amber and agarwood creates an unforgettable personal signature.',
    image: '/images/social/candle-craft-2.jpg',
    author: 'Atelier Concierge',
    date: 'Aug 18, 2024',
    readTime: '5 min read',
  },
  {
    id: '4',
    slug: 'whispered-surprises-craft',
    category: 'stories',
    categoryLabel: 'Behind the Scenes',
    title: 'Whispered Surprises: The Craft Behind Secret Message Candles',
    excerpt:
      'A peek inside our New Delhi atelier to see how craftsmen hand-embed heat-resistant golden keepsake messages that reveal themselves through molten wax.',
    image: '/images/social/whispered-surprises-hands.jpg',
    author: 'Atelier Director Priyanshu',
    date: 'Aug 10, 2024',
    readTime: '4 min read',
  },
  {
    id: '5',
    slug: 'mastering-the-first-burn',
    category: 'candles',
    categoryLabel: 'Candle Care Guide',
    title: 'Mastering the First Burn: The Golden Rule of Candle Longevity',
    excerpt:
      'Soy wax possesses memory. Discover why allowing the wax to reach full edge-to-edge melt pool on your initial lighting prevents tunneling and doubles your burn hours.',
    image: '/images/social/candle-craft-3.jpg',
    author: 'Noor-E-Flames Studio',
    date: 'Jul 28, 2024',
    readTime: '3 min read',
  },
  {
    id: '6',
    slug: 'extrait-de-parfum-secrets',
    category: 'fragrance',
    categoryLabel: 'Perfume Education',
    title: 'Why Extrait de Parfum Outlasts Standard Eau de Parfum (EDP)',
    excerpt:
      'Delve into the molecular architecture of 35% pure fragrance oil concentration and why heavy botanical bases cling to skin and garments for 14+ hours.',
    image: '/images/social/candle-craft-4.jpg',
    author: 'Atelier Concierge',
    date: 'Jul 15, 2024',
    readTime: '5 min read',
  },
  {
    id: '7',
    slug: 'the-sensory-gift',
    category: 'gifting',
    categoryLabel: 'Luxury Gifting',
    title: 'The Art of Intentional Gifting: Curating Keepsake Boxes for Special Moments',
    excerpt:
      'From bridal registries to corporate milestones, how artisanal scented candles with meaningful quotes transform an ordinary gift into an enduring memory.',
    image: '/images/banners/gift-box-showcase.jpg',
    author: 'Noor-E-Flames Concierge',
    date: 'Jul 4, 2024',
    readTime: '4 min read',
  },
];

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const featuredPost = useMemo(() => {
    return BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  }, []);

  const regularPosts = useMemo(() => {
    return BLOG_POSTS.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const isNotHero = p.id !== featuredPost.id;
      return matchesCategory && isNotHero;
    });
  }, [activeCategory, featuredPost]);

  return (
    <div className="legal-page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="legal-hero">
        <div className="legal-hero-container">
          <div className="legal-crest-badge">
            <span className="legal-crest-dot" />
            <span className="legal-crest-text">NOOR-E-FLAMES ATELIER · CHRONICLES & JOURNAL</span>
          </div>

          <h1 className="legal-hero-title">Atelier Stories & Fragrance Journal</h1>
          <p className="legal-hero-subtitle">
            Immerse yourself in the sensory art of botanical perfumery, clean-burning soy candle rituals, and the rich heritage of handcrafted Indian luxury.
          </p>

          <div className="legal-hero-meta">
            <span>Artisanal Perfumery</span>
            <span className="legal-meta-divider">✦</span>
            <span>Candle Care Rituals</span>
            <span className="legal-meta-divider">✦</span>
            <span>Fragrance Layering Guides</span>
          </div>
        </div>
      </section>

      {/* Main Journal Container */}
      <div className="legal-container legal-container-wide">
        {/* Category Navigation */}
        <div className="faq-category-nav" style={{ marginBottom: '40px' }}>
          <button
            type="button"
            className={`faq-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Chronicles
          </button>
          <button
            type="button"
            className={`faq-cat-btn ${activeCategory === 'fragrance' ? 'active' : ''}`}
            onClick={() => setActiveCategory('fragrance')}
          >
            Fine Fragrance & Attars
          </button>
          <button
            type="button"
            className={`faq-cat-btn ${activeCategory === 'candles' ? 'active' : ''}`}
            onClick={() => setActiveCategory('candles')}
          >
            Candle Craft & Rituals
          </button>
          <button
            type="button"
            className={`faq-cat-btn ${activeCategory === 'stories' ? 'active' : ''}`}
            onClick={() => setActiveCategory('stories')}
          >
            Atelier Studio Secrets
          </button>
          <button
            type="button"
            className={`faq-cat-btn ${activeCategory === 'gifting' ? 'active' : ''}`}
            onClick={() => setActiveCategory('gifting')}
          >
            Luxury Gifting Guides
          </button>
        </div>

        {/* Featured Chronicle Hero (shown when on "All" or if matches category) */}
        {(activeCategory === 'all' || featuredPost.category === activeCategory) && (
          <article className="blogs-hero-feature">
            <div className="blogs-feature-image-box">
              <img src={featuredPost.image} alt={featuredPost.title} />
            </div>
            <div className="blogs-feature-content">
              <span className="blogs-feature-badge">
                <Sparkles size={13} /> Featured Chronicle · {featuredPost.categoryLabel}
              </span>
              <h2 className="blogs-feature-title">{featuredPost.title}</h2>
              <p className="blogs-feature-excerpt">{featuredPost.excerpt}</p>
              <div className="blogs-feature-meta">
                <span>{featuredPost.author}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <span className="blog-read-more" style={{ fontSize: '13px', cursor: 'pointer' }}>
                  Read Full Chronicle <ArrowUpRight size={16} />
                </span>
              </div>
            </div>
          </article>
        )}

        {/* Article Grid */}
        <div className="blogs-grid">
          {regularPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-image">
                <img src={post.image} alt={post.title} loading="lazy" />
              </div>
              <div className="blog-card-body">
                <span className="blog-tag">{post.categoryLabel}</span>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-footer">
                  <span>{post.readTime}</span>
                  <span className="blog-read-more" style={{ cursor: 'pointer' }}>
                    Read Story <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Callout in Blog */}
        <div className="legal-support-bar" style={{ marginTop: '54px' }}>
          <div className="legal-support-text">
            <h4>Never miss a fragrance chronicle or limited release</h4>
            <p>Join our private atelier list for quiet dispatches, scent recipes, and private drop invitations.</p>
          </div>
          <Link href="/contact" className="legal-support-btn">
            Join Atelier Circle <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
