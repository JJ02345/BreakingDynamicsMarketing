import React from 'react';

const DescriptionBlock = ({ content, onChange, isEditing, isPreview }) => {
  // Preview/Response Mode
  if (isPreview || !isEditing) {
    return (
      <div className="py-2">
        <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
          {content.text || 'Description text...'}
        </p>
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="space-y-2">
      <label className="text-xs text-white/40 uppercase tracking-wider block">Description Text</label>
      <textarea
        value={content.text || ''}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        placeholder="Enter description or instructions for respondents..."
        rows={4}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#7C3AED]/50 focus:outline-none resize-none"
      />
    </div>
  );
};

export default DescriptionBlock;
