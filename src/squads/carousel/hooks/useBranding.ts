// useBranding Hook
// Manages branding settings for carousels

import { useState, useEffect, useCallback } from 'react';
import type { BrandingSettings } from '../types';

const BRANDING_STORAGE_KEY = 'carousel_branding_settings';

const DEFAULT_BRANDING: BrandingSettings = {
  showBranding: true,
  name: '',
  tagline: '',
  avatarUrl: '',
  primaryColor: '#FF6B35',
  secondaryColor: '#FF8C5A',
};

interface UseBrandingOptions {
  /**
   * Whether user is authenticated (affects default showBranding)
   */
  isAuthenticated?: boolean;
}

interface UseBrandingReturn {
  branding: BrandingSettings;
  showBranding: boolean;
  setBranding: (settings: Partial<BrandingSettings>) => void;
  setShowBranding: (show: boolean) => void;
  resetBranding: () => void;
  saveBranding: () => void;
}

export function useBranding(options: UseBrandingOptions = {}): UseBrandingReturn {
  const { isAuthenticated = false } = options;

  const [branding, setBrandingState] = useState<BrandingSettings>(() => {
    try {
      const saved = localStorage.getItem(BRANDING_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_BRANDING, ...parsed };
      }
    } catch (e) {
      console.error('[useBranding] Failed to load branding:', e);
    }
    return DEFAULT_BRANDING;
  });

  // Default showBranding based on authentication
  useEffect(() => {
    if (!isAuthenticated && branding.showBranding === undefined) {
      setBrandingState((prev) => ({ ...prev, showBranding: true }));
    }
  }, [isAuthenticated, branding.showBranding]);

  const setBranding = useCallback((settings: Partial<BrandingSettings>) => {
    setBrandingState((prev) => {
      const updated = { ...prev, ...settings };
      try {
        localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('[useBranding] Failed to save branding:', e);
      }
      return updated;
    });
  }, []);

  const setShowBranding = useCallback((show: boolean) => {
    setBranding({ showBranding: show });
  }, [setBranding]);

  const resetBranding = useCallback(() => {
    setBrandingState(DEFAULT_BRANDING);
    try {
      localStorage.removeItem(BRANDING_STORAGE_KEY);
    } catch (e) {
      console.error('[useBranding] Failed to reset branding:', e);
    }
  }, []);

  const saveBranding = useCallback(() => {
    try {
      localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(branding));
    } catch (e) {
      console.error('[useBranding] Failed to save branding:', e);
    }
  }, [branding]);

  return {
    branding,
    showBranding: branding.showBranding,
    setBranding,
    setShowBranding,
    resetBranding,
    saveBranding,
  };
}

export default useBranding;
