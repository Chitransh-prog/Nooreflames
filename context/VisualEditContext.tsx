'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StoreData, Product } from '@/lib/store';

interface MediaPickerOptions {
  type: 'image' | 'video';
  currentUrl: string;
  label: string;
  onSave: (newUrl: string) => void;
}

interface VisualEditContextType {
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [originalStoreData, setOriginalStoreData] = useState<StoreData | null>(null);
  const [changesCount, setChangesCount] = useState<number>(0);
  const [mediaModal, setMediaModal] = useState<MediaPickerOptions | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial store data on mount
  useEffect(() => {
    fetch('/api/store')
      .then((res) => res.json())
      .then((data: StoreData) => {
        setStoreData(data);
        setOriginalStoreData(JSON.parse(JSON.stringify(data)));
      })
      .catch((err) => console.error('Failed to load store for visual edit:', err));
  }, []);

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

  // Save changes to /api/store
  const saveChanges = async (): Promise<boolean> => {
    if (!storeData) return false;
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData),
      });
      if (res.ok) {
        setOriginalStoreData(JSON.parse(JSON.stringify(storeData)));
        setChangesCount(0);
        showToast('✓ All changes saved to Live Store Database!');
        return true;
      } else {
        showToast('✗ Error saving changes. Please check console.');
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

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const openMediaPicker = (opts: MediaPickerOptions) => {
    setMediaModal(opts);
  };

  const closeMediaPicker = () => {
    setMediaModal(null);
  };

  return (
    <VisualEditContext.Provider
      value={{
        isEditing,
        setIsEditing,
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
