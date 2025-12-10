import React, { forwardRef, useState } from 'react';
import { GripVertical, Trash2, Plus, Settings2 } from 'lucide-react';
import { getBlockComponent } from './blocks';
import { BACKGROUND_STYLES, BLOCK_TYPES } from '../../utils/slideTemplates';
import BlockStylePanel from './BlockStylePanel';
import { BreakingDynamicsIcon } from '../common/BreakingDynamicsLogo';

const SlideCanvas = forwardRef(({
  slide,
  onSlideChange,
  isEditing = true,
  scale = 0.5,
  showControls = true,
  showBranding = false
}, ref) => {
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState(null);
  const [showStylePanel, setShowStylePanel] = useState(false);

  if (!slide) return null;

  const backgroundStyle = BACKGROUND_STYLES[slide.styles?.background] || BACKGROUND_STYLES['solid-dark'];
  const hasBackgroundImage = slide.styles?.backgroundImage?.url;

  const padding = slide.styles?.padding === 'sm' ? 40 :
                  slide.styles?.padding === 'lg' ? 80 :
                  slide.styles?.padding === 'xl' ? 100 : 60;

  // Build background style - image takes priority
  const getBackgroundStyles = () => {
    if (hasBackgroundImage) {
      return {
        backgroundImage: `url(${slide.styles.backgroundImage.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    return backgroundStyle.style;
  };

  const handleBlockChange = (blockId, newContent) => {
    const updatedBlocks = slide.blocks.map((block) =>
      block.id === blockId ? { ...block, content: newContent } : block
    );
    onSlideChange({ ...slide, blocks: updatedBlocks });
  };

  const handleDeleteBlock = (blockId) => {
    const updatedBlocks = slide.blocks.filter((block) => block.id !== blockId);
    onSlideChange({ ...slide, blocks: updatedBlocks });
    setActiveBlockId(null);
    setShowStylePanel(false);
  };

  const activeBlock = activeBlockId ? slide.blocks.find(b => b.id === activeBlockId) : null;

  const handleDragStart = (e, index) => {
    setDraggedBlockIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedBlockIndex === null || draggedBlockIndex === index) return;

    const updatedBlocks = [...slide.blocks];
    const [draggedBlock] = updatedBlocks.splice(draggedBlockIndex, 1);
    updatedBlocks.splice(index, 0, draggedBlock);

    onSlideChange({ ...slide, blocks: updatedBlocks });
    setDraggedBlockIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedBlockIndex(null);
  };

  return (
    <div
      className="relative mx-auto"
      style={{
        width: 1080 * scale,
        height: 1080 * scale,
      }}
    >
      {/* Slide Canvas */}
      <div
        ref={ref}
        className="absolute inset-0 overflow-hidden"
        style={{
          width: 1080,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          ...getBackgroundStyles(),
        }}
      >
        {/* Dark overlay for image backgrounds to ensure text readability */}
        {hasBackgroundImage && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
            }}
          />
        )}
        {/* Content Container */}
        <div
          className="relative w-full h-full flex flex-col items-center z-10"
          style={{
            padding,
            justifyContent: slide.styles?.verticalAlign === 'top' ? 'flex-start' :
                           slide.styles?.verticalAlign === 'bottom' ? 'flex-end' : 'center',
          }}
        >
          {slide.blocks.map((block, index) => {
            const BlockComponent = getBlockComponent(block.type);
            const isActive = activeBlockId === block.id;

            return (
              <div
                key={block.id}
                className={`relative group ${isEditing ? 'cursor-move' : ''}`}
                draggable={isEditing && showControls}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => isEditing && setActiveBlockId(block.id)}
                style={{
                  outline: isActive && isEditing ? '2px solid #FF6B35' : 'none',
                  outlineOffset: '4px',
                  borderRadius: '4px',
                  marginBottom: index < slide.blocks.length - 1 ? '16px' : 0,
                  // Größerer Klickbereich für alle Blöcke
                  padding: isEditing ? '12px 20px' : '0',
                  minWidth: isEditing ? '300px' : 'auto',
                  minHeight: isEditing ? '60px' : 'auto',
                }}
              >
                {/* Block Controls - Größere Buttons für einfacheres Treffen */}
                {isEditing && showControls && isActive && (
                  <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="p-3 rounded-lg bg-[#1A1A1D] text-white/50 cursor-grab hover:bg-[#252528] hover:text-white transition-colors">
                      <GripVertical className="h-6 w-6" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStylePanel(!showStylePanel);
                      }}
                      className={`p-3 rounded-lg transition-colors ${showStylePanel ? 'bg-[#FF6B35]/20 text-[#FF6B35]' : 'bg-[#1A1A1D] text-white/50 hover:bg-[#252528] hover:text-white'}`}
                      title="Block styling"
                    >
                      <Settings2 className="h-6 w-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlock(block.id);
                      }}
                      className="p-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                )}

                {/* Block Style Panel */}
                {isEditing && showControls && isActive && showStylePanel && (
                  <BlockStylePanel
                    block={block}
                    onChange={(newContent) => handleBlockChange(block.id, newContent)}
                    onClose={() => setShowStylePanel(false)}
                  />
                )}

                {/* Block Component */}
                <BlockComponent
                  content={block.content}
                  onChange={(newContent) => handleBlockChange(block.id, newContent)}
                  isEditing={isEditing && isActive}
                />
              </div>
            );
          })}
        </div>

        {/* Breaking Dynamics Branding Watermark - With Custom Logo */}
        {showBranding && (
          <div
            className="absolute bottom-8 right-8 flex items-center gap-3 px-5 py-3 rounded-xl z-20"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <BreakingDynamicsIcon size={28} color="#FF6B35" />
            <span className="text-base font-semibold text-white">Breaking Dynamics</span>
          </div>
        )}
      </div>

      {/* Add Block Indicator (when empty) */}
      {isEditing && slide.blocks.length === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-white/20 rounded-xl"
          style={{
            width: 1080 * scale,
            height: 1080 * scale,
          }}
        >
          <div className="text-center text-white/40">
            <Plus className="h-8 w-8 mx-auto mb-2" />
            <p>Drag blocks here</p>
          </div>
        </div>
      )}
    </div>
  );
});

SlideCanvas.displayName = 'SlideCanvas';

export default SlideCanvas;
