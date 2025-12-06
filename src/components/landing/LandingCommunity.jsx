import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingCommunity = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-glow-center" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="badge-cyan mb-6 inline-flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          <span>{t('landing.communityBadge')}</span>
        </div>
        <h2 className="font-['Syne'] text-4xl sm:text-5xl font-bold mb-6">
          {t('landing.communityTitle')}
          <span className="text-gradient"> {t('landing.communityTitle2')}</span>
        </h2>
        <p className="text-white/50 text-lg mb-8">{t('landing.communityDesc')}</p>

        <div className="flex justify-center mb-8">
          <div className="flex -space-x-3">
            {['R', 'L', 'Z', 'T', 'F'].map((letter, i) => (
              <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8C5A]/20 border-2 border-[#0A0A0B] flex items-center justify-center text-xl shadow-lg font-bold text-white/60">
                {letter}
              </div>
            ))}
            <div className="w-12 h-12 rounded-full bg-[#FF6B35] border-2 border-[#0A0A0B] flex items-center justify-center text-sm font-bold text-[#0A0A0B] shadow-lg">
              +99
            </div>
          </div>
        </div>

        <Link to="/wip" className="btn-primary btn-xl">
          {t('landing.communityButton')}
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
};

export default LandingCommunity;
