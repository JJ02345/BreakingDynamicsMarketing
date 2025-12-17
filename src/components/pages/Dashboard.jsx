import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Home, ChevronRight, AlertCircle, Loader2, Settings, ToggleLeft, ToggleRight, Zap, LayoutGrid, FolderOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../squads/auth';
import { db } from '../../lib/supabase';
import { useBrandingSettings } from '../../hooks/useBrandingSettings';
import {
  DashboardHeader,
  DashboardStats,
  DashboardChart,
  DashboardHistory,
  DashboardUploads
} from '../dashboard';

const Dashboard = function() {
  const { t, language } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const isDE = language === 'de';
  const navigate = useNavigate();
  const [tab, setTab] = useState('home');
  const [carousels, setCarousels] = useState([]);
  const [carouselsLoading, setCarouselsLoading] = useState(true);
  const [carouselsError, setCarouselsError] = useState(null);

  // Branding settings
  const { showBranding, setShowBranding } = useBrandingSettings(!!user);

  // Load carousels
  const loadCarousels = async () => {
    setCarouselsLoading(true);
    setCarouselsError(null);
    try {
      const data = await db.getCarousels();
      setCarousels(data || []);
    } catch (err) {
      console.error('Failed to load carousels:', err);
      setCarouselsError(err.message);
    } finally {
      setCarouselsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadCarousels();
    } else {
      // If no user yet, stop loading state to prevent black screen
      setCarouselsLoading(false);
    }
  }, [user]);

  const editCarousel = (carousel) => {
    // Store carousel in localStorage for the editor to pick up
    localStorage.setItem('editCarousel', JSON.stringify(carousel));
    navigate('/carousel');
  };

  const stats = useMemo(() => {
    const totalSlides = carousels.reduce((acc, c) => acc + (c.slides?.length || 0), 0);
    return {
      total: carousels.length,
      week: carousels.filter(c => new Date(c.created) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
      totalSlides,
      exports: 0 // This would need tracking in the database
    };
  }, [carousels]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <DashboardHeader user={user} isAdmin={isAdmin} onLogout={signOut} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex rounded-xl border border-white/10 bg-[#111113] p-1 overflow-x-auto">
            {[
              { k: 'home', i: Home, l: t('dashboard.home') },
              { k: 'history', i: LayoutGrid, l: t('dashboard.myCarousels') },
              { k: 'uploads', i: FolderOpen, l: t('dashboard.uploads') },
              { k: 'settings', i: Settings, l: t('dashboard.settings') }
            ].map(item => (
              <button key={item.k} onClick={() => setTab(item.k)} className={"flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all " + (tab === item.k ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B]' : 'text-white/60 hover:text-white hover:bg-white/5')}>
                <item.i className="h-4 w-4" />{item.l}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Link to="/carousel" className="btn-primary">
              <Plus className="h-4 w-4" />{t('carousel.newCarousel')}
            </Link>
          </div>
        </div>

        {carouselsError && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{t('dashboard.loadError')} {carouselsError}</span>
            <button onClick={loadCarousels} className="ml-auto rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium hover:bg-red-500/30 transition-colors">
              {t('dashboard.retry')}
            </button>
          </div>
        )}

        {carouselsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
          </div>
        ) : (
          <>
            {tab === 'home' && (
              <div className="space-y-8">
                <DashboardStats stats={stats} />
                <DashboardChart carousels={carousels} />

                <button
                  onClick={() => setTab('history')}
                  className="card-glow flex w-full items-center justify-between p-6 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center transition-all group-hover:scale-110">
                      <LayoutGrid className="h-6 w-6 text-[#FF6B35]" />
                    </div>
                    <div>
                      <h3 className="font-['Syne'] font-bold text-white">{t('dashboard.recentCarousels')}</h3>
                      <p className="text-sm text-white/40">{carousels.length} {t('dashboard.carouselsTotal')}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-[#FF6B35] group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            )}

            {tab === 'history' && (
              <DashboardHistory
                carousels={carousels}
                onEdit={editCarousel}
                loadCarousels={loadCarousels}
              />
            )}

            {tab === 'uploads' && (
              <DashboardUploads />
            )}

            {tab === 'settings' && (
              <div className="space-y-6">
                <div className="card-dark p-6">
                  <h3 className="font-['Syne'] text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#FF6B35]" />
                    {isDE ? 'Carousel Einstellungen' : 'Carousel Settings'}
                  </h3>

                  {/* Branding Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center">
                          <span className="text-lg font-bold text-[#FF6B35]">BD</span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">
                            {isDE ? 'Breaking Dynamics Branding' : 'Breaking Dynamics Branding'}
                          </h4>
                          <p className="text-sm text-white/50">
                            {isDE
                              ? 'Zeigt "Made with Breaking Dynamics" unten rechts auf deinen Slides'
                              : 'Shows "Made with Breaking Dynamics" at bottom right of your slides'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowBranding(!showBranding)}
                      className={`ml-4 p-1 rounded-full transition-colors ${
                        showBranding
                          ? 'bg-[#FF6B35] text-white'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {showBranding ? (
                        <ToggleRight className="h-8 w-8" />
                      ) : (
                        <ToggleLeft className="h-8 w-8" />
                      )}
                    </button>
                  </div>

                  {showBranding && (
                    <div className="mt-4 p-4 rounded-xl bg-[#FF6B35]/5 border border-[#FF6B35]/20">
                      <p className="text-sm text-[#FF6B35]">
                        {isDE
                          ? '✨ Danke! Das Branding wird auf allen neuen Slides angezeigt.'
                          : '✨ Thanks! Branding will appear on all new slides.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Preview */}
                <div className="card-dark p-6">
                  <h4 className="text-sm font-medium text-white/50 mb-4">
                    {isDE ? 'Vorschau' : 'Preview'}
                  </h4>
                  <div className="aspect-square max-w-[200px] rounded-xl bg-gradient-to-br from-[#1a1a2e] to-[#0A0A0B] border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/20 text-sm">Slide</span>
                    </div>
                    {showBranding && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-black/50 backdrop-blur-sm">
                        <Zap className="h-2.5 w-2.5 text-[#FF6B35]" />
                        <span className="text-[8px] text-white/70">Breaking Dynamics</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
