import React from 'react';
import { Check, Circle, ChevronRight } from 'lucide-react';

const BULLET_STYLES = {
  check: { icon: Check, color: '#00E676' },
  circle: { icon: Circle, color: '#FF6B35' },
  arrow: { icon: ChevronRight, color: '#0A66C2' },
};

// Larger icon size for visual impact
const ICON_SIZE = 'h-8 w-8';

const BulletListBlock = ({ content, onChange, isEditing }) => {
  const items = content.items || ['Item 1', 'Item 2', 'Item 3'];
  const bulletStyle = content.bulletStyle || 'check';
  const BulletIcon = BULLET_STYLES[bulletStyle]?.icon || Check;
  const bulletColor = BULLET_STYLES[bulletStyle]?.color || '#00E676';

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange({ ...content, items: newItems });
  };

  const addItem = () => {
    onChange({ ...content, items: [...items, ''] });
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      onChange({ ...content, items: newItems });
    }
  };

  const itemStyle = {
    fontSize: '28px',
    color: content.color || '#FFFFFF',
    lineHeight: 1.5,
    fontWeight: '500',
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 w-full">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 group">
            <BulletIcon className={`${ICON_SIZE} flex-shrink-0`} style={{ color: bulletColor }} />
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={`Item ${index + 1}`}
              className="flex-1 bg-transparent border-none focus:outline-none"
              style={itemStyle}
            />
            {items.length > 1 && (
              <button
                onClick={() => removeItem(index)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <button
            onClick={addItem}
            className="px-3 py-1 rounded-lg bg-white/10 text-white/50 text-sm hover:bg-white/20 transition-colors"
          >
            + Add item
          </button>
          <div className="flex gap-1">
            {Object.entries(BULLET_STYLES).map(([style, { icon: Icon, color }]) => (
              <button
                key={style}
                onClick={() => onChange({ ...content, bulletStyle: style })}
                className={`p-2 rounded-lg transition-colors ${
                  bulletStyle === style
                    ? 'bg-white/20'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" style={{ color }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <BulletIcon className={`${ICON_SIZE} flex-shrink-0`} style={{ color: bulletColor }} />
          <span style={itemStyle}>{item}</span>
        </div>
      ))}
    </div>
  );
};

export default BulletListBlock;
