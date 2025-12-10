import React, { useState, useEffect } from 'react';
import { Image, Layers, Sparkles, Trash2, Loader2, Upload, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { db } from '../../lib/supabase';

const DashboardUploads = () => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('images');
  const [images, setImages] = useState([]);
  const [customSlides, setCustomSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Load user's uploads
  useEffect(() => {
    loadUploads();
  }, []);

  const loadUploads = async () => {
    setLoading(true);
    try {
      const [imagesData, slidesData] = await Promise.all([
        db.getUserImages(),
        db.getCustomSlides()
      ]);
      setImages(imagesData || []);
      setCustomSlides(slidesData || []);
    } catch (err) {
      console.error('Failed to load uploads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      addToast(t('editor.onlyJpgPng'), 'error');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      addToast(t('editor.maxSize'), 'error');
      return;
    }

    setUploading(true);
    try {
      await db.uploadImage(file);
      await loadUploads();
      addToast(t('dashboard.imageUploaded'), 'success');
    } catch (err) {
      console.error('Upload failed:', err);
      addToast(t('editor.uploadFailed'), 'error');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (path) => {
    setDeleting(path);
    try {
      await db.deleteImage(path);
      await loadUploads();
      addToast(t('dashboard.imageDeleted'), 'success');
    } catch (err) {
      console.error('Delete failed:', err);
      addToast(t('dashboard.deleteFailed'), 'error');
    } finally {
      setDeleting(null);
    }
  };

  const deleteSlide = async (id) => {
    setDeleting(id);
    try {
      await db.deleteCustomSlide(id);
      await loadUploads();
      addToast(t('dashboard.slideDeleted'), 'success');
    } catch (err) {
      console.error('Delete failed:', err);
      addToast(t('dashboard.deleteFailed'), 'error');
    } finally {
      setDeleting(null);
    }
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addToast(t('common.textCopied'), 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tabs = [
    { key: 'images', icon: Image, label: t('dashboard.images') },
    { key: 'slides', icon: Layers, label: t('dashboard.savedSlides') },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-[#FF6B35] text-[#0A0A0B]'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="space-y-4">
          {/* Upload Button */}
          <label className="card-dark p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B35]/30 transition-all">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35] mb-2" />
            ) : (
              <Upload className="h-8 w-8 text-[#FF6B35] mb-2" />
            )}
            <span className="text-white font-medium">
              {uploading ? t('editor.loading') : t('dashboard.uploadImage')}
            </span>
            <span className="text-sm text-white/40 mt-1">
              JPG, PNG, GIF, WebP • Max 5MB
            </span>
          </label>

          {/* Images Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.path} className="card-dark p-2 group relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-black/20">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2 px-1">
                    <p className="text-xs text-white/60 truncate">{img.name}</p>
                  </div>
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyUrl(img.url, img.path)}
                      className="p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
                      title={t('dashboard.copyUrl')}
                    >
                      {copiedId === img.path ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteImage(img.path)}
                      disabled={deleting === img.path}
                      className="p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white/70 hover:text-red-400 transition-colors"
                      title={t('dashboard.delete')}
                    >
                      {deleting === img.path ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-dark p-12 text-center">
              <Image className="mx-auto mb-4 h-12 w-12 text-white/20" />
              <h3 className="font-['Syne'] text-lg font-bold text-white">{t('dashboard.noImages')}</h3>
              <p className="mt-2 text-sm text-white/40">{t('dashboard.uploadFirstImage')}</p>
            </div>
          )}
        </div>
      )}

      {/* Custom Slides Tab */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          {customSlides.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {customSlides.map((slide) => (
                <div key={slide.id} className="card-dark p-3 group relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#0A0A0B] border border-white/10 flex items-center justify-center">
                    {slide.previewImage ? (
                      <img
                        src={slide.previewImage}
                        alt={slide.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Layers className="h-8 w-8 text-[#FF6B35]/50" />
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-white font-medium truncate">{slide.name}</p>
                    <p className="text-xs text-white/40">
                      {new Date(slide.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    disabled={deleting === slide.id}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white/70 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                    title={t('dashboard.delete')}
                  >
                    {deleting === slide.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-dark p-12 text-center">
              <Layers className="mx-auto mb-4 h-12 w-12 text-white/20" />
              <h3 className="font-['Syne'] text-lg font-bold text-white">{t('dashboard.noSavedSlides')}</h3>
              <p className="mt-2 text-sm text-white/40">{t('dashboard.saveSlideHint')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardUploads;
