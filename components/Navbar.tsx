'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Zap, Menu, X, Star, Sparkles } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  announcementText?: string;
  brandName?: string;
}

export default function Navbar({
  announcementText,
  brandName = 'NOOR-E-FLAMES',
}: NavbarProps) {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Default ticker items matching reference image
  const defaultTickerItems = [
    '🔥 Extra 10% off on order above ₹999',
    '🔥 Get Free 10ML sample on order above ₹1499',
    '🔥 Get Free handcream worth ₹499 on order above ₹1999',
    '🔥 Pick Any 2 full size perfumes for ₹1499',
    '🔥 Extra 10% off on order above ₹999',
  ];

  return (
    <header className="header-wrapper">
      {/* 1. Top Scrolling Announcement Marquee Bar */}
      <div className="announcement-bar">
        <div className="announcement-marquee">
          <div className="announcement-marquee-content">
            {defaultTickerItems.map((item, idx) => (
              <span key={`a-${idx}`}>{item}</span>
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
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/#ocean-fresh">Shop</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Center Column: NOOR-E-FLAMES Logo */}
        <div className="header-center">
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Logo size="compact" variant="light" />
          </Link>
        </div>

        {/* Right Column: Quick Action Icons */}
        <div className="header-actions-right">
          {/* Quick Studio / Flash Offer Icon */}
          <Link
            href="/studio"
            className="header-action-icon"
            title="Sanity Studio / Special Offers"
            aria-label="Studio"
          >
            <Zap size={20} color="#ffc107" fill="#ffc107" />
          </Link>

          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="header-action-icon"
            aria-label="Search"
            title="Search products"
          >
            <Search size={20} color="#ffffff" strokeWidth={1.8} />
          </button>

          {/* Shopping Bag Icon with Badge Count */}
          <Link href="#cart" className="header-action-icon" aria-label="Shopping Cart">
            <ShoppingBag size={20} color="#ffffff" strokeWidth={1.8} />
            <span className="cart-count-badge">{cartCount}</span>
          </Link>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {searchOpen && (
        <div className="search-overlay-bar">
          <div className="search-input-wrapper">
            <Search size={18} color="#666666" />
            <input
              type="text"
              placeholder="Search luxury perfumes, attars, soy candles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button onClick={() => setSearchOpen(false)} className="search-close-btn">
              <X size={18} color="#666666" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-menu">
          <ul className="mobile-nav-links">
            <li>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/#ocean-fresh" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
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
          </ul>
        </div>
      )}
    </header>
  );
}
