// Carousel Squad Types
// Type definitions for the carousel editor

// ============================================
// BLOCK TYPES
// ============================================

export type BlockType =
  | 'HEADING'
  | 'PARAGRAPH'
  | 'ICON'
  | 'IMAGE'
  | 'NUMBER'
  | 'BADGE'
  | 'BULLET_LIST'
  | 'BRANDING'
  | 'DIVIDER'
  | 'QUOTE';

export interface BlockContentBase {
  [key: string]: unknown;
}

export interface HeadingContent extends BlockContentBase {
  text: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  lineHeight?: number;
}

export interface ParagraphContent extends BlockContentBase {
  text: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  lineHeight?: number;
}

export interface IconContent extends BlockContentBase {
  emoji: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
}

export interface ImageContent extends BlockContentBase {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  borderRadius?: string;
}

export interface NumberContent extends BlockContentBase {
  number: string;
  label?: string;
  color?: string;
}

export interface BadgeContent extends BlockContentBase {
  text: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface BulletListContent extends BlockContentBase {
  items: string[];
  bulletStyle?: 'dot' | 'check' | 'arrow' | 'number';
  color?: string;
}

export interface BrandingContent extends BlockContentBase {
  name?: string;
  tagline?: string;
  avatarUrl?: string;
  showName?: boolean;
  showTagline?: boolean;
}

export interface DividerContent extends BlockContentBase {
  style?: 'solid' | 'dashed' | 'dotted' | 'gradient';
  color?: string;
  thickness?: number;
  width?: string;
}

export interface QuoteContent extends BlockContentBase {
  text: string;
  author?: string;
  fontSize?: string;
  color?: string;
}

export type BlockContent =
  | HeadingContent
  | ParagraphContent
  | IconContent
  | ImageContent
  | NumberContent
  | BadgeContent
  | BulletListContent
  | BrandingContent
  | DividerContent
  | QuoteContent;

// ============================================
// BLOCK
// ============================================

export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  position?: {
    x: number;
    y: number;
  };
  styles?: {
    margin?: string;
    padding?: string;
    [key: string]: unknown;
  };
}

// ============================================
// SLIDE TYPES
// ============================================

export type SlideType =
  | 'cover'
  | 'content'
  | 'cta'
  | 'blank'
  | 'tip'
  | 'step'
  | 'myth'
  | 'reality'
  | 'option'
  | 'comparison'
  | 'journey'
  | 'quote'
  | 'stats'
  | 'before'
  | 'after'
  | 'lesson'
  | 'opinion'
  | 'proof'
  | 'aboutIntro'
  | 'aboutWho'
  | 'aboutWhat'
  | 'aboutWhy'
  | 'funFact'
  | 'result';

export type BackgroundType =
  | 'gradient-orange'
  | 'gradient-dark'
  | 'gradient-blue'
  | 'gradient-purple'
  | 'solid-charcoal'
  | 'solid-black'
  | 'solid-white'
  | 'mesh-vibrant'
  | 'custom-image';

export interface SlideStyles {
  background: BackgroundType | string;
  backgroundImage?: string | null;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface Slide {
  id: string;
  type: SlideType;
  blocks: Block[];
  styles: SlideStyles;
  order?: number;
}

// ============================================
// CAROUSEL
// ============================================

export interface CarouselSettings {
  width: number;
  height: number;
}

export interface CarouselMetadata {
  generatedAt?: string;
  hypothesis?: string;
  pattern?: string;
  style?: string;
  slideCount?: number;
  tone?: string;
  language?: string;
  aiGenerated?: boolean;
  model?: string;
}

export interface Carousel {
  id?: string;
  title: string;
  slides: Slide[];
  settings: CarouselSettings;
  metadata?: CarouselMetadata;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// TEMPLATE TYPES
// ============================================

export interface CarouselTemplate {
  id: string;
  name: string;
  nameDE: string;
  description: string;
  descriptionDE: string;
  icon: string;
  slideCount: number;
  isPremium?: boolean;
  isNew?: boolean;
}

// ============================================
// EXPORT TYPES
// ============================================

export interface ExportOptions {
  filename?: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'pdf' | 'png' | 'jpg';
  onProgress?: (progress: ExportProgress) => void;
}

export interface ExportProgress {
  stage: 'preparing' | 'rendering' | 'generating' | 'complete';
  percentage: number;
  currentSlide?: number;
  totalSlides?: number;
}

// ============================================
// EDITOR STATE
// ============================================

export interface CarouselEditorState {
  slides: Slide[];
  activeSlideIndex: number;
  title: string;
  previewMode: boolean;
  contentLanguage: string;
  isTranslating: boolean;
  isSaving: boolean;
  isExporting: boolean;
  exportProgress: number;
}

export interface CarouselEditorActions {
  setSlides: (slides: Slide[] | ((prev: Slide[]) => Slide[])) => void;
  setActiveSlideIndex: (index: number) => void;
  setTitle: (title: string) => void;
  addSlide: (slide: Slide) => void;
  deleteSlide: (index: number) => void;
  duplicateSlide: (index: number) => void;
  moveSlide: (fromIndex: number, toIndex: number) => void;
  updateSlide: (index: number, slide: Slide) => void;
  addBlock: (slideIndex: number, block: Block) => void;
  updateBlock: (slideIndex: number, blockIndex: number, block: Block) => void;
  deleteBlock: (slideIndex: number, blockIndex: number) => void;
}

// ============================================
// BRANDING
// ============================================

export interface BrandingSettings {
  showBranding: boolean;
  name?: string;
  tagline?: string;
  avatarUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

// ============================================
// PROVIDER CONTEXT
// ============================================

export interface CarouselContextValue extends CarouselEditorState, CarouselEditorActions {
  // Additional context methods
  save: () => Promise<void>;
  exportPDF: (options?: ExportOptions) => Promise<void>;
  translateSlides: (targetLanguage: string) => Promise<void>;
  loadCarousel: (id: string) => Promise<void>;
  createFromTemplate: (templateId: string) => void;
  reset: () => void;
}
