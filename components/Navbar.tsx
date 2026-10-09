'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
    bannerTitle: 'NOOR NOIR EAU DE PARFUM',
    bannerSubtitle: 'Crafted for Intense Longevity · 14+ Hrs',
    bannerLink: '/category/men',
    products: [
      {
        id: 'prod-the-eclipse',
        title: 'The Eclipse',
        image: '/images/products/perfume-tassel-flacon-4.jpg',
        href: '/product/prod-the-eclipse',
      },
      {
        id: 'prod-the-ninth-tide',
        title: 'The Ninth Tide',
        image: '/images/products/perfume-tassel-flacon-8.jpg',
        href: '/product/prod-the-ninth-tide',
      },
      {
        id: 'prod-oud-regence',
        title: 'Oud Régence Attar',
        image: '/images/products/attar-crystal-flacon.jpg',
        href: '/product/prod-oud-regence',
      },
      {
        id: 'prod-pistachio-affair',
        title: 'Pistachio Affair',
        image: '/images/products/perfume-tassel-flacon-3.jpg',
        href: '/product/prod-pistachio-affair',
      },
    ],
  },
  {
    id: 'women',
    label: 'WOMEN',
    bannerImage: '/images/pdp/model-editorial-break.jpg',
    bannerTitle: 'VELVET FLORAISON',
    bannerSubtitle: 'Sensual Rose, Damask & Imperial Jasmine',
    bannerLink: '/category/women',
    products: [
      {
        id: 'prod-blush-hour',
        title: 'Blush Hour EDP',
        image: '/images/products/perfume-tassel-flacon.jpg',
        href: '/product/prod-blush-hour',
      },
      {
        id: 'prod-after-midnight',
        title: 'After Midnight',
        image: '/images/products/perfume-tassel-flacon-6.jpg',
        href: '/product/prod-after-midnight',
      },
      {
        id: 'prod-rose-maudite',
        title: 'Rose Maudite',
        image: '/images/products/perfume-tassel-flacon-7.jpg',
        href: '/product/prod-rose-maudite',
      },
      {
        id: 'prod-bulgarian-rose-attar',
        title: 'Bulgarian Rose Attar',
        image: '/images/products/attar-crystal-flacon-2.jpg',
        href: '/product/prod-bulgarian-rose-attar',
      },
    ],
  },
  {
    id: 'gift-shop',
    label: 'GIFT SHOP',
    bannerImage: '/images/banners/brand-packaging-banner.jpg',
    bannerTitle: 'ARTISANAL GIFT VAULTS',
    bannerSubtitle: 'Sealed with Handcrafted Wax Medallion',
    bannerLink: '/category/gift-shop',
    products: [
      {
        id: 'prod-1',
        title: 'Whispered Surprises',
        image: '/images/products/whispered-surprises-real.jpg',
        href: '/product/prod-1',
      },
      {
        id: 'prod-2',
        title: 'कटिंग chai',
        image: '/images/products/cutting-chai-real.jpg',
        href: '/product/prod-2',
      },
      {
        id: 'prod-21',
        title: 'Birthday Candle',
        image: '/images/products/birthday-candle-real.jpg',
        href: '/product/prod-21',
      },
      {
        id: 'prod-3',
        title: 'Mango Berry Bliss',
        image: '/images/products/mango-berry-bliss-real.jpg',
        href: '/product/prod-3',
      },
    ],
  },
  {
    id: 'discovery-sets',
    label: 'DISCOVERY SETS',
    bannerImage: '/images/creatives/noor-discovery-dual.jpg',
    bannerTitle: 'SIGNATURE DISCOVERY VAULT',
    bannerSubtitle: '5 Handcrafted 10ML Miniatures & Scents',
    bannerLink: '/category/discovery-sets',
    products: [
      {
        id: 'prod-disc-her',
        title: 'Set For Her (4×10ML)',
        image: '/images/creatives/noor-discovery-her.jpg',
        href: '/product/prod-disc-her',
      },
      {
        id: 'prod-disc-him',
        title: 'Set For Him (4×10ML)',
        image: '/images/creatives/noor-discovery-him.jpg',
        href: '/product/prod-disc-him',
      },
      {
        id: 'prod-disc-dual',
        title: 'Complete Vault (8×10ML)',
        image: '/images/creatives/noor-discovery-dual.jpg',
        href: '/product/prod-disc-dual',
      },
      {
        id: 'prod-6',
        title: 'Luxe Arch Vault',
        image: '/images/products/signature-white-giftbox.jpg',
        href: '/product/prod-6',
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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchInput, setMobileSearchInput] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<'all' | 'candles' | 'perfumes'>('all');
  const [quickAdded, setQuickAdded] = useState<{ [id: string]: boolean }>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>('men');
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);

  // Automatically close mobile menu when navigating routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleMobileSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mobileSearchInput.trim()) return;
    setMobileMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(mobileSearchInput.trim())}`);
  };

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
  const { storeData, isAdminAuthenticated, isEditing } = useVisualEdit();
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

  // Lock body & html scroll cleanly when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle smooth hash anchor scroll if arriving with hash or navigating
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string, anchorId?: string) => {
    setMobileMenuOpen(false);
    if (anchorId && typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
      const el = document.getElementById(anchorId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', `#${anchorId}`);
      }
    }
  };

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
      <div
        className="announcement-bar"
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          display: 'flex',
          width: '100%',
          backgroundColor: '#e6c887',
          color: '#121212',
          padding: '9px 0',
          fontSize: '11.5px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          userSelect: 'none',
        }}
      >
        <div
          className="announcement-marquee"
          style={{
            display: 'flex',
            width: 'max-content',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <div
            className="announcement-marquee-content"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '36px',
              paddingRight: '36px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
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
          <div
            className="announcement-marquee-content"
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '36px',
              paddingRight: '36px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
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
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setSearchOpen(false);
              setAccountDropdownOpen(false);
            }}
            className="mobile-menu-btn"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileMenuOpen ? <X size={22} color="#ffffff" /> : <Menu size={22} color="#ffffff" />}
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
                <Link
                  href="/shop"
                  onMouseEnter={handleShopEnter}
                  onClick={() => setShopMenuOpen(false)}
                  className={`nav-shop-trigger ${shopMenuOpen ? 'active' : ''}`}
                  aria-expanded={shopMenuOpen}
                >
                  <span>Shop</span>
                  {shopMenuOpen && <span className="nav-shop-underline" />}
                </Link>
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

        {/* Center Column: NOOR-E-FLAMES High-Contrast Serif Wordmark with Luxury Monogram Emblem */}
        <div className="header-center">
          <Link
            href="/"
            onClick={(e) => {
              if (isEditing) e.preventDefault();
            }}
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <img
              src="/images/logo/logo-emblem-gold.png"
              alt="NOOR-E-FLAMES Crest"
              className="header-brand-emblem"
              style={{
                height: '28px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(197, 168, 128, 0.35))',
                display: 'block',
              }}
            />
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
          {/* Persona Portal Trigger (Customer Account + Admin JWT) */}
          <div className="account-dropdown-wrapper" ref={accountMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                  setMobileMenuOpen(true);
                  setAccountDropdownOpen(false);
                  setSearchOpen(false);
                } else {
                  setAccountDropdownOpen(!accountDropdownOpen);
                  setMobileMenuOpen(false);
                  setSearchOpen(false);
                }
              }}
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
                    <span className="persona-kicker">CUSTOMER ACCOUNT</span>
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
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="dropdown-btn admin-link-btn"
                        >
                          <span>Open Admin Dashboard →</span>
                        </Link>
                        <Link
                          href="/?visualEdit=true"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="dropdown-btn admin-link-btn"
                          style={{ marginTop: '8px', border: '1px solid rgba(187, 165, 142, 0.4)', background: 'rgba(187, 165, 142, 0.12)', color: '#BBA58E' }}
                        >
                          <span>✏️ Launch Visual Editor →</span>
                        </Link>
                      </>
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
            onClick={() => {
              setSearchOpen(!searchOpen);
              setMobileMenuOpen(false);
              setAccountDropdownOpen(false);
            }}
            className="header-action-icon"
            aria-label="Search"
            title="Search products"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#ffffff' }}
          >
            <Search size={20} color="#ffffff" strokeWidth={1.8} />
          </button>

          {/* Shopping Bag Button with Badge Count */}
          <button
            onClick={() => {
              setIsCartOpen(true);
              setMobileMenuOpen(false);
            }}
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
                  onClick={() => {
                    setActiveTabId(tab.id);
                    setShopMenuOpen(false);
                    router.push(`/category/${tab.id}`);
                  }}
                  className={`shop-tab-button ${activeTabId === tab.id ? 'active' : ''}`}
                  title={`View ${tab.label} Category`}
                >
                  {tab.label}
                </button>
              ))}
              <Link
                href="/shop"
                onClick={() => setShopMenuOpen(false)}
                className="shop-tab-button"
                style={{
                  marginTop: '12px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(187, 165, 142, 0.25)',
                  color: '#8E7051',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>ALL COLLECTIONS</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {/* Middle Column: 4 Horizontal Products for Active Tab */}
            <div className="shop-megamenu-middle-col">
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

              <div className="shop-megamenu-view-all-row">
                <Link
                  href={`/category/${activeTab.id}`}
                  onClick={() => setShopMenuOpen(false)}
                  className="shop-megamenu-explore-link"
                >
                  <span>EXPLORE COMPLETE {activeTab.label} COLLECTION</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Right Column: Editorial Campaign Banner */}
            <div className="shop-megamenu-banner">
              <Link
                href={`/category/${activeTab.id}`}
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
                          className={`search-filter-pill ${selectedSearchCategory === 'perfumes' ? 'active' : ''}`}
                          onClick={() => setSelectedSearchCategory('perfumes')}
                        >
                          Fragrances ({perfumeMatchesCount})
                        </button>
                        <button
                          type="button"
                          className={`search-filter-pill ${selectedSearchCategory === 'candles' ? 'active' : ''}`}
                          onClick={() => setSelectedSearchCategory('candles')}
                        >
                          Candles ({candleMatchesCount})
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
                              {prod.category === 'candles' ? '✦ SOY CANDLE' : '✦ EAU DE PARFUM'}
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

      {/* 5. Luxury Mobile Navigation Drawer & Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="mobile-drawer-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Drawer Header with Brand & Close Button */}
          <div className="mobile-drawer-header">
            <div className="mobile-drawer-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/images/logo/logo-emblem-gold.png"
                alt="NOOR-E-FLAMES Crest"
                style={{
                  height: '32px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="mobile-drawer-brand-name">NOOR-E-FLAMES</span>
                <span className="mobile-drawer-brand-sub">Atelier de Parfum & Bougies</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-close-btn"
              aria-label="Close navigation menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Drawer Body */}
          <div className="mobile-drawer-body">
            {/* Quick Search in Drawer */}
            <form
              onSubmit={handleMobileSearchSubmit}
              className="mobile-drawer-search"
              role="search"
            >
              <Search size={15} color="#8A7055" />
              <input
                type="text"
                placeholder="Search perfumes, attars, candles..."
                value={mobileSearchInput}
                onChange={(e) => setMobileSearchInput(e.target.value)}
                aria-label="Search catalog"
              />
              {mobileSearchInput ? (
                <button
                  type="button"
                  onClick={() => setMobileSearchInput('')}
                  className="mobile-search-clear-btn"
                  aria-label="Clear search text"
                >
                  <X size={13} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="mobile-search-submit-btn"
                  aria-label="Submit search"
                >
                  <ArrowRight size={13} color="#8A7055" />
                </button>
              )}
            </form>

            {/* Navigation Links */}
            <ul className="mobile-nav-links">
              {/* Home */}
              <li>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link ${pathname === '/' ? 'active-link' : ''}`}
                >
                  <span>Home</span>
                  <ChevronRight size={15} className="mobile-nav-chevron" />
                </Link>
              </li>

              {/* Shop & Collections Accordion */}
              <li className="mobile-nav-accordion-item">
                <div
                  className={`mobile-nav-accordion-trigger ${mobileShopExpanded ? 'expanded' : ''}`}
                  onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                  role="button"
                  aria-expanded={mobileShopExpanded}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setMobileShopExpanded(!mobileShopExpanded);
                    }
                  }}
                >
                  <div className="mobile-nav-trigger-left">
                    <span>Shop Collections</span>
                    <span className="mobile-nav-trigger-tag">All</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`mobile-accordion-arrow ${mobileShopExpanded ? 'open' : ''}`}
                  />
                </div>

                {mobileShopExpanded && (
                  <div className="mobile-subnav-panel">
                    <Link
                      href="/shop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-subnav-highlight"
                    >
                      <span>Explore Full Catalog</span>
                      <ArrowRight size={13} />
                    </Link>

                    <div className="mobile-subnav-grid">
                      {shopMenuTabs.map((tab) => (
                        <Link
                          key={tab.id}
                          href={tab.bannerLink}
                          onClick={() => setMobileMenuOpen(false)}
                          className="mobile-subnav-card"
                        >
                          <div className="mobile-subnav-card-info">
                            <span className="mobile-subnav-card-name">{tab.label}</span>
                            <span className="mobile-subnav-card-sub">{tab.bannerSubtitle}</span>
                          </div>
                          <ChevronRight size={13} color="#8A7055" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              {/* Curated Categories */}
              <li>
                <Link
                  href="/category/ocean-fresh"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link ${pathname === '/category/ocean-fresh' ? 'active-link' : ''}`}
                >
                  <div className="mobile-nav-link-content">
                    <span className="mobile-nav-bullet" style={{ background: '#7ba7b8' }} />
                    <span>Oceanic & Marine</span>
                  </div>
                  <ChevronRight size={15} className="mobile-nav-chevron" />
                </Link>
              </li>

              <li>
                <Link
                  href="/category/floral-rose"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link ${pathname === '/category/floral-rose' ? 'active-link' : ''}`}
                >
                  <div className="mobile-nav-link-content">
                    <span className="mobile-nav-bullet" style={{ background: '#d67d73' }} />
                    <span>Rose & Damask Florals</span>
                  </div>
                  <ChevronRight size={15} className="mobile-nav-chevron" />
                </Link>
              </li>

              <li>
                <Link
                  href="/category/royal-oud"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link ${pathname === '/category/royal-oud' ? 'active-link' : ''}`}
                >
                  <div className="mobile-nav-link-content">
                    <span className="mobile-nav-bullet" style={{ background: '#d4af37' }} />
                    <span>Attars & Royal Ouds</span>
                  </div>
                  <ChevronRight size={15} className="mobile-nav-chevron" />
                </Link>
              </li>

              <li>
                <Link
                  href="/category/discovery-sets"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link ${pathname === '/category/discovery-sets' ? 'active-link' : ''}`}
                >
                  <div className="mobile-nav-link-content">
                    <span className="mobile-nav-bullet" style={{ background: '#BBA58E' }} />
                    <span>Discovery Sets</span>
                  </div>
                  <span className="mobile-pill-badge">Testers</span>
                </Link>
              </li>

              <li className="mobile-drawer-divider" />

              {/* Editorial / Social Anchors */}
              <li>
                <Link
                  href="/#reels"
                  onClick={(e) => handleNavClick(e, '/#reels', 'reels')}
                  className="mobile-nav-link"
                >
                  <div className="mobile-nav-link-content">
                    <span>Trending Reels</span>
                  </div>
                  <span className="mobile-viral-badge">Viral</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/#reviews"
                  onClick={(e) => handleNavClick(e, '/#reviews', 'reviews')}
                  className="mobile-nav-link"
                >
                  <div className="mobile-nav-link-content">
                    <span>Customer Reviews</span>
                  </div>
                  <span className="mobile-rating-badge">★ 4.9</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link ${pathname === '/about' ? 'active-link' : ''}`}
                >
                  <span>About Atelier</span>
                  <ChevronRight size={15} className="mobile-nav-chevron" />
                </Link>
              </li>

              <li className="mobile-drawer-divider" />

              {/* Customer Account & Admin Persona (JWT Master) in Mobile Sidebar Drawer */}
              <li className="mobile-persona-container">
                <div className="mobile-persona-card">
                  {/* 1. Customer Persona Section */}
                  <div className="persona-section customer-section">
                    <div className="persona-header">
                      <span className="persona-kicker">CUSTOMER ACCOUNT</span>
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
                            setMobileMenuOpen(false);
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
                            setMobileMenuOpen(false);
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
                            setMobileMenuOpen(false);
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
                            setMobileMenuOpen(false);
                            openAuthModal('signin');
                          }}
                          className="dropdown-btn primary"
                        >
                          <span>Customer Sign In</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
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
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="dropdown-btn admin-link-btn"
                          >
                            <span>Open Admin Dashboard →</span>
                          </Link>
                          <Link
                            href="/?visualEdit=true"
                            onClick={() => setMobileMenuOpen(false)}
                            className="dropdown-btn admin-link-btn"
                            style={{ marginTop: '8px', border: '1px solid rgba(187, 165, 142, 0.4)', background: 'rgba(187, 165, 142, 0.12)', color: '#BBA58E' }}
                          >
                            <span>✏️ Launch Visual Editor →</span>
                          </Link>
                        </>
                      ) : (
                        <Link
                          href="/admin/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="dropdown-btn admin-link-btn"
                        >
                          <span>Admin Login (nooreflamesadmin@...) →</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </li>

              {/* Shopping Bag Action Button */}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="mobile-cart-action-btn"
                >
                  <div className="mobile-cart-action-left">
                    <ShoppingBag size={17} color="#8A7055" />
                    <span>Shopping Bag</span>
                  </div>
                  <span className="mobile-cart-count-pill">{itemCount} items</span>
                </button>
              </li>
            </ul>

            {/* Footer Perks & Support inside Drawer */}
            <div className="mobile-drawer-footer">
              <a
                href="https://wa.me/919302306478?text=Hello%20Noor-e-Flames%20Atelier,%20I%20would%20like%20assistance%20with%20fragrances"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-drawer-whatsapp-btn"
              >
                <span>Direct Concierge (WhatsApp)</span>
                <ArrowRight size={12} />
              </a>
              <div className="mobile-drawer-perk">
                <span>✨ Free Express Courier on Orders above ₹999</span>
              </div>

              {/* Staff Portal discreet access */}
              <Link
                href={isAdminAuthenticated ? '/admin' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-admin-link"
              >
                <Zap size={11} color="#8A7055" />
                <span>{isAdminAuthenticated ? 'Admin Portal (Active Session)' : 'Staff Atelier Access'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
