import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Download, Save, Loader2, Eye, Keyboard } from 'lucide-react';

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
  onShowShortcuts,
  t,
}) => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B] flex-shrink-0">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center h-14 px-4">
        {/* Left: Home Button */}
        <div className="flex justify-start">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
          >
            <Home className="h-4 w-4 text-[#FF6B35] flex-shrink-0" />
            <span className="text-sm font-medium text-white hidden sm:inline">
              {t('nav.home') || 'Home'}
            </span>
          </Link>
        </div>

        {/* Center: Title Input - exactly centered */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('carousel.titlePlaceholder')}
          className="w-56 bg-white/5 border border-white/10 rounded-lg px-4 py-1.5 text-sm text-white text-center focus:border-[#FF6B35]/50 focus:outline-none placeholder:text-white/30"
        />

        {/* Right: Actions */}
        <div className="flex justify-end items-center gap-2">
          {/* Keyboard Shortcuts Button */}
          {onShowShortcuts && (
            <button
              onClick={onShowShortcuts}
              className="p-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors hidden sm:flex"
              title={t('editor.keyboardShortcuts') || 'Keyboard shortcuts (Shift + ?)'}
            >
              <Keyboard className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={onTogglePreview}
            className={`p-2 rounded-lg transition-colors ${
              previewMode
                ? 'bg-[#FF6B35]/20 text-[#FF6B35]'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            title={previewMode ? 'Edit Mode' : 'Preview Mode'}
          >
            <Eye className="h-4 w-4" />
          </button>

          {isAuthenticated && (
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
              ) : (
                <Save className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="hidden sm:inline">{t('carousel.save')}</span>
            </button>
          )}

          <button
            onClick={onExport}
            disabled={exporting}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FF6B35] text-sm font-semibold text-[#0A0A0B] hover:bg-[#FF8C5A] transition-colors disabled:opacity-50"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                <span>{exportProgress}%</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t('carousel.exportPDF')}</span>
                <span className="sm:hidden">PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default CarouselHeader;
