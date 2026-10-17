'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Check, Sparkles, SlidersHorizontal, Flame, Droplets, Gift, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

export interface ProductItem {
  _id?: string;
  id?: string;
  sku?: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: any;
  category?: string;
  productType?: string;
  scentFamily?: string;
  volume?: string;
}

export default function ProductCollection({ products }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { storeData, updateProduct, isEditing } = useVisualEdit();
  const [activeTab, setActiveTab] = useState<'perfumes' | 'attars-ouds' | 'candles' | 'discovery' | 'all'>('perfumes');
  const [showAll, setShowAll] = useState(false);
  const [addedItems, setAddedItems] = useState<{ [id: string]: boolean }>({});

  const activeProducts =
    storeData?.products && storeData.products.length > 0
      ? storeData.products
      : products || [];

  const candlesFromStore = activeProducts.filter(
    (p: any) => p.category === 'candles' || p.productType === 'CANDLE'
  );

  const attarsAndOudsFromStore = activeProducts.filter(
    (p: any) =>
      p.productType === 'ATTAR' ||
      (p.title || '').toLowerCase().includes('attar') ||
      p.category === 'royal-oud' ||
      p.id === 'prod-khwaab' ||
      p.id === 'prod-bulgarian-rose-attar' ||
      p.id === 'prod-oud-regence' ||
      p.id === 'prod-pralin-de-minuit'
  );

  const perfumesFromStore = activeProducts.filter(
    (p: any) =>
      (p.productType === 'PERFUME' ||
        (p.category !== 'candles' &&
          !p.productType &&
          !(p.title || '').toLowerCase().includes('attar') &&
          p.category !== 'royal-oud')) &&
      !p.id.includes('disc') &&
      p.id !== 'prod-6'
  );

  const discoveryFromStore = activeProducts.filter(
    (p: any) =>
      p.category === 'discovery-sets' ||
      p.category === 'gift-shop' ||
      p.productType === 'DISCOVERY' ||
      p.productType === 'GIFT_SET' ||
      (p.id || '').includes('disc') ||
      p.id === 'prod-6'
  );

  const currentTabProducts =
    activeTab === 'perfumes'
      ? perfumesFromStore
      : activeTab === 'attars-ouds'
      ? attarsAndOudsFromStore
      : activeTab === 'candles'
      ? candlesFromStore
      : activeTab === 'discovery'
      ? discoveryFromStore
      : activeProducts;

  const displayProducts =
    showAll || activeTab === 'all'
      ? currentTabProducts
      : currentTabProducts.slice(0, 8);

  const handleAdd = (item: ProductItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prodId = item.id || item._id || 'prod-1';
    addToCart({
      id: prodId,
      sku: item.sku || `NF-${prodId}`,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category || (activeTab === 'perfumes' ? 'perfumes' : 'candles'),
      inStock: true,
      stockCount: 50,
    });

    setAddedItems((prev) => ({ ...prev, [prodId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [prodId]: false }));
    }, 1800);
  };

  return (
    <section id="candles" className="product-collection-section">
      <div className="product-collection-container">
        {/* Section Header: Our Products */}
        <div className="product-collection-header">
          <EditableText
            as="h2"
            fieldPath="siteSettings.ourProductsTitle"
            value={storeData?.siteSettings?.ourProductsTitle || "Our Products & Atelier Creations"}
            style={{
              fontFamily: 'var(--font-heading-family)',
              fontSize: 'clamp(34px, 4.5vw, 48px)',
              color: '#121212',
              margin: '0 0 14px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          />
          <EditableText
            as="p"
            fieldPath="siteSettings.ourProductsSubtitle"
            value={
              storeData?.siteSettings?.ourProductsSubtitle ||
              "Explore our complete universe of 20% Eau de Parfum flacons, 100% alcohol-free artisanal attars, and hand-poured secret message soy candles."
            }
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '15px',
              color: '#666666',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* Centered Switcher Pills */}
        <div className="collection-switcher-wrap">
          <div className="collection-switcher-track">
            <button
              type="button"
              onClick={() => { setActiveTab('perfumes'); setShowAll(false); }}
              className={`collection-switcher-btn ${activeTab === 'perfumes' ? 'active' : ''}`}
            >
              {activeTab === 'perfumes' && <span className="collection-switcher-dot" />}
              <Sparkles size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Perfumes
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('attars-ouds'); setShowAll(false); }}
              className={`collection-switcher-btn ${activeTab === 'attars-ouds' ? 'active' : ''}`}
            >
              {activeTab === 'attars-ouds' && <span className="collection-switcher-dot" />}
              <Droplets size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Attars<span className="tab-desktop-only"> & Ouds</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('candles'); setShowAll(false); }}
              className={`collection-switcher-btn ${activeTab === 'candles' ? 'active' : ''}`}
            >
              {activeTab === 'candles' && <span className="collection-switcher-dot" />}
              <Flame size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Candles
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('discovery'); setShowAll(false); }}
              className={`collection-switcher-btn ${activeTab === 'discovery' ? 'active' : ''}`}
            >
              {activeTab === 'discovery' && <span className="collection-switcher-dot" />}
              <Gift size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Discovery<span className="tab-desktop-only"> & Gifts</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('all'); setShowAll(false); }}
              className={`collection-switcher-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              {activeTab === 'all' && <span className="collection-switcher-dot" />}
              All<span className="tab-desktop-only"> Creations</span>
            </button>
          </div>
        </div>

        {/* 4-Column Large Looming Product Cards Grid */}
        <div className="product-collection-large-grid">
          {displayProducts.map((item) => (
            <div
              key={item.id}
              className="collection-product-card"
            >
              {/* Product Card Image Frame */}
              <Link
                href={`/product/${item.id || 'prod-1'}`}
                onClick={(e) => {
                  if (isEditing) e.preventDefault();
                }}
                className="product-card-image-frame"
              >
                <EditableImage
                  src={item.image}
                  alt={item.title}
                  label={item.title}
                  onImageChange={(url) => item.id && updateProduct(item.id, { image: url })}
                />

                {item.badge && (
                  <div className="product-card-top-badge">
                    <EditableText
                      as="span"
                      value={item.badge}
                      onValueChange={(val) => item.id && updateProduct(item.id, { badge: val })}
                    />
                  </div>
                )}

                {item.volume && (
                  <div className="product-card-volume-pill">
                    <span>{item.volume}</span>
                  </div>
                )}
              </Link>

              {/* Card Meta Content */}
              <div className="card-meta-content">
                {/* Rating Stars Bar */}
                <div className="card-meta-rating-row">
                  <div style={{ display: 'flex', color: '#BBA58E' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#BBA58E" color="#BBA58E" />
                    ))}
                  </div>
                  <span className="card-meta-review-count">
                    {item.rating || 5.0} ({item.reviewsCount || 120})
                  </span>
                  <span className="card-meta-category-tag">
                    {item.category === 'candles' ? 'Soy Candle' : item.productType === 'ATTAR' ? 'Pure Attar' : '20% EDP'}
                  </span>
                </div>

                {/* Product Title */}
                <Link
                  href={`/product/${item.id || 'prod-1'}`}
                  onClick={(e) => {
                    if (isEditing) e.preventDefault();
                  }}
                  className="card-meta-title-link"
                >
                  <EditableText
                    as="h3"
                    value={item.title}
                    onValueChange={(val) => item.id && updateProduct(item.id, { title: val })}
                  />
                </Link>

                {/* Subtitle / Notes */}
                <EditableText
                  as="p"
                  className="card-meta-subtitle"
                  value={item.subtitle}
                  onValueChange={(val) => item.id && updateProduct(item.id, { subtitle: val })}
                />

                {/* Scent Accord Pill if available */}
                {item.scentFamily && (
                  <div className="card-meta-accord-pill">
                    <span>{item.scentFamily}</span>
                  </div>
                )}

                {/* In Stock Pill */}
                <div className="card-stock-status-row">
                  <span className="card-in-stock-badge">
                    <Check size={11} strokeWidth={3} /> In Stock · Atelier Ready
                  </span>
                </div>

                {/* Card Bottom Bar (Pricing & Add to Cart) */}
                <div className="card-bottom-bar">
                  <div className="card-pricing-row">
                    <EditableText
                      as="span"
                      className="card-price-current"
                      value={`₹${item.price.toLocaleString('en-IN')}`}
                      onValueChange={(val) => {
                        const num = parseInt(val.replace(/[^0-9]/g, ''));
                        if (!isNaN(num) && item.id) updateProduct(item.id, { price: num });
                      }}
                    />
                    {item.originalPrice && (
                      <span className="card-price-original">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="card-discount-tag">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`btn-card-add ${addedItems[item.id || ''] ? 'added' : ''}`}
                    onClick={(e) => handleAdd(item, e)}
                  >
                    {addedItems[item.id || ''] ? (
                      <>
                        <Check size={14} strokeWidth={3} /> ADDED TO BAG
                      </>
                    ) : (
                      'ADD TO BAG'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More / View All Toggle */}
        {activeTab !== 'all' && currentTabProducts.length > 8 && (
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 38px',
                borderRadius: '30px',
                border: '1.5px solid #121212',
                background: showAll ? '#121212' : '#ffffff',
                color: showAll ? '#ffffff' : '#121212',
                fontSize: '13px',
                fontFamily: 'var(--font-body-family)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: showAll ? '0 10px 26px rgba(0,0,0,0.14)' : '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              <Sparkles size={14} color={showAll ? '#BBA58E' : '#997B5E'} />
              {showAll
                ? `SHOW FEWER ${activeTab.toUpperCase()}`
                : `VIEW ALL ${activeTab.toUpperCase()} (${currentTabProducts.length})`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
