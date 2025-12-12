// useCarousel Hook
// Main hook for carousel editor state management

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEventBus } from '@/command';
import { useToast, useLanguage } from '@/squads/core';
import { translateSlides } from '@/squads/ai';
import {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  createCarousel,
  updateCarousel,
  getCarousel,
} from '../services/carouselStorage';
import { generateAndDownloadPDF } from '../services/pdfExporter';
import { createSlide, createBlock, getSlidesForTemplate } from '../templates';
import type { Slide, Block, Carousel, ExportOptions } from '../types';

interface UseCarouselOptions {
  initialCarousel?: Carousel | null;
  onSaved?: (carousel: Carousel) => void;
}

interface UseCarouselReturn {
  // State
  slides: Slide[];
  activeSlideIndex: number;
  title: string;
  isLoading: boolean;
  isSaving: boolean;
  isExporting: boolean;
  isTranslating: boolean;
  exportProgress: number;
  contentLanguage: string;
  showTemplates: boolean;
  hasDraft: boolean;

  // Slide actions
  setSlides: (slides: Slide[] | ((prev: Slide[]) => Slide[])) => void;
  setActiveSlideIndex: (index: number) => void;
  setTitle: (title: string) => void;
  addSlide: (slide?: Slide) => void;
  deleteSlide: (index: number) => void;
  duplicateSlide: (index: number) => void;
  moveSlide: (fromIndex: number, toIndex: number) => void;
  updateSlide: (slide: Slide) => void;

  // Block actions
  addBlock: (block: Block) => void;
  updateBlock: (blockId: string, block: Block) => void;
  deleteBlock: (blockId: string) => void;

  // Background
  setBackground: (background: string, backgroundImage?: string | null) => void;

  // Template actions
  selectTemplate: (templateId: string) => void;
  resumeDraft: () => void;
  setShowTemplates: (show: boolean) => void;

  // Content language
  setContentLanguage: (language: string) => Promise<void>;

  // Save/Export
  save: () => Promise<void>;
  exportPDF: (options?: ExportOptions) => Promise<void>;

  // Navigation
  goToPrevSlide: () => void;
  goToNextSlide: () => void;

  // Utils
  reset: () => void;
}

export function useCarousel(options: UseCarouselOptions = {}): UseCarouselReturn {
  const { initialCarousel, onSaved } = options;
  const { emit } = useEventBus();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Check for editing param and draft
  const hasEditingParam = searchParams.get('editing') === 'true';
  const savedDraft = loadDraft();
  const shouldRestoreDraft = hasEditingParam && savedDraft && !initialCarousel;

  // State
  const [slides, setSlides] = useState<Slide[]>(() => {
    if (initialCarousel?.slides) return initialCarousel.slides;
    if (shouldRestoreDraft && savedDraft) return savedDraft.slides;
    return [];
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(() => {
    if (shouldRestoreDraft && savedDraft?.activeSlideIndex !== undefined) {
      return savedDraft.activeSlideIndex;
    }
    return 0;
  });

  const [title, setTitle] = useState(() => {
    if (initialCarousel?.title) return initialCarousel.title;
    if (shouldRestoreDraft && savedDraft) return savedDraft.title || '';
    return '';
  });

  const [showTemplates, setShowTemplates] = useState(!initialCarousel && !shouldRestoreDraft);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [contentLanguage, setContentLanguageState] = useState('en');

  const activeSlide = slides[activeSlideIndex];

  // Auto-save draft
  useEffect(() => {
    if (slides.length > 0 && !showTemplates) {
      saveDraft({
        slides,
        title,
        activeSlideIndex,
        lastModified: Date.now(),
      });

      if (searchParams.get('editing') !== 'true') {
        setSearchParams({ editing: 'true' }, { replace: true });
      }
    }
  }, [slides, title, activeSlideIndex, showTemplates, searchParams, setSearchParams]);

  // Slide actions
  const addSlide = useCallback((slide?: Slide) => {
    const newSlide = slide || createSlide('blank', slides.length + 1);
    if (newSlide) {
      setSlides((prev) => [...prev, newSlide]);
      setActiveSlideIndex(slides.length);
    }
  }, [slides.length]);

  const deleteSlide = useCallback((index: number) => {
    if (slides.length <= 1) {
      addToast(t('carousel.minSlides'), 'warning');
      return;
    }
    setSlides((prev) => prev.filter((_, i) => i !== index));
    if (activeSlideIndex >= index && activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  }, [slides.length, activeSlideIndex, addToast, t]);

  const duplicateSlide = useCallback((index: number) => {
    const slideToDuplicate = slides[index];
    const duplicatedSlide: Slide = {
      ...slideToDuplicate,
      id: `slide-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      blocks: slideToDuplicate.blocks.map((block) => ({
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      })),
    };
    setSlides((prev) => [...prev.slice(0, index + 1), duplicatedSlide, ...prev.slice(index + 1)]);
    setActiveSlideIndex(index + 1);
  }, [slides]);

  const moveSlide = useCallback((fromIndex: number, toIndex: number) => {
    setSlides((prev) => {
      const newSlides = [...prev];
      const [movedSlide] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, movedSlide);
      return newSlides;
    });
    setActiveSlideIndex(toIndex);
  }, []);

  const updateSlide = useCallback((updatedSlide: Slide) => {
    setSlides((prev) => prev.map((slide, i) => i === activeSlideIndex ? updatedSlide : slide));
  }, [activeSlideIndex]);

  // Block actions
  const addBlock = useCallback((block: Block) => {
    if (!activeSlide) return;
    updateSlide({ ...activeSlide, blocks: [...activeSlide.blocks, block] });
  }, [activeSlide, updateSlide]);

  const updateBlock = useCallback((blockId: string, updatedBlock: Block) => {
    if (!activeSlide) return;
    updateSlide({
      ...activeSlide,
      blocks: activeSlide.blocks.map((b) => b.id === blockId ? updatedBlock : b),
    });
  }, [activeSlide, updateSlide]);

  const deleteBlock = useCallback((blockId: string) => {
    if (!activeSlide) return;
    updateSlide({
      ...activeSlide,
      blocks: activeSlide.blocks.filter((b) => b.id !== blockId),
    });
  }, [activeSlide, updateSlide]);

  // Background
  const setBackground = useCallback((background: string, backgroundImage?: string | null) => {
    if (!activeSlide) return;
    const updatedStyles = { ...activeSlide.styles, background: background as any };

    if (background === 'custom-image' && backgroundImage) {
      updatedStyles.backgroundImage = backgroundImage;
    } else if (backgroundImage === null) {
      updatedStyles.backgroundImage = null;
    }

    updateSlide({ ...activeSlide, styles: updatedStyles });
  }, [activeSlide, updateSlide]);

  // Template actions
  const selectTemplate = useCallback((templateId: string) => {
    const newSlides = getSlidesForTemplate(templateId);
    setSlides(newSlides);
    setTitle('');
    setActiveSlideIndex(0);
    setShowTemplates(false);

    emit('carousel:template-selected', { templateId, slideCount: newSlides.length });
  }, [emit]);

  const resumeDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft && draft.slides && draft.slides.length > 0) {
      setSlides(draft.slides);
      setTitle(draft.title || '');
      setActiveSlideIndex(draft.activeSlideIndex || 0);
      setShowTemplates(false);
      setSearchParams({ editing: 'true' }, { replace: true });
    }
  }, [setSearchParams]);

  // Content language
  const setContentLanguage = useCallback(async (newLanguage: string) => {
    if (newLanguage === contentLanguage || slides.length === 0) {
      setContentLanguageState(newLanguage);
      return;
    }

    setIsTranslating(true);
    try {
      const translatedSlides = await translateSlides(slides, newLanguage);
      if (translatedSlides) {
        setSlides(translatedSlides);
        setContentLanguageState(newLanguage);
        addToast(t('editor.slidesTranslated'), 'success');
      }
    } catch (error) {
      console.error('[useCarousel] Translation failed:', error);
      addToast(t('editor.translationFailed'), 'error');
      setContentLanguageState(newLanguage);
    } finally {
      setIsTranslating(false);
    }
  }, [contentLanguage, slides, addToast, t]);

  // Save
  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const carouselData = {
        title: title || t('carousel.untitled'),
        slides,
        settings: { width: 1080, height: 1080 },
      };

      let savedCarousel: Carousel;

      if (initialCarousel?.id) {
        savedCarousel = await updateCarousel(initialCarousel.id, carouselData);
        addToast(t('carousel.saved'), 'success');
      } else {
        savedCarousel = await createCarousel(carouselData);
        addToast(t('carousel.created'), 'success');
      }

      clearDraft();
      emit('carousel:saved', { carouselId: savedCarousel.id, slideCount: slides.length });
      onSaved?.(savedCarousel);
    } catch (error) {
      console.error('[useCarousel] Save failed:', error);
      addToast(t('carousel.saveFailed'), 'error');
    } finally {
      setIsSaving(false);
    }
  }, [title, slides, initialCarousel, addToast, t, emit, onSaved]);

  // Export PDF
  const exportPDF = useCallback(async (options: ExportOptions = {}) => {
    if (slides.length === 0) {
      addToast(t('carousel.noSlides'), 'warning');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      await generateAndDownloadPDF(slides, {
        filename: `${title || 'linkedin-carousel'}.pdf`,
        width: 1080,
        height: 1080,
        quality: 2,
        onProgress: ({ percentage }) => setExportProgress(percentage),
        ...options,
      });

      emit('carousel:exported', { slideCount: slides.length, format: 'pdf' });
      addToast(t('carousel.exported'), 'success');
    } catch (error) {
      console.error('[useCarousel] Export failed:', error);
      addToast(t('carousel.exportFailed'), 'error');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [slides, title, addToast, t, emit]);

  // Navigation
  const goToPrevSlide = useCallback(() => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  }, [activeSlideIndex]);

  const goToNextSlide = useCallback(() => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  }, [activeSlideIndex, slides.length]);

  // Reset
  const reset = useCallback(() => {
    setSlides([]);
    setTitle('');
    setActiveSlideIndex(0);
    setShowTemplates(true);
    clearDraft();
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    // State
    slides,
    activeSlideIndex,
    title,
    isLoading,
    isSaving,
    isExporting,
    isTranslating,
    exportProgress,
    contentLanguage,
    showTemplates,
    hasDraft: hasDraft(),

    // Slide actions
    setSlides,
    setActiveSlideIndex,
    setTitle,
    addSlide,
    deleteSlide,
    duplicateSlide,
    moveSlide,
    updateSlide,

    // Block actions
    addBlock,
    updateBlock,
    deleteBlock,

    // Background
    setBackground,

    // Template actions
    selectTemplate,
    resumeDraft,
    setShowTemplates,

    // Content language
    setContentLanguage,

    // Save/Export
    save,
    exportPDF,

    // Navigation
    goToPrevSlide,
    goToNextSlide,

    // Utils
    reset,
  };
}

export default useCarousel;
