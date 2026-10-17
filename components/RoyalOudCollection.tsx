'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Check, Sparkles, Droplets, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

export interface PerfumeItem {
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
  topNotes?: string[];
}

const defaultFragranceItems: PerfumeItem[] = [
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
    scentFamily: 'Fresh Aromatic Mineral & Deep Ambergris',
    volume: '50 ML / 100 ML',
  },
  {
    id: 'prod-vanilla-covenant',
    title: 'VANILLA COVENANT Eau de Parfum',
    subtitle: 'Creamy Madagascar Vanilla Accord · Warm Golden Amber · Sensual Skin Musk',
    price: 1399,
    originalPrice: 1999,
    rating: 5.0,
    reviewsCount: 218,
    badge: 'UNISEX · BESTSELLER',
    image: '/images/products/perfume-tassel-flacon-2.jpg',
    scentFamily: 'Creamy Warm Vanilla & Golden Amber',
    volume: '50 ML / 100 ML',
  },
  {
    id: 'prod-pistachio-affair',
    title: 'PISTACHIO AFFAIR Eau de Parfum',
    subtitle: 'Roasted Pistachio, Aged Rum & Cardamom · Crisp Pear · Whipped Cream & Sandalwood',
    price: 1399,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 158,
    badge: 'GOURMAND OBSESSION',
    image: '/images/products/perfume-tassel-flacon-3.jpg',
    scentFamily: 'Nutty Spiced Gourmand & Woody Cream',
    volume: '50 ML / 100 ML',
  },
  {
    id: 'prod-after-midnight',
    title: 'AFTER MIDNIGHT Eau de Parfum',
    subtitle: 'Roasted Almond & Dark Coffee · Tuberose & Bulgarian Rose · Tonka Bean & Praline',
    price: 1399,
    originalPrice: 1999,
    rating: 5.0,
    reviewsCount: 194,
    badge: 'EVENING SEDUCTION',
    image: '/images/products/perfume-tassel-flacon-5.jpg',
    scentFamily: 'Dark Coffee, Rich Florals & Amber Spice',
    volume: '50 ML / 100 ML',
  },
  {
    id: 'prod-rose-maudite',
    title: 'ROSE MAUDITE Eau de Parfum',
    subtitle: 'Fresh Rose Petals & Pink Pepper · Cardamom & Jasmine · Creamy Sandalwood & Amber',
    price: 1399,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 172,
    badge: 'VELVET DAMASK ROSE',
    image: '/images/products/perfume-tassel-flacon-6.jpg',
    scentFamily: 'Spiced Floral Rose & Warm Sandalwood',
    volume: '50 ML / 100 ML',
  },
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
    scentFamily: 'Aquatic High-Seas & Crisp Bergamot',
    volume: '50 ML / 100 ML',
  },
  {
    id: 'prod-blush-hour',
    title: 'BLUSH HOUR Eau de Parfum',
    subtitle: 'Italian Mandarin & Wild Berries · White Gardenia & Frangipani · Brown Sugar Nectar',
    price: 1292,
    originalPrice: 1899,
    rating: 4.9,
    reviewsCount: 168,
    badge: 'FEMALE · BESTSELLER',
    image: '/images/products/perfume-tassel-flacon.jpg',
    scentFamily: 'Sparkling Citrus Berry & White Florals',
    volume: '50 ML',
  },
  {
    id: 'prod-golden-bakery',
    title: 'GOLDEN BAKERY Eau de Parfum',
    subtitle: 'Warm Golden Caramel · Fresh Baked Pastry Accord · Sweet Bourbon Vanilla',
    price: 1399,
    originalPrice: 1999,
    rating: 4.8,
    reviewsCount: 112,
    badge: 'WARM GOURMAND',
    image: '/images/products/perfume-tassel-flacon-7.jpg',
    scentFamily: 'Warm Pastry Caramel & Bourbon Vanilla',
    volume: '50 ML',
  },
];

export default function RoyalOudCollection({ products }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { storeData, updateProduct, isEditing } = useVisualEdit();
  const [addedItems, setAddedItems] = useState<{ [id: string]: boolean }>({});

  const sourceProducts = storeData?.products && storeData.products.length > 0 ? storeData.products : products || [];

  const displayItems: PerfumeItem[] =
    sourceProducts && sourceProducts.length > 0
      ? sourceProducts
          .filter(
            (p: any) =>
              (p.productType === 'PERFUME' || (p.category !== 'candles' && !p.productType && !(p.title || '').toLowerCase().includes('attar'))) &&
              !p.id.includes('disc') &&
              p.id !== 'prod-6'
          )
          .slice(0, 8)
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle,
            price: p.price,
            originalPrice: p.originalPrice || Math.round(p.price * 1.45),
            rating: p.rating || 5.0,
            reviewsCount: p.reviewsCount || 150,
            badge: p.badge || '20% EAU DE PARFUM',
            image: p.image || '/images/products/perfume-tassel-flacon.jpg',
            scentFamily: p.scentFamily || 'Haute Eau de Parfum',
            volume: p.volume || '50 ML Flacon',
            topNotes: p.topNotes || [],
          }))
      : defaultFragranceItems;

  const handleAdd = (item: PerfumeItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addToCart({
      id: item.id,
      sku: `NF-PERF-${item.id}`,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: 'perfumes',
      inStock: true,
      stockCount: 50,
    });
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  return (
    <section id="edps" className="royal-oud-section">
      <span id="royal-oud" style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }} />

      {/* Section Header */}
      <div className="royal-oud-header">
        <div className="royal-oud-badge-pill">
          <Sparkles size={13} color="#997B5E" />
          <span>20% EAU DE PARFUM · ATELIER EDITION</span>
        </div>

        <h2 className="royal-oud-title">
          Haute Parfumerie · Signature Flacons
        </h2>

        <p className="royal-oud-subtitle">
          Distilled at an elevated 20% perfume oil concentration for magnetic sillage and 12+ hour longevity. Each bottle is hand-finished with our iconic royal gold tassel and custom weighted flacon.
        </p>

        <div className="royal-oud-perks-row">
          <div className="royal-oud-perk-badge">
            <Droplets size={13} color="#997B5E" />
            <span>20% Extra Pure Oil Sillage</span>
          </div>
          <div className="royal-oud-perk-badge">
            <ShieldCheck size={13} color="#166534" />
            <span>French & Oriental Botanical Essences</span>
          </div>
          <div className="royal-oud-perk-badge">
            <Sparkles size={13} color="#997B5E" />
            <span>Signature Gold Tassel Flacon</span>
          </div>
        </div>
      </div>

      {/* Large Looming 4-Column Grid */}
      <div className="royal-oud-grid">
        {displayItems.map((item) => (
          <div key={item.id} className="royal-oud-card">
            {/* Image Wrap */}
            <Link
              href={`/product/${item.id}`}
              onClick={(e) => {
                if (isEditing) e.preventDefault();
              }}
              className="product-card-image-frame"
            >
              <EditableImage
                src={item.image}
                alt={item.title}
                label={item.title}
                onImageChange={(url) => updateProduct(item.id, { image: url })}
              />

              {item.badge && (
                <div className="royal-oud-card-badge">
                  <EditableText
                    as="span"
                    value={item.badge}
                    onValueChange={(val) => updateProduct(item.id, { badge: val })}
                  />
                </div>
              )}

              {/* Volume Tag */}
              <div className="royal-oud-volume-tag">
                <span>{item.volume || '50 ML / 100 ML'}</span>
              </div>
            </Link>

            {/* Details */}
            <div className="royal-oud-card-body">
              <div className="royal-oud-meta-top">
                <div className="royal-oud-stars-row">
                  <div style={{ display: 'flex', color: '#BBA58E' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#BBA58E" color="#BBA58E" />
                    ))}
                  </div>
                  <span className="royal-oud-reviews-count">
                    {item.rating || 5.0} ({item.reviewsCount || 150})
                  </span>
                </div>
                <span className="royal-oud-concentration-tag">20% EDP</span>
              </div>

              <Link
                href={`/product/${item.id}`}
                onClick={(e) => {
                  if (isEditing) e.preventDefault();
                }}
                className="royal-oud-title-link"
              >
                <EditableText
                  as="h4"
                  className="royal-oud-card-title"
                  value={item.title}
                  onValueChange={(val) => updateProduct(item.id, { title: val })}
                />
              </Link>

              <EditableText
                as="p"
                className="royal-oud-card-subtitle"
                value={item.subtitle}
                onValueChange={(val) => updateProduct(item.id, { subtitle: val })}
              />

              {/* Scent Family Pill */}
              {item.scentFamily && (
                <div className="royal-oud-accord-pill">
                  <span>{item.scentFamily}</span>
                </div>
              )}

              <div className="royal-oud-stock-row">
                <span className="royal-oud-stock-pill">
                  <Check size={11} strokeWidth={3} /> In Stock
                </span>
                <span className="royal-oud-flacon-pill">Tassel Flacon</span>
              </div>

              <div className="royal-oud-card-footer">
                <div className="royal-oud-pricing">
                  <span className="royal-oud-price-current">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  {item.originalPrice && (
                    <span className="royal-oud-price-original">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className={`btn-royal-add ${addedItems[item.id] ? 'added' : ''}`}
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
    </section>
  );
}
