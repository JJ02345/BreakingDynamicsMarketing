import React from 'react';

const QuoteBlock = ({ content, onChange, isEditing }) => {
  const quoteStyle = {
    fontSize: content.fontSize === 'xl' ? '32px' :
              content.fontSize === 'lg' ? '28px' : '24px',
    fontStyle: content.fontStyle || 'italic',
    color: '#FFFFFF',
    lineHeight: 1.4,
    textAlign: 'center',
    fontFamily: "'Space Grotesk', sans-serif",
  };

  const authorStyle = {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '16px',
    textAlign: 'center',
  };

  if (isEditing) {
    return (
      <div className="flex flex-col items-center gap-3 w-full">
        <textarea
          value={content.text || ''}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          placeholder='"Your quote here..."'
          className="bg-transparent border-none text-center focus:outline-none resize-none w-full"
          style={quoteStyle}
          rows={3}
        />
        <input
          type="text"
          value={content.author || ''}
          onChange={(e) => onChange({ ...content, author: e.target.value })}
          placeholder="— Author name"
          className="bg-transparent border-none text-center focus:outline-none w-full"
          style={authorStyle}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div style={quoteStyle}>{content.text || '"Quote here"'}</div>
      {content.author && <div style={authorStyle}>— {content.author}</div>}
    </div>
  );
};

export default QuoteBlock;
