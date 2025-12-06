import React from 'react';
import { Plus, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import { SLIDE_TEMPLATES, BACKGROUND_STYLES, createSlide } from '../../utils/slideTemplates';
import { useLanguage } from '../../context/LanguageContext';

const SlideNavigator = ({
  slides,
  activeSlideIndex,
  onSlideSelect,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onMoveSlide,
  onSlidesChange,
}) => {
  const { t, language } = useLanguage();

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

              {/* Thumbnail Preview */}
              <div
                className="aspect-square w-full relative overflow-hidden"
                style={bgStyle.style}
              >
                {/* Mini preview of blocks */}
                <div className="absolute inset-0 p-2 flex flex-col items-center justify-center gap-1 scale-[0.15] origin-center">
                  {slide.blocks.slice(0, 4).map((block) => (
                    <div
                      key={block.id}
                      className="bg-white/20 rounded h-4 w-full"
                    />
                  ))}
                </div>

                {/* Template type label */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                  <span className="text-[10px] text-white/70 truncate block">
                    {language === 'de' ? template?.nameDE : template?.name}
                  </span>
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
                >
                  <Copy className="h-3 w-3" />
                </button>
                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSlide(index);
                    }}
                    className="p-1 rounded bg-red-500/50 text-white/70 hover:text-white hover:bg-red-500/70"
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
        <div className="relative group">
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-dashed border-white/20 text-white/50 hover:border-[#FF6B35]/50 hover:text-[#FF6B35] transition-colors">
            <Plus className="h-4 w-4" />
            <span className="text-sm">{t('carousel.addSlide')}</span>
          </button>

          {/* Template Dropdown */}
          <div className="absolute bottom-full left-0 right-0 mb-2 hidden group-hover:block z-20">
            <div className="bg-[#1A1A1D] rounded-xl border border-white/10 shadow-2xl p-2 max-h-64 overflow-y-auto">
              {Object.entries(SLIDE_TEMPLATES).map(([id, template]) => (
                <button
                  key={id}
                  onClick={() => handleAddSlide(id)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideNavigator;
