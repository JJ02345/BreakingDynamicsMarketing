import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const YesNoBlock = ({ content, onChange, isEditing, isPreview, response, onResponse }) => {
  // Preview/Response Mode
  if (isPreview || !isEditing) {
    return (
      <div className="space-y-4">
        <p className="text-white font-medium">
          {content.question || 'Question'}
          {content.required && <span className="text-red-400 ml-1">*</span>}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => onResponse && onResponse(true)}
            className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
              response === true
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
            }`}
          >
            <ThumbsUp className={`h-6 w-6 ${response === true ? 'fill-current' : ''}`} />
            <span className="font-medium">{content.yesLabel || 'Yes'}</span>
          </button>

          <button
            onClick={() => onResponse && onResponse(false)}
            className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
              response === false
                ? 'border-red-500 bg-red-500/10 text-red-400'
                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
            }`}
          >
            <ThumbsDown className={`h-6 w-6 ${response === false ? 'fill-current' : ''}`} />
            <span className="font-medium">{content.noLabel || 'No'}</span>
          </button>
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
          placeholder="Enter your yes/no question..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00E676]/50 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Yes Label</label>
          <input
            type="text"
            value={content.yesLabel || ''}
            onChange={(e) => onChange({ ...content, yesLabel: e.target.value })}
            placeholder="Yes"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00E676]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">No Label</label>
          <input
            type="text"
            value={content.noLabel || ''}
            onChange={(e) => onChange({ ...content, noLabel: e.target.value })}
            placeholder="No"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00E676]/50 focus:outline-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
        <input
          type="checkbox"
          checked={content.required}
          onChange={(e) => onChange({ ...content, required: e.target.checked })}
          className="rounded border-white/20 bg-white/5 text-[#00E676] focus:ring-[#00E676]/50"
        />
        Required
      </label>
    </div>
  );
};

export default YesNoBlock;
