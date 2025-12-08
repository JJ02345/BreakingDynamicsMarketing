import React from 'react';
import { X, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';
import ColorPicker from './ColorPicker';
import FontSelector from './FontSelector';
import { FONT_SIZES } from '../../utils/slideTemplates';

const BlockStylePanel = ({ block, onChange, onClose }) => {
  if (!block) return null;

  const { content, type } = block;

  const handleChange = (key, value) => {
    onChange({ ...content, [key]: value });
  };

  const isTextBlock = ['HEADING', 'SUBHEADING', 'PARAGRAPH', 'QUOTE'].includes(type);
  const isImageBlock = type === 'IMAGE';
  const hasColor = ['HEADING', 'SUBHEADING', 'PARAGRAPH', 'NUMBER', 'BULLET_LIST', 'BADGE', 'DIVIDER'].includes(type);

  return (
    <div className="absolute -right-56 top-0 w-52 bg-[#1A1A1D] rounded-xl border border-white/10 shadow-2xl p-3 z-50 animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-white">Block Styling</span>
        <button onClick={onClose} className="text-white/40 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Font Family */}
        {isTextBlock && (
          <FontSelector
            label="Schriftart"
            value={content.fontFamily || "'Space Grotesk', sans-serif"}
            onChange={(val) => handleChange('fontFamily', val)}
          />
        )}

        {/* Font Size */}
        {isTextBlock && (
          <div>
            <label className="block text-xs text-white/60 mb-1">Schriftgröße</label>
            <div className="grid grid-cols-4 gap-1">
              {Object.entries(FONT_SIZES).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => handleChange('fontSize', key)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    content.fontSize === key
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Alignment */}
        {isTextBlock && (
          <div>
            <label className="block text-xs text-white/60 mb-1">Ausrichtung</label>
            <div className="flex gap-1">
              {[
                { value: 'left', icon: AlignLeft },
                { value: 'center', icon: AlignCenter },
                { value: 'right', icon: AlignRight },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleChange('textAlign', value)}
                  className={`flex-1 p-2 rounded transition-colors ${
                    content.textAlign === value
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4 mx-auto" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Font Weight & Style */}
        {isTextBlock && (
          <div>
            <label className="block text-xs text-white/60 mb-1">Stil</label>
            <div className="flex gap-1">
              <button
                onClick={() => handleChange('fontWeight', content.fontWeight === 'bold' ? 'normal' : 'bold')}
                className={`flex-1 p-2 rounded transition-colors ${
                  content.fontWeight === 'bold'
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Bold className="h-4 w-4 mx-auto" />
              </button>
              <button
                onClick={() => handleChange('fontStyle', content.fontStyle === 'italic' ? 'normal' : 'italic')}
                className={`flex-1 p-2 rounded transition-colors ${
                  content.fontStyle === 'italic'
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Italic className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        )}

        {/* Text Color */}
        {hasColor && (
          <ColorPicker
            label="Textfarbe"
            color={content.color || content.textColor || '#FFFFFF'}
            onChange={(val) => handleChange(type === 'BADGE' ? 'textColor' : 'color', val)}
          />
        )}

        {/* Background Color (for Badge) */}
        {type === 'BADGE' && (
          <ColorPicker
            label="Hintergrundfarbe"
            color={content.backgroundColor || '#FF6B35'}
            onChange={(val) => handleChange('backgroundColor', val)}
          />
        )}

        {/* Image Effects */}
        {isImageBlock && (
          <>
            {/* Border Radius */}
            <div>
              <label className="block text-xs text-white/60 mb-1">Ecken</label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { value: 'none', label: '0' },
                  { value: 'sm', label: 'S' },
                  { value: 'lg', label: 'L' },
                  { value: 'full', label: '●' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleChange('borderRadius', value)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      content.borderRadius === value
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shadow */}
            <div>
              <label className="block text-xs text-white/60 mb-1">Schatten</label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { value: 'none', label: 'Kein' },
                  { value: 'sm', label: 'Klein' },
                  { value: 'lg', label: 'Groß' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleChange('shadow', value)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      content.shadow === value
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div>
              <label className="block text-xs text-white/60 mb-1">Filter</label>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { value: 'none', label: 'Normal' },
                  { value: 'grayscale', label: 'S/W' },
                  { value: 'sepia', label: 'Sepia' },
                  { value: 'brightness', label: 'Hell' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleChange('filter', value)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      content.filter === value
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Border */}
            <div>
              <label className="block text-xs text-white/60 mb-1">Rahmen</label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { value: 'none', label: 'Kein' },
                  { value: 'thin', label: 'Dünn' },
                  { value: 'thick', label: 'Dick' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleChange('border', value)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      content.border === value
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {content.border && content.border !== 'none' && (
              <ColorPicker
                label="Rahmenfarbe"
                color={content.borderColor || '#FFFFFF'}
                onChange={(val) => handleChange('borderColor', val)}
              />
            )}
          </>
        )}

        {/* Number Block Color */}
        {type === 'NUMBER' && (
          <ColorPicker
            label="Zahlenfarbe"
            color={content.color || '#FF6B35'}
            onChange={(val) => handleChange('color', val)}
          />
        )}

        {/* Bullet List Style */}
        {type === 'BULLET_LIST' && (
          <div>
            <label className="block text-xs text-white/60 mb-1">Aufzählungszeichen</label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { value: 'check', label: '✓' },
                { value: 'circle', label: '●' },
                { value: 'arrow', label: '→' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleChange('bulletStyle', value)}
                  className={`px-2 py-1.5 rounded text-sm transition-colors ${
                    content.bulletStyle === value
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Divider Options */}
        {type === 'DIVIDER' && (
          <>
            <div>
              <label className="block text-xs text-white/60 mb-1">Breite</label>
              <div className="grid grid-cols-4 gap-1">
                {['25%', '50%', '75%', '100%'].map((width) => (
                  <button
                    key={width}
                    onClick={() => handleChange('width', width)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      content.width === width
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {width}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Transparenz</label>
              <input
                type="range"
                min="0"
                max="100"
                value={(content.opacity || 0.2) * 100}
                onChange={(e) => handleChange('opacity', parseInt(e.target.value) / 100)}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlockStylePanel;
