import React from 'react';
import { KeyRound, Droplets, Star } from 'lucide-react';
import { urlForImage } from '../sanity/lib/image';
import { ProductItem } from './ProductCollection';

const fallbackOceanProducts: ProductItem[] = [
  {
    title: 'Oceanic Breeze Extrait EDP',
    subtitle: 'Sea Salt · Crisp Citrus · Cedarwood',
    price: 1499,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 148,
    badge: 'BESTSELLER',
    category: 'ocean-fresh',
  },
  {
    title: 'Aqua Noir Intense Perfume',
    subtitle: 'Smoky Amber · Marine Accord · Bergamot',
    price: 1699,
    originalPrice: 2199,
    rating: 4.8,
    reviewsCount: 92,
    badge: 'NEW',
    category: 'ocean-fresh',
  },
  {
    title: 'Fresh Citrus & Ozone Attar',
    subtitle: 'Pure Concentrated Oil · 24+ Hr Longevity',
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviewsCount: 210,
    badge: 'ALCOHOL FREE',
    category: 'ocean-fresh',
  },
];

export default function OceanicCollection({ products }: { products?: ProductItem[] }) {
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
          <div key={product._id || idx} className="product-card-teal">
            <div className="card-image-wrapper">
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
            </div>

            <div className="card-details">
              <div className="rating-stars" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '6px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#ffc107" color="#ffc107" />
                ))}
                <span className="rating-count" style={{ marginLeft: '6px' }}>
                  ({product.reviewsCount || 120})
                </span>
              </div>
              <h3 className="card-title font-serif">{product.title}</h3>
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
                  <button className="btn-add-cart">ADD TO CART</button>
                  <button className="btn-buy-now">BUY NOW</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
