import React, { useState, useRef, useCallback, useEffect } from 'react';
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

const CarouselEditor = ({ editCarousel, setEditCarousel, loadCarousels }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { t, language } = useLanguage();
  const isDE = language === 'de';

  // Show templates if no editCarousel is passed
  const [showTemplates, setShowTemplates] = useState(!editCarousel);
  const [slides, setSlides] = useState(() => editCarousel?.slides || []);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [title, setTitle] = useState(editCarousel?.title || '');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

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
  }, []);

  const handleSave = async () => {
    if (!isAuthenticated) { addToast(t('carousel.loginToSave'), 'warning'); return; }
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
      addToast(t('carousel.exported'), 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast(t('carousel.exportFailed') + error.message, 'error');
    } finally { setExporting(false); setExportProgress(0); }
  };

  // LinkedIn Post - Opens LinkedIn with pre-filled post
  const handlePostToLinkedIn = useCallback(async () => {
    if (slides.length === 0) {
      addToast(isDE ? 'Keine Slides zum Posten' : 'No slides to post', 'warning');
      return;
    }

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') goToPrevSlide();
      else if (e.key === 'ArrowRight') goToNextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideIndex, slides.length]);

  // Template Selection View
  if (showTemplates) {
    return (
      <>
        <CarouselTemplates
          onSelectTemplate={handleSelectTemplate}
          onOpenAI={() => setShowAIGenerator(true)}
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
          />
        </div>

        <div
          className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0A0A0B] relative overflow-auto"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('drag-over');
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove('drag-over');
          }}
          onDrop={(e) => {
            e.currentTarget.classList.remove('drag-over');
            handleDropBlock(e);
          }}
        >
          {/* Drop Zone Visual Indicator */}
          {!previewMode && (
            <div className="absolute inset-6 rounded-2xl border-2 border-dashed border-[#0A66C2]/30 pointer-events-none transition-colors duration-200" />
          )}

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
    </div>
  );
};

export default CarouselEditor;
