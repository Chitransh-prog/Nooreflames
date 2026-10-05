'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  setIsAdminAuthenticated: (val: boolean) => void;
  checkAdminStatus: () => Promise<boolean>;
  loginAsAdmin: (password: string, email?: string) => Promise<{ success: boolean; message?: string }>;
  showLoginModal: boolean;
  setShowLoginModal: (val: boolean) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  toggleEditing: () => void;
  storeData: StoreData | null;
  hasChanges: boolean;
  changesCount: number;
  markUnsavedChanges: () => void;
  updateField: (path: string, value: any) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  saveChanges: () => Promise<boolean>;
  discardChanges: () => void;
  mediaModal: MediaPickerOptions | null;
  openMediaPicker: (opts: MediaPickerOptions) => void;
  closeMediaPicker: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const VisualEditContext = createContext<VisualEditContextType | null>(null);

export function VisualEditProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [originalStoreData, setOriginalStoreData] = useState<StoreData | null>(null);
  const [changesCount, setChangesCount] = useState<number>(0);
  const [mediaModal, setMediaModal] = useState<MediaPickerOptions | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keep a synchronous ref to storeData so saveChanges always sends the absolute freshest state
  const storeDataRef = useRef<StoreData | null>(null);
  useEffect(() => {
    storeDataRef.current = storeData;
  }, [storeData]);

  // Check admin authentication status via JWT session API with fresh no-store and credentials: 'include'
  const checkAdminStatus = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/me', {
        cache: 'no-store',
        credentials: 'include',
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
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('nf_visual_edit_active');
      }
      return false;
    } catch {
      setIsAdminAuthenticated(false);
      setIsEditing(false);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('nf_visual_edit_active');
      }
      return false;
    }
  }, []);

  // Quick in-place admin login without leaving or refreshing the page
  const loginAsAdmin = useCallback(
    async (password: string, email: string = 'nooreflamesadmin@gmail.com'): Promise<{ success: boolean; message?: string }> => {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setIsAdminAuthenticated(true);
          setIsEditing(true);
          setShowLoginModal(false);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('nf_visual_edit_active', 'true');
          }
          return { success: true };
        } else {
          return { success: false, message: data.message || 'Invalid credentials' };
        }
      } catch (err: any) {
        return { success: false, message: err?.message || 'Login connection failed' };
      }
    },
    []
  );

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
        storeDataRef.current = data;
        setOriginalStoreData(JSON.parse(JSON.stringify(data)));
      })
      .catch((err) => console.error('Failed to load store for visual edit:', err));
  }, []);

  // Check admin session on mount & route changes. Auto-activate if ?visualEdit=true or active in sessionStorage
  useEffect(() => {
    let isMounted = true;
    checkAdminStatus().then((isAuthed) => {
      if (!isMounted) return;
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const hasParam = params.get('visualEdit') === 'true';
        const sessionActive = sessionStorage.getItem('nf_visual_edit_active') === 'true';

        if (isAuthed) {
          if (hasParam || sessionActive) {
            setIsEditing(true);
            sessionStorage.setItem('nf_visual_edit_active', 'true');
          }
        } else {
          setIsEditing(false);
          sessionStorage.removeItem('nf_visual_edit_active');
          if (hasParam) {
            // User explicitly visited ?visualEdit=true but is not logged in: show login prompt
            setShowLoginModal(true);
          }
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

  // Sync body class for visual edit styling (e.g. top banner offset & paused tickers)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isAdminAuthenticated && isEditing) {
        document.body.classList.add('visual-editing-active');
      } else {
        document.body.classList.remove('visual-editing-active');
      }
    }
  }, [isAdminAuthenticated, isEditing]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const markUnsavedChanges = useCallback(() => {
    setChangesCount((c) => Math.max(c, 1));
  }, []);

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
      storeDataRef.current = clone;
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
      storeDataRef.current = clone;
      return clone;
    });
    setChangesCount((c) => c + 1);
  }, []);

  // Save changes to /api/store (Admin only)
  const saveChanges = async (): Promise<boolean> => {
    if (!isAdminAuthenticated) {
      showToast('🔒 Admin authentication required to save changes.');
      setShowLoginModal(true);
      return false;
    }

    // Flush any focused contentEditable element to commit blur handlers
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Wait a brief tick for pending React state updates to flush into storeDataRef
    await new Promise((r) => setTimeout(r, 60));

    const payload = storeDataRef.current || storeData;
    if (!payload) return false;

    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setOriginalStoreData(JSON.parse(JSON.stringify(payload)));
        setChangesCount(0);
        showToast('✓ All changes saved to Live Store Database!');
        try {
          localStorage.setItem('nf_store_backup', JSON.stringify(payload));
        } catch (_) {}
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
      const cloned = JSON.parse(JSON.stringify(originalStoreData));
      setStoreData(cloned);
      storeDataRef.current = cloned;
      setChangesCount(0);
      showToast('Changes discarded.');
    }
  };

  // Guard edit mode setters: only allow enabling if admin auth is confirmed
  const handleSetIsEditing = useCallback(
    (val: boolean) => {
      if (val && !isAdminAuthenticated) {
        setShowLoginModal(true);
        showToast('🔒 Admin authentication required to edit site visually.');
        return;
      }
      setIsEditing(val);
      if (typeof window !== 'undefined') {
        if (val) {
          sessionStorage.setItem('nf_visual_edit_active', 'true');
        } else {
          sessionStorage.removeItem('nf_visual_edit_active');
        }
      }
    },
    [isAdminAuthenticated]
  );

  const toggleEditing = useCallback(() => {
    if (!isAdminAuthenticated) {
      setShowLoginModal(true);
      showToast('🔒 Admin authentication required to edit site visually.');
      return;
    }
    setIsEditing((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        if (next) {
          sessionStorage.setItem('nf_visual_edit_active', 'true');
        } else {
          sessionStorage.removeItem('nf_visual_edit_active');
        }
      }
      return next;
    });
  }, [isAdminAuthenticated]);

  const openMediaPicker = (opts: MediaPickerOptions) => {
    if (!isAdminAuthenticated) {
      setShowLoginModal(true);
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
        setIsAdminAuthenticated,
        checkAdminStatus,
        loginAsAdmin,
        showLoginModal,
        setShowLoginModal,
        isEditing: effectiveIsEditing,
        setIsEditing: handleSetIsEditing,
        toggleEditing,
        storeData,
        hasChanges: changesCount > 0,
        changesCount,
        markUnsavedChanges,
        updateField,
        updateProduct,
        saveChanges,
        discardChanges,
        mediaModal,
        openMediaPicker,
        closeMediaPicker,
        toastMessage,
        showToast,
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
