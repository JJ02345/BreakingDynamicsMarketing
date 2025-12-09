import React from 'react';
import { Type, Image, Smile, Minus, User, Hash, List, Quote, AlignLeft, Sparkles, Linkedin } from 'lucide-react';
import { BLOCK_TYPES, createBlock } from '../../utils/slideTemplates';
import { useLanguage } from '../../context/LanguageContext';

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

const BlockPalette = ({ onAddBlock, onOpenAI, onPostToLinkedIn, disabled = false }) => {
  const { language } = useLanguage();
  const isDE = language === 'de';

  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData('blockType', blockType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddBlock = (blockType) => {
    if (disabled) return;
    const newBlock = createBlock(blockType);
    if (newBlock) {
      onAddBlock(newBlock);
    }
  };

  return (
    <div className="p-3 flex flex-col h-full">
      {/* Bausteine Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-px bg-white/10" />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
          {isDE ? 'Bausteine' : 'Blocks'}
        </p>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Block Grid */}
      <div className="grid grid-cols-3 gap-2 flex-1">
        {Object.entries(BLOCK_TYPES).map(([key, block]) => {
          const Icon = BLOCK_ICONS[key] || Type;

          return (
            <button
              key={key}
              onClick={() => handleAddBlock(key)}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, key)}
              disabled={disabled}
              className={`
                group relative flex flex-col items-center justify-center gap-1.5
                rounded-xl p-3 text-center transition-all aspect-square
                ${disabled
                  ? 'cursor-not-allowed opacity-30 bg-white/5'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-[#FF6B35]/10 hover:border-[#FF6B35]/40 hover:text-[#FF6B35] hover:scale-105 cursor-grab active:cursor-grabbing active:scale-95'
                }
              `}
              title={isDE ? block.nameDE : block.name}
            >
              <Icon className="h-5 w-5 transition-transform group-hover:scale-110 group-hover:text-[#FF6B35]" />
              <span className="text-[10px] font-medium leading-tight truncate w-full">
                {(isDE ? block.nameDE : block.name).split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[10px] text-white/20">
        {isDE ? 'Klicken oder ziehen' : 'Click or drag'}
      </p>

      {/* LinkedIn Post Button */}
      {onPostToLinkedIn && (
        <button
          onClick={onPostToLinkedIn}
          className="w-full mt-4 p-2.5 rounded-xl bg-[#0A66C2] text-white font-medium text-xs hover:bg-[#004182] hover:shadow-lg hover:shadow-[#0A66C2]/20 transition-all group"
        >
          <div className="flex items-center justify-center gap-2">
            <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>{isDE ? 'Auf LinkedIn posten' : 'Post to LinkedIn'}</span>
          </div>
        </button>
      )}

      {/* AI Generator Button - Small at bottom */}
      {onOpenAI && (
        <button
          onClick={onOpenAI}
          className="w-full mt-2 p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:border-[#FF6B35]/30 hover:bg-white/[0.08] hover:text-white transition-all group"
        >
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#FF6B35] group-hover:rotate-12 transition-transform" />
            <span>{isDE ? 'Mit KI generieren' : 'Generate with AI'}</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default BlockPalette;
