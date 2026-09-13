'use client';

import React from 'react';
import Link from 'next/link';
import { Flower2, Sparkles, Star } from 'lucide-react';
import { urlForImage } from '../lib/image';
import { ProductItem } from './ProductCollection';
import { useCart } from '@/context/CartContext';

const fallbackFloralProducts: ProductItem[] = [
  {
    id: 'prod-12',
    title: 'Velvet Rose & Saffron Tassel Flacon EDP',
    subtitle: 'Damask Rose · Warm Saffron · French Vanilla',
    price: 1899,
    originalPrice: 2399,
    rating: 5.0,
    reviewsCount: 186,
    badge: 'MOST POPULAR',
    image: '/images/products/perfume-tassel-flacon-3.jpg',
    category: 'floral-rose',
  },
  {
    id: 'prod-13',
    title: 'Imperial Jasmine Pure Crystal Attar',
    subtitle: 'Wild Jasmine · Sandalwood · Alcohol-Free',
    price: 1399,
    originalPrice: 1699,
    rating: 4.9,
    reviewsCount: 94,
    badge: 'ARTISANAL',
    image: '/images/products/attar-crystal-flacon-2.jpg',
    category: 'floral-rose',
  },
  {
    id: 'prod-23',
    title: 'Rose Whimsy Heart-Melts Candle',
    subtitle: 'Hand-Crafted Botanical Wax Hearts · 50 Hrs Burn Time',
    price: 949,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 65,
    badge: 'HANDCRAFTED',
    image: '/images/products/rose-whimsy-real.jpg',
    category: 'floral-rose',
  },
  {
    id: 'prod-1',
    title: 'Whispered Surprises Secret Message Candle',
    subtitle: 'Hand-Poured Soy Wax · Hidden Love Note Melts into View',
    price: 899,
    originalPrice: 1599,
    rating: 5.0,
    reviewsCount: 164,
    badge: 'SECRET MESSAGE',
    image: '/images/products/whispered-surprises-real.jpg',
    category: 'floral-rose',
  },
];

export default function FloralCollection({ products }: { products?: ProductItem[] }) {
  const { addToCart } = useCart();
  const displayProducts =
    products && products.length > 0
      ? products.filter((p) => p.category === 'floral-rose' || !p.category)
      : fallbackFloralProducts;

  return (
    <section className="floral-section" id="floral-rose">
      {/* Corner Rose Flourish Accent */}
      <div className="corner-rose-accent">
        <Flower2 size={36} color="#d88373" style={{ opacity: 0.5 }} />
      </div>

      <div className="section-header-center">
        <span className="section-overline pink">FLORAL & VELVET NOTES</span>
        <h2 className="section-title font-serif">Blossom & Rose Collection</h2>
        <p className="section-subtitle">
          Intoxicating blooms harvested at dawn, distilled into silk-smooth extraits & pure attars.
        </p>
      </div>

      <div className="product-grid-4col">
        {displayProducts.map((product, idx) => (
          <div key={product._id || product.id || idx} className="product-card-blush">
            <Link href={`/product/${product.id || product._id || 'prod-12'}`} className="card-image-wrapper" style={{ display: 'block', textDecoration: 'none' }}>
              {product.badge && <span className="card-badge-pink">{product.badge}</span>}
              {product.image ? (
                <img
                  src={urlForImage(product.image).url()}
                  alt={product.title}
                  className="card-product-img"
                />
              ) : (
                <div className="card-fallback-img blush-bg">
                  <Sparkles size={54} color="#d88373" />
                </div>
              )}
            </Link>

            <div className="card-details">
              <div className="rating-stars" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '6px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#ffc107" color="#ffc107" />
                ))}
                <span className="rating-count" style={{ marginLeft: '6px', color: '#888' }}>
                  ({product.reviewsCount || 88})
                </span>
              </div>
              <Link href={`/product/${product.id || product._id || 'prod-12'}`} style={{ textDecoration: 'none' }}>
                <h3 className="card-title font-serif">{product.title}</h3>
              </Link>
              <p className="card-notes">{product.subtitle}</p>

              <div className="card-pricing-row">
                <div className="price-tag">
                  ₹{product.price.toLocaleString('en-IN')}
                  {product.originalPrice && (
                    <span className="original-price">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <button
                  className="btn-add-cart-outline"
                  onClick={() =>
                    addToCart({
                      id: product.id || product._id || `floral-${idx}`,
                      sku: product.sku || `NF-FLR-${idx + 1}`,
                      title: product.title,
                      subtitle: product.subtitle,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      image: product.image,
                      category: 'floral-rose',
                      inStock: true,
                      stockCount: 40,
                    })
                  }
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
