import React from 'react';

const TextInputBlock = ({ content, onChange, isEditing, isPreview, response, onResponse }) => {
  // Preview/Response Mode
  if (isPreview || !isEditing) {
    return (
      <div className="space-y-3">
        <p className="text-white font-medium">
          {content.question || 'Question'}
          {content.required && <span className="text-red-400 ml-1">*</span>}
        </p>

        {content.multiline ? (
          <textarea
            value={response || ''}
            onChange={(e) => onResponse && onResponse(e.target.value)}
            placeholder={content.placeholder || 'Your answer...'}
            maxLength={content.maxLength || 500}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#00D4FF]/50 focus:outline-none resize-none"
          />
        ) : (
          <input
            type="text"
            value={response || ''}
            onChange={(e) => onResponse && onResponse(e.target.value)}
            placeholder={content.placeholder || 'Your answer...'}
            maxLength={content.maxLength || 500}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-[#00D4FF]/50 focus:outline-none"
          />
        )}

        {content.maxLength && (
          <p className="text-xs text-white/30 text-right">
            {(response || '').length}/{content.maxLength}
          </p>
        )}
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
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00D4FF]/50 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Placeholder Text</label>
        <input
          type="text"
          value={content.placeholder || ''}
          onChange={(e) => onChange({ ...content, placeholder: e.target.value })}
          placeholder="e.g., Type your answer here..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00D4FF]/50 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={content.multiline}
            onChange={(e) => onChange({ ...content, multiline: e.target.checked })}
            className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
          />
          Multi-line
        </label>

        <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={content.required}
            onChange={(e) => onChange({ ...content, required: e.target.checked })}
            className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
          />
          Required
        </label>

        <div className="flex items-center gap-2">
          <label className="text-sm text-white/60">Max length:</label>
          <input
            type="number"
            value={content.maxLength || 500}
            onChange={(e) => onChange({ ...content, maxLength: parseInt(e.target.value) || 500 })}
            min="10"
            max="2000"
            className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:border-[#00D4FF]/50 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default TextInputBlock;
