import React from 'react';
import { Shield, CreditCard, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingTrustBadges = () => {
  const { t } = useLanguage();

  const badges = [
    { icon: Shield, text: t('landing.trustBadge1'), color: '#00E676' },
    { icon: CreditCard, text: t('landing.trustBadge2'), color: '#FF6B35' },
    { icon: Zap, text: t('landing.trustBadge3'), color: '#0A66C2' },
  ];

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {badges.map((badge, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
        >
          <badge.icon className="h-3.5 w-3.5" style={{ color: badge.color }} />
          <span className="text-xs text-white/60 font-medium">{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

export default LandingTrustBadges;
