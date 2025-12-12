// Device Detection Hook
import { useState, useEffect } from 'react';
import type { DeviceInfo } from '../types';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return { isMobile: false, isTablet: false, deviceType: 'desktop' };
    }

    const width = window.innerWidth;
    return {
      isMobile: width < MOBILE_BREAKPOINT,
      isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
      deviceType:
        width < MOBILE_BREAKPOINT
          ? 'mobile'
          : width < TABLET_BREAKPOINT
          ? 'tablet'
          : 'desktop',
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setDeviceInfo({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        deviceType:
          width < MOBILE_BREAKPOINT
            ? 'mobile'
            : width < TABLET_BREAKPOINT
            ? 'tablet'
            : 'desktop',
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
}

export default useDeviceDetection;
