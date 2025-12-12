// Core Squad Types

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastContextValue {
  addToast: (message: string, type?: ToastType, duration?: number) => number;
  removeToast: (id: number) => void;
}

export type LanguageCode = 'en' | 'de' | 'es' | 'fr';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

export interface LanguageContextValue {
  language: LanguageCode;
  t: (key: string) => string;
  changeLanguage: (lang: LanguageCode) => void;
}

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

// Validation Types
export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Security Types
export interface SafeError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface RateLimitState {
  canRequest: boolean;
  remainingRequests: number;
  resetTime?: number;
}
