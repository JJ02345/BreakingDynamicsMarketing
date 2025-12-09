import React, { useState } from 'react';
import { X, Sparkles, Loader2, Zap, MessageSquare, List, GitCompare, HelpCircle, ChevronRight, Wand2, BookOpen, TrendingUp, Target } from 'lucide-react';
import { generateCarouselFromHypothesis, getCarouselPatterns } from '../../lib/aiCarouselGenerator';
import { useLanguage } from '../../context/LanguageContext';

const PATTERN_CONFIG = {
  problem_solution: {
    icon: Zap,
    color: '#FF6B35',
    gradient: 'from-orange-500/20 to-red-500/20',
    description: { de: 'Problem aufzeigen, Lösung präsentieren', en: 'Show problem, present solution' }
  },
  listicle: {
    icon: List,
    color: '#10B981',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    description: { de: 'Tipps & Tricks als Liste', en: 'Tips & tricks as a list' }
  },
  story: {
    icon: BookOpen,
    color: '#8B5CF6',
    gradient: 'from-violet-500/20 to-purple-500/20',
    description: { de: 'Fesselnde Geschichte erzählen', en: 'Tell an engaging story' }
  },
  comparison: {
    icon: GitCompare,
    color: '#3B82F6',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    description: { de: 'Optionen gegenüberstellen', en: 'Compare options side by side' }
  },
  myth_busting: {
    icon: Target,
    color: '#EF4444',
    gradient: 'from-red-500/20 to-pink-500/20',
    description: { de: 'Mythen entlarven & aufklären', en: 'Bust myths & educate' }
  }
};

const AIGeneratorModal = ({ isOpen, onClose, onGenerated }) => {
  const { t, language } = useLanguage();
  const isDE = language === 'de';
  const [hypothesis, setHypothesis] = useState('');
  const [pattern, setPattern] = useState('problem_solution');
  const [slideCount, setSlideCount] = useState(5);
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ stage: '', percentage: 0 });
  const [error, setError] = useState('');

  const patterns = getCarouselPatterns();

  const handleGenerate = async () => {
    if (!hypothesis.trim()) {
      setError(t('aiGenerator.errorEmpty'));
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const result = await generateCarouselFromHypothesis({
        hypothesis: hypothesis.trim(),
        pattern,
        slideCount,
        tone,
        language: 'en', // Always generate in English - user can change in editor
        onProgress: setProgress
      });

      onGenerated(result);
      onClose();
      resetForm();
    } catch (err) {
      setError(err.message || t('aiGenerator.errorGeneric'));
    } finally {
      setIsGenerating(false);
      setProgress({ stage: '', percentage: 0 });
    }
  };

  const resetForm = () => {
    setHypothesis('');
    setPattern('problem_solution');
    setSlideCount(5);
    setTone('professional');
    setError('');
  };

  const getProgressText = () => {
    switch (progress.stage) {
      case 'analyzing': return t('aiGenerator.progressAnalyzing');
      case 'generating': return t('aiGenerator.progressGenerating');
      case 'formatting': return t('aiGenerator.progressFormatting');
      case 'complete': return t('aiGenerator.progressComplete');
      default: return t('aiGenerator.progressStarting');
    }
  };

  const getPatternName = (patternId) => {
    const patternMap = {
      problem_solution: t('aiGenerator.patternProblemSolution'),
      listicle: t('aiGenerator.patternListicle'),
      story: t('aiGenerator.patternStory'),
      comparison: t('aiGenerator.patternComparison'),
      myth_busting: t('aiGenerator.patternMythBusting'),
    };
    return patternMap[patternId] || patternId;
  };

  const toneOptions = [
    { id: 'professional', label: t('aiGenerator.toneProfessional'), emoji: '👔', color: '#3B82F6' },
    { id: 'casual', label: t('aiGenerator.toneCasual'), emoji: '😊', color: '#10B981' },
    { id: 'provocative', label: t('aiGenerator.toneProvocative'), emoji: '🔥', color: '#EF4444' },
  ];

  // Quick topic suggestions
  const quickTopics = isDE
    ? ['5 LinkedIn-Tipps', 'Produktivitäts-Hacks', 'Karriere-Mythen', 'Remote Work vs. Büro']
    : ['5 LinkedIn Tips', 'Productivity Hacks', 'Career Myths', 'Remote vs. Office'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl mx-4 bg-gradient-to-b from-[#1A1A1D] to-[#141416] rounded-3xl border border-white/10 shadow-2xl shadow-black/50 animate-scale-in overflow-hidden">
        {/* Header - Premium Design */}
        <div className="relative p-6 border-b border-white/5">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/10 via-purple-500/5 to-transparent" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35]/20 blur-3xl rounded-full" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FF6B35] blur-xl opacity-50" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center shadow-lg shadow-[#FF6B35]/30">
                  <Wand2 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t('aiGenerator.title')}</h2>
                <p className="text-sm text-white/50">{t('aiGenerator.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Hypothesis Input - Enhanced */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Sparkles className="h-4 w-4 text-[#FF6B35]" />
              {t('aiGenerator.hypothesisLabel')}
            </label>
            <div className="relative">
              <textarea
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                placeholder={t('aiGenerator.hypothesisPlaceholder')}
                className="w-full h-28 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:border-[#FF6B35]/50 focus:ring-2 focus:ring-[#FF6B35]/20 focus:outline-none resize-none transition-all"
                disabled={isGenerating}
              />
              <div className="absolute bottom-3 right-3">
                <span className={`text-xs px-2 py-1 rounded-full ${hypothesis.length >= 10 ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}>
                  {hypothesis.length}/10+
                </span>
              </div>
            </div>

            {/* Quick Topics */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setHypothesis(topic)}
                  disabled={isGenerating}
                  className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all disabled:opacity-50"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Selection - Card Style */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <TrendingUp className="h-4 w-4 text-[#FF6B35]" />
              {t('aiGenerator.structureLabel')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.keys(patterns).map((id) => {
                const config = PATTERN_CONFIG[id] || { icon: Zap, color: '#FF6B35', gradient: 'from-orange-500/20 to-red-500/20' };
                const Icon = config.icon;
                const isSelected = pattern === id;

                return (
                  <button
                    key={id}
                    onClick={() => setPattern(id)}
                    disabled={isGenerating}
                    className={`relative p-4 rounded-2xl border-2 transition-all text-left overflow-hidden group ${
                      isSelected
                        ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    } disabled:opacity-50`}
                  >
                    {/* Glow effect on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all ${
                          isSelected ? 'bg-[#FF6B35]/20' : 'bg-white/5 group-hover:bg-white/10'
                        }`}
                        style={{ color: isSelected ? config.color : 'rgba(255,255,255,0.6)' }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/70'}`}>
                        {getPatternName(id)}
                      </span>
                      <p className="text-[10px] text-white/40 mt-1 line-clamp-1">
                        {config.description[isDE ? 'de' : 'en']}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slide Count - Visual Slider */}
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-white mb-3">
              <span>{t('aiGenerator.slideCountLabel')}</span>
              <span className="px-3 py-1 bg-[#FF6B35]/20 text-[#FF6B35] rounded-full text-sm font-bold">
                {slideCount} Slides
              </span>
            </label>
            <div className="relative pt-1">
              <input
                type="range"
                min="3"
                max="10"
                value={slideCount}
                onChange={(e) => setSlideCount(parseInt(e.target.value))}
                disabled={isGenerating}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${((slideCount - 3) / 7) * 100}%, rgba(255,255,255,0.1) ${((slideCount - 3) / 7) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <div className="flex justify-between text-[10px] text-white/40 mt-2">
                <span>3 ({t('aiGenerator.short')})</span>
                <span>10 ({t('aiGenerator.detailed')})</span>
              </div>
            </div>
          </div>

          {/* Tone Selection - Pill Style */}
          <div>
            <label className="text-sm font-semibold text-white mb-3 block">
              {t('aiGenerator.toneLabel')}
            </label>
            <div className="flex gap-2">
              {toneOptions.map(({ id, label, emoji, color }) => (
                <button
                  key={id}
                  onClick={() => setTone(id)}
                  disabled={isGenerating}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    tone === id
                      ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  } disabled:opacity-50`}
                >
                  <span className="text-lg">{emoji}</span>
                  <span className={`text-sm font-medium ${tone === id ? 'text-white' : 'text-white/60'}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message - Enhanced */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <X className="h-4 w-4 text-red-400" />
              </div>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Progress - Animated */}
          {isGenerating && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FF6B35]/10 to-purple-500/10 border border-[#FF6B35]/20">
              <div className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-[#FF6B35] animate-pulse" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{getProgressText()}</p>
                  <p className="text-xs text-white/50">{isDE ? 'Einen Moment Geduld...' : 'Just a moment...'}</p>
                </div>
                <span className="text-lg font-bold text-[#FF6B35]">{progress.percentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer - Enhanced */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {t('aiGenerator.cancel')}
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || hypothesis.trim().length < 10}
              className="flex-[2] px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white font-semibold hover:shadow-lg hover:shadow-[#FF6B35]/30 transition-all disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t('aiGenerator.generating')}</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  <span>{t('aiGenerator.generate')}</span>
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-white/30 mt-4">
            {t('aiGenerator.editHint')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratorModal;
