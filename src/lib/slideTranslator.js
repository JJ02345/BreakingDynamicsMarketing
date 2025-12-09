/**
 * Translate slide content to a target language using AI
 */

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
 * Translate all slides to target language
 */
export const translateSlides = async (slides, targetLanguage, onProgress) => {
  const texts = extractTexts(slides);

  if (texts.length === 0) {
    return slides;
  }

  onProgress?.({ stage: 'extracting', percentage: 10 });

  // Create translation prompt
  const textsToTranslate = texts.map(t => t.value);
  const targetLangName = LANGUAGE_NAMES[targetLanguage] || 'English';

  onProgress?.({ stage: 'translating', percentage: 30 });

  try {
    // Call our translation endpoint
    const response = await fetch('https://breaking-dynamics-backend.onrender.com/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: textsToTranslate,
        targetLanguage: targetLangName,
      }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();

    onProgress?.({ stage: 'applying', percentage: 80 });

    // Map translations back
    const translatedTexts = texts.map((t, i) => ({
      path: t.path,
      value: data.translations[i] || t.value,
    }));

    const translatedSlides = applyTranslations(slides, translatedTexts);

    onProgress?.({ stage: 'complete', percentage: 100 });

    return translatedSlides;
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback: return original slides
    return slides;
  }
};

/**
 * Simple client-side translation for common phrases (fallback)
 */
const COMMON_TRANSLATIONS = {
  en: {
    'SWIPE': 'SWIPE',
    'SAVE': 'SAVE',
    'FOLLOW': 'FOLLOW',
    'SHARE': 'SHARE',
    'LIKE': 'LIKE',
    'COMMENT': 'COMMENT',
  },
  de: {
    'SWIPE': 'WISCHEN',
    'SAVE': 'SPEICHERN',
    'FOLLOW': 'FOLGEN',
    'SHARE': 'TEILEN',
    'LIKE': 'LIKEN',
    'COMMENT': 'KOMMENTIEREN',
  },
  es: {
    'SWIPE': 'DESLIZA',
    'SAVE': 'GUARDAR',
    'FOLLOW': 'SEGUIR',
    'SHARE': 'COMPARTIR',
    'LIKE': 'ME GUSTA',
    'COMMENT': 'COMENTAR',
  },
  fr: {
    'SWIPE': 'GLISSER',
    'SAVE': 'SAUVEGARDER',
    'FOLLOW': 'SUIVRE',
    'SHARE': 'PARTAGER',
    'LIKE': 'AIMER',
    'COMMENT': 'COMMENTER',
  },
};

/**
 * Quick translate common CTA phrases (no API needed)
 */
export const quickTranslate = (text, targetLanguage) => {
  const upperText = text.toUpperCase().trim();
  const translations = COMMON_TRANSLATIONS[targetLanguage];

  if (translations) {
    // Check for arrow prefix
    if (upperText.startsWith('→ ')) {
      const word = upperText.replace('→ ', '');
      if (translations[word]) {
        return '→ ' + translations[word];
      }
    }
    if (translations[upperText]) {
      return translations[upperText];
    }
  }

  return text;
};

export default { translateSlides, quickTranslate };
