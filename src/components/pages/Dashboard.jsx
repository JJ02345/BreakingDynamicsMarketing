import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Home, History, LineChart, ChevronRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { auth } from '../../lib/supabase';
import {
  SurveyDetailModal,
  DashboardHeader,
  DashboardStats,
  DashboardChart,
  DashboardHistory
} from '../dashboard';

const Dashboard = function(props) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState('home');
  const [detailSurvey, setDetailSurvey] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (props.user) {
        try {
          setIsAdmin(await auth.isAdmin(props.user));
        } catch (err) {
          console.error('Admin check failed:', err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [props.user]);

  const edit = (s) => {
    props.setEditSurvey({ ...s, blockData: s.blockData || [] });
    navigate('/editor');
  };

  const stats = useMemo(() => ({
    total: props.surveys.length,
    week: props.surveys.filter(s => new Date(s.created) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
  }), [props.surveys]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <DashboardHeader user={props.user} isAdmin={isAdmin} onLogout={props.handleLogout} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex rounded-xl border border-white/10 bg-[#111113] p-1">
            {[{ k: 'home', i: Home, l: t('dashboard.home') }, { k: 'history', i: History, l: t('dashboard.history') }, { k: 'analyse', i: LineChart, l: t('dashboard.analysis') }].map(item => (
              <button key={item.k} onClick={() => setTab(item.k)} className={"flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all " + (tab === item.k ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B]' : 'text-white/60 hover:text-white hover:bg-white/5')}>
                <item.i className="h-4 w-4" />{item.l}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Link to="/carousel" className="btn-primary">
              <Plus className="h-4 w-4" />{t('carousel.newCarousel')}
            </Link>
            <Link to="/editor" className="btn-secondary">
              <Plus className="h-4 w-4" />{t('dashboard.newValidation')}
            </Link>
          </div>
        </div>

        {props.surveysError && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{t('dashboard.loadError')} {props.surveysError}</span>
            <button onClick={props.loadSurveys} className="ml-auto rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium hover:bg-red-500/30 transition-colors">
              {t('dashboard.retry')}
            </button>
          </div>
        )}

        {props.surveysLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
          </div>
        ) : (
          <>
            {tab === 'home' && (
              <div className="space-y-8">
                <DashboardStats stats={stats} />
                <DashboardChart surveys={props.surveys} />

                <button
                  onClick={() => setTab('history')}
                  className="card-glow flex w-full items-center justify-between p-6 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center transition-all group-hover:scale-110">
                      <History className="h-6 w-6 text-[#FF6B35]" />
                    </div>
                    <div>
                      <h3 className="font-['Syne'] font-bold text-white">Letzte Tests</h3>
                      <p className="text-sm text-white/40">{props.surveys.length} Validierungen insgesamt</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-[#FF6B35] group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            )}

            {tab === 'history' && (
              <DashboardHistory
                surveys={props.surveys}
                onViewDetail={setDetailSurvey}
                onEdit={edit}
                loadSurveys={props.loadSurveys}
              />
            )}

            {tab === 'analyse' && (
              <div className="card-dark p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center mx-auto mb-4">
                  <LineChart className="h-8 w-8 text-[#00D4FF]" />
                </div>
                <h3 className="font-['Syne'] text-xl font-bold text-white">Analyse</h3>
                <p className="mt-2 text-sm text-white/40">Kommt bald...</p>
                <div className="mt-6 inline-flex items-center gap-2 badge-cyan">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>In Entwicklung</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {detailSurvey && (
        <SurveyDetailModal
          survey={detailSurvey}
          onClose={() => setDetailSurvey(null)}
          onEdit={edit}
        />
      )}
    </div>
  );
};

export default Dashboard;
