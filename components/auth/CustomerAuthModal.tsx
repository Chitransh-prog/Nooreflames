'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Mail,
  Lock,
  User,
  ShoppingBag,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Package,
  Calendar,
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useCustomerAuth, AuthModalTab } from '@/context/CustomerAuthContext';

export default function CustomerAuthModal() {
  const {
    customer,
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    signInCustomer,
    signUpCustomer,
    signOutCustomer,
    customerOrders,
    isFirebaseLive,
  } = useCustomerAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await signInCustomer(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage('Welcome back to the Noor-E-Flames Atelier.');
      setTimeout(() => {
        setAuthModalTab('profile');
      }, 700);
    } else {
      setErrorMessage(result.error || 'Failed to sign in.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const result = await signUpCustomer(email, password, displayName);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage('Welcome! Your Atelier membership has been created.');
      setTimeout(() => {
        setAuthModalTab('profile');
      }, 800);
    } else {
      setErrorMessage(result.error || 'Failed to create account.');
    }
  };

  const handleSignOut = async () => {
    await signOutCustomer();
    setAuthModalTab('signin');
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  return (
    <div
      className="customer-auth-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="customer-auth-card">
        {/* Top Header with Brand Accent & Close */}
        <div className="customer-auth-top">
          <div>
            <span className="customer-auth-kicker">NOOR-E-FLAMES ATELIER</span>
            <h2 className="customer-auth-title">
              {customer
                ? `Welcome, ${customer.displayName}`
                : authModalTab === 'signup'
                ? 'Join The Atelier'
                : 'Customer Sign In'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="customer-auth-close"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="customer-auth-tabs">
          {!customer ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`customer-tab-btn ${authModalTab === 'signin' ? 'active' : ''}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`customer-tab-btn ${authModalTab === 'signup' ? 'active' : ''}`}
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setAuthModalTab('profile')}
                className={`customer-tab-btn ${authModalTab === 'profile' ? 'active' : ''}`}
              >
                My Account
              </button>
              <button
                type="button"
                onClick={() => setAuthModalTab('orders')}
                className={`customer-tab-btn ${authModalTab === 'orders' ? 'active' : ''}`}
              >
                Orders ({customerOrders.length})
              </button>
            </>
          )}
        </div>

        {/* Body Alerts */}
        {errorMessage && (
          <div className="customer-alert error">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="customer-alert success">
            <Sparkles size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="customer-auth-body">
          {/* TAB: SIGN IN */}
          {!customer && authModalTab === 'signin' && (
            <form onSubmit={handleSignIn} className="customer-form">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="customer-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="customer-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="customer-submit-btn"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In To Account'}
              </button>

              <div className="form-footer-switch">
                <span>New to Noor-E-Flames?</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('signup');
                    setErrorMessage(null);
                  }}
                  className="link-btn"
                >
                  Create an Atelier Account
                </button>
              </div>
            </form>
          )}

          {/* TAB: SIGN UP */}
          {!customer && authModalTab === 'signup' && (
            <form onSubmit={handleSignUp} className="customer-form">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrap">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Aria Montgomery"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="customer-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="customer-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password (Min. 6 Characters)</label>
                <div className="input-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="customer-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="customer-submit-btn"
              >
                {isSubmitting ? 'Creating Membership...' : 'Create Atelier Account'}
              </button>

              <div className="form-footer-switch">
                <span>Already an Atelier member?</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('signin');
                    setErrorMessage(null);
                  }}
                  className="link-btn"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB: PROFILE (When Authenticated) */}
          {customer && authModalTab === 'profile' && (
            <div className="customer-profile-view">
              <div className="customer-badge-card">
                <div className="customer-avatar">
                  {customer.displayName ? customer.displayName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="customer-info">
                  <h3>{customer.displayName}</h3>
                  <p className="customer-email">{customer.email}</p>
                  <span className="customer-tier-tag">
                    <Sparkles size={11} color="#BBA58E" />
                    <span>Atelier Patron · Client ID: {customer.uid.slice(0, 8)}</span>
                  </span>
                </div>
              </div>

              <div className="profile-quick-stats">
                <div className="stat-card">
                  <span className="stat-num">{customerOrders.length}</span>
                  <span className="stat-label">Orders Placed</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">
                    ₹
                    {customerOrders
                      .reduce((sum, o: any) => sum + (Number(o.amount ?? o.total) || 0), 0)
                      .toLocaleString()}
                  </span>
                  <span className="stat-label">Total Spend</span>
                </div>
              </div>

              <div className="profile-actions">
                <button
                  type="button"
                  onClick={() => setAuthModalTab('orders')}
                  className="profile-action-btn primary"
                >
                  <ShoppingBag size={16} />
                  <span>View Order History</span>
                  <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="profile-action-btn danger"
                >
                  <LogOut size={16} />
                  <span>Sign Out of Atelier</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: ORDERS (When Authenticated) */}
          {customer && authModalTab === 'orders' && (
            <div className="customer-orders-view">
              {customerOrders.length === 0 ? (
                <div className="customer-empty-orders">
                  <Package size={40} color="#718096" strokeWidth={1.5} />
                  <p className="empty-title">No orders on record yet</p>
                  <p className="empty-subtitle">
                    Orders placed with <strong>{customer.email}</strong> will appear here for live
                    tracking and delivery receipts.
                  </p>
                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="shop-now-btn"
                  >
                    Explore Perfumes & Candles
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {customerOrders.map((order: any) => {
                    const orderDate = order.createdAt || order.date || new Date().toISOString();
                    const orderStatus = (order.deliveryStatus || order.status || 'confirmed').toLowerCase();
                    const orderAmount = Number(order.amount ?? order.total ?? 0);
                    return (
                      <div key={order.id} className="customer-order-card">
                        <div className="order-head">
                          <div>
                            <span className="order-id">Order #{order.id}</span>
                            <span className="order-date">
                              <Calendar size={12} />
                              {new Date(orderDate).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <span
                            className={`order-status-pill ${
                              orderStatus.includes('deliver')
                                ? 'delivered'
                                : orderStatus.includes('ship') || orderStatus.includes('transit')
                                ? 'shipped'
                                : 'pending'
                            }`}
                          >
                            {order.deliveryStatus || order.status || 'Confirmed'}
                          </span>
                        </div>

                        <div className="order-items">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="order-item-row">
                              <span className="item-name">
                                {item.title} × {item.quantity}
                              </span>
                              <span className="item-price">
                                ₹{(Number(item.price) * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="order-footer">
                          <span className="order-total-label">Total Amount:</span>
                          <span className="order-total-val">₹{orderAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Auth Provider Info & Admin Hub Portal */}
        <div className="customer-auth-footer">
          <div className="firebase-status">
            <ShieldCheck size={13} color="#BBA58E" />
            <span>
              {isFirebaseLive ? 'Secured by Firebase Auth' : 'Customer Account System (Firebase Ready)'}
            </span>
          </div>

          <Link
            href="/admin/login"
            onClick={closeAuthModal}
            className="admin-portal-link"
            title="Switch to Administrator Commerce Hub"
          >
            <span>Staff or Administrator? Commerce Hub Login</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .customer-auth-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(18, 18, 18, 0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100002;
          padding: 16px;
          animation: overlayFadeIn 0.25s ease;
        }

        .customer-auth-card {
          width: 100%;
          max-width: 460px;
          background: #FFFFFF;
          border: 1px solid rgba(187, 165, 142, 0.35);
          border-radius: 18px;
          box-shadow: 0 24px 60px rgba(18, 18, 18, 0.16), 0 2px 12px rgba(187, 165, 142, 0.1);
          color: #121212;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }

        .customer-auth-top {
          padding: 24px 24px 18px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid rgba(187, 165, 142, 0.2);
          background: #FFFFFF;
        }

        .customer-auth-kicker {
          font-family: var(--font-body-family, sans-serif);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #8A7258;
          display: block;
          margin-bottom: 4px;
        }

        .customer-auth-title {
          font-family: var(--font-heading-family, 'Bodoni Moda', Georgia, serif);
          font-size: 24px;
          font-weight: 500;
          color: #121212;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .customer-auth-close {
          background: #F9F7F2;
          border: 1px solid rgba(187, 165, 142, 0.25);
          color: #707070;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .customer-auth-close:hover {
          background: #121212;
          color: #F9F7F2;
          border-color: #121212;
          transform: scale(1.05);
        }

        .customer-auth-tabs {
          display: flex;
          border-bottom: 1px solid rgba(187, 165, 142, 0.25);
          background: #F9F7F2;
        }

        .customer-tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: #707070;
          padding: 13px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-body-family, sans-serif);
        }

        .customer-tab-btn:hover:not(.active) {
          color: #121212;
          background: rgba(187, 165, 142, 0.08);
        }

        .customer-tab-btn.active {
          color: #121212;
          border-bottom-color: #121212;
          background: #FFFFFF;
          font-weight: 700;
        }

        .customer-auth-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          background: #FFFFFF;
        }

        .customer-alert {
          margin: 16px 24px 0;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .customer-alert.error {
          background: rgba(220, 38, 38, 0.08);
          border: 1px solid rgba(220, 38, 38, 0.25);
          color: #dc2626;
        }

        .customer-alert.success {
          background: rgba(22, 163, 74, 0.08);
          border: 1px solid rgba(22, 163, 74, 0.25);
          color: #15803d;
        }

        .customer-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 11.5px;
          font-weight: 600;
          color: #121212;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #707070;
          pointer-events: none;
        }

        .customer-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: #F9F7F2;
          border: 1.5px solid rgba(187, 165, 142, 0.35);
          border-radius: 10px;
          color: #121212;
          font-size: 14px;
          font-family: var(--font-body-family, sans-serif);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
        }

        .customer-input::placeholder {
          color: #999999;
        }

        .customer-input:focus {
          border-color: #121212;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(187, 165, 142, 0.2);
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: #707070;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: #121212;
        }

        .customer-submit-btn {
          margin-top: 6px;
          background: #121212;
          color: #F9F7F2;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 14px;
          border: 1.5px solid #121212;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(18, 18, 18, 0.15);
          transition: all 0.25s ease;
          font-family: var(--font-body-family, sans-serif);
        }

        .customer-submit-btn:hover:not(:disabled) {
          background: #BBA58E;
          border-color: #BBA58E;
          color: #121212;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(187, 165, 142, 0.35);
        }

        .customer-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-footer-switch {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: #707070;
          margin-top: 6px;
        }

        .link-btn {
          background: transparent;
          border: none;
          color: #121212;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
          padding: 0;
          transition: color 0.2s;
        }

        .link-btn:hover {
          color: #8A7258;
        }

        .customer-profile-view {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .customer-badge-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #F9F7F2;
          border: 1px solid rgba(187, 165, 142, 0.3);
          border-radius: 12px;
        }

        .customer-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #121212;
          color: #F9F7F2;
          font-size: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .customer-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #121212;
        }

        .customer-email {
          margin: 2px 0 6px;
          font-size: 12px;
          color: #707070;
        }

        .customer-tier-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: #8A7258;
          background: rgba(187, 165, 142, 0.15);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .profile-quick-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .stat-card {
          background: #F9F7F2;
          border: 1px solid rgba(187, 165, 142, 0.25);
          border-radius: 10px;
          padding: 14px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-num {
          font-size: 18px;
          font-weight: 700;
          color: #121212;
        }

        .stat-label {
          font-size: 11px;
          color: #707070;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .profile-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 4px;
        }

        .profile-action-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-action-btn.primary {
          background: #F9F7F2;
          border: 1.5px solid rgba(187, 165, 142, 0.4);
          color: #121212;
        }

        .profile-action-btn.primary:hover {
          background: #FFFFFF;
          border-color: #121212;
          transform: translateX(2px);
        }

        .profile-action-btn.danger {
          background: rgba(220, 38, 38, 0.06);
          border: 1px solid rgba(220, 38, 38, 0.2);
          color: #dc2626;
        }

        .profile-action-btn.danger:hover {
          background: rgba(220, 38, 38, 0.12);
        }

        .customer-orders-view {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .customer-empty-orders {
          text-align: center;
          padding: 32px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .empty-title {
          font-size: 16px;
          font-weight: 600;
          color: #121212;
          margin: 6px 0 0;
        }

        .empty-subtitle {
          font-size: 13px;
          color: #707070;
          max-width: 320px;
          line-height: 1.5;
          margin: 0;
        }

        .shop-now-btn {
          margin-top: 12px;
          background: #121212;
          color: #F9F7F2;
          font-size: 12px;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 8px;
          border: 1.5px solid #121212;
          cursor: pointer;
          transition: all 0.2s;
        }

        .shop-now-btn:hover {
          background: #BBA58E;
          border-color: #BBA58E;
          color: #121212;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .customer-order-card {
          background: #FFFFFF;
          border: 1px solid rgba(187, 165, 142, 0.25);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 10px rgba(18, 18, 18, 0.03);
        }

        .order-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(187, 165, 142, 0.15);
        }

        .order-id {
          font-size: 13px;
          font-weight: 700;
          color: #121212;
          display: block;
        }

        .order-date {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #707070;
        }

        .order-status-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .order-status-pill.pending {
          background: rgba(237, 137, 54, 0.12);
          color: #c05621;
          border: 1px solid rgba(237, 137, 54, 0.3);
        }

        .order-status-pill.shipped {
          background: rgba(66, 153, 225, 0.12);
          color: #2b6cb0;
          border: 1px solid rgba(66, 153, 225, 0.3);
        }

        .order-status-pill.delivered {
          background: rgba(72, 187, 120, 0.12);
          color: #276749;
          border: 1px solid rgba(72, 187, 120, 0.3);
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #404040;
        }

        .order-item-row {
          display: flex;
          justify-content: space-between;
        }

        .order-footer {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px dashed rgba(187, 165, 142, 0.25);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-total-label {
          font-size: 12px;
          color: #707070;
        }

        .order-total-val {
          font-size: 14px;
          font-weight: 700;
          color: #121212;
        }

        .customer-auth-footer {
          padding: 14px 20px;
          background: #F9F7F2;
          border-top: 1px solid rgba(187, 165, 142, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: #707070;
          flex-wrap: wrap;
          gap: 10px;
        }

        .firebase-status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #8A7258;
          font-weight: 600;
        }

        .admin-portal-link {
          color: #121212;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .admin-portal-link:hover {
          color: #8A7258;
          text-decoration: underline;
        }

        @keyframes overlayFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
