'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Star,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { getAllCategories, CategoryInfo } from '@/lib/categories';
import { Product } from '@/lib/store';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';

interface CollectionsDirectoryViewProps {
  categories: CategoryInfo[];
  allProducts: Product[];
}

export default function CollectionsDirectoryView({
  categories,
  allProducts: initialProducts,
}: CollectionsDirectoryViewProps) {
  const { addToCart } = useCart();
  const { storeData } = useVisualEdit();

  const [activeTab, setActiveTab] = useState<'all' | 'perfumes' | 'attars' | 'candles' | 'discovery'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male' | 'unisex'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [quickAdded, setQuickAdded] = useState<{ [id: string]: boolean }>({});

  const products: Product[] = useMemo(() => {
    if (storeData?.products && Array.isArray(storeData.products) && storeData.products.length > 0) {
      return storeData.products;
    }
    return initialProducts;
  }, [storeData, initialProducts]);

  const perfumesList = useMemo(
    () =>
      products.filter(
        (p) =>
          p.productType === 'PERFUME' ||
          (p.category !== 'candles' &&
            p.productType !== 'CANDLE' &&
            p.productType !== 'ATTAR' &&
            !p.title.toLowerCase().includes('attar') &&
            !p.id.includes('disc') &&
            p.id !== 'prod-6')
      ),
    [products]
  );

  const attarsList = useMemo(
    () =>
      products.filter(
        (p) => p.productType === 'ATTAR' || p.title.toLowerCase().includes('attar')
      ),
    [products]
  );

  const candlesList = useMemo(
    () =>
      products.filter(
        (p) =>
          p.category === 'candles' ||
          p.productType === 'CANDLE' ||
          p.title.toLowerCase().includes('candle')
      ),
    [products]
  );

  const discoveryList = useMemo(
    () =>
      products.filter(
        (p) =>
          p.category === 'discovery-sets' ||
          p.productType === 'DISCOVERY' ||
          p.productType === 'GIFT_SET' ||
          p.id.includes('disc') ||
          p.id === 'prod-6' ||
          p.title.toLowerCase().includes('discovery') ||
          p.title.toLowerCase().includes('tester')
      ),
    [products]
  );

  // Filter products by active category tab and sub-filter
  const filteredProducts = useMemo(() => {
    let list: Product[] = [];

    if (activeTab === 'all') {
      list = [...products];
    } else if (activeTab === 'perfumes') {
      list = [...perfumesList];
    } else if (activeTab === 'attars') {
      list = [...attarsList];
    } else if (activeTab === 'candles') {
      list = [...candlesList];
    } else if (activeTab === 'discovery') {
      list = [...discoveryList];
    } else {
      list = [...products];
    }

    if (genderFilter !== 'all' && (activeTab === 'perfumes' || activeTab === 'all')) {
      list = list.filter((p) => {
        const gen = (p.targetGender || '').toLowerCase();
        if (genderFilter === 'female') {
          return (
            gen === 'female' ||
            p.category === 'floral-rose' ||
            p.title.toLowerCase().includes('rose') ||
            p.title.toLowerCase().includes('blush') ||
            p.title.toLowerCase().includes('midnight')
          );
        }
        if (genderFilter === 'male') {
          return (
            gen === 'male' ||
            p.category === 'ocean-fresh' ||
            p.title.toLowerCase().includes('eclipse') ||
            p.title.toLowerCase().includes('tide')
          );
        }
        if (genderFilter === 'unisex') {
          return gen === 'unisex' || (!gen && p.category !== 'candles');
        }
        return true;
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [products, activeTab, genderFilter, sortBy, perfumesList, attarsList, candlesList, discoveryList]);

  const handleQuickAdd = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod, 1);
    setQuickAdded((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setQuickAdded((prev) => ({ ...prev, [prod.id]: false }));
    }, 1800);
  };

  return (
    <div className="collections-directory-root">
      {/* 1. Breadcrumbs Bar */}
      <div className="category-breadcrumbs-bar">
        <div className="category-breadcrumbs-container">
          <Link href="/">Home</Link>
          <span className="category-breadcrumb-separator">/</span>
          <span className="category-breadcrumb-current">Our Products</span>
        </div>
      </div>

      {/* 2. Collections Hero Header (Light Luxury Theme) */}
      <section className="collections-hero">
        <div className="collections-hero-container">
          <span className="collections-hero-kicker">
            <Sparkles size={12} color="#BBA58E" /> NOOR-E-FLAMES ATELIER · HANDCRAFTED LUXURY
          </span>
          <h1 className="collections-hero-title">Our Products</h1>
          <p className="collections-hero-sub">
            Immerse in pure botanical Eau de Parfum, artisanal alcohol-free attars, and hand-poured sculptural candles crafted for mindful rituals.
          </p>
        </div>
      </section>

      {/* 3. Filter & Sorting Toolbar */}
      <div className="category-toolbar-section">
        <div className="category-toolbar-container">
          <div className="category-filter-pills">
            <button
              type="button"
              onClick={() => { setActiveTab('all'); setGenderFilter('all'); }}
              className={`category-filter-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              {activeTab === 'all' && <span className="category-filter-dot" />}
              All Products ({products.length})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('perfumes'); setGenderFilter('all'); }}
              className={`category-filter-btn ${activeTab === 'perfumes' ? 'active' : ''}`}
            >
              {activeTab === 'perfumes' && <span className="category-filter-dot" />}
              Perfumes ({perfumesList.length})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('attars'); setGenderFilter('all'); }}
              className={`category-filter-btn ${activeTab === 'attars' ? 'active' : ''}`}
            >
              {activeTab === 'attars' && <span className="category-filter-dot" />}
              Attars ({attarsList.length})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('candles'); setGenderFilter('all'); }}
              className={`category-filter-btn ${activeTab === 'candles' ? 'active' : ''}`}
            >
              {activeTab === 'candles' && <span className="category-filter-dot" />}
              Candles ({candlesList.length})
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('discovery'); setGenderFilter('all'); }}
              className={`category-filter-btn ${activeTab === 'discovery' ? 'active' : ''}`}
            >
              {activeTab === 'discovery' && <span className="category-filter-dot" />}
              Discovery Sets ({discoveryList.length})
            </button>
          </div>

          <div className="category-toolbar-right">
            <span className="category-count-label">
              Showing <strong>{filteredProducts.length}</strong> products
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="category-sort-select"
              aria-label="Sort products"
            >
              <option value="featured">Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated (★ 5.0)</option>
            </select>
          </div>
        </div>

        {/* Secondary Sub-Filter Row when Perfumes or All is selected */}
        {(activeTab === 'perfumes' || activeTab === 'all') && (
          <div
            className="category-toolbar-container"
            style={{
              paddingTop: '10px',
              marginTop: '10px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  color: '#888',
                }}
              >
                Profile:
              </span>
              {(['all', 'female', 'male', 'unisex'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenderFilter(g)}
                  style={{
                    border: '1px solid',
                    borderColor: genderFilter === g ? '#162024' : 'rgba(0,0,0,0.12)',
                    background: genderFilter === g ? '#162024' : 'transparent',
                    color: genderFilter === g ? '#ffffff' : '#555555',
                    padding: '4px 14px',
                    borderRadius: '16px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {g === 'all'
                    ? 'All Profiles'
                    : g === 'female'
                    ? 'For Her'
                    : g === 'male'
                    ? 'For Him'
                    : 'Unisex'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Specs Bar for Candles */}
        {activeTab === 'candles' && (
          <div
            className="category-toolbar-container"
            style={{
              paddingTop: '10px',
              marginTop: '10px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  color: '#888',
                }}
              >
                Soy Wax Standards:
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  color: '#444',
                  background: 'rgba(187, 165, 142, 0.14)',
                  border: '1px solid rgba(187, 165, 142, 0.35)',
                  padding: '3px 12px',
                  borderRadius: '14px',
                  fontWeight: 500,
                }}
              >
                🌿 100% Pure Soy Wax
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  color: '#444',
                  background: 'rgba(187, 165, 142, 0.14)',
                  border: '1px solid rgba(187, 165, 142, 0.35)',
                  padding: '3px 12px',
                  borderRadius: '14px',
                  fontWeight: 500,
                }}
              >
                ✨ Lead-Free Cotton Wicks
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  color: '#444',
                  background: 'rgba(187, 165, 142, 0.14)',
                  border: '1px solid rgba(187, 165, 142, 0.35)',
                  padding: '3px 12px',
                  borderRadius: '14px',
                  fontWeight: 500,
                }}
              >
                🔥 Smoke-Free Clean Burn
              </span>
            </div>
          </div>
        )}

        {/* Category Specs Bar for Attars */}
        {activeTab === 'attars' && (
          <div
            className="category-toolbar-container"
            style={{
              paddingTop: '10px',
              marginTop: '10px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  color: '#888',
                }}
              >
                Artisanal Profile:
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  color: '#444',
                  background: 'rgba(187, 165, 142, 0.14)',
                  border: '1px solid rgba(187, 165, 142, 0.35)',
                  padding: '3px 12px',
                  borderRadius: '14px',
                  fontWeight: 500,
                }}
              >
                💎 100% Pure Concentrated Oil
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  color: '#444',
                  background: 'rgba(187, 165, 142, 0.14)',
                  border: '1px solid rgba(187, 165, 142, 0.35)',
                  padding: '3px 12px',
                  borderRadius: '14px',
                  fontWeight: 500,
                }}
              >
                🚫 100% Alcohol-Free
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  color: '#444',
                  background: 'rgba(187, 165, 142, 0.14)',
                  border: '1px solid rgba(187, 165, 142, 0.35)',
                  padding: '3px 12px',
                  borderRadius: '14px',
                  fontWeight: 500,
                }}
              >
                ⏳ 12+ Hours Sillage
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 6. Product Catalog Grid */}
      <main className="category-main-content">
        <div className="category-products-grid">
          {filteredProducts.map((item) => {
            const discountPercent = item.originalPrice
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
              : null;

            return (
              <div key={item.id} className="category-product-card">
                <Link href={`/product/${item.id}`} className="category-card-image-wrap">
                  <img src={item.image} alt={item.title} loading="lazy" />

                  {item.badge && <span className="category-card-badge">{item.badge}</span>}

                  {discountPercent && discountPercent > 0 && (
                    <span className="category-card-discount-tag">{discountPercent}% OFF</span>
                  )}
                </Link>

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
                    <Check size={10} strokeWidth={3} /> In Stock · Handcrafted
                  </span>

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
                      className={`category-card-add-btn ${quickAdded[item.id] ? 'added' : ''}`}
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
      </main>
    </div>
  );
}
