// ============================================
// AI API CONFIGURATION
// Central config for all AI services
// ============================================

// API Base URL - uses environment variable or defaults to ngrok tunnel
export const AI_BASE_URL = import.meta.env.VITE_AI_API_URL || 'https://nonlogistic-unnative-dominique.ngrok-free.dev';

// API Key for authentication
export const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || 'lk-carousel-j4k5ch-2024-prod';

// Default headers for all AI requests
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-API-Key': AI_API_KEY,
  'ngrok-skip-browser-warning': 'true',
});

// API Endpoints
export const ENDPOINTS = {
  health: '/health',
  status: '/status',
  styles: '/api/styles',
  carousel: '/api/carousel',
  post: '/api/post',
  hooks: '/api/hooks',
  twitter: '/api/twitter',
  instagram: '/api/instagram',
  newsletter: '/api/newsletter',
  blog: '/api/blog',
  repurpose: '/api/repurpose',
  ideas: '/api/ideas',
  analyze: '/api/analyze',
  batch: '/api/batch',
  calendar: '/api/calendar',
};

// Build full URL for endpoint
export const getEndpointUrl = (endpoint) => `${AI_BASE_URL}${ENDPOINTS[endpoint] || endpoint}`;

// Generic API call function
export const callAI = async (endpoint, data = null, method = 'POST') => {
  const url = getEndpointUrl(endpoint);

  const options = {
    method,
    headers: getHeaders(),
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`AI API Error [${endpoint}]:`, response.status, errorText);
    throw new Error(`AI request failed (${response.status})`);
  }

  return response.json();
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await fetch(getEndpointUrl('health'), {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Get available styles
export const getStyles = async () => {
  try {
    const result = await callAI('styles', null, 'GET');
    return result.styles || result.data?.styles || [];
  } catch {
    return [];
  }
};

export default {
  AI_BASE_URL,
  AI_API_KEY,
  ENDPOINTS,
  getHeaders,
  getEndpointUrl,
  callAI,
  checkHealth,
  getStyles,
};
