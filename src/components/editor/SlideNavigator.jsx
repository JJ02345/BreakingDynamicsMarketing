import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, Save, Bookmark, Lock, Loader2 } from 'lucide-react';
import { SLIDE_TEMPLATES, BACKGROUND_STYLES, createSlide } from '../../utils/slideTemplates';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

const SlideNavigator = ({
  slides,
  activeSlideIndex,
  onSlideSelect,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onMoveSlide,
  onSlidesChange,
  onShowLoginModal,
}) => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [customSlides, setCustomSlides] = useState([]);
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [savingSlide, setSavingSlide] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSlideIndex, setSaveSlideIndex] = useState(null);
  const [slideName, setSlideName] = useState('');
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTemplateDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load custom slides when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCustomSlides();
    } else {
      setCustomSlides([]);
    }
  }, [isAuthenticated]);

  const loadCustomSlides = async () => {
    setLoadingCustom(true);
    try {
      const data = await db.getCustomSlides();
      setCustomSlides(data);
    } catch (err) {
      console.error('Failed to load custom slides:', err);
    } finally {
      setLoadingCustom(false);
    }
  };

  const handleSaveAsTemplate = (index) => {
    if (!isAuthenticated) {
      onShowLoginModal?.();
      return;
    }
    setSaveSlideIndex(index);
    setSlideName('');
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    if (!slideName.trim() || saveSlideIndex === null) return;

    setSavingSlide(true);
    try {
      const slideToSave = slides[saveSlideIndex];
      await db.saveCustomSlide({
        name: slideName.trim(),
        slide: slideToSave,
      });
      addToast(language === 'de' ? 'Slide gespeichert!' : 'Slide saved!', 'success');
      setShowSaveModal(false);
      loadCustomSlides();
    } catch (err) {
      console.error('Failed to save slide:', err);
      addToast(language === 'de' ? 'Speichern fehlgeschlagen' : 'Save failed', 'error');
    } finally {
      setSavingSlide(false);
    }
  };

  const handleAddCustomSlide = (customSlide) => {
    const newSlide = {
      ...customSlide.slide,
      id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: slides.length + 1,
      blocks: customSlide.slide.blocks.map(block => ({
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
    };
    onAddSlide(newSlide);
  };

  const handleDeleteCustomSlide = async (id, e) => {
    e.stopPropagation();
    try {
      await db.deleteCustomSlide(id);
      addToast(language === 'de' ? 'Slide gelöscht' : 'Slide deleted', 'success');
      loadCustomSlides();
    } catch (err) {
      console.error('Failed to delete custom slide:', err);
    }
  };

  const handleAddSlide = (templateId) => {
    const newSlide = createSlide(templateId, slides.length + 1);
    onAddSlide(newSlide);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('slideIndex', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('slideIndex'));
    if (dragIndex === dropIndex) return;

    const newSlides = [...slides];
    const [draggedSlide] = newSlides.splice(dragIndex, 1);
    newSlides.splice(dropIndex, 0, draggedSlide);

    // Update order numbers
    newSlides.forEach((slide, i) => {
      slide.order = i + 1;
    });

    onSlidesChange(newSlides);
    onSlideSelect(dropIndex);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Slide Thumbnails */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {slides.map((slide, index) => {
          const bgStyle = BACKGROUND_STYLES[slide.styles?.background] || BACKGROUND_STYLES['solid-dark'];
          const isActive = index === activeSlideIndex;
          const template = SLIDE_TEMPLATES[slide.type];

          return (
            <div
              key={slide.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => onSlideSelect(index)}
              className={`group relative rounded-lg overflow-hidden cursor-pointer transition-all ${
                isActive
                  ? 'ring-2 ring-[#FF6B35] ring-offset-2 ring-offset-[#111113]'
                  : 'hover:ring-2 hover:ring-white/20'
              }`}
            >
              {/* Slide Number */}
              <div className="absolute top-1 left-1 z-10 w-5 h-5 rounded bg-black/50 flex items-center justify-center text-xs text-white font-medium">
                {index + 1}
              </div>

              {/* Thumbnail Preview - Real Content */}
              <div
                className="aspect-square w-full relative overflow-hidden"
                style={{
                  ...bgStyle.style,
                  ...(slide.styles?.backgroundImage?.url ? {
                    backgroundImage: `url(${slide.styles.backgroundImage.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : {})
                }}
              >
                {/* Dark overlay for background images */}
                {slide.styles?.backgroundImage?.url && (
                  <div className="absolute inset-0 bg-black/40" />
                )}

                {/* Real content preview - scaled down with proper centering */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-1 gap-0.5 overflow-hidden">
                  {slide.blocks.slice(0, 5).map((block) => {
                    // Render actual content preview based on block type
                    switch (block.type) {
                      case 'HEADING':
                        return (
                          <p
                            key={block.id}
                            className="text-[5px] font-bold text-center leading-none w-full px-0.5"
                            style={{
                              color: block.content?.color || '#FFFFFF',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {block.content?.text || ''}
                          </p>
                        );
                      case 'SUBHEADING':
                        return (
                          <p
                            key={block.id}
                            className="text-[4px] font-semibold text-center leading-none w-full px-0.5"
                            style={{
                              color: block.content?.color || '#FFFFFF',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {block.content?.text || ''}
                          </p>
                        );
                      case 'PARAGRAPH':
                        return (
                          <p
                            key={block.id}
                            className="text-[3px] text-white/60 text-center leading-tight w-full px-0.5"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {block.content?.text || ''}
                          </p>
                        );
                      case 'ICON':
                        return (
                          <span key={block.id} className="text-[12px] leading-none">
                            {block.content?.emoji || '🎯'}
                          </span>
                        );
                      case 'NUMBER':
                        return (
                          <span
                            key={block.id}
                            className="text-[10px] font-black leading-none"
                            style={{ color: block.content?.color || '#FF6B35' }}
                          >
                            {block.content?.number || '01'}
                          </span>
                        );
                      case 'BADGE':
                        return (
                          <span
                            key={block.id}
                            className="text-[3px] px-1 py-0.5 rounded-sm font-medium"
                            style={{
                              backgroundColor: block.content?.backgroundColor || '#FF6B35',
                              color: block.content?.textColor || '#FFFFFF'
                            }}
                          >
                            {block.content?.text || 'Badge'}
                          </span>
                        );
                      case 'QUOTE':
                        return (
                          <p
                            key={block.id}
                            className="text-[3px] italic text-white/70 text-center leading-tight w-full px-0.5"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            "{block.content?.text || '...'}"
                          </p>
                        );
                      case 'BULLET_LIST':
                        return (
                          <div key={block.id} className="text-[3px] text-white/50 w-full px-1 text-center">
                            {(block.content?.items || []).slice(0, 2).map((item, i) => (
                              <div key={i} className="truncate">• {item}</div>
                            ))}
                          </div>
                        );
                      case 'DIVIDER':
                        return (
                          <div
                            key={block.id}
                            className="w-2/3 h-px bg-white/20 my-0.5"
                          />
                        );
                      case 'BRANDING':
                        return (
                          <div key={block.id} className="text-[3px] text-white/40">
                            @{block.content?.handle || 'handle'}
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>

              {/* Hover Controls */}
              <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(index, index - 1);
                    }}
                    className="p-1 rounded bg-black/50 text-white/70 hover:text-white hover:bg-black/70"
                    title={language === 'de' ? 'Nach oben' : 'Move up'}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                )}
                {index < slides.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(index, index + 1);
                    }}
                    className="p-1 rounded bg-black/50 text-white/70 hover:text-white hover:bg-black/70"
                    title={language === 'de' ? 'Nach unten' : 'Move down'}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateSlide(index);
                  }}
                  className="p-1 rounded bg-black/50 text-white/70 hover:text-white hover:bg-black/70"
                  title={language === 'de' ? 'Duplizieren' : 'Duplicate'}
                >
                  <Copy className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveAsTemplate(index);
                  }}
                  className="p-1 rounded bg-[#FF6B35]/50 text-white/70 hover:text-white hover:bg-[#FF6B35]/70"
                  title={language === 'de' ? 'Als Vorlage speichern' : 'Save as template'}
                >
                  <Save className="h-3 w-3" />
                </button>
                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSlide(index);
                    }}
                    className="p-1 rounded bg-red-500/50 text-white/70 hover:text-white hover:bg-red-500/70"
                    title={language === 'de' ? 'Löschen' : 'Delete'}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Slide Button */}
      <div className="p-3 border-t border-white/10">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-dashed transition-colors ${
              showTemplateDropdown
                ? 'border-[#FF6B35]/50 text-[#FF6B35]'
                : 'border-white/20 text-white/50 hover:border-[#FF6B35]/50 hover:text-[#FF6B35]'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">{t('carousel.addSlide')}</span>
          </button>

          {/* Template Dropdown - Click to open, click outside to close */}
          {showTemplateDropdown && (
          <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
            <div className="bg-[#1A1A1D] rounded-xl border border-white/10 shadow-2xl p-2 max-h-80 overflow-y-auto">
              {/* Standard Templates */}
              <div className="text-[10px] uppercase tracking-wider text-white/30 px-3 py-1">
                {language === 'de' ? 'Vorlagen' : 'Templates'}
              </div>
              {Object.entries(SLIDE_TEMPLATES).map(([id, template]) => (
                <button
                  key={id}
                  onClick={() => {
                    handleAddSlide(id);
                    setShowTemplateDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-white/5 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded flex-shrink-0"
                    style={BACKGROUND_STYLES[template.defaultStyles?.background]?.style || {}}
                  />
                  <div>
                    <div className="text-sm text-white font-medium">
                      {language === 'de' ? template.nameDE : template.name}
                    </div>
                    <div className="text-xs text-white/40">
                      {language === 'de' ? template.descriptionDE : template.description}
                    </div>
                  </div>
                </button>
              ))}

              {/* Custom Slides Section */}
              <div className="border-t border-white/10 mt-2 pt-2">
                <div className="text-[10px] uppercase tracking-wider text-white/30 px-3 py-1 flex items-center gap-2">
                  <Bookmark className="h-3 w-3" />
                  {language === 'de' ? 'Meine Vorlagen' : 'My Templates'}
                </div>

                {!isAuthenticated ? (
                  <button
                    onClick={() => onShowLoginModal?.()}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left hover:bg-white/5 transition-colors text-white/50"
                  >
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {language === 'de' ? 'Anmelden' : 'Sign in'}
                      </div>
                      <div className="text-xs text-white/40">
                        {language === 'de' ? 'Um Vorlagen zu speichern' : 'To save templates'}
                      </div>
                    </div>
                  </button>
                ) : loadingCustom ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-white/30" />
                  </div>
                ) : customSlides.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-white/40 text-center">
                    {language === 'de'
                      ? 'Keine Vorlagen. Klicke auf das Speichern-Icon bei einer Slide.'
                      : 'No templates. Click save icon on any slide.'}
                  </div>
                ) : (
                  customSlides.map((customSlide) => (
                    <div
                      key={customSlide.id}
                      className="group/custom w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-white/5 transition-colors"
                    >
                      <button
                        onClick={() => {
                          handleAddCustomSlide(customSlide);
                          setShowTemplateDropdown(false);
                        }}
                        className="flex items-center gap-3 flex-1"
                      >
                        <div
                          className="w-8 h-8 rounded flex-shrink-0"
                          style={BACKGROUND_STYLES[customSlide.slide?.styles?.background]?.style || { background: '#1A1A1D' }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium truncate">
                            {customSlide.name}
                          </div>
                          <div className="text-xs text-white/40">
                            {customSlide.slide?.blocks?.length || 0} {language === 'de' ? 'Blöcke' : 'blocks'}
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={(e) => handleDeleteCustomSlide(customSlide.id, e)}
                        className="p-1 rounded opacity-0 group-hover/custom:opacity-100 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Save Slide Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 bg-[#1A1A1D] rounded-2xl border border-white/10 shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {language === 'de' ? 'Slide als Vorlage speichern' : 'Save slide as template'}
            </h3>
            <input
              type="text"
              value={slideName}
              onChange={(e) => setSlideName(e.target.value)}
              placeholder={language === 'de' ? 'Vorlagenname...' : 'Template name...'}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-[#FF6B35]/50 focus:outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {language === 'de' ? 'Abbrechen' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={!slideName.trim() || savingSlide}
                className="flex-1 px-4 py-2 rounded-xl bg-[#FF6B35] text-white font-medium hover:bg-[#FF6B35]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingSlide ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {language === 'de' ? 'Speichern' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideNavigator;
