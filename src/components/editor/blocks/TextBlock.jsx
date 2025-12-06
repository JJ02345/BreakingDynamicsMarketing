import React from 'react';

const TextBlock = ({ content, onChange, isEditing }) => {
  const style = {
    fontSize: content.fontSize === 'xxl' ? '64px' :
              content.fontSize === 'xl' ? '48px' :
              content.fontSize === 'lg' ? '32px' :
              content.fontSize === 'base' ? '24px' : '18px',
    fontWeight: content.fontWeight || 'normal',
    textAlign: content.textAlign || 'center',
    color: content.color || '#FFFFFF',
    lineHeight: 1.3,
    fontFamily: "'Space Grotesk', sans-serif",
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
