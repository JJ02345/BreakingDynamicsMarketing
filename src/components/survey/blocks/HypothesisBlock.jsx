import React from 'react';
import { Lightbulb, Eye, EyeOff } from 'lucide-react';

const HypothesisBlock = ({ content, onChange, isEditing, isPreview }) => {
  // Preview/Response Mode - only show if showToRespondent is true
  if (isPreview || !isEditing) {
    if (!content.showToRespondent) return null;

    return (
      <div className="p-4 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-[#00D4FF] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#00D4FF] mb-1">Our Hypothesis</p>
            <p className="text-white/70">{content.hypothesis || 'Hypothesis...'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-[#00D4FF]">
        <Lightbulb className="h-5 w-5" />
        <span className="text-sm font-medium">Hypothesis (for idea validation)</span>
      </div>

      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
          Hypothesis Statement
        </label>
        <textarea
          value={content.hypothesis || ''}
          onChange={(e) => onChange({ ...content, hypothesis: e.target.value })}
          placeholder="We believe that... will result in..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00D4FF]/50 focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
          Success Metrics
        </label>
        <input
          type="text"
          value={content.metrics || ''}
          onChange={(e) => onChange({ ...content, metrics: e.target.value })}
          placeholder="e.g., >60% show interest, >40% would pay"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00D4FF]/50 focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
        <input
          type="checkbox"
          checked={content.showToRespondent}
          onChange={(e) => onChange({ ...content, showToRespondent: e.target.checked })}
          className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
        />
        <span className="flex items-center gap-2">
          {content.showToRespondent ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          Show to respondents
        </span>
      </label>

      {!content.showToRespondent && (
        <p className="text-xs text-white/40 italic">
          This hypothesis is for your reference and won't be shown to respondents.
        </p>
      )}
    </div>
  );
};

export default HypothesisBlock;
