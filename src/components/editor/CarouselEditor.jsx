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
import { createDefaultCarousel, createBlock } from '../../utils/slideTemplates';
import { generateAndDownloadPDF } from '../../lib/pdfGenerator';

const CarouselEditor = ({ editCarousel, setEditCarousel, loadCarousels }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [slides, setSlides] = useState(() => editCarousel?.slides || createDefaultCarousel());
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [title, setTitle] = useState(editCarousel?.title || '');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') goToPrevSlide();
      else if (e.key === 'ArrowRight') goToNextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideIndex, slides.length]);

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
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropBlock}
        >
          <CarouselSlideControls
            activeSlideIndex={activeSlideIndex}
            totalSlides={slides.length}
            onPrev={goToPrevSlide}
            onNext={goToNextSlide}
          />

          <div className="relative">
            <SlideCanvas
              ref={(el) => (slideRefs.current[activeSlideIndex] = el)}
              slide={activeSlide}
              onSlideChange={handleSlideChange}
              isEditing={!previewMode}
              scale={canvasScale}
              showControls={!previewMode}
            />
          </div>

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
            <BlockPalette onAddBlock={handleAddBlock} />
          </div>
        )}
      </div>

      <div className="fixed -left-[9999px] top-0">
        {slides.map((slide, index) => (
          <div key={slide.id} ref={(el) => (slideRefs.current[index] = el)} style={{ width: 1080, height: 1080 }}>
            <SlideCanvas slide={slide} onSlideChange={() => {}} isEditing={false} scale={1} showControls={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselEditor;
