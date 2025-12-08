import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Download, Save, Loader2, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  t,
}) => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl flex-shrink-0">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
          >
            <Home className="h-4 w-4 text-[#FF6B35]" />
            <span className="text-sm font-medium text-white">
              {t('nav.home') || 'Startseite'}
            </span>
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
