/**
 * Translate slide content to a target language using AI
 * Uses the same API endpoint as carousel generator
 */

// API Configuration - Homeserver translate endpoint (primary)
const AI_BASE_URL = import.meta.env.VITE_AI_API_URL || 'https://nonlogistic-unnative-dominique.ngrok-free.dev/api/carousel';
const AI_TRANSLATE_URL = AI_BASE_URL.replace('/api/carousel', '/api/translate');
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || 'lk-carousel-j4k5ch-2024-prod';

// OpenRouter API for translation (fallback)
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const LANGUAGE_NAMES = {
  en: 'English',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
};

/**
 * Extract all translatable text from slides
 */
const extractTexts = (slides) => {
  const texts = [];

  slides.forEach((slide, slideIndex) => {
    slide.blocks.forEach((block, blockIndex) => {
      if (block.content?.text) {
        texts.push({
          path: `${slideIndex}.${blockIndex}.text`,
          value: block.content.text,
        });
      }
      if (block.content?.label) {
        texts.push({
          path: `${slideIndex}.${blockIndex}.label`,
          value: block.content.label,
        });
      }
      if (block.content?.items && Array.isArray(block.content.items)) {
        block.content.items.forEach((item, itemIndex) => {
          texts.push({
            path: `${slideIndex}.${blockIndex}.items.${itemIndex}`,
            value: item,
          });
        });
      }
    });
  });

  return texts;
};

/**
 * Apply translated texts back to slides
 */
const applyTranslations = (slides, translations) => {
  const newSlides = JSON.parse(JSON.stringify(slides)); // Deep clone

  translations.forEach(({ path, value }) => {
    const parts = path.split('.');
    const slideIndex = parseInt(parts[0]);
    const blockIndex = parseInt(parts[1]);
    const field = parts[2];

    if (!newSlides[slideIndex]?.blocks[blockIndex]?.content) return;

    if (field === 'text' || field === 'label') {
      newSlides[slideIndex].blocks[blockIndex].content[field] = value;
    } else if (field === 'items') {
      const itemIndex = parseInt(parts[3]);
      if (newSlides[slideIndex].blocks[blockIndex].content.items) {
        newSlides[slideIndex].blocks[blockIndex].content.items[itemIndex] = value;
      }
    }
  });

  return newSlides;
};

/**
 * Common translations for quick fallback
 */
const COMMON_TRANSLATIONS = {
  en: {
    'SWIPE': 'SWIPE', 'SAVE': 'SAVE', 'FOLLOW': 'FOLLOW', 'SHARE': 'SHARE',
    'LIKE': 'LIKE', 'COMMENT': 'COMMENT', 'LEARN MORE': 'LEARN MORE',
    'READ MORE': 'READ MORE', 'CLICK HERE': 'CLICK HERE', 'NEXT': 'NEXT',
    'TIP': 'TIP', 'STEP': 'STEP', 'FACT': 'FACT', 'MYTH': 'MYTH', 'TRUTH': 'TRUTH',
  },
  de: {
    'SWIPE': 'WISCHEN', 'SAVE': 'SPEICHERN', 'FOLLOW': 'FOLGEN', 'SHARE': 'TEILEN',
    'LIKE': 'LIKEN', 'COMMENT': 'KOMMENTIEREN', 'LEARN MORE': 'MEHR ERFAHREN',
    'READ MORE': 'WEITERLESEN', 'CLICK HERE': 'HIER KLICKEN', 'NEXT': 'WEITER',
    'TIP': 'TIPP', 'STEP': 'SCHRITT', 'FACT': 'FAKT', 'MYTH': 'MYTHOS', 'TRUTH': 'WAHRHEIT',
  },
  es: {
    'SWIPE': 'DESLIZA', 'SAVE': 'GUARDAR', 'FOLLOW': 'SEGUIR', 'SHARE': 'COMPARTIR',
    'LIKE': 'ME GUSTA', 'COMMENT': 'COMENTAR', 'LEARN MORE': 'SABER MÁS',
    'READ MORE': 'LEER MÁS', 'CLICK HERE': 'CLIC AQUÍ', 'NEXT': 'SIGUIENTE',
    'TIP': 'CONSEJO', 'STEP': 'PASO', 'FACT': 'HECHO', 'MYTH': 'MITO', 'TRUTH': 'VERDAD',
  },
  fr: {
    'SWIPE': 'GLISSER', 'SAVE': 'SAUVEGARDER', 'FOLLOW': 'SUIVRE', 'SHARE': 'PARTAGER',
    'LIKE': 'AIMER', 'COMMENT': 'COMMENTER', 'LEARN MORE': 'EN SAVOIR PLUS',
    'READ MORE': 'LIRE PLUS', 'CLICK HERE': 'CLIQUER ICI', 'NEXT': 'SUIVANT',
    'TIP': 'CONSEIL', 'STEP': 'ÉTAPE', 'FACT': 'FAIT', 'MYTH': 'MYTHE', 'TRUTH': 'VÉRITÉ',
  },
};

/**
 * Quick translate common CTA phrases (no API needed)
 */
const quickTranslateText = (text, targetLanguage) => {
  const upperText = text.toUpperCase().trim();
  const translations = COMMON_TRANSLATIONS[targetLanguage];

  if (!translations) return null;

  // Check for exact match
  if (translations[upperText]) {
    // Preserve original casing style
    if (text === text.toUpperCase()) {
      return translations[upperText];
    } else if (text === text.toLowerCase()) {
      return translations[upperText].toLowerCase();
    } else if (text[0] === text[0].toUpperCase()) {
      return translations[upperText].charAt(0) + translations[upperText].slice(1).toLowerCase();
    }
    return translations[upperText];
  }

  // Check for arrow prefix
  if (upperText.startsWith('→ ')) {
    const word = upperText.replace('→ ', '');
    if (translations[word]) {
      return '→ ' + translations[word];
    }
  }

  return null;
};

/**
 * Call OpenRouter API for translation
 */
const translateWithOpenRouter = async (texts, targetLangName) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Breaking Dynamics Carousel',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-haiku',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate texts to ${targetLangName}. Keep the same tone, style, formatting, and any emojis. Return ONLY a valid JSON array with translations in the exact same order as input. No explanations.`
        },
        {
          role: 'user',
          content: `Translate these texts to ${targetLangName}. Return ONLY a JSON array:\n${JSON.stringify(texts)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  // Parse JSON from response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Invalid response format');
};

/**
 * Call homeserver /api/translate endpoint (primary method)
 */
const translateWithHomeserver = async (texts, targetLangName) => {
  console.log('Translating with Homeserver...', AI_TRANSLATE_URL);

  const response = await fetch(AI_TRANSLATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': AI_API_KEY,
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify({
      texts: texts,
      targetLanguage: targetLangName,
    }),
  });

  if (!response.ok) {
    throw new Error(`Homeserver API error: ${response.status}`);
  }

  const data = await response.json();
  return data.translations || data.result || [];
};

/**
 * Translate all slides to target language using AI
 */
export const translateSlides = async (slides, targetLanguage, onProgress) => {
  const texts = extractTexts(slides);

  if (texts.length === 0) {
    return slides;
  }

  onProgress?.({ stage: 'extracting', percentage: 10 });

  const targetLangName = LANGUAGE_NAMES[targetLanguage] || 'English';

  // First, try quick translations for common phrases
  const quickTranslated = [];
  const needsAITranslation = [];

  texts.forEach((item) => {
    const quickResult = quickTranslateText(item.value, targetLanguage);
    if (quickResult) {
      quickTranslated.push({ path: item.path, value: quickResult });
    } else {
      needsAITranslation.push(item);
    }
  });

  onProgress?.({ stage: 'translating', percentage: 30 });

  // If all texts were quick-translated, we're done
  if (needsAITranslation.length === 0) {
    const translatedSlides = applyTranslations(slides, quickTranslated);
    onProgress?.({ stage: 'complete', percentage: 100 });
    return translatedSlides;
  }

  const textsToTranslate = needsAITranslation.map(t => t.value);
  let aiTranslations = null;

  // Try Homeserver first, then OpenRouter as fallback
  try {
    aiTranslations = await translateWithHomeserver(textsToTranslate, targetLangName);
  } catch (error) {
    console.warn('Homeserver translation failed:', error.message);

    // Fallback to OpenRouter if available
    if (OPENROUTER_API_KEY) {
      try {
        console.log('Falling back to OpenRouter...');
        aiTranslations = await translateWithOpenRouter(textsToTranslate, targetLangName);
      } catch (openRouterError) {
        console.warn('OpenRouter translation also failed:', openRouterError.message);
      }
    }
  }

  onProgress?.({ stage: 'applying', percentage: 80 });

  // If we got AI translations, use them
  if (aiTranslations && Array.isArray(aiTranslations) && aiTranslations.length > 0) {
    const aiTranslated = needsAITranslation.map((t, i) => ({
      path: t.path,
      value: aiTranslations[i] || t.value,
    }));

    const allTranslations = [...quickTranslated, ...aiTranslated];
    const translatedSlides = applyTranslations(slides, allTranslations);

    onProgress?.({ stage: 'complete', percentage: 100 });
    return translatedSlides;
  }

  // Fallback: use built-in simple translations
  console.warn('AI translation unavailable, using local fallback');
  const fallbackTranslated = needsAITranslation.map((t) => ({
    path: t.path,
    value: simpleTranslate(t.value, targetLanguage),
  }));

  const allTranslations = [...quickTranslated, ...fallbackTranslated];
  const translatedSlides = applyTranslations(slides, allTranslations);
  onProgress?.({ stage: 'complete', percentage: 100 });
  return translatedSlides;
};

/**
 * Simple local translation fallback for common words/phrases
 */
const simpleTranslate = (text, targetLang) => {
  // Just return original if no translation available
  // This keeps the text rather than breaking
  return text;
};

/**
 * Quick translate common CTA phrases (no API needed) - exported
 */
export const quickTranslate = (text, targetLanguage) => {
  return quickTranslateText(text, targetLanguage) || text;
};

export default { translateSlides, quickTranslate };
