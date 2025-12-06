import React, { useRef } from 'react';
import { User, Upload, X } from 'lucide-react';

const BrandingBlock = ({ content, onChange, isEditing }) => {
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...content, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    onChange({ ...content, avatarUrl: null });
  };

  return (
    <div className="flex items-center gap-3 justify-center">
      {content.showAvatar !== false && (
        <div className="relative group">
          {content.avatarUrl ? (
            <img
              src={content.avatarUrl}
              alt={content.name || 'Avatar'}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center ${
                isEditing ? 'cursor-pointer hover:opacity-80' : ''
              }`}
              onClick={() => isEditing && fileInputRef.current?.click()}
            >
              <User className="h-6 w-6 text-white" />
            </div>
          )}

          {isEditing && (
            <div className="absolute -bottom-1 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
              >
                <Upload className="h-3 w-3" />
              </button>
              {content.avatarUrl && (
                <button
                  onClick={handleRemoveAvatar}
                  className="p-1 rounded-full bg-red-500/70 text-white hover:bg-red-500 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      )}

      <div className="flex flex-col">
        {isEditing ? (
          <>
            <input
              type="text"
              value={content.name || ''}
              onChange={(e) => onChange({ ...content, name: e.target.value })}
              placeholder="Your Name"
              className="bg-transparent border-none text-white text-base font-semibold focus:outline-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            />
            <input
              type="text"
              value={content.handle || ''}
              onChange={(e) => onChange({ ...content, handle: e.target.value })}
              placeholder="@handle"
              className="bg-transparent border-none text-white/60 text-sm focus:outline-none"
            />
          </>
        ) : (
          <>
            <span
              className="text-white text-base font-semibold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {content.name || 'Your Name'}
            </span>
            <span className="text-white/60 text-sm">
              {content.handle || '@handle'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default BrandingBlock;
