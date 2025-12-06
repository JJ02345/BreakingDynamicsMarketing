import React from 'react';

const DividerBlock = ({ content, onChange, isEditing }) => {
  const style = {
    width: content.width || '50%',
    height: content.style === 'thick' ? '4px' : content.style === 'thin' ? '1px' : '2px',
    backgroundColor: content.color || '#FFFFFF',
    opacity: content.opacity ?? 0.2,
    borderRadius: '2px',
    margin: '0 auto',
  };

  if (isEditing) {
    return (
      <div className="flex flex-col items-center gap-3 w-full">
        <div style={style} />
        <div className="flex gap-2 flex-wrap justify-center">
          {['25%', '50%', '75%', '100%'].map((w) => (
            <button
              key={w}
              onClick={() => onChange({ ...content, width: w })}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                content.width === w
                  ? 'bg-[#FF6B35] text-[#0A0A0B]'
                  : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return <div style={style} />;
};

export default DividerBlock;
