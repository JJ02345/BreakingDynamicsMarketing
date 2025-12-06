import React from 'react';
import { Star } from 'lucide-react';

const RatingBlock = ({ content, onChange, isEditing, isPreview, response, onResponse }) => {
  const minValue = content.minValue || 1;
  const maxValue = content.maxValue || 5;
  const style = content.style || 'stars';

  const getDisplayValue = (value) => {
    if (style === 'emoji') {
      const emojis = ['😞', '😕', '😐', '🙂', '😊'];
      const index = Math.min(value - 1, emojis.length - 1);
      return emojis[index];
    }
    return value;
  };

  // Preview/Response Mode
  if (isPreview || !isEditing) {
    return (
      <div className="space-y-3">
        <p className="text-white font-medium">
          {content.question || 'Question'}
          {content.required && <span className="text-red-400 ml-1">*</span>}
        </p>

        <div className="flex items-center gap-4">
          {content.minLabel && (
            <span className="text-xs text-white/40">{content.minLabel}</span>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: maxValue - minValue + 1 }, (_, i) => {
              const value = minValue + i;
              const isSelected = response === value;
              const isHovered = response && value <= response;

              if (style === 'stars') {
                return (
                  <button
                    key={value}
                    onClick={() => onResponse && onResponse(value)}
                    className={`p-1 transition-all ${
                      isHovered ? 'text-[#FFD700] scale-110' : 'text-white/20 hover:text-[#FFD700]/50'
                    }`}
                  >
                    <Star className={`h-8 w-8 ${isHovered ? 'fill-current' : ''}`} />
                  </button>
                );
              }

              if (style === 'emoji') {
                return (
                  <button
                    key={value}
                    onClick={() => onResponse && onResponse(value)}
                    className={`text-2xl p-2 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-white/10 scale-110'
                        : 'hover:bg-white/5 opacity-50 hover:opacity-100'
                    }`}
                  >
                    {getDisplayValue(value)}
                  </button>
                );
              }

              // Numbers style
              return (
                <button
                  key={value}
                  onClick={() => onResponse && onResponse(value)}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    isSelected
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>

          {content.maxLabel && (
            <span className="text-xs text-white/40">{content.maxLabel}</span>
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
          placeholder="Enter your question..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF6B35]/50 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Min Value</label>
          <input
            type="number"
            value={content.minValue}
            onChange={(e) => onChange({ ...content, minValue: parseInt(e.target.value) || 1 })}
            min="0"
            max="10"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#FF6B35]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Max Value</label>
          <input
            type="number"
            value={content.maxValue}
            onChange={(e) => onChange({ ...content, maxValue: parseInt(e.target.value) || 5 })}
            min="1"
            max="10"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#FF6B35]/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Min Label</label>
          <input
            type="text"
            value={content.minLabel || ''}
            onChange={(e) => onChange({ ...content, minLabel: e.target.value })}
            placeholder="e.g., Not at all"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#FF6B35]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Max Label</label>
          <input
            type="text"
            value={content.maxLabel || ''}
            onChange={(e) => onChange({ ...content, maxLabel: e.target.value })}
            placeholder="e.g., Very much"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#FF6B35]/50 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Style</label>
        <div className="flex gap-2">
          {['stars', 'numbers', 'emoji'].map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...content, style: s })}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                content.style === s
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
        <input
          type="checkbox"
          checked={content.required}
          onChange={(e) => onChange({ ...content, required: e.target.checked })}
          className="rounded border-white/20 bg-white/5 text-[#FF6B35] focus:ring-[#FF6B35]/50"
        />
        Required
      </label>
    </div>
  );
};

export default RatingBlock;
