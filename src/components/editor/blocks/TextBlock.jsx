import React from 'react';

const FONT_SIZE_MAP = {
  xs: '14px',
  sm: '18px',
  base: '24px',
  lg: '32px',
  xl: '48px',
  xxl: '64px',
  xxxl: '80px'
};

const TextBlock = ({ content, onChange, isEditing }) => {
  const style = {
    fontSize: FONT_SIZE_MAP[content.fontSize] || FONT_SIZE_MAP.base,
    fontWeight: content.fontWeight || 'normal',
    fontStyle: content.fontStyle || 'normal',
    textAlign: content.textAlign || 'center',
    color: content.color || '#FFFFFF',
    lineHeight: 1.3,
    fontFamily: content.fontFamily || "'Space Grotesk', sans-serif",
    width: '100%',
    whiteSpace: 'pre-wrap'
  };

  if (isEditing) {
    return (
      <textarea
        value={content.text || ''}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        style={{ ...style, background: 'transparent', border: 'none', outline: 'none', resize: 'none' }}
        className="w-full min-h-[1em]"
        rows={2}
      />
    );
  }

  return <div style={style}>{content.text}</div>;
};

export default TextBlock;
