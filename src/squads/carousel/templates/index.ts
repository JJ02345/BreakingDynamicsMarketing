// Carousel Templates - Public API

export { BACKGROUND_STYLES, PDF_BACKGROUND_FALLBACKS, getBackgroundCSS, getPDFBackgroundCSS } from './backgrounds';
export type { BackgroundStyle } from './backgrounds';

export { BLOCK_TYPES, FONT_SIZES, PDF_FONT_SIZE_MAP, getFontSize } from './blockTypes';
export type { BlockTypeDefinition } from './blockTypes';

export {
  SLIDE_TEMPLATES,
  CAROUSEL_TEMPLATES,
  createSlide,
  createBlock,
  createDefaultCarousel,
  getSlidesForTemplate
} from './slideTemplates';
