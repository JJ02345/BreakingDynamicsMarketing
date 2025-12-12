// AI Squad - Public API
// Exports all public interfaces for AI services

// Provider & Hook
export { AIProvider, useAI } from './AIProvider';

// Hooks
export { useAIGeneration } from './hooks/useAIGeneration';
export { useAIHealth } from './hooks/useAIHealth';

// Components
export { AIGeneratorModal } from './components/AIGeneratorModal';
export { AIStatusIndicator } from './components/AIStatusIndicator';

// Services (for advanced use cases)
export { checkHealth, callAI, getStyles } from './services/aiProxy';
export {
  generateCarouselFromHypothesis,
  getCarouselPatterns,
  getCarouselStyles,
  estimateGenerationTime,
  // Full design system access
  getAllBackgrounds,
  getAllBlockTypes,
  getAllFontSizes,
  getAllSlideTemplates,
  getAllAccentColors,
  getAllEmojiSets,
  getFullDesignSystem,
} from './services/carouselGenerator';
export {
  generatePost,
  generateHooks,
  generateIdeas,
  analyzeHook,
  generateTwitterThread,
  generateInstagramContent,
  generateNewsletter,
  generateBlogArticle,
  repurposeContent,
  generateContentCalendar,
} from './services/contentGenerator';
export {
  translateSlides,
  translateText,
  quickTranslate,
} from './services/translator';

// Constants
export {
  AI_CONFIG,
  ENDPOINTS,
  CAROUSEL_STYLES,
  CAROUSEL_PATTERNS,
  PATTERN_TO_STYLE,
  LANGUAGE_NAMES,
  // Extended design system
  ACCENT_COLORS,
  EMOJI_SETS,
  SLIDE_BACKGROUNDS,
  COLOR_PALETTES,
  FONT_STYLE_PRESETS,
  // Full carousel design system access
  BACKGROUND_STYLES,
  PDF_BACKGROUND_FALLBACKS,
  getBackgroundCSS,
  getPDFBackgroundCSS,
  BLOCK_TYPES,
  FONT_SIZES,
  PDF_FONT_SIZE_MAP,
  getFontSize,
  SLIDE_TEMPLATES,
  CAROUSEL_TEMPLATES,
  createSlide,
  createBlock,
  createDefaultCarousel,
  getSlidesForTemplate,
} from './constants';

export type {
  BackgroundStyle,
  BlockTypeDefinition,
} from './constants';

// Types
export type {
  // Carousel types
  CarouselStyle,
  CarouselPattern,
  CarouselPatterns,
  GenerationProgress,
  CarouselGenerationParams,
  SlideBlock,
  GeneratedSlide,
  CarouselMetadata,
  GeneratedCarousel,

  // Content types
  PostGenerationParams,
  GeneratedPost,
  HooksGenerationParams,
  GeneratedHooks,
  IdeasGenerationParams,
  GeneratedIdeas,
  HookAnalysisParams,
  HookAnalysis,

  // Translation types
  TranslationProgress,
  TextItem,

  // API types
  AIApiResponse,
  AISlideResponse,
  CarouselApiResponse,

  // Provider types
  AIState,
  AIContextValue,
} from './types';
