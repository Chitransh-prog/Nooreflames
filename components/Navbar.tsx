'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Zap, Menu, X, Star, Sparkles, User, ChevronRight, LogOut, Shield, ArrowRight, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useVisualEdit } from '@/context/VisualEditContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { EditableText } from './visual-edit/EditableElements';
import { Product } from '@/lib/store';
import defaultStoreData from '@/data/store.json';

interface NavbarProps {
  announcements?: string[];
  announcementText?: string;
  brandName?: string;
}

interface ShopTabItem {
  id: string;
  label: string;
  bannerImage: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerLink: string;
  products: {
    id: string;
    title: string;
    image: string;
    href: string;
  }[];
}

const shopMenuTabs: ShopTabItem[] = [
  {
    id: 'men',
    label: 'MEN',
    bannerImage: '/images/hero/hero-stone-bottle.jpg',
    bannerTitle: 'NOOR NOIR EXTRAITS',
    bannerSubtitle: 'Crafted for Intense Longevity · 14+ Hrs',
    bannerLink: '/product/prod-9',
    products: [
      {
        id: 'prod-9',
        title: 'Oceanic Breeze',
        image: '/images/pdp/citrus-flacon-hero.jpg',
        href: '/product/prod-9',
      },
      {
        id: 'prod-10',
        title: 'Aqua Noir',
        image: '/images/products/aqua-noir.jpg',
        href: '/product/prod-10',
      },
      {
        id: 'prod-14',
        title: 'Royal Smokey Oud',
        image: '/images/products/royal-smokey-oud.jpg',
        href: '/product/prod-14',
      },
      {
        id: 'prod-15',
        title: 'Saffron & Tobacco',
        image: '/images/products/saffron-tobacco-oud.jpg',
        href: '/product/prod-15',
      },
    ],
  },
  {
    id: 'women',
    label: 'WOMEN',
    bannerImage: '/images/pdp/model-editorial-break.jpg',
    bannerTitle: 'VELVET FLORAISON',
    bannerSubtitle: 'Sensual Rose, Damask & Imperial Jasmine',
    bannerLink: '/product/prod-12',
    products: [
      {
        id: 'prod-12',
        title: 'Velvet Rose EDP',
        image: '/images/products/velvet-rose.jpg',
        href: '/product/prod-12',
      },
      {
        id: 'prod-13',
        title: 'Imperial Jasmine',
        image: '/images/products/imperial-jasmine-attar.jpg',
        href: '/product/prod-13',
      },
      {
        id: 'prod-16',
        title: 'Amber Noir Attar',
        image: '/images/products/amber-noir-attar.jpg',
        href: '/product/prod-16',
      },
      {
        id: 'prod-11',
        title: 'Citrus Ozone',
        image: '/images/products/citrus-ozone-attar.jpg',
        href: '/product/prod-11',
      },
    ],
  },
  {
    id: 'gift-shop',
    label: 'GIFT SHOP',
    bannerImage: '/images/banners/brand-packaging-banner.jpg',
    bannerTitle: 'ARTISANAL GIFT VAULTS',
    bannerSubtitle: 'Sealed with Handcrafted Wax Medallion',
    bannerLink: '/product/prod-6',
    products: [
      {
        id: 'prod-6',
        title: 'Luxe Arch Vault',
        image: '/images/products/signature-white-giftbox.jpg',
        href: '/product/prod-6',
      },
      {
        id: 'prod-4',
        title: 'Rose Bear Duo',
        image: '/images/products/rose-bear-duo.jpg',
        href: '/product/prod-4',
      },
      {
        id: 'prod-3',
        title: 'Mango Berry Coupe',
        image: '/images/products/mango-berry-bliss.jpg',
        href: '/product/prod-3',
      },
      {
        id: 'prod-7',
        title: 'Artisan Teddy',
        image: '/images/products/teddy-bear-candle.jpg',
        href: '/product/prod-7',
      },
    ],
  },
  {
    id: 'discovery-sets',
    label: 'DISCOVERY SETS',
    bannerImage: '/images/hero/hero-stone-bottle.jpg',
    bannerTitle: 'SIGNATURE DISCOVERY VAULT',
    bannerSubtitle: '5 Handcrafted 10ML Miniatures & Scents',
    bannerLink: '/#discovery',
    products: [
      {
        id: 'prod-1',
        title: 'Secret Message',
        image: '/images/products/whispered-surprises.jpg',
        href: '/product/prod-1',
      },
      {
        id: 'prod-2',
        title: 'Cutting Chai',
        image: '/images/products/cutting-chai-candle.jpg',
        href: '/product/prod-2',
      },
      {
        id: 'prod-8',
        title: 'Chocolate Romance',
        image: '/images/products/chocolate-cupcake-candle.jpg',
        href: '/product/prod-8',
      },
      {
        id: 'prod-5',
        title: 'Strawberry Coupe',
        image: '/images/products/strawberry-dessert-candle.jpg',
        href: '/product/prod-5',
      },
    ],
  },
];

export default function Navbar({
  announcements,
  announcementText,
  brandName = 'NOOR-E-FLAMES',
}: NavbarProps) {
  const { itemCount, setIsCartOpen, addToCart } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<'all' | 'candles' | 'perfumes'>('all');
  const [quickAdded, setQuickAdded] = useState<{ [id: string]: boolean }>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>('men');
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);

  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleShopEnter = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setShopMenuOpen(true);
  };

  const handleShopLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setShopMenuOpen(false);
    }, 250);
  };

  const activeTab = shopMenuTabs.find((t) => t.id === activeTabId) || shopMenuTabs[0];

  const { customer, openAuthModal, signOutCustomer, customerOrders } = useCustomerAuth();
  const { storeData, isAdminAuthenticated } = useVisualEdit();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Safe fallback to defaultStoreData products if storeData.products isn't populated yet
  const allProducts: Product[] = useMemo(() => {
    if (storeData?.products && Array.isArray(storeData.products) && storeData.products.length > 0) {
      return storeData.products;
    }
    return ((defaultStoreData as any).products as Product[]) || [];
  }, [storeData]);

  const trendingSearches = [
    '✦ Scented Candles',
    '✦ Velvet Rose',
    '✦ Cutting Chai',
    '✦ Ocean Breeze',
    '✦ Chocolate Cupcake',
    '✦ Sunshine Citrus',
    '✦ Royal Oud',
    '✦ Discovery Set',
  ];

  const featuredBestsellers = useMemo(() => {
    return allProducts.slice(0, 4);
  }, [allProducts]);

  // Live filtered search results
  const searchResults = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return [];
    const terms = trimmed.split(/\s+/).filter(Boolean);

    return allProducts.filter((p) => {
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

      const matchesTerms = terms.every((term) => {
        if (term === 'candles') return haystack.includes('candle');
        if (term === 'perfumes') return haystack.includes('perfume') || haystack.includes('extrait') || haystack.includes('attar');
        return haystack.includes(term);
      });

      if (!matchesTerms) return false;

      if (selectedSearchCategory === 'candles') {
        return category.includes('candle') || title.includes('candle');
      }
      if (selectedSearchCategory === 'perfumes') {
        return !category.includes('candle') && !title.includes('candle');
      }

      return true;
    });
  }, [searchQuery, allProducts, selectedSearchCategory]);

  // Counts for category pills
  const { candleMatchesCount, perfumeMatchesCount } = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return { candleMatchesCount: 0, perfumeMatchesCount: 0 };
    const terms = trimmed.split(/\s+/).filter(Boolean);

    let candles = 0;
    let perfumes = 0;

    allProducts.forEach((p) => {
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
      const matches = terms.every((term) => {
        if (term === 'candles') return haystack.includes('candle');
        if (term === 'perfumes') return haystack.includes('perfume') || haystack.includes('extrait') || haystack.includes('attar');
        return haystack.includes(term);
      });

      if (matches) {
        if (category.includes('candle') || title.includes('candle')) {
          candles++;
        } else {
          perfumes++;
        }
      }
    });

    return { candleMatchesCount: candles, perfumeMatchesCount: perfumes };
  }, [searchQuery, allProducts]);

  // Handle ESC and autofocus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSelectedSearchCategory('all');
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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

  const liveAnnouncements = storeData?.siteSettings?.announcements || announcements;
  const liveBrandName = storeData?.siteSettings?.brandName || brandName || 'NOOR-E-FLAMES';

  // Default ticker items
  const defaultTickerItems = liveAnnouncements && liveAnnouncements.length > 0
    ? liveAnnouncements
    : [
        '🔥 Extra 10% off on order above ₹999',
        '🔥 Get Free 10ML sample on order above ₹1499',
        '🔥 Get Free handcream worth ₹499 on order above ₹1999',
        '🔥 Pick Any 2 full size perfumes for ₹1499',
        '🔥 Extra 10% off on order above ₹999',
      ];

  return (
    <header className="header-wrapper" onMouseLeave={handleShopLeave}>
      {/* 1. Top Scrolling Announcement Marquee Bar */}
      <div className="announcement-bar">
        <div className="announcement-marquee">
          <div className="announcement-marquee-content">
            {defaultTickerItems.map((item, idx) => (
              <EditableText
                key={`a-${idx}`}
                as="span"
                fieldPath={`siteSettings.announcements.${idx}`}
                value={item}
              />
            ))}
            {defaultTickerItems.map((item, idx) => (
              <span key={`b-${idx}`}>{item}</span>
            ))}
          </div>
          <div className="announcement-marquee-content" aria-hidden="true">
            {defaultTickerItems.map((item, idx) => (
              <span key={`c-${idx}`}>{item}</span>
            ))}
            {defaultTickerItems.map((item, idx) => (
              <span key={`d-${idx}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="header-container">
        {/* Left Column: Mobile Menu Toggle & Desktop Nav Links */}
        <div className="header-left">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} color="#ffffff" /> : <Menu size={24} color="#ffffff" />}
          </button>

          <nav className="desktop-nav">
            <ul className="nav-links-desktop">
              <li>
                <Link
                  href="/"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '15px',
                    letterSpacing: '0.03em',
                  }}
                >
                  Home
                </Link>
              </li>

              {/* Shop Link with Underline Indicator on Active/Hover & Mega-Menu Trigger */}
              <li
                className="nav-shop-item"
                onMouseEnter={handleShopEnter}
              >
                <button
                  onClick={() => setShopMenuOpen((prev) => !prev)}
                  className={`nav-shop-trigger ${shopMenuOpen ? 'active' : ''}`}
                  aria-expanded={shopMenuOpen}
                >
                  <span>Shop</span>
                  {shopMenuOpen && <span className="nav-shop-underline" />}
                </button>
              </li>

              <li>
                <Link
                  href="/about"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '15px',
                    letterSpacing: '0.03em',
                  }}
                >
                  About Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Center Column: NOOR-E-FLAMES High-Contrast Serif Wordmark (Matching HIRA style) */}
        <div className="header-center">
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <EditableText
              as="span"
              fieldPath="siteSettings.brandName"
              value={liveBrandName}
              className="font-serif header-brand-wordmark"
              style={{
                fontWeight: 500,
                color: '#ffffff',
                textTransform: 'uppercase',
                lineHeight: 1,
                display: 'inline-block',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
              }}
            />
          </Link>
        </div>

        {/* Right Column: Quick Action Icons (Matching Screenshot) */}
        <div className="header-actions-right">
          {/* Persona Portal Trigger (Customer Firebase + Admin JWT) */}
          <div className="account-dropdown-wrapper" ref={accountMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="header-action-icon account-trigger-btn"
              title="Account & Persona Login"
              aria-label="Account & Persona Login"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                color: '#ffffff',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              {customer ? (
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #BBA58E, #a8927b)',
                    color: '#121212',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {customer.displayName ? customer.displayName.charAt(0).toUpperCase() : 'C'}
                </span>
              ) : (
                <User size={20} color="#ffffff" strokeWidth={1.8} />
              )}
              {isAdminAuthenticated ? (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-3px',
                    right: '-4px',
                    backgroundColor: '#121212',
                    border: '1px solid #BBA58E',
                    borderRadius: '50%',
                    width: '12px',
                    height: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Admin Session Active"
                >
                  <Zap size={8} fill="#ffc107" color="#ffc107" />
                </span>
              ) : null}
            </button>

            {/* Persona Dropdown Floating Card */}
            {accountDropdownOpen && (
              <div className="account-dropdown-card">
                {/* 1. Customer Persona Section */}
                <div className="persona-section customer-section">
                  <div className="persona-header">
                    <span className="persona-kicker">CUSTOMER PERSONA (FIREBASE)</span>
                    <h4 className="persona-name">
                      {customer ? customer.displayName : 'Atelier Customer'}
                    </h4>
                    <p className="persona-sub">
                      {customer ? customer.email : 'Sign in for orders, live tracking & Atelier perks'}
                    </p>
                  </div>

                  {customer ? (
                    <div className="persona-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          openAuthModal('orders');
                        }}
                        className="dropdown-btn primary"
                      >
                        <ShoppingBag size={14} />
                        <span>My Orders ({customerOrders.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          openAuthModal('profile');
                        }}
                        className="dropdown-btn outline"
                      >
                        <User size={14} />
                        <span>View Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          signOutCustomer();
                          setAccountDropdownOpen(false);
                        }}
                        className="dropdown-btn danger-text"
                      >
                        <LogOut size={13} />
                        <span>Sign Out Customer</span>
                      </button>
                    </div>
                  ) : (
                    <div className="persona-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          openAuthModal('signin');
                        }}
                        className="dropdown-btn primary"
                      >
                        <span>Customer Sign In</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          openAuthModal('signup');
                        }}
                        className="dropdown-btn outline"
                      >
                        <span>Join Atelier</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="dropdown-divider" />

                {/* 2. Admin Persona Section */}
                <div className="persona-section admin-section">
                  <div className="persona-header">
                    <span className="persona-kicker admin-kicker">ADMIN PERSONA (JWT MASTER)</span>
                    <h4 className="persona-name admin-name">Commerce Hub & Visual Edit</h4>
                    <p className="persona-sub">
                      {isAdminAuthenticated
                        ? 'Master admin session is active with visual editing rights.'
                        : 'Secure JWT authentication for store management.'}
                    </p>
                  </div>

                  <div className="persona-actions">
                    {isAdminAuthenticated ? (
                      <Link
                        href="/admin"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="dropdown-btn admin-link-btn"
                      >
                        <span>Open Admin Dashboard →</span>
                      </Link>
                    ) : (
                      <Link
                        href="/admin/login"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="dropdown-btn admin-link-btn"
                      >
                        <span>Admin Login (nooreflamesadmin@...) →</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="header-action-icon"
            aria-label="Search"
            title="Search products"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#ffffff' }}
          >
            <Search size={20} color="#ffffff" strokeWidth={1.8} />
          </button>

          {/* Shopping Bag Button with Badge Count */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="header-action-icon"
            aria-label="Shopping Cart"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              padding: 0,
              color: '#ffffff',
            }}
          >
            <ShoppingBag size={21} color="#ffffff" strokeWidth={1.8} />
            <span
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-8px',
                background: '#ffffff',
                color: '#121212',
                fontSize: '9.5px',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
              }}
            >
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Shop Mega-Menu Dropdown Panel (Matching Screenshot) */}
      {shopMenuOpen && (
        <div
          className="shop-megamenu-panel"
          onMouseEnter={handleShopEnter}
          onMouseLeave={handleShopLeave}
        >
          <div className="shop-megamenu-container">
            {/* Left Column: Categories Sidebar */}
            <div className="shop-megamenu-sidebar">
              {shopMenuTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onMouseEnter={() => setActiveTabId(tab.id)}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`shop-tab-button ${activeTabId === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Middle Column: 4 Horizontal Products for Active Tab */}
            <div className="shop-megamenu-products">
              {activeTab.products.map((prod) => (
                <Link
                  key={prod.id}
                  href={prod.href}
                  onClick={() => setShopMenuOpen(false)}
                  className="shop-product-card"
                >
                  <div className="shop-product-thumb-box">
                    <img src={prod.image} alt={prod.title} />
                  </div>
                  <span className="shop-product-card-title">{prod.title}</span>
                </Link>
              ))}
            </div>

            {/* Right Column: Editorial Campaign Banner */}
            <div className="shop-megamenu-banner">
              <Link
                href={activeTab.bannerLink}
                onClick={() => setShopMenuOpen(false)}
                className="shop-banner-link"
              >
                <img src={activeTab.bannerImage} alt={activeTab.bannerTitle} />
                <div className="shop-banner-overlay">
                  <span className="shop-banner-tag">{activeTab.bannerTitle}</span>
                  <span className="shop-banner-sub">{activeTab.bannerSubtitle}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. Luxury Expandable Search Overlay & Live Search Results Dropdown */}
      {searchOpen && (
        <div className="search-overlay-container" ref={searchContainerRef}>
          {/* Semi-transparent dark blur backdrop */}
          <div
            className="search-backdrop"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search overlay"
          />

          <div className="search-overlay-content">
            {/* Search Input Bar */}
            <div className="search-overlay-bar">
              <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
                <Search size={20} color="#BBA58E" className="search-input-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search luxury perfumes, attars, soy candles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedSearchCategory('all');
                  }}
                  aria-label="Search luxury creations"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="search-clear-btn"
                    title="Clear search input"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="search-close-btn"
                  title="Close search (Esc)"
                >
                  <span className="search-esc-tag">ESC</span>
                  <X size={16} />
                </button>
              </form>
            </div>

            {/* Live Search Dropdown Panel */}
            <div className="search-dropdown-panel">
              {searchQuery.trim().length > 0 ? (
                /* Active Search Results */
                <div className="search-active-view">
                  {/* Results Top Bar */}
                  <div className="search-results-header">
                    <div className="search-results-meta">
                      <span className="search-count-badge">
                        {searchResults.length} {searchResults.length === 1 ? 'RESULT' : 'RESULTS'}
                      </span>
                      <span className="search-query-label">
                        Found for “<strong>{searchQuery}</strong>”
                      </span>
                    </div>

                    {/* Category Filter Pills (if multiple categories matched) */}
                    {searchResults.length > 0 && candleMatchesCount > 0 && perfumeMatchesCount > 0 && (
                      <div className="search-filter-pills">
                        <button
                          type="button"
                          className={`search-filter-pill ${selectedSearchCategory === 'all' ? 'active' : ''}`}
                          onClick={() => setSelectedSearchCategory('all')}
                        >
                          All ({candleMatchesCount + perfumeMatchesCount})
                        </button>
                        <button
                          type="button"
                          className={`search-filter-pill ${selectedSearchCategory === 'candles' ? 'active' : ''}`}
                          onClick={() => setSelectedSearchCategory('candles')}
                        >
                          Candles ({candleMatchesCount})
                        </button>
                        <button
                          type="button"
                          className={`search-filter-pill ${selectedSearchCategory === 'perfumes' ? 'active' : ''}`}
                          onClick={() => setSelectedSearchCategory('perfumes')}
                        >
                          Fragrances ({perfumeMatchesCount})
                        </button>
                      </div>
                    )}

                    {searchResults.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSearchSubmit()}
                        className="search-view-all-link"
                      >
                        <span>View full gallery</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>

                  {/* Results Grid / List */}
                  {searchResults.length > 0 ? (
                    <div className="search-results-grid">
                      {searchResults.slice(0, 8).map((prod) => (
                        <div key={prod.id} className="search-result-card">
                          <Link
                            href={`/product/${prod.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="search-result-img-link"
                          >
                            <img src={prod.image} alt={prod.title} />
                            {prod.badge && (
                              <span className="search-card-badge">{prod.badge}</span>
                            )}
                          </Link>

                          <div className="search-result-info">
                            <span className="search-card-cat">
                              {prod.category === 'candles' ? '✦ SOY CANDLE' : '✦ EXTRAIT FRAGRANCE'}
                            </span>
                            <Link
                              href={`/product/${prod.id}`}
                              onClick={() => setSearchOpen(false)}
                              className="search-card-title-link"
                            >
                              <h4 className="search-card-title">{prod.title}</h4>
                            </Link>
                            <p className="search-card-sub">{prod.subtitle}</p>

                            <div className="search-card-bottom">
                              <div className="search-card-pricing">
                                <span className="search-price">₹{prod.price}</span>
                                {prod.originalPrice && prod.originalPrice > prod.price && (
                                  <span className="search-orig-price">₹{prod.originalPrice}</span>
                                )}
                              </div>

                              <div className="search-card-actions">
                                <Link
                                  href={`/product/${prod.id}`}
                                  onClick={() => setSearchOpen(false)}
                                  className="search-view-btn"
                                >
                                  View
                                </Link>
                                <button
                                  type="button"
                                  onClick={(e) => handleQuickAdd(e, prod)}
                                  className={`search-add-btn ${quickAdded[prod.id] ? 'added' : ''}`}
                                >
                                  {quickAdded[prod.id] ? (
                                    <>
                                      <Check size={13} />
                                      <span>Added</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingBag size={13} />
                                      <span>Add</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Empty State */
                    <div className="search-empty-state">
                      <div className="search-empty-icon">
                        <Search size={36} strokeWidth={1.4} color="#BBA58E" />
                      </div>
                      <h3 className="search-empty-title">
                        No creations found for “{searchQuery}”
                      </h3>
                      <p className="search-empty-sub">
                        Explore our curated olfactory notes or select a popular signature collection below:
                      </p>
                      <div className="search-empty-tags">
                        {['Scented Candles', 'Cutting Chai', 'Velvet Rose', 'Ocean Breeze', 'Sunshine Citrus', 'Royal Oud'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            className="search-tag-pill"
                            onClick={() => setSearchQuery(tag)}
                          >
                            <span>✦ {tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Initial State: Trending Searches & Bestsellers */
                <div className="search-initial-view">
                  {/* Trending Searches */}
                  <div className="search-section-block">
                    <span className="search-block-kicker">POPULAR SEARCHES</span>
                    <div className="search-tags-row">
                      {trendingSearches.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="search-tag-pill"
                          onClick={() => {
                            const cleanQuery = item.replace('✦ ', '');
                            setSearchQuery(cleanQuery);
                          }}
                        >
                          <span>{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Curated Bestsellers Showcase */}
                  <div className="search-section-block">
                    <div className="search-block-header">
                      <span className="search-block-kicker">FEATURED ATELIER BESTSELLERS</span>
                      <span className="search-block-sub">Handcrafted in small batches</span>
                    </div>

                    <div className="search-featured-grid">
                      {featuredBestsellers.map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/product/${prod.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="search-featured-card"
                        >
                          <div className="search-featured-thumb">
                            <img src={prod.image} alt={prod.title} />
                            {prod.badge && (
                              <span className="search-featured-badge">{prod.badge}</span>
                            )}
                          </div>
                          <div className="search-featured-details">
                            <span className="search-featured-title">{prod.title}</span>
                            <div className="search-featured-price-row">
                              <span className="search-featured-price">₹{prod.price}</span>
                              {prod.originalPrice && (
                                <span className="search-featured-orig">₹{prod.originalPrice}</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-menu">
          <ul className="mobile-nav-links">
            <li>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 500,
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                  cursor: 'pointer',
                }}
              >
                <span>Shop</span>
                <ChevronRight
                  size={18}
                  style={{
                    transform: mobileShopExpanded ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>
              {mobileShopExpanded && (
                <div style={{ paddingLeft: '16px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {shopMenuTabs.map((tab) => (
                    <Link
                      key={tab.id}
                      href={tab.bannerLink}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ color: '#BBA58E', fontSize: '14px', fontWeight: 600, letterSpacing: '0.04em' }}
                    >
                      {tab.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
            <li>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
            </li>
            <li className="divider"></li>
            <li>
              <Link href="#reels" onClick={() => setMobileMenuOpen(false)}>
                Trending Reels
              </Link>
            </li>
            <li>
              <Link href="#ocean-fresh" onClick={() => setMobileMenuOpen(false)}>
                Oceanic & Fresh
              </Link>
            </li>
            <li>
              <Link href="#floral-rose" onClick={() => setMobileMenuOpen(false)}>
                Rose & Floral
              </Link>
            </li>
            <li>
              <Link href="#discovery" onClick={() => setMobileMenuOpen(false)}>
                Discovery Sets
              </Link>
            </li>
            <li>
              <Link href="#royal-oud" onClick={() => setMobileMenuOpen(false)}>
                Royal Oud & Amber
              </Link>
            </li>
            <li>
              <Link href="#reviews" onClick={() => setMobileMenuOpen(false)}>
                Customer Reviews
              </Link>
            </li>
            <li className="divider"></li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal(customer ? 'profile' : 'signin');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#BBA58E',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 0',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <User size={16} />
                <span>{customer ? `Patron: ${customer.displayName} (Orders)` : 'Customer Sign In / Atelier'}</span>
              </button>
            </li>
            <li>
              <Link
                href={isAdminAuthenticated ? '/admin' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#cbd5e0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  padding: '4px 0',
                }}
              >
                <Zap size={14} color="#ffc107" />
                <span>{isAdminAuthenticated ? 'Commerce Hub Admin (Active)' : 'Staff / Admin Portal (JWT)'}</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: 0,
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <ShoppingBag size={16} /> Shopping Bag ({itemCount})
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
