import React, { useRef, useState, useEffect } from 'react';
import { Image, Upload, X, FolderOpen, Loader2 } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';
import { db } from '../../../lib/supabase';

const ImageBlock = ({ content, onChange, isEditing }) => {
  const fileInputRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const [showLibrary, setShowLibrary] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  // Load user's uploaded images from dashboard
  const loadImageLibrary = async () => {
    if (!isAuthenticated) return;

    setLoadingLibrary(true);
    try {
      const images = await db.getUserImages();
      setUserImages(images);
    } catch (err) {
      console.error('Failed to load images:', err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const openLibrary = () => {
    setShowLibrary(true);
    loadImageLibrary();
  };

  const selectFromLibrary = (image) => {
    onChange({ ...content, src: image.url, alt: image.name });
    setShowLibrary(false);
  };

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
      <>
        <div
          className={`relative flex flex-col items-center justify-center border-2 border-dashed border-white/20 bg-white/5 transition-all ${isEditing ? 'cursor-pointer hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5' : ''}`}
          style={{
            width: '100%',
            height: content.height || 200,
            borderRadius,
          }}
        >
          <Image className="h-8 w-8 text-white/30 mb-2" />
          {isEditing && (
            <div className="flex flex-col items-center gap-3">
              <span className="text-sm text-white/40">Bild hinzufügen</span>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B35] text-white hover:bg-[#FF6B35]/80 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Hochladen
                </button>
                {isAuthenticated && (
                  <button
                    onClick={openLibrary}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <FolderOpen className="h-4 w-4" />
                    Bibliothek
                  </button>
                )}
              </div>
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

        {/* Image Library Modal */}
        {showLibrary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl mx-4 bg-[#1A1A1D] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-white text-lg">
                  Meine Bilder
                </h3>
                <button
                  onClick={() => setShowLibrary(false)}
                  className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {loadingLibrary ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-[#FF6B35] animate-spin" />
                  </div>
                ) : userImages.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="h-16 w-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 mb-2">
                      Noch keine Bilder hochgeladen
                    </p>
                    <p className="text-sm text-white/30">
                      Lade Bilder im Dashboard unter "Uploads" hoch
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {userImages.map((image) => (
                      <button
                        key={image.path}
                        onClick={() => selectFromLibrary(image)}
                        className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#FF6B35] transition-all group"
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium transition-opacity">
                            Auswählen
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-white/5">
                <p className="text-xs text-white/40 text-center">
                  Tipp: Du kannst weitere Bilder im Dashboard unter "Uploads" hochladen
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
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
          <div className="absolute top-2 right-2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl bg-black/70 text-white hover:bg-black/90 transition-colors shadow-lg"
              title="Neues Bild hochladen"
            >
              <Upload className="h-6 w-6" />
            </button>
            {isAuthenticated && (
              <button
                onClick={openLibrary}
                className="p-3 rounded-xl bg-[#FF6B35]/70 text-white hover:bg-[#FF6B35]/90 transition-colors shadow-lg"
                title="Aus Bibliothek wählen"
              >
                <FolderOpen className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={handleRemove}
              className="p-3 rounded-xl bg-red-500/70 text-white hover:bg-red-500/90 transition-colors shadow-lg"
              title="Bild entfernen"
            >
              <X className="h-6 w-6" />
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

      {/* Image Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl mx-4 bg-[#1A1A1D] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-semibold text-white text-lg">
                Meine Bilder
              </h3>
              <button
                onClick={() => setShowLibrary(false)}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {loadingLibrary ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-[#FF6B35] animate-spin" />
                </div>
              ) : userImages.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="h-16 w-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50 mb-2">
                    Noch keine Bilder hochgeladen
                  </p>
                  <p className="text-sm text-white/30">
                    Lade Bilder im Dashboard unter "Uploads" hoch
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {userImages.map((image) => (
                    <button
                      key={image.path}
                      onClick={() => selectFromLibrary(image)}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#FF6B35] transition-all group"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium transition-opacity">
                          Auswählen
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
              <p className="text-xs text-white/40 text-center">
                Tipp: Du kannst weitere Bilder im Dashboard unter "Uploads" hochladen
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageBlock;
