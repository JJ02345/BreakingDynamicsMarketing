import React from 'react';
import { Plus, X } from 'lucide-react';

const SingleChoiceBlock = ({ content, onChange, isEditing, isPreview, response, onResponse }) => {
  const handleOptionChange = (index, value) => {
    const newOptions = [...content.options];
    newOptions[index] = value;
    onChange({ ...content, options: newOptions });
  };

  const addOption = () => {
    onChange({ ...content, options: [...content.options, `Option ${content.options.length + 1}`] });
  };

  const removeOption = (index) => {
    if (content.options.length > 2) {
      const newOptions = content.options.filter((_, i) => i !== index);
      onChange({ ...content, options: newOptions });
    }
  };

  // Preview/Response Mode
  if (isPreview || !isEditing) {
    return (
      <div className="space-y-3">
        <p className="text-white font-medium">
          {content.question || 'Question'}
          {content.required && <span className="text-red-400 ml-1">*</span>}
        </p>
        <div className="space-y-2">
          {content.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                response === option
                  ? 'border-[#FF6B35] bg-[#FF6B35]/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => onResponse && onResponse(option)}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                response === option ? 'border-[#FF6B35]' : 'border-white/30'
              }`}>
                {response === option && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                )}
              </div>
              <span className="text-white/80">{option}</span>
            </label>
          ))}
          {content.allowOther && (
            <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-white/30" />
              <input
                type="text"
                placeholder="Other..."
                className="flex-1 bg-transparent text-white/80 focus:outline-none"
              />
            </label>
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

      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Options</label>
        <div className="space-y-2">
          {content.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-white/20 flex-shrink-0" />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#FF6B35]/50 focus:outline-none"
              />
              {content.options.length > 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="p-2 text-white/30 hover:text-red-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addOption}
          className="mt-2 flex items-center gap-2 text-sm text-[#FF6B35] hover:text-[#FF8C5A] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add option
        </button>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={content.required}
            onChange={(e) => onChange({ ...content, required: e.target.checked })}
            className="rounded border-white/20 bg-white/5 text-[#FF6B35] focus:ring-[#FF6B35]/50"
          />
          Required
        </label>
        <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={content.allowOther}
            onChange={(e) => onChange({ ...content, allowOther: e.target.checked })}
            className="rounded border-white/20 bg-white/5 text-[#FF6B35] focus:ring-[#FF6B35]/50"
          />
          Allow "Other"
        </label>
      </div>
    </div>
  );
};

export default SingleChoiceBlock;
