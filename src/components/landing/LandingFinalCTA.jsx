import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingFinalCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B35]/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#FF6B35]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#0A66C2]/10 rounded-full blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="font-['Syne'] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          {t('landing.finalCtaTitle')}
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          {t('landing.finalCtaDesc')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/carousel"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base transition-all bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B] hover:scale-105 hover:shadow-2xl hover:shadow-[#FF6B35]/30"
          >
            <Linkedin className="h-5 w-5 flex-shrink-0" />
            <span>{t('landing.createCarouselNow')}</span>
            <ChevronRight className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/carousel"
            className="group inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-medium text-base transition-all text-white/70 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5"
          >
            <span>{t('landing.ctaSecondary')}</span>
            <ArrowRight className="h-4 w-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/40">
          {t('landing.noSignUp')}
        </p>
      </div>
    </section>
  );
};

export default LandingFinalCTA;
