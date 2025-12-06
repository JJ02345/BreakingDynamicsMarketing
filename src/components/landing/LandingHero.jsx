import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ChevronRight, Linkedin, CheckCircle2, Play } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingHero = () => {
  const { t, language } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-glow-top" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF6B35]/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#0A66C2]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl w-full text-center">
        {/* Badge */}
        <div className="animate-slide-up delay-0 mb-6 inline-flex items-center gap-2 badge-orange">
          <Zap className="h-3.5 w-3.5" />
          <span>{t('landing.badge')}</span>
        </div>

        {/* Headline */}
        <h1 className="animate-slide-up delay-100 font-['Syne'] text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
          {t('landing.headline1')}<br />
          <span className="text-gradient">{t('landing.headline2')}</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-slide-up delay-200 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10">
          {t('landing.heroDesc')}
        </p>

        {/* Main CTA Button */}
        <div className="animate-slide-up delay-300 mb-12">
          <Link
            to="/carousel"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B] hover:scale-105 hover:shadow-2xl hover:shadow-[#FF6B35]/30"
          >
            <Linkedin className="h-5 w-5" />
            {language === 'de' ? 'Jetzt Carousel erstellen' : 'Create Carousel Now'}
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-sm text-white/40">
            {language === 'de' ? 'Kostenlos • Keine Anmeldung nötig' : 'Free • No sign-up required'}
          </p>
        </div>

        {/* Feature Pills */}
        <div className="animate-slide-up delay-400 flex flex-wrap items-center justify-center gap-4 mb-16">
          {[
            language === 'de' ? 'LinkedIn-optimiert' : 'LinkedIn-optimized',
            language === 'de' ? 'PDF Export' : 'PDF Export',
            language === 'de' ? 'Drag & Drop' : 'Drag & Drop',
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <CheckCircle2 className="h-4 w-4 text-[#FF6B35]" />
              <span className="text-sm text-white/70">{feature}</span>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="animate-slide-up delay-500 flex items-center justify-center gap-8 sm:gap-16">
          {[
            { value: t('landing.stat1Value'), label: t('landing.stat1Label') },
            { value: t('landing.stat2Value'), label: t('landing.stat2Label') },
            { value: t('landing.stat3Value'), label: t('landing.stat3Label') },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-['Syne'] text-3xl sm:text-4xl font-bold text-gradient-orange">{stat.value}</p>
              <p className="text-xs sm:text-sm text-white/40 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
