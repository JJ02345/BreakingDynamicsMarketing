import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const OfflineSurveySettingsPanel = ({ survey, onUpdate }) => {
  const { language } = useLanguage();

  const updateSetting = (key, value) => {
    onUpdate({
      ...survey,
      settings: { ...survey.settings, [key]: value },
    });
  };

  return (
    <aside className="w-80 border-l border-white/5 h-[calc(100vh-4rem)] overflow-y-auto p-4 bg-[#0A0A0B]">
      <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
        {language === 'de' ? 'Umfrage-Einstellungen' : 'Survey Settings'}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
            {language === 'de' ? 'Titel' : 'Title'}
          </label>
          <input
            type="text"
            value={survey?.title || ''}
            onChange={(e) => onUpdate({ ...survey, title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#00D4FF]/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
            {language === 'de' ? 'Beschreibung' : 'Description'}
          </label>
          <textarea
            value={survey?.description || ''}
            onChange={(e) => onUpdate({ ...survey, description: e.target.value })}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#00D4FF]/50 focus:outline-none resize-none"
          />
        </div>

        <div className="space-y-3 pt-4 border-t border-white/10">
          <label className="flex items-center gap-3 text-sm text-white/60 cursor-pointer">
            <input
              type="checkbox"
              checked={survey?.settings?.showProgressBar}
              onChange={(e) => updateSetting('showProgressBar', e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
            />
            {language === 'de' ? 'Fortschrittsbalken anzeigen' : 'Show progress bar'}
          </label>

          <label className="flex items-center gap-3 text-sm text-white/60 cursor-pointer">
            <input
              type="checkbox"
              checked={survey?.settings?.allowBack}
              onChange={(e) => updateSetting('allowBack', e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
            />
            {language === 'de' ? 'Zurück-Navigation erlauben' : 'Allow back navigation'}
          </label>

          <label className="flex items-center gap-3 text-sm text-white/60 cursor-pointer">
            <input
              type="checkbox"
              checked={survey?.settings?.shuffleQuestions}
              onChange={(e) => updateSetting('shuffleQuestions', e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
            />
            {language === 'de' ? 'Fragen mischen' : 'Shuffle questions'}
          </label>
        </div>

        <div className="pt-4 border-t border-white/10">
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
            {language === 'de' ? 'Danke-Nachricht' : 'Thank You Message'}
          </label>
          <textarea
            value={survey?.settings?.thankYouMessage || ''}
            onChange={(e) => updateSetting('thankYouMessage', e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#00D4FF]/50 focus:outline-none resize-none"
          />
        </div>
      </div>
    </aside>
  );
};

export default OfflineSurveySettingsPanel;
