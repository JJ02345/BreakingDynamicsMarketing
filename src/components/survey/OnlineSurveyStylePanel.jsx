import React from 'react';
import { X, Palette } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ACCENT_COLORS = [
  { id: 'blue', color: '#00D4FF', name: 'Cyan' },
  { id: 'orange', color: '#FF6B35', name: 'Orange' },
  { id: 'green', color: '#00E676', name: 'Green' },
  { id: 'purple', color: '#7C3AED', name: 'Purple' },
  { id: 'pink', color: '#EC4899', name: 'Pink' },
  { id: 'yellow', color: '#F59E0B', name: 'Yellow' },
];

const BACKGROUND_OPTIONS = [
  { id: 'dark', color: '#0A0A0B', name: 'Dark', nameDE: 'Dunkel' },
  { id: 'darker', color: '#000000', name: 'Black', nameDE: 'Schwarz' },
  { id: 'navy', color: '#0a192f', name: 'Navy', nameDE: 'Navy' },
  { id: 'slate', color: '#1e293b', name: 'Slate', nameDE: 'Schiefer' },
];

const FONT_OPTIONS = [
  { id: 'space-grotesk', family: "'Space Grotesk', sans-serif", name: 'Space Grotesk' },
  { id: 'inter', family: "'Inter', sans-serif", name: 'Inter' },
  { id: 'poppins', family: "'Poppins', sans-serif", name: 'Poppins' },
  { id: 'roboto', family: "'Roboto', sans-serif", name: 'Roboto' },
];

const BORDER_RADIUS_OPTIONS = [
  { id: 'none', value: '0', name: 'None', nameDE: 'Keine' },
  { id: 'sm', value: '8px', name: 'Small', nameDE: 'Klein' },
  { id: 'lg', value: '16px', name: 'Large', nameDE: 'Groß' },
  { id: 'xl', value: '24px', name: 'Extra Large', nameDE: 'Sehr Groß' },
];

const OnlineSurveyStylePanel = ({ settings, onUpdate, onClose }) => {
  const { language } = useLanguage();
  const isDE = language === 'de';

  return (
    <aside className="w-72 border-l border-white/5 h-[calc(100vh-4rem)] overflow-y-auto bg-[#0A0A0B]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-[#00D4FF]" />
            <h3 className="font-semibold text-white">
              {isDE ? 'Design anpassen' : 'Customize Design'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Accent Color */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-3">
              {isDE ? 'Akzentfarbe' : 'Accent Color'}
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => onUpdate('accentColor', color.color)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    settings.accentColor === color.color
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0A0A0B] scale-110'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-3">
              {isDE ? 'Hintergrund' : 'Background'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BACKGROUND_OPTIONS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => onUpdate('backgroundColor', bg.color)}
                  className={`w-full aspect-square rounded-lg border-2 transition-all ${
                    settings.backgroundColor === bg.color
                      ? 'border-[#00D4FF]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={{ backgroundColor: bg.color }}
                  title={isDE ? bg.nameDE : bg.name}
                />
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-3">
              {isDE ? 'Schriftart' : 'Font'}
            </label>
            <div className="space-y-2">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => onUpdate('fontFamily', font.family)}
                  className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all ${
                    settings.fontFamily === font.family
                      ? 'bg-[#00D4FF]/20 border border-[#00D4FF] text-white'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:border-white/20'
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-3">
              {isDE ? 'Eckenradius' : 'Border Radius'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BORDER_RADIUS_OPTIONS.map((radius) => (
                <button
                  key={radius.id}
                  onClick={() => onUpdate('borderRadius', radius.id)}
                  className={`px-2 py-1.5 rounded text-xs transition-all ${
                    settings.borderRadius === radius.id
                      ? 'bg-[#00D4FF] text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {isDE ? radius.nameDE : radius.name}
                </button>
              ))}
            </div>
          </div>

          {/* Show Progress Bar */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-white/60">
                {isDE ? 'Fortschrittsbalken' : 'Progress Bar'}
              </span>
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  settings.showProgressBar ? 'bg-[#00D4FF]' : 'bg-white/20'
                }`}
                onClick={() => onUpdate('showProgressBar', !settings.showProgressBar)}
              >
                <div
                  className={`w-5 h-5 mt-0.5 rounded-full bg-white shadow-md transition-transform ${
                    settings.showProgressBar ? 'translate-x-4.5 ml-0.5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Show Branding */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-white/60">
                {isDE ? 'Branding anzeigen' : 'Show Branding'}
              </span>
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  settings.showBranding ? 'bg-[#00D4FF]' : 'bg-white/20'
                }`}
                onClick={() => onUpdate('showBranding', !settings.showBranding)}
              >
                <div
                  className={`w-5 h-5 mt-0.5 rounded-full bg-white shadow-md transition-transform ${
                    settings.showBranding ? 'translate-x-4.5 ml-0.5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Thank You Message */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              {isDE ? 'Dankes-Nachricht' : 'Thank You Message'}
            </label>
            <textarea
              value={settings.thankYouMessage || ''}
              onChange={(e) => onUpdate('thankYouMessage', e.target.value)}
              placeholder={isDE ? 'Vielen Dank für dein Feedback!' : 'Thank you for your feedback!'}
              className="w-full h-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:border-[#00D4FF]/50 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default OnlineSurveyStylePanel;
