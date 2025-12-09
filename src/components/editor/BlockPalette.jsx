import React, { useState, useRef } from 'react';
import { Type, Image, Smile, Minus, User, Hash, List, Quote, AlignLeft, Sparkles, Linkedin, Palette, ChevronDown, Check, Upload, X, Loader2, Globe } from 'lucide-react';
import { BLOCK_TYPES, BACKGROUND_STYLES, createBlock } from '../../utils/slideTemplates';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

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
  mesh: { name: 'Premium', nameDE: 'Premium' },
  image: { name: 'Image', nameDE: 'Bild' }
};

// Slide content language options
const CONTENT_LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const BlockPalette = ({
  onAddBlock,
  onOpenAI,
  onPostToLinkedIn,
  onBackgroundChange,
  activeBackground,
  activeBackgroundImage,
  contentLanguage = 'en',
  onContentLanguageChange,
  isTranslating = false,
  disabled = false
}) => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const isDE = language === 'de';
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [activeCategory, setActiveCategory] = useState('gradient');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const fileInputRef = useRef(null);

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

  // Handle background image upload
  const handleBackgroundImageUpload = async (file) => {
    if (!file) return;

    // Validate file
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError(isDE ? 'Nur JPG, PNG, GIF, WebP erlaubt' : 'Only JPG, PNG, GIF, WebP allowed');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError(isDE ? 'Max. 5MB erlaubt' : 'Max 5MB allowed');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      if (isAuthenticated) {
        // Cloud upload
        const result = await db.uploadImage(file, 'backgrounds');
        onBackgroundChange('custom-image', { url: result.url, path: result.path });
      } else {
        // Local Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          onBackgroundChange('custom-image', { url: reader.result });
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(isDE ? 'Upload fehlgeschlagen' : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleBackgroundImageUpload(file);
    }
  };

  const removeBackgroundImage = () => {
    onBackgroundChange('solid-dark', null);
  };

  const selectedLanguage = CONTENT_LANGUAGES.find(l => l.id === contentLanguage) || CONTENT_LANGUAGES[0];

  return (
    <div className="p-3 flex flex-col h-full overflow-y-auto">

      {/* ===== SECTION 1: ACTIONS (Most Important) ===== */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-px bg-white/10" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#FF6B35]">
            {isDE ? 'Erstellen' : 'Create'}
          </p>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* AI Generator Button - Most Prominent */}
        {onOpenAI && (
          <button
            onClick={onOpenAI}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white font-medium text-sm hover:opacity-90 hover:shadow-lg hover:shadow-[#FF6B35]/20 transition-all group mb-2"
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
            className="w-full p-2.5 rounded-xl bg-[#0A66C2] text-white font-medium text-xs hover:bg-[#004182] hover:shadow-lg hover:shadow-[#0A66C2]/20 transition-all group"
          >
            <div className="flex items-center justify-center gap-2">
              <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>{isDE ? 'Auf LinkedIn posten' : 'Post to LinkedIn'}</span>
            </div>
          </button>
        )}
      </div>

      {/* ===== SECTION 2: SLIDE SETTINGS ===== */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-px bg-white/10" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
            {isDE ? 'Slide-Einstellungen' : 'Slide Settings'}
          </p>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Content Language Selector */}
        {onContentLanguageChange && (
          <div className="relative mb-2">
            <button
              onClick={() => !isTranslating && setShowLanguageDropdown(!showLanguageDropdown)}
              disabled={isTranslating}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group ${isTranslating ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center gap-2">
                {isTranslating ? (
                  <Loader2 className="h-4 w-4 text-[#FF6B35] animate-spin" />
                ) : (
                  <Globe className="h-4 w-4 text-white/50" />
                )}
                <span className="text-xs text-white/70">
                  {isTranslating
                    ? (isDE ? 'Übersetze...' : 'Translating...')
                    : (isDE ? 'Slide-Sprache' : 'Slide Language')
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{selectedLanguage.flag}</span>
                <span className="text-xs text-white/50">{selectedLanguage.label}</span>
                <ChevronDown className={`h-3 w-3 text-white/40 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {showLanguageDropdown && !isTranslating && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#1A1A1D] rounded-xl border border-white/10 shadow-xl overflow-hidden">
                {CONTENT_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      onContentLanguageChange(lang.id);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors ${
                      contentLanguage === lang.id ? 'bg-[#FF6B35]/10' : ''
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className={`text-sm ${contentLanguage === lang.id ? 'text-[#FF6B35]' : 'text-white/70'}`}>
                      {lang.label}
                    </span>
                    {contentLanguage === lang.id && (
                      <Check className="h-4 w-4 text-[#FF6B35] ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Background Selector */}
        {onBackgroundChange && (
          <>
            <button
              onClick={() => setShowBackgrounds(!showBackgrounds)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-lg border border-white/20 shadow-inner"
                  style={BACKGROUND_STYLES[activeBackground]?.style || { backgroundColor: '#0A0A0B' }}
                />
                <span className="text-xs text-white/70">
                  {isDE ? 'Hintergrund' : 'Background'}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${showBackgrounds ? 'rotate-180' : ''}`} />
            </button>

            {/* Expandable Background Panel */}
            {showBackgrounds && (
              <div className="mt-2 p-3 rounded-xl bg-[#0A0A0B] border border-white/10">
                {/* Category Tabs */}
                <div className="flex gap-1 mb-3">
                  {Object.entries(BACKGROUND_CATEGORIES).map(([catKey, cat]) => (
                    <button
                      key={catKey}
                      onClick={() => setActiveCategory(catKey)}
                      className={`flex-1 py-1.5 px-1 rounded-lg text-[9px] font-medium transition-all ${
                        activeCategory === catKey
                          ? 'bg-[#FF6B35] text-white'
                          : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isDE ? cat.nameDE : cat.name}
                    </button>
                  ))}
                </div>

                {/* Background Grid - Colors/Gradients */}
                {activeCategory !== 'image' && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {(backgroundsByCategory[activeCategory] || []).map((bg) => (
                      <button
                        key={bg.key}
                        onClick={() => onBackgroundChange(bg.key, null)}
                        className={`relative w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                          activeBackground === bg.key && !activeBackgroundImage
                            ? 'border-[#FF6B35] ring-1 ring-[#FF6B35]/30'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        style={bg.style}
                        title={isDE ? bg.nameDE : bg.name}
                      >
                        {activeBackground === bg.key && !activeBackgroundImage && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="h-3 w-3 text-[#FF6B35] drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Image Upload Tab */}
                {activeCategory === 'image' && (
                  <div className="space-y-2">
                    {/* Current Background Image Preview */}
                    {activeBackgroundImage?.url && (
                      <div className="relative rounded-lg overflow-hidden border border-white/20">
                        <img
                          src={activeBackgroundImage.url}
                          alt="Background"
                          className="w-full h-20 object-cover"
                        />
                        <button
                          onClick={removeBackgroundImage}
                          className="absolute top-1 right-1 p-1 rounded-md bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    {/* Upload Area */}
                    <div
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-lg border-2 border-dashed
                        transition-all cursor-pointer
                        ${isUploading
                          ? 'border-[#FF6B35]/50 bg-[#FF6B35]/5'
                          : 'border-white/20 bg-white/5 hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5'
                        }
                      `}
                    >
                      {isUploading ? (
                        <Loader2 className="h-5 w-5 text-[#FF6B35] animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-5 w-5 text-white/40 mb-1" />
                          <span className="text-[9px] text-white/50">
                            {isDE ? 'Bild hochladen' : 'Upload image'}
                          </span>
                        </>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ALLOWED_TYPES.join(',')}
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {uploadError && (
                      <p className="text-[9px] text-red-400 text-center">{uploadError}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== SECTION 3: BLOCKS ===== */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-px bg-white/10" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
            {isDE ? 'Bausteine' : 'Blocks'}
          </p>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Block Grid - Compact */}
        <div className="grid grid-cols-3 gap-1.5">
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
                  group relative flex flex-col items-center justify-center gap-1
                  rounded-lg p-2 text-center transition-all aspect-square
                  ${disabled
                    ? 'cursor-not-allowed opacity-30 bg-white/5'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-[#FF6B35]/10 hover:border-[#FF6B35]/40 hover:text-[#FF6B35] hover:scale-105 cursor-grab active:cursor-grabbing active:scale-95'
                  }
                `}
                title={isDE ? block.nameDE : block.name}
              >
                <Icon className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-[#FF6B35]" />
                <span className="text-[8px] font-medium leading-tight truncate w-full">
                  {(isDE ? block.nameDE : block.name).split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-center text-[9px] text-white/20">
          {isDE ? 'Klicken oder ziehen' : 'Click or drag'}
        </p>
      </div>
    </div>
  );
};

export default BlockPalette;
