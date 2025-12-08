import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Zap, Download, Save, Loader2, Eye, Sparkles } from 'lucide-react';
import { useLanguage, LanguageSwitcher } from '../../context/LanguageContext';

const CarouselHeader = ({
  title,
  setTitle,
  isAuthenticated,
  saving,
  exporting,
  exportProgress,
  previewMode,
  onTogglePreview,
  onSave,
  onExport,
  onOpenAIGenerator,
  t,
}) => {
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

        <div className="flex-1 max-w-md mx-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('carousel.titlePlaceholder')}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-center focus:border-[#FF6B35]/50 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* AI Generator Button */}
          <button
            onClick={onOpenAIGenerator}
            className="btn-ghost bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/10 border border-[#FF6B35]/30 hover:border-[#FF6B35]/50 text-[#FF6B35]"
            title="KI Carousel Generator"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">KI Generator</span>
          </button>

          <button
            onClick={onTogglePreview}
            className={`btn-ghost ${previewMode ? 'bg-[#FF6B35]/20 text-[#FF6B35]' : ''}`}
          >
            <Eye className="h-4 w-4" />
          </button>

          {isAuthenticated && (
            <button onClick={onSave} disabled={saving} className="btn-secondary">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t('carousel.save')}
            </button>
          )}

          <button onClick={onExport} disabled={exporting} className="btn-primary">
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {exportProgress}%
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                {t('carousel.exportPDF')}
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default CarouselHeader;
