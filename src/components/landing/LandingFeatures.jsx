import React from 'react';
import { Gauge, Target, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingFeatures = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Gauge, title: t('landing.feature1Title'), desc: t('landing.feature1Desc'), accent: '#FF6B35' },
    { icon: Target, title: t('landing.feature2Title'), desc: t('landing.feature2Desc'), accent: '#00D4FF' },
    { icon: TrendingUp, title: t('landing.feature3Title'), desc: t('landing.feature3Desc'), accent: '#00E676' }
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-diagonal" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold mb-4">{t('landing.whyTitle')}</h2>
          <p className="text-white/50 max-w-xl mx-auto">{t('landing.whySubtitle')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item, i) => (
            <div key={i} className="card-glow p-8 group" style={{ animationDelay: `${i * 100}ms` }}>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]"
                style={{ background: `linear-gradient(135deg, ${item.accent}20 0%, ${item.accent}10 100%)`, border: `1px solid ${item.accent}30` }}
              >
                <item.icon className="h-7 w-7" style={{ color: item.accent }} />
              </div>
              <h3 className="font-['Syne'] text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/50 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
