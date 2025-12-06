import React from 'react';
import { Target } from 'lucide-react';

const SolutionTestBlock = ({ content, onChange, isEditing, isPreview, response, onResponse }) => {
  // Preview/Response Mode
  if (isPreview || !isEditing) {
    return (
      <div className="space-y-4">
        {content.solutionDescription && (
          <div className="p-4 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-[#00E676] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#00E676] mb-1">Proposed Solution</p>
                <p className="text-white/70">{content.solutionDescription}</p>
              </div>
            </div>
          </div>
        )}

        <p className="text-white font-medium">
          {content.question || 'Would this solution help you?'}
          <span className="text-red-400 ml-1">*</span>
        </p>

        <div className="space-y-2">
          {(content.options || []).map((option, index) => {
            const isSelected = response === option;
            // Color coding based on position (assuming positive to negative order)
            const getOptionColor = () => {
              const total = content.options.length;
              const ratio = index / (total - 1);
              if (ratio <= 0.25) return 'border-green-500 bg-green-500/10';
              if (ratio <= 0.5) return 'border-emerald-500 bg-emerald-500/10';
              if (ratio <= 0.75) return 'border-yellow-500 bg-yellow-500/10';
              return 'border-red-500 bg-red-500/10';
            };

            return (
              <label
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? getOptionColor()
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                onClick={() => onResponse && onResponse(option)}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-[#00E676]' : 'border-white/30'
                }`}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00E676]" />
                  )}
                </div>
                <span className="text-white/80">{option}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-[#00E676]">
        <Target className="h-5 w-5" />
        <span className="text-sm font-medium">Solution Test</span>
      </div>

      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
          Solution Description
        </label>
        <textarea
          value={content.solutionDescription || ''}
          onChange={(e) => onChange({ ...content, solutionDescription: e.target.value })}
          placeholder="Describe your proposed solution..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00E676]/50 focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
          Question
        </label>
        <input
          type="text"
          value={content.question || ''}
          onChange={(e) => onChange({ ...content, question: e.target.value })}
          placeholder="Would this solution help you?"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00E676]/50 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
          Response Options (ordered from positive to negative)
        </label>
        <div className="space-y-2">
          {(content.options || []).map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-white/20 flex-shrink-0" />
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...content.options];
                  newOptions[index] = e.target.value;
                  onChange({ ...content, options: newOptions });
                }}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00E676]/50 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/40 italic">
        Tip: Order options from most positive (top) to most negative (bottom) for better analytics.
      </p>
    </div>
  );
};

export default SolutionTestBlock;
