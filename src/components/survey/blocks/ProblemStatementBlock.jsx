import React from 'react';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';

const ProblemStatementBlock = ({ content, onChange, isEditing, isPreview }) => {
  // Preview/Response Mode - only show if showToRespondent is true
  if (isPreview || !isEditing) {
    if (!content.showToRespondent) return null;

    return (
      <div className="p-4 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#FF6B35] mb-1">Problem We're Exploring</p>
            <p className="text-white/70">{content.problem || 'Problem statement...'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-[#FF6B35]">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm font-medium">Problem Statement (for validation)</span>
      </div>

      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
          Problem Description
        </label>
        <textarea
          value={content.problem || ''}
          onChange={(e) => onChange({ ...content, problem: e.target.value })}
          placeholder="Describe the problem you want to validate..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF6B35]/50 focus:outline-none resize-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
        <input
          type="checkbox"
          checked={content.showToRespondent}
          onChange={(e) => onChange({ ...content, showToRespondent: e.target.checked })}
          className="rounded border-white/20 bg-white/5 text-[#FF6B35] focus:ring-[#FF6B35]/50"
        />
        <span className="flex items-center gap-2">
          {content.showToRespondent ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          Show to respondents
        </span>
      </label>

      {!content.showToRespondent && (
        <p className="text-xs text-white/40 italic">
          This problem statement is for your reference only and won't be shown to respondents.
        </p>
      )}
    </div>
  );
};

export default ProblemStatementBlock;
