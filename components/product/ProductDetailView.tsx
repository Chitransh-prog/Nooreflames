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
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Zap,
  Play,
  CheckCircle2,
  Package,
  Heart,
  Share2,
  Leaf,
  Award,
  X,
  Box,
  Eye,
  Copy,
  Check
} from 'lucide-react';
import { Product } from '@/lib/store';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { EditableText, EditableImage } from '../visual-edit/EditableElements';
import LuxuryProduct3DCanvas from '../3d/LuxuryProduct3DCanvas';

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
  const [isGallery3DMode, setIsGallery3DMode] = useState(false);

  // Variant & Quantity
  const [selectedVariant, setSelectedVariant] = useState(
    product.category === 'candles' ? 'Standard 300g' : '50ml Extrait EDP'
  );
  const [quantity, setQuantity] = useState(1);

  // Promo code copy state
  const [promoCopied, setPromoCopied] = useState(false);

  // Pincode Delivery Estimator
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  // Accordions state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    notes: true,
    ritual: false,
    ingredients: false,
    shipping: false,
    faq1: false,
    faq2: false,
    faq3: false,
    faq4: false,
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

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!buyBoxRef.current) return;
      const rect = buyBoxRef.current.getBoundingClientRect();
      setIsStickyVisible(rect.bottom < 120);
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

  const handleCopyPromo = () => {
    navigator.clipboard?.writeText('DUO1499');
    setPromoCopied(true);
    setTimeout(() => setPromoCopied(false), 2500);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 4000);
    }
  };

  // At least 5 related products (up to 10 for the slider)
  const displayRelated = (() => {
    let list: Product[] = [];
    if (relatedProducts && relatedProducts.length > 0) {
      list = [...relatedProducts];
    }
    // Supplement with storeData products if fewer than 8
    if (list.length < 8 && storeData?.products) {
      const extra = storeData.products.filter(
        (p: any) => p.id !== activeProduct.id && !list.some((item) => item.id === p.id)
      );
      list = [...list, ...extra];
    }
    return list.slice(0, 10);
  })();

  // Related Products Slider controls
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [addedRelated, setAddedRelated] = useState<{ [id: string]: boolean }>({});

  const checkRelatedScroll = () => {
    if (!relatedScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = relatedScrollRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
  };

  useEffect(() => {
    const el = relatedScrollRef.current;
    if (!el) return;
    checkRelatedScroll();
    el.addEventListener('scroll', checkRelatedScroll, { passive: true });
    window.addEventListener('resize', checkRelatedScroll);
    return () => {
      el.removeEventListener('scroll', checkRelatedScroll);
      window.removeEventListener('resize', checkRelatedScroll);
    };
  }, [displayRelated]);

  const scrollRelated = (direction: 'left' | 'right') => {
    if (!relatedScrollRef.current) return;
    const container = relatedScrollRef.current;
    const firstCard = container.querySelector('.pdp-related-card') as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth + 18 : 280;
    const distance = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    container.scrollBy({ left: distance, behavior: 'smooth' });
  };

  const handleAddRelated = (item: Product) => {
    addToCart(item, 1);
    setAddedRelated((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedRelated((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  // Frequently bought together bundle item
  const bundleItem = displayRelated.length > 0 ? displayRelated[0] : null;

  // Scent notes fallback
  const topNotes = product.topNotes || ['Calabrian Bergamot', 'Crisp Pear', 'Pink Pepper'];
  const heartNotes = product.heartNotes || ['Damask Rose', 'French Orange Blossom', 'Night Jasmine'];
  const baseNotes = product.baseNotes || ['Precious Ambergris', 'Virginian Cedarwood', 'Madagascar Vanilla'];

  // Social Reels configuration (6 high-end creator tiles)
  const socialReels = [
    {
      img: '/images/social/candle-craft-1.jpg',
      video: '/videos/reels/IMG_5927.MP4',
      creator: '@ananya_fragrance',
      quote: 'The 12+ hour sillage is genuinely unmatched',
    },
    {
      img: '/images/creatives/noor-rose-love.jpg',
      video: '/videos/reels/IMG_5931.MP4',
      creator: '@kunal_lifestyle',
      quote: 'Smells like a luxury niche house at 1/4th the price',
    },
    {
      img: '/images/pdp/model-editorial-break.jpg',
      video: '/videos/hero/noor_header_hero_video.mp4',
      creator: '@rohan_perfumes',
      quote: 'Pure extrait concentration. Zero synthetic harshness',
    },
    {
      img: '/images/pdp/citrus-flacon-hero.jpg',
      video: '/videos/reels/IMG_5866.MOV',
      creator: '@priya_luxuryfinds',
      quote: 'Crisp bergamot that lingers into cozy amberwood',
    },
    {
      img: '/images/social/candle-craft-3.jpg',
      video: '/videos/reels/IMG_5867.MOV',
      creator: '@devika_scents',
      quote: 'The unboxing experience felt like pure royalty',
    },
    {
      img: '/images/social/candle-craft-4.jpg',
      video: '/videos/reels/IMG_5876.MOV',
      creator: '@arjun_curates',
      quote: 'My go-to evening scent for date nights',
    },
  ];

  return (
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
            : 'Royal Fragrances'}
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
              {/* Interactive 3D Model Thumbnail Switcher */}
              <button
                type="button"
                className={`pdp-thumb-item pdp-thumb-3d ${isGallery3DMode ? 'active' : ''}`}
                onClick={() => setIsGallery3DMode(true)}
                title="View in 3D Interactive Model"
              >
                <div className="pdp-thumb-3d-box">
                  <Box size={18} color="#BBA58E" />
                  <span>3D VIEW</span>
                </div>
              </button>

              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`pdp-thumb-item ${!isGallery3DMode && activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    setIsGallery3DMode(false);
                    setActiveImageIndex(idx);
                  }}
                >
                  <img src={imgUrl} alt={`${product.title} thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>

            {/* Main Viewport: Either 3D Interactive Canvas or High-Res Image */}
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

              {isGallery3DMode ? (
                <div className="pdp-gallery-3d-container">
                  <LuxuryProduct3DCanvas product={activeProduct} isInteractive={true} compact={true} />
                  <button
                    type="button"
                    className="pdp-switch-to-photo-btn"
                    onClick={() => setIsGallery3DMode(false)}
                    title="Return to photo gallery"
                  >
                    <Eye size={14} />
                    <span>View Photos</span>
                  </button>
                  <div className="pdp-3d-hint-tag">
                    <Sparkles size={12} color="#BBA58E" />
                    <span>Drag to rotate 360° · Scroll to zoom</span>
                  </div>
                </div>
              ) : (
                <>
                  <EditableImage
                    src={gallery[activeImageIndex] || activeProduct.image}
                    alt={activeProduct.title}
                    label={activeProduct.title}
                    onImageChange={(url) => updateProduct(activeProduct.id, { image: url })}
                    id="pdp-main-preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <button
                    type="button"
                    className="pdp-view-3d-trigger-btn"
                    onClick={() => setIsGallery3DMode(true)}
                    title="Switch to Interactive 3D Model"
                  >
                    <Box size={14} color="#BBA58E" />
                    <span>3D VIEW</span>
                  </button>
                </>
              )}

              <div className="pdp-concentration-tag">
                <Sparkles size={14} color="#BBA58E" />
                {activeProduct.concentration || (product.category === 'candles' ? '100% Pure Botanical Soy' : 'Extrait Concentration · 35% Pure Oil')}
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="pdp-buybox-info">
            {/* Rating Stars & Jump */}
            <div className="pdp-rating-header">
              <div className="pdp-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#BBA58E" color="#BBA58E" />
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

            {/* Fragrance Botanical Scent Chips (Top, Heart, Base) */}
            <div className="pdp-scent-chips-row">
              <div className="pdp-scent-chip">
                <div className="pdp-scent-chip-icon botanical-citrus">
                  <Droplets size={18} color="#4A7A5E" />
                </div>
                <div className="pdp-scent-chip-content">
                  <span className="pdp-scent-chip-tier">TOP NOTES</span>
                  <span className="pdp-scent-chip-text">{topNotes[0]}</span>
                </div>
              </div>

              <div className="pdp-scent-chip">
                <div className="pdp-scent-chip-icon botanical-floral">
                  <Sparkles size={18} color="#D83B58" />
                </div>
                <div className="pdp-scent-chip-content">
                  <span className="pdp-scent-chip-tier">HEART NOTES</span>
                  <span className="pdp-scent-chip-text">{heartNotes[0]}</span>
                </div>
              </div>

              <div className="pdp-scent-chip">
                <div className="pdp-scent-chip-icon botanical-amber">
                  <Flame size={18} color="#BA8348" />
                </div>
                <div className="pdp-scent-chip-content">
                  <span className="pdp-scent-chip-tier">BASE NOTES</span>
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

            {/* Deep Slate Duo Offer Banner */}
            <div className="pdp-duo-offer-banner">
              <div className="pdp-duo-offer-text">
                <span className="pdp-duo-tag">EXCLUSIVE BUNDLE OFFER</span>
                <span className="pdp-duo-headline">Buy Any 2 Flacons For Just ₹1,499</span>
              </div>
              <button
                type="button"
                className="pdp-duo-code-btn"
                onClick={handleCopyPromo}
                title="Click to copy coupon code"
              >
                {promoCopied ? (
                  <>
                    <Check size={14} color="#ffffff" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>CODE: DUO1499</span>
                  </>
                )}
              </button>
            </div>

            {/* Dedicated 3D Interactive View Button in Buy Box */}
            <div className="pdp-buybox-3d-action-wrap">
              <button
                type="button"
                className="pdp-buybox-3d-btn"
                onClick={() => {
                  setIsGallery3DMode(true);
                  if (buyBoxRef.current) {
                    buyBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                title="Inspect 3D bottle in 360° interactive canvas"
              >
                <Box size={16} color="#BBA58E" />
                <span>{isGallery3DMode ? 'Viewing in 3D Mode (Drag to Rotate 360°)' : 'View in 3D · 360° Interactive Model'}</span>
              </button>
            </div>

            {/* Size / Edition Selector */}
            <div className="pdp-section-label">
              <span>Select Edition / Volume</span>
              <span style={{ color: '#BBA58E', fontWeight: 600 }}>{selectedVariant}</span>
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
              <span className="pdp-section-label" style={{ marginBottom: '6px' }}>
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
                    <p>{product.usageRitual || 'Spray 2-3 times on pulse points (wrists, collarbone, behind ears) immediately after a warm shower for 14+ hours of active radiant projection.'}</p>
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
                      Formulated in strict compliance with International Fragrance Association (IFRA) 51st
                      Amendment standards. Free from harsh phthalates, parabens, and synthetic fixatives.
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

      {/* 3. Section: "Shop Our Feed" / Social Video Reels (6 Cards) */}
      <section className="pdp-reels-section">
        <div className="pdp-section-inner">
          <div className="pdp-section-header">
            <span className="pdp-subtitle-gold">AS SEEN ON INSTAGRAM</span>
            <h2>Shop Our Feed</h2>
            <p>Real unboxings, scent reviews, and candle rituals from the #NoorEFlames community.</p>
          </div>

          <div className="pdp-reels-6grid">
            {socialReels.map((reel, idx) => (
              <div
                key={idx}
                className="pdp-reel-card"
                onClick={() =>
                  setActiveReel({
                    url: reel.video,
                    creator: reel.creator,
                    quote: reel.quote,
                  })
                }
              >
                <img src={reel.img} alt={`${reel.creator} reel preview`} />
                <div className="pdp-reel-overlay">
                  <span className="pdp-reel-handle">{reel.creator}</span>
                  <div className="pdp-reel-play-btn">
                    <Play size={20} fill="#ffffff" color="#ffffff" />
                  </div>
                  <div className="pdp-reel-bottom">
                    <span className="quote">&ldquo;{reel.quote}&rdquo;</span>
                    <span className="action">Tap to play video ✦</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Reel Modal */}
        {activeReel && (
          <div
            className="video-modal-backdrop"
            onClick={() => setActiveReel(null)}
          >
            <div
              className="video-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="video-modal-top">
                <span>{activeReel.creator}</span>
                <button
                  type="button"
                  onClick={() => setActiveReel(null)}
                  className="video-modal-close"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="video-modal-body">
                <video
                  src={activeReel.url}
                  controls
                  autoPlay
                  playsInline
                />
              </div>

              <div className="video-modal-foot">
                <p>&ldquo;{activeReel.quote}&rdquo;</p>
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    setActiveReel(null);
                  }}
                  className="video-modal-cta"
                >
                  ADD TO CART — ₹{product.price.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Vibrant Scrolling Marquee Ribbon */}
      <div className="pdp-marquee-ribbon" aria-hidden="true">
        <div className="pdp-marquee-track">
          <span>EXTRAIT DE PARFUM ✦ 12+ HOURS LONGEVITY ✦ IFRA CERTIFIED ✦ CLEAN BOTANICALS ✦ CRUELTY FREE ✦ 100% NON-TOXIC SOY WAX ✦ SMALL BATCH DISTILLATION ✦ MADE IN INDIA ✦ </span>
          <span>EXTRAIT DE PARFUM ✦ 12+ HOURS LONGEVITY ✦ IFRA CERTIFIED ✦ CLEAN BOTANICALS ✦ CRUELTY FREE ✦ 100% NON-TOXIC SOY WAX ✦ SMALL BATCH DISTILLATION ✦ MADE IN INDIA ✦ </span>
        </div>
      </div>

      {/* 5. Section: "About The Scent" / Note Breakdown Section */}
      <section className="pdp-about-scent-section">
        <div className="pdp-section-inner">
          <div className="pdp-about-scent-grid">
            {/* Left: Serif Title & Story */}
            <div className="pdp-about-scent-left">
              <span className="pdp-about-tag">NOOR-E-FLAMES · PARFUMERIE</span>
              <h2 className="pdp-about-title">{product.title}</h2>
              <p className="pdp-about-desc">
                {product.description ||
                  'An intoxicating marriage of sparkling top botanicals, opulent blooming petals, and deeply grounding amber woods.'}
              </p>
              <div className="pdp-about-highlight-box">
                <strong>35% Pure Oil Extrait</strong>
                <span>Aged 90 days in Grasse & Kannauj for maximum sillage and intimate longevity.</span>
              </div>
            </div>

            {/* Center: Botanical Bouquet Totem Art */}
            <div className="pdp-about-scent-center">
              <div className="pdp-botanical-artwork-frame">
                <img
                  src="/images/pdp/olfactory-pyramid-tower.jpg"
                  alt={`${product.title} botanical ingredient pyramid`}
                  className="pdp-botanical-img"
                />
              </div>
            </div>

            {/* Right: Notes Breakdown */}
            <div className="pdp-about-scent-right">
              <div className="pdp-notes-tier-item">
                <div className="pdp-notes-tier-header">
                  <span className="tier-badge top">TOP NOTES</span>
                  <span className="tier-time">0 — 30 MINS</span>
                </div>
                <div className="pdp-notes-tier-names">{topNotes.join(' · ')}</div>
                <p className="pdp-notes-tier-desc">The exhilarating initial breath awakening the senses upon contact.</p>
              </div>

              <div className="pdp-notes-tier-item">
                <div className="pdp-notes-tier-header">
                  <span className="tier-badge heart">HEART NOTES</span>
                  <span className="tier-time">30 MINS — 4 HOURS</span>
                </div>
                <div className="pdp-notes-tier-names">{heartNotes.join(' · ')}</div>
                <p className="pdp-notes-tier-desc">The opulent, radiant floral soul of the perfume as the warmth settles.</p>
              </div>

              <div className="pdp-notes-tier-item">
                <div className="pdp-notes-tier-header">
                  <span className="tier-badge base">BASE NOTES</span>
                  <span className="tier-time">4 — 14+ HOURS</span>
                </div>
                <div className="pdp-notes-tier-names">{baseNotes.join(' · ')}</div>
                <p className="pdp-notes-tier-desc">Deep precious woods and resins anchoring the scent to the skin all night.</p>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* 9. Section: Why Choose Noor-E-Flames Heritage Badges */}
      <section className="pdp-why-choose-section">
        <div className="pdp-section-inner">
          <div className="pdp-section-header">
            <span className="pdp-subtitle-gold">THE NOOR-E-FLAMES PROMISE</span>
            <h2>Why Choose Noor-E-Flames</h2>
            <p>Uncompromising craftsmanship, ethical botanicals, and enduring performance.</p>
          </div>

          <div className="pdp-why-choose-row">
            <div className="pdp-why-badge">
              <div className="badge-ring"><Clock size={24} color="#D83B58" /></div>
              <span className="badge-title">12+ Hours Longevity</span>
              <span className="badge-sub">High Extrait Formulation</span>
            </div>

            <div className="pdp-why-badge">
              <div className="badge-ring"><Award size={24} color="#D83B58" /></div>
              <span className="badge-title">IFRA Certified</span>
              <span className="badge-sub">51st Amendment Standards</span>
            </div>

            <div className="pdp-why-badge">
              <div className="badge-ring"><Leaf size={24} color="#D83B58" /></div>
              <span className="badge-title">100% Vegan</span>
              <span className="badge-sub">Cruelty Free Botanicals</span>
            </div>

            <div className="pdp-why-badge">
              <div className="badge-ring"><Droplets size={24} color="#D83B58" /></div>
              <span className="badge-title">Clean Scent</span>
              <span className="badge-sub">Zero Phthalates & Parabens</span>
            </div>

            <div className="pdp-why-badge">
              <div className="badge-ring"><Heart size={24} color="#D83B58" /></div>
              <span className="badge-title">Hand Poured</span>
              <span className="badge-sub">Small Batch Distillation</span>
            </div>

            <div className="pdp-why-badge">
              <div className="badge-ring"><Sparkles size={24} color="#D83B58" /></div>
              <span className="badge-title">Made in India</span>
              <span className="badge-sub">Royal Heritage Craft</span>
            </div>
          </div>
        </div>
      </section>


      {/* 11. Section: "You Might Also Like" Related Products Carousel */}
      {displayRelated && displayRelated.length > 0 && (
        <section className="pdp-related-section" aria-label="Related Products">
          <div className="pdp-section-inner">
            <div className="pdp-related-top-bar">
              <div className="pdp-section-header pdp-related-header">
                <span className="pdp-subtitle-gold">HARMONIOUS PAIRINGS</span>
                <h2>You Might Also Like</h2>
                <p>Complementary fragrances curated to layer seamlessly with your signature scent.</p>
              </div>

              {/* Header Chevron Controls */}
              <div className="pdp-related-nav-controls">
                <button
                  type="button"
                  className={`pdp-chevron-btn ${!canScrollLeft ? 'pdp-btn-disabled' : ''}`}
                  onClick={() => scrollRelated('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous products"
                  title="Previous products"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className={`pdp-chevron-btn ${!canScrollRight ? 'pdp-btn-disabled' : ''}`}
                  onClick={() => scrollRelated('right')}
                  disabled={!canScrollRight}
                  aria-label="Next products"
                  title="Next products"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="pdp-related-slider-wrapper">
              {/* Floating Side Left Chevron */}
              <button
                type="button"
                className={`pdp-floating-chevron pdp-floating-left ${!canScrollLeft ? 'pdp-chevron-hidden' : ''}`}
                onClick={() => scrollRelated('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
              >
                <ChevronLeft size={22} />
              </button>

              {/* 5-Item Responsive Carousel Track */}
              <div className="pdp-related-track" ref={relatedScrollRef}>
                {displayRelated.map((item) => (
                  <div key={item.id} className="pdp-related-card">
                    <div className="pdp-related-img-wrap">
                      <Link href={`/product/${item.id}`}>
                        <img src={item.image} alt={item.title} loading="lazy" />
                      </Link>
                      {item.badge && <div className="pdp-related-pill">{item.badge}</div>}
                    </div>
                    <div className="pdp-related-body">
                      <Link href={`/product/${item.id}`} className="pdp-related-link">
                        <h4>{item.title}</h4>
                      </Link>
                      <p className="pdp-related-sub">{item.subtitle}</p>
                      <div className="pdp-related-foot">
                        <span className="pdp-related-price">₹{item.price.toLocaleString('en-IN')}</span>
                        <button
                          type="button"
                          className={`pdp-related-add-btn ${addedRelated[item.id] ? 'is-added' : ''}`}
                          onClick={() => handleAddRelated(item)}
                        >
                          {addedRelated[item.id] ? (
                            <>
                              <Check size={13} style={{ marginRight: 4 }} /> ADDED
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

              {/* Floating Side Right Chevron */}
              <button
                type="button"
                className={`pdp-floating-chevron pdp-floating-right ${!canScrollRight ? 'pdp-chevron-hidden' : ''}`}
                onClick={() => scrollRelated('right')}
                disabled={!canScrollRight}
                aria-label="Scroll right"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 12. Section: Customer Reviews (Light Luxury Palette) */}
      <section className="pdp-reviews-section light-theme" id="reviews">
        <div className="pdp-section-inner">
          <div className="pdp-section-header">
            <span className="pdp-subtitle-gold">AUTHENTIC BUYER FEEDBACK</span>
            <h2>Customer Reviews ({product.reviewsCount || 148})</h2>
          </div>

          <div className="pdp-reviews-layout">
            {/* Left Summary Card */}
            <div className="pdp-rating-summary-card">
              <div className="pdp-huge-rating">{product.rating || 4.9}</div>
              <div className="pdp-stars-row" style={{ justifyContent: 'center', margin: '8px 0' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#BBA58E" color="#BBA58E" />
                ))}
              </div>
              <span className="pdp-rating-basis">
                Based on {product.reviewsCount || 148} authentic purchases
              </span>

              <div className="pdp-rating-bars-wrap">
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
                className="pdp-btn-write-review outlined-btn"
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
                    <Star key={i} size={14} fill="#BBA58E" color="#BBA58E" />
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
                    <Star key={i} size={14} fill="#BBA58E" color="#BBA58E" />
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
                    <Star key={i} size={14} fill="#BBA58E" color="#BBA58E" />
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

      {/* 13. Section: FAQ Accordion with Wax Seal Header */}
      <section className="pdp-faq-section">
        <div className="pdp-section-inner">
          <div className="pdp-section-header">
            <div className="pdp-faq-wax-seal-icon">
              <img src="/images/envelope-wax-seal.png" alt="Noor-E-Flames Wax Seal" />
            </div>
            <span className="pdp-subtitle-gold">GOT QUESTIONS?</span>
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

      {/* 14. Section: Wax Seal Newsletter Signup Bar */}
      <section className="pdp-newsletter-section">
        <div className="pdp-newsletter-inner">
          <div className="pdp-newsletter-envelope">
            <img src="/images/envelope-wax-seal.png" alt="Noor-E-Flames Wax Seal Envelope" />
          </div>
          <span className="pdp-newsletter-tag">PRIVATE CONCIERGE</span>
          <h3 className="pdp-newsletter-title">Subscribe for Private Scent Drops & Exclusive Offers</h3>
          <p className="pdp-newsletter-sub">Be the first to receive invitations to limited edition flacon releases and VIP savings.</p>

          <form onSubmit={handleNewsletterSubmit} className="pdp-newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="pdp-newsletter-input"
              required
            />
            <button type="submit" className="pdp-newsletter-btn">
              SUBSCRIBE
            </button>
          </form>
          {newsletterSuccess && (
            <div className="pdp-newsletter-alert">
              ✓ Thank you for subscribing! Welcome to the Noor-E-Flames inner circle.
            </div>
          )}
        </div>
      </section>

      {/* 15. Sticky Bottom Buy Bar (Desktop & Mobile) */}
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
  );
}
