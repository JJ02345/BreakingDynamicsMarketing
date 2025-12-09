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
 * Extract emoji from title if present
 */
const extractEmoji = (text) => {
  if (!text) return { emoji: null, cleanText: text };
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const matches = text.match(emojiRegex);
  if (matches && matches.length > 0) {
    const emoji = matches[0];
    const cleanText = text.replace(emojiRegex, '').trim();
    return { emoji, cleanText };
  }
  return { emoji: null, cleanText: text };
};

/**
 * Detect if content contains a statistic/number
 */
const extractStatistic = (text) => {
  if (!text) return null;
  // Match patterns like: 87%, +500k, 3x, 10.000, $50M, 2-3x
  const statRegex = /([+\-]?\d[\d.,]*[%xX]?|\d+[\-–]\d+[xX]?|\$?\d+[KkMmBb]?)/;
  const match = text.match(statRegex);
  if (match && match[0].length >= 2) {
    return match[0];
  }
  return null;
};

/**
 * Detect if content is a list (bullet points, numbered items)
 */
const extractListItems = (text) => {
  if (!text) return null;
  // Check for line breaks with bullet-like patterns
  const lines = text.split(/\n/).filter(line => line.trim());
  if (lines.length >= 2) {
    // Check if lines start with bullets, numbers, emojis, or dashes
    const listPattern = /^[\s]*([•\-\*\→✓✔☑️→▸▹►]|\d+[.\):]|[^\w\s])/;
    const isList = lines.every(line => listPattern.test(line) || line.trim().length < 60);
    if (isList) {
      return lines.map(line => line.replace(/^[\s]*[•\-\*\→✓✔☑️→▸▹►\d+.\):]+\s*/, '').trim()).filter(Boolean);
    }
  }
  return null;
};

/**
 * Convert AI API response to our slide format
 * API returns: { slide: number, title: string, content: string }
 *
 * VISUAL OPTIMIZATION: Uses large typography, badges, stats blocks, and bullet lists
 */
const convertApiResponseToSlides = (apiSlides, slideCount) => {
  const slides = [];
  const totalSlides = Math.min(apiSlides.length, slideCount);

  apiSlides.slice(0, slideCount).forEach((apiSlide, index) => {
    const isFirst = index === 0;
    const isLast = index === totalSlides - 1;

    // Extract emoji from title if present
    const { emoji, cleanText: cleanTitle } = extractEmoji(apiSlide.title);

    // Check for statistics in title or content
    const statInTitle = extractStatistic(apiSlide.title);
    const statInContent = extractStatistic(apiSlide.content);
    const hasStat = statInTitle || statInContent;

    // Check if content is a list
    const listItems = extractListItems(apiSlide.content);

    // Determine slide type and background
    let slideType = 'option';
    let background = 'solid-dark';

    if (isFirst) {
      slideType = 'cover';
      background = 'gradient-orange';
    } else if (isLast) {
      slideType = 'cta';
      background = 'gradient-orange';
    } else if (hasStat) {
      slideType = 'stats';
      background = 'gradient-purple';
    } else if (listItems) {
      slideType = 'list';
      background = 'gradient-dark';
    } else {
      background = BACKGROUND_STYLES[index % BACKGROUND_STYLES.length];
    }

    // Build blocks from API response
    const blocks = [];

    // === COVER SLIDE (First) ===
    if (isFirst) {
      // Large emoji icon
      if (emoji) {
        blocks.push({
          type: 'ICON',
          content: { emoji: emoji, size: 'xxl' }
        });
      }

      // BIG BOLD HEADLINE - RIESIG für Impact
      if (cleanTitle) {
        blocks.push({
          type: 'HEADING',
          content: {
            text: cleanTitle.toUpperCase(),
            fontSize: '72px',
            fontWeight: '800',
            textAlign: 'center',
            color: '#FFFFFF',
            lineHeight: 1.0
          }
        });
      }

      // Subtitle/hook - auch größer
      if (apiSlide.content) {
        blocks.push({
          type: 'PARAGRAPH',
          content: {
            text: apiSlide.content,
            fontSize: '32px',
            textAlign: 'center',
            color: '#FF6B35',
            fontWeight: '600'
          }
        });
      }

      // Swipe indicator badge
      blocks.push({
        type: 'BADGE',
        content: {
          text: '→ SWIPE',
          backgroundColor: '#FF6B35',
          textColor: '#FFFFFF'
        }
      });

      blocks.push({
        type: 'BRANDING',
        content: { name: 'Dein Name', handle: '@handle', showAvatar: true }
      });
    }

    // === STATS SLIDE ===
    else if (hasStat && !isLast) {
      // Badge for context
      if (cleanTitle && !statInTitle) {
        blocks.push({
          type: 'BADGE',
          content: {
            text: cleanTitle.toUpperCase().slice(0, 25),
            backgroundColor: '#7C3AED',
            textColor: '#FFFFFF'
          }
        });
      }

      // RIESIGE Statistik-Zahl
      const statValue = statInTitle || statInContent;
      blocks.push({
        type: 'NUMBER',
        content: {
          number: statValue,
          label: statInTitle ? cleanTitle : '',
          color: '#00E676'  // Bright green for impact
        }
      });

      // Kurzer Erklärungstext - größer
      const explanationText = statInContent
        ? apiSlide.content.replace(statInContent, '').trim()
        : apiSlide.content;
      if (explanationText && explanationText.length > 5) {
        // Kürzen auf max 80 Zeichen für bessere Lesbarkeit
        const shortText = explanationText.length > 80
          ? explanationText.slice(0, 77) + '...'
          : explanationText;
        blocks.push({
          type: 'PARAGRAPH',
          content: {
            text: shortText,
            fontSize: '28px',
            textAlign: 'center',
            color: '#FFFFFF',
            fontWeight: '500'
          }
        });
      }
    }

    // === LIST SLIDE ===
    else if (listItems && !isLast) {
      // Icon if present - oben
      if (emoji) {
        blocks.push({
          type: 'ICON',
          content: { emoji: emoji, size: 'xl' }
        });
      }

      // Große Überschrift
      if (cleanTitle) {
        blocks.push({
          type: 'HEADING',
          content: {
            text: cleanTitle.toUpperCase(),
            fontSize: '48px',
            fontWeight: '700',
            textAlign: 'left',
            color: '#FFFFFF'
          }
        });
      }

      // Bullet list - max 4 kurze Items
      const shortItems = listItems.slice(0, 4).map(item =>
        item.length > 40 ? item.slice(0, 37) + '...' : item
      );
      blocks.push({
        type: 'BULLET_LIST',
        content: {
          items: shortItems,
          bulletStyle: 'check',
          color: '#FFFFFF'
        }
      });
    }

    // === CTA SLIDE (Last) ===
    else if (isLast) {
      // RIESIGE Headline
      blocks.push({
        type: 'HEADING',
        content: {
          text: (cleanTitle || 'GEFÄLLT DIR?').toUpperCase(),
          fontSize: '64px',
          fontWeight: '800',
          textAlign: 'center',
          color: '#FFFFFF'
        }
      });

      blocks.push({
        type: 'DIVIDER',
        content: { style: 'solid', opacity: 0.3, width: '50%' }
      });

      // CTA bullet list - größer und impactvoller
      blocks.push({
        type: 'BULLET_LIST',
        content: {
          items: [
            '💬 Kommentiere',
            '♻️ Teilen',
            '🔔 Folgen'
          ],
          bulletStyle: 'arrow',
          color: '#FF6B35'
        }
      });

      blocks.push({
        type: 'BRANDING',
        content: { name: 'Dein Name', handle: '@handle', showAvatar: true }
      });
    }

    // === REGULAR CONTENT SLIDE ===
    else {
      // Slide number badge
      blocks.push({
        type: 'BADGE',
        content: {
          text: `${index}/${totalSlides - 2}`,
          backgroundColor: '#FF6B35',
          textColor: '#FFFFFF'
        }
      });

      // Icon if present - GROSS
      if (emoji) {
        blocks.push({
          type: 'ICON',
          content: { emoji: emoji, size: 'xxl' }
        });
      }

      // GROSSE Überschrift - gut lesbar
      if (cleanTitle) {
        blocks.push({
          type: 'HEADING',
          content: {
            text: cleanTitle.toUpperCase(),
            fontSize: '52px',
            fontWeight: '700',
            textAlign: 'left',
            color: '#FFFFFF',
            lineHeight: 1.1
          }
        });
      }

      // Content - GRÖSSER und KÜRZER
      if (apiSlide.content) {
        // Max 100 Zeichen für gute Lesbarkeit
        const shortContent = apiSlide.content.length > 100
          ? apiSlide.content.slice(0, 97) + '...'
          : apiSlide.content;
        blocks.push({
          type: 'PARAGRAPH',
          content: {
            text: shortContent,
            fontSize: '32px',
            textAlign: 'left',
            color: '#E0E0E0',
            lineHeight: 1.4,
            fontWeight: '400'
          }
        });
      }
    }

    slides.push({
      type: slideType,
      blocks,
      styles: { background, padding: 'xl' }  // More padding for breathing room
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
      headers: {
        'X-API-Key': AI_API_KEY
      }
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
