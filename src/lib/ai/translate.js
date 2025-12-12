// ============================================
// AI TRANSLATION SERVICE
// Translate content using local AI
// ============================================

import { callAI, AI_BASE_URL, getHeaders } from './config';

export const LANGUAGE_NAMES = {
  en: 'English',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch',
};

// Common translations for quick fallback (no API needed)
const COMMON_TRANSLATIONS = {
  en: {
    'SWIPE': 'SWIPE', 'SAVE': 'SAVE', 'FOLLOW': 'FOLLOW', 'SHARE': 'SHARE',
    'LIKE': 'LIKE', 'COMMENT': 'COMMENT', 'LEARN MORE': 'LEARN MORE',
    'TIP': 'TIP', 'STEP': 'STEP', 'FACT': 'FACT', 'MYTH': 'MYTH', 'TRUTH': 'TRUTH',
    'FOLGE MIR': 'FOLLOW ME', 'SPEICHERN': 'SAVE', 'TEILEN': 'SHARE',
  },
  de: {
    'SWIPE': 'WISCHEN', 'SAVE': 'SPEICHERN', 'FOLLOW': 'FOLGEN', 'SHARE': 'TEILEN',
    'LIKE': 'LIKEN', 'COMMENT': 'KOMMENTIEREN', 'LEARN MORE': 'MEHR ERFAHREN',
    'TIP': 'TIPP', 'STEP': 'SCHRITT', 'FACT': 'FAKT', 'MYTH': 'MYTHOS', 'TRUTH': 'WAHRHEIT',
    'FOLLOW ME': 'FOLGE MIR',
  },
  es: {
    'SWIPE': 'DESLIZA', 'SAVE': 'GUARDAR', 'FOLLOW': 'SEGUIR', 'SHARE': 'COMPARTIR',
    'TIP': 'CONSEJO', 'STEP': 'PASO', 'FACT': 'HECHO', 'MYTH': 'MITO', 'TRUTH': 'VERDAD',
    'FOLLOW ME': 'SÍGUEME', 'FOLGE MIR': 'SÍGUEME',
  },
  fr: {
    'SWIPE': 'GLISSER', 'SAVE': 'SAUVEGARDER', 'FOLLOW': 'SUIVRE', 'SHARE': 'PARTAGER',
    'TIP': 'CONSEIL', 'STEP': 'ÉTAPE', 'FACT': 'FAIT', 'MYTH': 'MYTHE', 'TRUTH': 'VÉRITÉ',
    'FOLLOW ME': 'SUIS-MOI', 'FOLGE MIR': 'SUIS-MOI',
  },
};

/**
 * Quick translate common phrases without API
 */
const quickTranslateText = (text, targetLanguage) => {
  const upperText = text.toUpperCase().trim();
  const translations = COMMON_TRANSLATIONS[targetLanguage];

  if (!translations) return null;

  if (translations[upperText]) {
    if (text === text.toUpperCase()) return translations[upperText];
    if (text === text.toLowerCase()) return translations[upperText].toLowerCase();
    return translations[upperText].charAt(0) + translations[upperText].slice(1).toLowerCase();
  }

  // Handle arrow prefix
  if (upperText.startsWith('→ ')) {
    const word = upperText.replace('→ ', '');
    if (translations[word]) return '→ ' + translations[word];
  }

  return null;
};

/**
 * Extract translatable text from slides
 */
const extractTexts = (slides) => {
  const texts = [];

  slides.forEach((slide, slideIndex) => {
    slide.blocks?.forEach((block, blockIndex) => {
      if (block.content?.text) {
        texts.push({ path: `${slideIndex}.${blockIndex}.text`, value: block.content.text });
      }
      if (block.content?.label) {
        texts.push({ path: `${slideIndex}.${blockIndex}.label`, value: block.content.label });
      }
      if (block.content?.items && Array.isArray(block.content.items)) {
        block.content.items.forEach((item, itemIndex) => {
          texts.push({ path: `${slideIndex}.${blockIndex}.items.${itemIndex}`, value: item });
        });
      }
    });
  });

  return texts;
};

/**
 * Apply translations back to slides
 */
const applyTranslations = (slides, translations) => {
  const newSlides = JSON.parse(JSON.stringify(slides));

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
 * Translate using AI API
 */
const translateWithAI = async (texts, targetLanguage) => {
  // Use repurpose endpoint for translation
  const result = await callAI('repurpose', {
    content: JSON.stringify(texts),
    fromFormat: 'json-texts',
    toFormat: `translated-${targetLanguage}`,
    language: targetLanguage,
  });

  // Parse result
  if (result.data?.result || result.result) {
    try {
      const translated = JSON.parse(result.data?.result || result.result);
      if (Array.isArray(translated)) return translated;
    } catch {
      // If not JSON, try to extract array
    }
  }

  // Fallback: call post endpoint for simple translation
  const translatedTexts = [];
  for (const text of texts) {
    try {
      const postResult = await callAI('post', {
        topic: `Translate to ${LANGUAGE_NAMES[targetLanguage]}: "${text}"`,
        style: 'translation',
        maxLength: text.length * 2,
        language: targetLanguage,
      });
      translatedTexts.push(postResult.data?.post || postResult.post || text);
    } catch {
      translatedTexts.push(text);
    }
  }

  return translatedTexts;
};

/**
 * Translate all slides to target language
 */
export const translateSlides = async (slides, targetLanguage, onProgress) => {
  const texts = extractTexts(slides);

  if (texts.length === 0) return slides;

  onProgress?.({ stage: 'extracting', percentage: 10 });

  // First, try quick translations
  const quickTranslated = [];
  const needsAI = [];

  texts.forEach((item) => {
    const quick = quickTranslateText(item.value, targetLanguage);
    if (quick) {
      quickTranslated.push({ path: item.path, value: quick });
    } else {
      needsAI.push(item);
    }
  });

  onProgress?.({ stage: 'translating', percentage: 30 });

  // If all quick-translated, done
  if (needsAI.length === 0) {
    const translated = applyTranslations(slides, quickTranslated);
    onProgress?.({ stage: 'complete', percentage: 100 });
    return translated;
  }

  // Use AI for remaining
  try {
    const textsToTranslate = needsAI.map(t => t.value);
    const aiTranslated = await translateWithAI(textsToTranslate, targetLanguage);

    onProgress?.({ stage: 'applying', percentage: 80 });

    const aiResults = needsAI.map((t, i) => ({
      path: t.path,
      value: aiTranslated[i] || t.value,
    }));

    const allTranslations = [...quickTranslated, ...aiResults];
    const translated = applyTranslations(slides, allTranslations);

    onProgress?.({ stage: 'complete', percentage: 100 });
    return translated;
  } catch (error) {
    console.warn('AI translation failed:', error);

    // Fallback: return with quick translations only
    const translated = applyTranslations(slides, quickTranslated);
    onProgress?.({ stage: 'complete', percentage: 100 });
    return translated;
  }
};

/**
 * Translate a single text
 */
export const translateText = async (text, targetLanguage) => {
  // Try quick translation first
  const quick = quickTranslateText(text, targetLanguage);
  if (quick) return quick;

  // Use AI
  try {
    const result = await callAI('post', {
      topic: `Translate exactly to ${LANGUAGE_NAMES[targetLanguage]}, keep formatting: "${text}"`,
      style: 'translation',
      maxLength: text.length * 2,
      language: targetLanguage,
    });
    return result.data?.post || result.post || text;
  } catch {
    return text;
  }
};

/**
 * Quick translate (exported for compatibility)
 */
export const quickTranslate = (text, targetLanguage) => {
  return quickTranslateText(text, targetLanguage) || text;
};

export default {
  translateSlides,
  translateText,
  quickTranslate,
  LANGUAGE_NAMES,
};
