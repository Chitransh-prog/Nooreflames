'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Check, Flame, Sparkles, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

export interface CandleItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge: string;
  image: string;
  volume?: string;
  waxType?: string;
  burnTime?: string;
}

const fallbackCandles: CandleItem[] = [
  {
    id: 'prod-1',
    title: 'Whispered Surprises – Secret Message Candle',
    subtitle: 'Hand-Poured Soy Wax · Hidden Love Note Melts into View · Crackling Wooden Wick',
    price: 999,
    originalPrice: 1200,
    rating: 5.0,
    reviewsCount: 246,
    badge: 'VIRAL SECRET MESSAGE',
    image: '/images/products/whispered-surprises-real.jpg',
    volume: '300g Natural Soy Wax',
    waxType: '100% Pure Botanical Soy',
    burnTime: '55+ Hours Burn Time',
  },
  {
    id: 'prod-22',
    title: 'Evil Eye Protection Handcrafted Candle',
    subtitle: 'Infused with Sacred Botanical Protection Herbs · Sea Salt & White Sage Essential Oils',
    price: 899,
    originalPrice: 1399,
    rating: 4.9,
    reviewsCount: 134,
    badge: 'AURA CLEANSING',
    image: '/images/products/evil-eye-candle-real.jpg',
    volume: '280g Hand-Poured Glass',
    waxType: 'Herbal Infused Soy',
    burnTime: '50+ Hours Burn Time',
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
    volume: '250g Textured Ceramic',
    waxType: 'Petal Infused Soy',
    burnTime: '45+ Hours Burn Time',
  },
  {
    id: 'prod-21',
    title: 'Celebration Birthday Sprinkle Cake Candle',
    subtitle: 'Vanilla Bean Buttercream · Colorful Sugar Sprinkles · Joyful Festive Glow',
    price: 899,
    originalPrice: 1299,
    rating: 5.0,
    reviewsCount: 118,
    badge: 'FESTIVE SPECIAL',
    image: '/images/products/birthday-candle-real.jpg',
    volume: '300g Artisanal Jar',
    waxType: 'Gourmand Soy Wax',
    burnTime: '50+ Hours Burn Time',
  },
  {
    id: 'prod-3',
    title: 'Mango Berry Bliss Sculptural Candle',
    subtitle: 'Sun-Drenched Alphonso Mango · Wild Raspberries & Crisp Mint Leaves',
    price: 599,
    originalPrice: 899,
    rating: 4.8,
    reviewsCount: 88,
    badge: 'SUMMER SPECIAL',
    image: '/images/products/mango-berry-bliss-real.jpg',
    volume: '220g Ribbed Pillar',
    waxType: 'Clean Soy & Coconut Wax',
    burnTime: '40+ Hours Burn Time',
  },
  {
    id: 'prod-2',
    title: 'कटिंग Chai Masala Tea Candle',
    subtitle: 'Fresh Indian Cardamom, Crushed Ginger, Cloves & Steamed Assam Tea Accord',
    price: 349,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 175,
    badge: 'DESI NOSTALGIA',
    image: '/images/products/cutting-chai-real.jpg',
    volume: '180g Glass Chai Cup',
    waxType: 'Spiced Soy Wax',
    burnTime: '35+ Hours Burn Time',
  },
];

export default function CandleCollection({ products }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { storeData, updateProduct, isEditing } = useVisualEdit();
  const [addedItems, setAddedItems] = useState<{ [id: string]: boolean }>({});

  const sourceProducts = storeData?.products && storeData.products.length > 0 ? storeData.products : products || [];

  const matchedCandles: CandleItem[] =
    sourceProducts && sourceProducts.length > 0
      ? sourceProducts
          .filter((p: any) => p.category === 'candles' || p.productType === 'CANDLE')
          .slice(0, 8)
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle,
            price: p.price,
            originalPrice: p.originalPrice || Math.round(p.price * 1.4),
            rating: p.rating || 5.0,
            reviewsCount: p.reviewsCount || 100,
            badge: p.badge || 'HAND-POURED SOY',
            image: p.image || '/images/products/whispered-surprises-real.jpg',
            volume: p.volume || '300g Handcrafted Soy Wax',
            waxType: '100% Pure Botanical Soy',
            burnTime: '50+ Hours Clean Burn',
          }))
      : fallbackCandles;

  const displayItems = matchedCandles.length >= 4 ? matchedCandles : fallbackCandles;

  const handleAdd = (item: CandleItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addToCart({
      id: item.id,
      sku: `NF-CAN-${item.id}`,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: 'candles',
      inStock: true,
      stockCount: 40,
    });
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  return (
    <section id="candle-atelier" className="candle-collection-section">
      <div className="candle-section-container">
        {/* Section Header */}
        <div className="candle-section-header">
          <div className="candle-header-pill">
            <Flame size={14} color="#e07a5f" />
            <span>HAND-POURED 100% NATURAL SOY WAX</span>
          </div>

          <h2 className="candle-section-title">
            Sculptural & Secret Message Candle Atelier
          </h2>

          <p className="candle-section-subtitle">
            Crafted with natural soy wax, crackling wooden wicks, and IFRA-certified botanical aromas. Light the wick to watch hidden words and heartwarming surprises melt into clear view.
          </p>

          {/* Quick Perks Strip */}
          <div className="candle-perks-row">
            <div className="candle-perk-badge">
              <Sparkles size={13} color="#e07a5f" />
              <span>Hidden Secret Note Melts In</span>
            </div>
            <div className="candle-perk-badge">
              <Flame size={13} color="#BBA58E" />
              <span>Crackling Wood Wick</span>
            </div>
            <div className="candle-perk-badge">
              <Heart size={13} color="#e07a5f" />
              <span>Non-Toxic Smokeless Burn</span>
            </div>
          </div>
        </div>

        {/* Large Looming 3-4 Column Cards Grid */}
        <div className="candle-cards-grid">
          {displayItems.map((item) => (
            <div key={item.id} className="candle-large-card">
              {/* Product Image Frame */}
              <Link
                href={`/product/${item.id}`}
                onClick={(e) => {
                  if (isEditing) e.preventDefault();
                }}
                className="candle-card-image-frame"
              >
                <EditableImage
                  src={item.image}
                  alt={item.title}
                  label={item.title}
                  onImageChange={(url) => updateProduct(item.id, { image: url })}
                />

                {/* Badge */}
                {item.badge && (
                  <div className="candle-card-badge">
                    <EditableText
                      as="span"
                      value={item.badge}
                      onValueChange={(val) => updateProduct(item.id, { badge: val })}
                    />
                  </div>
                )}

              </Link>

              {/* Card Meta Content */}
              <div className="candle-card-body">
                {/* Rating & Review Count */}
                <div className="candle-card-top-meta">
                  <div className="candle-stars-row">
                    <div style={{ display: 'flex', color: '#BBA58E' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#BBA58E" color="#BBA58E" />
                      ))}
                    </div>
                    <span className="candle-reviews-text">
                      {item.rating || 5.0} ({item.reviewsCount || 120})
                    </span>
                  </div>
                </div>

                {/* Product Title */}
                <Link
                  href={`/product/${item.id}`}
                  onClick={(e) => {
                    if (isEditing) e.preventDefault();
                  }}
                  className="candle-card-title-link"
                >
                  <EditableText
                    as="h3"
                    className="candle-card-title"
                    value={item.title}
                    onValueChange={(val) => updateProduct(item.id, { title: val })}
                  />
                </Link>

                {/* Subtitle / Notes */}
                <EditableText
                  as="p"
                  className="candle-card-subtitle"
                  value={item.subtitle}
                  onValueChange={(val) => updateProduct(item.id, { subtitle: val })}
                />

                {/* Bottom Bar: Pricing & Action Button */}
                <div className="candle-card-footer">
                  <div className="candle-price-block">
                    <span className="candle-price-current">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice && (
                      <span className="candle-price-original">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`btn-candle-add ${addedItems[item.id] ? 'added' : ''}`}
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
