// AI Squad Constants
// Configuration and constant values for AI services
// Full access to Carousel Squad design options

import type { CarouselStyle, CarouselPatterns } from './types';

// Re-export all design options from Carousel Squad for AI generation
// This gives AI full access to all visual design possibilities
export {
  // Backgrounds - all available background styles
  BACKGROUND_STYLES,
  PDF_BACKGROUND_FALLBACKS,
  getBackgroundCSS,
  getPDFBackgroundCSS,
  // Block types - all content block definitions
  BLOCK_TYPES,
  FONT_SIZES,
  PDF_FONT_SIZE_MAP,
  getFontSize,
  // Templates - all slide and carousel templates
  SLIDE_TEMPLATES,
  CAROUSEL_TEMPLATES,
  createSlide,
  createBlock,
  createDefaultCarousel,
  getSlidesForTemplate,
} from '../carousel/templates';

export type {
  BackgroundStyle,
  BlockTypeDefinition,
} from '../carousel/templates';

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
  // Original Styles
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
  // Extended Styles
  { id: 'case_study', name: 'Case Study', nameDE: 'Fallstudie', description: 'Real-world examples and results' },
  { id: 'behind_scenes', name: 'Behind the Scenes', nameDE: 'Hinter den Kulissen', description: 'Exclusive insider content' },
  { id: 'transformation', name: 'Transformation', nameDE: 'Transformation', description: 'Before/after journeys' },
  { id: 'checklist', name: 'Checklist', nameDE: 'Checkliste', description: 'Actionable to-do lists' },
  { id: 'framework', name: 'Framework', nameDE: 'Framework', description: 'Structured methodologies' },
  { id: 'mistakes', name: 'Mistakes to Avoid', nameDE: 'Fehler vermeiden', description: 'Common pitfalls and solutions' },
  { id: 'predictions', name: 'Predictions', nameDE: 'Vorhersagen', description: 'Future trends and forecasts' },
  { id: 'interview', name: 'Interview Style', nameDE: 'Interview-Stil', description: 'Q&A format content' },
  { id: 'timeline', name: 'Timeline', nameDE: 'Zeitstrahl', description: 'Chronological progression' },
  { id: 'breakdown', name: 'Deep Dive', nameDE: 'Tiefenanalyse', description: 'Detailed analysis' },
  { id: 'quick_tips', name: 'Quick Tips', nameDE: 'Schnelle Tipps', description: 'Bite-sized actionable advice' },
  { id: 'mindset', name: 'Mindset', nameDE: 'Mentalität', description: 'Psychology and mental models' },
  { id: 'tools', name: 'Tool Showcase', nameDE: 'Tool-Showcase', description: 'Product/tool recommendations' },
  { id: 'quote_carousel', name: 'Quote Carousel', nameDE: 'Zitat-Carousel', description: 'Inspiring quotes with context' },
  { id: 'statistics', name: 'Statistics', nameDE: 'Statistiken', description: 'Number-heavy visual content' },
];

// ============================================
// CAROUSEL PATTERNS
// ============================================

export const CAROUSEL_PATTERNS: CarouselPatterns = {
  // Original Patterns
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
  // Extended Patterns
  before_after: {
    name: 'Vorher → Nachher',
    slides: ['hook', 'before', 'journey', 'after', 'results', 'cta']
  },
  step_by_step: {
    name: 'Schritt für Schritt',
    slides: ['hook', 'step1', 'step2', 'step3', 'step4', 'result', 'cta']
  },
  case_study: {
    name: 'Fallstudie',
    slides: ['hook', 'context', 'challenge', 'approach', 'results', 'takeaways', 'cta']
  },
  framework: {
    name: 'Framework',
    slides: ['hook', 'overview', 'pillar1', 'pillar2', 'pillar3', 'implementation', 'cta']
  },
  timeline: {
    name: 'Zeitstrahl',
    slides: ['hook', 'start', 'milestone1', 'milestone2', 'milestone3', 'present', 'cta']
  },
  mistakes: {
    name: 'Fehler vermeiden',
    slides: ['hook', 'mistake1', 'fix1', 'mistake2', 'fix2', 'mistake3', 'fix3', 'cta']
  },
  quick_wins: {
    name: 'Schnelle Erfolge',
    slides: ['hook', 'win1', 'win2', 'win3', 'win4', 'win5', 'cta']
  },
  behind_scenes: {
    name: 'Hinter den Kulissen',
    slides: ['hook', 'reveal1', 'reveal2', 'reveal3', 'insight', 'cta']
  },
  predictions: {
    name: 'Vorhersagen',
    slides: ['hook', 'trend1', 'trend2', 'trend3', 'impact', 'action', 'cta']
  },
  checklist: {
    name: 'Checkliste',
    slides: ['hook', 'item1', 'item2', 'item3', 'item4', 'item5', 'cta']
  },
  quotes: {
    name: 'Zitate',
    slides: ['hook', 'quote1', 'context1', 'quote2', 'context2', 'cta']
  },
  controversy: {
    name: 'Kontrovers',
    slides: ['hook', 'statement', 'argument1', 'argument2', 'counterpoint', 'conclusion', 'cta']
  },
  transformation: {
    name: 'Transformation',
    slides: ['hook', 'old_way', 'turning_point', 'new_way', 'proof', 'cta']
  },
  data_story: {
    name: 'Daten-Story',
    slides: ['hook', 'stat1', 'stat2', 'stat3', 'insight', 'action', 'cta']
  },
};

// Map pattern to style
export const PATTERN_TO_STYLE: Record<string, string> = {
  // Original
  problem_solution: 'viral',
  listicle: 'listicle',
  story: 'storytelling',
  comparison: 'comparison',
  myth_busting: 'myth',
  // Extended
  before_after: 'transformation',
  step_by_step: 'howto',
  case_study: 'case_study',
  framework: 'framework',
  timeline: 'timeline',
  mistakes: 'mistakes',
  quick_wins: 'quick_tips',
  behind_scenes: 'behind_scenes',
  predictions: 'predictions',
  checklist: 'checklist',
  quotes: 'quote_carousel',
  controversy: 'controversial',
  transformation: 'transformation',
  data_story: 'statistics',
};

// ============================================
// VISUAL DESIGN SYSTEM - EXTENDED
// ============================================

export const ACCENT_COLORS = {
  // Primary Brand Colors
  orange: { primary: '#FF6B35', secondary: '#FF8C5A', name: 'Orange', nameDE: 'Orange' },
  purple: { primary: '#8B5CF6', secondary: '#A78BFA', name: 'Purple', nameDE: 'Lila' },
  green: { primary: '#10B981', secondary: '#34D399', name: 'Emerald', nameDE: 'Smaragd' },
  blue: { primary: '#3B82F6', secondary: '#60A5FA', name: 'Blue', nameDE: 'Blau' },
  cyan: { primary: '#06B6D4', secondary: '#22D3EE', name: 'Cyan', nameDE: 'Cyan' },

  // Extended Palette
  red: { primary: '#EF4444', secondary: '#F87171', name: 'Red', nameDE: 'Rot' },
  pink: { primary: '#EC4899', secondary: '#F472B6', name: 'Pink', nameDE: 'Pink' },
  rose: { primary: '#F43F5E', secondary: '#FB7185', name: 'Rose', nameDE: 'Rose' },
  fuchsia: { primary: '#D946EF', secondary: '#E879F9', name: 'Fuchsia', nameDE: 'Fuchsia' },
  violet: { primary: '#7C3AED', secondary: '#A78BFA', name: 'Violet', nameDE: 'Violett' },
  indigo: { primary: '#6366F1', secondary: '#818CF8', name: 'Indigo', nameDE: 'Indigo' },
  sky: { primary: '#0EA5E9', secondary: '#38BDF8', name: 'Sky', nameDE: 'Himmelblau' },
  teal: { primary: '#14B8A6', secondary: '#2DD4BF', name: 'Teal', nameDE: 'Petrol' },
  lime: { primary: '#84CC16', secondary: '#A3E635', name: 'Lime', nameDE: 'Limette' },
  yellow: { primary: '#EAB308', secondary: '#FACC15', name: 'Yellow', nameDE: 'Gelb' },
  amber: { primary: '#F59E0B', secondary: '#FBBF24', name: 'Amber', nameDE: 'Bernstein' },

  // Premium/Luxury Colors
  gold: { primary: '#D4AF37', secondary: '#F0D78C', name: 'Gold', nameDE: 'Gold' },
  silver: { primary: '#9CA3AF', secondary: '#D1D5DB', name: 'Silver', nameDE: 'Silber' },
  bronze: { primary: '#CD7F32', secondary: '#E6A65C', name: 'Bronze', nameDE: 'Bronze' },
  platinum: { primary: '#E5E4E2', secondary: '#F5F5F4', name: 'Platinum', nameDE: 'Platin' },

  // Dark/Muted Colors
  slate: { primary: '#475569', secondary: '#64748B', name: 'Slate', nameDE: 'Schiefer' },
  zinc: { primary: '#52525B', secondary: '#71717A', name: 'Zinc', nameDE: 'Zink' },
  stone: { primary: '#57534E', secondary: '#78716C', name: 'Stone', nameDE: 'Stein' },
} as const;

export const EMOJI_SETS = {
  // Original Sets
  business: ['💼', '📈', '🎯', '💡', '🚀', '⚡', '✨', '🏆'],
  growth: ['📊', '📈', '🌱', '🔥', '⬆️', '💪', '🎯', '🏅'],
  warning: ['⚠️', '🚨', '❌', '🔴', '⛔', '💥', '😱', '🤔'],
  success: ['✅', '🎉', '🏆', '🥇', '💯', '🌟', '👑', '🎊'],

  // Extended Sets
  tech: ['💻', '📱', '🖥️', '⚙️', '🔧', '🔌', '🌐', '💾', '🤖', '🧠'],
  money: ['💰', '💵', '💸', '🏦', '💳', '📈', '💎', '🪙', '📊', '🤑'],
  time: ['⏰', '⏳', '📅', '🗓️', '⌚', '🕐', '📆', '⏱️', '🔔', '⚡'],
  social: ['👥', '🤝', '💬', '📣', '🔊', '📢', '👋', '🙋', '💭', '🗣️'],
  creative: ['🎨', '✏️', '📝', '🖌️', '💫', '🌈', '🎭', '📸', '🎬', '🎵'],
  education: ['📚', '🎓', '📖', '✍️', '🔬', '🧪', '📐', '🎯', '💡', '🧠'],
  health: ['💪', '🏃', '🧘', '🥗', '💊', '🩺', '❤️', '🌿', '🍎', '😊'],
  travel: ['✈️', '🌍', '🗺️', '🏖️', '🌴', '🏔️', '🚀', '🧭', '🎒', '⛵'],
  food: ['🍕', '🍔', '🍜', '🥗', '🍰', '☕', '🍷', '🍳', '🥐', '🍣'],
  nature: ['🌲', '🌸', '🌻', '🌊', '⛰️', '🌅', '🌙', '⭐', '🌈', '🦋'],
  celebration: ['🎉', '🎊', '🥳', '🎈', '🎁', '🍾', '🥂', '🪅', '🎆', '🎇'],
  emotions: ['😀', '😍', '🥰', '😎', '🤩', '😊', '🙌', '👏', '❤️', '💖'],
  arrows: ['➡️', '⬆️', '⬇️', '↗️', '↘️', '🔄', '🔁', '↪️', '↩️', '📍'],
  numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'],
  symbols: ['✓', '✗', '★', '☆', '♦', '♠', '♣', '♥', '●', '○'],
  weather: ['☀️', '🌤️', '⛅', '🌧️', '⛈️', '❄️', '🌪️', '🌈', '💨', '🌡️'],
  sports: ['⚽', '🏀', '🎾', '⛳', '🏆', '🥇', '🎮', '🏋️', '🚴', '🏊'],
  animals: ['🦁', '🐯', '🦊', '🐺', '🦅', '🐋', '🦋', '🐝', '🦄', '🐉'],
} as const;

export const SLIDE_BACKGROUNDS = [
  // Original
  'gradient-orange',
  'gradient-dark',
  'gradient-blue',
  'gradient-purple',
  'solid-charcoal',
  'mesh-vibrant',
  // Extended
  'gradient-fire',
  'gradient-aurora',
  'gradient-cyan',
  'gradient-green',
  'gradient-emerald',
  'gradient-gold',
  'gradient-rose',
  'gradient-blood',
  'gradient-midnight-blue',
  'gradient-violet',
  'gradient-teal',
  'gradient-copper',
  'gradient-silver',
  'gradient-wine',
  'gradient-ocean-deep',
  'gradient-sunset-orange',
  'gradient-northern-lights',
  'mesh-neon',
  'mesh-galaxy',
  'mesh-tropical',
  'mesh-sunset',
  'mesh-cool',
  'solid-dark',
  'solid-black',
  'solid-navy',
  'solid-slate',
  'solid-zinc',
  'solid-deep-purple',
  'solid-deep-blue',
] as const;

// Color Palettes for coherent theming
export const COLOR_PALETTES = {
  professional: {
    name: 'Professional',
    nameDE: 'Professionell',
    colors: ['blue', 'slate', 'zinc'],
    backgrounds: ['gradient-dark', 'gradient-midnight-blue', 'solid-charcoal'],
  },
  energetic: {
    name: 'Energetic',
    nameDE: 'Energetisch',
    colors: ['orange', 'red', 'amber'],
    backgrounds: ['gradient-orange', 'gradient-fire', 'gradient-sunset-orange'],
  },
  calm: {
    name: 'Calm',
    nameDE: 'Ruhig',
    colors: ['teal', 'cyan', 'sky'],
    backgrounds: ['gradient-blue', 'gradient-cyan', 'gradient-ocean-deep'],
  },
  creative: {
    name: 'Creative',
    nameDE: 'Kreativ',
    colors: ['purple', 'violet', 'fuchsia'],
    backgrounds: ['gradient-purple', 'gradient-violet', 'gradient-aurora'],
  },
  nature: {
    name: 'Nature',
    nameDE: 'Natur',
    colors: ['green', 'teal', 'lime'],
    backgrounds: ['gradient-green', 'gradient-emerald', 'mesh-tropical'],
  },
  luxury: {
    name: 'Luxury',
    nameDE: 'Luxus',
    colors: ['gold', 'bronze', 'amber'],
    backgrounds: ['gradient-gold', 'gradient-copper', 'gradient-wine'],
  },
  dark: {
    name: 'Dark Mode',
    nameDE: 'Dunkel',
    colors: ['slate', 'zinc', 'stone'],
    backgrounds: ['solid-black', 'solid-dark', 'gradient-dark'],
  },
  vibrant: {
    name: 'Vibrant',
    nameDE: 'Lebendig',
    colors: ['pink', 'cyan', 'lime'],
    backgrounds: ['mesh-neon', 'mesh-vibrant', 'gradient-aurora'],
  },
} as const;

// Font Style Presets
export const FONT_STYLE_PRESETS = {
  bold: {
    name: 'Bold & Impactful',
    nameDE: 'Fett & Wirkungsvoll',
    heading: { fontSize: '72px', fontWeight: '900', lineHeight: 0.95 },
    subheading: { fontSize: '44px', fontWeight: '800', lineHeight: 1.1 },
    body: { fontSize: '24px', fontWeight: '400', lineHeight: 1.5 },
  },
  elegant: {
    name: 'Elegant & Clean',
    nameDE: 'Elegant & Sauber',
    heading: { fontSize: '64px', fontWeight: '700', lineHeight: 1.0 },
    subheading: { fontSize: '36px', fontWeight: '600', lineHeight: 1.2 },
    body: { fontSize: '22px', fontWeight: '400', lineHeight: 1.6 },
  },
  modern: {
    name: 'Modern & Minimal',
    nameDE: 'Modern & Minimal',
    heading: { fontSize: '56px', fontWeight: '600', lineHeight: 1.1 },
    subheading: { fontSize: '32px', fontWeight: '500', lineHeight: 1.3 },
    body: { fontSize: '20px', fontWeight: '400', lineHeight: 1.5 },
  },
  playful: {
    name: 'Playful & Fun',
    nameDE: 'Verspielt & Lustig',
    heading: { fontSize: '68px', fontWeight: '800', lineHeight: 1.0 },
    subheading: { fontSize: '40px', fontWeight: '700', lineHeight: 1.2 },
    body: { fontSize: '26px', fontWeight: '500', lineHeight: 1.4 },
  },
} as const;

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
