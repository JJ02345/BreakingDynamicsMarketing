import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Zap, FileText } from 'lucide-react';
import { LanguageSwitcher } from '../../context/LanguageContext';
import { LINKEDIN_LIMITS } from '../../lib/postCompiler';

const EditorHeader = ({ isAuthenticated, postStats, t }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl flex-shrink-0">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-ghost flex items-center gap-2">
              <Home className="h-4 w-4" />{t('nav.dashboard')}
            </Link>
          ) : (
            <Link to="/" className="btn-ghost flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />{t('nav.back')}
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
              <Zap className="h-4 w-4 text-[#0A0A0B]" />
            </div>
            <span className="hidden font-['Syne'] text-sm font-bold text-white sm:block">Breaking Dynamics</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
            postStats.characters > LINKEDIN_LIMITS.POST_TEXT
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-white/5 text-white/50 border border-white/10'
          }`}>
            <FileText className="h-3.5 w-3.5" />
            {postStats.characters}/{LINKEDIN_LIMITS.POST_TEXT}
          </div>
          <LanguageSwitcher />
          <span className="badge-orange">{t('nav.editor')}</span>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;
