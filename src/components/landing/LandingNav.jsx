import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, LogIn, ChevronDown, FileText, ClipboardList } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useLanguage, LanguageSwitcher } from '../../context/LanguageContext';

const LandingNav = ({ onShowLogin }) => {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [showTools, setShowTools] = useState(false);

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

        <div className="flex items-center gap-3">
          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTools(!showTools)}
              onBlur={() => setTimeout(() => setShowTools(false), 150)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {language === 'de' ? 'Tools' : 'Tools'}
              <ChevronDown className={`h-4 w-4 transition-transform ${showTools ? 'rotate-180' : ''}`} />
            </button>

            {showTools && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-[#1A1A1D] border border-white/10 shadow-2xl overflow-hidden animate-scale-in">
                <Link
                  to="/carousel"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">LinkedIn Carousel</p>
                    <p className="text-xs text-white/40">{language === 'de' ? 'PDF erstellen' : 'Create PDF'}</p>
                  </div>
                </Link>
                <Link
                  to="/survey"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-t border-white/5"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-[#00D4FF]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{language === 'de' ? 'Offline Umfragen' : 'Offline Surveys'}</p>
                    <p className="text-xs text-white/40">{language === 'de' ? 'Validierung vor Ort' : 'On-site validation'}</p>
                  </div>
                </Link>
              </div>
            )}
          </div>

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
