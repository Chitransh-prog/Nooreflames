'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock, Sparkles, BookOpen } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '@/data/blogs';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText } from './visual-edit/EditableElements';

interface BlogsSectionProps {
  limit?: number;
}

export default function BlogsSection({ limit = 3 }: BlogsSectionProps) {
  const { storeData, updateField } = useVisualEdit();

  const sectionBadge =
    storeData?.siteSettings?.blogsSectionBadge || '✦ THE ATELIER JOURNAL ✦';
  const sectionTitle =
    storeData?.siteSettings?.blogsSectionTitle || 'Chronicles of Scent, Craft & Flame';
  const sectionSubtitle =
    storeData?.siteSettings?.blogsSectionSubtitle ||
    'Immerse in the timeless heritage of botanical hydro-distillation, clean-burning candle rituals, and olfactory mastery.';

  // Select top featured or first few blogs
  const displayedPosts = BLOG_POSTS.slice(0, limit);

  return (
    <section className="blogs-home-section" id="journal">
      <div className="blogs-home-container">
        {/* Section Header */}
        <div className="blogs-home-header">
          <div className="blogs-home-header-left">
            <div className="blogs-home-badge-wrapper">
              <span className="blogs-home-badge">
                <Sparkles size={12} className="blogs-home-badge-icon" />
                <EditableText
                  as="span"
                  value={sectionBadge}
                  onValueChange={(val) => updateField('siteSettings.blogsSectionBadge', val)}
                />
              </span>
            </div>

            <EditableText
              as="h2"
              value={sectionTitle}
              onValueChange={(val) => updateField('siteSettings.blogsSectionTitle', val)}
              className="blogs-home-title font-serif"
            />

            <EditableText
              as="p"
              value={sectionSubtitle}
              onValueChange={(val) => updateField('siteSettings.blogsSectionSubtitle', val)}
              className="blogs-home-subtitle"
            />
          </div>

          <div className="blogs-home-header-right">
            <Link href="/blogs" className="blogs-view-all-btn">
              <span>View All Chronicles</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="blogs-home-grid">
          {displayedPosts.map((post: BlogPost, index: number) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="blogs-home-card group"
            >
              {/* Card Image */}
              <div className="blogs-home-card-image-box">
                <img
                  src={post.image}
                  alt={post.title}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  className="blogs-home-card-img"
                />
                <div className="blogs-home-card-category-tag">
                  {post.categoryLabel}
                </div>
              </div>

              {/* Card Content */}
              <div className="blogs-home-card-content">
                <div className="blogs-home-card-meta">
                  <span className="blogs-home-card-date">{post.date}</span>
                  <span className="blogs-home-card-dot">•</span>
                  <span className="blogs-home-card-readtime">
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="blogs-home-card-title font-serif">
                  {post.title}
                </h3>

                <p className="blogs-home-card-excerpt">
                  {post.excerpt}
                </p>

                <div className="blogs-home-card-footer">
                  <span className="blogs-home-read-link">
                    Read Chronicle
                    <ArrowUpRight size={15} className="blogs-home-arrow-icon" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="blogs-home-mobile-all">
          <Link href="/blogs" className="blogs-view-all-btn">
            <span>Explore All Atelier Stories</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
