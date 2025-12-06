import React from 'react';

const NPSBlock = ({ content, onChange, isEditing, isPreview, response, onResponse }) => {
  const getScoreColor = (score) => {
    if (score <= 6) return 'bg-red-500';
    if (score <= 8) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getScoreLabel = (score) => {
    if (score <= 6) return 'Detractor';
    if (score <= 8) return 'Passive';
    return 'Promoter';
  };

  // Preview/Response Mode
  if (isPreview || !isEditing) {
    return (
      <div className="space-y-4">
        <p className="text-white font-medium">
          {content.question || 'How likely are you to recommend this to a friend?'}
          {content.required && <span className="text-red-400 ml-1">*</span>}
        </p>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-white/40">
            <span>{content.minLabel || 'Not likely'}</span>
            <span>{content.maxLabel || 'Very likely'}</span>
          </div>

          <div className="flex gap-1 sm:gap-2">
            {Array.from({ length: 11 }, (_, i) => {
              const isSelected = response === i;
              return (
                <button
                  key={i}
                  onClick={() => onResponse && onResponse(i)}
                  className={`flex-1 aspect-square sm:w-10 sm:h-10 sm:flex-none rounded-lg font-bold text-sm transition-all ${
                    isSelected
                      ? `${getScoreColor(i)} text-white scale-110`
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {i}
                </button>
              );
            })}
          </div>

          {response !== undefined && response !== null && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${getScoreColor(response)}`} />
              <span className="text-sm text-white/60">{getScoreLabel(response)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Question</label>
        <input
          type="text"
          value={content.question}
          onChange={(e) => onChange({ ...content, question: e.target.value })}
          placeholder="How likely are you to recommend this to a friend?"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00D4FF]/50 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Min Label (0)</label>
          <input
            type="text"
            value={content.minLabel || ''}
            onChange={(e) => onChange({ ...content, minLabel: e.target.value })}
            placeholder="Not likely"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00D4FF]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Max Label (10)</label>
          <input
            type="text"
            value={content.maxLabel || ''}
            onChange={(e) => onChange({ ...content, maxLabel: e.target.value })}
            placeholder="Very likely"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00D4FF]/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">NPS Score Legend</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-white/60">0-6: Detractors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-white/60">7-8: Passives</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-white/60">9-10: Promoters</span>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
        <input
          type="checkbox"
          checked={content.required}
          onChange={(e) => onChange({ ...content, required: e.target.checked })}
          className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
        />
        Required
      </label>
    </div>
  );
};

export default NPSBlock;
