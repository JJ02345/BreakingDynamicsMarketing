import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, Sparkles, Layout, BarChart3, MessageSquare, Zap, Target, RotateCcw, HelpCircle, BookOpen, TrendingUp, Users, Lightbulb, Award, GitCompare, Clock, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../lib/AuthContext';

const CAROUSEL_DRAFT_KEY = 'carousel_draft';

// Carousel preset templates - erweitert mit mehr Optionen
const CAROUSEL_PRESETS = {
  // === KREATIV / LEER ===
  blank: {
    id: 'blank',
    name: 'Start Fresh',
    nameDE: 'Leer starten',
    description: 'Complete creative freedom',
    descriptionDE: 'Volle kreative Freiheit',
    icon: FileText,
    color: '#FF6B35',
    category: 'creative',
    slides: 1
  },

  // === TIPPS & WISSEN ===
  tipsList: {
    id: 'tipsList',
    name: '5 Tips That Work',
    nameDE: '5 Tipps die funktionieren',
    description: 'Share actionable tips your audience can use today',
    descriptionDE: 'Teile Tipps die dein Publikum sofort umsetzen kann',
    icon: Lightbulb,
    color: '#FF9500',
    category: 'educational',
    slides: 7,
    preview: ['Hook', 'Tipp 1', 'Tipp 2', 'Tipp 3', 'Tipp 4', 'Tipp 5', 'CTA']
  },
  howToGuide: {
    id: 'howToGuide',
    name: 'How-To Guide',
    nameDE: 'Schritt-für-Schritt',
    description: 'Explain a process step by step',
    descriptionDE: 'Erkläre einen Prozess Schritt für Schritt',
    icon: BookOpen,
    color: '#8B5CF6',
    category: 'educational',
    slides: 6,
    preview: ['Intro', 'Step 1', 'Step 2', 'Step 3', 'Result', 'CTA']
  },
  mythVsReality: {
    id: 'mythVsReality',
    name: 'Myth vs. Reality',
    nameDE: 'Mythos vs. Realität',
    description: 'Bust common myths in your industry',
    descriptionDE: 'Räume mit Mythen in deiner Branche auf',
    icon: HelpCircle,
    color: '#EF4444',
    category: 'educational',
    slides: 6,
    preview: ['Hook', 'Mythos 1', 'Wahrheit 1', 'Mythos 2', 'Wahrheit 2', 'CTA']
  },

  // === VERGLEICH & ENTSCHEIDUNG ===
  optionComparison: {
    id: 'optionComparison',
    name: 'This vs. That',
    nameDE: 'Dies vs. Das',
    description: 'Compare two options clearly',
    descriptionDE: 'Vergleiche zwei Optionen klar',
    icon: GitCompare,
    color: '#3B82F6',
    category: 'comparison',
    slides: 5,
    preview: ['Hook', 'Option A', 'Option B', 'Vergleich', 'CTA']
  },
  beforeAfter: {
    id: 'beforeAfter',
    name: 'Before → After',
    nameDE: 'Vorher → Nachher',
    description: 'Show transformation and results',
    descriptionDE: 'Zeige Transformation und Ergebnisse',
    icon: TrendingUp,
    color: '#10B981',
    category: 'comparison',
    slides: 5,
    preview: ['Hook', 'Vorher', 'Der Weg', 'Nachher', 'CTA']
  },

  // === STORYTELLING ===
  storySelling: {
    id: 'storySelling',
    name: 'My Journey',
    nameDE: 'Meine Reise',
    description: 'Share your personal story authentically',
    descriptionDE: 'Teile deine persönliche Geschichte authentisch',
    icon: Heart,
    color: '#EC4899',
    category: 'storytelling',
    slides: 6,
    preview: ['Hook', 'Anfang', 'Challenge', 'Wendepunkt', 'Heute', 'CTA']
  },
  lessonsLearned: {
    id: 'lessonsLearned',
    name: 'Lessons Learned',
    nameDE: 'Was ich gelernt habe',
    description: 'Share insights from your experience',
    descriptionDE: 'Teile Erkenntnisse aus deiner Erfahrung',
    icon: Award,
    color: '#F59E0B',
    category: 'storytelling',
    slides: 6,
    preview: ['Hook', 'Kontext', 'Lesson 1', 'Lesson 2', 'Lesson 3', 'CTA']
  },

  // === ZAHLEN & FAKTEN ===
  statsShowcase: {
    id: 'statsShowcase',
    name: 'Stats That Shock',
    nameDE: 'Zahlen die überraschen',
    description: 'Present data that makes people stop',
    descriptionDE: 'Präsentiere Daten die aufhorchen lassen',
    icon: BarChart3,
    color: '#06B6D4',
    category: 'data',
    slides: 5,
    preview: ['Hook', 'Stat 1', 'Stat 2', 'Stat 3', 'CTA']
  },

  // === ENGAGEMENT ===
  unpopularOpinion: {
    id: 'unpopularOpinion',
    name: 'Unpopular Opinion',
    nameDE: 'Unpopuläre Meinung',
    description: 'Share a controversial take that sparks discussion',
    descriptionDE: 'Teile eine kontroverse Meinung die Diskussion auslöst',
    icon: MessageSquare,
    color: '#DC2626',
    category: 'engagement',
    slides: 5,
    preview: ['Hook', 'Meinung', 'Warum', 'Beweis', 'CTA']
  },
  aboutMe: {
    id: 'aboutMe',
    name: 'About Me',
    nameDE: 'Über Mich',
    description: 'Introduce yourself to new followers',
    descriptionDE: 'Stelle dich neuen Followern vor',
    icon: Users,
    color: '#0EA5E9',
    category: 'personal',
    slides: 6,
    preview: ['Hook', 'Wer', 'Was', 'Warum', 'Fun Fact', 'CTA']
  }
};

// Kategorien für Gruppierung
const TEMPLATE_CATEGORIES = {
  creative: { name: 'Creative', nameDE: 'Kreativ', order: 0 },
  educational: { name: 'Educational', nameDE: 'Wissen teilen', order: 1 },
  comparison: { name: 'Comparison', nameDE: 'Vergleichen', order: 2 },
  storytelling: { name: 'Storytelling', nameDE: 'Geschichten', order: 3 },
  data: { name: 'Data & Facts', nameDE: 'Zahlen & Fakten', order: 4 },
  engagement: { name: 'Engagement', nameDE: 'Engagement', order: 5 },
  personal: { name: 'Personal Brand', nameDE: 'Personal Brand', order: 6 }
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

        {/* Blank Template - Full Width at Top - MOST PROMINENT */}
        <button
          onClick={() => onSelectTemplate('blank')}
          className="w-full p-6 rounded-2xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C5A]/5 border-2 border-[#FF6B35]/30 hover:border-[#FF6B35] transition-all group text-left mb-8"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#FF6B35] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#FF6B35]/20">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-['Syne'] font-bold text-xl text-white mb-1 group-hover:text-[#FF6B35] transition-colors">
                {isDE ? 'Leer starten' : 'Start Fresh'}
              </h3>
              <p className="text-sm text-white/50">
                {isDE ? 'Volle kreative Freiheit – baue dein Carousel von Grund auf' : 'Full creative freedom – build your carousel from scratch'}
              </p>
            </div>
            <div className="px-5 py-2.5 rounded-xl bg-[#FF6B35] text-white text-sm font-semibold group-hover:bg-[#FF8C5A] transition-colors shadow-lg shadow-[#FF6B35]/20">
              {isDE ? 'Los geht\'s' : 'Let\'s go'}
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/40 text-sm font-medium">{isDE ? 'oder lass dich inspirieren' : 'or get inspired'}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Templates by Category */}
        {Object.entries(TEMPLATE_CATEGORIES)
          .filter(([catId]) => catId !== 'creative') // Skip creative (blank is above)
          .sort((a, b) => a[1].order - b[1].order)
          .map(([catId, category]) => {
            const categoryTemplates = Object.entries(CAROUSEL_PRESETS)
              .filter(([, t]) => t.category === catId);

            if (categoryTemplates.length === 0) return null;

            return (
              <div key={catId} className="mb-8">
                {/* Category Header */}
                <h3 className="text-sm font-semibold text-white/30 uppercase tracking-wider mb-3 px-1">
                  {isDE ? category.nameDE : category.name}
                </h3>

                {/* Templates Grid */}
                <div className="grid gap-3 md:grid-cols-2">
                  {categoryTemplates.map(([id, template]) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={id}
                        onClick={() => onSelectTemplate(id)}
                        className="p-4 rounded-xl bg-[#1A1A1D] border border-white/10 hover:border-white/20 hover:bg-[#1A1A1D]/80 transition-all group text-left"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0"
                            style={{
                              background: `${template.color}15`,
                              border: `1px solid ${template.color}30`,
                            }}
                          >
                            <Icon className="h-5 w-5" style={{ color: template.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white group-hover:text-[#FF6B35] transition-colors">
                                {isDE ? template.nameDE : template.name}
                              </h4>
                              <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
                                {template.slides} Slides
                              </span>
                            </div>
                            <p className="text-xs text-white/40 line-clamp-2">
                              {isDE ? template.descriptionDE : template.description}
                            </p>
                            {/* Preview Tags */}
                            {template.preview && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {template.preview.slice(0, 4).map((step, i) => (
                                  <span key={i} className="text-[9px] text-white/25 bg-white/5 px-1.5 py-0.5 rounded">
                                    {step}
                                  </span>
                                ))}
                                {template.preview.length > 4 && (
                                  <span className="text-[9px] text-white/25">+{template.preview.length - 4}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

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
