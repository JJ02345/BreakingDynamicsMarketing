// Translation Service
// AI-powered slide translation

import { callAI } from './aiProxy';
import { COMMON_TRANSLATIONS, LANGUAGE_NAMES } from '../constants';
import type { TranslationProgress, TextItem, GeneratedSlide } from '../types';

// ============================================
// QUICK TRANSLATION (NO API)
// ============================================

/**
 * Quick translate common phrases without API
 */
function quickTranslateText(text: string, targetLanguage: string): string | null {
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
}

// ============================================
// TEXT EXTRACTION
// ============================================

interface SlideBlock {
  content?: {
    text?: string;
    label?: string;
    items?: string[];
  };
}

interface Slide {
  blocks?: SlideBlock[];
}

/**
 * Extract translatable text from slides
 */
function extractTexts(slides: Slide[]): TextItem[] {
  const texts: TextItem[] = [];

  slides.forEach((slide, slideIndex) => {
    slide.blocks?.forEach((block, blockIndex) => {
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
}

/**
 * Apply translations back to slides
 */
function applyTranslations<T extends Slide[]>(slides: T, translations: TextItem[]): T {
  const newSlides = JSON.parse(JSON.stringify(slides)) as T;

  translations.forEach(({ path, value }) => {
    const parts = path.split('.');
    const slideIndex = parseInt(parts[0]);
    const blockIndex = parseInt(parts[1]);
    const field = parts[2];

    const slide = newSlides[slideIndex];
    const block = slide?.blocks?.[blockIndex];
    if (!block?.content) return;

    if (field === 'text' || field === 'label') {
      (block.content as Record<string, string>)[field] = value;
    } else if (field === 'items') {
      const itemIndex = parseInt(parts[3]);
      if (Array.isArray(block.content.items)) {
        block.content.items[itemIndex] = value;
      }
    }
  });

  return newSlides;
}

// ============================================
// AI TRANSLATION
// ============================================

/**
 * Translate using AI API
 */
async function translateWithAI(
  texts: string[],
  targetLanguage: string
): Promise<string[]> {
  try {
    // Use repurpose endpoint for translation
    const result = await callAI<{
      result?: string;
      data?: { result?: string };
    }>('repurpose', {
      content: JSON.stringify(texts),
      fromFormat: 'json-texts',
      toFormat: `translated-${targetLanguage}`,
      language: targetLanguage,
    });

    // Parse result
    const resultStr = result.data?.result || result.result;
    if (resultStr) {
      try {
        const translated = JSON.parse(resultStr);
        if (Array.isArray(translated)) return translated;
      } catch {
        // If not JSON, continue to fallback
      }
    }

    // Fallback: call post endpoint for simple translation
    const translatedTexts: string[] = [];
    for (const text of texts) {
      try {
        const postResult = await callAI<{
          post?: string;
          data?: { post?: string };
        }>('post', {
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
  } catch (error) {
    console.warn('[Translator] AI translation failed:', error);
    return texts;
  }
}

// ============================================
// MAIN TRANSLATION FUNCTION
// ============================================

/**
 * Translate all slides to target language
 */
export async function translateSlides<T extends Slide[]>(
  slides: T,
  targetLanguage: string,
  onProgress?: (progress: TranslationProgress) => void
): Promise<T> {
  const texts = extractTexts(slides);

  if (texts.length === 0) return slides;

  onProgress?.({ stage: 'extracting', percentage: 10 });

  // First, try quick translations
  const quickTranslated: TextItem[] = [];
  const needsAI: TextItem[] = [];

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
    const textsToTranslate = needsAI.map((t) => t.value);
    const aiTranslated = await translateWithAI(textsToTranslate, targetLanguage);

    onProgress?.({ stage: 'applying', percentage: 80 });

    const aiResults: TextItem[] = needsAI.map((t, i) => ({
      path: t.path,
      value: aiTranslated[i] || t.value,
    }));

    const allTranslations = [...quickTranslated, ...aiResults];
    const translated = applyTranslations(slides, allTranslations);

    onProgress?.({ stage: 'complete', percentage: 100 });
    return translated;
  } catch (error) {
    console.warn('[Translator] AI translation failed:', error);

    // Fallback: return with quick translations only
    const translated = applyTranslations(slides, quickTranslated);
    onProgress?.({ stage: 'complete', percentage: 100 });
    return translated;
  }
}

/**
 * Translate a single text
 */
export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  // Try quick translation first
  const quick = quickTranslateText(text, targetLanguage);
  if (quick) return quick;

  // Use AI
  try {
    const result = await callAI<{
      post?: string;
      data?: { post?: string };
    }>('post', {
      topic: `Translate exactly to ${LANGUAGE_NAMES[targetLanguage]}, keep formatting: "${text}"`,
      style: 'translation',
      maxLength: text.length * 2,
      language: targetLanguage,
    });
    return result.data?.post || result.post || text;
  } catch {
    return text;
  }
}

/**
 * Quick translate (exported for compatibility)
 */
export function quickTranslate(text: string, targetLanguage: string): string {
  return quickTranslateText(text, targetLanguage) || text;
}

export default {
  translateSlides,
  translateText,
  quickTranslate,
  LANGUAGE_NAMES,
};
