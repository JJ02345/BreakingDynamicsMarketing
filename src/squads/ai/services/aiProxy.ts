// AI Proxy Service
// Secure API communication layer - API key from environment only

import { AI_CONFIG, ENDPOINTS } from '../constants';
import { handleError, createAppError } from '@/squads/core';

// ============================================
// SECURITY: API KEY HANDLING
// ============================================

// Get API key from environment - NEVER hardcode
const getApiKey = (): string => {
  const key = import.meta.env.VITE_AI_API_KEY;
  if (!key) {
    console.warn('[AI Proxy] No API key configured');
    return '';
  }
  return key;
};

// Get headers for API requests
const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'X-API-Key': getApiKey(),
  'ngrok-skip-browser-warning': 'true',
});

// ============================================
// API CALL WRAPPER
// ============================================

interface CallOptions {
  timeout?: number;
  retries?: number;
}

/**
 * Make a secure API call to the AI backend
 */
export async function callAI<T = unknown>(
  endpoint: keyof typeof ENDPOINTS | string,
  data: Record<string, unknown> | null = null,
  method: 'GET' | 'POST' = 'POST',
  options: CallOptions = {}
): Promise<T> {
  const baseUrl = AI_CONFIG.baseUrl;

  if (!baseUrl) {
    throw createAppError('AI service not configured', 'AI_NOT_CONFIGURED', {
      userMessage: 'AI-Service nicht verfügbar. Bitte später erneut versuchen.',
    });
  }

  const endpointPath = ENDPOINTS[endpoint as keyof typeof ENDPOINTS] || endpoint;
  const url = `${baseUrl}${endpointPath}`;
  const timeout = options.timeout || AI_CONFIG.timeout;
  const maxRetries = options.retries ?? AI_CONFIG.maxRetries;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const fetchOptions: RequestInit = {
        method,
        headers: getHeaders(),
        signal: controller.signal,
      };

      if (data && method !== 'GET') {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`[AI Proxy] API Error [${endpoint}]:`, response.status, errorText);

        // Don't retry client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw createAppError(`AI request failed: ${response.status}`, 'AI_REQUEST_FAILED', {
            statusCode: response.status,
            userMessage: getErrorMessage(response.status),
          });
        }

        throw new Error(`Server error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Handle abort (timeout)
      if (lastError.name === 'AbortError') {
        lastError = createAppError('Request timeout', 'AI_TIMEOUT', {
          userMessage: 'Anfrage hat zu lange gedauert. Bitte erneut versuchen.',
        });
      }

      // Handle network errors
      if (lastError.name === 'TypeError' && lastError.message.includes('fetch')) {
        lastError = createAppError('Network error', 'AI_NETWORK_ERROR', {
          userMessage: 'AI-Server nicht erreichbar. Bitte später erneut versuchen.',
        });
      }

      // If not last attempt, wait and retry
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, AI_CONFIG.retryDelay * (attempt + 1))
        );
        continue;
      }
    }
  }

  // All retries failed
  throw lastError || createAppError('AI request failed', 'AI_REQUEST_FAILED');
}

/**
 * Get user-friendly error message based on status code
 */
function getErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Ungültige Anfrage. Bitte Eingabe überprüfen.';
    case 401:
    case 403:
      return 'Keine Berechtigung. Bitte erneut anmelden.';
    case 404:
      return 'AI-Service nicht gefunden.';
    case 429:
      return 'Zu viele Anfragen. Bitte kurz warten.';
    case 500:
    case 502:
    case 503:
      return 'AI-Server vorübergehend nicht verfügbar.';
    default:
      return 'Ein Fehler ist aufgetreten. Bitte erneut versuchen.';
  }
}

// ============================================
// HEALTH CHECK
// ============================================

/**
 * Check if AI service is available
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const baseUrl = AI_CONFIG.baseUrl;
    if (!baseUrl) return false;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}${ENDPOINTS.health}`, {
      method: 'GET',
      headers: getHeaders(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get available styles from API
 */
export async function getStyles(): Promise<string[]> {
  try {
    const result = await callAI<{ styles?: string[]; data?: { styles?: string[] } }>(
      'styles',
      null,
      'GET'
    );
    return result.styles || result.data?.styles || [];
  } catch {
    return [];
  }
}

export default {
  callAI,
  checkHealth,
  getStyles,
};
