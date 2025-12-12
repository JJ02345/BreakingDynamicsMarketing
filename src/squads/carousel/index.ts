// Carousel Squad - Public API
// Exports all public interfaces for carousel editor

// Hooks
export { useCarousel } from './hooks/useCarousel';
export { useBranding } from './hooks/useBranding';

// Services
export {
  generateCarouselPDF,
  generateAndDownloadPDF,
  generatePDFBlob,
  downloadPDF,
  captureSlideImage,
} from './services/pdfExporter';

export {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  createCarousel,
  updateCarousel,
  deleteCarousel,
  getCarousel,
  getUserCarousels,
  getUserCarouselCount,
} from './services/carouselStorage';

// Templates
export {
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
} from './templates';

export type { BackgroundStyle, BlockTypeDefinition } from './templates';

// Types
export type {
  // Block types
  BlockType,
  BlockContentBase,
  HeadingContent,
  ParagraphContent,
  IconContent,
  ImageContent,
  NumberContent,
  BadgeContent,
  BulletListContent,
  BrandingContent,
  DividerContent,
  QuoteContent,
  BlockContent,
  Block,

  // Slide types
  SlideType,
  BackgroundType,
  SlideStyles,
  Slide,

  // Carousel types
  CarouselSettings,
  CarouselMetadata,
  Carousel,

  // Template types
  CarouselTemplate,

  // Export types
  ExportOptions,
  ExportProgress,

  // Editor state
  CarouselEditorState,
  CarouselEditorActions,

  // Branding
  BrandingSettings,

  // Provider
  CarouselContextValue,
} from './types';
