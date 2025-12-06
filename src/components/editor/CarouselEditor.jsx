import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home, ArrowLeft, Zap, Download, Save, Loader2, ChevronLeft, ChevronRight,
  Palette, Settings, Eye, X, Check, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage, LanguageSwitcher } from '../../context/LanguageContext';
import { db } from '../../lib/supabase';
import SlideCanvas from './SlideCanvas';
import SlideNavigator from './SlideNavigator';
import BlockPalette from './BlockPalette';
import { createDefaultCarousel, createSlide, createBlock, BACKGROUND_STYLES } from '../../utils/slideTemplates';
import { generateAndDownloadPDF } from '../../lib/pdfGenerator';

const CarouselEditor = ({ editCarousel, setEditCarousel, loadCarousels }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // State
  const [slides, setSlides] = useState(() => editCarousel?.slides || createDefaultCarousel());
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [title, setTitle] = useState(editCarousel?.title || '');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Refs for PDF export
  const slideRefs = useRef([]);
  const canvasScale = 0.55;

  // Current active slide
  const activeSlide = slides[activeSlideIndex];

  // Handle slide changes
  const handleSlideChange = useCallback((updatedSlide) => {
    setSlides((prev) =>
      prev.map((slide, index) =>
        index === activeSlideIndex ? updatedSlide : slide
      )
    );
  }, [activeSlideIndex]);

  // Add new slide
  const handleAddSlide = useCallback((newSlide) => {
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
  }, [slides.length]);

  // Delete slide
  const handleDeleteSlide = useCallback((index) => {
    if (slides.length <= 1) {
      addToast(t('carousel.minSlides'), 'warning');
      return;
    }
    setSlides((prev) => prev.filter((_, i) => i !== index));
    if (activeSlideIndex >= index && activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  }, [slides.length, activeSlideIndex, addToast, t]);

  // Duplicate slide
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
    setSlides((prev) => [
      ...prev.slice(0, index + 1),
      duplicatedSlide,
      ...prev.slice(index + 1),
    ]);
    setActiveSlideIndex(index + 1);
  }, [slides]);

  // Move slide
  const handleMoveSlide = useCallback((fromIndex, toIndex) => {
    setSlides((prev) => {
      const newSlides = [...prev];
      const [movedSlide] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, movedSlide);
      return newSlides;
    });
    setActiveSlideIndex(toIndex);
  }, []);

  // Add block to current slide
  const handleAddBlock = useCallback((newBlock) => {
    const updatedSlide = {
      ...activeSlide,
      blocks: [...activeSlide.blocks, newBlock],
    };
    handleSlideChange(updatedSlide);
  }, [activeSlide, handleSlideChange]);

  // Handle block drop from palette
  const handleDropBlock = useCallback((e) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('blockType');
    if (blockType) {
      const newBlock = createBlock(blockType);
      if (newBlock) {
        handleAddBlock(newBlock);
      }
    }
  }, [handleAddBlock]);

  // Change slide background
  const handleBackgroundChange = useCallback((bgKey) => {
    const updatedSlide = {
      ...activeSlide,
      styles: { ...activeSlide.styles, background: bgKey },
    };
    handleSlideChange(updatedSlide);
    setShowStylePanel(false);
  }, [activeSlide, handleSlideChange]);

  // Navigation
  const goToPrevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };

  const goToNextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };

  // Save carousel
  const handleSave = async () => {
    if (!isAuthenticated) {
      addToast(t('carousel.loginToSave'), 'warning');
      return;
    }

    setSaving(true);
    try {
      const carouselData = {
        title: title || t('carousel.untitled'),
        slides,
        settings: { width: 1080, height: 1080 },
      };

      if (editCarousel?.id) {
        await db.updateCarousel(editCarousel.id, carouselData);
        addToast(t('carousel.saved'), 'success');
      } else {
        await db.createCarousel(carouselData);
        addToast(t('carousel.created'), 'success');
      }

      if (loadCarousels) {
        await loadCarousels();
      }
    } catch (error) {
      console.error('Save failed:', error);
      addToast(t('carousel.saveFailed') + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Export to PDF
  const handleExportPDF = async () => {
    if (slides.length === 0) {
      addToast(t('carousel.noSlides'), 'warning');
      return;
    }

    setExporting(true);
    setExportProgress(0);

    try {
      // Get slide elements for export
      const slideElements = slideRefs.current.filter(Boolean);

      if (slideElements.length === 0) {
        throw new Error('No slides found to export');
      }

      await generateAndDownloadPDF(slideElements, {
        filename: `${title || 'linkedin-carousel'}.pdf`,
        width: 1080,
        height: 1080,
        quality: 2,
        onProgress: ({ percentage }) => {
          setExportProgress(percentage);
        },
      });

      addToast(t('carousel.exported'), 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast(t('carousel.exportFailed') + error.message, 'error');
    } finally {
      setExporting(false);
      setExportProgress(0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideIndex, slides.length]);

  return (
    <div className="min-h-screen h-screen bg-[#0A0A0B] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-ghost flex items-center gap-2">
                <Home className="h-4 w-4" />{t('nav.dashboard')}
              </Link>
            ) : (
              <Link to="/" className="btn-ghost flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />{t('nav.back')}
              </Link>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
                <Zap className="h-4 w-4 text-[#0A0A0B]" />
              </div>
              <span className="hidden font-['Syne'] text-sm font-bold text-white sm:block">Breaking Dynamics</span>
            </Link>
          </div>

          {/* Title Input */}
          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('carousel.titlePlaceholder')}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-center focus:border-[#FF6B35]/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {/* Preview Toggle */}
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`btn-ghost ${previewMode ? 'bg-[#FF6B35]/20 text-[#FF6B35]' : ''}`}
            >
              <Eye className="h-4 w-4" />
            </button>

            {/* Save Button */}
            {isAuthenticated && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-secondary"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {t('carousel.save')}
              </button>
            )}

            {/* Export Button */}
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="btn-primary"
            >
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {exportProgress}%
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {t('carousel.exportPDF')}
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Slide Navigator */}
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

        {/* Center - Slide Canvas */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0A0A0B] relative overflow-auto"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropBlock}
        >
          {/* Slide Navigation */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#1A1A1D] rounded-xl px-4 py-2 border border-white/10">
            <button
              onClick={goToPrevSlide}
              disabled={activeSlideIndex === 0}
              className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <span className="text-white font-medium">
              {activeSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={goToNextSlide}
              disabled={activeSlideIndex === slides.length - 1}
              className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Canvas */}
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

          {/* Background Style Button */}
          {!previewMode && (
            <button
              onClick={() => setShowStylePanel(!showStylePanel)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 btn-ghost"
            >
              <Palette className="h-4 w-4" />
              {t('carousel.background')}
            </button>
          )}

          {/* Background Style Panel */}
          {showStylePanel && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#1A1A1D] rounded-xl border border-white/10 shadow-2xl p-4 z-20 animate-scale-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">{t('carousel.chooseBackground')}</span>
                <button onClick={() => setShowStylePanel(false)} className="text-white/40 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(BACKGROUND_STYLES).map(([key, bg]) => (
                  <button
                    key={key}
                    onClick={() => handleBackgroundChange(key)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      activeSlide?.styles?.background === key
                        ? 'border-[#FF6B35] scale-110'
                        : 'border-transparent hover:border-white/30 hover:scale-105'
                    }`}
                    style={bg.style}
                    title={language === 'de' ? bg.nameDE : bg.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Block Palette */}
        {!previewMode && (
          <div className="w-48 flex-shrink-0 border-l border-white/5 bg-[#111113] overflow-y-auto">
            <BlockPalette onAddBlock={handleAddBlock} />
          </div>
        )}
      </div>

      {/* Hidden slides for PDF export */}
      <div className="fixed -left-[9999px] top-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => (slideRefs.current[index] = el)}
            style={{ width: 1080, height: 1080 }}
          >
            <SlideCanvas
              slide={slide}
              onSlideChange={() => {}}
              isEditing={false}
              scale={1}
              showControls={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselEditor;
