// useAIGeneration Hook
// React hook for AI generation with state management

import { useState, useCallback } from 'react';
import { useEventBus } from '@/command';
import {
  generateCarouselFromHypothesis,
  getCarouselPatterns,
  getCarouselStyles,
  estimateGenerationTime,
} from '../services/carouselGenerator';
import {
  generatePost,
  generateHooks,
  generateIdeas,
  analyzeHook,
} from '../services/contentGenerator';
import { translateSlides, translateText } from '../services/translator';
import type {
  GenerationProgress,
  CarouselGenerationParams,
  GeneratedCarousel,
  PostGenerationParams,
  GeneratedPost,
  HooksGenerationParams,
  GeneratedHooks,
  IdeasGenerationParams,
  GeneratedIdeas,
  HookAnalysisParams,
  HookAnalysis,
  TranslationProgress,
} from '../types';

interface UseAIGenerationState {
  isGenerating: boolean;
  progress: GenerationProgress;
  error: string | null;
}

interface UseAIGenerationReturn extends UseAIGenerationState {
  // Carousel generation
  generateCarousel: (params: CarouselGenerationParams) => Promise<GeneratedCarousel | null>;
  getPatterns: typeof getCarouselPatterns;
  getStyles: typeof getCarouselStyles;
  estimateTime: typeof estimateGenerationTime;

  // Content generation
  createPost: (params: PostGenerationParams) => Promise<GeneratedPost | null>;
  createHooks: (params: HooksGenerationParams) => Promise<GeneratedHooks | null>;
  createIdeas: (params: IdeasGenerationParams) => Promise<GeneratedIdeas | null>;
  analyzeContent: (params: HookAnalysisParams) => Promise<HookAnalysis | null>;

  // Translation
  translate: <T extends Array<{ blocks?: unknown[] }>>(
    slides: T,
    targetLanguage: string,
    onProgress?: (progress: TranslationProgress) => void
  ) => Promise<T | null>;
  translateSingle: (text: string, targetLanguage: string) => Promise<string>;

  // State management
  clearError: () => void;
  resetProgress: () => void;
}

export function useAIGeneration(): UseAIGenerationReturn {
  const { emit } = useEventBus();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({ stage: '', percentage: 0 });
  const [error, setError] = useState<string | null>(null);

  // Carousel generation
  const generateCarousel = useCallback(
    async (params: CarouselGenerationParams): Promise<GeneratedCarousel | null> => {
      setIsGenerating(true);
      setError(null);
      setProgress({ stage: '', percentage: 0 });

      try {
        const result = await generateCarouselFromHypothesis({
          ...params,
          onProgress: (p) => {
            setProgress(p);
            params.onProgress?.(p);
          },
        });

        emit('ai:carousel-generated', {
          carouselId: result.metadata.generatedAt,
          slideCount: result.slides.length,
        });

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Carousel-Generierung fehlgeschlagen';
        setError(message);
        emit('ai:generation-error', { type: 'carousel', error: message });
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [emit]
  );

  // Post generation
  const createPost = useCallback(
    async (params: PostGenerationParams): Promise<GeneratedPost | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const result = await generatePost(params);
        emit('ai:post-generated', { topic: params.topic });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Post-Generierung fehlgeschlagen';
        setError(message);
        emit('ai:generation-error', { type: 'post', error: message });
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [emit]
  );

  // Hooks generation
  const createHooks = useCallback(
    async (params: HooksGenerationParams): Promise<GeneratedHooks | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const result = await generateHooks(params);
        emit('ai:hooks-generated', { topic: params.topic, count: result.hooks.length });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Hook-Generierung fehlgeschlagen';
        setError(message);
        emit('ai:generation-error', { type: 'hooks', error: message });
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [emit]
  );

  // Ideas generation
  const createIdeas = useCallback(
    async (params: IdeasGenerationParams): Promise<GeneratedIdeas | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const result = await generateIdeas(params);
        emit('ai:ideas-generated', { topic: params.topic, count: result.ideas.length });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Ideen-Generierung fehlgeschlagen';
        setError(message);
        emit('ai:generation-error', { type: 'ideas', error: message });
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [emit]
  );

  // Hook analysis
  const analyzeContent = useCallback(
    async (params: HookAnalysisParams): Promise<HookAnalysis | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const result = await analyzeHook(params);
        emit('ai:hook-analyzed', { score: result.score });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Analyse fehlgeschlagen';
        setError(message);
        emit('ai:generation-error', { type: 'analysis', error: message });
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [emit]
  );

  // Translation
  const translate = useCallback(
    async <T extends Array<{ blocks?: unknown[] }>>(
      slides: T,
      targetLanguage: string,
      onProgress?: (progress: TranslationProgress) => void
    ): Promise<T | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const result = await translateSlides(slides, targetLanguage, onProgress);
        emit('ai:slides-translated', {
          slideCount: slides.length,
          targetLanguage,
        });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Übersetzung fehlgeschlagen';
        setError(message);
        emit('ai:generation-error', { type: 'translation', error: message });
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [emit]
  );

  const translateSingle = useCallback(
    async (text: string, targetLanguage: string): Promise<string> => {
      try {
        return await translateText(text, targetLanguage);
      } catch {
        return text;
      }
    },
    []
  );

  // State management
  const clearError = useCallback(() => setError(null), []);
  const resetProgress = useCallback(
    () => setProgress({ stage: '', percentage: 0 }),
    []
  );

  return {
    // State
    isGenerating,
    progress,
    error,

    // Carousel
    generateCarousel,
    getPatterns: getCarouselPatterns,
    getStyles: getCarouselStyles,
    estimateTime: estimateGenerationTime,

    // Content
    createPost,
    createHooks,
    createIdeas,
    analyzeContent,

    // Translation
    translate,
    translateSingle,

    // State management
    clearError,
    resetProgress,
  };
}

export default useAIGeneration;
