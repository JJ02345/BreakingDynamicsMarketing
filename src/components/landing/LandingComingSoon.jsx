import React from 'react';
import { ClipboardList, Users, BarChart3, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingComingSoon = () => {
  const { t } = useLanguage();

  const upcomingTools = [
    {
      icon: ClipboardList,
      name: t('landing.surveyTool'),
      desc: t('landing.surveyToolDesc'),
      color: '#00D4FF'
    },
    {
      icon: Users,
      name: t('landing.founderCommunity'),
      desc: t('landing.founderCommunityDesc'),
      color: '#00E676'
    },
    {
      icon: BarChart3,
      name: t('landing.analyticsDashboard'),
      desc: t('landing.analyticsDashboardDesc'),
      color: '#FF9500'
    }
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6B35]/5 to-transparent" />
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 mb-4">
            <Sparkles className="h-3 w-3 text-[#FF6B35]" />
            <span>{t('landing.comingSoon')}</span>
          </div>
          <h2 className="font-['Syne'] text-2xl sm:text-3xl font-bold mb-3">
            {t('landing.onePlatform')}
            <span className="text-gradient"> {t('landing.manyTools')}</span>
          </h2>
          <p className="text-white/40 text-sm max-w-lg mx-auto">
            {t('landing.platformDesc')}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {upcomingTools.map((tool, i) => (
            <div
              key={i}
              className="group p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{
                  background: `${tool.color}10`,
                  border: `1px solid ${tool.color}20`
                }}
              >
                <tool.icon className="h-5 w-5" style={{ color: tool.color }} />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{tool.name}</h3>
              <p className="text-xs text-white/40">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingComingSoon;
