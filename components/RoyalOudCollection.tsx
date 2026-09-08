'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Check } from 'lucide-react';
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
}

const defaultFragranceItems: PerfumeItem[] = [
  {
    id: 'prod-12',
    title: 'Velvet Rose & Saffron EDP',
    subtitle: 'Damascus rose petals, dark plum & warm amber',
    price: 1299,
    originalPrice: 1899,
    rating: 4.9,
    reviewsCount: 148,
    badge: 'EXTRAIT 35%',
    image: '/images/products/velvet-rose.jpg',
  },
  {
    id: 'prod-14',
    title: 'Royal Smokey Oud Extrait',
    subtitle: 'Smoky Assam agarwood, saffron & leather',
    price: 1499,
    originalPrice: 2299,
    rating: 5.0,
    reviewsCount: 192,
    badge: 'ROYAL OUD',
    image: '/images/products/royal-smokey-oud.jpg',
  },
  {
    id: 'prod-10',
    title: 'Aqua Noir Intense Perfume',
    subtitle: 'Calabrian bergamot, marine notes & smoky amber',
    price: 1699,
    originalPrice: 2199,
    rating: 4.8,
    reviewsCount: 92,
    badge: 'INTENSE EDP',
    image: '/images/products/aqua-noir.jpg',
  },
  {
    id: 'prod-16',
    title: 'Amber Noir Concentrated Attar',
    subtitle: 'Alcohol-free rare amber resin & golden sandalwood',
    price: 1299,
    originalPrice: 1699,
    rating: 4.9,
    reviewsCount: 178,
    badge: 'PURE ATTAR',
    image: '/images/products/amber-noir-attar.jpg',
  },
];

export default function RoyalOudCollection({ products }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { storeData, updateProduct, isEditing } = useVisualEdit();
  const [addedItems, setAddedItems] = useState<{ [id: string]: boolean }>({});

  const sourceProducts = (storeData && storeData.products) ? storeData.products : (products || []);

  const displayItems: PerfumeItem[] =
    sourceProducts && sourceProducts.length > 0
      ? sourceProducts
          .filter((p: any) => p.category !== 'candles')
          .slice(0, 4)
          .map((p: any) => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle,
            price: p.price,
            originalPrice: p.originalPrice || Math.round(p.price * 1.4),
            rating: p.rating || 5.0,
            reviewsCount: p.reviewsCount || 120,
            badge: p.badge || 'SIGNATURE',
            image: p.image,
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
      <div className="royal-oud-grid">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="royal-oud-card"
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)';
            }}
          >
            {/* Image Wrap */}
            <Link
              href={`/product/${item.id}`}
              onClick={(e) => {
                if (isEditing) e.preventDefault();
              }}
              className="product-card-image-frame"
              style={{
                position: 'relative',
                width: '100%',
                backgroundColor: '#fcfaf8',
                display: 'block',
                overflow: 'hidden',
                textDecoration: 'none',
                cursor: isEditing ? 'default' : 'pointer',
              }}
            >
              <EditableImage
                src={item.image}
                alt={item.title}
                label={item.title}
                onImageChange={(url) => updateProduct(item.id, { image: url })}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.4s ease',
                }}
              />

              {item.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(255, 255, 255, 0.92)',
                    color: '#121212',
                    padding: '3px 10px',
                    borderRadius: '10px',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    zIndex: 10,
                  }}
                >
                  <EditableText
                    as="span"
                    value={item.badge}
                    onValueChange={(val) => updateProduct(item.id, { badge: val })}
                  />
                </div>
              )}
            </Link>

            {/* Details */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: '#707070', marginLeft: '4px' }}>
                  {item.rating} ({item.reviewsCount})
                </span>
              </div>

              <Link
                href={`/product/${item.id}`}
                onClick={(e) => {
                  if (isEditing) e.preventDefault();
                }}
                style={{ textDecoration: 'none', color: '#1a1a1a' }}
              >
                <EditableText
                  as="h4"
                  value={item.title}
                  onValueChange={(val) => updateProduct(item.id, { title: val })}
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '4px',
                    fontFamily: 'var(--font-heading-family)',
                    cursor: isEditing ? 'text' : 'pointer',
                  }}
                />
              </Link>

              <EditableText
                as="p"
                value={item.subtitle}
                onValueChange={(val) => updateProduct(item.id, { subtitle: val })}
                style={{ fontSize: '11.5px', color: '#707070', marginBottom: '10px', lineHeight: 1.3 }}
              />

              <div style={{ marginBottom: '12px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#166534',
                    background: '#dcfce7',
                    padding: '2px 7px',
                    borderRadius: '8px',
                  }}
                >
                  In Stock
                </span>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}>
                    ₹
                    <EditableText
                      as="span"
                      value={String(item.price)}
                      onValueChange={(val) => {
                        const num = parseInt(val.replace(/\D/g, ''), 10);
                        if (!isNaN(num)) updateProduct(item.id, { price: num });
                      }}
                    />
                  </span>{' '}
                  <span style={{ fontSize: '11.5px', color: '#707070', textDecoration: 'line-through', marginLeft: '4px' }}>
                    ₹{item.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAdd(item, e)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: addedItems[item.id] ? '#166534' : '#121212',
                    color: '#ffffff',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                  onMouseEnter={(e) => {
                    if (!addedItems[item.id]) e.currentTarget.style.background = '#BBA58E';
                  }}
                  onMouseLeave={(e) => {
                    if (!addedItems[item.id]) e.currentTarget.style.background = '#121212';
                  }}
                >
                  {addedItems[item.id] ? (
                    <>
                      <Check size={13} strokeWidth={3} /> ADDED TO BAG
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
    </section>
  );
}
