'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Coupon } from '@/lib/store';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  refreshCoupons: () => Promise<void>;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  itemCount: number;
  availableCoupons: Coupon[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  coupons = [],
}: {
  children: React.ReactNode;
  coupons?: Coupon[];
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>(
    Array.isArray(coupons) && coupons.length > 0 ? coupons : []
  );

  // Sync with incoming coupons prop
  useEffect(() => {
    if (Array.isArray(coupons) && coupons.length > 0) {
      setAvailableCoupons(coupons);
    }
  }, [coupons]);

  // Synchronize available coupons from live API to ensure newly created or edited coupons work immediately
  const refreshCoupons = async () => {
    try {
      const res = await fetch('/api/store', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.coupons) && data.coupons.length > 0) {
          setAvailableCoupons(data.coupons);
        }
      }
    } catch (e) {
      console.warn('Failed to refresh coupons in cart:', e);
    }
  };

  useEffect(() => {
    refreshCoupons();
    const handleUpdate = () => {
      refreshCoupons();
    };
    window.addEventListener('noor_coupons_updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    return () => {
      window.removeEventListener('noor_coupons_updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('noor_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('noor_coupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('noor_cart', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('noor_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('noor_coupon');
      }
    } catch (e) {}
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter a coupon code.' };
    }
    const cleanCode = code.trim().toUpperCase();
    const found = availableCoupons.find(
      (c) => c.code.toUpperCase() === cleanCode && c.isActive
    );

    if (!found) {
      return { success: false, message: `Coupon "${cleanCode}" is invalid or expired.` };
    }

    if (subtotal < found.minOrder) {
      return {
        success: false,
        message: `Coupon ${found.code} requires a minimum order of ₹${found.minOrder.toLocaleString('en-IN')}.`,
      };
    }

    if (cleanCode === 'DUO1499' && itemCount < 2) {
      return {
        success: false,
        message: 'DUO1499 requires at least 2 flacons or items in your bag.',
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon ${found.code} applied! (${found.description})`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= (appliedCoupon.minOrder || 0)) {
    if (appliedCoupon.fixedPrice && subtotal >= appliedCoupon.fixedPrice) {
      // Fixed bundle pricing e.g. DUO1499
      discountAmount = Math.max(0, subtotal - appliedCoupon.fixedPrice);
    } else if (appliedCoupon.discountAmount && appliedCoupon.discountAmount > 0) {
      // Fixed rupee discount
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    } else if (appliedCoupon.discountPercent > 0) {
      // Percentage discount
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    }
  }

  // Shipping is free if subtotal >= 999 or coupon has freeShipping
  const shippingFee =
    subtotal >= 999 || appliedCoupon?.freeShipping || items.length === 0 ? 0 : 99;

  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        refreshCoupons,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        itemCount,
        availableCoupons,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
