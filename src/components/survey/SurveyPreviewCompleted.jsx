import React from 'react';
import { X, CheckCircle, BarChart3 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SurveyPreviewCompleted = ({ survey, onClose, onNewResponse, onShowResults }) => {
  const { language } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0B] flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="w-9" />
        <h2 className="font-['Syne'] font-bold">{survey.title}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h2 className="font-['Syne'] text-2xl font-bold mb-3">
          {language === 'de' ? 'Vielen Dank!' : 'Thank You!'}
        </h2>
        <p className="text-white/60 text-center max-w-sm mb-8">
          {survey.settings?.thankYouMessage || (language === 'de' ? 'Ihre Antwort wurde gespeichert.' : 'Your response has been saved.')}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onNewResponse}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            {language === 'de' ? 'Neue Antwort' : 'New Response'}
          </button>
          <button
            onClick={onShowResults}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00D4FF] text-white hover:opacity-90 transition-opacity"
          >
            <BarChart3 className="h-4 w-4" />
            {language === 'de' ? 'Ergebnisse' : 'View Results'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyPreviewCompleted;
