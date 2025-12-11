import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, MessageSquare, Gift, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingTestimonials = () => {
  const { t } = useLanguage();

  const cards = [
    {
      icon: Rocket,
      title: t('landing.feedbackCard1Title'),
      desc: t('landing.feedbackCard1Desc'),
      color: '#FF6B35',
    },
    {
      icon: MessageSquare,
      title: t('landing.feedbackCard2Title'),
      desc: t('landing.feedbackCard2Desc'),
      color: '#0A66C2',
    },
    {
      icon: Gift,
      title: t('landing.feedbackCard3Title'),
      desc: t('landing.feedbackCard3Desc'),
      color: '#00E676',
    },
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6B35]/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold mb-4">
            {t('landing.testimonialTitle')}
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            {t('landing.testimonialSubtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {cards.map((card, i) => (
            <div
              key={i}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}
              >
                <card.icon className="h-6 w-6" style={{ color: card.color }} />
              </div>

              <h3 className="font-['Syne'] text-lg font-bold text-white mb-2">
                {card.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/carousel"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all bg-white/10 text-white hover:bg-white/15 border border-white/10 hover:border-white/20"
          >
            <span>{t('landing.testimonialCTA')}</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingTestimonials;
