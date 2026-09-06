'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, Tag, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    itemCount,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback({
      success: res.success,
      message: res.message,
    });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Free delivery threshold indicator (e.g. ₹999)
  const freeThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const diffToFree = Math.max(0, freeThreshold - subtotal);

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-row">
            <h2 className="font-serif">Shopping Bag</h2>
            <span className="cart-item-count-pill">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="cart-close-btn"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="free-shipping-bar-wrap">
          <div className="free-shipping-label">
            {diffToFree === 0 ? (
              <span className="free-achieved">
                <CheckCircle2 size={14} /> You unlocked <strong>FREE Express Delivery!</strong>
              </span>
            ) : (
              <span>
                Add <strong>₹{diffToFree.toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong>
              </span>
            )}
          </div>
          <div className="free-shipping-track">
            <div
              className="free-shipping-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="cart-items-list">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={48} color="#666" style={{ marginBottom: '12px', opacity: 0.5 }} />
              <h3 className="font-serif">Your bag is empty</h3>
              <p>Explore our handcrafted soy candles and pure botanical EDPs.</p>
              <button className="btn-shop-now" onClick={() => setIsCartOpen(false)}>
                EXPLORE CATALOG
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="cart-item-row">
                <Link
                  href={`/product/${product.id}`}
                  onClick={() => setIsCartOpen(false)}
                  className="cart-item-img-wrapper"
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <img src={product.image} alt={product.title} />
                </Link>
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <Link
                      href={`/product/${product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <h4 className="cart-item-title font-serif">{product.title}</h4>
                    </Link>
                    <button
                      className="cart-item-remove-btn"
                      onClick={() => removeFromCart(product.id)}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="cart-item-subtitle">{product.subtitle}</div>
                  <div className="cart-item-bottom">
                    <div className="cart-qty-stepper">
                      <button onClick={() => updateQuantity(product.id, -1)} aria-label="Decrease">
                        <Minus size={13} />
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, 1)} aria-label="Increase">
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="cart-item-price">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Summary & Checkout */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="cart-coupon-form">
              <div className="coupon-input-group">
                <Tag size={16} color="#999" />
                <input
                  type="text"
                  placeholder="Discount Code (e.g. NOOR20)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button type="submit" className="btn-apply-coupon">
                  APPLY
                </button>
              </div>
            </form>

            {couponFeedback && (
              <div className={`coupon-feedback ${couponFeedback.success ? 'success' : 'error'}`}>
                {couponFeedback.message}
              </div>
            )}

            {appliedCoupon && (
              <div className="applied-coupon-tag">
                <span className="coupon-code-label">🏷️ {appliedCoupon.code}</span>
                <span className="coupon-desc-label">({appliedCoupon.description})</span>
                <button onClick={removeCoupon} className="btn-remove-coupon">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="cart-breakdown">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="breakdown-row discount">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="breakdown-row">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <strong style={{ color: '#22c55e' }}>FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div className="breakdown-row total">
                <span>Estimated Total</span>
                <span className="total-amount font-serif">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              className="btn-checkout-primary"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={18} />
            </button>

            <div className="cart-security-badge">
              <ShieldCheck size={14} color="#c9935a" />
              <span>Authentic Handcrafted Blends • 100% Secure Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
