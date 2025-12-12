// Security Module - Public API
export {
  useRateLimiter,
  RATE_LIMIT_CONFIGS,
} from './rateLimiter';

export {
  handleError,
  createSafeError,
  createAppError,
  isErrorCode,
  isSafeError,
  ERROR_CODES,
} from './errorHandler';

export type { AppError } from './errorHandler';
