import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, Sparkles, Layout, BarChart3, MessageSquare, Zap, Target, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../lib/AuthContext';

const CAROUSEL_DRAFT_KEY = 'carousel_draft';

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

const CarouselTemplates = ({ onSelectTemplate, onOpenAI, onResumeDraft }) => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const isDE = language === 'de';
  const [hasDraft, setHasDraft] = useState(false);
  const [draftInfo, setDraftInfo] = useState(null);

  // Check for existing draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CAROUSEL_DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.slides && draft.slides.length > 0) {
          setHasDraft(true);
          setDraftInfo({
            title: draft.title || (isDE ? 'Unbenannt' : 'Untitled'),
            slideCount: draft.slides.length,
            lastModified: draft.lastModified ? new Date(draft.lastModified).toLocaleString(isDE ? 'de-DE' : 'en-US') : null
          });
        }
      }
    } catch (e) {
      console.error('Failed to check draft:', e);
    }
  }, [isDE]);

  const handleResumeDraft = () => {
    if (onResumeDraft) {
      onResumeDraft();
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem(CAROUSEL_DRAFT_KEY);
    setHasDraft(false);
    setDraftInfo(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]">
        <div className="flex h-14 items-center px-6 max-w-7xl mx-auto">
          {/* Left: Home */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
            >
              <Home className="h-4 w-4 text-[#FF6B35] flex-shrink-0" />
              <span className="text-sm font-medium text-white hidden sm:inline">
                {isDE ? 'Startseite' : 'Home'}
              </span>
            </Link>
          </div>

          {/* Center: Title */}
          <div className="flex-1 flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 text-[#FF6B35] flex-shrink-0" />
            <span className="font-['Syne'] font-bold text-sm sm:text-base">
              LinkedIn Carousel
            </span>
          </div>

          {/* Right: Spacer for balance */}
          <div className="w-20 sm:w-24 flex-shrink-0" />
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

        {/* Resume Draft - Show if draft exists */}
        {hasDraft && draftInfo && (
          <div className="w-full p-5 rounded-2xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/5 border border-[#FF6B35]/30 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/20 border border-[#FF6B35]/40 flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-[#FF6B35]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">
                  {isDE ? 'Entwurf fortsetzen' : 'Resume Draft'}
                </h3>
                <p className="text-sm text-white/50">
                  {draftInfo.title} • {draftInfo.slideCount} Slides
                  {draftInfo.lastModified && (
                    <span className="text-white/30"> • {draftInfo.lastModified}</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearDraft}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 hover:text-white/70 transition-colors"
                >
                  {isDE ? 'Verwerfen' : 'Discard'}
                </button>
                <button
                  onClick={handleResumeDraft}
                  className="px-4 py-1.5 rounded-lg bg-[#FF6B35] text-[#0A0A0B] text-sm font-semibold hover:bg-[#FF8C5A] transition-colors"
                >
                  {isDE ? 'Fortsetzen' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blank Template - Full Width at Top */}
        <button
          onClick={() => onSelectTemplate('blank')}
          className="w-full p-5 rounded-2xl bg-[#1A1A1D] border border-white/10 hover:border-[#FF6B35]/50 transition-all group text-left mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6 text-[#FF6B35]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1 group-hover:text-[#FF6B35] transition-colors">
                {isDE ? 'Eigenes Design' : 'Custom Design'}
              </h3>
              <p className="text-sm text-white/40">
                {isDE ? 'Starte mit Basis-Elementen und gestalte frei' : 'Start with basic elements and design freely'}
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-[#FF6B35] text-sm font-medium group-hover:bg-[#FF6B35]/20 transition-colors">
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
                  className="p-5 rounded-2xl bg-[#1A1A1D] border border-white/10 hover:border-white/20 transition-all group text-left"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0"
                      style={{
                        background: `${template.color}15`,
                        border: `1px solid ${template.color}30`,
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: template.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1 group-hover:text-[#FF6B35] transition-colors">
                        {isDE ? template.nameDE : template.name}
                      </h3>
                      <p className="text-sm text-white/40">
                        {isDE ? template.descriptionDE : template.description}
                      </p>
                      <p className="text-xs text-white/30 mt-2">
                        {template.slides} Slides
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        {/* AI Generator - small button at bottom */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={onOpenAI}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#FF6B35]/30 hover:bg-white/[0.08] transition-all text-sm text-white/60 hover:text-white"
          >
            <Sparkles className="h-4 w-4 text-[#FF6B35]" />
            <span>{isDE ? 'Mit KI generieren' : 'Generate with AI'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { CAROUSEL_PRESETS };
export default CarouselTemplates;
