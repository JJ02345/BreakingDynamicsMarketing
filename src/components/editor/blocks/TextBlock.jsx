import React from 'react';

const FONT_SIZE_MAP = {
  xs: '16px',
  sm: '20px',
  base: '28px',
  lg: '40px',
  xl: '56px',
  xxl: '72px',
  xxxl: '96px'
};

/**
 * Get font size - supports both named sizes and direct px values
 */
const getFontSize = (fontSize) => {
  if (!fontSize) return FONT_SIZE_MAP.base;
  // Direct px value (e.g., '48px')
  if (typeof fontSize === 'string' && fontSize.endsWith('px')) {
    return fontSize;
  }
  // Named size (e.g., 'xl')
  return FONT_SIZE_MAP[fontSize] || FONT_SIZE_MAP.base;
};

const TextBlock = ({ content, onChange, isEditing }) => {
  const style = {
    fontSize: getFontSize(content.fontSize),
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
        className="w-full min-h-[1em] text-center"
        rows={2}
      />
    );
  }

  return <div style={style}>{content.text}</div>;
};

export default TextBlock;
