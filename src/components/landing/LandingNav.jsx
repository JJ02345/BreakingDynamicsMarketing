import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, LogIn, ChevronDown, FileText, ClipboardList, Globe, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useLanguage, LanguageSwitcher } from '../../context/LanguageContext';

const LandingNav = ({ onShowLogin }) => {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [showSurveyDropdown, setShowSurveyDropdown] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] shadow-lg shadow-[#FF6B35]/20">
            <Zap className="h-6 w-6 text-[#0A0A0B]" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] blur-xl opacity-40" />
          </div>
          <div className="hidden sm:block">
            <p className="font-['Syne'] text-lg font-bold tracking-tight">Breaking Dynamics</p>
            <p className="text-xs font-medium text-[#FF6B35] tracking-wider uppercase">{t('landing.tagline')}</p>
          </div>
        </Link>

        {/* Center Navigation - Tools */}
        <div className="flex items-center gap-2">
          {/* LinkedIn Carousel - Direct Link */}
          <Link
            to="/carousel"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <FileText className="h-4 w-4 text-[#FF6B35]" />
            <span className="hidden md:inline">LinkedIn Carousel</span>
          </Link>

          {/* Survey Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSurveyDropdown(!showSurveyDropdown)}
              onBlur={() => setTimeout(() => setShowSurveyDropdown(false), 150)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <ClipboardList className="h-4 w-4 text-[#00D4FF]" />
              <span className="hidden md:inline">{language === 'de' ? 'Umfragen' : 'Surveys'}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showSurveyDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSurveyDropdown && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 rounded-xl bg-[#1A1A1D] border border-white/10 shadow-2xl overflow-hidden animate-scale-in">
                {/* Online Survey Option */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-[#00E676]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        {language === 'de' ? 'Online Umfragen' : 'Online Surveys'}
                      </p>
                      <Wifi className="h-3 w-3 text-[#00E676]" />
                    </div>
                    <p className="text-xs text-white/40">
                      {language === 'de' ? 'Per Link teilen & Antworten sammeln' : 'Share via link & collect responses'}
                    </p>
                  </div>
                </Link>

                {/* Offline Survey Option */}
                <Link
                  to="/survey"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-t border-white/5"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-[#00D4FF]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        {language === 'de' ? 'Offline Umfragen' : 'Offline Surveys'}
                      </p>
                      <WifiOff className="h-3 w-3 text-[#00D4FF]" />
                    </div>
                    <p className="text-xs text-white/40">
                      {language === 'de' ? 'Validierung vor Ort ohne Internet' : 'On-site validation without internet'}
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
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
