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
          background: rgba(10, 16, 14, 0.78);
          backdrop-filter: blur(8px);
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
          background: #141414;
          border: 1px solid rgba(187, 165, 142, 0.35);
          border-radius: 18px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05);
          color: #ffffff;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }

        .customer-auth-top {
          padding: 24px 24px 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .customer-auth-kicker {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #BBA58E;
          display: block;
          margin-bottom: 4px;
        }

        .customer-auth-title {
          font-family: var(--font-serif, Georgia, serif);
          font-size: 22px;
          font-weight: 500;
          color: #f7ede2;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .customer-auth-close {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .customer-auth-close:hover {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          transform: scale(1.05);
        }

        .customer-auth-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.18);
        }

        .customer-tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: #a0aec0;
          padding: 13px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .customer-tab-btn.active {
          color: #BBA58E;
          border-bottom-color: #BBA58E;
          background: rgba(187, 165, 142, 0.06);
        }

        .customer-auth-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
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
          background: rgba(229, 62, 62, 0.15);
          border: 1px solid rgba(229, 62, 62, 0.4);
          color: #feb2b2;
        }

        .customer-alert.success {
          background: rgba(56, 161, 105, 0.15);
          border: 1px solid rgba(56, 161, 105, 0.4);
          color: #9ae6b4;
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
          font-size: 12px;
          font-weight: 600;
          color: #e2e8f0;
          letter-spacing: 0.02em;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #718096;
          pointer-events: none;
        }

        .customer-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: rgba(10, 16, 14, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 10px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .customer-input:focus {
          border-color: #BBA58E;
          box-shadow: 0 0 0 3px rgba(187, 165, 142, 0.2);
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: #718096;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .password-toggle:hover {
          color: #e2e8f0;
        }

        .customer-submit-btn {
          margin-top: 6px;
          background: linear-gradient(135deg, #BBA58E 0%, #a8927b 100%);
          color: #121212;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 13px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(187, 165, 142, 0.3);
          transition: all 0.2s;
        }

        .customer-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(187, 165, 142, 0.45);
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
          color: #a0aec0;
          margin-top: 4px;
        }

        .link-btn {
          background: transparent;
          border: none;
          color: #BBA58E;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
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
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(187, 165, 142, 0.25);
          border-radius: 12px;
        }

        .customer-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #BBA58E, #a8927b);
          color: #121212;
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
          color: #ffffff;
        }

        .customer-email {
          margin: 2px 0 6px;
          font-size: 12px;
          color: #a0aec0;
        }

        .customer-tier-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: #BBA58E;
          background: rgba(187, 165, 142, 0.12);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .profile-quick-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .stat-card {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.08);
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
          color: #BBA58E;
        }

        .stat-label {
          font-size: 11px;
          color: #a0aec0;
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
          background: rgba(187, 165, 142, 0.15);
          border: 1px solid rgba(187, 165, 142, 0.4);
          color: #BBA58E;
        }

        .profile-action-btn.primary:hover {
          background: rgba(187, 165, 142, 0.25);
          transform: translateX(2px);
        }

        .profile-action-btn.danger {
          background: rgba(229, 62, 62, 0.1);
          border: 1px solid rgba(229, 62, 62, 0.25);
          color: #feb2b2;
        }

        .profile-action-btn.danger:hover {
          background: rgba(229, 62, 62, 0.2);
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
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          margin: 6px 0 0;
        }

        .empty-subtitle {
          font-size: 12px;
          color: #a0aec0;
          max-width: 320px;
          line-height: 1.5;
          margin: 0;
        }

        .shop-now-btn {
          margin-top: 12px;
          background: #BBA58E;
          color: #121212;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .customer-order-card {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px;
        }

        .order-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .order-id {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          display: block;
        }

        .order-date {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #718096;
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
          background: rgba(237, 137, 54, 0.15);
          color: #fbd38d;
          border: 1px solid rgba(237, 137, 54, 0.3);
        }

        .order-status-pill.shipped {
          background: rgba(66, 153, 225, 0.15);
          color: #bee3f8;
          border: 1px solid rgba(66, 153, 225, 0.3);
        }

        .order-status-pill.delivered {
          background: rgba(72, 187, 120, 0.15);
          color: #9ae6b4;
          border: 1px solid rgba(72, 187, 120, 0.3);
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #cbd5e0;
        }

        .order-item-row {
          display: flex;
          justify-content: space-between;
        }

        .order-footer {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px dashed rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-total-label {
          font-size: 12px;
          color: #a0aec0;
        }

        .order-total-val {
          font-size: 14px;
          font-weight: 700;
          color: #BBA58E;
        }

        .customer-auth-footer {
          padding: 14px 20px;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: #a0aec0;
          flex-wrap: wrap;
          gap: 10px;
        }

        .firebase-status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #BBA58E;
          font-weight: 500;
        }

        .admin-portal-link {
          color: #cbd5e0;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .admin-portal-link:hover {
          color: #BBA58E;
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
