// Sanitizers - XSS Protection using DOMPurify
import DOMPurify from 'dompurify';

// Configure DOMPurify for safe HTML (very restrictive)
const SAFE_HTML_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'span'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

// Configure DOMPurify for plain text (strip all HTML)
const PLAIN_TEXT_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

/**
 * Sanitize HTML content - allows only safe formatting tags
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, SAFE_HTML_CONFIG);
}

/**
 * Sanitize to plain text - strips ALL HTML tags
 */
export function sanitizeText(text: string): string {
  if (!text) return '';

  // First pass: use DOMPurify to strip HTML
  let clean = DOMPurify.sanitize(text, PLAIN_TEXT_CONFIG);

  // Second pass: remove any remaining potential XSS vectors
  clean = clean
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<[^>]*>/g, '');

  return clean.trim();
}

/**
 * Sanitize URL - ensures it's a safe URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize an entire object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeText(item)
          : typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

/**
 * Escape HTML entities for safe display
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Strip EXIF data from image URL (for privacy)
 * Note: This only works with base64 images, server-side stripping is recommended
 */
export function stripImageMetadata(dataUrl: string): string {
  // For base64 images, we can't strip EXIF client-side easily
  // This is a placeholder - real implementation should be server-side
  return dataUrl;
}
