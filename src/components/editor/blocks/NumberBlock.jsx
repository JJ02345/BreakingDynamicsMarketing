import React from 'react';

const NumberBlock = ({ content, onChange, isEditing }) => {
  const numberStyle = {
    fontSize: '120px',
    fontWeight: '800',
    color: content.color || '#FF6B35',
    lineHeight: 1,
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: '-0.02em',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  };

  const labelStyle = {
    fontSize: '28px',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: '16px',
    fontWeight: '500',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  };

  if (isEditing) {
    return (
      <div className="flex flex-col items-center gap-2">
        <input
          type="text"
          value={content.number || ''}
          onChange={(e) => onChange({ ...content, number: e.target.value })}
          placeholder="87%"
          className="bg-transparent border-none text-center focus:outline-none"
          style={numberStyle}
        />
        <input
          type="text"
          value={content.label || ''}
          onChange={(e) => onChange({ ...content, label: e.target.value })}
          placeholder="Label (optional)"
          className="bg-transparent border-none text-center focus:outline-none"
          style={labelStyle}
        />
        <div className="flex gap-2 mt-2">
          {['#FF6B35', '#00E676', '#0A66C2', '#7C3AED', '#FFFFFF'].map((color) => (
            <button
              key={color}
              onClick={() => onChange({ ...content, color })}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                content.color === color
                  ? 'border-white scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div style={numberStyle}>{content.number || '01'}</div>
      {content.label && <div style={labelStyle}>{content.label}</div>}
    </div>
  );
};

export default NumberBlock;
