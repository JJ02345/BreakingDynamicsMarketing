// AI Squad Constants
// Configuration and constant values for AI services

import type { CarouselStyle, CarouselPatterns } from './types';

// ============================================
// API CONFIGURATION
// ============================================

// API configuration from environment - NEVER expose keys in frontend code
export const AI_CONFIG = {
  // Base URL must come from environment
  baseUrl: import.meta.env.VITE_AI_API_URL || '',

  // Default request timeout
  timeout: 30000,

  // Retry configuration
  maxRetries: 2,
  retryDelay: 1000,
} as const;

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
} as const;

// ============================================
// CAROUSEL STYLES
// ============================================

export const CAROUSEL_STYLES: CarouselStyle[] = [
  { id: 'viral', name: 'Viral', nameDE: 'Viral', description: 'High-engagement viral content' },
  { id: 'educational', name: 'Educational', nameDE: 'Lehrreich', description: 'Teaching and informative' },
  { id: 'storytelling', name: 'Storytelling', nameDE: 'Storytelling', description: 'Narrative-driven content' },
  { id: 'controversial', name: 'Controversial', nameDE: 'Kontrovers', description: 'Thought-provoking takes' },
  { id: 'inspirational', name: 'Inspirational', nameDE: 'Inspirierend', description: 'Motivational content' },
  { id: 'datadriven', name: 'Data-Driven', nameDE: 'Datenbasiert', description: 'Stats and facts focused' },
  { id: 'howto', name: 'How-To', nameDE: 'Anleitung', description: 'Step-by-step guides' },
  { id: 'listicle', name: 'Listicle', nameDE: 'Liste', description: 'Numbered lists and tips' },
  { id: 'comparison', name: 'Comparison', nameDE: 'Vergleich', description: 'This vs That format' },
  { id: 'myth', name: 'Myth Busting', nameDE: 'Mythen', description: 'Debunking misconceptions' },
];

// ============================================
// CAROUSEL PATTERNS
// ============================================

export const CAROUSEL_PATTERNS: CarouselPatterns = {
  problem_solution: {
    name: 'Problem → Lösung',
    slides: ['hook', 'problem', 'agitate', 'solution', 'benefits', 'cta']
  },
  listicle: {
    name: 'Listicle',
    slides: ['hook', 'point1', 'point2', 'point3', 'point4', 'cta']
  },
  story: {
    name: 'Story',
    slides: ['hook', 'background', 'conflict', 'resolution', 'lesson', 'cta']
  },
  comparison: {
    name: 'Vergleich',
    slides: ['hook', 'optionA', 'optionB', 'analysis', 'recommendation', 'cta']
  },
  myth_busting: {
    name: 'Mythen aufklären',
    slides: ['hook', 'myth1', 'truth1', 'myth2', 'truth2', 'cta']
  },
};

// Map pattern to style
export const PATTERN_TO_STYLE: Record<string, string> = {
  problem_solution: 'viral',
  listicle: 'listicle',
  story: 'storytelling',
  comparison: 'comparison',
  myth_busting: 'myth',
};

// ============================================
// VISUAL DESIGN SYSTEM
// ============================================

export const ACCENT_COLORS = {
  orange: { primary: '#FF6B35', secondary: '#FF8C5A' },
  purple: { primary: '#8B5CF6', secondary: '#A78BFA' },
  green: { primary: '#10B981', secondary: '#34D399' },
  blue: { primary: '#3B82F6', secondary: '#60A5FA' },
  cyan: { primary: '#06B6D4', secondary: '#22D3EE' },
} as const;

export const EMOJI_SETS = {
  business: ['💼', '📈', '🎯', '💡', '🚀', '⚡', '✨', '🏆'],
  growth: ['📊', '📈', '🌱', '🔥', '⬆️', '💪', '🎯', '🏅'],
  warning: ['⚠️', '🚨', '❌', '🔴', '⛔', '💥', '😱', '🤔'],
  success: ['✅', '🎉', '🏆', '🥇', '💯', '🌟', '👑', '🎊'],
} as const;

export const SLIDE_BACKGROUNDS = [
  'gradient-orange',
  'gradient-dark',
  'gradient-blue',
  'gradient-purple',
  'solid-charcoal',
  'mesh-vibrant'
] as const;

// ============================================
// TRANSLATION
// ============================================

export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch',
};

// Common translations for quick fallback (no API needed)
export const COMMON_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'SWIPE': 'SWIPE', 'SAVE': 'SAVE', 'FOLLOW': 'FOLLOW', 'SHARE': 'SHARE',
    'LIKE': 'LIKE', 'COMMENT': 'COMMENT', 'LEARN MORE': 'LEARN MORE',
    'TIP': 'TIP', 'STEP': 'STEP', 'FACT': 'FACT', 'MYTH': 'MYTH', 'TRUTH': 'TRUTH',
    'FOLGE MIR': 'FOLLOW ME', 'SPEICHERN': 'SAVE', 'TEILEN': 'SHARE',
  },
  de: {
    'SWIPE': 'WISCHEN', 'SAVE': 'SPEICHERN', 'FOLLOW': 'FOLGEN', 'SHARE': 'TEILEN',
    'LIKE': 'LIKEN', 'COMMENT': 'KOMMENTIEREN', 'LEARN MORE': 'MEHR ERFAHREN',
    'TIP': 'TIPP', 'STEP': 'SCHRITT', 'FACT': 'FAKT', 'MYTH': 'MYTHOS', 'TRUTH': 'WAHRHEIT',
    'FOLLOW ME': 'FOLGE MIR',
  },
  es: {
    'SWIPE': 'DESLIZA', 'SAVE': 'GUARDAR', 'FOLLOW': 'SEGUIR', 'SHARE': 'COMPARTIR',
    'TIP': 'CONSEJO', 'STEP': 'PASO', 'FACT': 'HECHO', 'MYTH': 'MITO', 'TRUTH': 'VERDAD',
    'FOLLOW ME': 'SÍGUEME', 'FOLGE MIR': 'SÍGUEME',
  },
  fr: {
    'SWIPE': 'GLISSER', 'SAVE': 'SAUVEGARDER', 'FOLLOW': 'SUIVRE', 'SHARE': 'PARTAGER',
    'TIP': 'CONSEIL', 'STEP': 'ÉTAPE', 'FACT': 'FAIT', 'MYTH': 'MYTHE', 'TRUTH': 'VÉRITÉ',
    'FOLLOW ME': 'SUIS-MOI', 'FOLGE MIR': 'SUIS-MOI',
  },
};
