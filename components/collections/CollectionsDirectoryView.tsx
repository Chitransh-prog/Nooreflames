'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Star,
  Check,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Truck,
  Gift,
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

  const [activeTab, setActiveTab] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [quickAdded, setQuickAdded] = useState<{ [id: string]: boolean }>({});

  const products: Product[] = useMemo(() => {
    if (storeData?.products && Array.isArray(storeData.products) && storeData.products.length > 0) {
      return storeData.products;
    }
    return initialProducts;
  }, [storeData, initialProducts]);

  // Filter products by active category tab
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeTab === 'men') {
      list = list.filter((p) => {
        const title = p.title.toLowerCase();
        return (
          p.category === 'royal-oud' ||
          p.category === 'ocean-fresh' ||
          p.id === 'prod-disc-him' ||
          title.includes('ocean') ||
          title.includes('oud') ||
          title.includes('tobacco') ||
          title.includes('aqua')
        );
      });
    } else if (activeTab === 'women') {
      list = list.filter((p) => {
        const title = p.title.toLowerCase();
        return (
          p.category === 'floral-rose' ||
          p.id === 'prod-disc-her' ||
          title.includes('rose') ||
          title.includes('jasmine') ||
          title.includes('amber noir') ||
          title.includes('citrus ozone')
        );
      });
    } else if (activeTab === 'gift-shop') {
      list = list.filter((p) => {
        return (
          p.category === 'candles' ||
          p.category === 'gift-shop' ||
          p.id === 'prod-6' ||
          p.id === 'prod-1'
        );
      });
    } else if (activeTab === 'discovery-sets') {
      list = list.filter((p) => {
        const title = p.title.toLowerCase();
        return (
          p.category === 'discovery-sets' ||
          p.id.includes('disc') ||
          p.id === 'prod-26' ||
          title.includes('discovery') ||
          title.includes('tester')
        );
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
  }, [products, activeTab, sortBy]);

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
          <span className="category-breadcrumb-current">Collections</span>
        </div>
      </div>

      {/* 2. Collections Hero Header (Light Luxury Theme) */}
      <section className="collections-hero">
        <div className="collections-hero-container">
          <span className="collections-hero-kicker">
            <Sparkles size={12} color="#BBA58E" /> NOOR-E-FLAMES ATELIER · COMPLETE DIRECTORY
          </span>
          <h1 className="collections-hero-title">Our Signature Collections</h1>
          <p className="collections-hero-sub">
            Immerse in pure botanical extraits, artisanal alcohol-free attars, and hand-poured sculptural candles crafted for mindful rituals.
          </p>

          <div className="collections-quick-jump">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`collections-jump-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              All Collections
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('men')}
              className={`collections-jump-btn ${activeTab === 'men' ? 'active' : ''}`}
            >
              Men's Extraits
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('women')}
              className={`collections-jump-btn ${activeTab === 'women' ? 'active' : ''}`}
            >
              Women's Haute Parfumerie
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gift-shop')}
              className={`collections-jump-btn ${activeTab === 'gift-shop' ? 'active' : ''}`}
            >
              The Artisanal Gift Shop
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('discovery-sets')}
              className={`collections-jump-btn ${activeTab === 'discovery-sets' ? 'active' : ''}`}
            >
              Signature Discovery Sets
            </button>
          </div>
        </div>
      </section>

      {/* 3. Four Core Category Cards Showcase (2x2 Grid) */}
      <section className="collections-categories-section">
        <div className="collections-cards-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="collections-card-item">
              <div className="collections-card-media">
                <img src={cat.heroImage} alt={cat.name} loading="lazy" />
                <span className="collections-card-badge">{cat.name}</span>
              </div>
              <div className="collections-card-info">
                <span className="collections-card-kicker">{cat.editorialTag}</span>
                <h3 className="collections-card-name">{cat.title}</h3>
                <p className="collections-card-desc">{cat.subtitle}</p>
                <Link href={`/category/${cat.slug}`} className="collections-card-cta">
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Atelier Values Strip */}
      <div className="category-perks-strip">
        <div className="category-perks-container">
          <div className="category-perk-item">
            <div className="category-perk-icon-wrap">
              <Clock size={19} />
            </div>
            <div className="category-perk-text">
              <h4>14+ Hour Projection</h4>
              <p>Ultra-concentration extraits crafted for all-day sillage.</p>
            </div>
          </div>
          <div className="category-perk-item">
            <div className="category-perk-icon-wrap">
              <ShieldCheck size={19} />
            </div>
            <div className="category-perk-text">
              <h4>Clean & IFRA Certified</h4>
              <p>Pure botanical extracts with zero harmful phthalates.</p>
            </div>
          </div>
          <div className="category-perk-item">
            <div className="category-perk-icon-wrap">
              <Gift size={19} />
            </div>
            <div className="category-perk-text">
              <h4>Sealed Wax Medallion</h4>
              <p>Every keepsake box hand-sealed with pure wax.</p>
            </div>
          </div>
          <div className="category-perk-item">
            <div className="category-perk-icon-wrap">
              <Truck size={19} />
            </div>
            <div className="category-perk-text">
              <h4>Free Nationwide Courier</h4>
              <p>Complimentary express courier on orders above ₹999.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Filter & Sorting Toolbar */}
      <div className="category-toolbar-section">
        <div className="category-toolbar-container">
          <div className="category-filter-pills">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`category-filter-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              {activeTab === 'all' && <span className="category-filter-dot" />}
              All Creations ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('men')}
              className={`category-filter-btn ${activeTab === 'men' ? 'active' : ''}`}
            >
              {activeTab === 'men' && <span className="category-filter-dot" />}
              Men
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('women')}
              className={`category-filter-btn ${activeTab === 'women' ? 'active' : ''}`}
            >
              {activeTab === 'women' && <span className="category-filter-dot" />}
              Women
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gift-shop')}
              className={`category-filter-btn ${activeTab === 'gift-shop' ? 'active' : ''}`}
            >
              {activeTab === 'gift-shop' && <span className="category-filter-dot" />}
              Gift Shop
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('discovery-sets')}
              className={`category-filter-btn ${activeTab === 'discovery-sets' ? 'active' : ''}`}
            >
              {activeTab === 'discovery-sets' && <span className="category-filter-dot" />}
              Discovery Sets
            </button>
          </div>

          <div className="category-toolbar-right">
            <span className="category-count-label">
              Showing <strong>{filteredProducts.length}</strong> creations
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
