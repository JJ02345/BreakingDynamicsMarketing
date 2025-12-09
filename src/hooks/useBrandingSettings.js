import { useState, useEffect, useCallback } from 'react';

const BRANDING_KEY = 'bd_show_branding';

/**
 * Hook for managing Breaking Dynamics branding settings
 * - Stores in localStorage (synced across tabs)
 * - Only available for authenticated users
 */
export const useBrandingSettings = (isAuthenticated = false) => {
  const [showBranding, setShowBrandingState] = useState(false);

  // Load setting from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      try {
        const saved = localStorage.getItem(BRANDING_KEY);
        setShowBrandingState(saved === 'true');
      } catch (e) {
        console.error('Failed to load branding setting:', e);
      }
    }
  }, [isAuthenticated]);

  // Update setting
  const setShowBranding = useCallback((value) => {
    setShowBrandingState(value);
    try {
      localStorage.setItem(BRANDING_KEY, value ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save branding setting:', e);
    }
  }, []);

  // Toggle setting
  const toggleBranding = useCallback(() => {
    setShowBranding(!showBranding);
  }, [showBranding, setShowBranding]);

  return {
    showBranding: isAuthenticated ? showBranding : false,
    setShowBranding,
    toggleBranding,
    isAvailable: isAuthenticated
  };
};

export default useBrandingSettings;
