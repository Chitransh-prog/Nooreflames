'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { StoreData, Product } from '@/lib/store';

interface MediaPickerOptions {
  type: 'image' | 'video';
  currentUrl: string;
  label: string;
  onSave: (newUrl: string) => void;
}

interface VisualEditContextType {
  isAdminAuthenticated: boolean;
  checkAdminStatus: () => Promise<boolean>;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  toggleEditing: () => void;
  storeData: StoreData | null;
  hasChanges: boolean;
  changesCount: number;
  updateField: (path: string, value: any) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  saveChanges: () => Promise<boolean>;
  discardChanges: () => void;
  mediaModal: MediaPickerOptions | null;
  openMediaPicker: (opts: MediaPickerOptions) => void;
  closeMediaPicker: () => void;
  toastMessage: string | null;
}

const VisualEditContext = createContext<VisualEditContextType | null>(null);

export function VisualEditProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [originalStoreData, setOriginalStoreData] = useState<StoreData | null>(null);
  const [changesCount, setChangesCount] = useState<number>(0);
  const [mediaModal, setMediaModal] = useState<MediaPickerOptions | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check admin authentication status via JWT session API with fresh no-store guarantee
  const checkAdminStatus = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/me', {
        cache: 'no-store',
        headers: {
          pragma: 'no-cache',
          'cache-control': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.authenticated) {
          setIsAdminAuthenticated(true);
          return true;
        }
      }
      setIsAdminAuthenticated(false);
      setIsEditing(false);
      return false;
    } catch {
      setIsAdminAuthenticated(false);
      setIsEditing(false);
      return false;
    }
  }, []);

  // Load initial store data on mount
  useEffect(() => {
    fetch('/api/store', {
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    })
      .then((res) => res.json())
      .then((data: StoreData) => {
        setStoreData(data);
        setOriginalStoreData(JSON.parse(JSON.stringify(data)));
      })
      .catch((err) => console.error('Failed to load store for visual edit:', err));
  }, []);

  // Check admin session on route changes and activate ?visualEdit=true if authorized
  useEffect(() => {
    let isMounted = true;
    checkAdminStatus().then((isAuthed) => {
      if (!isMounted) return;
      if (isAuthed && typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('visualEdit') === 'true') {
          setIsEditing(true);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [pathname, checkAdminStatus]);

  // Re-verify admin session when window gains focus or visibility returns
  useEffect(() => {
    const handleRecheck = () => {
      checkAdminStatus();
    };

    window.addEventListener('focus', handleRecheck);
    window.addEventListener('visibilitychange', handleRecheck);

    return () => {
      window.removeEventListener('focus', handleRecheck);
      window.removeEventListener('visibilitychange', handleRecheck);
    };
  }, [checkAdminStatus]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Helper to set nested value by path e.g. "hero.headline" or "siteSettings.announcements.0"
  const updateField = useCallback((path: string, value: any) => {
    setStoreData((prev) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let curr = clone;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (curr[key] === undefined || curr[key] === null) {
          curr[key] = {};
        }
        curr = curr[key];
      }
      curr[parts[parts.length - 1]] = value;
      return clone;
    });
    setChangesCount((c) => c + 1);
  }, []);

  // Update a specific product by ID
  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setStoreData((prev) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      const idx = clone.products.findIndex((p: Product) => p.id === productId);
      if (idx !== -1) {
        clone.products[idx] = { ...clone.products[idx], ...updates };
      }
      return clone;
    });
    setChangesCount((c) => c + 1);
  }, []);

  // Save changes to /api/store (Admin only)
  const saveChanges = async (): Promise<boolean> => {
    if (!isAdminAuthenticated) {
      showToast('🔒 Admin authentication required to save changes.');
      return false;
    }
    if (!storeData) return false;
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(storeData),
      });
      if (res.ok) {
        setOriginalStoreData(JSON.parse(JSON.stringify(storeData)));
        setChangesCount(0);
        showToast('✓ All changes saved to Live Store Database!');
        return true;
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(`✗ Error saving: ${errData.message || 'Unauthorized or server error'}`);
        return false;
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('✗ Network error saving store data.');
      return false;
    }
  };

  // Discard changes
  const discardChanges = () => {
    if (originalStoreData) {
      setStoreData(JSON.parse(JSON.stringify(originalStoreData)));
      setChangesCount(0);
      showToast('Changes discarded.');
    }
  };

  // Guard edit mode setters: only allow enabling if admin auth is confirmed
  const handleSetIsEditing = useCallback(
    (val: boolean) => {
      if (val && !isAdminAuthenticated) {
        showToast('🔒 Admin authentication required to edit site visually.');
        return;
      }
      setIsEditing(val);
    },
    [isAdminAuthenticated]
  );

  const toggleEditing = useCallback(() => {
    if (!isAdminAuthenticated) {
      showToast('🔒 Admin authentication required to edit site visually.');
      return;
    }
    setIsEditing((prev) => !prev);
  }, [isAdminAuthenticated]);

  const openMediaPicker = (opts: MediaPickerOptions) => {
    if (!isAdminAuthenticated) {
      showToast('🔒 Admin authentication required.');
      return;
    }
    setMediaModal(opts);
  };

  const closeMediaPicker = () => {
    setMediaModal(null);
  };

  // Derived edit state: visually editing is structurally impossible without active admin auth
  const effectiveIsEditing = Boolean(isAdminAuthenticated && isEditing);

  return (
    <VisualEditContext.Provider
      value={{
        isAdminAuthenticated,
        checkAdminStatus,
        isEditing: effectiveIsEditing,
        setIsEditing: handleSetIsEditing,
        toggleEditing,
        storeData,
        hasChanges: changesCount > 0,
        changesCount,
        updateField,
        updateProduct,
        saveChanges,
        discardChanges,
        mediaModal,
        openMediaPicker,
        closeMediaPicker,
        toastMessage,
      }}
    >
      {children}
    </VisualEditContext.Provider>
  );
}

export function useVisualEdit() {
  const ctx = useContext(VisualEditContext);
  if (!ctx) {
    throw new Error('useVisualEdit must be used within a VisualEditProvider');
  }
  return ctx;
}
