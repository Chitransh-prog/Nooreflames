'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { VisualEditProvider } from '@/context/VisualEditContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import CustomerAuthModal from './auth/CustomerAuthModal';
import VisualEditToolbar from './visual-edit/VisualEditToolbar';
import { MediaPickerModal } from './visual-edit/EditableElements';
import { Coupon } from '@/lib/store';

export default function Providers({
  children,
  coupons = [],
}: {
  children: React.ReactNode;
  coupons?: Coupon[];
}) {
  return (
    <VisualEditProvider>
      <CustomerAuthProvider>
        <CartProvider coupons={coupons}>
          {children}
          <CartDrawer />
          <CheckoutModal />
          <CustomerAuthModal />
          <VisualEditToolbar />
          <MediaPickerModal />
        </CartProvider>
      </CustomerAuthProvider>
    </VisualEditProvider>
  );
}
