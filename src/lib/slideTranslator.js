/**
 * Translate slide content to a target language using AI
 */

// API Configuration - same as carousel generator
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'https://nonlogistic-unnative-dominique.ngrok-free.dev/api/carousel';
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || 'lk-carousel-j4k5ch-2024-prod';

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

  try {
    // Build translation request using the carousel API endpoint
    const textsToTranslate = needsAITranslation.map(t => t.value);

    // Use the same API as carousel generation but with translation prompt
    const translationPrompt = `Translate the following texts to ${targetLangName}.
Keep the same tone, style and formatting. Keep emojis.
Return ONLY a JSON array with the translations in the same order.

Texts to translate:
${JSON.stringify(textsToTranslate)}

Return format: ["translated text 1", "translated text 2", ...]`;

    const response = await fetch(AI_API_URL.replace('/carousel', '/translate'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': AI_API_KEY,
      },
      body: JSON.stringify({
        texts: textsToTranslate,
        targetLanguage: targetLangName,
        prompt: translationPrompt,
      }),
    });

    onProgress?.({ stage: 'applying', percentage: 80 });

    if (response.ok) {
      const data = await response.json();

      // Map AI translations back
      const aiTranslated = needsAITranslation.map((t, i) => ({
        path: t.path,
        value: data.translations?.[i] || t.value,
      }));

      // Combine quick and AI translations
      const allTranslations = [...quickTranslated, ...aiTranslated];
      const translatedSlides = applyTranslations(slides, allTranslations);

      onProgress?.({ stage: 'complete', percentage: 100 });
      return translatedSlides;
    }

    // API failed - fallback to quick translations only
    console.warn('Translation API unavailable, using fallback');
    const fallbackSlides = applyTranslations(slides, quickTranslated);
    onProgress?.({ stage: 'complete', percentage: 100 });
    return fallbackSlides;

  } catch (error) {
    console.error('Translation error:', error);
    // Fallback: apply only quick translations
    const fallbackSlides = applyTranslations(slides, quickTranslated);
    onProgress?.({ stage: 'complete', percentage: 100 });
    return fallbackSlides;
  }
};

/**
 * Quick translate common CTA phrases (no API needed) - exported
 */
export const quickTranslate = (text, targetLanguage) => {
  return quickTranslateText(text, targetLanguage) || text;
};

export default { translateSlides, quickTranslate };
