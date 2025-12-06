import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const DashboardStats = ({ stats }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="card-dark p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{t('dashboard.totalTests')}</span>
          <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-[#FF6B35]" />
          </div>
        </div>
        <p className="font-['Syne'] text-4xl font-bold text-gradient-orange">{stats.total}</p>
      </div>
      <div className="card-dark p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{t('dashboard.thisWeek')}</span>
          <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-[#00E676]" />
          </div>
        </div>
        <p className="font-['Syne'] text-4xl font-bold text-[#00E676]">{stats.week}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
