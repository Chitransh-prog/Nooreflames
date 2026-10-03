'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Check, Sparkles } from 'lucide-react';
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
}

export default function ProductCollection({ products }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { storeData, updateProduct, isEditing } = useVisualEdit();
  const [activeTab, setActiveTab] = useState<'perfumes' | 'attars-ouds' | 'candles' | 'all'>('perfumes');
  const [showAll, setShowAll] = useState(false);
  const [addedItems, setAddedItems] = useState<{ [id: string]: boolean }>({});

  const activeProducts =
    storeData?.products && storeData.products.length > 0
      ? storeData.products
      : products || [];

  const candlesFromStore = activeProducts.filter((p: any) => p.category === 'candles' || p.productType === 'CANDLE');
  const attarsAndOudsFromStore = activeProducts.filter((p: any) =>
    p.productType === 'ATTAR' || (p.title || '').toLowerCase().includes('attar')
  );
  const perfumesFromStore = activeProducts.filter((p: any) =>
    (p.productType === 'PERFUME' || (p.category !== 'candles' && !p.productType && !(p.title || '').toLowerCase().includes('attar'))) &&
    !p.id.includes('disc') && p.id !== 'prod-6'
  );

  const currentTabProducts =
    activeTab === 'perfumes'
      ? perfumesFromStore
      : activeTab === 'attars-ouds'
      ? attarsAndOudsFromStore
      : activeTab === 'candles'
      ? candlesFromStore
      : [
          ...perfumesFromStore,
          ...attarsAndOudsFromStore,
          ...candlesFromStore,
        ];

  const displayProducts =
    showAll || activeTab === 'all'
      ? currentTabProducts
      : currentTabProducts.slice(0, 12);

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
            value="Our Products"
            style={{
              fontFamily: 'var(--font-heading-family)',
              fontSize: 'clamp(34px, 4.5vw, 46px)',
              color: '#121212',
              margin: '0 0 12px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          />
          <EditableText
            as="p"
            value="Handcrafted sculptural candles and royal Eau de Parfum fragrances created for mindful moments and elevated living."
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '14px',
              color: '#707070',
              maxWidth: '580px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* Centered Switcher Pills (Perfumes | Attars & Ouds | Candles | All Products) */}
        <div className="collection-switcher-wrap">
          <div className="collection-switcher-track">
            <button
              type="button"
              onClick={() => { setActiveTab('perfumes'); setShowAll(false); }}
              className={`collection-switcher-btn ${activeTab === 'perfumes' ? 'active' : ''}`}
            >
              {activeTab === 'perfumes' && (
                <span className="collection-switcher-dot" />
              )}
              Perfumes
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('attars-ouds'); setShowAll(false); }}
              className={`collection-switcher-btn ${activeTab === 'attars-ouds' ? 'active' : ''}`}
            >
              {activeTab === 'attars-ouds' && (
                <span className="collection-switcher-dot" />
              )}
              Attars<span className="tab-desktop-only"> & Ouds</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('candles'); setShowAll(false); }}
              className={`collection-switcher-btn ${activeTab === 'candles' ? 'active' : ''}`}
            >
              {activeTab === 'candles' && (
                <span className="collection-switcher-dot" />
              )}
              Candles
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('all'); setShowAll(false); }}
              className={`collection-switcher-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              {activeTab === 'all' && (
                <span className="collection-switcher-dot" />
              )}
              All<span className="tab-desktop-only"> Products</span>
            </button>
          </div>
        </div>

        {/* 5-Column by 2-Row Unified Product Grid (10 Products Total) */}
        <div className="product-collection-5grid">
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
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(255, 255, 255, 0.94)',
                      color: '#121212',
                      padding: '3px 10px',
                      borderRadius: '10px',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      zIndex: 10,
                    }}
                  >
                    <EditableText
                      as="span"
                      value={item.badge}
                      onValueChange={(val) => item.id && updateProduct(item.id, { badge: val })}
                    />
                  </div>
                )}
              </Link>

              {/* Card Meta Content */}
              <div className="card-meta-content">
                {/* Rating Stars Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', color: '#BBA58E' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#BBA58E" color="#BBA58E" />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: '#707070', marginLeft: '4px' }}>
                    {item.rating || 5.0} ({item.reviewsCount || 120})
                  </span>
                </div>

                {/* Product Title */}
                <Link
                  href={`/product/${item.id || 'prod-1'}`}
                  onClick={(e) => {
                    if (isEditing) e.preventDefault();
                  }}
                  style={{ textDecoration: 'none', color: 'inherit' }}
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
                  value={item.subtitle}
                  onValueChange={(val) => item.id && updateProduct(item.id, { subtitle: val })}
                />

                {/* In Stock Pill */}
                <div style={{ marginBottom: '10px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#166534',
                      background: '#dcfce7',
                      padding: '2px 8px',
                      borderRadius: '10px',
                    }}
                  >
                    <Check size={10} strokeWidth={3} /> In Stock
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
                      'ADD TO CART'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More / View All Toggle */}
        {activeTab !== 'all' && currentTabProducts.length > 10 && (
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '13px 36px',
                borderRadius: '30px',
                border: '1.5px solid #121212',
                background: showAll ? '#121212' : 'transparent',
                color: showAll ? '#ffffff' : '#121212',
                fontSize: '12px',
                fontFamily: 'var(--font-body-family)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: showAll ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
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
