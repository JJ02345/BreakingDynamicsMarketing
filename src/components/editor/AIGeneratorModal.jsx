import React, { useState } from 'react';
import { X, Sparkles, Loader2, Zap, MessageSquare, List, GitCompare, HelpCircle, ChevronRight } from 'lucide-react';
import { generateCarouselFromHypothesis, getCarouselPatterns } from '../../lib/aiCarouselGenerator';
import { useLanguage } from '../../context/LanguageContext';

const PATTERN_ICONS = {
  problem_solution: Zap,
  listicle: List,
  story: MessageSquare,
  comparison: GitCompare,
  myth_busting: HelpCircle
};

const AIGeneratorModal = ({ isOpen, onClose, onGenerated }) => {
  const { t, language } = useLanguage();
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
        language: language,
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
    { id: 'professional', label: t('aiGenerator.toneProfessional'), emoji: '👔' },
    { id: 'casual', label: t('aiGenerator.toneCasual'), emoji: '😊' },
    { id: 'provocative', label: t('aiGenerator.toneProvocative'), emoji: '🔥' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-4 bg-[#1A1A1D] rounded-2xl border border-white/10 shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-[#FF6B35]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">{t('aiGenerator.title')}</h2>
              <p className="text-xs text-white/50">{t('aiGenerator.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Hypothesis Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {t('aiGenerator.hypothesisLabel')}
            </label>
            <textarea
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder={t('aiGenerator.hypothesisPlaceholder')}
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-[#FF6B35]/50 focus:outline-none resize-none"
              disabled={isGenerating}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-white/40">{t('aiGenerator.minChars')}</span>
              <span className={`text-xs ${hypothesis.length >= 10 ? 'text-green-400' : 'text-white/40'}`}>
                {hypothesis.length} {t('aiGenerator.characters')}
              </span>
            </div>
          </div>

          {/* Pattern Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {t('aiGenerator.structureLabel')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(patterns).map((id) => {
                const Icon = PATTERN_ICONS[id] || Zap;
                return (
                  <button
                    key={id}
                    onClick={() => setPattern(id)}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-left ${
                      pattern === id
                        ? 'bg-[#FF6B35]/20 border-[#FF6B35] text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                    } disabled:opacity-50`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{getPatternName(id)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slide Count */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {t('aiGenerator.slideCountLabel')}: {slideCount}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={slideCount}
              onChange={(e) => setSlideCount(parseInt(e.target.value))}
              disabled={isGenerating}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF6B35] disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>3 ({t('aiGenerator.short')})</span>
              <span>10 ({t('aiGenerator.detailed')})</span>
            </div>
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {t('aiGenerator.toneLabel')}
            </label>
            <div className="flex gap-2">
              {toneOptions.map(({ id, label, emoji }) => (
                <button
                  key={id}
                  onClick={() => setTone(id)}
                  disabled={isGenerating}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                    tone === id
                      ? 'bg-[#FF6B35]/20 border-[#FF6B35] text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                  } disabled:opacity-50`}
                >
                  <span>{emoji}</span>
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Progress */}
          {isGenerating && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">{getProgressText()}</span>
                <span className="text-sm text-[#FF6B35]">{progress.percentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {t('aiGenerator.cancel')}
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || hypothesis.trim().length < 10}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('aiGenerator.generating')}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t('aiGenerator.generate')}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-white/30 mt-3">
            {t('aiGenerator.editHint')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratorModal;
