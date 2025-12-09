import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../lib/supabase';
import SlideCanvas from './SlideCanvas';
import SlideNavigator from './SlideNavigator';
import BlockPalette from './BlockPalette';
import CarouselHeader from './CarouselHeader';
import CarouselSlideControls from './CarouselSlideControls';
import CarouselBackgroundPanel from './CarouselBackgroundPanel';
import AIGeneratorModal from './AIGeneratorModal';
import CarouselTemplates from './CarouselTemplates';
import { createDefaultCarousel, createBlock, createSlide } from '../../utils/slideTemplates';
import { generateAndDownloadPDF } from '../../lib/pdfGenerator';
import { LoginModal } from '../auth';

// LocalStorage key for carousel draft
const CAROUSEL_DRAFT_KEY = 'carousel_draft';

const CarouselEditor = ({ editCarousel, setEditCarousel, loadCarousels }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const isDE = language === 'de';

  // Load draft from LocalStorage on mount
  const loadDraftFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(CAROUSEL_DRAFT_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
    return null;
  }, []);

  // Check URL params and LocalStorage for existing draft
  const hasEditingParam = searchParams.get('editing') === 'true';
  const savedDraft = loadDraftFromStorage();
  const shouldRestoreDraft = hasEditingParam && savedDraft && !editCarousel;

  // Show templates if no editCarousel is passed AND no draft to restore
  const [showTemplates, setShowTemplates] = useState(!editCarousel && !shouldRestoreDraft);
  const [slides, setSlides] = useState(() => {
    if (editCarousel?.slides) return editCarousel.slides;
    if (shouldRestoreDraft) return savedDraft.slides;
    return [];
  });
  const [activeSlideIndex, setActiveSlideIndex] = useState(() => {
    if (shouldRestoreDraft && savedDraft.activeSlideIndex !== undefined) {
      return savedDraft.activeSlideIndex;
    }
    return 0;
  });
  const [title, setTitle] = useState(() => {
    if (editCarousel?.title) return editCarousel.title;
    if (shouldRestoreDraft) return savedDraft.title || '';
    return '';
  });
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'save' or 'linkedin'

  // Save draft to LocalStorage whenever slides or title change
  useEffect(() => {
    if (slides.length > 0 && !showTemplates) {
      const draft = {
        slides,
        title,
        activeSlideIndex,
        lastModified: Date.now()
      };
      try {
        localStorage.setItem(CAROUSEL_DRAFT_KEY, JSON.stringify(draft));
        // Update URL to indicate we're editing
        if (searchParams.get('editing') !== 'true') {
          setSearchParams({ editing: 'true' }, { replace: true });
        }
      } catch (e) {
        console.error('Failed to save draft:', e);
      }
    }
  }, [slides, title, activeSlideIndex, showTemplates, searchParams, setSearchParams]);

  // Clear draft when leaving templates mode to start fresh
  const clearDraft = useCallback(() => {
    localStorage.removeItem(CAROUSEL_DRAFT_KEY);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Track editor opened on mount
  useEffect(() => {
    db.trackEditorOpened();
    db.trackPageView('carousel_editor');
  }, []);

  const slideRefs = useRef([]);
  const canvasScale = 0.55;
  const activeSlide = slides[activeSlideIndex];

  const handleSlideChange = useCallback((updatedSlide) => {
    setSlides((prev) => prev.map((slide, i) => i === activeSlideIndex ? updatedSlide : slide));
  }, [activeSlideIndex]);

  const handleAddSlide = useCallback((newSlide) => {
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
  }, [slides.length]);

  const handleDeleteSlide = useCallback((index) => {
    if (slides.length <= 1) {
      addToast(t('carousel.minSlides'), 'warning');
      return;
    }
    setSlides((prev) => prev.filter((_, i) => i !== index));
    if (activeSlideIndex >= index && activeSlideIndex > 0) setActiveSlideIndex(activeSlideIndex - 1);
  }, [slides.length, activeSlideIndex, addToast, t]);

  const handleDuplicateSlide = useCallback((index) => {
    const slideToDuplicate = slides[index];
    const duplicatedSlide = {
      ...slideToDuplicate,
      id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      blocks: slideToDuplicate.blocks.map((block) => ({
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
    };
    setSlides((prev) => [...prev.slice(0, index + 1), duplicatedSlide, ...prev.slice(index + 1)]);
    setActiveSlideIndex(index + 1);
  }, [slides]);

  const handleMoveSlide = useCallback((fromIndex, toIndex) => {
    setSlides((prev) => {
      const newSlides = [...prev];
      const [movedSlide] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, movedSlide);
      return newSlides;
    });
    setActiveSlideIndex(toIndex);
  }, []);

  const handleAddBlock = useCallback((newBlock) => {
    handleSlideChange({ ...activeSlide, blocks: [...activeSlide.blocks, newBlock] });
  }, [activeSlide, handleSlideChange]);

  const handleDropBlock = useCallback((e) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('blockType');
    if (blockType) {
      const newBlock = createBlock(blockType);
      if (newBlock) handleAddBlock(newBlock);
    }
  }, [handleAddBlock]);

  const handleBackgroundChange = useCallback((bgKey) => {
    handleSlideChange({ ...activeSlide, styles: { ...activeSlide.styles, background: bgKey } });
    setShowStylePanel(false);
  }, [activeSlide, handleSlideChange]);

  const goToPrevSlide = () => { if (activeSlideIndex > 0) setActiveSlideIndex(activeSlideIndex - 1); };
  const goToNextSlide = () => { if (activeSlideIndex < slides.length - 1) setActiveSlideIndex(activeSlideIndex + 1); };

  const handleAIGenerated = useCallback((result) => {
    setSlides(result.slides);
    setTitle(result.title);
    setActiveSlideIndex(0);
    setShowTemplates(false);
    setShowAIGenerator(false);
    // Track AI generation
    db.trackAIGenerated(result.pattern || 'unknown', result.slides?.length || 0);
    addToast(isDE ? 'Carousel erfolgreich generiert!' : 'Carousel generated successfully!', 'success');
  }, [addToast, isDE]);

  // Handle template selection
  const handleSelectTemplate = useCallback((templateId) => {
    let newSlides;
    switch (templateId) {
      case 'optionComparison':
        newSlides = [
          createSlide('cover', 1),
          createSlide('option', 2),
          createSlide('option', 3),
          createSlide('comparison', 4),
          createSlide('cta', 5)
        ];
        break;
      case 'storySelling':
        newSlides = [
          createSlide('cover', 1),
          createSlide('option', 2),
          createSlide('option', 3),
          createSlide('quote', 4),
          createSlide('stats', 5),
          createSlide('cta', 6)
        ];
        break;
      case 'statsShowcase':
        newSlides = [
          createSlide('cover', 1),
          createSlide('stats', 2),
          createSlide('stats', 3),
          createSlide('cta', 4)
        ];
        break;
      case 'tipsList':
        newSlides = [
          createSlide('cover', 1),
          createSlide('option', 2),
          createSlide('option', 3),
          createSlide('option', 4),
          createSlide('cta', 5)
        ];
        break;
      case 'blank':
      default:
        newSlides = [createSlide('blank', 1)];
        break;
    }
    setSlides(newSlides);
    setTitle('');
    setActiveSlideIndex(0);
    setShowTemplates(false);
    // Track template usage
    db.trackTemplateUsed(templateId);
  }, []);

  const handleSave = async () => {
    if (!isAuthenticated) {
      setPendingAction('save');
      setShowLoginModal(true);
      return;
    }
    await performSave();
  };

  const performSave = async () => {
    setSaving(true);
    try {
      const carouselData = { title: title || t('carousel.untitled'), slides, settings: { width: 1080, height: 1080 } };
      if (editCarousel?.id) {
        await db.updateCarousel(editCarousel.id, carouselData);
        addToast(t('carousel.saved'), 'success');
      } else {
        await db.createCarousel(carouselData);
        addToast(t('carousel.created'), 'success');
      }
      // Clear draft after successful save
      clearDraft();
      if (loadCarousels) await loadCarousels();
    } catch (error) {
      console.error('Save failed:', error);
      addToast(t('carousel.saveFailed') + error.message, 'error');
    } finally { setSaving(false); }
  };

  const handleExportPDF = async () => {
    if (slides.length === 0) { addToast(t('carousel.noSlides'), 'warning'); return; }
    setExporting(true);
    setExportProgress(0);
    try {
      const slideElements = slideRefs.current.filter(Boolean);
      if (slideElements.length === 0) throw new Error('No slides found to export');
      await generateAndDownloadPDF(slideElements, {
        filename: `${title || 'linkedin-carousel'}.pdf`,
        width: 1080, height: 1080, quality: 2,
        onProgress: ({ percentage }) => setExportProgress(percentage),
      });
      // Track analytics event
      db.trackCarouselExported(slides.length);
      addToast(t('carousel.exported'), 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast(t('carousel.exportFailed') + error.message, 'error');
    } finally { setExporting(false); setExportProgress(0); }
  };

  // LinkedIn Post - Opens LinkedIn with pre-filled post (no login required)
  const handlePostToLinkedIn = useCallback(async () => {
    if (slides.length === 0) {
      addToast(isDE ? 'Keine Slides zum Posten' : 'No slides to post', 'warning');
      return;
    }

    await performPostToLinkedIn();
  }, [slides.length, isDE, addToast, performPostToLinkedIn]);

  const performPostToLinkedIn = useCallback(async () => {
    // First export the PDF
    setExporting(true);
    setExportProgress(0);
    try {
      const slideElements = slideRefs.current.filter(Boolean);
      if (slideElements.length === 0) throw new Error('No slides found');

      await generateAndDownloadPDF(slideElements, {
        filename: `${title || 'linkedin-carousel'}.pdf`,
        width: 1080, height: 1080, quality: 2,
        onProgress: ({ percentage }) => setExportProgress(percentage),
      });

      // Open LinkedIn share dialog
      const linkedInUrl = 'https://www.linkedin.com/feed/?shareActive=true';
      window.open(linkedInUrl, '_blank');

      addToast(
        isDE
          ? 'PDF heruntergeladen! Lade es jetzt in deinen LinkedIn Post hoch.'
          : 'PDF downloaded! Now upload it to your LinkedIn post.',
        'success'
      );
    } catch (error) {
      console.error('Post to LinkedIn failed:', error);
      addToast(isDE ? 'Fehler beim Vorbereiten' : 'Preparation failed', 'error');
    } finally {
      setExporting(false);
      setExportProgress(0);
    }
  }, [slides, title, isDE, addToast]);

  // Handle successful login - execute pending action
  const handleLoginSuccess = useCallback(async () => {
    setShowLoginModal(false);
    if (pendingAction === 'save') {
      await performSave();
    } else if (pendingAction === 'linkedin') {
      await performPostToLinkedIn();
    }
    setPendingAction(null);
  }, [pendingAction, performSave, performPostToLinkedIn]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') goToPrevSlide();
      else if (e.key === 'ArrowRight') goToNextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideIndex, slides.length]);

  // Handle resuming a draft from templates screen
  const handleResumeDraft = useCallback(() => {
    const draft = loadDraftFromStorage();
    if (draft && draft.slides && draft.slides.length > 0) {
      setSlides(draft.slides);
      setTitle(draft.title || '');
      setActiveSlideIndex(draft.activeSlideIndex || 0);
      setShowTemplates(false);
      setSearchParams({ editing: 'true' }, { replace: true });
    }
  }, [loadDraftFromStorage, setSearchParams]);

  // Template Selection View
  if (showTemplates) {
    return (
      <>
        <CarouselTemplates
          onSelectTemplate={handleSelectTemplate}
          onOpenAI={() => setShowAIGenerator(true)}
          onResumeDraft={handleResumeDraft}
        />
        <AIGeneratorModal
          isOpen={showAIGenerator}
          onClose={() => setShowAIGenerator(false)}
          onGenerated={handleAIGenerated}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-[#0A0A0B] flex flex-col overflow-hidden">
      <CarouselHeader
        title={title}
        setTitle={setTitle}
        isAuthenticated={isAuthenticated}
        saving={saving}
        exporting={exporting}
        exportProgress={exportProgress}
        previewMode={previewMode}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        onSave={handleSave}
        onExport={handleExportPDF}
        t={t}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-40 flex-shrink-0 border-r border-white/5 bg-[#111113] overflow-hidden flex flex-col">
          <SlideNavigator
            slides={slides}
            activeSlideIndex={activeSlideIndex}
            onSlideSelect={setActiveSlideIndex}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
            onDuplicateSlide={handleDuplicateSlide}
            onMoveSlide={handleMoveSlide}
            onSlidesChange={setSlides}
            onShowLoginModal={() => setShowLoginModal(true)}
          />
        </div>

        <div
          className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0A0A0B] relative overflow-auto"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropBlock}
        >

          {/* Slide Canvas */}
          <div className="relative z-10">
            <SlideCanvas
              ref={(el) => (slideRefs.current[activeSlideIndex] = el)}
              slide={activeSlide}
              onSlideChange={handleSlideChange}
              isEditing={!previewMode}
              scale={canvasScale}
              showControls={!previewMode}
            />
          </div>

          {/* Slide Navigation - at bottom */}
          <CarouselSlideControls
            activeSlideIndex={activeSlideIndex}
            totalSlides={slides.length}
            onPrev={goToPrevSlide}
            onNext={goToNextSlide}
          />

          {!previewMode && (
            <CarouselBackgroundPanel
              show={showStylePanel}
              onToggle={() => setShowStylePanel(!showStylePanel)}
              activeBackground={activeSlide?.styles?.background}
              onBackgroundChange={handleBackgroundChange}
              t={t}
            />
          )}
        </div>

        {!previewMode && (
          <div className="w-48 flex-shrink-0 border-l border-white/5 bg-[#111113] overflow-y-auto">
            <BlockPalette
              onAddBlock={handleAddBlock}
              onOpenAI={() => setShowAIGenerator(true)}
              onPostToLinkedIn={handlePostToLinkedIn}
            />
          </div>
        )}
      </div>

      {/* Hidden slides for PDF export - completely invisible */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: '-99999px',
          top: '-99999px',
          opacity: 0,
          visibility: 'hidden',
          zIndex: -9999
        }}
        aria-hidden="true"
      >
        {slides.map((slide, index) => (
          <div key={slide.id} ref={(el) => (slideRefs.current[index] = el)} style={{ width: 1080, height: 1080 }}>
            <SlideCanvas slide={slide} onSlideChange={() => {}} isEditing={false} scale={1} showControls={false} />
          </div>
        ))}
      </div>

      {/* AI Generator Modal */}
      <AIGeneratorModal
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onGenerated={handleAIGenerated}
      />

      {/* Login Modal for soft login */}
      {showLoginModal && (
        <LoginModal
          onClose={() => {
            setShowLoginModal(false);
            setPendingAction(null);
          }}
          onLogin={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default CarouselEditor;
