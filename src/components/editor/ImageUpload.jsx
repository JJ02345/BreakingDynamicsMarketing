import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, Loader2, CloudUpload, HardDrive } from 'lucide-react';
import { db } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const ImageUpload = ({
  onImageSelect,
  currentImage = null,
  showLibrary = true,
  compact = false,
  className = ''
}) => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const isDE = language === 'de';

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  // Validate file before upload
  const validateFile = (file) => {
    if (!file) return isDE ? 'Keine Datei ausgewählt' : 'No file selected';

    if (!ALLOWED_TYPES.includes(file.type)) {
      return isDE
        ? 'Nur JPG, PNG, GIF und WebP erlaubt'
        : 'Only JPG, PNG, GIF and WebP allowed';
    }

    if (file.size > MAX_FILE_SIZE) {
      return isDE
        ? 'Datei zu groß (max. 5MB)'
        : 'File too large (max 5MB)';
    }

    return null;
  };

  // Handle file upload (local Base64 for anonymous, cloud for authenticated)
  const handleFileUpload = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsUploading(true);
    setUploadProgress(10);

    try {
      if (isAuthenticated) {
        // Cloud upload for authenticated users
        setUploadProgress(30);
        const result = await db.uploadImage(file);
        setUploadProgress(100);

        onImageSelect({
          url: result.url,
          path: result.path,
          isCloud: true,
          fileName: result.fileName
        });
      } else {
        // Local Base64 for anonymous users
        setUploadProgress(50);
        const reader = new FileReader();

        reader.onloadend = () => {
          setUploadProgress(100);
          onImageSelect({
            url: reader.result,
            isCloud: false,
            fileName: file.name
          });
        };

        reader.onerror = () => {
          setError(isDE ? 'Fehler beim Lesen der Datei' : 'Error reading file');
        };

        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || (isDE ? 'Upload fehlgeschlagen' : 'Upload failed'));
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [isAuthenticated]);

  // Load user's image library
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

  // Open library
  const openLibrary = () => {
    setShowImageLibrary(true);
    loadImageLibrary();
  };

  // Select from library
  const selectFromLibrary = (image) => {
    onImageSelect({
      url: image.url,
      path: image.path,
      isCloud: true,
      fileName: image.name
    });
    setShowImageLibrary(false);
  };

  // Remove current image
  const handleRemove = () => {
    onImageSelect(null);
  };

  // Compact mode (just a button)
  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span className="text-sm">{isDE ? 'Bild hochladen' : 'Upload image'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />
        {error && (
          <p className="absolute top-full mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Image Preview */}
      {currentImage && (
        <div className="relative rounded-xl overflow-hidden border border-white/10">
          <img
            src={currentImage.url || currentImage}
            alt="Preview"
            className="w-full h-32 object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-3 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-colors shadow-lg"
            title="Bild entfernen"
          >
            <X className="h-6 w-6" />
          </button>
          {currentImage.isCloud && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-[10px] text-white/70">
              <CloudUpload className="h-3 w-3" />
              Cloud
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!currentImage && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed
            transition-all cursor-pointer
            ${dragActive
              ? 'border-[#FF6B35] bg-[#FF6B35]/10'
              : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }
            ${isUploading ? 'pointer-events-none' : ''}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-[#FF6B35] animate-spin mb-2" />
              <div className="w-full max-w-[120px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF6B35] rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="mt-2 text-xs text-white/50">
                {isDE ? 'Wird hochgeladen...' : 'Uploading...'}
              </span>
            </>
          ) : (
            <>
              <Image className="h-8 w-8 text-white/30 mb-2" />
              <span className="text-sm text-white/60 text-center">
                {dragActive
                  ? (isDE ? 'Hier ablegen' : 'Drop here')
                  : (isDE ? 'Klicken oder ziehen' : 'Click or drag')
                }
              </span>
              <span className="text-[10px] text-white/30 mt-1">
                JPG, PNG, GIF, WebP (max 5MB)
              </span>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Storage indicator */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-white/40">
        {isAuthenticated ? (
          <>
            <CloudUpload className="h-3 w-3" />
            {isDE ? 'Cloud-Speicher' : 'Cloud storage'}
          </>
        ) : (
          <>
            <HardDrive className="h-3 w-3" />
            {isDE ? 'Nur lokal (Login für Cloud)' : 'Local only (Login for cloud)'}
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
          <X className="h-4 w-4 text-red-400 flex-shrink-0" />
          <span className="text-xs text-red-400">{error}</span>
        </div>
      )}

      {/* Image Library (for authenticated users) */}
      {showLibrary && isAuthenticated && !currentImage && (
        <button
          onClick={openLibrary}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm"
        >
          <Image className="h-4 w-4" />
          {isDE ? 'Aus Bibliothek wählen' : 'Choose from library'}
        </button>
      )}

      {/* Image Library Modal */}
      {showImageLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-[#1A1A1D] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-semibold text-white">
                {isDE ? 'Bild-Bibliothek' : 'Image Library'}
              </h3>
              <button
                onClick={() => setShowImageLibrary(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {loadingLibrary ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-white/50 animate-spin" />
                </div>
              ) : userImages.length === 0 ? (
                <div className="text-center py-8">
                  <Image className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/50">
                    {isDE ? 'Noch keine Bilder hochgeladen' : 'No images uploaded yet'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {userImages.map((image) => (
                    <button
                      key={image.path}
                      onClick={() => selectFromLibrary(image)}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-[#FF6B35] transition-all group"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
