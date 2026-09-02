import React from 'react';
import { Flame, FlaskConical, Sparkles, Star } from 'lucide-react';
import { urlForImage } from '../sanity/lib/image';

export interface ProductItem {
  _id?: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  image?: any;
  category?: string;
}

const defaultProducts: ProductItem[] = [
  {
    title: 'Royal Oud & Amber EDP',
    subtitle: 'Smoky Oud · Warm Amber · Velvet Rose',
    price: 1999,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 142,
    badge: 'BESTSELLER',
    category: 'royal-oud',
  },
  {
    title: 'Velvet Jasmine Attar',
    subtitle: 'Pure Concentrated Perfume Oil · Alcohol Free',
    price: 1499,
    originalPrice: 1899,
    rating: 5.0,
    reviewsCount: 98,
    badge: 'ARTISANAL',
    category: 'floral-rose',
  },
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
    title: 'Spiced Vanilla & Soy Candle',
    subtitle: 'Hand-poured Natural Soy Wax · 50 Hours Burn Time',
    price: 999,
    originalPrice: 1299,
    rating: 4.8,
    reviewsCount: 76,
    badge: 'NEW',
    category: 'candles',
  },
];

export default function ProductCollection({
  products,
}: {
  products?: ProductItem[];
}) {
  const displayProducts = products && products.length > 0 ? products : defaultProducts;

  return (
    <section className="section-container" id="edps">
      <div className="section-header-center">
        <span className="section-overline gold">CURATED PERFUMERY</span>
        <h2 className="section-title font-serif">Signature Collections</h2>
      </div>
      <div className="product-grid-4col">
        {displayProducts.map((item, idx) => (
          <div key={item._id || idx} className="product-card">
            <div className="card-image-wrapper">
              {item.badge && <span className="card-badge-gold">{item.badge}</span>}
              {item.image ? (
                <img
                  src={urlForImage(item.image).url()}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(145deg, #f7f1ea, #ebdcd0)',
                  }}
                >
                  {item.category === 'candles' ? (
                    <Flame size={48} color="#c9935a" />
                  ) : item.category === 'attars' ? (
                    <FlaskConical size={48} color="#c9935a" />
                  ) : (
                    <Sparkles size={48} color="#c9935a" />
                  )}
                </div>
              )}
            </div>
            <div className="card-details">
              <div className="rating-stars" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '6px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#ffc107" color="#ffc107" />
                ))}
                <span className="rating-count" style={{ marginLeft: '6px', color: '#888' }}>
                  ({item.reviewsCount || 100})
                </span>
              </div>
              <h3 className="card-title font-serif">{item.title}</h3>
              <p className="card-notes">{item.subtitle}</p>
              <div className="card-pricing-row">
                <div className="price-tag">
                  ₹{item.price.toLocaleString('en-IN')}
                  {item.originalPrice && (
                    <span className="original-price">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <button className="btn-add-cart">ADD TO CART</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
