// AI Provider - AI Context for the application
// Provides AI services to child components

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useEventBus } from '@/command';
import { checkHealth } from './services/aiProxy';
import {
  generateCarouselFromHypothesis,
  getCarouselPatterns,
  getCarouselStyles,
} from './services/carouselGenerator';
import {
  generatePost,
  generateHooks,
  generateIdeas,
  analyzeHook,
} from './services/contentGenerator';
import type {
  AIState,
  AIContextValue,
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
} from './types';

// ============================================
// CONTEXT
// ============================================

const AIContext = createContext<AIContextValue | null>(null);

interface AIProviderProps {
  children: React.ReactNode;
  /**
   * Initial health check on mount
   * @default true
   */
  checkOnMount?: boolean;
  /**
   * Auto-refresh health interval in ms (0 to disable)
   * @default 60000
   */
  healthCheckInterval?: number;
}

// ============================================
// PROVIDER
// ============================================

export function AIProvider({
  children,
  checkOnMount = true,
  healthCheckInterval = 60000,
}: AIProviderProps) {
  const { emit } = useEventBus();
  const [state, setState] = useState<AIState>({
    isAvailable: false,
    isChecking: false,
    lastCheck: null,
    error: null,
  });

  // Health check function
  const performHealthCheck = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isChecking: true, error: null }));

    try {
      const isAvailable = await checkHealth();

      setState({
        isAvailable,
        isChecking: false,
        lastCheck: new Date(),
        error: null,
      });

      emit('ai:health-checked', { isAvailable });
      return isAvailable;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Health check failed';

      setState({
        isAvailable: false,
        isChecking: false,
        lastCheck: new Date(),
        error,
      });

      emit('ai:health-checked', { isAvailable: false, error });
      return false;
    }
  }, [emit]);

  // Initial health check
  useEffect(() => {
    if (checkOnMount) {
      performHealthCheck();
    }
  }, [checkOnMount, performHealthCheck]);

  // Auto-refresh health
  useEffect(() => {
    if (healthCheckInterval <= 0) return;

    const intervalId = setInterval(performHealthCheck, healthCheckInterval);
    return () => clearInterval(intervalId);
  }, [healthCheckInterval, performHealthCheck]);

  // Carousel generation
  const handleGenerateCarousel = useCallback(
    async (params: CarouselGenerationParams): Promise<GeneratedCarousel> => {
      const result = await generateCarouselFromHypothesis(params);

      emit('ai:carousel-generated', {
        carouselId: result.metadata.generatedAt,
        slideCount: result.slides.length,
        pattern: result.metadata.pattern,
      });

      return result;
    },
    [emit]
  );

  // Post generation
  const handleGeneratePost = useCallback(
    async (params: PostGenerationParams): Promise<GeneratedPost> => {
      const result = await generatePost(params);
      emit('ai:post-generated', { topic: params.topic });
      return result;
    },
    [emit]
  );

  // Hooks generation
  const handleGenerateHooks = useCallback(
    async (params: HooksGenerationParams): Promise<GeneratedHooks> => {
      const result = await generateHooks(params);
      emit('ai:hooks-generated', { topic: params.topic, count: result.hooks.length });
      return result;
    },
    [emit]
  );

  // Ideas generation
  const handleGenerateIdeas = useCallback(
    async (params: IdeasGenerationParams): Promise<GeneratedIdeas> => {
      const result = await generateIdeas(params);
      emit('ai:ideas-generated', { topic: params.topic, count: result.ideas.length });
      return result;
    },
    [emit]
  );

  // Hook analysis
  const handleAnalyzeHook = useCallback(
    async (params: HookAnalysisParams): Promise<HookAnalysis> => {
      const result = await analyzeHook(params);
      emit('ai:hook-analyzed', { score: result.score });
      return result;
    },
    [emit]
  );

  // Context value
  const value: AIContextValue = {
    ...state,
    checkHealth: performHealthCheck,
    generateCarousel: handleGenerateCarousel,
    generatePost: handleGeneratePost,
    generateHooks: handleGenerateHooks,
    generateIdeas: handleGenerateIdeas,
    analyzeHook: handleAnalyzeHook,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

// ============================================
// HOOK
// ============================================

export function useAI(): AIContextValue {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

export default AIProvider;
