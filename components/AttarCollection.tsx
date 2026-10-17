'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Check, Sparkles, Droplets, ShieldCheck, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

export interface AttarItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge: string;
  image: string;
  scentFamily?: string;
  volume?: string;
  longevity?: string;
}

const fallbackAttars: AttarItem[] = [
  {
    id: 'prod-khwaab',
    title: 'KHWAAB Pure Crystal Attar',
    subtitle: 'Turkish & Damask Rose · Fresh Citrus Dew · Warm Amber & Sandalwood',
    price: 999,
    originalPrice: 1499,
    rating: 5.0,
    reviewsCount: 208,
    badge: '100% PURE ATTAR · 0% ALCOHOL',
    image: '/images/products/attar-crystal-flacon-4.jpg',
    scentFamily: 'Dreamy Fresh Floral & Warm Woody Amber',
    volume: '8ML Pure Crystal Flacon',
    longevity: '24+ Hours Longevity',
  },
  {
    id: 'prod-bulgarian-rose-attar',
    title: 'Bulgarian Rose Concentrated Attar',
    subtitle: 'Pure Distilled Bulgarian Rose Petals · French Jasmine & Amber',
    price: 999,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 164,
    badge: 'ARTISANAL STEAM DISTILLED',
    image: '/images/products/attar-crystal-flacon-2.jpg',
    scentFamily: 'Velvety Damask Rose & Rare Botanicals',
    volume: '8ML Pure Crystal Flacon',
    longevity: '24+ Hours Longevity',
  },
  {
    id: 'prod-oud-regence',
    title: 'OUD RÉGENCE Pure Crystal Attar',
    subtitle: 'Royal Assam Agarwood · Warm Golden Saffron & Aged Leather Accord',
    price: 999,
    originalPrice: 1599,
    rating: 5.0,
    reviewsCount: 182,
    badge: 'ROYAL ASSAM OUD',
    image: '/images/products/attar-crystal-flacon-3.jpg',
    scentFamily: 'Smoky Amber Agarwood & Saffron',
    volume: '8ML Pure Crystal Flacon',
    longevity: '30+ Hours Longevity',
  },
  {
    id: 'prod-pralin-de-minuit',
    title: 'PRALIN DE MINUIT Concentrated Attar',
    subtitle: 'Midnight Roasted Hazelnut Praline · Golden Honey Nectar & Vanilla Pod',
    price: 999,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 148,
    badge: 'GOURMAND ATTAR',
    image: '/images/products/attar-crystal-flacon.jpg',
    scentFamily: 'Warm Roasted Praline & Vanilla',
    volume: '8ML Pure Crystal Flacon',
    longevity: '24+ Hours Longevity',
  },
];

export default function AttarCollection({ products }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { storeData, updateProduct, isEditing } = useVisualEdit();
  const [addedItems, setAddedItems] = useState<{ [id: string]: boolean }>({});

  const sourceProducts = storeData?.products && storeData.products.length > 0 ? storeData.products : products || [];

  const matchedAttars: AttarItem[] =
    sourceProducts && sourceProducts.length > 0
      ? sourceProducts
          .filter(
            (p: any) =>
              p.productType === 'ATTAR' ||
              (p.title || '').toLowerCase().includes('attar') ||
              p.id === 'prod-khwaab' ||
              p.id === 'prod-bulgarian-rose-attar' ||
              p.id === 'prod-oud-regence' ||
              p.id === 'prod-pralin-de-minuit'
          )
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle,
            price: p.price,
            originalPrice: p.originalPrice || Math.round(p.price * 1.45),
            rating: p.rating || 5.0,
            reviewsCount: p.reviewsCount || 150,
            badge: p.badge || '100% PURE ATTAR · 0% ALCOHOL',
            image: p.image || '/images/products/attar-crystal-flacon.jpg',
            scentFamily: p.scentFamily || 'Pure Concentrated Perfume Oil',
            volume: p.volume || '8ML Pure Crystal Flacon',
            longevity: p.longevity || '24+ Hours Longevity',
          }))
      : fallbackAttars;

  const displayItems = matchedAttars.length >= 4 ? matchedAttars : fallbackAttars;

  const handleAdd = (item: AttarItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addToCart({
      id: item.id,
      sku: `NF-ATTAR-${item.id}`,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: 'attars-ouds',
      inStock: true,
      stockCount: 50,
    });
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  return (
    <section id="attars-section" className="attar-collection-section">
      <div className="attar-section-container">
        {/* Section Header */}
        <div className="attar-section-header">
          <div className="attar-header-pill">
            <Droplets size={13} color="#997B5E" />
            <span>100% ALCOHOL-FREE · PURE PERFUME OILS</span>
          </div>

          <h2 className="attar-section-title">
            Artisanal Attars & Crystal Flacons
          </h2>

          <p className="attar-section-subtitle">
            Ancient steam distillations of Bulgarian roses, Assam agarwood, and amber resins encased in hand-cut crystal flacons. Formulated without alcohol for a reverent, 24+ hour skin contact ritual.
          </p>

          {/* Quick Value Props Strip */}
          <div className="attar-perks-row">
            <div className="attar-perk-badge">
              <ShieldCheck size={14} color="#166534" />
              <span>0% Alcohol · 100% Pure Oil</span>
            </div>
            <div className="attar-perk-badge">
              <Clock size={14} color="#997B5E" />
              <span>24+ Hours Pulse-Point Wear</span>
            </div>
            <div className="attar-perk-badge">
              <Sparkles size={14} color="#997B5E" />
              <span>Hand-Cut Crystal Flacon</span>
            </div>
          </div>
        </div>

        {/* Large Looming 4-Card Grid */}
        <div className="attar-cards-grid">
          {displayItems.map((item) => (
            <div key={item.id} className="attar-large-card">
              {/* Product Image Frame */}
              <Link
                href={`/product/${item.id}`}
                onClick={(e) => {
                  if (isEditing) e.preventDefault();
                }}
                className="attar-card-image-frame"
              >
                <EditableImage
                  src={item.image}
                  alt={item.title}
                  label={item.title}
                  onImageChange={(url) => updateProduct(item.id, { image: url })}
                />

                {/* Badge */}
                {item.badge && (
                  <div className="attar-card-badge">
                    <EditableText
                      as="span"
                      value={item.badge}
                      onValueChange={(val) => updateProduct(item.id, { badge: val })}
                    />
                  </div>
                )}

                {/* Flacon Volume Pill */}
                <div className="attar-volume-tag">
                  <span>8ML CRYSTAL FLACON</span>
                </div>
              </Link>

              {/* Card Meta Content */}
              <div className="attar-card-body">
                {/* Rating & Longevity Tag */}
                <div className="attar-card-top-meta">
                  <div className="attar-stars-row">
                    <div style={{ display: 'flex', color: '#BBA58E' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#BBA58E" color="#BBA58E" />
                      ))}
                    </div>
                    <span className="attar-reviews-text">
                      {item.rating || 5.0} ({item.reviewsCount || 180})
                    </span>
                  </div>
                  <span className="attar-longevity-badge">24H+ WEAR</span>
                </div>

                {/* Product Title */}
                <Link
                  href={`/product/${item.id}`}
                  onClick={(e) => {
                    if (isEditing) e.preventDefault();
                  }}
                  className="attar-card-title-link"
                >
                  <EditableText
                    as="h3"
                    className="attar-card-title"
                    value={item.title}
                    onValueChange={(val) => updateProduct(item.id, { title: val })}
                  />
                </Link>

                {/* Subtitle / Notes */}
                <EditableText
                  as="p"
                  className="attar-card-subtitle"
                  value={item.subtitle}
                  onValueChange={(val) => updateProduct(item.id, { subtitle: val })}
                />

                {/* Scent Accord Pill */}
                {item.scentFamily && (
                  <div className="attar-accord-pill">
                    <span>{item.scentFamily}</span>
                  </div>
                )}

                {/* In Stock & Alcohol-Free Row */}
                <div className="attar-status-row">
                  <span className="attar-stock-pill">
                    <Check size={11} strokeWidth={3} /> In Stock
                  </span>
                  <span className="attar-alcohol-pill">Alcohol-Free</span>
                </div>

                {/* Bottom Bar: Pricing & Action Button */}
                <div className="attar-card-footer">
                  <div className="attar-price-block">
                    <span className="attar-price-current">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice && (
                      <span className="attar-price-original">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`btn-attar-add ${addedItems[item.id] ? 'added' : ''}`}
                    onClick={(e) => handleAdd(item, e)}
                  >
                    {addedItems[item.id] ? (
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
      </div>
    </section>
  );
}
