import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Loader2, LayoutGrid, Layers, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../lib/supabase';

const DashboardHistory = ({ carousels, onEdit, loadCarousels }) => {
  const { addToast } = useToast();
  const { t, language } = useLanguage();
  const [deleting, setDeleting] = useState(null);
  const locale = language === 'de' ? 'de-DE' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US';

  const deleteCarousel = async (id) => {
    setDeleting(id);
    try {
      await db.deleteCarousel(id);
      await loadCarousels();
      addToast(t('dashboard.carouselDeleted'), 'success');
    } catch (err) {
      console.error('Failed to delete carousel:', err);
      addToast(t('dashboard.deleteFailed') + err.message, 'error');
    } finally {
      setDeleting(null);
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm(t('carousel.deleteCarousel'))) deleteCarousel(id);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!carousels || carousels.length === 0) {
    return (
      <div className="card-dark overflow-hidden">
        <div className="p-12 text-center">
          <LayoutGrid className="mx-auto mb-4 h-12 w-12 text-white/20" />
          <h3 className="font-['Syne'] text-lg font-bold text-white">{t('dashboard.noCarousels')}</h3>
          <p className="mt-2 text-sm text-white/40">{t('dashboard.createFirstCarousel')}</p>
          <Link to="/carousel" className="btn-primary mt-6 inline-flex">
            {t('carousel.newCarousel')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {carousels.map(carousel => (
        <div
          key={carousel.id}
          className="card-dark p-5 hover:border-[#FF6B35]/30 transition-all cursor-pointer group"
          onClick={() => onEdit(carousel)}
        >
          {/* Preview thumbnail */}
          <div className="aspect-square mb-4 rounded-xl bg-gradient-to-br from-[#1a1a2e] to-[#0A0A0B] border border-white/10 overflow-hidden relative">
            {carousel.slides && carousel.slides.length > 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-lg bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center">
                  <Layers className="h-8 w-8 text-[#FF6B35]" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/20 text-sm">{t('dashboard.noSlides')}</span>
              </div>
            )}
            {/* Slide count badge */}
            <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-xs text-white/70 flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {carousel.slides?.length || 0} {t('common.slides')}
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-['Syne'] font-bold text-white truncate group-hover:text-[#FF6B35] transition-colors">
                {carousel.title || t('carousel.untitled')}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-xs text-white/40">
                <Calendar className="h-3 w-3" />
                {formatDate(carousel.created)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(carousel); }}
                className="rounded-lg p-2 text-white/30 hover:bg-white/5 hover:text-white transition-colors"
                title={t('common.edit')}
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); confirmDelete(carousel.id); }}
                disabled={deleting === carousel.id}
                className="rounded-lg p-2 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                title={t('dashboard.delete')}
              >
                {deleting === carousel.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardHistory;
