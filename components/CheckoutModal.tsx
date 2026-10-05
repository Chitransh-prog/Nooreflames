'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  QrCode,
  ArrowLeft,
  PackageCheck,
  Tag,
  MapPin,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { Order } from '@/lib/store';
import { calculateDeliveryDistance, ATELIER_ORIGIN } from '@/lib/shippingDistance';

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
    applyCoupon,
    removeCoupon,
    availableCoupons,
  } = useCart();

  const { customer, refreshCustomerOrders } = useCustomerAuth();

  const [checkoutCouponInput, setCheckoutCouponInput] = useState('');
  const [checkoutCouponFeedback, setCheckoutCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

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

  // Calculate live transit distance and partial COD advance from Delhi atelier
  const deliveryZone = useMemo(() => {
    return calculateDeliveryDistance(formData.pincode, total, formData.state);
  }, [formData.pincode, total, formData.state]);

  // Prefill customer name and email if logged in
  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || customer.displayName || '',
        email: prev.email || customer.email || '',
      }));
    }
  }, [customer]);

  // Pre-load Razorpay checkout script when modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      loadRazorpayScript();
    }
  }, [isCheckoutOpen]);

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

    const isPartialCod = formData.payment === 'Cash On Delivery';
    const amountToPayNow = isPartialCod ? deliveryZone.advanceAmount : total;

    const orderPayload = {
      customer: formData.name,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@customer.com`,
      phone: formData.phone,
      destination: `${formData.city}, ${formData.state || 'India'}`,
      address: formData.address,
      pincode: formData.pincode,
      amount: total,
      payment: isPartialCod ? 'Cash On Delivery (UPI Advance Paid)' : formData.payment,
      deliveryStatus: 'confirmed',
      paymentStatus: isPartialCod ? 'advance_paid' : 'paid',
      isPartialCod,
      advanceAmount: isPartialCod ? deliveryZone.advanceAmount : undefined,
      remainingCodAmount: isPartialCod ? deliveryZone.remainingCodAmount : 0,
      distanceKm: deliveryZone.distanceKm,
      zoneName: deliveryZone.zoneName,
      items: items.map(({ product, quantity }) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity,
        image: product.image,
      })),
    };

    // Both Full Prepaid and COD (with UPI Advance) use Razorpay secure gateway
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setErrorMsg('Razorpay payment gateway failed to load. Please check your network connection.');
        setIsSubmitting(false);
        return;
      }

      const createRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountToPayNow,
          currency: 'INR',
          receipt: `nf_${isPartialCod ? 'cod_adv' : 'rcpt'}_${Date.now()}`,
          notes: {
            customerName: formData.name,
            customerPhone: formData.phone,
            customerEmail: formData.email,
            paymentMode: isPartialCod ? 'partial_cod_advance' : 'prepaid_full',
            orderTotal: total,
            advanceAmount: isPartialCod ? deliveryZone.advanceAmount : total,
            remainingCodAmount: isPartialCod ? deliveryZone.remainingCodAmount : 0,
            distanceKm: deliveryZone.distanceKm,
            zoneName: deliveryZone.zoneName,
          },
        }),
      });

      const createData = await createRes.json();
      if (!createData.success || !createData.orderId) {
        setErrorMsg(createData.message || 'Unable to initialize Razorpay payment. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const razorpayKey =
        createData.keyId ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        'rzp_live_TiG51r1lqSUAZ6';

      const options = {
        key: razorpayKey,
        amount: createData.amount,
        currency: createData.currency || 'INR',
        name: 'NOOR-E-FLAMES',
        description: isPartialCod
          ? `COD Advance Booking (${deliveryZone.distanceKm} km transit to ${formData.city || deliveryZone.zoneName})`
          : 'Luxury Fragrance & Candle Order',
        image: '/images/hero/hero-stone-bottle.jpg',
        order_id: createData.orderId,
        handler: async function (response: any) {
          try {
            setIsSubmitting(true);
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderPayload,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success && verifyData.order) {
              setCompletedOrder(verifyData.order);
              clearCart();
              refreshCustomerOrders();
            } else {
              setErrorMsg(verifyData.message || 'Payment verification failed. Please contact atelier support.');
            }
          } catch (verifyErr: any) {
            setErrorMsg(verifyErr?.message || 'Error verifying Razorpay transaction.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email || '',
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
          orderType: isPartialCod ? 'COD with UPI Advance' : 'Prepaid Full',
        },
        theme: {
          color: '#121212',
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (failureResponse: any) {
        setErrorMsg(
          failureResponse?.error?.description || 'Payment was declined or failed by bank/gateway.'
        );
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred while launching Razorpay.');
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
              {completedOrder.razorpayPaymentId && (
                <div className="receipt-row">
                  <span className="receipt-label">UPI / Gateway Ref:</span>
                  <span className="receipt-value font-mono order-id-pill">
                    {completedOrder.razorpayPaymentId}
                  </span>
                </div>
              )}

              {completedOrder.distanceKm && (
                <div className="receipt-row">
                  <span className="receipt-label">Transit Route:</span>
                  <span className="receipt-value">
                    {completedOrder.distanceKm} km ({completedOrder.zoneName || 'Express Zone'})
                  </span>
                </div>
              )}

              {completedOrder.isPartialCod ? (
                <>
                  <div className="receipt-row">
                    <span className="receipt-label">Order Total Value:</span>
                    <span className="receipt-value font-serif">
                      ₹{completedOrder.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="receipt-row">
                    <span className="receipt-label" style={{ color: '#15803d', fontWeight: 600 }}>
                      Advance Paid via UPI:
                    </span>
                    <span className="receipt-value" style={{ color: '#15803d', fontWeight: 700 }}>
                      ₹{(completedOrder.advanceAmount ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="receipt-row total-row" style={{ background: '#fef3c7', padding: '10px 12px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <span className="receipt-label" style={{ color: '#92400e', fontWeight: 700 }}>
                      Collect on Delivery (Cash):
                    </span>
                    <span className="receipt-value font-serif highlight" style={{ color: '#b45309', fontSize: '18px' }}>
                      ₹{(completedOrder.remainingCodAmount ?? (completedOrder.amount - (completedOrder.advanceAmount ?? 0))).toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              ) : (
                <div className="receipt-row total-row">
                  <span className="receipt-label">Total Paid Online:</span>
                  <span className="receipt-value font-serif highlight">
                    ₹{completedOrder.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {completedOrder.isPartialCod && (
              <div
                style={{
                  maxWidth: '520px',
                  margin: '0 auto 18px',
                  background: '#fefce8',
                  border: '1px solid #fef08a',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '12px',
                  color: '#713f12',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left',
                }}
              >
                <Banknote size={24} color="#ca8a04" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Cash Collection Reminder:</strong> Please keep exact change of{' '}
                  <strong>₹{(completedOrder.remainingCodAmount ?? (completedOrder.amount - (completedOrder.advanceAmount ?? 0))).toLocaleString('en-IN')}</strong>{' '}
                  ready for the courier executive at the time of delivery.
                </div>
              </div>
            )}

            <div className="delivery-timeline-note">
              <Truck size={18} color="#BBA58E" />
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
                      maxLength={6}
                      placeholder="400050"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Live Distance Tracking Badge from Delhi Atelier */}
                {formData.pincode && formData.pincode.replace(/\D/g, '').length >= 2 && (
                  <div className="pincode-distance-tracker">
                    <div className="tracker-badge">
                      <MapPin size={14} color="#8A7258" />
                      <span>
                        Route from Delhi Atelier (110043): <strong>{deliveryZone.distanceKm} km</strong> ({deliveryZone.zoneName})
                      </span>
                    </div>
                    <div className="tracker-eta">
                      <Clock size={12} />
                      <span>Est. Transit: {deliveryZone.estimatedDays}</span>
                    </div>
                  </div>
                )}

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
                      <strong>Instant UPI / QR (Razorpay)</strong>
                      <span>GPay, PhonePe, Paytm, BHIM</span>
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
                      <strong>Cards & Netbanking (Razorpay)</strong>
                      <span>Visa, Mastercard, RuPay, Netbanking</span>
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
                      <Banknote size={20} color="#d97706" />
                    </div>
                    <div className="payment-label" style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                        <strong>Cash On Delivery (Partial UPI Advance)</strong>
                        <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                          Pay ₹{deliveryZone.advanceAmount.toLocaleString('en-IN')} via UPI
                        </span>
                      </div>
                      <span>
                        Distance advance ₹{deliveryZone.advanceAmount.toLocaleString('en-IN')} via UPI · Pay balance ₹{deliveryZone.remainingCodAmount.toLocaleString('en-IN')} in cash on arrival
                      </span>
                    </div>
                  </label>
                </div>

                {formData.payment === 'Cash On Delivery' && (
                  <div className="cod-advance-info-box">
                    <div className="cod-advance-header">
                      <Info size={16} />
                      <span>Cash on Delivery Verification & Distance Adjustment</span>
                    </div>
                    <div>
                      To activate Cash on Delivery and verify transit to <strong>{formData.city || deliveryZone.zoneName}</strong> ({deliveryZone.distanceKm} km from Delhi Atelier), a distance-calibrated commitment advance of <strong>₹{deliveryZone.advanceAmount.toLocaleString('en-IN')}</strong> is paid upfront via UPI.
                    </div>
                    <div className="cod-metrics-grid">
                      <div className="cod-metric-item success">
                        <span>Advance Paid via UPI</span>
                        <span>₹{deliveryZone.advanceAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="cod-metric-item highlight">
                        <span>Pay to Courier (Cash)</span>
                        <span>₹{deliveryZone.remainingCodAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="cod-policy-note">
                      <Sparkles size={14} color="#8A7258" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>
                        The advance amount is deducted immediately from your total order value. The courier will collect only the remaining ₹{deliveryZone.remainingCodAmount.toLocaleString('en-IN')}.
                      </span>
                    </div>
                  </div>
                )}
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

              {/* Coupon Section in Checkout */}
              <div className="checkout-coupon-section" style={{ margin: '14px 0' }}>
                {appliedCoupon ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '12px', color: '#166534' }}>
                          🏷️ {appliedCoupon.code}
                        </span>
                        <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>
                          (-₹{discountAmount.toLocaleString('en-IN')})
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#15803d', marginTop: '2px' }}>
                        {appliedCoupon.description}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeCoupon();
                        setCheckoutCouponFeedback(null);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#166534',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Remove coupon"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <input
                        type="text"
                        placeholder="Discount Code"
                        value={checkoutCouponInput}
                        onChange={(e) => setCheckoutCouponInput(e.target.value.toUpperCase())}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 32px',
                          border: '1px solid #DCD3C5',
                          borderRadius: '6px',
                          fontSize: '12.5px',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          outline: 'none',
                        }}
                      />
                      <Tag size={14} color="#8A7258" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!checkoutCouponInput.trim()) return;
                        const res = applyCoupon(checkoutCouponInput);
                        setCheckoutCouponFeedback({
                          success: res.success,
                          message: res.message,
                        });
                        if (res.success) setCheckoutCouponInput('');
                      }}
                      style={{
                        padding: '9px 16px',
                        background: '#121212',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        letterSpacing: '0.06em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      APPLY
                    </button>
                  </div>
                )}

                {checkoutCouponFeedback && (
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '11px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: checkoutCouponFeedback.success ? '#f0fdf4' : '#fef2f2',
                      color: checkoutCouponFeedback.success ? '#166534' : '#991b1b',
                      border: `1px solid ${checkoutCouponFeedback.success ? '#bbf7d0' : '#fecaca'}`,
                    }}
                  >
                    {checkoutCouponFeedback.message}
                  </div>
                )}

                {/* Available Offers Quick Select */}
                {!appliedCoupon && availableCoupons.filter((c) => c.isActive).length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {availableCoupons.filter((c) => c.isActive).slice(0, 3).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          const res = applyCoupon(c.code);
                          setCheckoutCouponFeedback({
                            success: res.success,
                            message: res.message,
                          });
                        }}
                        style={{
                          background: '#FAF8F5',
                          border: '1px dashed #BBA58E',
                          borderRadius: '12px',
                          padding: '3px 8px',
                          fontSize: '10px',
                          fontWeight: 600,
                          color: '#8A7258',
                          cursor: 'pointer',
                        }}
                      >
                        🏷️ {c.code} ({c.discountPercent > 0 ? `${c.discountPercent}%` : c.fixedPrice ? `2 for ₹${c.fixedPrice}` : 'FREE SHIP'})
                      </button>
                    ))}
                  </div>
                )}
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

                {formData.payment === 'Cash On Delivery' && (
                  <div
                    style={{
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      marginTop: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#15803d' }}>
                      <span>Advance via UPI (Pay Now):</span>
                      <strong>₹{deliveryZone.advanceAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b45309', fontWeight: 600 }}>
                      <span>Balance on Delivery (Cash):</span>
                      <strong>₹{deliveryZone.remainingCodAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="btn-complete-order"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'PROCESSING ORDER...'
                  : formData.payment === 'Cash On Delivery'
                  ? `PAY ₹${deliveryZone.advanceAmount.toLocaleString('en-IN')} VIA UPI TO CONFIRM COD`
                  : `PAY ₹${total.toLocaleString('en-IN')} VIA RAZORPAY`}
              </button>

              {formData.payment === 'Cash On Delivery' && (
                <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#8A7258', fontWeight: 500 }}>
                  Remaining balance of ₹{deliveryZone.remainingCodAmount.toLocaleString('en-IN')} will be collected in cash upon delivery.
                </div>
              )}

              <div className="checkout-guarantee">
                <ShieldCheck size={16} color="#BBA58E" />
                <span>100% Secure 256-Bit Encryption • Powered by Razorpay</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
