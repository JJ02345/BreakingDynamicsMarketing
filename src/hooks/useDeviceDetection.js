import { useState, useEffect } from 'react';

// Device breakpoints
const BREAKPOINTS = {
  mobile: 640,   // < 640px = Mobile
  tablet: 1024,  // 640-1024px = Tablet
  desktop: 1024  // > 1024px = Desktop
};

/**
 * Custom hook for detecting device type and screen size
 * Returns: { isMobile, isTablet, isDesktop, deviceType, screenWidth, screenHeight, isTouchDevice }
 */
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState(() => getDeviceInfo());

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    // Debounced resize handler
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return deviceInfo;
};

/**
 * Get current device information
 */
function getDeviceInfo() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  // Determine device type based on screen width
  const isMobile = screenWidth < BREAKPOINTS.mobile;
  const isTablet = screenWidth >= BREAKPOINTS.mobile && screenWidth < BREAKPOINTS.tablet;
  const isDesktop = screenWidth >= BREAKPOINTS.desktop;

  // Device type string
  let deviceType = 'desktop';
  if (isMobile) deviceType = 'mobile';
  else if (isTablet) deviceType = 'tablet';

  // Check orientation
  const isLandscape = screenWidth > screenHeight;
  const isPortrait = !isLandscape;

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    screenWidth,
    screenHeight,
    isTouchDevice,
    isLandscape,
    isPortrait
  };
}

export default useDeviceDetection;
