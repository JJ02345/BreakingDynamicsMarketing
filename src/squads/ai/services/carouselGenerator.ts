// Carousel Generator Service
// AI-powered LinkedIn carousel generation

import { callAI } from './aiProxy';
import {
  CAROUSEL_PATTERNS,
  CAROUSEL_STYLES,
  PATTERN_TO_STYLE,
  ACCENT_COLORS,
  EMOJI_SETS,
  SLIDE_BACKGROUNDS,
} from '../constants';
import type {
  CarouselGenerationParams,
  GeneratedCarousel,
  GeneratedSlide,
  SlideBlock,
  AISlideResponse,
  CarouselApiResponse,
} from '../types';

// ============================================
// VISUAL DESIGN HELPERS
// ============================================

function getSmartEmoji(index: number, total: number, content?: string): string {
  const contentLower = (content || '').toLowerCase();

  if (index === 0) {
    return EMOJI_SETS.business[Math.floor(Math.random() * EMOJI_SETS.business.length)];
  }
  if (index === total - 1) {
    return EMOJI_SETS.success[Math.floor(Math.random() * EMOJI_SETS.success.length)];
  }

  if (
    contentLower.includes('fehler') ||
    contentLower.includes('problem') ||
    contentLower.includes('mistake')
  ) {
    return EMOJI_SETS.warning[Math.floor(Math.random() * EMOJI_SETS.warning.length)];
  }
  if (
    contentLower.includes('tipp') ||
    contentLower.includes('lösung') ||
    contentLower.includes('solution')
  ) {
    return EMOJI_SETS.success[Math.floor(Math.random() * EMOJI_SETS.success.length)];
  }

  return EMOJI_SETS.business[index % EMOJI_SETS.business.length];
}

function getSlideBackground(index: number, total: number): string {
  if (index === 0) return 'gradient-orange';
  if (index === total - 1) return 'gradient-orange';
  return SLIDE_BACKGROUNDS[(index + 1) % SLIDE_BACKGROUNDS.length];
}

function getAccentColor(index: number): { primary: string; secondary: string } {
  const colors = Object.values(ACCENT_COLORS);
  return colors[index % colors.length];
}

function generateId(prefix: string, ...parts: (number | string)[]): string {
  const uniquePart = Math.random().toString(36).substring(2, 11);
  return `${prefix}-${Date.now()}-${parts.join('-')}-${uniquePart}`;
}

// ============================================
// SLIDE CONVERSION
// ============================================

function convertApiResponseToSlides(
  apiSlides: AISlideResponse[],
  slideCount: number
): Omit<GeneratedSlide, 'id' | 'order'>[] {
  const slides: Omit<GeneratedSlide, 'id' | 'order'>[] = [];
  const total = Math.min(apiSlides.length, slideCount);

  apiSlides.slice(0, slideCount).forEach((apiSlide, index) => {
    const isFirst = index === 0;
    const isLast = index === total - 1;
    const background = getSlideBackground(index, total);
    const accent = getAccentColor(index);
    const emoji = getSmartEmoji(index, total, apiSlide.content);

    const blocks: Omit<SlideBlock, 'id'>[] = [];

    // Cover slide
    if (isFirst) {
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
    else if (isLast) {
      blocks.push({ type: 'ICON', content: { emoji: '🎯', size: 'xxxl' } });
      blocks.push({
        type: 'HEADING',
        content: {
          text: apiSlide.title || 'FOLGE MIR',
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
      blocks.push({
        type: 'PARAGRAPH',
        content: {
          text: '💬  ♻️  🔔',
          fontSize: '36px',
          textAlign: 'center',
          color: accent.primary,
        },
      });
    }
    // Content slides
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

    slides.push({
      type: isFirst ? 'cover' : isLast ? 'cta' : 'content',
      blocks: blocks as SlideBlock[],
      styles: { background, padding: 'xl' },
    });
  });

  return slides;
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

    const slides = convertApiResponseToSlides(apiSlides, slideCount);

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

export default {
  generateCarouselFromHypothesis,
  getCarouselPatterns,
  getCarouselStyles,
  estimateGenerationTime,
};
