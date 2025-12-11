// ============================================
// AI CAROUSEL GENERATOR
// Generates LinkedIn carousels using local AI
// ============================================

import { callAI, checkHealth } from './config';

// Available carousel styles from the API
export const CAROUSEL_STYLES = [
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
];

// Template patterns (kept for backwards compatibility)
export const CAROUSEL_PATTERNS = {
  problem_solution: { name: 'Problem → Lösung', slides: ['hook', 'problem', 'agitate', 'solution', 'benefits', 'cta'] },
  listicle: { name: 'Listicle', slides: ['hook', 'point1', 'point2', 'point3', 'point4', 'cta'] },
  story: { name: 'Story', slides: ['hook', 'background', 'conflict', 'resolution', 'lesson', 'cta'] },
  comparison: { name: 'Vergleich', slides: ['hook', 'optionA', 'optionB', 'analysis', 'recommendation', 'cta'] },
  myth_busting: { name: 'Mythen aufklären', slides: ['hook', 'myth1', 'truth1', 'myth2', 'truth2', 'cta'] },
};

// Map pattern to style
const patternToStyle = {
  problem_solution: 'viral',
  listicle: 'listicle',
  story: 'storytelling',
  comparison: 'comparison',
  myth_busting: 'myth',
};

// ============================================
// VISUAL DESIGN SYSTEM
// ============================================

const ACCENT_COLORS = {
  orange: { primary: '#FF6B35', secondary: '#FF8C5A' },
  purple: { primary: '#8B5CF6', secondary: '#A78BFA' },
  green: { primary: '#10B981', secondary: '#34D399' },
  blue: { primary: '#3B82F6', secondary: '#60A5FA' },
  cyan: { primary: '#06B6D4', secondary: '#22D3EE' },
};

const EMOJI_SETS = {
  business: ['💼', '📈', '🎯', '💡', '🚀', '⚡', '✨', '🏆'],
  growth: ['📊', '📈', '🌱', '🔥', '⬆️', '💪', '🎯', '🏅'],
  warning: ['⚠️', '🚨', '❌', '🔴', '⛔', '💥', '😱', '🤔'],
  success: ['✅', '🎉', '🏆', '🥇', '💯', '🌟', '👑', '🎊'],
};

const getSmartEmoji = (index, total, content) => {
  const contentLower = (content || '').toLowerCase();

  if (index === 0) return EMOJI_SETS.business[Math.floor(Math.random() * EMOJI_SETS.business.length)];
  if (index === total - 1) return EMOJI_SETS.success[Math.floor(Math.random() * EMOJI_SETS.success.length)];

  if (contentLower.includes('fehler') || contentLower.includes('problem') || contentLower.includes('mistake')) {
    return EMOJI_SETS.warning[Math.floor(Math.random() * EMOJI_SETS.warning.length)];
  }
  if (contentLower.includes('tipp') || contentLower.includes('lösung') || contentLower.includes('solution')) {
    return EMOJI_SETS.success[Math.floor(Math.random() * EMOJI_SETS.success.length)];
  }

  return EMOJI_SETS.business[index % EMOJI_SETS.business.length];
};

const getSlideBackground = (index, total) => {
  const backgrounds = ['gradient-orange', 'gradient-dark', 'gradient-blue', 'gradient-purple', 'solid-charcoal', 'mesh-vibrant'];
  if (index === 0) return 'gradient-orange';
  if (index === total - 1) return 'gradient-orange';
  return backgrounds[(index + 1) % backgrounds.length];
};

const getAccentColor = (index) => {
  const colors = Object.values(ACCENT_COLORS);
  return colors[index % colors.length];
};

/**
 * Convert API response to slide format
 */
const convertApiResponseToSlides = (apiSlides, slideCount) => {
  const slides = [];
  const total = Math.min(apiSlides.length, slideCount);

  apiSlides.slice(0, slideCount).forEach((apiSlide, index) => {
    const isFirst = index === 0;
    const isLast = index === total - 1;
    const background = getSlideBackground(index, total);
    const accent = getAccentColor(index);
    const emoji = getSmartEmoji(index, total, apiSlide.content);

    const blocks = [];

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
        content: { text: '→ SWIPE', backgroundColor: accent.primary, textColor: '#FFFFFF' },
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
          content: { text: apiSlide.content, fontSize: '24px', textAlign: 'center', color: '#B0B0B0' },
        });
      }
      blocks.push({
        type: 'PARAGRAPH',
        content: { text: '💬  ♻️  🔔', fontSize: '36px', textAlign: 'center', color: accent.primary },
      });
    }
    // Content slides
    else {
      const slideNum = index.toString().padStart(2, '0');
      blocks.push({ type: 'NUMBER', content: { number: slideNum, label: '', color: accent.primary } });
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
      blocks,
      styles: { background, padding: 'xl' },
    });
  });

  return slides;
};

/**
 * Generate carousel from hypothesis using AI
 */
export const generateCarouselFromHypothesis = async ({
  hypothesis,
  pattern = 'problem_solution',
  slideCount = 5,
  tone = 'professional',
  language = 'de',
  style = null,
  onProgress = () => {},
}) => {
  if (!hypothesis || hypothesis.trim().length < 10) {
    throw new Error('Bitte gib eine Hypothese mit mindestens 10 Zeichen ein.');
  }

  onProgress({ stage: 'analyzing', percentage: 10 });

  try {
    onProgress({ stage: 'generating', percentage: 30 });

    // Use style or map from pattern
    const apiStyle = style || patternToStyle[pattern] || 'viral';

    const result = await callAI('carousel', {
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
    const slidesWithIds = slides.map((slide, slideIndex) => ({
      id: `slide-${Date.now()}-${slideIndex}-${Math.random().toString(36).substr(2, 9)}`,
      ...slide,
      blocks: slide.blocks.map((block, blockIndex) => ({
        id: `block-${Date.now()}-${slideIndex}-${blockIndex}-${Math.random().toString(36).substr(2, 9)}`,
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
    console.error('AI Carousel Generation failed:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('AI-Server nicht erreichbar. Bitte später erneut versuchen.');
    }

    throw error;
  }
};

/**
 * Check if AI is available
 */
export const checkAIHealth = checkHealth;

/**
 * Get carousel patterns
 */
export const getCarouselPatterns = () => CAROUSEL_PATTERNS;

/**
 * Get carousel styles
 */
export const getCarouselStyles = () => CAROUSEL_STYLES;

/**
 * Estimate generation time
 */
export const estimateGenerationTime = (slideCount) => 5 + Math.ceil(slideCount * 0.5);

export default {
  generateCarouselFromHypothesis,
  getCarouselPatterns,
  getCarouselStyles,
  estimateGenerationTime,
  checkAIHealth,
  CAROUSEL_STYLES,
  CAROUSEL_PATTERNS,
};
