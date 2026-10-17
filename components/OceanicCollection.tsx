'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Droplets, Sparkles, Star, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

const fallbackOceanProducts = [
  {
    id: 'prod-the-ninth-tide',
    title: 'THE NINTH TIDE Eau de Parfum',
    subtitle: 'High-Seas Marine Accord · Crisp Bergamot Ozone · Sun-Bleached Cedar & Amber',
    price: 1399,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 146,
    badge: 'CRISP OCEANIC FRESH',
    image: '/images/products/perfume-tassel-flacon-8.jpg',
    category: 'ocean-fresh',
  },
  {
    id: 'prod-the-eclipse',
    title: 'THE ECLIPSE Eau de Parfum',
    subtitle: 'Clary Sage, Italian Bergamot & Rosemary · Egyptian Jasmine · Mineral Ambergris',
    price: 1399,
    originalPrice: 1999,
    rating: 5.0,
    reviewsCount: 184,
    badge: 'MALE · SIGNATURE NOIR',
    image: '/images/products/perfume-tassel-flacon-4.jpg',
    category: 'ocean-fresh',
  },
  {
    id: 'prod-10',
    title: 'Aqua Noir Intense Tassel Flacon EDP',
    subtitle: 'Smoky Amber · Marine Accord · Bergamot & Cedar',
    price: 1699,
    originalPrice: 2199,
    rating: 4.8,
    reviewsCount: 92,
    badge: 'INTENSE EDP',
    image: '/images/products/perfume-tassel-flacon-2.jpg',
    category: 'ocean-fresh',
  },
  {
    id: 'prod-11',
    title: 'Fresh Citrus & Ozone Pure Crystal Attar',
    subtitle: 'Pure Concentrated Oil · Crisp Sea Salt · 24+ Hr Longevity · Alcohol-Free',
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviewsCount: 210,
    badge: 'ALCOHOL FREE ATTAR',
    image: '/images/products/attar-crystal-flacon.jpg',
    category: 'ocean-fresh',
  },
];

export default function OceanicCollection({ products }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { storeData, updateProduct, isEditing } = useVisualEdit();
  const [addedItems, setAddedItems] = useState<{ [id: string]: boolean }>({});

  const sourceProducts = storeData?.products && storeData.products.length > 0 ? storeData.products : products || [];

  const matchedOceanic =
    sourceProducts && sourceProducts.length > 0
      ? sourceProducts.filter(
          (p: any) =>
            p.category === 'ocean-fresh' ||
            (p.title || '').toLowerCase().includes('tide') ||
            (p.title || '').toLowerCase().includes('eclipse') ||
            p.id === 'prod-the-ninth-tide' ||
            p.id === 'prod-the-eclipse'
        ).slice(0, 4)
      : fallbackOceanProducts;

  const displayProducts = matchedOceanic.length >= 2 ? matchedOceanic : fallbackOceanProducts;

  const handleAdd = (product: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prodId = product.id || 'prod-the-ninth-tide';
    addToCart({
      id: prodId,
      sku: product.sku || `NF-OCN-${prodId}`,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: 'ocean-fresh',
      inStock: true,
      stockCount: 40,
    });
    setAddedItems((prev) => ({ ...prev, [prodId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [prodId]: false }));
    }, 1800);
  };

  return (
    <section className="oceanic-section" id="ocean-fresh">
      <div className="oceanic-section-container">
        <div className="section-header-left">
          <div className="oceanic-badge-pill">
            <Droplets size={13} color="#a3d9d3" />
            <span>FRESH & HIGH-SEAS NOTES</span>
          </div>
          <h2 className="section-title light font-serif">Oceanic & Fresh High-Seas Blends</h2>
          <p className="section-subtitle light">
            Invigorating top notes of sea breeze, Italian bergamot, clary sage, and crisp ozone anchored in mineral ambergris and sun-bleached cedar.
          </p>
        </div>

        <div className="product-collection-large-grid">
          {displayProducts.map((product: any, idx: number) => {
            const prodId = product.id || `ocean-${idx}`;
            return (
              <div key={prodId} className="collection-product-card oceanic-theme-card">
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
                    <div className="product-card-top-badge" style={{ background: 'rgba(240, 253, 250, 0.94)', color: '#0f766e' }}>
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
