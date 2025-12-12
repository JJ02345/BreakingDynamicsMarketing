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
  LANGUAGE_NAMES,
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
