import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, ChevronRight, FileText, ClipboardList,
  Globe, Linkedin, PenTool, BarChart3, Smartphone, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingHero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-glow-top" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF6B35]/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#0A66C2]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="text-center mb-16">
          <div className="animate-slide-up delay-0 mb-6 inline-flex items-center gap-2 badge-orange">
            <Zap className="h-3.5 w-3.5" />
            <span>{t('landing.badge')}</span>
          </div>
          <h1 className="animate-slide-up delay-100 font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            {t('landing.headline1')}<br />
            <span className="text-gradient">{t('landing.headline2')}</span>
          </h1>
          <p className="animate-slide-up delay-200 text-lg text-white/60 max-w-2xl mx-auto">
            {t('landing.heroDesc')}
          </p>
        </div>

        <div className="animate-slide-up delay-300 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* LinkedIn Carousel Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8C5A]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative card-glow p-8 h-full flex flex-col border-2 border-transparent hover:border-[#FF6B35]/30 transition-all duration-300">
              <div className="flex items-center gap-2 mb-6">
                <span className="badge-orange"><Globe className="h-3 w-3" />{t('landing.online')}</span>
                <span className="badge-cyan"><Linkedin className="h-3 w-3" />LinkedIn</span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8C5A]/10 border border-[#FF6B35]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="h-8 w-8 text-[#FF6B35]" />
              </div>
              <h2 className="font-['Syne'] text-2xl font-bold mb-3 text-white">{t('landing.carouselTitle')}</h2>
              <p className="text-white/50 mb-6 flex-grow">{t('landing.carouselDesc')}</p>
              <ul className="space-y-3 mb-8">
                {[t('landing.carouselFeature1'), t('landing.carouselFeature2'), t('landing.carouselFeature3')].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle2 className="h-4 w-4 text-[#FF6B35] flex-shrink-0" />{feature}
                  </li>
                ))}
              </ul>
              <Link to="/carousel" className="btn-primary w-full justify-center">
                <PenTool className="h-4 w-4" />{t('landing.carouselCTA')}<ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Offline Surveys Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2]/20 to-[#00D4FF]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative card-glow p-8 h-full flex flex-col border-2 border-transparent hover:border-[#0A66C2]/30 transition-all duration-300">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0A66C2]/10 text-[#00D4FF] border border-[#0A66C2]/20">
                  <Smartphone className="h-3 w-3 inline mr-1" />{t('landing.offline')}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20">
                  <BarChart3 className="h-3 w-3 inline mr-1" />{t('landing.realtime')}
                </span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A66C2]/20 to-[#00D4FF]/10 border border-[#0A66C2]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ClipboardList className="h-8 w-8 text-[#00D4FF]" />
              </div>
              <h2 className="font-['Syne'] text-2xl font-bold mb-3 text-white">{t('landing.surveyTitle')}</h2>
              <p className="text-white/50 mb-6 flex-grow">{t('landing.surveyDesc')}</p>
              <ul className="space-y-3 mb-8">
                {[t('landing.surveyFeature1'), t('landing.surveyFeature2'), t('landing.surveyFeature3')].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle2 className="h-4 w-4 text-[#00D4FF] flex-shrink-0" />{feature}
                  </li>
                ))}
              </ul>
              <Link to="/editor" className="w-full justify-center flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-[#0A66C2] to-[#00D4FF] text-white hover:opacity-90 hover:scale-[1.02]">
                <ClipboardList className="h-4 w-4" />{t('landing.surveyCTA')}<ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="animate-slide-up delay-400 mt-20 flex items-center justify-center gap-8 sm:gap-16">
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
