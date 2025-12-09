import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { useLanguage, LanguageSwitcher } from '../../context/LanguageContext';
import { BreakingDynamicsIcon } from '../common/BreakingDynamicsLogo';

const DashboardHeader = ({ user, isAdmin, onLogout }) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] shadow-lg shadow-[#FF6B35]/20 transition-transform group-hover:scale-105">
            <BreakingDynamicsIcon size={24} color="#0A0A0B" />
          </div>
          <span className="font-['Syne'] text-lg font-bold">Breaking Dynamics</span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <span className="hidden text-sm text-white/40 sm:block">{user?.email}</span>
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.admin')}</span>
            </Link>
          )}
          <button onClick={onLogout} className="btn-ghost flex items-center gap-2">
            <LogOut className="h-4 w-4" />{t('nav.logout')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
