'use client';

import React from 'react';
import Link from 'next/link';
import { KeyRound, Droplets, Star } from 'lucide-react';
import { urlForImage } from '../lib/image';
import { ProductItem } from './ProductCollection';
import { useCart } from '@/context/CartContext';

const fallbackOceanProducts: ProductItem[] = [
  {
    id: 'prod-9',
    title: 'Oceanic Breeze Extrait EDP',
    subtitle: 'Sea Salt · Crisp Citrus · Cedarwood',
    price: 1499,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 148,
    badge: 'BESTSELLER',
    image: '/images/products/oceanic-breeze.jpg',
    category: 'ocean-fresh',
  },
  {
    id: 'prod-10',
    title: 'Aqua Noir Intense Perfume',
    subtitle: 'Smoky Amber · Marine Accord · Bergamot',
    price: 1699,
    originalPrice: 2199,
    rating: 4.8,
    reviewsCount: 92,
    badge: 'NEW',
    image: '/images/products/aqua-noir.jpg',
    category: 'ocean-fresh',
  },
  {
    id: 'prod-11',
    title: 'Fresh Citrus & Ozone Attar',
    subtitle: 'Pure Concentrated Oil · 24+ Hr Longevity',
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviewsCount: 210,
    badge: 'ALCOHOL FREE',
    image: '/images/products/citrus-ozone-attar.jpg',
    category: 'ocean-fresh',
  },
];

export default function OceanicCollection({ products }: { products?: ProductItem[] }) {
  const { addToCart } = useCart();
  const displayProducts =
    products && products.length > 0
      ? products.filter((p) => p.category === 'ocean-fresh' || !p.category)
      : fallbackOceanProducts;

  return (
    <section className="oceanic-section" id="ocean-fresh">
      {/* Corner Decorative Matrix Dots */}
      <div className="deco-dot-matrix"></div>

      {/* Decorative Floating Key Accent */}
      <div className="floating-key-icon">
        <KeyRound size={32} color="#a3d9d3" style={{ opacity: 0.6 }} />
      </div>

      <div className="section-header-left">
        <span className="section-overline light">FRESH & MARINE NOTES</span>
        <h2 className="section-title light font-serif">Oceanic & Fresh Blends</h2>
        <p className="section-subtitle light">
          Invigorating top notes of sea breeze, bergamot, and crisp ozone anchored in amber wood.
        </p>
      </div>

      <div className="product-grid-3col">
        {displayProducts.map((product, idx) => (
          <div key={product._id || product.id || idx} className="product-card-teal">
            <Link href={`/product/${product.id || product._id || 'prod-9'}`} className="card-image-wrapper" style={{ display: 'block', textDecoration: 'none' }}>
              {product.badge && <span className="card-badge-gold">{product.badge}</span>}
              {product.image ? (
                <img
                  src={urlForImage(product.image).url()}
                  alt={product.title}
                  className="card-product-img"
                />
              ) : (
                <div className="card-fallback-img ocean-bg">
                  <Droplets size={54} color="#a3d9d3" />
                </div>
              )}
            </Link>

            <div className="card-details">
              <div className="rating-stars" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '6px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#ffc107" color="#ffc107" />
                ))}
                <span className="rating-count" style={{ marginLeft: '6px' }}>
                  ({product.reviewsCount || 120})
                </span>
              </div>
              <Link href={`/product/${product.id || product._id || 'prod-9'}`} style={{ textDecoration: 'none' }}>
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
                <div className="card-actions-group">
                  <button
                    className="btn-add-cart"
                    onClick={() =>
                      addToCart({
                        id: product.id || product._id || `ocean-${idx}`,
                        sku: product.sku || `NF-OCN-${idx + 1}`,
                        title: product.title,
                        subtitle: product.subtitle,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        category: 'ocean-fresh',
                        inStock: true,
                        stockCount: 40,
                      })
                    }
                  >
                    ADD TO CART
                  </button>
                  <button
                    className="btn-buy-now"
                    onClick={() =>
                      addToCart({
                        id: product.id || product._id || `ocean-${idx}`,
                        sku: product.sku || `NF-OCN-${idx + 1}`,
                        title: product.title,
                        subtitle: product.subtitle,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        category: 'ocean-fresh',
                        inStock: true,
                        stockCount: 40,
                      })
                    }
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
