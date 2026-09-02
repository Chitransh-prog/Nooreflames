import React from 'react';
import { Crown, Star } from 'lucide-react';
import { urlForImage } from '../sanity/lib/image';
import { ProductItem } from './ProductCollection';

const fallbackRoyalProducts: ProductItem[] = [
  {
    title: 'Royal Smokey Oud Extrait',
    subtitle: 'Agarwood · Leather · Rich Amber',
    price: 2499,
    originalPrice: 2999,
    rating: 5.0,
    reviewsCount: 230,
    badge: 'LUXURY EDITION',
    category: 'royal-oud',
  },
  {
    title: 'Saffron & Tobacco Oud EDP',
    subtitle: 'Persian Saffron · Honeyed Tobacco · Vetiver',
    price: 2199,
    originalPrice: 2699,
    rating: 4.9,
    reviewsCount: 175,
    badge: 'BESTSELLER',
    category: 'royal-oud',
  },
  {
    title: 'Amber Noir Concentrated Attar',
    subtitle: 'Golden Amber · Musk · Pure Essential Oil',
    price: 1599,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 142,
    badge: '24+ HR LONGEVITY',
    category: 'royal-oud',
  },
  {
    title: 'Warm Sandalwood Soy Candle',
    subtitle: 'Mysore Sandalwood · Cardamom · Cedar',
    price: 1099,
    originalPrice: 1399,
    rating: 4.8,
    reviewsCount: 88,
    badge: 'HAND-POURED',
    category: 'royal-oud',
  },
];

export default function RoyalOudCollection({ products }: { products?: ProductItem[] }) {
  const displayProducts =
    products && products.length > 0
      ? products.filter((p) => p.category === 'royal-oud' || !p.category)
      : fallbackRoyalProducts;

  return (
    <section className="royal-oud-section" id="royal-oud">
      <div className="section-header-center">
        <span className="section-overline gold">HERITAGE & SMOKY WOODS</span>
        <h2 className="section-title font-serif">Royal Oud & Amber Collection</h2>
        <p className="section-subtitle">
          Regal compositions featuring rare Indian agarwood, golden amber resin, and sun-cured spices.
        </p>
      </div>

      <div className="product-grid-4col">
        {displayProducts.map((product, idx) => (
          <div key={product._id || idx} className="product-card-amber">
            <div className="card-image-wrapper">
              {product.badge && <span className="card-badge-gold">{product.badge}</span>}
              {product.image ? (
                <img
                  src={urlForImage(product.image).url()}
                  alt={product.title}
                  className="card-product-img"
                />
              ) : (
                <div className="card-fallback-img amber-bg">
                  <Crown size={54} color="#c9935a" />
                </div>
              )}
            </div>

            <div className="card-details">
              <div className="rating-stars" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '6px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#ffc107" color="#ffc107" />
                ))}
                <span className="rating-count" style={{ marginLeft: '6px', color: '#888' }}>
                  ({product.reviewsCount || 150})
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
