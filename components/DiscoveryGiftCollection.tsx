'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Check, Gift, Sparkles, Box, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from './visual-edit/EditableElements';

export interface GiftItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge: string;
  image: string;
  contentsCount?: string;
  presentationTag?: string;
}

const fallbackGifts: GiftItem[] = [
  {
    id: 'prod-disc-dual',
    title: 'The Complete Atelier Discovery Vault',
    subtitle: '10 Signature Fragrance Flacons · Royal Gold Foil Rigid Keepsake Box · 5ml Travel Atomizers',
    price: 1799,
    originalPrice: 2499,
    rating: 5.0,
    reviewsCount: 168,
    badge: 'COLLECTOR VAULT EDITION',
    image: '/images/products/signature-white-giftbox.jpg',
    contentsCount: '10 Mini Flacons (50ML Total)',
    presentationTag: 'Rigid Gold-Foil Gift Box + Wax Seal',
  },
  {
    id: 'prod-disc-her',
    title: 'Signature Discovery Set — For Her',
    subtitle: '5 Curated Feminine Olfactory Poems: Damask Rose, Vanilla Covenant, Blush Hour, Praline & Jasmine',
    price: 999,
    originalPrice: 1499,
    rating: 5.0,
    reviewsCount: 142,
    badge: 'FOR HER · 5 MINIATURES',
    image: '/images/products/signature-white-giftbox.jpg',
    contentsCount: '5 x 5ML Eau de Parfum Sprays',
    presentationTag: 'Satin Ribbon Wrapped Vault',
  },
  {
    id: 'prod-disc-him',
    title: 'Signature Discovery Set — For Him',
    subtitle: '5 Magnetic Masculine & High-Seas Blends: The Eclipse, The Ninth Tide, Royal Smokey Oud & Woods',
    price: 999,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 126,
    badge: 'FOR HIM · 5 MINIATURES',
    image: '/images/products/signature-white-giftbox.jpg',
    contentsCount: '5 x 5ML Eau de Parfum Sprays',
    presentationTag: 'Satin Ribbon Wrapped Vault',
  },
  {
    id: 'prod-6',
    title: 'Signature Noor-e-Flames Luxe Arch Gift Vault',
    subtitle: 'Handcrafted Sculptural Arch Candle + 50ml Haute Eau de Parfum Flacon with Gold Tassel',
    price: 1299,
    originalPrice: 1999,
    rating: 5.0,
    reviewsCount: 98,
    badge: 'DUO GIFT VAULT',
    image: '/images/products/signature-white-giftbox.jpg',
    contentsCount: '1 EDP Flacon + 1 Soy Candle',
    presentationTag: 'Luxury Double Trousseau',
  },
];

export default function DiscoveryGiftCollection({ products }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { storeData, updateProduct, isEditing } = useVisualEdit();
  const [addedItems, setAddedItems] = useState<{ [id: string]: boolean }>({});

  const sourceProducts = storeData?.products && storeData.products.length > 0 ? storeData.products : products || [];

  const matchedGifts: GiftItem[] =
    sourceProducts && sourceProducts.length > 0
      ? sourceProducts
          .filter(
            (p: any) =>
              p.category === 'discovery-sets' ||
              p.category === 'gift-shop' ||
              p.productType === 'DISCOVERY' ||
              p.productType === 'GIFT_SET' ||
              (p.id || '').includes('disc') ||
              p.id === 'prod-6'
          )
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle,
            price: p.price,
            originalPrice: p.originalPrice || Math.round(p.price * 1.4),
            rating: p.rating || 5.0,
            reviewsCount: p.reviewsCount || 100,
            badge: p.badge || 'SIGNATURE GIFT VAULT',
            image: p.image || '/images/products/signature-white-giftbox.jpg',
            contentsCount: p.volume || 'Miniature Atomizer Set',
            presentationTag: 'Rigid Gold-Foil Gift Box',
          }))
      : fallbackGifts;

  const displayItems = matchedGifts.length >= 2 ? matchedGifts : fallbackGifts;

  const handleAdd = (item: GiftItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addToCart({
      id: item.id,
      sku: `NF-GIFT-${item.id}`,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: 'discovery',
      inStock: true,
      stockCount: 30,
    });
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  return (
    <section id="discovery-vaults" className="gift-collection-section">
      <div className="gift-section-container">
        {/* Section Header */}
        <div className="gift-section-header">
          <div className="gift-header-pill">
            <Gift size={13} color="#BBA58E" />
            <span>ATELIER GIFTING & DISCOVERY VAULTS</span>
          </div>

          <h2 className="gift-section-title">
            Curated Discovery Vaults & Luxe Gift Sets
          </h2>

          <p className="gift-section-subtitle">
            Experience our complete olfactory range before committing to your signature 50ml flacon. Hand-assembled in gold foil keepsake boxes with silk ribbons and custom wax seal cards.
          </p>

          <div className="gift-perks-row">
            <div className="gift-perk-badge">
              <Sparkles size={13} color="#BBA58E" />
              <span>Complimentary Gold-Foil Gift Box</span>
            </div>
            <div className="gift-perk-badge">
              <Box size={13} color="#166534" />
              <span>Free Nationwide Priority Courier</span>
            </div>
            <div className="gift-perk-badge">
              <ShieldCheck size={13} color="#BBA58E" />
              <span>Includes 10% Voucher For Full Bottle</span>
            </div>
          </div>
        </div>

        {/* Big Looming Cards Grid (2 to 4 Columns) */}
        <div className="gift-cards-grid">
          {displayItems.map((item) => (
            <div key={item.id} className="gift-large-card">
              {/* Product Image Frame */}
              <Link
                href={`/product/${item.id}`}
                onClick={(e) => {
                  if (isEditing) e.preventDefault();
                }}
                className="gift-card-image-frame"
              >
                <EditableImage
                  src={item.image}
                  alt={item.title}
                  label={item.title}
                  onImageChange={(url) => updateProduct(item.id, { image: url })}
                />

                {/* Badge */}
                {item.badge && (
                  <div className="gift-card-badge">
                    <EditableText
                      as="span"
                      value={item.badge}
                      onValueChange={(val) => updateProduct(item.id, { badge: val })}
                    />
                  </div>
                )}

              </Link>

              {/* Card Meta Content */}
              <div className="gift-card-body">
                {/* Rating & Review Count */}
                <div className="gift-card-top-meta">
                  <div className="gift-stars-row">
                    <div style={{ display: 'flex', color: '#BBA58E' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#BBA58E" color="#BBA58E" />
                      ))}
                    </div>
                    <span className="gift-reviews-text">
                      {item.rating || 5.0} ({item.reviewsCount || 140})
                    </span>
                  </div>
                </div>

                {/* Product Title */}
                <Link
                  href={`/product/${item.id}`}
                  onClick={(e) => {
                    if (isEditing) e.preventDefault();
                  }}
                  className="gift-card-title-link"
                >
                  <EditableText
                    as="h3"
                    className="gift-card-title"
                    value={item.title}
                    onValueChange={(val) => updateProduct(item.id, { title: val })}
                  />
                </Link>

                {/* Subtitle / Notes */}
                <EditableText
                  as="p"
                  className="gift-card-subtitle"
                  value={item.subtitle}
                  onValueChange={(val) => updateProduct(item.id, { subtitle: val })}
                />

                {/* Bottom Bar: Pricing & Action Button */}
                <div className="gift-card-footer">
                  <div className="gift-price-block">
                    <span className="gift-price-current">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice && (
                      <span className="gift-price-original">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`btn-gift-add ${addedItems[item.id] ? 'added' : ''}`}
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
