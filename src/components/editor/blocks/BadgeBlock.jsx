import React from 'react';

const BADGE_COLORS = [
  { bg: '#FF6B35', text: '#FFFFFF', name: 'Orange' },
  { bg: '#0A66C2', text: '#FFFFFF', name: 'LinkedIn Blue' },
  { bg: '#7C3AED', text: '#FFFFFF', name: 'Purple' },
  { bg: '#059669', text: '#FFFFFF', name: 'Green' },
  { bg: '#DC2626', text: '#FFFFFF', name: 'Red' },
  { bg: '#FFFFFF', text: '#0A0A0B', name: 'White' },
];

const BadgeBlock = ({ content, onChange, isEditing }) => {
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 20px',
    borderRadius: '9999px',
    backgroundColor: content.backgroundColor || '#FF6B35',
    color: content.textColor || '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  };

  if (isEditing) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div style={style}>
          <input
            type="text"
            value={content.text || ''}
            onChange={(e) => onChange({ ...content, text: e.target.value })}
            placeholder="Badge text"
            className="bg-transparent border-none text-center focus:outline-none min-w-[60px]"
            style={{ color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {BADGE_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => onChange({ ...content, backgroundColor: color.bg, textColor: color.text })}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                content.backgroundColor === color.bg
                  ? 'border-white scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color.bg }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    );
  }

  return <span style={style}>{content.text || 'Badge'}</span>;
};

export default BadgeBlock;
