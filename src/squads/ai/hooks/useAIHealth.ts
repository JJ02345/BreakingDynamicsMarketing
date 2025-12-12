// useAIHealth Hook
// Monitor AI service availability

import { useState, useEffect, useCallback, useRef } from 'react';
import { checkHealth } from '../services/aiProxy';

interface UseAIHealthState {
  isAvailable: boolean;
  isChecking: boolean;
  lastCheck: Date | null;
  error: string | null;
}

interface UseAIHealthOptions {
  /**
   * Check health on mount
   * @default true
   */
  checkOnMount?: boolean;

  /**
   * Auto-refresh interval in milliseconds
   * Set to 0 to disable auto-refresh
   * @default 60000 (1 minute)
   */
  refreshInterval?: number;

  /**
   * Callback when health status changes
   */
  onStatusChange?: (isAvailable: boolean) => void;
}

interface UseAIHealthReturn extends UseAIHealthState {
  /**
   * Manually check health status
   */
  checkNow: () => Promise<boolean>;

  /**
   * Time since last check in seconds
   */
  timeSinceLastCheck: number | null;
}

export function useAIHealth(options: UseAIHealthOptions = {}): UseAIHealthReturn {
  const {
    checkOnMount = true,
    refreshInterval = 60000,
    onStatusChange,
  } = options;

  const [state, setState] = useState<UseAIHealthState>({
    isAvailable: false,
    isChecking: false,
    lastCheck: null,
    error: null,
  });

  const previousStatus = useRef<boolean | null>(null);

  const checkNow = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isChecking: true, error: null }));

    try {
      const isAvailable = await checkHealth();

      setState({
        isAvailable,
        isChecking: false,
        lastCheck: new Date(),
        error: null,
      });

      // Notify on status change
      if (previousStatus.current !== null && previousStatus.current !== isAvailable) {
        onStatusChange?.(isAvailable);
      }
      previousStatus.current = isAvailable;

      return isAvailable;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Health check failed';

      setState({
        isAvailable: false,
        isChecking: false,
        lastCheck: new Date(),
        error,
      });

      if (previousStatus.current !== null && previousStatus.current !== false) {
        onStatusChange?.(false);
      }
      previousStatus.current = false;

      return false;
    }
  }, [onStatusChange]);

  // Initial check on mount
  useEffect(() => {
    if (checkOnMount) {
      checkNow();
    }
  }, [checkOnMount, checkNow]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const intervalId = setInterval(checkNow, refreshInterval);
    return () => clearInterval(intervalId);
  }, [refreshInterval, checkNow]);

  // Calculate time since last check
  const timeSinceLastCheck =
    state.lastCheck !== null
      ? Math.floor((Date.now() - state.lastCheck.getTime()) / 1000)
      : null;

  return {
    ...state,
    checkNow,
    timeSinceLastCheck,
  };
}

export default useAIHealth;
