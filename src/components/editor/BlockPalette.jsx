import React, { useState } from 'react';
import { Type, Image, Smile, Minus, User, Hash, List, Quote, AlignLeft, Sparkles, Linkedin, Palette, ChevronDown, Check } from 'lucide-react';
import { BLOCK_TYPES, BACKGROUND_STYLES, createBlock } from '../../utils/slideTemplates';
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

// Kategorien für die Hintergründe
const BACKGROUND_CATEGORIES = {
  solid: { name: 'Solid', nameDE: 'Einfarbig' },
  gradient: { name: 'Gradient', nameDE: 'Verlauf' },
  mesh: { name: 'Premium', nameDE: 'Premium' }
};

const BlockPalette = ({ onAddBlock, onOpenAI, onPostToLinkedIn, onBackgroundChange, activeBackground, disabled = false }) => {
  const { language } = useLanguage();
  const isDE = language === 'de';
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [activeCategory, setActiveCategory] = useState('gradient');

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

  // Gruppiere Hintergründe nach Kategorie
  const backgroundsByCategory = Object.entries(BACKGROUND_STYLES).reduce((acc, [key, bg]) => {
    const cat = bg.category || 'gradient';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ key, ...bg });
    return acc;
  }, {});

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

      <p className="mt-2 text-center text-[10px] text-white/20">
        {isDE ? 'Klicken oder ziehen' : 'Click or drag'}
      </p>

      {/* Hintergrund Section */}
      {onBackgroundChange && (
        <div className="mt-4">
          <button
            onClick={() => setShowBackgrounds(!showBackgrounds)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg border border-white/20 shadow-inner"
                style={BACKGROUND_STYLES[activeBackground]?.style || { backgroundColor: '#0A0A0B' }}
              />
              <span className="text-xs text-white/70 group-hover:text-white transition-colors">
                <Palette className="inline h-3.5 w-3.5 mr-1.5" />
                {isDE ? 'Hintergrund' : 'Background'}
              </span>
            </div>
            <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${showBackgrounds ? 'rotate-180' : ''}`} />
          </button>

          {/* Expandable Background Panel */}
          {showBackgrounds && (
            <div className="mt-2 p-3 rounded-xl bg-[#0A0A0B] border border-white/10 animate-scale-in">
              {/* Category Tabs */}
              <div className="flex gap-1 mb-3">
                {Object.entries(BACKGROUND_CATEGORIES).map(([catKey, cat]) => (
                  <button
                    key={catKey}
                    onClick={() => setActiveCategory(catKey)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-medium transition-all ${
                      activeCategory === catKey
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {isDE ? cat.nameDE : cat.name}
                  </button>
                ))}
              </div>

              {/* Background Grid */}
              <div className="grid grid-cols-4 gap-2">
                {(backgroundsByCategory[activeCategory] || []).map((bg) => (
                  <button
                    key={bg.key}
                    onClick={() => {
                      onBackgroundChange(bg.key);
                    }}
                    className={`relative w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                      activeBackground === bg.key
                        ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/30'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={bg.style}
                    title={isDE ? bg.nameDE : bg.name}
                  >
                    {activeBackground === bg.key && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-4 w-4 text-[#FF6B35] drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Background Name */}
              <p className="mt-2 text-center text-[10px] text-white/40">
                {BACKGROUND_STYLES[activeBackground]?.[isDE ? 'nameDE' : 'name'] || 'Dark'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-2 my-4">
        <div className="flex-1 h-px bg-white/10" />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
          {isDE ? 'Aktionen' : 'Actions'}
        </p>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* AI Generator Button - Prominent */}
      {onOpenAI && (
        <button
          onClick={onOpenAI}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white font-medium text-sm hover:opacity-90 hover:shadow-lg hover:shadow-[#FF6B35]/20 transition-all group"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span>{isDE ? 'Mit KI generieren' : 'Generate with AI'}</span>
          </div>
        </button>
      )}

      {/* LinkedIn Post Button */}
      {onPostToLinkedIn && (
        <button
          onClick={onPostToLinkedIn}
          className="w-full mt-2 p-2.5 rounded-xl bg-[#0A66C2] text-white font-medium text-xs hover:bg-[#004182] hover:shadow-lg hover:shadow-[#0A66C2]/20 transition-all group"
        >
          <div className="flex items-center justify-center gap-2">
            <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>{isDE ? 'Auf LinkedIn posten' : 'Post to LinkedIn'}</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default BlockPalette;
