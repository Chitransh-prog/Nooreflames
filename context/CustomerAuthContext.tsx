'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  auth,
  isFirebaseConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  FirebaseUser,
} from '@/lib/firebase';
import { Order } from '@/lib/store';

export interface CustomerUser {
  uid: string;
  email: string;
  displayName: string;
  createdAt?: string;
}

export type AuthModalTab = 'signin' | 'signup' | 'orders' | 'profile';

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  isLoading: boolean;
  isFirebaseLive: boolean;
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  customerOrders: Order[];
  openAuthModal: (tab?: AuthModalTab) => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: AuthModalTab) => void;
  signInCustomer: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpCustomer: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOutCustomer: () => Promise<void>;
  refreshCustomerOrders: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

const DEMO_CUSTOMERS_KEY = 'nf_demo_customers';
const CURRENT_CUSTOMER_KEY = 'nf_current_customer';

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('signin');
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  // Fetch orders associated with customer email
  const refreshCustomerOrders = useCallback(async () => {
    if (!customer?.email) {
      setCustomerOrders([]);
      return;
    }

    try {
      const res = await fetch('/api/store');
      if (res.ok) {
        const data = await res.json();
        const allOrders: any[] = data?.orders || [];
        const userOrders = allOrders.filter(
          (o) =>
            (o.email && o.email.toLowerCase() === customer.email.toLowerCase()) ||
            (o.customerEmail && o.customerEmail.toLowerCase() === customer.email.toLowerCase())
        );
        setCustomerOrders(userOrders);
      }
    } catch (err) {
      console.error('Failed to load customer orders:', err);
    }
  }, [customer?.email]);

  // Sync customer state on mount
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      // Live Firebase Auth Listener
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser && fbUser.email) {
          setCustomer({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email.split('@')[0],
          });
        } else {
          setCustomer(null);
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Local demo fallback if Firebase env keys not yet filled
      try {
        const stored = localStorage.getItem(CURRENT_CUSTOMER_KEY);
        if (stored) {
          setCustomer(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Could not read demo customer from localStorage', e);
      }
      setIsLoading(false);
    }
  }, []);

  // Whenever customer changes, fetch orders
  useEffect(() => {
    if (customer?.email) {
      refreshCustomerOrders();
    } else {
      setCustomerOrders([]);
    }
  }, [customer, refreshCustomerOrders]);

  const openAuthModal = (tab: AuthModalTab = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Customer Sign In
  const signInCustomer = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    // Prevent customer login using admin email
    if (trimmedEmail === 'nooreflamesadmin@gmail.com') {
      return {
        success: false,
        error: 'This email is reserved for the Admin Commerce Hub. Please use the Admin Portal login.',
      };
    }

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        const fbUser = userCredential.user;
        setCustomer({
          uid: fbUser.uid,
          email: fbUser.email || trimmedEmail,
          displayName: fbUser.displayName || trimmedEmail.split('@')[0],
        });
        return { success: true };
      } catch (err: any) {
        let errorMsg = 'Failed to sign in. Please verify credentials.';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          errorMsg = 'Invalid email or password.';
        } else if (err.code === 'auth/too-many-requests') {
          errorMsg = 'Too many attempts. Please try again later.';
        }
        return { success: false, error: errorMsg };
      }
    } else {
      // Demo Account mode
      try {
        const rawUsers = localStorage.getItem(DEMO_CUSTOMERS_KEY);
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        const existing = users.find((u: any) => u.email.toLowerCase() === trimmedEmail);

        if (existing) {
          if (existing.password !== password) {
            return { success: false, error: 'Incorrect password.' };
          }
          const activeUser: CustomerUser = {
            uid: existing.uid,
            email: existing.email,
            displayName: existing.displayName,
            createdAt: existing.createdAt,
          };
          localStorage.setItem(CURRENT_CUSTOMER_KEY, JSON.stringify(activeUser));
          setCustomer(activeUser);
          return { success: true };
        } else {
          // Allow instant sign-in for demo convenience
          const newUser: CustomerUser = {
            uid: 'cust-' + Date.now(),
            email: trimmedEmail,
            displayName: trimmedEmail.split('@')[0],
            createdAt: new Date().toISOString(),
          };
          users.push({ ...newUser, password });
          localStorage.setItem(DEMO_CUSTOMERS_KEY, JSON.stringify(users));
          localStorage.setItem(CURRENT_CUSTOMER_KEY, JSON.stringify(newUser));
          setCustomer(newUser);
          return { success: true };
        }
      } catch {
        return { success: false, error: 'Failed to access storage.' };
      }
    }
  };

  // Customer Sign Up
  const signUpCustomer = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || trimmedEmail.split('@')[0];

    // Prevent signing up with admin email
    if (trimmedEmail === 'nooreflamesadmin@gmail.com') {
      return {
        success: false,
        error: 'This email is reserved for the Admin Commerce Hub.',
      };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        await updateProfile(userCredential.user, { displayName: cleanName });
        setCustomer({
          uid: userCredential.user.uid,
          email: trimmedEmail,
          displayName: cleanName,
        });
        return { success: true };
      } catch (err: any) {
        let msg = 'Failed to create account.';
        if (err.code === 'auth/email-already-in-use') {
          msg = 'An account with this email already exists. Please sign in.';
        } else if (err.code === 'auth/invalid-email') {
          msg = 'Please enter a valid email address.';
        } else if (err.code === 'auth/weak-password') {
          msg = 'Password should be at least 6 characters.';
        }
        return { success: false, error: msg };
      }
    } else {
      // Demo Account mode
      try {
        const rawUsers = localStorage.getItem(DEMO_CUSTOMERS_KEY);
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        const existing = users.find((u: any) => u.email.toLowerCase() === trimmedEmail);

        if (existing) {
          return { success: false, error: 'An account with this email already exists.' };
        }

        const newUser: CustomerUser = {
          uid: 'cust-' + Date.now(),
          email: trimmedEmail,
          displayName: cleanName,
          createdAt: new Date().toISOString(),
        };

        users.push({ ...newUser, password });
        localStorage.setItem(DEMO_CUSTOMERS_KEY, JSON.stringify(users));
        localStorage.setItem(CURRENT_CUSTOMER_KEY, JSON.stringify(newUser));
        setCustomer(newUser);
        return { success: true };
      } catch {
        return { success: false, error: 'Failed to create demo account.' };
      }
    }
  };

  // Customer Sign Out
  const signOutCustomer = async (): Promise<void> => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Sign out error:', err);
      }
    } else {
      try {
        localStorage.removeItem(CURRENT_CUSTOMER_KEY);
      } catch (e) {
        console.warn('Could not clear customer storage', e);
      }
    }
    setCustomer(null);
    setCustomerOrders([]);
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoading,
        isFirebaseLive: isFirebaseConfigured,
        isAuthModalOpen,
        authModalTab,
        customerOrders,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        signInCustomer,
        signUpCustomer,
        signOutCustomer,
        refreshCustomerOrders,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return ctx;
}
