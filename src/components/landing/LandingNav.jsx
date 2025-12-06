import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, LogIn } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useLanguage, LanguageSwitcher } from '../../context/LanguageContext';

const LandingNav = ({ onShowLogin }) => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] shadow-lg shadow-[#FF6B35]/20">
            <Zap className="h-6 w-6 text-[#0A0A0B]" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] blur-xl opacity-40" />
          </div>
          <div>
            <p className="font-['Syne'] text-lg font-bold tracking-tight">Breaking Dynamics</p>
            <p className="text-xs font-medium text-[#FF6B35] tracking-wider uppercase">{t('landing.tagline')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-ghost text-sm">{t('nav.dashboard')}</Link>
          ) : (
            <button onClick={onShowLogin} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
              <LogIn className="h-4 w-4" />{t('nav.login')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
