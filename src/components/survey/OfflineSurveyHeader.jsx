import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Settings, Download, Eye, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../lib/AuthContext';

const OfflineSurveyHeader = ({
  survey,
  isSaved,
  showSettings,
  onTitleChange,
  onBack,
  onToggleSettings,
  onExport,
  onPreview,
}) => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
          >
            <Home className="h-4 w-4 text-[#00D4FF]" />
            <span className="text-sm font-medium text-white hidden sm:inline">
              {language === 'de' ? 'Startseite' : 'Home'}
            </span>
          </Link>
          <input
            type="text"
            value={survey?.title || ''}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-transparent font-['Syne'] font-bold text-lg focus:outline-none border-b border-transparent hover:border-white/20 focus:border-[#00D4FF]/50 transition-colors px-1"
            placeholder="Survey Title..."
          />
          {isSaved && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <CheckCircle className="h-3 w-3" />
              Saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSettings}
            className={`p-2.5 rounded-lg transition-colors ${
              showSettings ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={onExport}
            className="p-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={onPreview}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#0A66C2] text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Eye className="h-4 w-4" />
            {language === 'de' ? 'Vorschau' : 'Preview'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default OfflineSurveyHeader;
