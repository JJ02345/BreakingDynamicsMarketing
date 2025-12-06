import React from 'react';
import { Plus, X, Check } from 'lucide-react';

const MultiChoiceBlock = ({ content, onChange, isEditing, isPreview, response = [], onResponse }) => {
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

  const toggleOption = (option) => {
    if (!onResponse) return;
    const currentResponse = Array.isArray(response) ? response : [];
    if (currentResponse.includes(option)) {
      onResponse(currentResponse.filter(o => o !== option));
    } else {
      if (!content.maxSelections || currentResponse.length < content.maxSelections) {
        onResponse([...currentResponse, option]);
      }
    }
  };

  // Preview/Response Mode
  if (isPreview || !isEditing) {
    const selectedOptions = Array.isArray(response) ? response : [];

    return (
      <div className="space-y-3">
        <p className="text-white font-medium">
          {content.question || 'Question'}
          {content.required && <span className="text-red-400 ml-1">*</span>}
        </p>
        {content.maxSelections && (
          <p className="text-xs text-white/40">Select up to {content.maxSelections}</p>
        )}
        <div className="space-y-2">
          {content.options.map((option, index) => {
            const isSelected = selectedOptions.includes(option);
            return (
              <label
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#00D4FF] bg-[#00D4FF]/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                onClick={() => toggleOption(option)}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected ? 'border-[#00D4FF] bg-[#00D4FF]' : 'border-white/30'
                }`}>
                  {isSelected && <Check className="h-3 w-3 text-[#0A0A0B]" />}
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
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Options</label>
        <div className="space-y-2">
          {content.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border-2 border-white/20 flex-shrink-0" />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00D4FF]/50 focus:outline-none"
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
          className="mt-2 flex items-center gap-2 text-sm text-[#00D4FF] hover:opacity-80 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add option
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={content.required}
            onChange={(e) => onChange({ ...content, required: e.target.checked })}
            className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
          />
          Required
        </label>
        <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={content.allowOther}
            onChange={(e) => onChange({ ...content, allowOther: e.target.checked })}
            className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
          />
          Allow "Other"
        </label>
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/60">Max selections:</label>
          <input
            type="number"
            value={content.maxSelections || ''}
            onChange={(e) => onChange({ ...content, maxSelections: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="∞"
            min="1"
            className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:border-[#00D4FF]/50 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default MultiChoiceBlock;
