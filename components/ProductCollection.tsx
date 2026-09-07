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

const defaultCuratedCandles: ProductItem[] = [
  {
    id: 'prod-5',
    title: 'Strawberry Shortcake Soy Duo',
    subtitle: 'Whipped soy wax, ripe strawberry & vanilla cream',
    price: 999,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 124,
    badge: 'BESTSELLER',
    image: '/images/products/strawberry-dessert-candle.jpg',
    category: 'candles',
  },
  {
    id: 'prod-8',
    title: 'Chocolate Romance Cupcake Candle',
    subtitle: 'Belgian cocoa, hand-piped frosting & berry notes',
    price: 899,
    originalPrice: 1299,
    rating: 5.0,
    reviewsCount: 98,
    badge: 'LIMITED EDITION',
    image: '/images/products/chocolate-cupcake-candle.jpg',
    category: 'candles',
  },
  {
    id: 'prod-6',
    title: 'Signature NF Luxe Arch Gift Box',
    subtitle: '3 Handcrafted Miniatures in gold-embossed box',
    price: 1499,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 210,
    badge: 'SIGNATURE GIFT',
    image: '/images/products/signature-white-giftbox.jpg',
    category: 'candles',
  },
];

const defaultSculpturalCandlesRow: ProductItem[] = [
  {
    id: 'prod-3',
    title: 'Mango Berry Bliss Dessert Coupe',
    subtitle: 'Pure soy wax & artisan glass coupe',
    price: 999,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 124,
    badge: 'BESTSELLER',
    image: '/images/products/mango-berry-bliss.jpg',
    category: 'candles',
  },
  {
    id: 'prod-2',
    title: 'कटिंग Chai Cardamom & Assam Tea Candle',
    subtitle: 'Pure soy wax in authentic cutting chai glass',
    price: 899,
    originalPrice: 1299,
    rating: 5.0,
    reviewsCount: 98,
    badge: 'ICONIC MASALA',
    image: '/images/products/cutting-chai-candle.jpg',
    category: 'candles',
  },
  {
    id: 'prod-4',
    title: 'Rose Bear & Velvet Heart Duo',
    subtitle: 'Sculpted petals & teddy balloon bowl',
    price: 1099,
    originalPrice: 1499,
    rating: 5.0,
    reviewsCount: 186,
    badge: 'NEW ARRIVAL',
    image: '/images/products/rose-bear-duo.jpg',
    category: 'candles',
  },
  {
    id: 'prod-7',
    title: 'Artisan Teddy & Balloon Soy Candle',
    subtitle: 'Signature balloon teddy reveal gift edition',
    price: 1199,
    originalPrice: 1599,
    rating: 4.9,
    reviewsCount: 142,
    badge: 'GIFT BOX',
    image: '/images/products/teddy-bear-candle.jpg',
    category: 'candles',
  },
];

const defaultCuratedPerfumes: ProductItem[] = [
  {
    id: 'prod-9',
    title: 'Oceanic Breeze Extrait EDP',
    subtitle: 'Sea salt, crisp citrus & coastal cedarwood',
    price: 1499,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 148,
    badge: 'EXTRAIT 35%',
    image: '/images/pdp/citrus-flacon-hero.jpg',
    category: 'perfumes',
  },
  {
    id: 'prod-12',
    title: 'Velvet Rose & Saffron EDP',
    subtitle: 'Damascus rose petals, dark plum & warm amber',
    price: 1299,
    originalPrice: 1899,
    rating: 4.9,
    reviewsCount: 148,
    badge: 'SIGNATURE ROSE',
    image: '/images/products/velvet-rose.jpg',
    category: 'perfumes',
  },
  {
    id: 'prod-14',
    title: 'Royal Smokey Oud Extrait',
    subtitle: 'Smoky Assam oud, saffron & leather amber',
    price: 1499,
    originalPrice: 2299,
    rating: 5.0,
    reviewsCount: 192,
    badge: 'ROYAL OUD',
    image: '/images/products/royal-smokey-oud.jpg',
    category: 'perfumes',
  },
];

const defaultSculpturalPerfumesRow: ProductItem[] = [
  {
    id: 'prod-10',
    title: 'Aqua Noir Intense Perfume',
    subtitle: 'Smoky amber & marine ocean accord',
    price: 1699,
    originalPrice: 2199,
    rating: 4.8,
    reviewsCount: 92,
    badge: 'INTENSE EDP',
    image: '/images/products/aqua-noir.jpg',
    category: 'perfumes',
  },
  {
    id: 'prod-11',
    title: 'Fresh Citrus & Ozone Attar',
    subtitle: 'Alcohol-free sea salt, ozone & cedar',
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviewsCount: 210,
    badge: 'ALCOHOL-FREE',
    image: '/images/products/citrus-ozone-attar.jpg',
    category: 'perfumes',
  },
  {
    id: 'prod-13',
    title: 'Imperial Jasmine Attar',
    subtitle: 'Wild Jasmine & golden sandalwood essence',
    price: 1399,
    originalPrice: 1699,
    rating: 4.9,
    reviewsCount: 94,
    badge: 'ROYAL ATTAR',
    image: '/images/products/imperial-jasmine-attar.jpg',
    category: 'perfumes',
  },
  {
    id: 'prod-15',
    title: 'Saffron & Tobacco Oud EDP',
    subtitle: 'Rich saffron, spiced tobacco leaf & smokey oud',
    price: 1599,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 134,
    badge: 'SPICED OUD',
    image: '/images/products/saffron-tobacco-oud.jpg',
    category: 'perfumes',
  },
];

export default function ProductCollection({ products }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { storeData, updateProduct, isEditing } = useVisualEdit();
  const [activeTab, setActiveTab] = useState<'candles' | 'perfumes'>('candles');
  const [addedItems, setAddedItems] = useState<{ [id: string]: boolean }>({});

  const activeProducts =
    storeData?.products && storeData.products.length > 0
      ? storeData.products
      : products || [];

  const candlesFromStore = activeProducts.filter((p: any) => p.category === 'candles');
  const perfumesFromStore = activeProducts.filter((p: any) => p.category !== 'candles');

  const showcaseRow =
    activeTab === 'candles'
      ? candlesFromStore.length >= 3
        ? candlesFromStore.slice(0, 3)
        : defaultCuratedCandles
      : perfumesFromStore.length >= 3
      ? perfumesFromStore.slice(0, 3)
      : defaultCuratedPerfumes;

  const secondaryRow =
    activeTab === 'candles'
      ? candlesFromStore.length >= 7
        ? candlesFromStore.slice(3, 7)
        : defaultSculpturalCandlesRow
      : perfumesFromStore.length >= 7
      ? perfumesFromStore.slice(3, 7)
      : defaultSculpturalPerfumesRow;

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
      category: item.category || (activeTab === 'candles' ? 'candles' : 'perfumes'),
      inStock: true,
      stockCount: 50,
    });

    setAddedItems((prev) => ({ ...prev, [prodId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [prodId]: false }));
    }, 1800);
  };

  return (
    <section id="candles" style={{ padding: '60px 24px 70px', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        {/* Centered Switcher Pills matching Screenshot */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              background: '#f2eee9',
              padding: '4px',
              borderRadius: '30px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('candles')}
              style={{
                padding: '9px 24px',
                borderRadius: '24px',
                border: 'none',
                background: activeTab === 'candles' ? '#121212' : 'transparent',
                color: activeTab === 'candles' ? '#ffffff' : '#555555',
                fontSize: '12.5px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              {activeTab === 'candles' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dfab72' }} />}
              Candles
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('perfumes')}
              style={{
                padding: '9px 24px',
                borderRadius: '24px',
                border: 'none',
                background: activeTab === 'perfumes' ? '#121212' : 'transparent',
                color: activeTab === 'perfumes' ? '#ffffff' : '#555555',
                fontSize: '12.5px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              {activeTab === 'perfumes' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dfab72' }} />}
              Perfumes
            </button>
          </div>
        </div>

        {/* Row 1: 3-Card Curated Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {showcaseRow.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.09)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.05)';
              }}
            >
              {/* Product Card Image Frame */}
              <Link
                href={`/product/${item.id || 'prod-1'}`}
                onClick={(e) => {
                  if (isEditing) e.preventDefault();
                }}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '340px',
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
                  onImageChange={(url) => item.id && updateProduct(item.id, { image: url })}
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
                      top: '14px',
                      left: '14px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      color: '#121212',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(0,0,0,0.06)',
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
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Rating Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#687371', marginLeft: '4px' }}>
                    {item.rating} ({item.reviewsCount} reviews)
                  </span>
                </div>

                {/* Title */}
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
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      marginBottom: '6px',
                      fontFamily: 'var(--font-heading-family)',
                      color: '#1a1a1a',
                      cursor: isEditing ? 'text' : 'pointer',
                    }}
                  />
                </Link>

                {/* Subtitle / Notes */}
                <EditableText
                  as="p"
                  value={item.subtitle}
                  onValueChange={(val) => item.id && updateProduct(item.id, { subtitle: val })}
                  style={{ fontSize: '12px', color: '#7a8785', marginBottom: '14px', lineHeight: 1.4 }}
                />

                {/* Stock Indicator */}
                <div style={{ marginBottom: '14px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      color: '#166534',
                      background: '#dcfce7',
                      padding: '2px 8px',
                      borderRadius: '10px',
                    }}
                  >
                    <Check size={11} strokeWidth={3} /> In Stock
                  </span>
                </div>

                {/* Pricing & Add to Cart */}
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <EditableText
                      as="span"
                      value={`₹${item.price.toLocaleString('en-IN')}`}
                      onValueChange={(val) => {
                        const num = parseInt(val.replace(/[^0-9]/g, ''));
                        if (!isNaN(num) && item.id) updateProduct(item.id, { price: num });
                      }}
                      style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a' }}
                    />
                    {' '}
                    {item.originalPrice && (
                      <span
                        style={{
                          fontSize: '12.5px',
                          color: '#9ba6a4',
                          textDecoration: 'line-through',
                          marginLeft: '6px',
                        }}
                      >
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAdd(item, e)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: addedItems[item.id || ''] ? '#166534' : '#121212',
                      color: '#ffffff',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      if (!addedItems[item.id || '']) e.currentTarget.style.background = '#c9935a';
                    }}
                    onMouseLeave={(e) => {
                      if (!addedItems[item.id || '']) e.currentTarget.style.background = '#121212';
                    }}
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

        {/* Row 2: 4-Column Sculptural Candles / Products */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {secondaryRow.map((item) => (
            <div
              key={item.id + '-row2'}
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
              <Link
                href={`/product/${item.id || 'prod-1'}`}
                onClick={(e) => {
                  if (isEditing) e.preventDefault();
                }}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '280px',
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
                  onImageChange={(url) => item.id && updateProduct(item.id, { image: url })}
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
                      background: 'rgba(255, 255, 255, 0.9)',
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
                      onValueChange={(val) => item.id && updateProduct(item.id, { badge: val })}
                    />
                  </div>
                )}
              </Link>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: '#7a8785', marginLeft: '4px' }}>
                    {item.rating} ({item.reviewsCount})
                  </span>
                </div>

                <Link
                  href={`/product/${item.id || 'prod-1'}`}
                  onClick={(e) => {
                    if (isEditing) e.preventDefault();
                  }}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <EditableText
                    as="h4"
                    value={item.title}
                    onValueChange={(val) => item.id && updateProduct(item.id, { title: val })}
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      marginBottom: '4px',
                      fontFamily: 'var(--font-heading-family)',
                      color: '#1a1a1a',
                      cursor: isEditing ? 'text' : 'pointer',
                    }}
                  />
                </Link>

                <EditableText
                  as="p"
                  value={item.subtitle}
                  onValueChange={(val) => item.id && updateProduct(item.id, { subtitle: val })}
                  style={{ fontSize: '11.5px', color: '#7a8785', marginBottom: '10px', lineHeight: 1.3 }}
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
                    <EditableText
                      as="span"
                      value={`₹${item.price.toLocaleString('en-IN')}`}
                      onValueChange={(val) => {
                        const num = parseInt(val.replace(/[^0-9]/g, ''));
                        if (!isNaN(num) && item.id) updateProduct(item.id, { price: num });
                      }}
                      style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}
                    />
                    {' '}
                    {item.originalPrice && (
                      <span style={{ fontSize: '11.5px', color: '#9ba6a4', textDecoration: 'line-through', marginLeft: '4px' }}>
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAdd(item, e)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: addedItems[item.id || ''] ? '#166534' : '#121212',
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
                      if (!addedItems[item.id || '']) e.currentTarget.style.background = '#c9935a';
                    }}
                    onMouseLeave={(e) => {
                      if (!addedItems[item.id || '']) e.currentTarget.style.background = '#121212';
                    }}
                  >
                    {addedItems[item.id || ''] ? (
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
      </div>
    </section>
  );
}
