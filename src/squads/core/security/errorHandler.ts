// Error Handler - Secure error handling without data leakage
import type { SafeError } from '../types';

// Error codes for different scenarios
export const ERROR_CODES = {
  // Authentication
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_EXPIRED: 'AUTH_EXPIRED',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',

  // Rate Limiting
  RATE_LIMITED: 'RATE_LIMITED',

  // Server
  SERVER_ERROR: 'SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  // Generic
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// User-friendly error messages (no internal details)
const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.AUTH_REQUIRED]: 'Please sign in to continue',
  [ERROR_CODES.AUTH_INVALID]: 'Invalid credentials',
  [ERROR_CODES.AUTH_EXPIRED]: 'Your session has expired. Please sign in again',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input',
  [ERROR_CODES.INVALID_INPUT]: 'Invalid input provided',
  [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection',
  [ERROR_CODES.TIMEOUT]: 'Request timed out. Please try again',
  [ERROR_CODES.RATE_LIMITED]: 'Too many requests. Please wait a moment',
  [ERROR_CODES.SERVER_ERROR]: 'Something went wrong. Please try again',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An error occurred. Please try again',
};

/**
 * Handle errors safely - logs internally, returns sanitized error
 */
export function handleError(
  error: unknown,
  context?: string
): SafeError {
  // Log the full error internally (only in development)
  if (import.meta.env.DEV) {
    console.error(`[Error${context ? ` - ${context}` : ''}]`, error);
  }

  // Determine error type and return safe message
  if (error instanceof Error) {
    // Check for specific error types
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch')) {
      return {
        message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
        code: ERROR_CODES.NETWORK_ERROR,
      };
    }

    if (message.includes('timeout')) {
      return {
        message: ERROR_MESSAGES[ERROR_CODES.TIMEOUT],
        code: ERROR_CODES.TIMEOUT,
      };
    }

    if (message.includes('unauthorized') || message.includes('401')) {
      return {
        message: ERROR_MESSAGES[ERROR_CODES.AUTH_REQUIRED],
        code: ERROR_CODES.AUTH_REQUIRED,
      };
    }

    if (message.includes('forbidden') || message.includes('403')) {
      return {
        message: ERROR_MESSAGES[ERROR_CODES.AUTH_INVALID],
        code: ERROR_CODES.AUTH_INVALID,
      };
    }

    if (message.includes('rate') || message.includes('429')) {
      return {
        message: ERROR_MESSAGES[ERROR_CODES.RATE_LIMITED],
        code: ERROR_CODES.RATE_LIMITED,
      };
    }

    if (message.includes('validation')) {
      return {
        message: ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR],
        code: ERROR_CODES.VALIDATION_ERROR,
      };
    }
  }

  // Generic error - hide all details
  return {
    message: ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
    code: ERROR_CODES.UNKNOWN_ERROR,
  };
}

/**
 * Create a specific safe error
 */
export function createSafeError(
  code: keyof typeof ERROR_CODES,
  customMessage?: string
): SafeError {
  return {
    message: customMessage || ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
    code,
  };
}

/**
 * Check if an error is a specific type
 */
export function isErrorCode(error: SafeError, code: keyof typeof ERROR_CODES): boolean {
  return error.code === code;
}

/**
 * Type guard for SafeError
 */
export function isSafeError(error: unknown): error is SafeError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error &&
    typeof (error as SafeError).message === 'string' &&
    typeof (error as SafeError).code === 'string'
  );
}

/**
 * Extended App Error with additional metadata
 */
export interface AppError extends Error {
  code: string;
  userMessage?: string;
  statusCode?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Create an application error with additional context
 * Used for creating errors with user-friendly messages
 */
export function createAppError(
  message: string,
  code: string,
  metadata?: {
    userMessage?: string;
    statusCode?: number;
    [key: string]: unknown;
  }
): AppError {
  const error = new Error(message) as AppError;
  error.name = 'AppError';
  error.code = code;
  error.userMessage = metadata?.userMessage;
  error.statusCode = metadata?.statusCode;
  error.metadata = metadata;
  return error;
}
