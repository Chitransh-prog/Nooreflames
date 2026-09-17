'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Star,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  Flower2,
  HeartHandshake,
  Gift,
  FileText,
  Flame,
  BadgePercent,
  Plane,
  Box,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CategoryInfo, CATEGORIES_DATA, getAllCategories } from '@/lib/categories';
import { Product } from '@/lib/store';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';

interface CategoryPageViewProps {
  category: CategoryInfo;
  initialProducts: Product[];
}

export default function CategoryPageView({ category, initialProducts }: CategoryPageViewProps) {
  const { addToCart } = useCart();
  const { storeData } = useVisualEdit();

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [quickAdded, setQuickAdded] = useState<{ [id: string]: boolean }>({});

  // Use live products from storeData if available
  const allProducts: Product[] = useMemo(() => {
    if (storeData?.products && Array.isArray(storeData.products) && storeData.products.length > 0) {
      return storeData.products;
    }
    return initialProducts;
  }, [storeData, initialProducts]);

  // Map products matching this category
  const baseCategoryProducts = useMemo(() => {
    const matched: Product[] = [];
    const addedIds = new Set<string>();

    category.productIds.forEach((id) => {
      const p = allProducts.find((item) => item.id === id);
      if (p && !addedIds.has(p.id)) {
        matched.push(p);
        addedIds.add(p.id);
      }
    });

    // Fallback or supplementary additions
    if (category.id === 'men') {
      allProducts.forEach((p) => {
        if (
          !addedIds.has(p.id) &&
          (p.category === 'royal-oud' || p.category === 'ocean-fresh') &&
          !p.title.toLowerCase().includes('jasmine') &&
          !p.title.toLowerCase().includes('velvet rose')
        ) {
          matched.push(p);
          addedIds.add(p.id);
        }
      });
    } else if (category.id === 'women') {
      allProducts.forEach((p) => {
        if (
          !addedIds.has(p.id) &&
          (p.category === 'floral-rose' ||
            p.title.toLowerCase().includes('rose') ||
            p.title.toLowerCase().includes('jasmine') ||
            p.title.toLowerCase().includes('strawberry'))
        ) {
          matched.push(p);
          addedIds.add(p.id);
        }
      });
    } else if (category.id === 'gift-shop') {
      allProducts.forEach((p) => {
        if (!addedIds.has(p.id) && p.category === 'candles') {
          matched.push(p);
          addedIds.add(p.id);
        }
      });
    } else if (category.id === 'discovery-sets') {
      allProducts.forEach((p) => {
        if (
          !addedIds.has(p.id) &&
          (p.category === 'discovery-sets' ||
            p.id.includes('disc') ||
            p.title.toLowerCase().includes('discovery') ||
            p.title.toLowerCase().includes('tester'))
        ) {
          matched.push(p);
          addedIds.add(p.id);
        }
      });
    }

    return matched;
  }, [category, allProducts]);

  // Curated hero featured products for the hero section right card showcase
  const heroProducts: Product[] = useMemo(() => {
    const list: Product[] = [];
    const ids = category.featuredHeroProductIds || category.productIds.slice(0, 4);
    ids.forEach((id) => {
      const found = allProducts.find((p) => p.id === id);
      if (found && !list.some((item) => item.id === found.id)) {
        list.push(found);
      }
    });

    if (list.length < 2) {
      baseCategoryProducts.forEach((p) => {
        if (!list.some((item) => item.id === p.id)) {
          list.push(p);
        }
      });
    }

    return list.slice(0, 4);
  }, [category, allProducts, baseCategoryProducts]);

  const [heroSlideIndex, setHeroSlideIndex] = useState<number>(0);
  const totalHeroPages = Math.max(1, Math.ceil(heroProducts.length / 2));
  const currentHeroProducts = heroProducts.slice(heroSlideIndex * 2, heroSlideIndex * 2 + 2);

  // Filter and sort products
  const displayProducts = useMemo(() => {
    let list = [...baseCategoryProducts];

    // Filter by tag
    if (activeFilter !== 'All') {
      const tagLower = activeFilter.toLowerCase();
      list = list.filter((p) => {
        const text = `${p.title} ${p.subtitle} ${p.badge || ''} ${p.scentFamily || ''} ${p.category || ''} ${(p.topNotes || []).join(' ')} ${(p.heartNotes || []).join(' ')} ${(p.baseNotes || []).join(' ')}`.toLowerCase();

        if (tagLower.includes('oud') || tagLower.includes('woody')) {
          return text.includes('oud') || text.includes('wood') || text.includes('oak') || text.includes('smoke');
        }
        if (tagLower.includes('aquatic') || tagLower.includes('marine')) {
          return text.includes('marine') || text.includes('ocean') || text.includes('aqua') || text.includes('salt');
        }
        if (tagLower.includes('amber') || tagLower.includes('spiced')) {
          return text.includes('amber') || text.includes('saffron') || text.includes('tobacco') || text.includes('spice');
        }
        if (tagLower.includes('attar')) {
          return text.includes('attar') || text.includes('crystal') || text.includes('alcohol-free');
        }
        if (tagLower.includes('tester') || tagLower.includes('discovery')) {
          return p.id.includes('disc') || text.includes('tester') || text.includes('discovery');
        }
        if (tagLower.includes('rose') || tagLower.includes('floral')) {
          return text.includes('rose') || text.includes('jasmine') || text.includes('floral') || text.includes('bloom');
        }
        if (tagLower.includes('gourmand') || tagLower.includes('vanilla')) {
          return text.includes('vanilla') || text.includes('strawberry') || text.includes('chocolate') || text.includes('chai') || text.includes('mango');
        }
        if (tagLower.includes('secret message')) {
          return text.includes('secret') || text.includes('whispered') || text.includes('message');
        }
        if (tagLower.includes('dessert') || tagLower.includes('coupe')) {
          return text.includes('coupe') || text.includes('cupcake') || text.includes('gateau') || text.includes('chai') || text.includes('berry');
        }
        if (tagLower.includes('sculptural') || tagLower.includes('art')) {
          return text.includes('teddy') || text.includes('balloon') || text.includes('evil eye') || text.includes('bear');
        }
        if (tagLower.includes('vault') || tagLower.includes('gift')) {
          return text.includes('vault') || text.includes('gift') || text.includes('set') || text.includes('box');
        }
        return true;
      });
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [baseCategoryProducts, activeFilter, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod, 1);
    setQuickAdded((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setQuickAdded((prev) => ({ ...prev, [prod.id]: false }));
    }, 1800);
  };

  // Icon renderer for Perks
  const renderIcon = (name: string) => {
    switch (name) {
      case 'Clock':
        return <Clock size={19} />;
      case 'ShieldCheck':
        return <ShieldCheck size={19} />;
      case 'Sparkles':
        return <Sparkles size={19} />;
      case 'Truck':
        return <Truck size={19} />;
      case 'Flower2':
        return <Flower2 size={19} />;
      case 'HeartHandshake':
        return <HeartHandshake size={19} />;
      case 'Gift':
        return <Gift size={19} />;
      case 'FileText':
        return <FileText size={19} />;
      case 'Flame':
        return <Flame size={19} />;
      case 'BadgePercent':
        return <BadgePercent size={19} />;
      case 'Plane':
        return <Plane size={19} />;
      case 'Box':
        return <Box size={19} />;
      default:
        return <Sparkles size={19} />;
    }
  };

  // Other categories list for the bottom switcher
  const otherCategories = useMemo(() => {
    return getAllCategories().filter((c) => c.id !== category.id);
  }, [category.id]);

  return (
    <div className="category-page-root">
      {/* 1. Breadcrumbs Bar */}
      <div className="category-breadcrumbs-bar">
        <div className="category-breadcrumbs-container">
          <Link href="/">Home</Link>
          <span className="category-breadcrumb-separator">/</span>
          <Link href="/collections">Collections</Link>
          <span className="category-breadcrumb-separator">/</span>
          <span className="category-breadcrumb-current">{category.name}</span>
        </div>
      </div>

      {/* 2. Editorial Hero Section */}
      <section className="category-hero-section">
        <div className="category-hero-bg">
          <picture>
            {category.mobileHeroImage && (
              <source media="(max-width: 640px)" srcSet={category.mobileHeroImage} />
            )}
            <img src={category.heroImage} alt={category.title} />
          </picture>
        </div>
        <div className="category-hero-overlay" />

        <div className="category-hero-container">
          <div className="category-hero-left">
            <div className="category-hero-kicker-wrap">
              <span className="category-hero-kicker">
                <Sparkles size={12} /> {category.kicker}
              </span>
            </div>

            <h1 className="category-hero-title">{category.title}</h1>
            <p className="category-hero-subtitle">{category.subtitle}</p>
            <p className="category-hero-desc">{category.description}</p>

            <div className="category-hero-badges">
              {category.badges.map((badge, idx) => (
                <span key={idx} className="category-pill-badge">
                  ✦ {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="category-hero-right">
            <div className="category-hero-products-showcase">
              <div className="category-hero-products-top-bar">
                <span className="category-hero-products-kicker">
                  <Sparkles size={12} color="#e6c887" /> FEATURED {category.name} CREATIONS
                </span>
                {totalHeroPages > 1 && (
                  <div className="category-hero-products-nav">
                    <button
                      type="button"
                      onClick={() => setHeroSlideIndex((prev) => (prev > 0 ? prev - 1 : totalHeroPages - 1))}
                      className="category-hero-nav-btn"
                      aria-label="Previous creations"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="category-hero-nav-counter">
                      {heroSlideIndex + 1} / {totalHeroPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setHeroSlideIndex((prev) => (prev < totalHeroPages - 1 ? prev + 1 : 0))}
                      className="category-hero-nav-btn"
                      aria-label="Next creations"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="category-hero-products-grid">
                {currentHeroProducts.map((p) => {
                  const discountPercent = p.originalPrice
                    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                    : null;

                  return (
                    <div key={p.id} className="category-hero-prod-card">
                      <Link href={`/product/${p.id}`} className="category-hero-prod-img-wrap">
                        <img src={p.image} alt={p.title} />
                        {p.badge && (
                          <span className="category-hero-prod-badge">{p.badge}</span>
                        )}
                        {discountPercent && discountPercent > 0 && (
                          <span className="category-hero-prod-discount">{discountPercent}% OFF</span>
                        )}
                      </Link>

                      <div className="category-hero-prod-body">
                        <div className="category-hero-prod-rating">
                          <div style={{ display: 'flex', color: '#BBA58E' }}>
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} size={11} fill="#BBA58E" color="#BBA58E" />
                            ))}
                          </div>
                          <span>({p.reviewsCount || 120})</span>
                        </div>

                        <Link href={`/product/${p.id}`} className="category-hero-prod-title">
                          {p.title}
                        </Link>

                        <p className="category-hero-prod-notes">{p.subtitle}</p>

                        <div className="category-hero-prod-footer">
                          <div className="category-hero-prod-pricing">
                            <span className="category-hero-prod-price">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                            {p.originalPrice && (
                              <span className="category-hero-prod-orig">
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(e, p)}
                            className={`category-hero-prod-add-btn ${quickAdded[p.id] ? 'added' : ''}`}
                            aria-label={`Add ${p.title} to bag`}
                          >
                            {quickAdded[p.id] ? (
                              <>
                                <Check size={11} strokeWidth={3} /> ADDED
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={11} /> ADD
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Atelier Value Propositions Strip */}
      <div className="category-perks-strip">
        <div className="category-perks-container">
          {category.perks.map((perk, i) => (
            <div key={i} className="category-perk-item">
              <div className="category-perk-icon-wrap">{renderIcon(perk.iconName)}</div>
              <div className="category-perk-text">
                <h4>{perk.title}</h4>
                <p>{perk.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Filter & Sorting Toolbar */}
      <div className="category-toolbar-section">
        <div className="category-toolbar-container">
          {/* Subcategory Tag Filters */}
          <div className="category-filter-pills">
            {category.filterTags.map((tag) => {
              const isActive = activeFilter === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveFilter(tag)}
                  className={`category-filter-btn ${isActive ? 'active' : ''}`}
                >
                  {isActive && <span className="category-filter-dot" />}
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Right: Counter & Sort Dropdown */}
          <div className="category-toolbar-right">
            <span className="category-count-label">
              Showing <strong>{displayProducts.length}</strong> creations
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="category-sort-select"
              aria-label="Sort products"
            >
              <option value="featured">Featured Atelier Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated (★ 5.0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Main Product Catalog Grid */}
      <main className="category-main-content">
        {displayProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#78716c' }}>
            <Sparkles size={32} color="#BBA58E" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', color: '#1c1917', marginBottom: '6px' }}>
              No creations found in this sub-filter.
            </h3>
            <p style={{ fontSize: '13.5px', marginBottom: '20px' }}>
              Try selecting “All” to view the complete {category.name} collection.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('All')}
              className="category-filter-btn active"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="category-products-grid">
            {displayProducts.map((item) => {
              const discountPercent = item.originalPrice
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : null;

              return (
                <div key={item.id} className="category-product-card">
                  {/* Image Frame */}
                  <Link href={`/product/${item.id}`} className="category-card-image-wrap">
                    <img src={item.image} alt={item.title} loading="lazy" />

                    {item.badge && (
                      <span className="category-card-badge">{item.badge}</span>
                    )}

                    {discountPercent && discountPercent > 0 && (
                      <span className="category-card-discount-tag">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </Link>

                  {/* Body Details */}
                  <div className="category-card-body">
                    <div className="category-card-rating">
                      <div className="category-card-stars">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} size={12} fill="#BBA58E" color="#BBA58E" />
                        ))}
                      </div>
                      <span className="category-card-reviews">
                        {item.rating || 5.0} ({item.reviewsCount || 120})
                      </span>
                    </div>

                    <Link href={`/product/${item.id}`} className="category-card-title">
                      {item.title}
                    </Link>

                    <p className="category-card-subtitle">{item.subtitle}</p>

                    <span className="category-card-stock-pill">
                      <Check size={10} strokeWidth={3} /> In Stock · Fresh Atelier Pour
                    </span>

                    {/* Pricing & Add to Cart Footer */}
                    <div className="category-card-footer">
                      <div className="category-card-pricing">
                        <span className="category-card-price-current">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice && (
                          <span className="category-card-price-original">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, item)}
                        className={`category-card-add-btn ${
                          quickAdded[item.id] ? 'added' : ''
                        }`}
                        aria-label={`Add ${item.title} to bag`}
                      >
                        {quickAdded[item.id] ? (
                          <>
                            <Check size={13} strokeWidth={3} /> ADDED
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={13} /> ADD TO BAG
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 6. Olfactory Storytelling & Educational Breakdown */}
      <section className="category-story-section">
        <div className="category-story-container">
          <div className="category-story-text-col">
            <div className="category-story-header">
              <span className="category-story-kicker">OLFACTORY RITUAL & CRAFTSMANSHIP</span>
              <h2 className="category-story-title">{category.olfactoryStory.heading}</h2>
              <p className="category-story-sub">{category.olfactoryStory.subheading}</p>
            </div>

            {category.olfactoryStory.paragraphs.map((p, idx) => (
              <p key={idx} className="category-story-p">
                {p}
              </p>
            ))}

            <div className="category-story-quote">
              <p>“{category.olfactoryStory.quote}”</p>
              <cite>— {category.olfactoryStory.author}</cite>
            </div>
          </div>

          <div className="category-story-notes-col">
            <div className="category-notes-grid">
              {category.olfactoryStory.highlightNotes.map((note, idx) => (
                <div key={idx} className="category-note-card">
                  <div className="category-note-card-top">
                    <span className="category-note-name">{note.name}</span>
                    <span className="category-note-stage">{note.note}</span>
                  </div>
                  <p className="category-note-desc">{note.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Explore Other Atelier Collections */}
      <section className="category-other-collections-section">
        <div className="category-other-container">
          <div className="category-other-heading">
            <h3>Explore Other Atelier Collections</h3>
            <p>Immerse in pure botanical extraits, alcohol-free attars, and sculptural soy candles.</p>
          </div>

          <div className="category-other-grid">
            {otherCategories.map((other) => (
              <Link
                key={other.id}
                href={`/category/${other.slug}`}
                className="category-other-card"
              >
                <div className="category-other-card-bg">
                  <img src={other.heroImage} alt={other.name} loading="lazy" />
                </div>
                <div className="category-other-card-overlay" />
                <div className="category-other-card-content">
                  <div>
                    <span
                      style={{
                        fontSize: '10.5px',
                        color: '#BBA58E',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        display: 'block',
                        marginBottom: '3px',
                      }}
                    >
                      COLLECTION
                    </span>
                    <span className="category-other-card-title">{other.name}</span>
                  </div>
                  <div className="category-other-card-arrow">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
