import React from 'react';
import { Flower2, Sparkles, Star } from 'lucide-react';
import { urlForImage } from '../sanity/lib/image';
import { ProductItem } from './ProductCollection';

const fallbackFloralProducts: ProductItem[] = [
  {
    title: 'Velvet Rose & Saffron EDP',
    subtitle: 'Damask Rose · Warm Saffron · French Vanilla',
    price: 1899,
    originalPrice: 2399,
    rating: 5.0,
    reviewsCount: 186,
    badge: 'MOST POPULAR',
    category: 'floral-rose',
  },
  {
    title: 'Imperial Jasmine Attar',
    subtitle: 'Wild Jasmine · Sandalwood · Alcohol-Free',
    price: 1399,
    originalPrice: 1699,
    rating: 4.9,
    reviewsCount: 94,
    badge: 'ARTISANAL',
    category: 'floral-rose',
  },
  {
    title: 'Blossom Petal Soy Candle',
    subtitle: 'Hand-Poured Soy Wax · 50 Hrs Burn Time',
    price: 999,
    originalPrice: 1299,
    rating: 4.8,
    reviewsCount: 65,
    badge: 'HANDCRAFTED',
    category: 'floral-rose',
  },
  {
    title: 'Rose & Vanilla Discovery Trio',
    subtitle: '3 x 10ml Mini Sprays · Velvet Gift Box',
    price: 1199,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 112,
    badge: 'GIFT SET',
    category: 'floral-rose',
  },
];

export default function FloralCollection({ products }: { products?: ProductItem[] }) {
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
          <div key={product._id || idx} className="product-card-blush">
            <div className="card-image-wrapper">
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
            </div>

            <div className="card-details">
              <div className="rating-stars" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '6px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#ffc107" color="#ffc107" />
                ))}
                <span className="rating-count" style={{ marginLeft: '6px', color: '#888' }}>
                  ({product.reviewsCount || 88})
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
                <button className="btn-add-cart-outline">ADD TO CART</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
