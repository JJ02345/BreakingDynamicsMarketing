import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronLeft, ChevronRight, Plus, Trash2, Copy, Download, Sparkles, Linkedin, Eye, EyeOff, Menu, X, Palette, Type, Image, Smile, Minus, User, Hash, List, Quote, AlignLeft, Check, Loader2, Save, Settings } from 'lucide-react';
import SlideCanvas from './SlideCanvas';
import { createBlock, createSlide, BACKGROUND_STYLES, BLOCK_TYPES } from '../../utils/slideTemplates';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { generateAndDownloadPDF } from '../../lib/pdfGenerator';

// Block icons mapping
const BLOCK_ICONS = {
  HEADING: Type,
  SUBHEADING: Type,
  PARAGRAPH: AlignLeft,
  IMAGE: Image,
  ICON: Smile,
  BADGE: Hash,
  DIVIDER: Minus,
  BRANDING: User,
  QUOTE: Quote,
  BULLET_LIST: List,
  NUMBER: Hash,
};

const MobileCarouselEditor = ({
  slides,
  setSlides,
  activeSlideIndex,
  setActiveSlideIndex,
  title,
  setTitle,
  onSave,
  onOpenAI,
  onPostToLinkedIn,
  isAuthenticated,
  saving,
  exporting,
  exportProgress,
  onExport,
  slideRefs
}) => {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const isDE = language === 'de';

  const [showMenu, setShowMenu] = useState(false);
  const [showBlocks, setShowBlocks] = useState(false);
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('slides'); // 'slides', 'blocks', 'style'

  const activeSlide = slides[activeSlideIndex];

  // Swipe handling for slide navigation
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0 && activeSlideIndex < slides.length - 1) {
        // Swipe left - next slide
        setActiveSlideIndex(activeSlideIndex + 1);
      } else if (diff < 0 && activeSlideIndex > 0) {
        // Swipe right - prev slide
        setActiveSlideIndex(activeSlideIndex - 1);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleSlideChange = useCallback((updatedSlide) => {
    setSlides((prev) => prev.map((slide, i) => i === activeSlideIndex ? updatedSlide : slide));
  }, [activeSlideIndex, setSlides]);

  const handleAddSlide = () => {
    const newSlide = createSlide('blank', slides.length + 1);
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const handleDeleteSlide = () => {
    if (slides.length <= 1) {
      addToast(isDE ? 'Mindestens 1 Slide erforderlich' : 'At least 1 slide required', 'warning');
      return;
    }
    setSlides((prev) => prev.filter((_, i) => i !== activeSlideIndex));
    if (activeSlideIndex > 0) setActiveSlideIndex(activeSlideIndex - 1);
  };

  const handleDuplicateSlide = () => {
    const slideToDuplicate = slides[activeSlideIndex];
    const duplicatedSlide = {
      ...slideToDuplicate,
      id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      blocks: slideToDuplicate.blocks.map((block) => ({
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
    };
    setSlides((prev) => [...prev.slice(0, activeSlideIndex + 1), duplicatedSlide, ...prev.slice(activeSlideIndex + 1)]);
    setActiveSlideIndex(activeSlideIndex + 1);
  };

  const handleAddBlock = (blockType) => {
    const newBlock = createBlock(blockType);
    if (newBlock) {
      handleSlideChange({ ...activeSlide, blocks: [...activeSlide.blocks, newBlock] });
      setShowBlocks(false);
    }
  };

  const handleBackgroundChange = (bgKey) => {
    handleSlideChange({
      ...activeSlide,
      styles: { ...activeSlide.styles, background: bgKey, backgroundImage: null }
    });
    setShowBackgrounds(false);
  };

  // Calculate canvas scale based on screen width
  const getCanvasScale = () => {
    const screenWidth = window.innerWidth;
    const padding = 32; // 16px each side
    const availableWidth = screenWidth - padding;
    return Math.min(availableWidth / 1080, 0.35);
  };

  const canvasScale = getCanvasScale();

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col safe-area-inset">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0B] border-b border-white/5 px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Left: Home */}
          <Link
            to="/"
            className="p-2 rounded-lg bg-white/5 border border-white/10"
          >
            <Home className="h-5 w-5 text-[#FF6B35]" />
          </Link>

          {/* Center: Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isDE ? 'Carousel Titel...' : 'Carousel title...'}
            className="flex-1 mx-3 px-3 py-1.5 bg-transparent text-white text-sm font-medium text-center border-b border-transparent focus:border-[#FF6B35] outline-none"
          />

          {/* Right: Menu */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg bg-white/5 border border-white/10"
          >
            {showMenu ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-full right-3 mt-2 w-56 bg-[#1A1A1D] rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50">
            <button
              onClick={() => { setPreviewMode(!previewMode); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/5 text-left"
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="text-sm">{previewMode ? (isDE ? 'Bearbeiten' : 'Edit') : (isDE ? 'Vorschau' : 'Preview')}</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={() => { onSave(); setShowMenu(false); }}
                disabled={saving}
                className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/5 text-left disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span className="text-sm">{isDE ? 'Speichern' : 'Save'}</span>
              </button>
            )}

            <button
              onClick={() => { onExport(); setShowMenu(false); }}
              disabled={exporting}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/5 text-left disabled:opacity-50"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="text-sm">
                {exporting ? `${exportProgress}%` : (isDE ? 'PDF Export' : 'Export PDF')}
              </span>
            </button>

            <div className="border-t border-white/10" />

            <button
              onClick={() => { onOpenAI(); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#FF6B35] hover:bg-[#FF6B35]/10 text-left"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">{isDE ? 'Mit KI generieren' : 'Generate with AI'}</span>
            </button>

            <button
              onClick={() => { onPostToLinkedIn(); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#0077B5] hover:bg-[#0077B5]/10 text-left"
            >
              <Linkedin className="h-4 w-4" />
              <span className="text-sm font-medium">{isDE ? 'Auf LinkedIn posten' : 'Post to LinkedIn'}</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content - Canvas */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide Counter */}
        <div className="text-white/40 text-xs mb-2">
          {activeSlideIndex + 1} / {slides.length}
        </div>

        {/* Canvas with swipe hint */}
        <div className="relative">
          <SlideCanvas
            ref={(el) => { if (slideRefs) slideRefs.current[activeSlideIndex] = el; }}
            slide={activeSlide}
            onSlideChange={handleSlideChange}
            isEditing={!previewMode}
            scale={canvasScale}
            showControls={!previewMode}
          />

          {/* Swipe Navigation Arrows */}
          {activeSlideIndex > 0 && (
            <button
              onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full bg-white/10 text-white/60"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {activeSlideIndex < slides.length - 1 && (
            <button
              onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full bg-white/10 text-white/60"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Slide Dots */}
        <div className="flex gap-1.5 mt-4 overflow-x-auto max-w-full px-4">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlideIndex(index)}
              className={`flex-shrink-0 w-2 h-2 rounded-full transition-all ${
                index === activeSlideIndex
                  ? 'bg-[#FF6B35] w-6'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      {!previewMode && (
        <div className="sticky bottom-0 bg-[#111113] border-t border-white/5 safe-area-bottom">
          {/* Tab Content */}
          {activeTab === 'slides' && (
            <div className="flex items-center justify-center gap-3 px-4 py-3">
              <button
                onClick={handleAddSlide}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FF6B35] text-white text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                {isDE ? 'Neue Slide' : 'Add Slide'}
              </button>
              <button
                onClick={handleDuplicateSlide}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60"
              >
                <Copy className="h-5 w-5" />
              </button>
              <button
                onClick={handleDeleteSlide}
                className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}

          {activeTab === 'blocks' && (
            <div className="px-4 py-3">
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(BLOCK_TYPES).map(([key, block]) => {
                  const Icon = BLOCK_ICONS[key] || Type;
                  return (
                    <button
                      key={key}
                      onClick={() => handleAddBlock(key)}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 active:bg-[#FF6B35]/20 active:border-[#FF6B35]/40 active:text-[#FF6B35]"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[9px] truncate w-full text-center">
                        {(isDE ? block.nameDE : block.name).split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="px-4 py-3">
              <p className="text-[10px] text-white/40 mb-2 text-center">{isDE ? 'Hintergrund' : 'Background'}</p>
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(BACKGROUND_STYLES).slice(0, 12).map(([key, bg]) => (
                  <button
                    key={key}
                    onClick={() => handleBackgroundChange(key)}
                    className={`aspect-square rounded-lg border-2 transition-all ${
                      activeSlide?.styles?.background === key
                        ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/30'
                        : 'border-white/10'
                    }`}
                    style={bg.style}
                  >
                    {activeSlide?.styles?.background === key && (
                      <div className="w-full h-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-[#FF6B35]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-t border-white/5">
            <button
              onClick={() => setActiveTab('slides')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 ${
                activeTab === 'slides' ? 'text-[#FF6B35]' : 'text-white/40'
              }`}
            >
              <Copy className="h-5 w-5" />
              <span className="text-[10px]">{isDE ? 'Slides' : 'Slides'}</span>
            </button>
            <button
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 ${
                activeTab === 'blocks' ? 'text-[#FF6B35]' : 'text-white/40'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span className="text-[10px]">{isDE ? 'Bausteine' : 'Blocks'}</span>
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 ${
                activeTab === 'style' ? 'text-[#FF6B35]' : 'text-white/40'
              }`}
            >
              <Palette className="h-5 w-5" />
              <span className="text-[10px]">{isDE ? 'Stil' : 'Style'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default MobileCarouselEditor;
