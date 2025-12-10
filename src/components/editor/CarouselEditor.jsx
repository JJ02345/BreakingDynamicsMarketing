import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../lib/supabase';
import useDeviceDetection from '../../hooks/useDeviceDetection';
import { useBrandingSettings } from '../../hooks/useBrandingSettings';
import SlideCanvas from './SlideCanvas';
import SlideNavigator from './SlideNavigator';
import BlockPalette from './BlockPalette';
import CarouselHeader from './CarouselHeader';
import CarouselSlideControls from './CarouselSlideControls';
import AIGeneratorModal from './AIGeneratorModal';
import CarouselTemplates from './CarouselTemplates';
import MobileCarouselEditor from './MobileCarouselEditor';
import { createDefaultCarousel, createBlock, createSlide } from '../../utils/slideTemplates';
import { generateAndDownloadPDF } from '../../lib/pdfGenerator';
import { translateSlides } from '../../lib/slideTranslator';
import { LoginModal } from '../auth';

// LocalStorage key for carousel draft
const CAROUSEL_DRAFT_KEY = 'carousel_draft';

const CarouselEditor = ({ editCarousel, setEditCarousel, loadCarousels }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Device detection for responsive layout
  const { isMobile, isTablet, deviceType } = useDeviceDetection();

  // Branding settings
  const { showBranding } = useBrandingSettings(isAuthenticated);

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
  const [previewMode, setPreviewMode] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'save' or 'linkedin'
  const [contentLanguage, setContentLanguage] = useState('en'); // Slide content language
  const [isTranslating, setIsTranslating] = useState(false);

  // Handle language change with translation
  const handleContentLanguageChange = async (newLanguage) => {
    if (newLanguage === contentLanguage || slides.length === 0) {
      setContentLanguage(newLanguage);
      return;
    }

    setIsTranslating(true);
    try {
      const translatedSlides = await translateSlides(slides, newLanguage, (progress) => {
        // Could show progress here if needed
      });
      setSlides(translatedSlides);
      setContentLanguage(newLanguage);
      addToast(t('editor.slidesTranslated'), 'success');
    } catch (error) {
      console.error('Translation failed:', error);
      addToast(t('editor.translationFailed'), 'error');
      setContentLanguage(newLanguage); // Still change language even if translation fails
    } finally {
      setIsTranslating(false);
    }
  };

  // Resizable panels - smaller on tablet
  const [leftPanelWidth, setLeftPanelWidth] = useState(isTablet ? 120 : 160);
  const [rightPanelWidth, setRightPanelWidth] = useState(isTablet ? 160 : 192);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // Handle panel resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingLeft) {
        const newWidth = Math.min(Math.max(e.clientX, 120), 300); // min 120, max 300
        setLeftPanelWidth(newWidth);
      } else if (isResizingRight) {
        const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 150), 350); // min 150, max 350
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizingLeft || isResizingRight) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

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
  // Dynamic canvas scale based on device
  const canvasScale = isTablet ? 0.45 : 0.55;
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

  const handleBackgroundChange = useCallback((bgKey, imageData = null) => {
    const updatedStyles = { ...activeSlide.styles, background: bgKey };

    // Handle image background
    if (bgKey === 'custom-image' && imageData) {
      updatedStyles.backgroundImage = imageData;
    } else if (imageData === null) {
      // Remove background image when switching to color/gradient
      updatedStyles.backgroundImage = null;
    }

    handleSlideChange({ ...activeSlide, styles: updatedStyles });
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
    addToast(t('carousel.created'), 'success');
  }, [addToast, t]);

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
          createSlide('journey', 2),
          createSlide('journey', 3),
          createSlide('journey', 4),
          createSlide('quote', 5),
          createSlide('cta', 6)
        ];
        break;
      case 'statsShowcase':
        newSlides = [
          createSlide('cover', 1),
          createSlide('stats', 2),
          createSlide('stats', 3),
          createSlide('stats', 4),
          createSlide('cta', 5)
        ];
        break;
      case 'tipsList':
        newSlides = [
          createSlide('cover', 1),
          createSlide('tip', 2),
          createSlide('tip', 3),
          createSlide('tip', 4),
          createSlide('tip', 5),
          createSlide('tip', 6),
          createSlide('cta', 7)
        ];
        break;
      case 'howToGuide':
        newSlides = [
          createSlide('cover', 1),
          createSlide('step', 2),
          createSlide('step', 3),
          createSlide('step', 4),
          createSlide('result', 5),
          createSlide('cta', 6)
        ];
        break;
      case 'mythVsReality':
        newSlides = [
          createSlide('cover', 1),
          createSlide('myth', 2),
          createSlide('reality', 3),
          createSlide('myth', 4),
          createSlide('reality', 5),
          createSlide('cta', 6)
        ];
        break;
      case 'beforeAfter':
        newSlides = [
          createSlide('cover', 1),
          createSlide('before', 2),
          createSlide('journey', 3),
          createSlide('after', 4),
          createSlide('cta', 5)
        ];
        break;
      case 'lessonsLearned':
        newSlides = [
          createSlide('cover', 1),
          createSlide('journey', 2),
          createSlide('lesson', 3),
          createSlide('lesson', 4),
          createSlide('lesson', 5),
          createSlide('cta', 6)
        ];
        break;
      case 'unpopularOpinion':
        newSlides = [
          createSlide('cover', 1),
          createSlide('opinion', 2),
          createSlide('proof', 3),
          createSlide('proof', 4),
          createSlide('cta', 5)
        ];
        break;
      case 'aboutMe':
        newSlides = [
          createSlide('aboutIntro', 1),
          createSlide('aboutWho', 2),
          createSlide('aboutWhat', 3),
          createSlide('aboutWhy', 4),
          createSlide('funFact', 5),
          createSlide('cta', 6)
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
      // Create array of {element, slide} for PDF generator to access background styles
      const slideData = slides.map((slide, index) => ({
        element: slideRefs.current[index],
        slide: slide
      })).filter(item => item.element);
      if (slideData.length === 0) throw new Error('No slides found to export');
      await generateAndDownloadPDF(slideData, {
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
  const performPostToLinkedIn = useCallback(async () => {
    // First export the PDF
    setExporting(true);
    setExportProgress(0);
    try {
      // Create array of {element, slide} for PDF generator to access background styles
      const slideData = slides.map((slide, index) => ({
        element: slideRefs.current[index],
        slide: slide
      })).filter(item => item.element);
      if (slideData.length === 0) throw new Error('No slides found');

      await generateAndDownloadPDF(slideData, {
        filename: `${title || 'linkedin-carousel'}.pdf`,
        width: 1080, height: 1080, quality: 2,
        onProgress: ({ percentage }) => setExportProgress(percentage),
      });

      // Open LinkedIn share dialog
      const linkedInUrl = 'https://www.linkedin.com/feed/?shareActive=true';
      window.open(linkedInUrl, '_blank');

      addToast(t('editor.pdfDownloaded'), 'success');
    } catch (error) {
      console.error('Post to LinkedIn failed:', error);
      addToast(t('editor.preparationFailed'), 'error');
    } finally {
      setExporting(false);
      setExportProgress(0);
    }
  }, [title, t, addToast, slides]);

  // Wrapper for LinkedIn post - show modal if not authenticated
  const handlePostToLinkedIn = useCallback(async () => {
    if (slides.length === 0) {
      addToast(t('editor.noSlidesToPost'), 'warning');
      return;
    }
    // Show login prompt if not authenticated
    if (!isAuthenticated) {
      setShowLinkedInModal(true);
      return;
    }
    await performPostToLinkedIn();
  }, [slides.length, t, addToast, performPostToLinkedIn, isAuthenticated]);

  // Continue LinkedIn post without login
  const handleLinkedInWithoutLogin = useCallback(async () => {
    setShowLinkedInModal(false);
    await performPostToLinkedIn();
  }, [performPostToLinkedIn]);

  // Login then post to LinkedIn
  const handleLinkedInWithLogin = useCallback(() => {
    setShowLinkedInModal(false);
    setPendingAction('linkedin');
    setShowLoginModal(true);
  }, []);

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

  // Mobile Editor View
  if (isMobile) {
    return (
      <>
        <MobileCarouselEditor
          slides={slides}
          setSlides={setSlides}
          activeSlideIndex={activeSlideIndex}
          setActiveSlideIndex={setActiveSlideIndex}
          title={title}
          setTitle={setTitle}
          onSave={handleSave}
          onOpenAI={() => setShowAIGenerator(true)}
          onPostToLinkedIn={handlePostToLinkedIn}
          isAuthenticated={isAuthenticated}
          saving={saving}
          exporting={exporting}
          exportProgress={exportProgress}
          onExport={handleExportPDF}
          slideRefs={slideRefs}
        />

        {/* Hidden slides for PDF export - positioned off-screen but rendered */}
        <div
          className="fixed pointer-events-none"
          style={{ left: '-9999px', top: '0px', zIndex: -1 }}
          aria-hidden="true"
        >
          {slides.map((slide, index) => (
            <SlideCanvas
              key={slide.id}
              ref={(el) => (slideRefs.current[index] = el)}
              slide={slide}
              onSlideChange={() => {}}
              isEditing={false}
              scale={1}
              showControls={false}
            />
          ))}
        </div>

        {/* AI Generator Modal */}
        <AIGeneratorModal
          isOpen={showAIGenerator}
          onClose={() => setShowAIGenerator(false)}
          onGenerated={handleAIGenerated}
        />

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal
            onClose={() => { setShowLoginModal(false); setPendingAction(null); }}
            onLogin={handleLoginSuccess}
          />
        )}
      </>
    );
  }

  // Safety check - if no slides but not showing templates, show loading or redirect to templates
  if (slides.length === 0 && !showTemplates) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF6B35] border-t-transparent mx-auto mb-4" />
          <p className="text-white/50">{t('editor.loading')}</p>
        </div>
      </div>
    );
  }

  // Desktop/Tablet Editor View
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
        {/* Left Panel - Slide Navigator (Resizable) */}
        <div
          className="flex-shrink-0 border-r border-white/5 bg-[#111113] overflow-hidden flex flex-col relative"
          style={{ width: leftPanelWidth }}
        >
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
          {/* Left resize handle */}
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#FF6B35]/50 transition-colors z-10"
            onMouseDown={() => setIsResizingLeft(true)}
          />
        </div>

        {/* Main Canvas Area */}
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
              showBranding={showBranding}
            />
          </div>

          {/* Slide Navigation - at bottom */}
          <CarouselSlideControls
            activeSlideIndex={activeSlideIndex}
            totalSlides={slides.length}
            onPrev={goToPrevSlide}
            onNext={goToNextSlide}
          />
        </div>

        {/* Right Panel - Block Palette (Resizable) */}
        {!previewMode && (
          <div
            className="flex-shrink-0 border-l border-white/5 bg-[#111113] overflow-y-auto relative"
            style={{ width: rightPanelWidth }}
          >
            {/* Right resize handle */}
            <div
              className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-[#FF6B35]/50 transition-colors z-10"
              onMouseDown={() => setIsResizingRight(true)}
            />
            <BlockPalette
              onAddBlock={handleAddBlock}
              onOpenAI={() => setShowAIGenerator(true)}
              onPostToLinkedIn={handlePostToLinkedIn}
              onBackgroundChange={handleBackgroundChange}
              activeBackground={activeSlide?.styles?.background}
              activeBackgroundImage={activeSlide?.styles?.backgroundImage}
              contentLanguage={contentLanguage}
              onContentLanguageChange={handleContentLanguageChange}
              isTranslating={isTranslating}
            />
          </div>
        )}
      </div>

      {/* Hidden slides for PDF export - positioned off-screen but rendered */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: '-9999px',
          top: '0px',
          zIndex: -1
        }}
        aria-hidden="true"
      >
        {slides.map((slide, index) => (
          <SlideCanvas
            key={slide.id}
            ref={(el) => (slideRefs.current[index] = el)}
            slide={slide}
            onSlideChange={() => {}}
            isEditing={false}
            scale={1}
            showControls={false}
            showBranding={showBranding}
          />
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

      {/* LinkedIn Post Modal - Login prompt with skip option */}
      {showLinkedInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-[#1A1A1D] rounded-2xl border border-white/10 shadow-2xl p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#0077B5]/10 border border-[#0077B5]/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0077B5]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('editor.postToLinkedIn')}
              </h3>
              <p className="text-white/60 text-sm">
                {t('editor.registerToSave')}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLinkedInWithLogin}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                {t('editor.registerSignIn')}
              </button>

              <button
                onClick={handleLinkedInWithoutLogin}
                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {t('editor.continueWithoutReg')}
              </button>
            </div>

            <button
              onClick={() => setShowLinkedInModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselEditor;
