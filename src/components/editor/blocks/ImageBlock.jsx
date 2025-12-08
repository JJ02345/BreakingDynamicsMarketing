import React, { useRef } from 'react';
import { Image, Upload, X } from 'lucide-react';

const ImageBlock = ({ content, onChange, isEditing }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...content, src: reader.result, alt: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange({ ...content, src: null, alt: '' });
  };

  const borderRadius = content.borderRadius === 'none' ? '0' :
                       content.borderRadius === 'sm' ? '8px' :
                       content.borderRadius === 'lg' ? '16px' :
                       content.borderRadius === 'full' ? '50%' : '12px';

  // Filter effects
  const getFilter = () => {
    switch (content.filter) {
      case 'grayscale': return 'grayscale(100%)';
      case 'sepia': return 'sepia(80%)';
      case 'brightness': return 'brightness(1.2)';
      default: return 'none';
    }
  };

  // Shadow effects
  const getShadow = () => {
    switch (content.shadow) {
      case 'sm': return '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
      case 'lg': return '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
      default: return 'none';
    }
  };

  // Border styles
  const getBorder = () => {
    const color = content.borderColor || '#FFFFFF';
    switch (content.border) {
      case 'thin': return `2px solid ${color}`;
      case 'thick': return `4px solid ${color}`;
      default: return 'none';
    }
  };

  if (!content.src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed border-white/20 bg-white/5 transition-all ${isEditing ? 'cursor-pointer hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5' : ''}`}
        style={{
          width: '100%',
          height: content.height || 200,
          borderRadius,
        }}
        onClick={() => isEditing && fileInputRef.current?.click()}
      >
        <Image className="h-8 w-8 text-white/30 mb-2" />
        {isEditing && (
          <>
            <span className="text-sm text-white/40">Click to upload image</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative group"
      style={{
        width: '100%',
        height: content.height || 'auto',
        maxHeight: content.maxHeight || 400,
      }}
    >
      <img
        src={content.src}
        alt={content.alt || 'Image'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: content.fit || 'cover',
          borderRadius,
          filter: getFilter(),
          boxShadow: getShadow(),
          border: getBorder(),
        }}
      />
      {isEditing && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <Upload className="h-4 w-4" />
          </button>
          <button
            onClick={handleRemove}
            className="p-2 rounded-lg bg-red-500/50 text-white hover:bg-red-500/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
