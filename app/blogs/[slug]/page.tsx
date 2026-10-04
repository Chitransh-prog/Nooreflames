import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronLeft,
  Clock,
  Calendar,
  Sparkles,
  Share2,
  Bookmark,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { BLOG_POSTS, BlogPost } from '@/data/blogs';

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Related articles (excluding current)
  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="legal-page-wrapper" style={{ backgroundColor: '#FCFBF9' }}>
      <Navbar />

      {/* Article Header Container */}
      <article className="blog-article-container" style={{ maxWidth: '920px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#888' }}>
          <Link
            href="/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#1a1a1a',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <ChevronLeft size={16} /> All Chronicles
          </Link>
          <span>/</span>
          <span style={{ color: '#BBA58E', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, fontSize: '11px' }}>
            {post.categoryLabel}
          </span>
        </div>

        {/* Article Meta Header */}
        <header style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '14px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                borderRadius: '30px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: 'rgba(187, 165, 142, 0.15)',
                border: '1px solid rgba(187, 165, 142, 0.35)',
                color: '#8C704B',
              }}
            >
              <Sparkles size={12} />
              {post.categoryLabel}
            </span>
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(28px, 4.2vw, 46px)',
              lineHeight: 1.25,
              color: '#161413',
              marginBottom: '20px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            {post.title}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              paddingBottom: '24px',
              borderBottom: '1px solid #EAE3DA',
              fontSize: '13px',
              color: '#767069',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#1A1816',
                  color: '#FAF6F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontFamily: 'serif',
                }}
              >
                N
              </span>
              <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{post.author}</span>
            </div>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} /> {post.date}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={14} /> {post.readTime}
            </span>
          </div>
        </header>

        {/* Hero Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '44px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
            border: '1px solid #EAE4DB',
            background: '#1A1816',
          }}
        >
          <img
            src={post.image}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Lead Excerpt */}
        <div
          style={{
            fontSize: '19px',
            lineHeight: 1.65,
            color: '#383430',
            fontWeight: 400,
            marginBottom: '36px',
            fontStyle: 'italic',
            borderLeft: '3px solid #BBA58E',
            paddingLeft: '20px',
          }}
        >
          {post.excerpt}
        </div>

        {/* Article Body Content */}
        <div
          style={{
            fontSize: '16.5px',
            lineHeight: 1.85,
            color: '#44403C',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {post.content &&
            post.content.map((paragraph, idx) => (
              <p key={idx} style={{ margin: 0 }}>
                {paragraph}
              </p>
            ))}
        </div>

        {/* Editorial Pull Quote */}
        {post.quote && (
          <div
            style={{
              margin: '48px 0',
              padding: '36px 32px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #1C1917 0%, #292522 100%)',
              color: '#FBF8F4',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.14)',
            }}
          >
            <div
              style={{
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                lineHeight: 1.5,
                fontFamily: 'serif',
                fontStyle: 'italic',
                marginBottom: '16px',
                color: '#FAF5EE',
              }}
            >
              “{post.quote}”
            </div>
            {post.quoteAuthor && (
              <div
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#D4AF37',
                  fontWeight: 600,
                }}
              >
                — {post.quoteAuthor}
              </div>
            )}
          </div>
        )}

        {/* Atelier Craftsmanship Callout */}
        <div
          style={{
            margin: '40px 0',
            padding: '24px',
            borderRadius: '16px',
            background: '#F5F0E8',
            border: '1px solid #E5DCCF',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#BBA58E',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Award size={20} />
          </div>
          <div>
            <h4
              style={{
                margin: '0 0 6px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#1a1a1a',
              }}
            >
              The Noor-E-Flames Quality Guarantee
            </h4>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#666059', lineHeight: 1.6 }}>
              Every creation detailed in our chronicles is certified 100% cruelty-free, non-toxic, and handcrafted in small batches using pure botanical Eau de Parfum and renewable soy wax.
            </p>
          </div>
        </div>

        {/* Tags */}
        {post.tags && (
          <div style={{ marginTop: '36px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {post.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: '#EFEBE4',
                  fontSize: '12px',
                  color: '#554F48',
                  fontWeight: 500,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Back and Next Controls */}
        <div
          style={{
            marginTop: '48px',
            paddingTop: '28px',
            borderTop: '1px solid #EAE3DA',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <Link
            href="/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '30px',
              border: '1.5px solid #1a1a1a',
              color: '#1a1a1a',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <ChevronLeft size={16} /> All Stories
          </Link>

          <Link
            href="/#edps"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 22px',
              borderRadius: '30px',
              background: '#1a1a1a',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Discover Blends <ArrowRight size={16} />
          </Link>
        </div>

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: '72px' }}>
            <div style={{ marginBottom: '24px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#8C704B',
                }}
              >
                CONTINUE READING
              </span>
              <h3
                className="font-serif"
                style={{
                  fontSize: '26px',
                  fontWeight: 400,
                  color: '#1a1a1a',
                  margin: '6px 0 0',
                }}
              >
                More Chronicles From The Atelier
              </h3>
            </div>

            <div className="blogs-related-grid">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blogs/${rel.slug}`}
                  style={{
                    textDecoration: 'none',
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #ECE5DC',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <div style={{ width: '100%', aspectRatio: '16 / 10', overflow: 'hidden' }}>
                    <img
                      src={rel.image}
                      alt={rel.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '18px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#8C704B',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      {rel.categoryLabel}
                    </span>
                    <h4
                      className="font-serif"
                      style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        lineHeight: 1.35,
                        color: '#181818',
                        margin: '0 0 8px',
                      }}
                    >
                      {rel.title}
                    </h4>
                    <span
                      style={{
                        marginTop: 'auto',
                        fontSize: '11.5px',
                        color: '#8C847B',
                        paddingTop: '8px',
                      }}
                    >
                      {rel.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}
