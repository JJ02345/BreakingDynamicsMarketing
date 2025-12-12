// AI Squad Types
// Type definitions for AI generation services

// ============================================
// CAROUSEL GENERATION
// ============================================

export interface CarouselStyle {
  id: string;
  name: string;
  nameDE: string;
  description: string;
}

export interface CarouselPattern {
  name: string;
  slides: string[];
}

export interface CarouselPatterns {
  [key: string]: CarouselPattern;
}

export interface GenerationProgress {
  stage: 'analyzing' | 'generating' | 'formatting' | 'complete' | '';
  percentage: number;
}

export interface CarouselGenerationParams {
  hypothesis: string;
  pattern?: string;
  slideCount?: number;
  tone?: 'professional' | 'casual' | 'provocative';
  language?: string;
  style?: string;
  onProgress?: (progress: GenerationProgress) => void;
}

export interface SlideBlock {
  id: string;
  type: string;
  content: Record<string, unknown>;
}

export interface GeneratedSlide {
  id: string;
  type: 'cover' | 'content' | 'cta';
  blocks: SlideBlock[];
  styles: {
    background: string;
    padding: string;
  };
  order: number;
}

export interface CarouselMetadata {
  generatedAt: string;
  hypothesis: string;
  pattern: string;
  style: string;
  slideCount: number;
  tone: string;
  language: string;
  aiGenerated: boolean;
  model: string;
}

export interface GeneratedCarousel {
  title: string;
  slides: GeneratedSlide[];
  settings: {
    width: number;
    height: number;
  };
  metadata: CarouselMetadata;
}

// ============================================
// CONTENT GENERATION
// ============================================

export interface PostGenerationParams {
  topic: string;
  style?: string;
  tone?: string;
  language?: string;
  includeEmojis?: boolean;
  includeHashtags?: boolean;
  maxLength?: number;
}

export interface GeneratedPost {
  post: string;
  hashtags: string[];
  hook: string;
  metadata: {
    generatedAt: string;
    topic: string;
    style: string;
    model: string;
  };
}

export interface HooksGenerationParams {
  topic: string;
  count?: number;
  style?: string;
  language?: string;
}

export interface GeneratedHooks {
  hooks: string[];
  metadata: {
    generatedAt: string;
    topic: string;
    count: number;
    style: string;
  };
}

export interface IdeasGenerationParams {
  topic: string;
  count?: number;
  platform?: string;
  language?: string;
}

export interface GeneratedIdeas {
  ideas: string[];
  metadata: {
    generatedAt: string;
    topic: string;
    platform: string;
  };
}

export interface HookAnalysisParams {
  hook: string;
  language?: string;
}

export interface HookAnalysis {
  score: number;
  feedback: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

// ============================================
// TRANSLATION
// ============================================

export interface TranslationProgress {
  stage: 'extracting' | 'translating' | 'applying' | 'complete';
  percentage: number;
}

export interface TextItem {
  path: string;
  value: string;
}

// ============================================
// API RESPONSE
// ============================================

export interface AIApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Mood types from API - determines background and accent color
export type SlideMood =
  | 'tension'    // gradient-midnight-blue + white
  | 'pain'       // gradient-blood + red
  | 'urgency'    // gradient-sunset-orange + orange
  | 'empathy'    // mesh-cool + blue
  | 'insight'    // gradient-purple + purple
  | 'hope'       // gradient-emerald + green
  | 'action'     // gradient-gold + gold
  | 'neutral'    // gradient-dark + slate
  | 'excitement' // mesh-neon + pink
  | 'trust'      // gradient-blue + cyan
  | 'warning'    // gradient-fire + red
  | 'success'    // gradient-green + green
  | 'luxury'     // gradient-wine + gold
  | 'calm'       // gradient-cyan + teal
  | 'power'      // solid-black + orange;

// Slide type from API - determines template
export type ApiSlideType =
  | 'hook'       // cover
  | 'problem'    // content
  | 'agitate'    // tip (warning style)
  | 'discovery'  // reality
  | 'solution'   // step
  | 'cta'        // cta
  | 'myth'       // myth
  | 'truth'      // reality
  | 'before'     // before
  | 'after'      // after
  | 'step'       // step
  | 'tip'        // tip
  | 'stat'       // stats
  | 'quote'      // quote
  | 'proof'      // proof
  | 'lesson'     // lesson;

// Visual hint from API - determines block structure
export type VisualHint =
  | 'statement_gross'      // ICON + HEADING (big statement)
  | 'liste_schmerz'        // HEADING + BULLET_LIST (pain points)
  | 'zahlen_konsequenzen'  // HEADING + NUMBER + PARAGRAPH (stats)
  | 'zitate'               // QUOTE
  | 'checkliste'           // HEADING + BULLET_LIST with checkmarks
  | 'cta_einladend'        // HEADING + PARAGRAPH + BADGE (inviting CTA)
  | 'schritt_anleitung'    // NUMBER + HEADING + PARAGRAPH (step)
  | 'vergleich'            // HEADING + BULLET_LIST (comparison)
  | 'vorher_nachher'       // BADGE + HEADING + PARAGRAPH (before/after)
  | 'fakt_highlight'       // NUMBER + HEADING (fact highlight)
  | 'emotion_trigger'      // ICON + HEADING + PARAGRAPH
  | 'mini_story'           // ICON + PARAGRAPH (narrative)
  | 'beweis'               // HEADING + BULLET_LIST + PARAGRAPH (proof)
  | 'warnung';             // ICON + HEADING + PARAGRAPH (warning)

// CTA type from API - determines emoji set and call-to-action style
export type CtaType =
  | 'follow'       // social engagement
  | 'save'         // bookmark action
  | 'share'        // viral spread
  | 'comment'      // discussion
  | 'link'         // external action
  | 'subscribe'    // newsletter
  | 'download'     // resource
  | 'join';        // community

export interface AISlideResponse {
  title?: string;
  content?: string;
  // Extended API response fields
  slide_type?: ApiSlideType;
  mood?: SlideMood;
  visual_hint?: VisualHint;
  cta_type?: CtaType;
  // Additional optional fields
  bullet_points?: string[];
  stat_number?: string;
  stat_label?: string;
  quote_author?: string;
}

export interface CarouselApiResponse {
  title?: string;
  slides?: AISlideResponse[];
  model?: string;
  data?: {
    title?: string;
    slides?: AISlideResponse[];
    model?: string;
  };
}

// ============================================
// AI PROVIDER STATE
// ============================================

export interface AIState {
  isAvailable: boolean;
  isChecking: boolean;
  lastCheck: Date | null;
  error: string | null;
}

export interface AIContextValue extends AIState {
  checkHealth: () => Promise<boolean>;
  generateCarousel: (params: CarouselGenerationParams) => Promise<GeneratedCarousel>;
  generatePost: (params: PostGenerationParams) => Promise<GeneratedPost>;
  generateHooks: (params: HooksGenerationParams) => Promise<GeneratedHooks>;
  generateIdeas: (params: IdeasGenerationParams) => Promise<GeneratedIdeas>;
  analyzeHook: (params: HookAnalysisParams) => Promise<HookAnalysis>;
}
