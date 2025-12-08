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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            {isDE ? 'Mit KI-Unterstützung' : 'AI-Powered'}
          </div>
          <h1 className="font-['Syne'] text-4xl sm:text-5xl font-bold mb-4">
            {isDE ? 'Erstelle deine' : 'Create your'}
            <span className="text-[#00D4FF]"> {isDE ? 'Online Umfrage' : 'Online Survey'}</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {isDE
              ? 'Wähle eine Vorlage oder lass die KI eine Umfrage aus deiner Hypothese generieren'
              : 'Choose a template or let AI generate a survey from your hypothesis'}
          </p>
        </div>

        {/* AI Generator Card */}
        <button
          onClick={onOpenAI}
          className="w-full p-6 rounded-2xl bg-gradient-to-r from-[#00D4FF]/10 to-[#0A66C2]/10 border-2 border-dashed border-[#00D4FF]/30 hover:border-[#00D4FF]/50 transition-all group mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#0A66C2] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-['Syne'] text-xl font-bold text-white mb-1">
                {isDE ? 'Mit KI generieren' : 'Generate with AI'}
              </h3>
              <p className="text-white/50">
                {isDE
                  ? 'Beschreibe deine Hypothese und lass die KI passende Fragen erstellen'
                  : 'Describe your hypothesis and let AI create relevant questions'}
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#00D4FF] text-white font-medium group-hover:bg-[#00D4FF]/90 transition-colors">
              {isDE ? 'Starten' : 'Start'}
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-sm">{isDE ? 'oder wähle eine Vorlage' : 'or choose a template'}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Template Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(SURVEY_TEMPLATES).map(([id, template]) => {
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

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-white/30 text-sm">
            {isDE
              ? 'Alle Vorlagen sind vollständig anpassbar. Du kannst jederzeit Fragen hinzufügen, entfernen oder ändern.'
              : 'All templates are fully customizable. You can add, remove, or modify questions at any time.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnlineSurveyTemplates;
