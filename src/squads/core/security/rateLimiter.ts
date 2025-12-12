// Rate Limiter - Client-side rate limiting
import { useState, useCallback, useRef, useEffect } from 'react';
import type { RateLimitState } from '../types';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface StoredRateLimit {
  requests: number[];
  blocked: boolean;
  blockedUntil?: number;
}

const STORAGE_PREFIX = 'rate_limit_';

function getStoredLimit(key: string): StoredRateLimit {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { requests: [], blocked: false };
}

function setStoredLimit(key: string, data: StoredRateLimit): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hook for rate limiting user actions
 */
export function useRateLimiter(
  key: string,
  config: RateLimitConfig
): RateLimitState & { checkLimit: () => boolean; reset: () => void } {
  const { maxRequests, windowMs } = config;
  const [state, setState] = useState<RateLimitState>(() => {
    const stored = getStoredLimit(key);
    const now = Date.now();

    // Check if blocked
    if (stored.blocked && stored.blockedUntil && stored.blockedUntil > now) {
      return {
        canRequest: false,
        remainingRequests: 0,
        resetTime: stored.blockedUntil,
      };
    }

    // Count valid requests
    const validRequests = stored.requests.filter((t) => now - t < windowMs);
    return {
      canRequest: validRequests.length < maxRequests,
      remainingRequests: Math.max(0, maxRequests - validRequests.length),
    };
  });

  const checkLimit = useCallback((): boolean => {
    const now = Date.now();
    const stored = getStoredLimit(key);

    // Check if currently blocked
    if (stored.blocked && stored.blockedUntil && stored.blockedUntil > now) {
      setState({
        canRequest: false,
        remainingRequests: 0,
        resetTime: stored.blockedUntil,
      });
      return false;
    }

    // Remove expired requests
    const validRequests = stored.requests.filter((t) => now - t < windowMs);

    if (validRequests.length >= maxRequests) {
      // Block for the window duration
      const blockedUntil = now + windowMs;
      setStoredLimit(key, {
        requests: validRequests,
        blocked: true,
        blockedUntil,
      });
      setState({
        canRequest: false,
        remainingRequests: 0,
        resetTime: blockedUntil,
      });
      return false;
    }

    // Add new request
    validRequests.push(now);
    setStoredLimit(key, {
      requests: validRequests,
      blocked: false,
    });

    const remaining = maxRequests - validRequests.length;
    setState({
      canRequest: remaining > 0,
      remainingRequests: remaining,
    });

    return true;
  }, [key, maxRequests, windowMs]);

  const reset = useCallback(() => {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    setState({
      canRequest: true,
      remainingRequests: maxRequests,
    });
  }, [key, maxRequests]);

  // Auto-update state when block expires
  const timerRef = useRef<number>();
  useEffect(() => {
    if (state.resetTime && state.resetTime > Date.now()) {
      const timeout = state.resetTime - Date.now();
      timerRef.current = window.setTimeout(() => {
        reset();
      }, timeout);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [state.resetTime, reset]);

  return {
    ...state,
    checkLimit,
    reset,
  };
}

// Pre-configured rate limiters for common use cases
export const RATE_LIMIT_CONFIGS = {
  auth: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 requests per minute
  aiGeneration: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
  feedback: { maxRequests: 3, windowMs: 60 * 1000 }, // 3 per minute
  newsletter: { maxRequests: 2, windowMs: 60 * 1000 }, // 2 per minute
} as const;
