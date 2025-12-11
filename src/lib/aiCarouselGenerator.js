// ============================================
// AI CAROUSEL GENERATOR
// Re-exports from new modular AI system
// ============================================

// Re-export everything from new AI module for backwards compatibility
export {
  generateCarouselFromHypothesis,
  checkAIHealth,
  getCarouselPatterns,
  getCarouselStyles,
  estimateGenerationTime,
  CAROUSEL_STYLES,
  CAROUSEL_PATTERNS,
} from './ai/carousel';

export { default } from './ai/carousel';
