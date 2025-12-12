// Carousel Generator Service
// AI-powered LinkedIn carousel generation with full design system access

import { callAI } from './aiProxy';
import {
  CAROUSEL_PATTERNS,
  CAROUSEL_STYLES,
  PATTERN_TO_STYLE,
  ACCENT_COLORS,
  EMOJI_SETS,
  SLIDE_BACKGROUNDS,
  COLOR_PALETTES,
  FONT_STYLE_PRESETS,
  // Full design system from Carousel Squad
  BACKGROUND_STYLES,
  BLOCK_TYPES,
  FONT_SIZES,
  SLIDE_TEMPLATES,
  createSlide,
  createBlock,
} from '../constants';
import type {
  CarouselGenerationParams,
  GeneratedCarousel,
  GeneratedSlide,
  SlideBlock,
  AISlideResponse,
  CarouselApiResponse,
  SlideMood,
  ApiSlideType,
  VisualHint,
  CtaType,
} from '../types';

// ============================================
// API RESPONSE MAPPINGS
// ============================================

// Mood → Background + Accent Color
const MOOD_TO_DESIGN: Record<string, { background: string; accent: keyof typeof ACCENT_COLORS }> = {
  tension: { background: 'gradient-midnight-blue', accent: 'slate' },
  pain: { background: 'gradient-blood', accent: 'red' },
  urgency: { background: 'gradient-sunset-orange', accent: 'orange' },
  empathy: { background: 'mesh-cool', accent: 'blue' },
  insight: { background: 'gradient-purple', accent: 'purple' },
  hope: { background: 'gradient-emerald', accent: 'green' },
  action: { background: 'gradient-gold', accent: 'gold' },
  neutral: { background: 'gradient-dark', accent: 'slate' },
  excitement: { background: 'mesh-neon', accent: 'pink' },
  trust: { background: 'gradient-blue', accent: 'cyan' },
  warning: { background: 'gradient-fire', accent: 'red' },
  success: { background: 'gradient-green', accent: 'green' },
  luxury: { background: 'gradient-wine', accent: 'gold' },
  calm: { background: 'gradient-cyan', accent: 'teal' },
  power: { background: 'solid-black', accent: 'orange' },
};

// Slide Type → Template Type
const SLIDE_TYPE_TO_TEMPLATE: Record<string, string> = {
  hook: 'cover',
  problem: 'content',
  agitate: 'tip',
  discovery: 'reality',
  solution: 'step',
  cta: 'cta',
  myth: 'myth',
  truth: 'reality',
  before: 'before',
  after: 'after',
  step: 'step',
  tip: 'tip',
  stat: 'stats',
  quote: 'quote',
  proof: 'proof',
  lesson: 'lesson',
};

// CTA Type → Emoji Set + CTA Text
const CTA_TYPE_TO_EMOJIS: Record<string, { emojis: string; text: string; textDE: string }> = {
  follow: { emojis: '👤 🔔 ➕', text: 'FOLLOW ME', textDE: 'FOLGE MIR' },
  save: { emojis: '📌 💾 ⭐', text: 'SAVE THIS', textDE: 'SPEICHERN' },
  share: { emojis: '♻️ 📤 🔗', text: 'SHARE', textDE: 'TEILEN' },
  comment: { emojis: '💬 🗣️ ✍️', text: 'COMMENT', textDE: 'KOMMENTIEREN' },
  link: { emojis: '🔗 ➡️ 🌐', text: 'LEARN MORE', textDE: 'MEHR ERFAHREN' },
  subscribe: { emojis: '📧 ✉️ 📬', text: 'SUBSCRIBE', textDE: 'ABONNIEREN' },
  download: { emojis: '⬇️ 📥 🎁', text: 'DOWNLOAD', textDE: 'HERUNTERLADEN' },
  join: { emojis: '🤝 👥 🚀', text: 'JOIN US', textDE: 'MITMACHEN' },
};

// Visual Hint → Block Structure Generator
type BlockGenerator = (apiSlide: AISlideResponse, accent: { primary: string; secondary: string }) => Omit<SlideBlock, 'id'>[];

const VISUAL_HINT_TO_BLOCKS: Record<string, BlockGenerator> = {
  statement_gross: (slide, accent) => [
    { type: 'ICON', content: { emoji: getContextEmoji(slide.content), size: 'xxxl' } },
    { type: 'HEADING', content: { text: (slide.title || '').toUpperCase(), fontSize: '72px', fontWeight: '900', textAlign: 'center', color: '#FFFFFF', lineHeight: 0.95 } },
  ],
  liste_schmerz: (slide, accent) => [
    { type: 'HEADING', content: { text: slide.title || '', fontSize: '44px', fontWeight: '800', textAlign: 'center', color: '#FFFFFF' } },
    { type: 'BULLET_LIST', content: { items: slide.bullet_points || splitContent(slide.content), bulletStyle: 'dot', color: accent.primary } },
  ],
  zahlen_konsequenzen: (slide, accent) => [
    { type: 'NUMBER', content: { number: slide.stat_number || '85%', label: slide.stat_label || '', color: accent.primary } },
    { type: 'HEADING', content: { text: slide.title || '', fontSize: '44px', fontWeight: '800', textAlign: 'center', color: '#FFFFFF' } },
    { type: 'PARAGRAPH', content: { text: slide.content || '', fontSize: '24px', textAlign: 'center', color: '#B0B0B0' } },
  ],
  zitate: (slide, accent) => [
    { type: 'QUOTE', content: { text: `"${slide.content || slide.title || ''}"`, author: slide.quote_author || '', fontSize: 'xl', color: '#FFFFFF' } },
  ],
  checkliste: (slide, accent) => [
    { type: 'HEADING', content: { text: slide.title || '', fontSize: '44px', fontWeight: '800', textAlign: 'center', color: '#FFFFFF' } },
    { type: 'BULLET_LIST', content: { items: slide.bullet_points || splitContent(slide.content), bulletStyle: 'check', color: accent.primary } },
  ],
  cta_einladend: (slide, accent) => [
    { type: 'ICON', content: { emoji: '🎯', size: 'xxxl' } },
    { type: 'HEADING', content: { text: slide.title || 'FOLGE MIR', fontSize: '64px', fontWeight: '900', textAlign: 'center', color: '#FFFFFF' } },
    { type: 'PARAGRAPH', content: { text: slide.content || '', fontSize: '24px', textAlign: 'center', color: '#B0B0B0' } },
    { type: 'DIVIDER', content: { style: 'gradient', color: accent.primary, thickness: 2, width: '60%' } },
  ],
  schritt_anleitung: (slide, accent) => [
    { type: 'NUMBER', content: { number: slide.stat_number || '01', label: '', color: accent.primary } },
    { type: 'HEADING', content: { text: slide.title || '', fontSize: '44px', fontWeight: '800', textAlign: 'center', color: '#FFFFFF' } },
    { type: 'PARAGRAPH', content: { text: slide.content || '', fontSize: '24px', textAlign: 'center', color: '#B0B0B0', lineHeight: 1.4 } },
  ],
  vergleich: (slide, accent) => [
    { type: 'BADGE', content: { text: slide.title?.split(' ')[0] || 'VS', backgroundColor: accent.primary, textColor: '#FFFFFF' } },
    { type: 'HEADING', content: { text: slide.title || '', fontSize: '44px', fontWeight: '800', textAlign: 'center', color: '#FFFFFF' } },
    { type: 'BULLET_LIST', content: { items: slide.bullet_points || splitContent(slide.content), bulletStyle: 'arrow', color: '#FFFFFF' } },
  ],
  vorher_nachher: (slide, accent) => [
    { type: 'BADGE', content: { text: slide.slide_type === 'before' ? 'VORHER' : 'NACHHER', backgroundColor: slide.slide_type === 'before' ? '#EF4444' : '#10B981', textColor: '#FFFFFF' } },
    { type: 'ICON', content: { emoji: slide.slide_type === 'before' ? '😫' : '🎉', size: 'xl' } },
    { type: 'HEADING', content: { text: slide.title || '', fontSize: '44px', fontWeight: '800', textAlign: 'center', color: '#FFFFFF' } },
    { type: 'PARAGRAPH', content: { text: slide.content || '', fontSize: '24px', textAlign: 'center', color: '#B0B0B0' } },
  ],
  fakt_highlight: (slide, accent) => [
    { type: 'NUMBER', content: { number: slide.stat_number || slide.title || '', label: slide.stat_label || '', color: accent.primary } },
    { type: 'PARAGRAPH', content: { text: slide.content || '', fontSize: '28px', textAlign: 'center', color: '#FFFFFF' } },
  ],
  emotion_trigger: (slide, accent) => [
    { type: 'ICON', content: { emoji: getContextEmoji(slide.content, slide.mood), size: 'xxl' } },
    { type: 'HEADING', content: { text: slide.title || '', fontSize: '48px', fontWeight: '800', textAlign: 'center', color: '#FFFFFF' } },
    { type: 'PARAGRAPH', content: { text: slide.content || '', fontSize: '24px', textAlign: 'center', color: '#B0B0B0' } },
  ],
  mini_story: (slide, accent) => [
    { type: 'ICON', content: { emoji: getContextEmoji(slide.content), size: 'xl' } },
    { type: 'PARAGRAPH', content: { text: slide.content || slide.title || '', fontSize: '28px', textAlign: 'center', color: '#FFFFFF', lineHeight: 1.5 } },
  ],
  beweis: (slide, accent) => [
    { type: 'BADGE', content: { text: 'BEWEIS', backgroundColor: accent.primary, textColor: '#FFFFFF' } },
    { type: 'HEADING', content: { text: slide.title || '', fontSize: '44px', fontWeight: '800', textAlign: 'center', color: '#FFFFFF' } },
    { type: 'BULLET_LIST', content: { items: slide.bullet_points || splitContent(slide.content), bulletStyle: 'check', color: accent.primary } },
  ],
  warnung: (slide, accent) => [
    { type: 'ICON', content: { emoji: '⚠️', size: 'xxl' } },
    { type: 'HEADING', content: { text: slide.title || '', fontSize: '44px', fontWeight: '800', textAlign: 'center', color: '#FFFFFF' } },
    { type: 'PARAGRAPH', content: { text: slide.content || '', fontSize: '24px', textAlign: 'center', color: '#F87171' } },
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateId(prefix: string, ...parts: (number | string)[]): string {
  const uniquePart = Math.random().toString(36).substring(2, 11);
  return `${prefix}-${Date.now()}-${parts.join('-')}-${uniquePart}`;
}

function splitContent(content?: string): string[] {
  if (!content) return ['Punkt 1', 'Punkt 2', 'Punkt 3'];
  // Split by newlines, bullets, or numbers
  const lines = content.split(/[\n•\-\d\.]+/).filter(line => line.trim().length > 0);
  return lines.length > 0 ? lines.map(l => l.trim()) : [content];
}

function getContextEmoji(content?: string, mood?: string): string {
  const text = (content || '').toLowerCase();

  // Mood-based emoji selection
  if (mood) {
    const moodEmojis: Record<string, string[]> = {
      tension: ['😰', '🤔', '💭', '⚡'],
      pain: ['😫', '😤', '💔', '🔥'],
      urgency: ['⏰', '🚨', '⚡', '🔥'],
      empathy: ['🤝', '💙', '💬', '👥'],
      insight: ['💡', '🧠', '✨', '🎯'],
      hope: ['🌟', '✨', '🌈', '💫'],
      action: ['🚀', '💪', '🎯', '⚡'],
      excitement: ['🎉', '🔥', '✨', '🚀'],
      success: ['🏆', '✅', '🎉', '💯'],
      warning: ['⚠️', '🚨', '❌', '💥'],
    };
    const emojis = moodEmojis[mood] || EMOJI_SETS.business;
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  // Content-based emoji selection
  if (text.includes('fehler') || text.includes('problem') || text.includes('falsch')) {
    return EMOJI_SETS.warning[Math.floor(Math.random() * EMOJI_SETS.warning.length)];
  }
  if (text.includes('erfolg') || text.includes('gewinn') || text.includes('richtig')) {
    return EMOJI_SETS.success[Math.floor(Math.random() * EMOJI_SETS.success.length)];
  }
  if (text.includes('geld') || text.includes('umsatz') || text.includes('revenue')) {
    return EMOJI_SETS.money[Math.floor(Math.random() * EMOJI_SETS.money.length)];
  }
  if (text.includes('zeit') || text.includes('schnell') || text.includes('sofort')) {
    return EMOJI_SETS.time[Math.floor(Math.random() * EMOJI_SETS.time.length)];
  }
  if (text.includes('team') || text.includes('gemeinsam') || text.includes('zusammen')) {
    return EMOJI_SETS.social[Math.floor(Math.random() * EMOJI_SETS.social.length)];
  }

  return EMOJI_SETS.business[Math.floor(Math.random() * EMOJI_SETS.business.length)];
}

function getDesignFromMood(mood?: SlideMood, index?: number): { background: string; accent: { primary: string; secondary: string; name: string; nameDE: string } } {
  const design = mood ? MOOD_TO_DESIGN[mood] : null;

  if (design) {
    const accentColor = ACCENT_COLORS[design.accent] || ACCENT_COLORS.orange;
    return {
      background: design.background,
      accent: accentColor,
    };
  }

  // Fallback: cycle through backgrounds and colors
  const backgrounds = Object.keys(MOOD_TO_DESIGN);
  const fallbackDesign = MOOD_TO_DESIGN[backgrounds[(index || 0) % backgrounds.length]];
  const fallbackAccent = ACCENT_COLORS[fallbackDesign.accent] || ACCENT_COLORS.orange;

  return {
    background: fallbackDesign.background,
    accent: fallbackAccent,
  };
}

function getSlideTypeFromApi(slideType?: ApiSlideType): string {
  if (!slideType) return 'content';
  return SLIDE_TYPE_TO_TEMPLATE[slideType] || 'content';
}

// ============================================
// SLIDE CONVERSION - Uses API Response Fields
// ============================================

function convertApiResponseToSlides(
  apiSlides: AISlideResponse[],
  slideCount: number,
  language: string = 'de'
): Omit<GeneratedSlide, 'id' | 'order'>[] {
  const slides: Omit<GeneratedSlide, 'id' | 'order'>[] = [];
  const total = Math.min(apiSlides.length, slideCount);

  apiSlides.slice(0, slideCount).forEach((apiSlide, index) => {
    const isFirst = index === 0;
    const isLast = index === total - 1;

    // Get design from mood (API response) or fallback
    const design = getDesignFromMood(apiSlide.mood as SlideMood, index);
    const { background, accent } = design;

    // Determine slide type from API or position
    let slideType: 'cover' | 'content' | 'cta' = 'content';
    if (apiSlide.slide_type === 'hook' || isFirst) slideType = 'cover';
    else if (apiSlide.slide_type === 'cta' || isLast) slideType = 'cta';

    // Generate blocks based on visual_hint or fallback to position-based
    let blocks: Omit<SlideBlock, 'id'>[] = [];

    if (apiSlide.visual_hint && VISUAL_HINT_TO_BLOCKS[apiSlide.visual_hint]) {
      // Use visual hint mapping from API
      blocks = VISUAL_HINT_TO_BLOCKS[apiSlide.visual_hint](apiSlide, accent);
    } else {
      // Fallback: Generate blocks based on slide type
      blocks = generateFallbackBlocks(apiSlide, index, total, accent, language);
    }

    // Add CTA-specific elements for last slide
    if (isLast && apiSlide.cta_type) {
      const ctaConfig = CTA_TYPE_TO_EMOJIS[apiSlide.cta_type] || CTA_TYPE_TO_EMOJIS.follow;
      // Add CTA emojis at the end
      blocks.push({
        type: 'PARAGRAPH',
        content: {
          text: ctaConfig.emojis,
          fontSize: '36px',
          textAlign: 'center',
          color: accent.primary,
        },
      });
    }

    slides.push({
      type: slideType,
      blocks: blocks as SlideBlock[],
      styles: { background, padding: 'xl' },
    });
  });

  return slides;
}

/**
 * Fallback block generation when no visual_hint is provided
 */
function generateFallbackBlocks(
  apiSlide: AISlideResponse,
  index: number,
  total: number,
  accent: { primary: string; secondary: string },
  language: string
): Omit<SlideBlock, 'id'>[] {
  const blocks: Omit<SlideBlock, 'id'>[] = [];
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const emoji = getContextEmoji(apiSlide.content, apiSlide.mood);

  // Cover slide
  if (isFirst || apiSlide.slide_type === 'hook') {
    blocks.push({ type: 'ICON', content: { emoji, size: 'xxxl' } });
    blocks.push({
      type: 'HEADING',
      content: {
        text: (apiSlide.title || '').toUpperCase(),
        fontSize: '72px',
        fontWeight: '900',
        textAlign: 'center',
        color: '#FFFFFF',
        lineHeight: 0.95,
      },
    });
    blocks.push({
      type: 'BADGE',
      content: {
        text: '→ SWIPE',
        backgroundColor: accent.primary,
        textColor: '#FFFFFF',
      },
    });
  }
  // CTA slide
  else if (isLast || apiSlide.slide_type === 'cta') {
    const ctaText = language === 'de' ? 'FOLGE MIR' : 'FOLLOW ME';
    blocks.push({ type: 'ICON', content: { emoji: '🎯', size: 'xxxl' } });
    blocks.push({
      type: 'HEADING',
      content: {
        text: apiSlide.title || ctaText,
        fontSize: '64px',
        fontWeight: '900',
        textAlign: 'center',
        color: '#FFFFFF',
      },
    });
    if (apiSlide.content) {
      blocks.push({
        type: 'PARAGRAPH',
        content: {
          text: apiSlide.content,
          fontSize: '24px',
          textAlign: 'center',
          color: '#B0B0B0',
        },
      });
    }
  }
  // Myth slide
  else if (apiSlide.slide_type === 'myth') {
    blocks.push({
      type: 'BADGE',
      content: { text: 'MYTHOS', backgroundColor: '#EF4444', textColor: '#FFFFFF' },
    });
    blocks.push({ type: 'ICON', content: { emoji: '❌', size: 'xl' } });
    blocks.push({
      type: 'HEADING',
      content: {
        text: apiSlide.title || '',
        fontSize: '44px',
        fontWeight: '800',
        textAlign: 'center',
        color: '#FFFFFF',
      },
    });
  }
  // Truth/Reality slide
  else if (apiSlide.slide_type === 'truth' || apiSlide.slide_type === 'discovery') {
    blocks.push({
      type: 'BADGE',
      content: { text: 'REALITÄT', backgroundColor: '#10B981', textColor: '#FFFFFF' },
    });
    blocks.push({ type: 'ICON', content: { emoji: '✅', size: 'xl' } });
    blocks.push({
      type: 'HEADING',
      content: {
        text: apiSlide.title || '',
        fontSize: '44px',
        fontWeight: '800',
        textAlign: 'center',
        color: '#FFFFFF',
      },
    });
    if (apiSlide.content) {
      blocks.push({
        type: 'PARAGRAPH',
        content: {
          text: apiSlide.content,
          fontSize: '24px',
          textAlign: 'center',
          color: '#B0B0B0',
        },
      });
    }
  }
  // Step slide
  else if (apiSlide.slide_type === 'step' || apiSlide.slide_type === 'solution') {
    const slideNum = (index).toString().padStart(2, '0');
    blocks.push({
      type: 'NUMBER',
      content: { number: apiSlide.stat_number || slideNum, label: '', color: accent.primary },
    });
    blocks.push({
      type: 'HEADING',
      content: {
        text: apiSlide.title || '',
        fontSize: '44px',
        fontWeight: '800',
        textAlign: 'center',
        color: '#FFFFFF',
      },
    });
    if (apiSlide.content) {
      blocks.push({
        type: 'PARAGRAPH',
        content: {
          text: apiSlide.content,
          fontSize: '24px',
          textAlign: 'center',
          color: '#B0B0B0',
          lineHeight: 1.4,
        },
      });
    }
  }
  // Stat slide
  else if (apiSlide.slide_type === 'stat') {
    blocks.push({
      type: 'NUMBER',
      content: {
        number: apiSlide.stat_number || apiSlide.title || '85%',
        label: apiSlide.stat_label || '',
        color: accent.primary,
      },
    });
    if (apiSlide.content) {
      blocks.push({
        type: 'PARAGRAPH',
        content: {
          text: apiSlide.content,
          fontSize: '28px',
          textAlign: 'center',
          color: '#FFFFFF',
        },
      });
    }
  }
  // Quote slide
  else if (apiSlide.slide_type === 'quote') {
    blocks.push({
      type: 'QUOTE',
      content: {
        text: `"${apiSlide.content || apiSlide.title || ''}"`,
        author: apiSlide.quote_author || '',
        fontSize: 'xl',
        color: '#FFFFFF',
      },
    });
  }
  // Default content slide
  else {
    const slideNum = index.toString().padStart(2, '0');
    blocks.push({
      type: 'NUMBER',
      content: { number: slideNum, label: '', color: accent.primary },
    });
    blocks.push({ type: 'ICON', content: { emoji, size: 'xl' } });

    if (apiSlide.title) {
      blocks.push({
        type: 'HEADING',
        content: {
          text: apiSlide.title,
          fontSize: '44px',
          fontWeight: '800',
          textAlign: 'center',
          color: '#FFFFFF',
          lineHeight: 1.05,
        },
      });
    }

    if (apiSlide.bullet_points && apiSlide.bullet_points.length > 0) {
      blocks.push({
        type: 'BULLET_LIST',
        content: {
          items: apiSlide.bullet_points,
          bulletStyle: 'check',
          color: accent.primary,
        },
      });
    } else if (apiSlide.content) {
      blocks.push({
        type: 'PARAGRAPH',
        content: {
          text: apiSlide.content,
          fontSize: '24px',
          textAlign: 'center',
          color: '#B0B0B0',
          lineHeight: 1.4,
        },
      });
    }
  }

  return blocks;
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

/**
 * Generate carousel from hypothesis using AI
 */
export async function generateCarouselFromHypothesis(
  params: CarouselGenerationParams
): Promise<GeneratedCarousel> {
  const {
    hypothesis,
    pattern = 'problem_solution',
    slideCount = 5,
    tone = 'professional',
    language = 'de',
    style = null,
    onProgress = () => {},
  } = params;

  // Validate input
  if (!hypothesis || hypothesis.trim().length < 10) {
    throw new Error('Bitte gib eine Hypothese mit mindestens 10 Zeichen ein.');
  }

  onProgress({ stage: 'analyzing', percentage: 10 });

  try {
    onProgress({ stage: 'generating', percentage: 30 });

    // Use style or map from pattern
    const apiStyle = style || PATTERN_TO_STYLE[pattern] || 'viral';

    const result = await callAI<CarouselApiResponse>('carousel', {
      topic: hypothesis.trim(),
      slides: slideCount,
      style: apiStyle,
      tone: tone,
      language: language,
    });

    onProgress({ stage: 'formatting', percentage: 70 });

    // Handle API response
    const apiSlides = result.data?.slides || result.slides || [];

    if (!Array.isArray(apiSlides) || apiSlides.length === 0) {
      throw new Error('Ungültige Antwort vom AI-Server');
    }

    const slides = convertApiResponseToSlides(apiSlides, slideCount, language);

    // Add unique IDs
    const slidesWithIds: GeneratedSlide[] = slides.map((slide, slideIndex) => ({
      id: generateId('slide', slideIndex),
      ...slide,
      blocks: slide.blocks.map((block, blockIndex) => ({
        id: generateId('block', slideIndex, blockIndex),
        ...block,
        content: { ...block.content },
      })),
      order: slideIndex + 1,
    }));

    onProgress({ stage: 'complete', percentage: 100 });

    return {
      title: result.data?.title || result.title || hypothesis.slice(0, 50),
      slides: slidesWithIds,
      settings: { width: 1080, height: 1080 },
      metadata: {
        generatedAt: new Date().toISOString(),
        hypothesis,
        pattern,
        style: apiStyle,
        slideCount,
        tone,
        language,
        aiGenerated: true,
        model: result.data?.model || result.model || 'marketing-beast',
      },
    };
  } catch (error) {
    console.error('[CarouselGenerator] Generation failed:', error);

    if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('AI-Server nicht erreichbar. Bitte später erneut versuchen.');
      }
      throw error;
    }

    throw new Error('Carousel-Generierung fehlgeschlagen');
  }
}

// ============================================
// UTILITY EXPORTS
// ============================================

export function getCarouselPatterns() {
  return CAROUSEL_PATTERNS;
}

export function getCarouselStyles() {
  return CAROUSEL_STYLES;
}

export function estimateGenerationTime(slideCount: number): number {
  return 5 + Math.ceil(slideCount * 0.5);
}

// ============================================
// FULL DESIGN SYSTEM ACCESS
// ============================================

/**
 * Get all available backgrounds for AI to choose from
 */
export function getAllBackgrounds() {
  return {
    styles: BACKGROUND_STYLES,
    available: Object.keys(BACKGROUND_STYLES),
    byCategory: {
      solid: Object.entries(BACKGROUND_STYLES)
        .filter(([_, style]) => style.category === 'solid')
        .map(([key]) => key),
      gradient: Object.entries(BACKGROUND_STYLES)
        .filter(([_, style]) => style.category === 'gradient')
        .map(([key]) => key),
      mesh: Object.entries(BACKGROUND_STYLES)
        .filter(([_, style]) => style.category === 'mesh')
        .map(([key]) => key),
    },
  };
}

/**
 * Get all available block types for AI to use
 */
export function getAllBlockTypes() {
  return {
    types: BLOCK_TYPES,
    available: Object.keys(BLOCK_TYPES),
    byCategory: {
      text: Object.entries(BLOCK_TYPES)
        .filter(([_, def]) => def.category === 'text')
        .map(([key]) => key),
      media: Object.entries(BLOCK_TYPES)
        .filter(([_, def]) => def.category === 'media')
        .map(([key]) => key),
      layout: Object.entries(BLOCK_TYPES)
        .filter(([_, def]) => def.category === 'layout')
        .map(([key]) => key),
      data: Object.entries(BLOCK_TYPES)
        .filter(([_, def]) => def.category === 'data')
        .map(([key]) => key),
    },
  };
}

/**
 * Get all font sizes available
 */
export function getAllFontSizes() {
  return {
    sizes: FONT_SIZES,
    available: Object.keys(FONT_SIZES),
    labels: Object.entries(FONT_SIZES).map(([key, val]) => ({
      key,
      label: val.label,
      size: val.size,
    })),
  };
}

/**
 * Get all slide templates for AI to use
 */
export function getAllSlideTemplates() {
  return {
    templates: SLIDE_TEMPLATES,
    available: Object.keys(SLIDE_TEMPLATES),
    byPurpose: {
      intro: ['cover', 'aboutIntro'],
      content: ['content', 'tip', 'step', 'journey', 'proof', 'stats'],
      contrast: ['myth', 'reality', 'before', 'after', 'option', 'comparison'],
      conclusion: ['cta', 'quote', 'lesson', 'result', 'funFact'],
      special: ['blank', 'opinion', 'aboutWho', 'aboutWhat', 'aboutWhy'],
    },
  };
}

/**
 * Get all accent colors for AI theming
 */
export function getAllAccentColors() {
  return ACCENT_COLORS;
}

/**
 * Get all emoji sets for content decoration
 */
export function getAllEmojiSets() {
  return EMOJI_SETS;
}

/**
 * Complete design system access for AI
 * This provides everything the AI needs to create visually rich carousels
 */
export function getFullDesignSystem() {
  return {
    backgrounds: getAllBackgrounds(),
    blockTypes: getAllBlockTypes(),
    fontSizes: getAllFontSizes(),
    slideTemplates: getAllSlideTemplates(),
    accentColors: getAllAccentColors(),
    emojiSets: getAllEmojiSets(),
    patterns: CAROUSEL_PATTERNS,
    styles: CAROUSEL_STYLES,
    // Helper functions for creating content
    helpers: {
      createSlide,
      createBlock,
    },
  };
}

export default {
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
};
