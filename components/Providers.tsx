'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { VisualEditProvider } from '@/context/VisualEditContext';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
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
      <CartProvider coupons={coupons}>
        {children}
        <CartDrawer />
        <CheckoutModal />
        <VisualEditToolbar />
        <MediaPickerModal />
      </CartProvider>
    </VisualEditProvider>
  );
}
