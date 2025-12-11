import React, { useState, useEffect } from 'react';

const EMOJI_CATEGORIES = {
  popular: ['🚀', '💡', '🎯', '⚡', '🔥', '✨', '💪', '🏆', '📈', '💰', '🎉', '❤️', '⭐', '💎', '🌟', '✅'],
  business: ['💼', '📊', '💹', '🏢', '🤝', '📱', '💻', '🖥️', '📧', '📞', '🔑', '📝', '📋', '🗂️', '💳', '🏦'],
  arrows: ['➡️', '⬆️', '⬇️', '↗️', '↘️', '🔄', '↩️', '🔃', '➕', '➖', '✖️', '➗', '▶️', '◀️', '🔀', '↔️'],
  success: ['✅', '✓', '💯', '🏅', '🥇', '🎖️', '👑', '🌈', '🍀', '💫', '🔔', '📣', '🎊', '🏁', '🎁', '🎀'],
  symbols: ['❌', '⭐', '💯', '🔶', '🔷', '🟠', '🟢', '🔴', '⚫', '⬜', '🟦', '❗', '❓', '💠', '🔸', '🔹'],
  faces: ['😊', '🤔', '😮', '🙌', '👏', '👍', '👎', '🤷', '💬', '💭', '🗣️', '👀', '🧠', '💪', '🤩', '😎'],
  numbers: ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '#️⃣', '*️⃣', '🅰️', '🅱️', '🆎'],
  nature: ['🌱', '🌿', '🍃', '🌳', '🌲', '🌴', '🌵', '🌻', '🌺', '🌸', '💐', '🌹', '🍀', '☀️', '🌙', '⭐'],
  objects: ['📌', '📍', '🔖', '🏷️', '📎', '🔗', '📐', '📏', '✂️', '🖊️', '✏️', '🔍', '🔎', '💡', '🔦', '🧲'],
  hands: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆'],
};

const CATEGORY_LABELS = {
  popular: { label: '⭐ Beliebt', emoji: '⭐' },
  business: { label: '💼 Business', emoji: '💼' },
  arrows: { label: '➡️ Pfeile', emoji: '➡️' },
  success: { label: '✅ Erfolg', emoji: '✅' },
  symbols: { label: '🔷 Symbole', emoji: '🔷' },
  faces: { label: '😊 Gesichter', emoji: '😊' },
  numbers: { label: '1️⃣ Zahlen', emoji: '1️⃣' },
  nature: { label: '🌱 Natur', emoji: '🌱' },
  objects: { label: '📌 Objekte', emoji: '📌' },
  hands: { label: '👋 Hände', emoji: '👋' },
};

const IconBlock = ({ content, onChange, isEditing }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState('popular');

  // Sehr große Icons für visuellen Impact
  const size = content.size === 'xxl' ? '280px' :
               content.size === 'xl' ? '220px' :
               content.size === 'lg' ? '160px' :
               content.size === 'base' ? '120px' : '80px';

  const handleEmojiSelect = (emoji) => {
    onChange({ ...content, emoji });
    setShowPicker(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      <div
        className={`flex items-center justify-center transition-all ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
        style={{ fontSize: size, lineHeight: 1, margin: '16px 0' }}
        onClick={() => isEditing && setShowPicker(!showPicker)}
      >
        {content.emoji || '🚀'}
      </div>

      {isEditing && showPicker && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-72 rounded-xl bg-[#1A1A1D] border border-white/10 shadow-2xl p-3 animate-scale-in">
          <div className="flex gap-1 mb-3 flex-wrap">
            {Object.keys(EMOJI_CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#FF6B35] text-[#0A0A0B]'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-2">
            {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                className="p-2 text-2xl hover:bg-white/10 rounded-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <input
              type="text"
              placeholder="Or type any emoji..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#FF6B35]/50 focus:outline-none"
              onChange={(e) => {
                const lastChar = e.target.value.slice(-2);
                if (lastChar.match(/\p{Emoji}/u)) {
                  handleEmojiSelect(lastChar);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IconBlock;
