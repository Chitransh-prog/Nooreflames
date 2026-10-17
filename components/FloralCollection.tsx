'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flower2, Sparkles, Star, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

const fallbackFloralProducts = [
  {
    id: 'prod-blush-hour',
    title: 'BLUSH HOUR Eau de Parfum',
    subtitle: 'Italian Mandarin & Wild Berries · White Gardenia & Frangipani · Brown Sugar Nectar',
    price: 1292,
    originalPrice: 1899,
    rating: 4.9,
    reviewsCount: 168,
    badge: 'MOST POPULAR',
    image: '/images/products/perfume-tassel-flacon.jpg',
    category: 'floral-rose',
  },
  {
    id: 'prod-bulgarian-rose-attar',
    title: 'Bulgarian Rose Pure Crystal Attar',
    subtitle: 'Distilled Bulgarian & Damask Rose Petals · Wild Jasmine · 0% Alcohol',
    price: 999,
    originalPrice: 1499,
    rating: 5.0,
    reviewsCount: 164,
    badge: 'ARTISANAL ATTAR',
    image: '/images/products/attar-crystal-flacon-2.jpg',
    category: 'floral-rose',
  },
  {
    id: 'prod-rose-maudite',
    title: 'ROSE MAUDITE Eau de Parfum',
    subtitle: 'Fresh Rose Petals & Cardamom · Rose Absolute · Creamy Sandalwood & Amber',
    price: 1399,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 172,
    badge: 'VELVET DAMASK',
    image: '/images/products/perfume-tassel-flacon-6.jpg',
    category: 'floral-rose',
  },
  {
    id: 'prod-23',
    title: 'Rose Whimsy Heart-Melts Botanical Candle',
    subtitle: 'Sculpted Botanical Wax Hearts · Damascus Rose Petals & Sweet French Vanilla',
    price: 599,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 92,
    badge: 'BOTANICAL HEARTS',
    image: '/images/products/rose-whimsy-real.jpg',
    category: 'floral-rose',
  },
];

export default function FloralCollection({ products }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { storeData, updateProduct, isEditing } = useVisualEdit();
  const [addedItems, setAddedItems] = useState<{ [id: string]: boolean }>({});

  const sourceProducts = storeData?.products && storeData.products.length > 0 ? storeData.products : products || [];

  const matchedFlorals =
    sourceProducts && sourceProducts.length > 0
      ? sourceProducts.filter(
          (p: any) =>
            p.category === 'floral-rose' ||
            (p.title || '').toLowerCase().includes('rose') ||
            p.id === 'prod-blush-hour' ||
            p.id === 'prod-bulgarian-rose-attar' ||
            p.id === 'prod-rose-maudite' ||
            p.id === 'prod-23'
        ).slice(0, 4)
      : fallbackFloralProducts;

  const displayProducts = matchedFlorals.length >= 4 ? matchedFlorals : fallbackFloralProducts;

  const handleAdd = (product: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prodId = product.id || 'prod-blush-hour';
    addToCart({
      id: prodId,
      sku: product.sku || `NF-FLR-${prodId}`,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: 'floral-rose',
      inStock: true,
      stockCount: 40,
    });
    setAddedItems((prev) => ({ ...prev, [prodId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [prodId]: false }));
    }, 1800);
  };

  return (
    <section className="floral-section" id="floral-rose">
      <div className="floral-section-container">
        <div className="section-header-center">
          <div className="floral-badge-pill">
            <Flower2 size={13} color="#d88373" />
            <span>FLORAL & VELVET NOTES</span>
          </div>
          <h2 className="section-title font-serif">Blossom & Velvet Rose Collection</h2>
          <p className="section-subtitle">
            Intoxicating blooms harvested at dawn, distilled into silk-smooth 20% Eau de Parfum, alcohol-free crystal attars, and botanical soy candles.
          </p>
        </div>

        <div className="product-collection-large-grid">
          {displayProducts.map((product: any, idx: number) => {
            const prodId = product.id || `floral-${idx}`;
            return (
              <div key={prodId} className="collection-product-card floral-theme-card">
                <Link
                  href={`/product/${prodId}`}
                  onClick={(e) => {
                    if (isEditing) e.preventDefault();
                  }}
                  className="product-card-image-frame"
                >
                  <EditableImage
                    src={product.image}
                    alt={product.title}
                    label={product.title}
                    onImageChange={(url) => updateProduct(prodId, { image: url })}
                  />

                  {product.badge && (
                    <div className="product-card-top-badge" style={{ background: 'rgba(255, 245, 245, 0.94)', color: '#b91c1c' }}>
                      <EditableText
                        as="span"
                        value={product.badge}
                        onValueChange={(val) => updateProduct(prodId, { badge: val })}
                      />
                    </div>
                  )}
                </Link>

                <div className="card-meta-content">
                  <div className="card-meta-rating-row">
                    <div style={{ display: 'flex', color: '#BBA58E' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#BBA58E" color="#BBA58E" />
                      ))}
                    </div>
                    <span className="card-meta-review-count">
                      {product.rating || 5.0} ({product.reviewsCount || 120})
                    </span>
                  </div>

                  <Link
                    href={`/product/${prodId}`}
                    onClick={(e) => {
                      if (isEditing) e.preventDefault();
                    }}
                    className="card-meta-title-link"
                  >
                    <EditableText
                      as="h3"
                      value={product.title}
                      onValueChange={(val) => updateProduct(prodId, { title: val })}
                    />
                  </Link>

                  <EditableText
                    as="p"
                    className="card-meta-subtitle"
                    value={product.subtitle}
                    onValueChange={(val) => updateProduct(prodId, { subtitle: val })}
                  />

                  <div className="card-stock-status-row">
                    <span className="card-in-stock-badge">
                      <Check size={11} strokeWidth={3} /> In Stock
                    </span>
                  </div>

                  <div className="card-bottom-bar">
                    <div className="card-pricing-row">
                      <span className="card-price-current">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="card-price-original">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className={`btn-card-add ${addedItems[prodId] ? 'added' : ''}`}
                      onClick={(e) => handleAdd(product, e)}
                    >
                      {addedItems[prodId] ? (
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
