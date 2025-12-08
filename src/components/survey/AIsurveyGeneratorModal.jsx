import React, { useState } from 'react';
import { X, Sparkles, Loader2, ChevronRight, Lightbulb, Search, BarChart3, MessageSquare } from 'lucide-react';
import { generateSurveyFromHypothesis, SURVEY_TYPES } from '../../lib/aiSurveyGenerator';
import { useLanguage } from '../../context/LanguageContext';

const SURVEY_TYPE_ICONS = {
  problemValidation: Search,
  ideaValidation: Lightbulb,
  marketResearch: BarChart3,
  customerFeedback: MessageSquare
};

const AISurveyGeneratorModal = ({ isOpen, onClose, onGenerated }) => {
  const { language } = useLanguage();
  const isDE = language === 'de';

  const [hypothesis, setHypothesis] = useState('');
  const [surveyType, setSurveyType] = useState('problemValidation');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ stage: '', percentage: 0 });
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!hypothesis.trim()) {
      setError(isDE ? 'Bitte gib eine Hypothese ein.' : 'Please enter a hypothesis.');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const result = await generateSurveyFromHypothesis({
        hypothesis: hypothesis.trim(),
        surveyType,
        questionCount,
        language,
        onProgress: setProgress
      });

      onGenerated(result);
      onClose();
      resetForm();
    } catch (err) {
      setError(err.message || (isDE ? 'Fehler bei der Generierung.' : 'Error generating survey.'));
    } finally {
      setIsGenerating(false);
      setProgress({ stage: '', percentage: 0 });
    }
  };

  const resetForm = () => {
    setHypothesis('');
    setSurveyType('problemValidation');
    setQuestionCount(5);
    setError('');
  };

  const getProgressText = () => {
    const texts = isDE
      ? { analyzing: 'Analysiere Hypothese...', generating: 'Generiere Fragen...', formatting: 'Erstelle Umfrage...', complete: 'Fertig!' }
      : { analyzing: 'Analyzing hypothesis...', generating: 'Generating questions...', formatting: 'Creating survey...', complete: 'Done!' };
    return texts[progress.stage] || (isDE ? 'Starte...' : 'Starting...');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-4 bg-[#1A1A1D] rounded-2xl border border-white/10 shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-[#00D4FF]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#0A66C2] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">
                {isDE ? 'KI Umfrage Generator' : 'AI Survey Generator'}
              </h2>
              <p className="text-xs text-white/50">
                {isDE ? 'Erstelle eine Umfrage aus deiner Hypothese' : 'Create a survey from your hypothesis'}
              </p>
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
              {isDE ? 'Deine Hypothese / These' : 'Your Hypothesis / Thesis'}
            </label>
            <textarea
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder={isDE
                ? "z.B. 'Gründer verbringen zu viel Zeit mit manueller Marktforschung' oder 'Nutzer wünschen sich eine einfachere Möglichkeit, Feedback zu sammeln'"
                : "e.g. 'Founders spend too much time on manual market research' or 'Users want an easier way to collect feedback'"
              }
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-[#00D4FF]/50 focus:outline-none resize-none"
              disabled={isGenerating}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-white/40">{isDE ? 'Mind. 10 Zeichen' : 'Min. 10 characters'}</span>
              <span className={`text-xs ${hypothesis.length >= 10 ? 'text-green-400' : 'text-white/40'}`}>
                {hypothesis.length} {isDE ? 'Zeichen' : 'characters'}
              </span>
            </div>
          </div>

          {/* Survey Type Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {isDE ? 'Umfrage-Typ' : 'Survey Type'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(SURVEY_TYPES).map(([id, type]) => {
                const Icon = SURVEY_TYPE_ICONS[id] || Lightbulb;
                return (
                  <button
                    key={id}
                    onClick={() => setSurveyType(id)}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-left ${
                      surveyType === id
                        ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                    } disabled:opacity-50`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{isDE ? type.nameDE : type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {isDE ? `Anzahl Fragen: ${questionCount}` : `Question Count: ${questionCount}`}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              disabled={isGenerating}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D4FF] disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>3 ({isDE ? 'kurz' : 'short'})</span>
              <span>10 ({isDE ? 'ausführlich' : 'detailed'})</span>
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
                <span className="text-sm text-[#00D4FF]">{progress.percentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00D4FF] to-[#0A66C2] rounded-full transition-all duration-300"
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
              {isDE ? 'Abbrechen' : 'Cancel'}
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || hypothesis.trim().length < 10}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0A66C2] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isDE ? 'Generiere...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {isDE ? 'Umfrage generieren' : 'Generate Survey'}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISurveyGeneratorModal;
