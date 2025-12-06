import React from 'react';

const HeaderBlock = ({ content, onChange, isEditing, isPreview }) => {
  // Preview/Response Mode
  if (isPreview || !isEditing) {
    return (
      <div className="text-center py-4">
        <h2 className="font-['Syne'] text-2xl font-bold text-white mb-2">
          {content.title || 'Section Title'}
        </h2>
        {content.subtitle && (
          <p className="text-white/50">{content.subtitle}</p>
        )}
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Title</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Section title..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-bold focus:border-[#7C3AED]/50 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Subtitle (optional)</label>
        <input
          type="text"
          value={content.subtitle || ''}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          placeholder="Additional description..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#7C3AED]/50 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default HeaderBlock;
