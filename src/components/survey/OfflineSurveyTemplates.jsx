import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, Trash2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SURVEY_TEMPLATES } from '../../utils/surveyTemplates';

const OfflineSurveyTemplates = ({
  savedSurveys,
  onSelectTemplate,
  onLoadSurvey,
  onDeleteSurvey,
  onOpenAI,
}) => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
            >
              <Home className="h-4 w-4 text-[#00D4FF]" />
              <span className="text-sm font-medium text-white">
                {language === 'de' ? 'Startseite' : 'Home'}
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0A66C2]">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-['Syne'] font-bold">
                {language === 'de' ? 'Offline Umfragen' : 'Offline Surveys'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Saved Surveys */}
        {savedSurveys.length > 0 && (
          <div className="mb-12">
            <h2 className="font-['Syne'] text-2xl font-bold mb-6">
              {language === 'de' ? 'Gespeicherte Umfragen' : 'Saved Surveys'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedSurveys.map((saved) => (
                <div
                  key={saved.id}
                  className="group relative p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <button
                    onClick={() => onLoadSurvey(saved)}
                    className="w-full text-left"
                  >
                    <h3 className="font-semibold text-white mb-1">{saved.title}</h3>
                    <p className="text-sm text-white/40">
                      {saved.blocks.length} {language === 'de' ? 'Blöcke' : 'blocks'}
                    </p>
                    <p className="text-xs text-white/30 mt-2">
                      {new Date(saved.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSurvey(saved.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blank Survey - Full Width at Top */}
        <button
          onClick={() => onSelectTemplate('blank')}
          className="w-full p-6 rounded-2xl bg-gradient-to-r from-[#1A1A1D] to-[#1A1A1D]/80 border-2 border-dashed border-white/20 hover:border-[#00D4FF]/50 transition-all group text-left mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-7 w-7 text-[#00D4FF]" />
            </div>
            <div className="flex-1">
              <h3 className="font-['Syne'] text-lg font-bold text-white mb-1 group-hover:text-[#00D4FF] transition-colors">
                {language === 'de' ? 'Leere Umfrage' : 'Blank Survey'}
              </h3>
              <p className="text-sm text-white/50">
                {language === 'de'
                  ? 'Starte mit einer leeren Umfrage und füge eigene Fragen hinzu'
                  : 'Start with an empty survey and add your own questions'}
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] font-medium group-hover:bg-[#00D4FF]/20 transition-colors">
              {language === 'de' ? 'Starten' : 'Start'}
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-sm">{language === 'de' ? 'oder wähle eine Vorlage' : 'or choose a template'}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(SURVEY_TEMPLATES)
            .filter(([key]) => key !== 'blank')
            .map(([key, template]) => {
              const Icon = template.icon;
              return (
                <button
                  key={key}
                  onClick={() => onSelectTemplate(key)}
                  className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${template.color}10 0%, transparent 50%)`,
                    }}
                  />
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{
                        background: `${template.color}15`,
                        border: `1px solid ${template.color}30`,
                      }}
                    >
                      <Icon className="h-6 w-6" style={{ color: template.color }} />
                    </div>
                    <h3 className="font-['Syne'] text-lg font-bold mb-2">
                      {language === 'de' ? template.nameDE : template.name}
                    </h3>
                    <p className="text-sm text-white/50">
                      {language === 'de' ? template.descriptionDE : template.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
                      <span>{template.defaultBlocks.length} blocks</span>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        {/* Divider */}
        {onOpenAI && (
          <>
            <div className="flex items-center gap-4 my-10">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-sm">{language === 'de' ? 'oder' : 'or'}</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Section: KI-Unterstützung */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-[#00D4FF]" />
                </div>
                <div>
                  <h2 className="font-['Syne'] text-xl font-bold text-white">
                    {language === 'de' ? 'KI-Unterstützung' : 'AI Assistance'}
                  </h2>
                  <p className="text-sm text-white/40">
                    {language === 'de' ? 'Lass dir bei der Erstellung helfen' : 'Get help creating your survey'}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Generator Card */}
            <button
              onClick={onOpenAI}
              className="w-full p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#00D4FF]/30 transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D4FF]/20 to-[#0A66C2]/20 border border-[#00D4FF]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-[#00D4FF]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-[#00D4FF] transition-colors">
                    {language === 'de' ? 'Fragen generieren lassen' : 'Generate questions'}
                  </h3>
                  <p className="text-sm text-white/40">
                    {language === 'de'
                      ? 'Beschreibe deine Hypothese und erhalte Fragen-Vorschläge'
                      : 'Describe your hypothesis and get question suggestions'}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-sm font-medium">
                  {language === 'de' ? 'Starten' : 'Start'}
                </div>
              </div>
            </button>
          </>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-white/30 text-sm">
            {language === 'de'
              ? 'Du behältst immer die volle Kontrolle. Die KI unterstützt dich nur bei Bedarf.'
              : 'You always keep full control. AI only assists when needed.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflineSurveyTemplates;
