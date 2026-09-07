'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  RotateCcw,
  Clock,
  Droplets,
  Flame,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Zap,
  Play,
  CheckCircle2,
  Package,
  Heart,
  Share2,
  Leaf,
  Award,
  X
} from 'lucide-react';
import { Product } from '@/lib/store';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from '../visual-edit/EditableElements';
import CinematicPerfumeReveal from './CinematicPerfumeReveal';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductDetailView({
  product,
  relatedProducts = [],
}: ProductDetailViewProps) {
  const { addToCart, setIsCheckoutOpen } = useCart();
  const { storeData, updateProduct } = useVisualEdit();

  const activeProduct = (storeData?.products?.find((p: any) => p.id === product.id)) || product;

  // Gallery state
  const gallery = activeProduct.gallery && activeProduct.gallery.length > 0 ? activeProduct.gallery : [activeProduct.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant & Quantity
  const [selectedVariant, setSelectedVariant] = useState(
    product.category === 'candles' ? 'Standard 300g' : '50ml Extrait EDP'
  );
  const [quantity, setQuantity] = useState(1);

  // Pincode Delivery Estimator
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  // Accordions state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    notes: true,
    ritual: false,
    ingredients: false,
    shipping: false,
  });

  // Sticky Buy Bar on scroll
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const buyBoxRef = useRef<HTMLDivElement>(null);

  // Social Video Reel Modal
  const [activeReel, setActiveReel] = useState<{
    url: string;
    creator: string;
    quote: string;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!buyBoxRef.current) return;
      const rect = buyBoxRef.current.getBoundingClientRect();
      // Show sticky bar when user scrolls past buy box actions
      setIsStickyVisible(rect.bottom < 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length < 6) {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setPincodeResult(
      `✓ Express delivery available to ${pincode} by ${new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })} via Bluedart Air.`
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  // Frequently bought together bundle item (first related product)
  const bundleItem = relatedProducts.length > 0 ? relatedProducts[0] : null;

  // Scent notes fallback
  const topNotes = product.topNotes || ['Calabrian Bergamot', 'Sunlit Citron', 'Marine Breeze'];
  const heartNotes = product.heartNotes || ['French Orange Blossom', 'Sea Salt', 'Damask Rose'];
  const baseNotes = product.baseNotes || ['Virginian Cedarwood', 'Grey Ambergris', 'Warm Sandalwood'];

  const isPerfume = product.category !== 'candles';

  const scrollToDetails = () => {
    const el = document.getElementById('pdp-main-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {isPerfume && (
        <CinematicPerfumeReveal product={product} onSkip={scrollToDetails} />
      )}
      <div className="pdp-wrapper" id="pdp-main-content">
        {/* 1. Breadcrumbs */}
        <nav className="pdp-breadcrumb-bar" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <Link href={`/#${product.category || 'catalog'}`}>
          {product.category === 'candles'
            ? 'Artisanal Candles'
            : product.category === 'ocean-fresh'
            ? 'Oceanic Blends'
            : product.category === 'floral-rose'
            ? 'Floral Collection'
            : 'Royal Oud'}
        </Link>
        <span className="sep">/</span>
        <span className="current">{product.title}</span>
      </nav>

      {/* 2. Main Buy Box Grid */}
      <div className="pdp-hero-container" ref={buyBoxRef}>
        <div className="pdp-buybox-grid">
          {/* Left Column: Gallery */}
          <div className="pdp-gallery-wrap">
            {/* Vertical Thumbnails */}
            <div className="pdp-thumbs-rail">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`pdp-thumb-item ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={imgUrl} alt={`${product.title} thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>

            {/* Main Image Viewport */}
            <div className="pdp-main-viewport">
              {activeProduct.badge && (
                <div className="pdp-badge-overlay">
                  <EditableText
                    as="span"
                    value={activeProduct.badge}
                    onValueChange={(val) => updateProduct(activeProduct.id, { badge: val })}
                  />
                </div>
              )}
              <EditableImage
                src={gallery[activeImageIndex] || activeProduct.image}
                alt={activeProduct.title}
                label={activeProduct.title}
                onImageChange={(url) => updateProduct(activeProduct.id, { image: url })}
                id="pdp-main-preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div className="pdp-concentration-tag">
                <Sparkles size={14} color="#c9935a" />
                {activeProduct.concentration || 'Extrait Concentration · 35% Pure Oil'}
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="pdp-buybox-info">
            {/* Rating Stars & Jump */}
            <div className="pdp-rating-header">
              <div className="pdp-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#c9935a" color="#c9935a" />
                ))}
              </div>
              <span className="pdp-rating-number">{activeProduct.rating || 4.9}</span>
              <a href="#reviews" className="pdp-review-jump">
                ({activeProduct.reviewsCount || 148} Verified Reviews)
              </a>
            </div>

            {/* Product Title & Subtitle */}
            <EditableText
              as="h1"
              className="pdp-product-title"
              value={activeProduct.title}
              onValueChange={(val) => updateProduct(activeProduct.id, { title: val })}
            />
            <EditableText
              as="p"
              className="pdp-product-subtitle"
              value={activeProduct.subtitle}
              onValueChange={(val) => updateProduct(activeProduct.id, { subtitle: val })}
            />

            {/* Fragrance Pyramid Chips (HIRA feature) */}
            <div className="pdp-scent-chips-row">
              <div className="pdp-scent-chip">
                <div className="pdp-scent-chip-icon">
                  <Droplets size={16} color="#c9935a" />
                </div>
                <div className="pdp-scent-chip-content">
                  <span className="pdp-scent-chip-tier">TOP NOTE</span>
                  <span className="pdp-scent-chip-text">{topNotes[0]}</span>
                </div>
              </div>

              <div className="pdp-scent-chip">
                <div className="pdp-scent-chip-icon">
                  <Sparkles size={16} color="#c9935a" />
                </div>
                <div className="pdp-scent-chip-content">
                  <span className="pdp-scent-chip-tier">HEART NOTE</span>
                  <span className="pdp-scent-chip-text">{heartNotes[0]}</span>
                </div>
              </div>

              <div className="pdp-scent-chip">
                <div className="pdp-scent-chip-icon">
                  <Flame size={16} color="#c9935a" />
                </div>
                <div className="pdp-scent-chip-content">
                  <span className="pdp-scent-chip-tier">BASE NOTE</span>
                  <span className="pdp-scent-chip-text">{baseNotes[0]}</span>
                </div>
              </div>
            </div>

            {/* Price Container */}
            <div className="pdp-price-container">
              <span className="pdp-current-price">
                ₹
                <EditableText
                  as="span"
                  value={String(activeProduct.price)}
                  onValueChange={(val) => {
                    const num = parseInt(val.replace(/\D/g, ''), 10);
                    if (!isNaN(num)) updateProduct(activeProduct.id, { price: num });
                  }}
                />
              </span>
              {activeProduct.originalPrice && (
                <span className="pdp-original-price">
                  ₹{activeProduct.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                <span className="pdp-discount-pill">
                  Save{' '}
                  {Math.round(
                    ((activeProduct.originalPrice - activeProduct.price) / activeProduct.originalPrice) * 100
                  )}
                  % OFF
                </span>
              )}
            </div>
            <p className="pdp-tax-hint">Inclusive of all taxes · Free Express Delivery over ₹999</p>

            {/* Size / Variant Selector */}
            <div className="pdp-section-label">
              <span>Select Edition / Volume</span>
              <span style={{ color: '#c9935a', fontWeight: 600 }}>{selectedVariant}</span>
            </div>
            <div className="pdp-variants-grid">
              {product.category === 'candles' ? (
                <>
                  <div
                    className={`pdp-variant-card ${
                      selectedVariant === 'Standard 300g' ? 'active' : ''
                    }`}
                    onClick={() => setSelectedVariant('Standard 300g')}
                  >
                    <div className="pdp-variant-name">Standard Jar (300g)</div>
                    <div className="pdp-variant-price">₹{product.price}</div>
                  </div>
                  <div
                    className={`pdp-variant-card ${
                      selectedVariant === 'Luxury Arch Gift Box' ? 'active' : ''
                    }`}
                    onClick={() => setSelectedVariant('Luxury Arch Gift Box')}
                  >
                    <div className="pdp-variant-name">Luxe Arch Gift Set</div>
                    <div className="pdp-variant-price">₹{product.price + 399}</div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`pdp-variant-card ${
                      selectedVariant === '50ml Extrait EDP' ? 'active' : ''
                    }`}
                    onClick={() => setSelectedVariant('50ml Extrait EDP')}
                  >
                    <div className="pdp-variant-name">50ml Extrait Flacon</div>
                    <div className="pdp-variant-price">₹{product.price}</div>
                  </div>
                  <div
                    className={`pdp-variant-card ${
                      selectedVariant === '100ml Extrait EDP' ? 'active' : ''
                    }`}
                    onClick={() => setSelectedVariant('100ml Extrait EDP')}
                  >
                    <div className="pdp-variant-name">100ml Grand Flacon</div>
                    <div className="pdp-variant-price">₹{product.price + 699}</div>
                  </div>
                  <div
                    className={`pdp-variant-card ${
                      selectedVariant === '10ml Travel Set' ? 'active' : ''
                    }`}
                    onClick={() => setSelectedVariant('10ml Travel Set')}
                  >
                    <div className="pdp-variant-name">10ml Pocket Flacon</div>
                    <div className="pdp-variant-price">₹699</div>
                  </div>
                </>
              )}
            </div>

            {/* Pincode Estimator */}
            <div className="pdp-pincode-wrap">
              <span className="pdp-section-label" style={{ marginBottom: '4px' }}>
                Estimated Delivery Checker
              </span>
              <form onSubmit={handlePincodeCheck} className="pdp-pincode-input-row">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="pdp-pincode-input"
                />
                <button type="submit" className="pdp-pincode-btn">
                  CHECK
                </button>
              </form>
              {pincodeResult && <div className="pdp-delivery-result">{pincodeResult}</div>}
            </div>

            {/* Quantity Stepper & CTA Buttons */}
            <div className="pdp-cta-block">
              <div className="pdp-stepper-and-cart">
                <div className="pdp-stepper">
                  <button
                    type="button"
                    className="pdp-stepper-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className="pdp-stepper-value">{quantity}</span>
                  <button
                    type="button"
                    className="pdp-stepper-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  id="pdp-add-to-cart-btn"
                  className="pdp-btn-add-cart"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={18} />
                  ADD TO CART
                </button>
              </div>

              <button
                type="button"
                id="pdp-buy-now-btn"
                className="pdp-btn-buy-now"
                onClick={handleBuyNow}
              >
                <Zap size={18} fill="#ffffff" />
                BUY NOW · INSTANT CHECKOUT
              </button>
            </div>

            {/* Value Guarantees 4-Grid */}
            <div className="pdp-value-props">
              <div className="pdp-value-prop-item">
                <Clock size={18} />
                <span>{product.longevity || '12+ Hours Longevity'}</span>
              </div>
              <div className="pdp-value-prop-item">
                <Leaf size={18} />
                <span>100% Non-Toxic & Vegan</span>
              </div>
              <div className="pdp-value-prop-item">
                <Truck size={18} />
                <span>Free Express Shipping &gt; ₹999</span>
              </div>
              <div className="pdp-value-prop-item">
                <RotateCcw size={18} />
                <span>7-Day Easy Replacement</span>
              </div>
            </div>

            {/* Frequently Bought Together Upsell */}
            {bundleItem && (
              <div className="pdp-upsell-card">
                <div className="pdp-upsell-thumb">
                  <img src={bundleItem.image} alt={bundleItem.title} />
                </div>
                <div className="pdp-upsell-details">
                  <span className="pdp-upsell-badge">Frequently Bought Together</span>
                  <h4 className="pdp-upsell-title">{bundleItem.title}</h4>
                  <div className="pdp-upsell-price">
                    +₹{bundleItem.price.toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  type="button"
                  className="pdp-upsell-btn"
                  onClick={() => addToCart(bundleItem, 1)}
                >
                  + ADD
                </button>
              </div>
            )}

            {/* Expandable Accordions */}
            <div className="pdp-accordions">
              {/* Accordion 1: The Olfactory Story */}
              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="pdp-accordion-trigger"
                  onClick={() => toggleAccordion('notes')}
                >
                  <span>The Olfactory Story & Notes</span>
                  {openAccordions.notes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.notes && (
                  <div className="pdp-accordion-content">
                    <p>{product.description}</p>
                    <div style={{ marginTop: '12px' }}>
                      <strong>Top Notes:</strong> {topNotes.join(', ')}
                      <br />
                      <strong>Heart Notes:</strong> {heartNotes.join(', ')}
                      <br />
                      <strong>Base Notes:</strong> {baseNotes.join(', ')}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Application Ritual */}
              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="pdp-accordion-trigger"
                  onClick={() => toggleAccordion('ritual')}
                >
                  <span>Application Ritual & Tips</span>
                  {openAccordions.ritual ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.ritual && (
                  <div className="pdp-accordion-content">
                    <p>{product.usageRitual}</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Clean Ingredients */}
              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="pdp-accordion-trigger"
                  onClick={() => toggleAccordion('ingredients')}
                >
                  <span>Clean Ingredients & Transparency</span>
                  {openAccordions.ingredients ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.ingredients && (
                  <div className="pdp-accordion-content">
                    <p>
                      Formulated in compliance with International Fragrance Association (IFRA) 51st
                      Amendment standards. Free from phthalates, parabens, and synthetic fixatives.
                    </p>
                    {product.ingredients && (
                      <ul>
                        {product.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 4: Shipping & Returns */}
              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="pdp-accordion-trigger"
                  onClick={() => toggleAccordion('shipping')}
                >
                  <span>Shipping, COD & Returns</span>
                  {openAccordions.shipping ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.shipping && (
                  <div className="pdp-accordion-content">
                    <ul>
                      <li>
                        <strong>Dispatch:</strong> Orders placed before 2:00 PM IST dispatch the same
                        day.
                      </li>
                      <li>
                        <strong>Cash on Delivery (COD):</strong> Available nationwide with verified
                        OTP at delivery.
                      </li>
                      <li>
                        <strong>Returns:</strong> 7-day transit damage replacement guarantee.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section: "Shop From The 'Gram" / Social Video Reels */}
      <section className="pdp-reels-section">
        <div className="pdp-section-inner">
          <div className="pdp-section-header">
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#c9935a',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              AS SEEN ON INSTAGRAM
            </span>
            <h2>Shop From The &apos;Gram</h2>
            <p>Real unboxings, scent reviews, and candle rituals from the #NoorEFlames community.</p>
          </div>

          <div className="pdp-reels-grid">
            <div
              className="pdp-reel-card"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                setActiveReel({
                  url: '/videos/reels/IMG_5927.MP4',
                  creator: '@ananya_fragrance',
                  quote: 'The longevity is unreal... 12+ hrs',
                })
              }
            >
              <img src="/images/social/candle-craft-1.jpg" alt="Instagram creator reel 1" />
              <div className="pdp-reel-overlay">
                <span style={{ fontSize: '11px', opacity: 0.9 }}>@ananya_fragrance</span>
                <div className="pdp-reel-play-btn">
                  <Play size={20} fill="#ffffff" color="#ffffff" />
                </div>
                <div className="pdp-reel-bottom">
                  <span>&quot;The longevity is unreal... 12+ hrs&quot;</span>
                  <span style={{ color: '#dfab72' }}>Tap to play video ✦</span>
                </div>
              </div>
            </div>

            <div
              className="pdp-reel-card"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                setActiveReel({
                  url: '/videos/reels/IMG_5931.MP4',
                  creator: '@kunal_lifestyle',
                  quote: 'Best Indian artisanal find this year',
                })
              }
            >
              <img src="/images/social/candle-craft-2.jpg" alt="Instagram creator reel 2" />
              <div className="pdp-reel-overlay">
                <span style={{ fontSize: '11px', opacity: 0.9 }}>@kunal_lifestyle</span>
                <div className="pdp-reel-play-btn">
                  <Play size={20} fill="#ffffff" color="#ffffff" />
                </div>
                <div className="pdp-reel-bottom">
                  <span>&quot;Best Indian artisanal find this year&quot;</span>
                  <span style={{ color: '#dfab72' }}>Tap to play video ✦</span>
                </div>
              </div>
            </div>

            <div
              className="pdp-reel-card"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                setActiveReel({
                  url: '/videos/hero/noor_header_hero_video.mp4',
                  creator: '@rohan_perfumes',
                  quote: 'Extrait concentration at its finest',
                })
              }
            >
              <img src="/images/social/candle-craft-3.jpg" alt="Instagram creator reel 3" />
              <div className="pdp-reel-overlay">
                <span style={{ fontSize: '11px', opacity: 0.9 }}>@rohan_perfumes</span>
                <div className="pdp-reel-play-btn">
                  <Play size={20} fill="#ffffff" color="#ffffff" />
                </div>
                <div className="pdp-reel-bottom">
                  <span>&quot;Extrait concentration at its finest&quot;</span>
                  <span style={{ color: '#dfab72' }}>Tap to play video ✦</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Social Reel Video Modal */}
        {activeReel && (
          <div
            className="video-modal-backdrop"
            onClick={() => setActiveReel(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10, 20, 19, 0.92)',
              backdropFilter: 'blur(12px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              className="video-modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '420px',
                width: '100%',
                borderRadius: '20px',
                background: '#0f2422',
                border: '1px solid rgba(201, 147, 90, 0.4)',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              }}
            >
              {/* Top Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderBottom: '1px solid rgba(201, 147, 90, 0.2)',
                  color: '#dfab72',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{activeReel.creator}</span>
                <button
                  type="button"
                  onClick={() => setActiveReel(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Video Player */}
              <div style={{ position: 'relative', width: '100%', maxHeight: '60vh', background: '#000' }}>
                <video
                  src={activeReel.url}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', display: 'block' }}
                />
              </div>

              {/* Bottom Card */}
              <div style={{ padding: '16px 18px', background: 'rgba(15, 36, 34, 0.95)' }}>
                <p style={{ fontSize: '13px', color: '#e8eeed', fontStyle: 'italic', marginBottom: '14px' }}>
                  &ldquo;{activeReel.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart();
                      setActiveReel(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #dfab72, #c9935a)',
                      color: '#0f2422',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ADD TO CART — ₹{product.price.toLocaleString('en-IN')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Section: The Olfactory Architecture (Pyramid Breakdown) */}
      <section className="pdp-pyramid-section">
        <div className="pdp-section-inner">
          <div className="pdp-section-header">
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#c9935a',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              THE OLFACTORY PYRAMID
            </span>
            <h2>Architectural Composition</h2>
            <p>Formulated in 3 evolving tiers that gracefully reveal notes as hours pass.</p>
          </div>

          <div className="pdp-pyramid-grid">
            {/* Visual Totem & Stack Graphic */}
            <div className="pdp-pyramid-illustration">
              <div className="pdp-totem-wrap">
                <img
                  src="/images/pdp/olfactory-pyramid-tower.jpg"
                  alt="Artistic botanical fragrance pyramid totem"
                  className="pdp-totem-img"
                />
              </div>

              <div className="pdp-pyramid-stack">
                <div className="pdp-pyramid-tier-card top">
                  <div className="pdp-pyramid-tier-title">TOP TIER · 0 TO 30 MINS</div>
                  <div className="pdp-pyramid-tier-notes">{topNotes.join(' · ')}</div>
                </div>

                <div className="pdp-pyramid-tier-card heart">
                  <div className="pdp-pyramid-tier-title">HEART TIER · 30 MINS TO 4 HOURS</div>
                  <div className="pdp-pyramid-tier-notes">{heartNotes.join(' · ')}</div>
                </div>

                <div className="pdp-pyramid-tier-card base">
                  <div className="pdp-pyramid-tier-title">BASE TIER · 4 TO 14+ HOURS</div>
                  <div className="pdp-pyramid-tier-notes">{baseNotes.join(' · ')}</div>
                </div>
              </div>
            </div>

            {/* Note Descriptions */}
            <div className="pdp-pyramid-desc-block">
              <div className="pdp-pyramid-item-detail">
                <h4>
                  <span>1. Top Notes — The Initial Breath</span>
                  <span className="timing">Instant Impact</span>
                </h4>
                <p>
                  High-volatility botanical essences that deliver an exhilarating first impression.
                  Bursting with {topNotes.join(', ')} to awaken the senses upon initial contact.
                </p>
              </div>

              <div className="pdp-pyramid-item-detail">
                <h4>
                  <span>2. Heart Notes — The True Soul</span>
                  <span className="timing">30m — 4 Hours</span>
                </h4>
                <p>
                  The signature identity of the fragrance. As top notes soften, rich blooms and
                  spices including {heartNotes.join(', ')} unfold into an intoxicating, warm sillage.
                </p>
              </div>

              <div className="pdp-pyramid-item-detail">
                <h4>
                  <span>3. Base Notes — The Enduring Shadow</span>
                  <span className="timing">4 — 14+ Hours</span>
                </h4>
                <p>
                  Deep precious woods and resins including {baseNotes.join(', ')} anchor the
                  fragrance to the skin, creating an intimate, hypnotic trail that lingers long into
                  the night.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Campaign Banner */}
      <section className="pdp-campaign-banner-section">
        <div className="pdp-section-inner">
          <div className="pdp-campaign-frame">
            <img
              src="/images/pdp/model-editorial-break.jpg"
              alt="Noor-E-Flames Campaign Photograph"
              className="pdp-campaign-img"
            />
            <div className="pdp-campaign-caption-overlay">
              <span className="pdp-campaign-tag">CAMPAIGN HIGHLIGHT</span>
              <h3 className="pdp-campaign-heading">A Scent That Lingers Like A Memory</h3>
              <p className="pdp-campaign-sub">
                Captured along the rugged coastal cliffs of Goa at sunrise. A timeless collision of ocean salt mist, sun-ripened Calabrian citrus, and pure extrait perfume craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section: Cinematic Atmosphere Lifestyle Break */}
      <section className="pdp-atmosphere-section">
        <div className="pdp-atmosphere-bg-accent" />
        <div className="pdp-atmosphere-content">
          <div className="gold-monogram">
            <Sparkles size={48} color="#c9935a" style={{ margin: '0 auto' }} />
          </div>
          <blockquote className="pdp-atmosphere-quote">
            &quot;A scent does not simply enter a room — it commands memory, evokes devotion, and
            ignites the flame within.&quot;
          </blockquote>
          <div className="pdp-atmosphere-author">
            — THE NOOR-E-FLAMES MASTER NOSE · EST. INDIA
          </div>
        </div>
      </section>

      {/* 6. Section: Certified Brand Guarantees Grid */}
      <section className="pdp-guarantees-section">
        <div className="pdp-section-inner">
          <div className="pdp-guarantees-grid">
            <div className="pdp-guarantee-seal">
              <div className="pdp-seal-ring">
                <Award size={26} color="#c9935a" />
              </div>
              <span className="pdp-seal-title">IFRA Certified Formulation</span>
            </div>

            <div className="pdp-guarantee-seal">
              <div className="pdp-seal-ring">
                <Leaf size={26} color="#c9935a" />
              </div>
              <span className="pdp-seal-title">100% Vegan & Cruelty Free</span>
            </div>

            <div className="pdp-guarantee-seal">
              <div className="pdp-seal-ring">
                <Flame size={26} color="#c9935a" />
              </div>
              <span className="pdp-seal-title">Clean Soy Wax & Lead-Free Wick</span>
            </div>

            <div className="pdp-guarantee-seal">
              <div className="pdp-seal-ring">
                <ShieldCheck size={26} color="#c9935a" />
              </div>
              <span className="pdp-seal-title">Zero Synthetic Fixatives</span>
            </div>

            <div className="pdp-guarantee-seal">
              <div className="pdp-seal-ring">
                <Sparkles size={26} color="#c9935a" />
              </div>
              <span className="pdp-seal-title">Small Batch Distillation</span>
            </div>

            <div className="pdp-guarantee-seal">
              <div className="pdp-seal-ring">
                <Package size={26} color="#c9935a" />
              </div>
              <span className="pdp-seal-title">Sustainable Luxury Flacons</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section: Visual Collage & Unboxing Grid */}
      <section className="pdp-collage-section">
        <div className="pdp-section-inner">
          <div className="pdp-section-header">
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#c9935a',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              VISUAL SHOWCASE
            </span>
            <h2>The Unboxing Experience</h2>
            <p>Every bottle and candle arrives in our signature gold-embossed seal packaging.</p>
          </div>

          <div className="pdp-collage-grid">
            <div className="pdp-collage-item">
              <img src="/images/pdp/citrus-flacon-hero.jpg" alt="Noor-E-Flames citrus flacon on sunlit travertine marble" />
            </div>
            <div className="pdp-collage-item">
              <img src="/images/pdp/model-editorial-break.jpg" alt="Editorial campaign model" />
            </div>
            <div className="pdp-collage-item">
              <img src="/images/products/luxury-unboxing.jpg" alt="Luxury unboxing" />
            </div>
            <div className="pdp-collage-item">
              <img
                src="/images/products/signature-white-giftbox.jpg"
                alt="Signature gift box"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section: Customer Reviews & Rating Breakdown */}
      <section className="pdp-reviews-section" id="reviews">
        <div className="pdp-section-inner">
          <div className="pdp-section-header">
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#c9935a',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              VERIFIED BUYER EXPERIENCES
            </span>
            <h2>Customer Reviews ({product.reviewsCount || 148})</h2>
          </div>

          <div className="pdp-reviews-layout">
            {/* Left Summary Card */}
            <div className="pdp-rating-summary-card">
              <div className="pdp-huge-rating">{product.rating || 4.9}</div>
              <div className="pdp-stars-row" style={{ justifyContent: 'center', margin: '6px 0' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#c9935a" color="#c9935a" />
                ))}
              </div>
              <span style={{ fontSize: '12px', color: '#6b7775' }}>
                Based on {product.reviewsCount || 148} authentic purchases
              </span>

              <div style={{ marginTop: '20px' }}>
                <div className="pdp-rating-bar-row">
                  <span>5 ★</span>
                  <div className="pdp-rating-bar-bg">
                    <div className="pdp-rating-bar-fill" style={{ width: '92%' }} />
                  </div>
                  <span>92%</span>
                </div>
                <div className="pdp-rating-bar-row">
                  <span>4 ★</span>
                  <div className="pdp-rating-bar-bg">
                    <div className="pdp-rating-bar-fill" style={{ width: '6%' }} />
                  </div>
                  <span>6%</span>
                </div>
                <div className="pdp-rating-bar-row">
                  <span>3 ★</span>
                  <div className="pdp-rating-bar-bg">
                    <div className="pdp-rating-bar-fill" style={{ width: '2%' }} />
                  </div>
                  <span>2%</span>
                </div>
              </div>

              <button
                type="button"
                className="pdp-btn-write-review"
                onClick={() =>
                  alert('Thank you! Our verified review portal opens for confirmed orders.')
                }
              >
                WRITE A REVIEW
              </button>
            </div>

            {/* Reviews List */}
            <div className="pdp-reviews-list">
              <div className="pdp-review-card">
                <div className="pdp-review-card-top">
                  <div className="pdp-review-author">
                    <span>Aarav Sharma</span>
                    <span className="pdp-verified-badge">✓ Verified Buyer</span>
                  </div>
                  <span className="pdp-review-date">3 days ago</span>
                </div>
                <div className="pdp-stars-row" style={{ marginBottom: '8px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#c9935a" color="#c9935a" />
                  ))}
                </div>
                <p className="pdp-review-text">
                  &quot;Exceptional performance. Applied 3 sprays before heading to work at 8 AM and
                  could still smell the cedarwood and crisp sea salt notes well past 9 PM. The heavy
                  glass flacon feels so luxurious on the dresser.&quot;
                </p>
              </div>

              <div className="pdp-review-card">
                <div className="pdp-review-card-top">
                  <div className="pdp-review-author">
                    <span>Pooja Verma</span>
                    <span className="pdp-verified-badge">✓ Verified Buyer</span>
                  </div>
                  <span className="pdp-review-date">1 week ago</span>
                </div>
                <div className="pdp-stars-row" style={{ marginBottom: '8px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#c9935a" color="#c9935a" />
                  ))}
                </div>
                <p className="pdp-review-text">
                  &quot;The secret message candle melted beautifully without any tunneling. The wooden
                  wick makes the gentlest crackle sound. Packaged so securely with the gold seal!
                  Ordering 2 more as anniversary gifts.&quot;
                </p>
              </div>

              <div className="pdp-review-card">
                <div className="pdp-review-card-top">
                  <div className="pdp-review-author">
                    <span>Rohan Kulkarni</span>
                    <span className="pdp-verified-badge">✓ Verified Buyer</span>
                  </div>
                  <span className="pdp-review-date">2 weeks ago</span>
                </div>
                <div className="pdp-stars-row" style={{ marginBottom: '8px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#c9935a" color="#c9935a" />
                  ))}
                </div>
                <p className="pdp-review-text">
                  &quot;Easily rivals niche Parisian houses at 1/4th the price. Truly extrait strength.
                  Zero alcohol harshness, purely smooth bergamot and warm ambergris. Fast delivery to
                  Bengaluru too.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Section: Frequently Asked Questions (FAQ) */}
      <section className="pdp-faq-section">
        <div className="pdp-section-inner">
          <div className="pdp-section-header">
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#c9935a',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              GOT QUESTIONS?
            </span>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="pdp-faq-container">
            <div className="pdp-accordions">
              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="pdp-accordion-trigger"
                  onClick={() => toggleAccordion('faq1')}
                >
                  <span>How long does NOOR-E-FLAMES fragrance last on skin & clothing?</span>
                  {openAccordions.faq1 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.faq1 && (
                  <div className="pdp-accordion-content">
                    Due to our high 35% Extrait De Parfum concentration, expect 12 to 16+ hours of
                    active sillage on pulse points and upwards of 24 hours on natural fabric fibers
                    (wool, cotton, silk).
                  </div>
                )}
              </div>

              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="pdp-accordion-trigger"
                  onClick={() => toggleAccordion('faq2')}
                >
                  <span>Are your candles safe for indoor pets and children?</span>
                  {openAccordions.faq2 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.faq2 && (
                  <div className="pdp-accordion-content">
                    Yes! We use 100% pure botanical soy wax with natural organic crackling wooden
                    wicks. We never use petroleum paraffin, synthetic phthalates, or lead wicks.
                  </div>
                )}
              </div>

              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="pdp-accordion-trigger"
                  onClick={() => toggleAccordion('faq3')}
                >
                  <span>What is Cash on Delivery (COD) and how does it work?</span>
                  {openAccordions.faq3 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.faq3 && (
                  <div className="pdp-accordion-content">
                    We offer Cash on Delivery across 19,000+ PIN codes in India. You can pay via cash
                    or UPI QR to the delivery agent upon receiving your package.
                  </div>
                )}
              </div>

              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="pdp-accordion-trigger"
                  onClick={() => toggleAccordion('faq4')}
                >
                  <span>Can I add a personalized gift message to my order?</span>
                  {openAccordions.faq4 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.faq4 && (
                  <div className="pdp-accordion-content">
                    Yes! During checkout, simply add your custom message in the delivery notes. We
                    will handwrite your note on a gold-embossed parchment card.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Section: Related Products (Complete Your Ritual) */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="pdp-related-section" style={{ padding: '60px 24px', maxWidth: '1360px', margin: '0 auto' }}>
          <div className="pdp-section-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#c9935a',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              HARMONIOUS PAIRINGS
            </span>
            <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-heading-family)', marginTop: '8px', color: '#1a1a1a' }}>
              Complete Your Fragrance Ritual
            </h2>
          </div>

          <div className="pdp-related-grid">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="related-product-card"
              >
                <div className="related-img-wrap">
                  <Link href={`/product/${item.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Link>
                  {item.badge && (
                    <div className="related-badge">
                      {item.badge}
                    </div>
                  )}
                </div>

                <div className="related-content-wrap">
                  <Link href={`/product/${item.id}`} style={{ textDecoration: 'none', color: '#1a1a1a' }}>
                    <h4 className="related-title">
                      {item.title}
                    </h4>
                  </Link>
                  <p className="related-subtitle">
                    {item.subtitle}
                  </p>
                  <div className="related-bottom-row">
                    <span className="related-price">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <Link
                      href={`/product/${item.id}`}
                      className="related-btn"
                    >
                      VIEW
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. Sticky Bottom Buy Bar (Desktop & Mobile) */}
      <div className={`pdp-sticky-bar ${isStickyVisible ? 'visible' : ''}`}>
        <div className="pdp-sticky-product-info">
          <div className="pdp-sticky-thumb">
            <img src={gallery[0] || product.image} alt={product.title} />
          </div>
          <div>
            <div className="pdp-sticky-name">{product.title}</div>
            <div className="pdp-sticky-price">₹{product.price.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="pdp-sticky-cta-group">
          <button
            type="button"
            className="pdp-sticky-btn"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
