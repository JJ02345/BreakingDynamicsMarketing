import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, ChevronRight, Sparkles, Save, FolderOpen, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingCommunity = () => {
  const { t } = useLanguage();

  const accountBenefits = [
    { icon: Save, text: t('landing.saveCarousels') },
    { icon: FolderOpen, text: t('landing.editAnytime') },
    { icon: Zap, text: t('landing.earlyAccess') },
  ];

  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 bg-glow-center" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="badge-cyan mb-6 inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t('landing.ready')}</span>
        </div>
        <h2 className="font-['Syne'] text-4xl sm:text-5xl font-bold mb-6">
          {t('landing.createFirst')}
          <span className="text-gradient"> {t('landing.firstCarousel')}</span>
        </h2>
        <p className="text-white/50 text-lg mb-8">
          {t('landing.noSignupNoCard')}
        </p>

        <Link
          to="/carousel"
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B] hover:scale-105 hover:shadow-2xl hover:shadow-[#FF6B35]/30"
        >
          <Linkedin className="h-5 w-5" />
          {t('landing.createCarousel')}
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Account Benefits */}
        <div className="mt-10 pt-8 border-t border-white/5">
          <p className="text-xs text-white/30 uppercase tracking-wider mb-4">
            {t('landing.withFreeAccount')}
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {accountBenefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-white/50">
                <benefit.icon className="h-4 w-4 text-[#FF6B35]" />
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCommunity;
