import React from 'react';
import { Palette, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BACKGROUND_STYLES } from '../../utils/slideTemplates';

const CarouselBackgroundPanel = ({
  show,
  onToggle,
  activeBackground,
  onBackgroundChange,
  t,
}) => {
  const { language } = useLanguage();

  return (
    <>
      <button
        onClick={onToggle}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 btn-ghost"
      >
        <Palette className="h-4 w-4" />
        {t('carousel.background')}
      </button>

      {show && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#1A1A1D] rounded-xl border border-white/10 shadow-2xl p-4 z-20 animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">{t('carousel.chooseBackground')}</span>
            <button onClick={onToggle} className="text-white/40 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(BACKGROUND_STYLES).map(([key, bg]) => (
              <button
                key={key}
                onClick={() => onBackgroundChange(key)}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  activeBackground === key
                    ? 'border-[#FF6B35] scale-110'
                    : 'border-transparent hover:border-white/30 hover:scale-105'
                }`}
                style={bg.style}
                title={language === 'de' ? bg.nameDE : bg.name}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CarouselBackgroundPanel;
