import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingUrgencyBanner = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-[#FF6B35]/20 via-[#FF6B35]/10 to-[#FF6B35]/20 border-b border-[#FF6B35]/20">
      <div className="mx-auto max-w-7xl px-6 py-2.5">
        <div className="flex items-center justify-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF6B35]/20 border border-[#FF6B35]/30">
            <Clock className="h-3.5 w-3.5 text-[#FF6B35]" />
            <span className="text-[#FF6B35] font-semibold text-xs">{t('landing.limitedTime')}</span>
          </div>
          <span className="text-white/80 font-medium">
            {t('landing.urgencyBanner')}
          </span>
          <Sparkles className="h-4 w-4 text-[#FF6B35] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LandingUrgencyBanner;
