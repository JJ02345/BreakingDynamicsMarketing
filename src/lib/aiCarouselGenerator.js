// ============================================
// AI CAROUSEL GENERATOR
// Connected to Ollama API on homeserver
// ============================================

// API Configuration
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'https://nonlogistic-unnative-dominique.ngrok-free.dev/api/carousel';
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || 'lk-carousel-j4k5ch-2024-prod';

// Template patterns for different carousel types
const CAROUSEL_PATTERNS = {
  problem_solution: {
    name: 'Problem → Lösung',
    slides: ['hook', 'problem', 'agitate', 'solution', 'benefits', 'cta']
  },
  listicle: {
    name: 'Listicle',
    slides: ['hook', 'point1', 'point2', 'point3', 'point4', 'cta']
  },
  story: {
    name: 'Story',
    slides: ['hook', 'background', 'conflict', 'resolution', 'lesson', 'cta']
  },
  comparison: {
    name: 'Vergleich',
    slides: ['hook', 'optionA', 'optionB', 'analysis', 'recommendation', 'cta']
  },
  myth_busting: {
    name: 'Mythen aufklären',
    slides: ['hook', 'myth1', 'truth1', 'myth2', 'truth2', 'cta']
  }
};

// Background styles mapping
const BACKGROUND_STYLES = [
  'gradient-orange',
  'solid-dark',
  'gradient-dark',
  'gradient-purple',
  'gradient-blue',
  'gradient-green'
];

/**
 * Convert AI API response to our slide format
 */
const convertApiResponseToSlides = (apiSlides, slideCount) => {
  const slides = [];

  apiSlides.slice(0, slideCount).forEach((apiSlide, index) => {
    const isFirst = index === 0;
    const isLast = index === apiSlides.length - 1 || index === slideCount - 1;

    // Determine slide type and background
    let slideType = 'option';
    let background = 'solid-dark';

    if (isFirst) {
      slideType = 'cover';
      background = 'gradient-orange';
    } else if (isLast) {
      slideType = 'cta';
      background = 'gradient-orange';
    } else if (apiSlide.type === 'stats' || apiSlide.heading?.includes('%')) {
      slideType = 'stats';
      background = 'gradient-purple';
    } else {
      background = BACKGROUND_STYLES[index % BACKGROUND_STYLES.length];
    }

    // Build blocks from API response
    const blocks = [];

    // Add emoji/icon if present
    if (apiSlide.emoji) {
      blocks.push({
        type: 'ICON',
        content: { emoji: apiSlide.emoji, size: isFirst ? 'xxl' : 'xl' }
      });
    }

    // Add slide number for middle slides
    if (!isFirst && !isLast && index < 10) {
      blocks.push({
        type: 'NUMBER',
        content: { number: `0${index}`, label: '', color: '#FF6B35' }
      });
    }

    // Add heading
    if (apiSlide.heading || apiSlide.title) {
      blocks.push({
        type: 'HEADING',
        content: {
          text: apiSlide.heading || apiSlide.title,
          fontSize: isFirst ? 'xxl' : 'xl',
          fontWeight: 'bold',
          textAlign: isFirst || isLast ? 'center' : 'left',
          color: '#FFFFFF'
        }
      });
    }

    // Add subheading if present
    if (apiSlide.subheading) {
      blocks.push({
        type: 'SUBHEADING',
        content: {
          text: apiSlide.subheading,
          fontSize: 'lg',
          fontWeight: 'normal',
          textAlign: isFirst || isLast ? 'center' : 'left',
          color: isFirst ? '#FF6B35' : '#B0B0B0'
        }
      });
    }

    // Add bullet points if present
    if (apiSlide.bullets && Array.isArray(apiSlide.bullets) && apiSlide.bullets.length > 0) {
      blocks.push({
        type: 'BULLET_LIST',
        content: {
          items: apiSlide.bullets,
          bulletStyle: 'check',
          color: '#FFFFFF'
        }
      });
    }

    // Add body/description text
    if (apiSlide.body || apiSlide.description || apiSlide.content) {
      const text = apiSlide.body || apiSlide.description || apiSlide.content;
      blocks.push({
        type: 'PARAGRAPH',
        content: {
          text: text,
          fontSize: 'base',
          textAlign: isFirst || isLast ? 'center' : 'left',
          color: isLast ? '#FF6B35' : '#B0B0B0'
        }
      });
    }

    // Add CTA elements for last slide
    if (isLast) {
      blocks.push({
        type: 'DIVIDER',
        content: { style: 'solid', opacity: 0.2, width: '60%' }
      });
      blocks.push({
        type: 'PARAGRAPH',
        content: {
          text: '💬 Kommentieren\n♻️ Reposten\n🔔 Folgen für mehr',
          fontSize: 'base',
          textAlign: 'center',
          color: '#FF6B35'
        }
      });
    }

    // Add branding for first and last slide
    if (isFirst || isLast) {
      blocks.push({
        type: 'BRANDING',
        content: { name: 'Dein Name', handle: '@handle', showAvatar: true }
      });
    }

    slides.push({
      type: slideType,
      blocks,
      styles: { background, padding: 'lg' }
    });
  });

  return slides;
};

/**
 * Generate carousel from hypothesis using Ollama AI API
 */
export const generateCarouselFromHypothesis = async ({
  hypothesis,
  pattern = 'problem_solution',
  slideCount = 5,
  tone = 'professional',
  language = 'de',
  onProgress = () => {}
}) => {
  // Validate inputs
  if (!hypothesis || hypothesis.trim().length < 10) {
    throw new Error('Bitte gib eine Hypothese mit mindestens 10 Zeichen ein.');
  }

  onProgress({ stage: 'analyzing', percentage: 10 });

  try {
    // Call the AI API
    onProgress({ stage: 'generating', percentage: 30 });

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': AI_API_KEY
      },
      body: JSON.stringify({
        topic: hypothesis.trim(),
        slides: slideCount,
        pattern: pattern,
        tone: tone,
        language: language
      })
    });

    onProgress({ stage: 'generating', percentage: 60 });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI-Generierung fehlgeschlagen (${response.status})`);
    }

    const result = await response.json();

    onProgress({ stage: 'formatting', percentage: 80 });

    // Check if we got valid slides
    if (!result.data?.slides || !Array.isArray(result.data.slides)) {
      console.error('Invalid API response:', result);
      throw new Error('Ungültige Antwort vom AI-Server');
    }

    // Convert API response to our slide format
    const slides = convertApiResponseToSlides(result.data.slides, slideCount);

    // Add unique IDs
    const slidesWithIds = slides.map((slide, slideIndex) => ({
      id: `slide-${Date.now()}-${slideIndex}-${Math.random().toString(36).substr(2, 9)}`,
      ...slide,
      blocks: slide.blocks.map((block, blockIndex) => ({
        id: `block-${Date.now()}-${slideIndex}-${blockIndex}-${Math.random().toString(36).substr(2, 9)}`,
        ...block,
        content: { ...block.content }
      })),
      order: slideIndex + 1
    }));

    onProgress({ stage: 'complete', percentage: 100 });

    return {
      title: result.data.title || hypothesis.slice(0, 50),
      slides: slidesWithIds,
      settings: {
        width: 1080,
        height: 1080
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        hypothesis,
        pattern,
        slideCount,
        tone,
        language,
        aiGenerated: true,
        model: result.data.model || 'ollama'
      }
    };

  } catch (error) {
    console.error('AI Generation failed:', error);

    // Check if it's a network error (API not reachable)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('AI-Server nicht erreichbar. Bitte später erneut versuchen.');
    }

    throw error;
  }
};

/**
 * Check if AI API is available
 */
export const checkAIHealth = async () => {
  try {
    const healthUrl = AI_API_URL.replace('/api/carousel', '/health');
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: { 'X-API-Key': AI_API_KEY }
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get available carousel patterns
 */
export const getCarouselPatterns = () => CAROUSEL_PATTERNS;

/**
 * Estimate generation time (AI takes longer)
 */
export const estimateGenerationTime = (slideCount) => {
  return 5 + Math.ceil(slideCount * 0.5); // ~5-10 seconds for AI
};

export default {
  generateCarouselFromHypothesis,
  getCarouselPatterns,
  estimateGenerationTime,
  checkAIHealth
};
