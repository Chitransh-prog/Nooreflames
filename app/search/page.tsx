'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ShoppingBag, Check, ArrowLeft, SlidersHorizontal, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { Product } from '@/lib/store';
import defaultStoreData from '@/data/store.json';

function SearchResultsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<'all' | 'candles' | 'perfumes'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [quickAdded, setQuickAdded] = useState<{ [id: string]: boolean }>({});

  const { addToCart } = useCart();
  const { storeData } = useVisualEdit();

  const allProducts: Product[] = useMemo(() => {
    if (storeData?.products && Array.isArray(storeData.products) && storeData.products.length > 0) {
      return storeData.products;
    }
    return ((defaultStoreData as any).products as Product[]) || [];
  }, [storeData]);

  // Active query for filtering (from URL or fallback to input)
  const currentQuery = initialQuery || inputQuery;

  // Filter products by query and category
  const filteredProducts = useMemo(() => {
    const trimmed = currentQuery.trim().toLowerCase();
    const terms = trimmed.split(/\s+/).filter(Boolean);

    let list = allProducts;

    if (terms.length > 0) {
      list = list.filter((p) => {
        const title = (p.title || '').toLowerCase();
        const subtitle = (p.subtitle || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const scentFamily = (p.scentFamily || '').toLowerCase();
        const badge = (p.badge || '').toLowerCase();
        const notes = [
          ...(p.topNotes || []),
          ...(p.heartNotes || []),
          ...(p.baseNotes || []),
          ...(p.ingredients || []),
        ].join(' ').toLowerCase();

        const haystack = `${title} ${subtitle} ${category} ${scentFamily} ${badge} ${desc} ${notes}`;

        return terms.every((term) => {
          if (term === 'candles') return haystack.includes('candle');
          if (term === 'perfumes') return haystack.includes('perfume') || haystack.includes('extrait') || haystack.includes('attar');
          return haystack.includes(term);
        });
      });
    }

    if (activeCategory === 'candles') {
      list = list.filter((p) => (p.category || '').includes('candle') || (p.title || '').toLowerCase().includes('candle'));
    } else if (activeCategory === 'perfumes') {
      list = list.filter((p) => !(p.category || '').includes('candle') && !(p.title || '').toLowerCase().includes('candle'));
    }

    // Sorting
    const sorted = [...list];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    }

    return sorted;
  }, [allProducts, currentQuery, activeCategory, sortBy]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputQuery.trim())}`);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod, 1);
    setQuickAdded((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setQuickAdded((prev) => ({ ...prev, [prod.id]: false }));
    }, 1600);
  };

  return (
    <div className="search-page-wrapper" style={{ background: '#FAF8F5', minHeight: '100vh' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #121212 0%, #1e1d1b 100%)',
          color: '#ffffff',
          padding: 'clamp(44px, 6vw, 70px) 24px clamp(36px, 5vw, 56px)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.24em',
              color: '#BBA58E',
              fontWeight: 700,
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            ✦ OLFACTORY CURATION ✦
          </span>

          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              margin: '0 0 16px',
              fontWeight: 400,
              lineHeight: 1.2,
            }}
          >
            {currentQuery ? `Search Results for “${currentQuery}”` : 'Search Atelier Catalog'}
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: '#D4CDC5',
              margin: '0 auto 28px',
              maxWidth: '520px',
              lineHeight: 1.5,
            }}
          >
            Discover handcrafted soy wax candles and long-lasting extrait perfumes.
          </p>

          {/* Search Form Box */}
          <form
            onSubmit={handleFormSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#FFFFFF',
              borderRadius: '50px',
              padding: '6px 16px 6px 20px',
              maxWidth: '580px',
              margin: '0 auto',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.28)',
              border: '1.5px solid rgba(187, 165, 142, 0.4)',
            }}
          >
            <Search size={19} color="#8A7258" style={{ marginRight: '10px', flexShrink: 0 }} />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search candles, rose, vanilla, attars..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '14.5px',
                color: '#121212',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#121212',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '30px',
                padding: '9px 18px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'background 0.2s',
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Results Section */}
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Controls Bar: Category Pills & Sort Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(187, 165, 142, 0.2)',
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '8px 18px',
                borderRadius: '24px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: activeCategory === 'all' ? '#121212' : 'rgba(187, 165, 142, 0.3)',
                background: activeCategory === 'all' ? '#121212' : '#FFFFFF',
                color: activeCategory === 'all' ? '#FFFFFF' : '#121212',
                transition: 'all 0.2s',
              }}
            >
              All Products
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('candles')}
              style={{
                padding: '8px 18px',
                borderRadius: '24px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: activeCategory === 'candles' ? '#121212' : 'rgba(187, 165, 142, 0.3)',
                background: activeCategory === 'candles' ? '#121212' : '#FFFFFF',
                color: activeCategory === 'candles' ? '#FFFFFF' : '#121212',
                transition: 'all 0.2s',
              }}
            >
              Soy Candles
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('perfumes')}
              style={{
                padding: '8px 18px',
                borderRadius: '24px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: activeCategory === 'perfumes' ? '#121212' : 'rgba(187, 165, 142, 0.3)',
                background: activeCategory === 'perfumes' ? '#121212' : '#FFFFFF',
                color: activeCategory === 'perfumes' ? '#FFFFFF' : '#121212',
                transition: 'all 0.2s',
              }}
            >
              Fragrances & Attars
            </button>
          </div>

          {/* Result Count & Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '13px', color: '#707070', fontWeight: 500 }}>
              Showing <strong>{filteredProducts.length}</strong> creations
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={14} color="#8A7258" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(187, 165, 142, 0.3)',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  fontSize: '12.5px',
                  color: '#121212',
                  outline: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(187, 165, 142, 0.25)',
                  boxShadow: '0 4px 16px rgba(18, 18, 18, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
              >
                {/* Image Container */}
                <Link
                  href={`/product/${prod.id}`}
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1',
                    background: '#F5F2EC',
                    overflow: 'hidden',
                    display: 'block',
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  {prod.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: '#121212',
                        color: '#FFFFFF',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {prod.badge}
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      color: '#8A7258',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: '4px',
                      display: 'block',
                    }}
                  >
                    {prod.category === 'candles' ? '✦ SOY WAX CANDLE' : '✦ ROYAL EXTRAIT'}
                  </span>

                  <Link
                    href={`/product/${prod.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: '16.5px',
                        color: '#121212',
                        margin: '0 0 6px',
                        fontWeight: 500,
                        lineHeight: 1.3,
                      }}
                    >
                      {prod.title}
                    </h3>
                  </Link>

                  <p
                    style={{
                      fontSize: '12px',
                      color: '#707070',
                      margin: '0 0 16px',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {prod.subtitle}
                  </p>

                  <div
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(187, 165, 142, 0.15)',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '17px', fontWeight: 700, color: '#121212' }}>
                        ₹{prod.price}
                      </span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#999999',
                            textDecoration: 'line-through',
                            marginLeft: '6px',
                          }}
                        >
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, prod)}
                      style={{
                        background: quickAdded[prod.id] ? '#2e7d32' : '#121212',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '7px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.2s',
                      }}
                    >
                      {quickAdded[prod.id] ? (
                        <>
                          <Check size={14} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid rgba(187, 165, 142, 0.25)',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#FAF8F5',
                border: '1px solid rgba(187, 165, 142, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Search size={32} color="#8A7258" strokeWidth={1.5} />
            </div>

            <h3
              className="font-serif"
              style={{ fontSize: '22px', color: '#121212', margin: '0 0 10px', fontWeight: 500 }}
            >
              No creations found for “{currentQuery}”
            </h3>

            <p
              style={{
                fontSize: '14px',
                color: '#707070',
                maxWidth: '440px',
                margin: '0 auto 24px',
                lineHeight: 1.5,
              }}
            >
              We couldn’t find an exact match for your inquiry. Try searching with a different fragrance note or browse our signature selections:
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
              {['Scented Candles', 'Cutting Chai', 'Velvet Rose', 'Ocean Breeze', 'Sunshine Citrus', 'Royal Oud'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setInputQuery(term);
                    router.push(`/search?q=${encodeURIComponent(term)}`);
                  }}
                  style={{
                    background: '#FAF8F5',
                    border: '1px solid rgba(187, 165, 142, 0.3)',
                    borderRadius: '20px',
                    padding: '7px 16px',
                    fontSize: '12.5px',
                    color: '#121212',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  ✦ {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', background: '#FAF8F5' }}>
      <Navbar />
      <Suspense
        fallback={
          <div
            style={{
              padding: '120px 24px',
              textAlign: 'center',
              color: '#8A7258',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '0.1em',
            }}
          >
            ✦ EXPLORING ATELIER FRAGRANCES... ✦
          </div>
        }
      >
        <SearchResultsInner />
      </Suspense>
      <Footer />
    </div>
  );
}
