import React, { useState, useRef, useEffect } from 'react';
import { Pipette, X } from 'lucide-react';

const PRESET_COLORS = [
  '#FFFFFF', '#000000', '#FF6B35', '#FF8C5A', '#0A66C2',
  '#00E676', '#FF5252', '#7C3AED', '#F59E0B', '#EC4899',
  '#14B8A6', '#6366F1', '#84CC16', '#F97316', '#06B6D4',
  '#E5E5E5', '#B0B0B0', '#666666', '#333333', '#1A1A2E'
];

const ColorPicker = ({ color, onChange, label, showOpacity = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(color || '#FFFFFF');
  const [opacity, setOpacity] = useState(100);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCustomColor(color || '#FFFFFF');
  }, [color]);

  const handleColorSelect = (newColor) => {
    if (showOpacity) {
      const alpha = Math.round(opacity * 2.55).toString(16).padStart(2, '0');
      onChange(newColor + alpha);
    } else {
      onChange(newColor);
    }
    setCustomColor(newColor);
  };

  const handleOpacityChange = (newOpacity) => {
    setOpacity(newOpacity);
    const alpha = Math.round(newOpacity * 2.55).toString(16).padStart(2, '0');
    onChange(customColor + alpha);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {label && (
        <label className="block text-xs text-white/60 mb-1">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
      >
        <div
          className="w-5 h-5 rounded border border-white/20"
          style={{ backgroundColor: color || '#FFFFFF' }}
        />
        <span className="text-xs text-white/70 font-mono">
          {(color || '#FFFFFF').toUpperCase().slice(0, 7)}
        </span>
        <Pipette className="h-3 w-3 text-white/40" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-[#1A1A1D] rounded-xl border border-white/10 shadow-2xl z-50 animate-scale-in min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/60">Farbe wählen</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Preset Colors Grid */}
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => handleColorSelect(presetColor)}
                className={`w-7 h-7 rounded-md border-2 transition-all hover:scale-110 ${
                  customColor === presetColor
                    ? 'border-[#FF6B35] scale-110'
                    : 'border-transparent hover:border-white/30'
                }`}
                style={{ backgroundColor: presetColor }}
              />
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                  setCustomColor(val);
                  if (val.length === 7) handleColorSelect(val);
                }
              }}
              className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white font-mono focus:border-[#FF6B35]/50 focus:outline-none"
              placeholder="#FFFFFF"
            />
          </div>

          {/* Opacity Slider */}
          {showOpacity && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                <span>Transparenz</span>
                <span>{opacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
