import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Sparkles, AlertTriangle, Lightbulb, Target, ThumbsUp, FileText, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../lib/AuthContext';
import { SURVEY_TEMPLATES } from '../../utils/surveyTemplates';

const TEMPLATE_ICONS = {
  problemValidation: AlertTriangle,
  ideaValidation: Lightbulb,
  marketResearch: Target,
  quickFeedback: ThumbsUp,
  blank: FileText,
};

const OnlineSurveyTemplates = ({ onSelectTemplate, onOpenAI }) => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const isDE = language === 'de';

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
          >
            <Home className="h-4 w-4 text-[#00D4FF]" />
            <span className="text-sm font-medium text-white">
              {isAuthenticated ? 'Dashboard' : (isDE ? 'Zurück' : 'Back')}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#00D4FF]" />
            <span className="font-['Syne'] font-bold">
              {isDE ? 'Online Umfrage' : 'Online Survey'}
            </span>
          </div>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="font-['Syne'] text-4xl sm:text-5xl font-bold mb-4">
            {isDE ? 'Erstelle deine' : 'Create your'}
            <span className="text-[#00D4FF]"> {isDE ? 'Online Umfrage' : 'Online Survey'}</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {isDE
              ? 'Wähle eine Vorlage und passe sie nach deinen Bedürfnissen an'
              : 'Choose a template and customize it to your needs'}
          </p>
        </div>

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
                {isDE ? 'Leere Umfrage' : 'Blank Survey'}
              </h3>
              <p className="text-sm text-white/50">
                {isDE
                  ? 'Starte mit einer leeren Umfrage und füge eigene Fragen hinzu'
                  : 'Start with an empty survey and add your own questions'}
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] font-medium group-hover:bg-[#00D4FF]/20 transition-colors">
              {isDE ? 'Starten' : 'Start'}
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-sm">{isDE ? 'oder wähle eine Vorlage' : 'or choose a template'}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Template Grid - without blank */}
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(SURVEY_TEMPLATES)
            .filter(([id]) => id !== 'blank')
            .map(([id, template]) => {
              const Icon = TEMPLATE_ICONS[id] || FileText;
              return (
                <button
                  key={id}
                  onClick={() => onSelectTemplate(id)}
                  className="p-6 rounded-2xl bg-[#1A1A1D] border border-white/10 hover:border-white/20 transition-all group text-left"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{
                        background: `${template.color}15`,
                        border: `1px solid ${template.color}30`,
                      }}
                    >
                      <Icon className="h-6 w-6" style={{ color: template.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1 group-hover:text-[#00D4FF] transition-colors">
                        {isDE ? template.nameDE : template.name}
                      </h3>
                      <p className="text-sm text-white/40">
                        {isDE ? template.descriptionDE : template.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-sm">{isDE ? 'oder' : 'or'}</span>
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
                {isDE ? 'KI-Unterstützung' : 'AI Assistance'}
              </h2>
              <p className="text-sm text-white/40">
                {isDE ? 'Lass dir bei der Erstellung helfen' : 'Get help creating your survey'}
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
                {isDE ? 'Fragen generieren lassen' : 'Generate questions'}
              </h3>
              <p className="text-sm text-white/40">
                {isDE
                  ? 'Beschreibe deine Hypothese und erhalte Fragen-Vorschläge'
                  : 'Describe your hypothesis and get question suggestions'}
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-sm font-medium">
              {isDE ? 'Starten' : 'Start'}
            </div>
          </div>
        </button>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-white/30 text-sm">
            {isDE
              ? 'Du behältst immer die volle Kontrolle. Die KI unterstützt dich nur bei Bedarf.'
              : 'You always keep full control. AI only assists when needed.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnlineSurveyTemplates;
