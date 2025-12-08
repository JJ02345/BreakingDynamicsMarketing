import React, { useState, useRef, useEffect } from 'react';
import { Type, ChevronDown, X } from 'lucide-react';

export const FONT_OPTIONS = [
  { id: 'space-grotesk', name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", category: 'Sans-Serif' },
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif", category: 'Sans-Serif' },
  { id: 'syne', name: 'Syne', family: "'Syne', sans-serif", category: 'Display' },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif", category: 'Sans-Serif' },
  { id: 'roboto', name: 'Roboto', family: "'Roboto', sans-serif", category: 'Sans-Serif' },
  { id: 'montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'Sans-Serif' },
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif", category: 'Serif' },
  { id: 'merriweather', name: 'Merriweather', family: "'Merriweather', serif", category: 'Serif' },
  { id: 'oswald', name: 'Oswald', family: "'Oswald', sans-serif", category: 'Display' },
  { id: 'raleway', name: 'Raleway', family: "'Raleway', sans-serif", category: 'Sans-Serif' },
  { id: 'lora', name: 'Lora', family: "'Lora', serif", category: 'Serif' },
  { id: 'source-code', name: 'Source Code Pro', family: "'Source Code Pro', monospace", category: 'Monospace' },
];

// Load Google Fonts dynamically
const loadFont = (fontId) => {
  const font = FONT_OPTIONS.find(f => f.id === fontId);
  if (!font) return;

  const fontName = font.name.replace(/ /g, '+');
  const linkId = `google-font-${fontId}`;

  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }
};

// Preload common fonts
['space-grotesk', 'inter', 'syne', 'poppins'].forEach(loadFont);

const FontSelector = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);

  const currentFont = FONT_OPTIONS.find(f => f.family === value) || FONT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (font) => {
    loadFont(font.id);
    onChange(font.family);
    setIsOpen(false);
  };

  const categories = [...new Set(FONT_OPTIONS.map(f => f.category))];

  return (
    <div className="relative" ref={selectorRef}>
      {label && (
        <label className="block text-xs text-white/60 mb-1">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-white/40" />
          <span
            className="text-sm text-white"
            style={{ fontFamily: currentFont.family }}
          >
            {currentFont.name}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1D] rounded-xl border border-white/10 shadow-2xl z-50 animate-scale-in max-h-[300px] overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between p-2 border-b border-white/10 bg-[#1A1A1D]">
            <span className="text-xs text-white/60">Schriftart wählen</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {categories.map((category) => (
            <div key={category}>
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/40 bg-white/5">
                {category}
              </div>
              {FONT_OPTIONS.filter(f => f.category === category).map((font) => (
                <button
                  key={font.id}
                  onClick={() => handleSelect(font)}
                  className={`w-full px-3 py-2 text-left hover:bg-white/5 transition-colors flex items-center justify-between ${
                    currentFont.id === font.id ? 'bg-[#FF6B35]/10 text-[#FF6B35]' : 'text-white'
                  }`}
                >
                  <span style={{ fontFamily: font.family }} className="text-sm">
                    {font.name}
                  </span>
                  {currentFont.id === font.id && (
                    <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FontSelector;
