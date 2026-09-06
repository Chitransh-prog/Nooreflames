'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, QrCode, ArrowLeft, PackageCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Order } from '@/lib/store';

export default function CheckoutModal() {
  const {
    items,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedCoupon,
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    payment: 'Prepaid (UPI)',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCheckoutOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      setErrorMsg('Please fill in all mandatory delivery address fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: formData.name,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@customer.com`,
        phone: formData.phone,
        destination: `${formData.city}, ${formData.state || 'India'}`,
        address: formData.address,
        pincode: formData.pincode,
        amount: total,
        payment: formData.payment,
        deliveryStatus: 'confirmed',
        items: items.map(({ product, quantity }) => ({
          id: product.id,
          title: product.title,
          price: product.price,
          quantity,
          image: product.image,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCompletedOrder(data.order);
        clearCart();
      } else {
        setErrorMsg(data.message || 'Failed to process order. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network error while placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  return (
    <div className="checkout-modal-backdrop" onClick={handleClose}>
      <div className="checkout-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-modal-close" onClick={handleClose}>
          <X size={22} />
        </button>

        {completedOrder ? (
          /* Order Confirmation Screen */
          <div className="order-success-card">
            <div className="success-icon-badge">
              <PackageCheck size={48} color="#22c55e" />
            </div>
            <h2 className="success-title font-serif">Thank You for Your Order!</h2>
            <p className="success-subtitle">
              Your artisanal Noor-e-Flames order has been confirmed and forwarded to our studio.
            </p>

            <div className="order-receipt-box">
              <div className="receipt-row">
                <span className="receipt-label">Order Reference:</span>
                <span className="receipt-value font-mono order-id-pill">{completedOrder.id}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Recipient:</span>
                <span className="receipt-value">{completedOrder.customer}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Delivery Address:</span>
                <span className="receipt-value">
                  {completedOrder.address}, {completedOrder.destination} - {completedOrder.pincode}
                </span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Payment Mode:</span>
                <span className="receipt-value">{completedOrder.payment}</span>
              </div>
              <div className="receipt-row total-row">
                <span className="receipt-label">Total Paid:</span>
                <span className="receipt-value font-serif highlight">
                  ₹{completedOrder.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="delivery-timeline-note">
              <Truck size={18} color="#c9935a" />
              <span>
                Estimated dispatch in 24 hours. Track status anytime in the customer portal or admin dashboard.
              </span>
            </div>

            <button className="btn-continue-shopping" onClick={handleClose}>
              CONTINUE EXPLORING
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div className="checkout-content-grid">
            {/* Left: Customer & Delivery Details */}
            <div className="checkout-form-col">
              <div className="checkout-step-title font-serif">
                <span>1. Shipping Destination</span>
              </div>

              <form onSubmit={handleSubmit} id="checkout-form">
                {errorMsg && <div className="checkout-error-banner">{errorMsg}</div>}

                <div className="form-group-row">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com (for order tracking)"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label>Complete Street Address / Apartment *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="House/Flat No., Street, Landmark"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group-row three-col">
                  <div className="form-field">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <label>PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="400050"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Step 2: Payment Mode */}
                <div className="checkout-step-title font-serif" style={{ marginTop: '24px' }}>
                  <span>2. Payment Option</span>
                </div>

                <div className="payment-options-grid">
                  <label
                    className={`payment-option-card ${formData.payment === 'Prepaid (UPI)' ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="Prepaid (UPI)"
                      checked={formData.payment === 'Prepaid (UPI)'}
                      onChange={handleChange}
                    />
                    <div className="payment-icon">
                      <QrCode size={20} color="#22c55e" />
                    </div>
                    <div className="payment-label">
                      <strong>Instant UPI / QR</strong>
                      <span>GPay, PhonePe, Paytm</span>
                    </div>
                  </label>

                  <label
                    className={`payment-option-card ${formData.payment === 'Prepaid (Card)' ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="Prepaid (Card)"
                      checked={formData.payment === 'Prepaid (Card)'}
                      onChange={handleChange}
                    />
                    <div className="payment-icon">
                      <CreditCard size={20} color="#3b82f6" />
                    </div>
                    <div className="payment-label">
                      <strong>Cards & Netbanking</strong>
                      <span>Visa, Mastercard, RuPay</span>
                    </div>
                  </label>

                  <label
                    className={`payment-option-card ${formData.payment === 'Cash On Delivery' ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="Cash On Delivery"
                      checked={formData.payment === 'Cash On Delivery'}
                      onChange={handleChange}
                    />
                    <div className="payment-icon">
                      <Banknote size={20} color="#eab308" />
                    </div>
                    <div className="payment-label">
                      <strong>Cash On Delivery</strong>
                      <span>Pay in cash upon arrival</span>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="checkout-summary-col">
              <h3 className="summary-title font-serif">Order Summary</h3>

              <div className="checkout-items-preview">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="checkout-preview-item">
                    <img src={product.image} alt={product.title} />
                    <div className="preview-item-info">
                      <div className="preview-item-name">{product.title}</div>
                      <div className="preview-item-qty">Qty: {quantity}</div>
                    </div>
                    <div className="preview-item-price">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-totals-box">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="total-row discount">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="total-row">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong style={{ color: '#22c55e' }}>FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Grand Total</span>
                  <span className="font-serif amount">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="btn-complete-order"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'PROCESSING ORDER...' : `CONFIRM & PLACE ORDER — ₹${total.toLocaleString('en-IN')}`}
              </button>

              <div className="checkout-guarantee">
                <ShieldCheck size={16} color="#c9935a" />
                <span>100% Satisfaction Guarantee • Hand-crafted Quality Assurance</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
