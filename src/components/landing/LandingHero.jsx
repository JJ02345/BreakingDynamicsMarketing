import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Linkedin, FileText, Sparkles, MousePointerClick } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../lib/supabase';

const LandingHero = () => {
  const { t } = useLanguage();
  const [carouselCount, setCarouselCount] = useState(null);

  // Load carousel count on mount
  useEffect(() => {
    const loadCount = async () => {
      try {
        const count = await db.getCarouselCount();
        setCarouselCount(count);
      } catch (err) {
        console.error('Failed to load carousel count:', err);
      }
    };
    loadCount();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-glow-top" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF6B35]/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#0A66C2]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl w-full text-center">
        {/* Badge */}
        <div className="animate-slide-up delay-0 mb-8 inline-flex items-center gap-2 badge-orange">
          <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-xs font-semibold tracking-wide">{t('landing.badge')}</span>
        </div>

        {/* Headline */}
        <h1 className="animate-slide-up delay-100 font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
          {t('landing.headline1')}<br />
          <span className="text-gradient">{t('landing.headline2')}</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-slide-up delay-200 text-base sm:text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
          {t('landing.heroDesc')}
        </p>

        {/* Main CTA Button */}
        <div className="animate-slide-up delay-300 mb-12">
          <Link
            to="/carousel"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base transition-all bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B] hover:scale-105 hover:shadow-2xl hover:shadow-[#FF6B35]/30"
          >
            <Linkedin className="h-5 w-5 flex-shrink-0" />
            <span>{t('landing.createCarouselNow')}</span>
            <ChevronRight className="h-5 w-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-sm text-white/40">
            {t('landing.noSignUp')}
          </p>
        </div>

        {/* Feature Pills */}
        <div className="animate-slide-up delay-400 flex items-center justify-center gap-3 mb-16 flex-wrap">
          {[
            { icon: FileText, text: 'PDF Export' },
            { icon: Linkedin, text: '1080×1080' },
            { icon: MousePointerClick, text: 'Drag & Drop' },
          ].map((feature, i) => (
            <div key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <feature.icon className="h-4 w-4 text-[#FF6B35] flex-shrink-0" />
              <span className="text-sm text-white/70 whitespace-nowrap">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="animate-slide-up delay-500 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {[
            { value: t('landing.stat1Value'), label: t('landing.stat1Label') },
            { value: t('landing.stat2Value'), label: t('landing.stat2Label') },
            { value: t('landing.stat3Value'), label: t('landing.stat3Label') },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-['Syne'] text-2xl sm:text-3xl font-bold text-gradient-orange leading-none">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-white/40 mt-2 uppercase tracking-wider leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Carousel Counter - Social Proof */}
        {carouselCount !== null && carouselCount > 0 && (
          <div className="animate-slide-up delay-600 mt-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/60">
                <span className="font-semibold text-white">{carouselCount.toLocaleString()}</span>
                {' '}{t('landing.carouselsCreated')}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LandingHero;
