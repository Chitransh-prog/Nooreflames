'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Calendar, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

import { BLOG_POSTS, BlogPost } from '@/data/blogs';

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
          <Link href={`/blogs/${featuredPost.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article className="blogs-hero-feature" style={{ cursor: 'pointer' }}>
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
          </Link>
        )}

        {/* Article Grid */}
        <div className="blogs-grid">
          {regularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
            >
              <article className="blog-card" style={{ width: '100%', cursor: 'pointer' }}>
                <div className="blog-card-image">
                  <img src={post.image} alt={post.title} loading="lazy" />
                </div>
                <div className="blog-card-body">
                  <span className="blog-tag">{post.categoryLabel}</span>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-card-footer">
                    <span>{post.readTime}</span>
                    <span className="blog-read-more">
                      Read Story <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
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
