import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, Sparkles, Layout, BarChart3, MessageSquare, Zap, Target } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../lib/AuthContext';

// Carousel preset templates
const CAROUSEL_PRESETS = {
  optionComparison: {
    id: 'optionComparison',
    name: 'Option A vs B',
    nameDE: 'Option A vs B',
    description: 'Compare two options with pros and cons',
    descriptionDE: 'Vergleiche zwei Optionen mit Vor- und Nachteilen',
    icon: Layout,
    color: '#FF6B35',
    slides: 5
  },
  storySelling: {
    id: 'storySelling',
    name: 'Story Selling',
    nameDE: 'Story Selling',
    description: 'Tell a compelling story in slides',
    descriptionDE: 'Erzähle eine fesselnde Geschichte',
    icon: MessageSquare,
    color: '#00D4FF',
    slides: 6
  },
  statsShowcase: {
    id: 'statsShowcase',
    name: 'Stats & Numbers',
    nameDE: 'Statistiken & Zahlen',
    description: 'Present impressive statistics',
    descriptionDE: 'Präsentiere beeindruckende Statistiken',
    icon: BarChart3,
    color: '#00E676',
    slides: 4
  },
  tipsList: {
    id: 'tipsList',
    name: 'Tips & Tricks',
    nameDE: 'Tipps & Tricks',
    description: 'Share valuable tips with your audience',
    descriptionDE: 'Teile wertvolle Tipps mit deinem Publikum',
    icon: Target,
    color: '#FF9500',
    slides: 5
  },
  blank: {
    id: 'blank',
    name: 'Blank Carousel',
    nameDE: 'Leeres Carousel',
    description: 'Start from scratch',
    descriptionDE: 'Von Grund auf neu erstellen',
    icon: FileText,
    color: '#888888',
    slides: 1
  }
};

const CarouselTemplates = ({ onSelectTemplate, onOpenAI }) => {
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
            <Home className="h-4 w-4 text-[#FF6B35]" />
            <span className="text-sm font-medium text-white">
              {isAuthenticated ? 'Dashboard' : (isDE ? 'Zurück' : 'Back')}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#FF6B35]" />
            <span className="font-['Syne'] font-bold">
              {isDE ? 'LinkedIn Carousel' : 'LinkedIn Carousel'}
            </span>
          </div>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="font-['Syne'] text-4xl sm:text-5xl font-bold mb-4">
            {isDE ? 'Erstelle dein' : 'Create your'}
            <span className="text-[#FF6B35]"> LinkedIn Carousel</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {isDE
              ? 'Wähle eine Vorlage und passe sie nach deinen Bedürfnissen an'
              : 'Choose a template and customize it to your needs'}
          </p>
        </div>

        {/* Blank Carousel - Full Width at Top */}
        <button
          onClick={() => onSelectTemplate('blank')}
          className="w-full p-6 rounded-2xl bg-gradient-to-r from-[#1A1A1D] to-[#1A1A1D]/80 border-2 border-dashed border-white/20 hover:border-[#FF6B35]/50 transition-all group text-left mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-7 w-7 text-[#FF6B35]" />
            </div>
            <div className="flex-1">
              <h3 className="font-['Syne'] text-lg font-bold text-white mb-1 group-hover:text-[#FF6B35] transition-colors">
                {isDE ? 'Leeres Carousel' : 'Blank Carousel'}
              </h3>
              <p className="text-sm text-white/50">
                {isDE
                  ? 'Starte mit einem leeren Carousel und füge eigene Slides hinzu'
                  : 'Start with an empty carousel and add your own slides'}
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-[#FF6B35] font-medium group-hover:bg-[#FF6B35]/20 transition-colors">
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
          {Object.entries(CAROUSEL_PRESETS)
            .filter(([id]) => id !== 'blank')
            .map(([id, template]) => {
              const Icon = template.icon;
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
                      <h3 className="font-semibold text-white mb-1 group-hover:text-[#FF6B35] transition-colors">
                        {isDE ? template.nameDE : template.name}
                      </h3>
                      <p className="text-sm text-white/40">
                        {isDE ? template.descriptionDE : template.description}
                      </p>
                      <p className="text-xs text-white/30 mt-2">
                        {template.slides} {isDE ? 'Slides' : 'Slides'}
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
            <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#FF6B35]" />
            </div>
            <div>
              <h2 className="font-['Syne'] text-xl font-bold text-white">
                {isDE ? 'KI-Unterstützung' : 'AI Assistance'}
              </h2>
              <p className="text-sm text-white/40">
                {isDE ? 'Lass dir bei der Erstellung helfen' : 'Get help creating your carousel'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Generator Card */}
        <button
          onClick={onOpenAI}
          className="w-full p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#FF6B35]/30 transition-all group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8C5A]/20 border border-[#FF6B35]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6 text-[#FF6B35]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1 group-hover:text-[#FF6B35] transition-colors">
                {isDE ? 'Carousel generieren lassen' : 'Generate carousel'}
              </h3>
              <p className="text-sm text-white/40">
                {isDE
                  ? 'Beschreibe dein Thema und erhalte ein fertiges Carousel'
                  : 'Describe your topic and get a complete carousel'}
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-[#FF6B35] text-sm font-medium">
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

export { CAROUSEL_PRESETS };
export default CarouselTemplates;
