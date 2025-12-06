import React from 'react';
import { Type, Image, Smile, Minus, User, Hash, List, Quote, AlignLeft } from 'lucide-react';
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

const BlockPalette = ({ onAddBlock, disabled = false }) => {
  const { language } = useLanguage();

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
    <div className="p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3 text-center">
        {language === 'de' ? 'Bausteine' : 'Blocks'}
      </p>

      <div className="grid grid-cols-3 gap-2">
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
              title={language === 'de' ? block.nameDE : block.name}
            >
              <Icon className="h-5 w-5 transition-transform group-hover:scale-110 group-hover:text-[#FF6B35]" />
              <span className="text-[10px] font-medium leading-tight truncate w-full">
                {(language === 'de' ? block.nameDE : block.name).split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[10px] text-white/20">
        {language === 'de' ? 'Klicken oder ziehen' : 'Click or drag'}
      </p>
    </div>
  );
};

export default BlockPalette;
