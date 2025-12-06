import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SURVEY_TEMPLATES } from '../../utils/surveyTemplates';

const OfflineSurveyTemplates = ({
  savedSurveys,
  onSelectTemplate,
  onLoadSurvey,
  onDeleteSurvey,
}) => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
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

        {/* Templates */}
        <h2 className="font-['Syne'] text-2xl font-bold mb-2">
          {language === 'de' ? 'Vorlage wählen' : 'Choose a Template'}
        </h2>
        <p className="text-white/50 mb-8">
          {language === 'de'
            ? 'Starte mit einer Vorlage für Problem- oder Ideen-Validierung'
            : 'Start with a template for problem or idea validation'}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(SURVEY_TEMPLATES).map(([key, template]) => {
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
      </div>
    </div>
  );
};

export default OfflineSurveyTemplates;
