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

// ============================================
// VISUAL DESIGN SYSTEM - Premium Look
// ============================================

// Premium background sequences for different moods
const BACKGROUND_SEQUENCES = {
  warm: ['gradient-orange', 'gradient-fire', 'mesh-sunset', 'gradient-gold', 'gradient-rose'],
  cool: ['gradient-blue', 'gradient-cyan', 'mesh-cool', 'gradient-aurora', 'gradient-purple'],
  dark: ['solid-dark', 'gradient-dark', 'solid-charcoal', 'solid-navy', 'gradient-purple'],
  vibrant: ['mesh-vibrant', 'gradient-purple', 'gradient-emerald', 'gradient-aurora', 'mesh-cool'],
  professional: ['solid-dark', 'gradient-dark', 'solid-charcoal', 'gradient-blue', 'solid-navy']
};

// Color accents that pair well with backgrounds
const ACCENT_COLORS = {
  orange: { primary: '#FF6B35', secondary: '#FF8C5A', text: '#FFFFFF', muted: '#FFB899' },
  purple: { primary: '#8B5CF6', secondary: '#A78BFA', text: '#FFFFFF', muted: '#C4B5FD' },
  green: { primary: '#10B981', secondary: '#34D399', text: '#FFFFFF', muted: '#6EE7B7' },
  blue: { primary: '#3B82F6', secondary: '#60A5FA', text: '#FFFFFF', muted: '#93C5FD' },
  rose: { primary: '#F43F5E', secondary: '#FB7185', text: '#FFFFFF', muted: '#FDA4AF' },
  gold: { primary: '#F59E0B', secondary: '#FBBF24', text: '#1A1A1D', muted: '#FCD34D' },
  cyan: { primary: '#06B6D4', secondary: '#22D3EE', text: '#FFFFFF', muted: '#67E8F9' }
};

// Visual layouts for different slide types
const SLIDE_LAYOUTS = {
  // Cover: Big bold hook with visual impact
  cover: {
    backgrounds: ['gradient-orange', 'mesh-vibrant', 'gradient-aurora'],
    accent: 'orange',
    emoji: true,
    uppercase: true,
    fontSize: { title: '80px', subtitle: '28px' }
  },
  // Stats: Number-focused with high contrast
  stats: {
    backgrounds: ['gradient-purple', 'mesh-cool', 'gradient-blue'],
    accent: 'green',
    emoji: false,
    uppercase: false,
    fontSize: { number: '120px', label: '24px' }
  },
  // List: Clean readable layout
  list: {
    backgrounds: ['gradient-dark', 'solid-charcoal', 'gradient-blue'],
    accent: 'cyan',
    emoji: true,
    uppercase: false,
    fontSize: { title: '44px', item: '24px' }
  },
  // Quote: Elegant typography
  quote: {
    backgrounds: ['gradient-purple', 'mesh-sunset', 'gradient-rose'],
    accent: 'purple',
    emoji: false,
    uppercase: false,
    fontSize: { quote: '36px', author: '20px' }
  },
  // CTA: Action-oriented finale
  cta: {
    backgrounds: ['gradient-orange', 'mesh-vibrant', 'gradient-fire'],
    accent: 'orange',
    emoji: true,
    uppercase: true,
    fontSize: { title: '56px', action: '28px' }
  },
  // Content: Standard info slide
  content: {
    backgrounds: ['solid-dark', 'gradient-dark', 'solid-charcoal', 'gradient-blue', 'gradient-emerald'],
    accent: 'blue',
    emoji: true,
    uppercase: false,
    fontSize: { title: '48px', body: '26px' }
  }
};

// Emoji sets for visual variety
const EMOJI_SETS = {
  business: ['💼', '📈', '🎯', '💡', '🚀', '⚡', '✨', '🏆'],
  tech: ['💻', '🔧', '⚙️', '🤖', '📱', '🔮', '💾', '🌐'],
  growth: ['📊', '📈', '🌱', '🔥', '⬆️', '💪', '🎯', '🏅'],
  creative: ['🎨', '✏️', '💭', '🧠', '💫', '🌟', '🎭', '🎪'],
  social: ['👥', '🤝', '💬', '❤️', '👋', '🙌', '🎉', '🌍'],
  warning: ['⚠️', '🚨', '❌', '🔴', '⛔', '💥', '😱', '🤔'],
  success: ['✅', '🎉', '🏆', '🥇', '💯', '🌟', '👑', '🎊']
};

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
 * Get a smart emoji based on slide content/position
 */
const getSmartEmoji = (slideIndex, totalSlides, content, existingEmoji) => {
  if (existingEmoji) return existingEmoji;

  const contentLower = (content || '').toLowerCase();

  // Detect content type and return appropriate emoji
  if (slideIndex === 0) {
    return EMOJI_SETS.business[Math.floor(Math.random() * EMOJI_SETS.business.length)];
  }
  if (slideIndex === totalSlides - 1) {
    return EMOJI_SETS.success[Math.floor(Math.random() * EMOJI_SETS.success.length)];
  }

  // Content-based detection
  if (contentLower.includes('fehler') || contentLower.includes('problem') || contentLower.includes('mistake')) {
    return EMOJI_SETS.warning[Math.floor(Math.random() * EMOJI_SETS.warning.length)];
  }
  if (contentLower.includes('tipp') || contentLower.includes('lösung') || contentLower.includes('solution')) {
    return EMOJI_SETS.success[Math.floor(Math.random() * EMOJI_SETS.success.length)];
  }
  if (contentLower.includes('wachstum') || contentLower.includes('growth') || contentLower.includes('%')) {
    return EMOJI_SETS.growth[Math.floor(Math.random() * EMOJI_SETS.growth.length)];
  }

  // Fallback: cycle through business emojis
  return EMOJI_SETS.business[slideIndex % EMOJI_SETS.business.length];
};

/**
 * Get accent color based on slide position for visual variety
 */
const getSlideAccent = (slideIndex, totalSlides, slideType) => {
  const accentSequence = ['orange', 'blue', 'purple', 'green', 'cyan', 'rose'];

  if (slideType === 'cover' || slideType === 'cta') return ACCENT_COLORS.orange;
  if (slideType === 'stats') return ACCENT_COLORS.green;

  const accentKey = accentSequence[slideIndex % accentSequence.length];
  return ACCENT_COLORS[accentKey];
};

/**
 * Get background for slide with visual variety
 */
const getSlideBackground = (slideIndex, totalSlides, slideType, usedBackgrounds) => {
  const layout = SLIDE_LAYOUTS[slideType] || SLIDE_LAYOUTS.content;

  // Pick from layout's preferred backgrounds, avoiding recent duplicates
  const available = layout.backgrounds.filter(bg => !usedBackgrounds.includes(bg));
  const choices = available.length > 0 ? available : layout.backgrounds;

  return choices[slideIndex % choices.length];
};

/**
 * Convert AI API response to our slide format
 * API returns: { slide: number, title: string, content: string }
 *
 * VISUAL OPTIMIZATION V2: Premium layouts, smart colors, better typography
 */
const convertApiResponseToSlides = (apiSlides, slideCount) => {
  const slides = [];
  const totalSlides = Math.min(apiSlides.length, slideCount);
  const usedBackgrounds = [];

  apiSlides.slice(0, slideCount).forEach((apiSlide, index) => {
    const isFirst = index === 0;
    const isLast = index === totalSlides - 1;

    // Extract emoji from title if present
    const { emoji: extractedEmoji, cleanText: cleanTitle } = extractEmoji(apiSlide.title);

    // Check for statistics in title or content
    const statInTitle = extractStatistic(apiSlide.title);
    const statInContent = extractStatistic(apiSlide.content);
    const hasStat = statInTitle || statInContent;

    // Check if content is a list
    const listItems = extractListItems(apiSlide.content);

    // Check if it looks like a quote
    const isQuote = apiSlide.content?.startsWith('"') || apiSlide.content?.includes('„');

    // Determine slide type
    let slideType = 'content';
    if (isFirst) slideType = 'cover';
    else if (isLast) slideType = 'cta';
    else if (hasStat) slideType = 'stats';
    else if (listItems) slideType = 'list';
    else if (isQuote) slideType = 'quote';

    // Get visual settings
    const background = getSlideBackground(index, totalSlides, slideType, usedBackgrounds.slice(-2));
    usedBackgrounds.push(background);
    const accent = getSlideAccent(index, totalSlides, slideType);
    const emoji = getSmartEmoji(index, totalSlides, apiSlide.content, extractedEmoji);

    // Build blocks from API response
    const blocks = [];

    // === COVER SLIDE (First) ===
    if (isFirst) {
      // Large emoji with glow effect
      blocks.push({
        type: 'ICON',
        content: { emoji: emoji, size: 'xxxl' }
      });

      // MASSIVE HEADLINE - Maximum impact
      if (cleanTitle) {
        blocks.push({
          type: 'HEADING',
          content: {
            text: cleanTitle.toUpperCase(),
            fontSize: '76px',
            fontWeight: '900',
            textAlign: 'center',
            color: '#FFFFFF',
            lineHeight: 0.95,
            letterSpacing: '-2px'
          }
        });
      }

      // Subtitle with accent color
      if (apiSlide.content) {
        const shortSubtitle = apiSlide.content.length > 60
          ? apiSlide.content.slice(0, 57) + '...'
          : apiSlide.content;
        blocks.push({
          type: 'PARAGRAPH',
          content: {
            text: shortSubtitle,
            fontSize: '26px',
            textAlign: 'center',
            color: accent.primary,
            fontWeight: '600',
            lineHeight: 1.3
          }
        });
      }

      // Swipe CTA Badge
      blocks.push({
        type: 'BADGE',
        content: {
          text: 'SWIPE →',
          backgroundColor: accent.primary,
          textColor: '#FFFFFF'
        }
      });

      // Branding at bottom
      blocks.push({
        type: 'BRANDING',
        content: { name: 'Dein Name', handle: '@handle', showAvatar: true }
      });
    }

    // === STATS SLIDE ===
    else if (slideType === 'stats') {
      // Context badge
      const badgeText = cleanTitle && cleanTitle.length <= 20 ? cleanTitle.toUpperCase() : 'FAKT';
      blocks.push({
        type: 'BADGE',
        content: {
          text: badgeText,
          backgroundColor: accent.primary,
          textColor: '#FFFFFF'
        }
      });

      // MASSIVE Number - the star of the show
      const statValue = statInTitle || statInContent;
      blocks.push({
        type: 'NUMBER',
        content: {
          number: statValue,
          label: '',
          color: ACCENT_COLORS.green.primary
        }
      });

      // Explanation below the number
      const explanationText = statInContent
        ? apiSlide.content.replace(statInContent, '').trim()
        : (cleanTitle || apiSlide.content);
      if (explanationText && explanationText.length > 5) {
        const shortText = explanationText.length > 70
          ? explanationText.slice(0, 67) + '...'
          : explanationText;
        blocks.push({
          type: 'HEADING',
          content: {
            text: shortText,
            fontSize: '36px',
            textAlign: 'center',
            color: '#FFFFFF',
            fontWeight: '600',
            lineHeight: 1.2
          }
        });
      }

      // Divider for visual separation
      blocks.push({
        type: 'DIVIDER',
        content: { style: 'solid', opacity: 0.2, width: '40%', color: accent.primary }
      });
    }

    // === LIST SLIDE ===
    else if (slideType === 'list') {
      // Emoji at top
      blocks.push({
        type: 'ICON',
        content: { emoji: emoji, size: 'xl' }
      });

      // Bold headline
      if (cleanTitle) {
        blocks.push({
          type: 'HEADING',
          content: {
            text: cleanTitle,
            fontSize: '42px',
            fontWeight: '800',
            textAlign: 'left',
            color: '#FFFFFF',
            lineHeight: 1.1
          }
        });
      }

      // Divider
      blocks.push({
        type: 'DIVIDER',
        content: { style: 'solid', opacity: 0.15, width: '100%' }
      });

      // Bullet list - max 4 items, with emojis
      const itemEmojis = ['✓', '✓', '✓', '✓'];
      const shortItems = listItems.slice(0, 4).map((item, i) =>
        `${itemEmojis[i]} ${item.length > 35 ? item.slice(0, 32) + '...' : item}`
      );
      blocks.push({
        type: 'BULLET_LIST',
        content: {
          items: shortItems,
          bulletStyle: 'none',
          color: '#FFFFFF',
          fontSize: '26px'
        }
      });
    }

    // === QUOTE SLIDE ===
    else if (slideType === 'quote') {
      // Large quote marks
      blocks.push({
        type: 'ICON',
        content: { emoji: '💬', size: 'xl' }
      });

      // The quote itself
      blocks.push({
        type: 'QUOTE',
        content: {
          text: apiSlide.content,
          author: cleanTitle || '',
          fontSize: '32px',
          fontStyle: 'italic',
          color: '#FFFFFF'
        }
      });

      // Subtle divider
      blocks.push({
        type: 'DIVIDER',
        content: { style: 'solid', opacity: 0.2, width: '30%' }
      });
    }

    // === CTA SLIDE (Last) ===
    else if (isLast) {
      // Celebration emoji
      blocks.push({
        type: 'ICON',
        content: { emoji: '🎯', size: 'xxl' }
      });

      // Big CTA headline
      const ctaTitle = cleanTitle || 'Was denkst du?';
      blocks.push({
        type: 'HEADING',
        content: {
          text: ctaTitle.toUpperCase(),
          fontSize: '52px',
          fontWeight: '900',
          textAlign: 'center',
          color: '#FFFFFF',
          lineHeight: 1.0
        }
      });

      // Divider
      blocks.push({
        type: 'DIVIDER',
        content: { style: 'solid', opacity: 0.25, width: '60%' }
      });

      // Action items with emojis - styled as text for better control
      blocks.push({
        type: 'PARAGRAPH',
        content: {
          text: '💬 Kommentieren  •  ♻️ Teilen  •  🔔 Folgen',
          fontSize: '22px',
          textAlign: 'center',
          color: accent.primary,
          fontWeight: '600'
        }
      });

      // Branding
      blocks.push({
        type: 'BRANDING',
        content: { name: 'Dein Name', handle: '@handle', showAvatar: true }
      });
    }

    // === REGULAR CONTENT SLIDE ===
    else {
      // Slide number badge - styled nicely
      const slideNum = index;
      const totalContent = totalSlides - 2; // exclude cover & cta
      blocks.push({
        type: 'BADGE',
        content: {
          text: `${slideNum}/${totalContent}`,
          backgroundColor: accent.primary,
          textColor: '#FFFFFF'
        }
      });

      // Emoji for visual interest
      blocks.push({
        type: 'ICON',
        content: { emoji: emoji, size: 'xl' }
      });

      // Strong headline
      if (cleanTitle) {
        blocks.push({
          type: 'HEADING',
          content: {
            text: cleanTitle,
            fontSize: '44px',
            fontWeight: '800',
            textAlign: 'left',
            color: '#FFFFFF',
            lineHeight: 1.15
          }
        });
      }

      // Divider for structure
      blocks.push({
        type: 'DIVIDER',
        content: { style: 'solid', opacity: 0.1, width: '100%' }
      });

      // Content text - optimized for readability
      if (apiSlide.content) {
        const shortContent = apiSlide.content.length > 120
          ? apiSlide.content.slice(0, 117) + '...'
          : apiSlide.content;
        blocks.push({
          type: 'PARAGRAPH',
          content: {
            text: shortContent,
            fontSize: '28px',
            textAlign: 'left',
            color: '#E5E5E5',
            lineHeight: 1.5,
            fontWeight: '400'
          }
        });
      }
    }

    slides.push({
      type: slideType,
      blocks,
      styles: { background, padding: 'xl' }
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
