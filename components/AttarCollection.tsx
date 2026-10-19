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
    id: 'prod-noor-oud',
    title: 'NOOR OUD',
    subtitle: 'For those who prefer to smell different · Smooth, Deep Oud with Warm Smoky Character',
    price: 999,
    originalPrice: 1499,
    rating: 5.0,
    reviewsCount: 186,
    badge: 'OUD-LED · WARM & SMOKY',
    image: '/images/products/attar-crystal-flacon.jpg',
    scentFamily: 'Oud-led • Woody • Smoky • Warm • Spiced',
    volume: '8ML Pure Crystal Flacon',
    longevity: '14+ Hours Wear',
  },
  {
    id: 'prod-khwaab',
    title: 'KHWAAB',
    subtitle: 'The Essence · A Modern Expression of Oud for Everyday Moments',
    price: 999,
    originalPrice: 1499,
    rating: 5.0,
    reviewsCount: 214,
    badge: 'MODERN OUD · THE ESSENCE',
    image: '/images/products/attar-crystal-flacon-4.jpg',
    scentFamily: 'Oud-led • Warm • Woody • Smooth • Aromatic',
    volume: '8ML Pure Crystal Flacon',
    longevity: '14+ Hours Wear',
  },
  {
    id: 'prod-ruh-khus',
    title: 'RUH KHUS',
    subtitle: 'Fresh from the earth. Made for you. · Pure Alcohol-Free Khus Essential Oil',
    price: 999,
    originalPrice: 1499,
    rating: 5.0,
    reviewsCount: 172,
    badge: '100% PURE KHUS · EARTHY & COOL',
    image: '/images/products/citrus-ozone-attar.jpg',
    scentFamily: 'Earthy • Green • Cool • Woody • Fresh',
    volume: '8ML Pure Crystal Flacon',
    longevity: '12+ Hours Wear',
  },
  {
    id: 'prod-musk-royal',
    title: 'MUSK ROYAL',
    subtitle: 'Soft on the skin. Easy to remember. · Pure Comforting Musk with Soft Fruity Opening',
    price: 999,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 195,
    badge: 'SKIN-CLOSE MUSK · SOFT & ELEGANT',
    image: '/images/products/attar-crystal-flacon-2.jpg',
    scentFamily: 'Soft • Clean • Warm • Musky • Subtly Sweet',
    volume: '8ML Pure Crystal Flacon',
    longevity: '14+ Hours Wear',
  },
  {
    id: 'prod-mizaaj',
    title: 'MIZAAJ',
    subtitle: 'Your kind of different · Warm Coffee, Creamy Cacao, Golden Caramel & Vanilla',
    price: 999,
    originalPrice: 1499,
    rating: 5.0,
    reviewsCount: 168,
    badge: 'MODERN GOURMAND · COFFEE & CACAO',
    image: '/images/products/attar-crystal-flacon-3.jpg',
    scentFamily: 'Gourmand • Creamy • Warm • Cacao-rich • Spiced',
    volume: '8ML Pure Crystal Flacon',
    longevity: '14+ Hours Wear',
  },
  {
    id: 'prod-gul-mehfil',
    title: 'GUL MEHFIL',
    subtitle: 'Some roses bloom. Some stay in memory · Fresh Blooming Living Rose with Gentle Warmth',
    price: 999,
    originalPrice: 1499,
    rating: 5.0,
    reviewsCount: 220,
    badge: 'LIVING ROSE · TIMELESS PRESENCE',
    image: '/images/products/imperial-jasmine-attar.jpg',
    scentFamily: 'Fresh • Rosy • Natural • Warm • Soft-Spiced',
    volume: '8ML Pure Crystal Flacon',
    longevity: '14+ Hours Wear',
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
              p.id === 'prod-noor-oud' ||
              p.id === 'prod-khwaab' ||
              p.id === 'prod-ruh-khus' ||
              p.id === 'prod-musk-royal' ||
              p.id === 'prod-mizaaj' ||
              p.id === 'prod-gul-mehfil'
          )
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle,
            price: p.price,
            originalPrice: p.originalPrice || Math.round(p.price * 1.45),
            rating: p.rating || 5.0,
            reviewsCount: p.reviewsCount || 180,
            badge: p.badge || '100% PURE ATTAR · 0% ALCOHOL',
            image: p.image || '/images/products/attar-crystal-flacon.jpg',
            scentFamily: p.scentFamily || 'Pure Concentrated Perfume Oil',
            volume: p.volume || '8ML Pure Crystal Flacon',
            longevity: p.longevity || '14+ Hours Longevity',
          }))
      : fallbackAttars;

  const displayItems = matchedAttars.length >= 6 ? matchedAttars : (matchedAttars.length > 0 ? matchedAttars : fallbackAttars);

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
            Pure essential-oil distillations of smoky Cambodian agarwood, cool wild Khus roots, gourmand cacao and coffee, comforting musks, and living damask rose. Formulated 100% alcohol-free for an intimate, 14+ hour personal skin contact ritual.
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

              </Link>

              {/* Card Meta Content */}
              <div className="attar-card-body">
                {/* Rating & Review Count */}
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
