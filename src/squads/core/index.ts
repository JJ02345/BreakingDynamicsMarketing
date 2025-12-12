// Core Squad - Public API
// Infrastructure, Security, Validation, and Shared Utilities

// ============================================
// Providers
// ============================================
export { ToastProvider, useToast } from './providers/ToastProvider';
export {
  LanguageProvider,
  useLanguage,
  LanguageSwitcher,
} from './providers/LanguageProvider';

// ============================================
// Hooks
// ============================================
export { useDeviceDetection } from './hooks/useDeviceDetection';

// ============================================
// Components
// ============================================
export { Logo } from './components/Logo';
export { PageLoader } from './components/PageLoader';

// ============================================
// Services
// ============================================
export { supabase } from './services/supabaseClient';
export {
  uploadImage,
  deleteImage,
  listUserImages,
} from './services/storageService';
export type { UploadResult } from './services/storageService';

// ============================================
// Validation
// ============================================
export {
  // Validators
  validate,
  validateOrThrow,
  isValid,
  getFirstError,
  getErrorMap,
  // Sanitizers
  sanitizeHTML,
  sanitizeText,
  sanitizeUrl,
  sanitizeObject,
  escapeHtml,
  // Schemas
  emailSchema,
  passwordSchema,
  loginSchema,
  registerSchema,
  carouselTitleSchema,
  slideBlockSchema,
  slideSchema,
  carouselSettingsSchema,
  carouselSchema,
  aiPatternSchema,
  aiToneSchema,
  aiGenerationRequestSchema,
  feedbackTypeSchema,
  feedbackSchema,
  newsletterSchema,
  surveyBlockSchema,
  surveySchema,
} from './validation';

export type {
  LoginInput,
  RegisterInput,
  CarouselInput,
  AIGenerationRequestInput,
  FeedbackInput,
  NewsletterInput,
  SurveyInput,
} from './validation';

// ============================================
// Security
// ============================================
export {
  useRateLimiter,
  RATE_LIMIT_CONFIGS,
  handleError,
  createSafeError,
  isErrorCode,
  isSafeError,
  ERROR_CODES,
} from './security';

// ============================================
// Constants
// ============================================
export { translations } from './constants/translations';
export { BLOCKS, DUR_LABELS } from './constants/blocks';
export { LIMITS } from './constants/limits';
export type { BlockDefinition } from './constants/blocks';
export type { LimitKey } from './constants/limits';

// ============================================
// Types
// ============================================
export type {
  Toast,
  ToastType,
  ToastContextValue,
  LanguageCode,
  LanguageOption,
  LanguageContextValue,
  DeviceInfo,
  ValidationResult,
  ValidationError,
  SafeError,
  RateLimitState,
} from './types';
