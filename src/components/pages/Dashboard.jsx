import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, Plus, Home, History, LineChart, BarChart3, TrendingUp,
  ChevronRight, Copy, Check, Edit3, Eye, Trash2, AlertCircle,
  Loader2, LogOut, Shield, Sparkles, FlaskConical, FileText, X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage, LanguageSwitcher } from '../../context/LanguageContext';
import { db, auth } from '../../lib/supabase';
import { LINKEDIN_LIMITS } from '../../lib/postCompiler';
import { clean } from '../../utils/helpers';

// Survey Detail Modal
const SurveyDetailModal = function({ survey: s, onClose, onEdit }) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const copyText = () => {
    navigator.clipboard.writeText(clean(s.text));
    setCopied(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111113] border border-white/10 shadow-2xl animate-scale-in">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111113] px-6 py-4">
          <div>
            <h2 className="font-['Syne'] text-xl font-bold text-white">{s.title}</h2>
            <p className="text-sm text-white/40">Erstellt am {s.created}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {s.validation_challenge && (
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5">
              <div className="mb-3 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-400" />
                <h3 className="font-bold text-purple-300">Validierungs-Herausforderung</h3>
                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-400">Intern</span>
              </div>
              <p className="text-sm text-purple-200/80 whitespace-pre-wrap">{s.validation_challenge}</p>
            </div>
          )}

          {s.question && (
            <div className="rounded-xl border border-[#FF6B35]/30 bg-[#FF6B35]/5 p-5">
              <div className="mb-2 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#FF6B35]" />
                <h3 className="font-bold text-white">Umfrage-Frage</h3>
              </div>
              <p className="text-sm text-white/70">{s.question}</p>
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-[#1A1A1D] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#00D4FF]" />
                <h3 className="font-bold text-white">Generierter LinkedIn-Post</h3>
              </div>
              <span className="text-xs text-white/40">{s.text?.length || 0}/{LINKEDIN_LIMITS.POST_TEXT}</span>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-[#111113] border border-white/10 p-4 text-sm text-white/70">{s.text || 'Kein Text generiert'}</pre>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyText}
              className={copied ? "btn-success flex-1" : "btn-primary flex-1"}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Kopiert!' : 'Post-Text kopieren'}
            </button>
            <button
              onClick={() => { onEdit(s); onClose(); }}
              className="btn-secondary flex-1"
            >
              <Edit3 className="h-4 w-4" />
              Bearbeiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = function(props) {
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState('home');
  const [copiedId, setCopiedId] = useState(null);
  const [detailSurvey, setDetailSurvey] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('week');
  const [deleting, setDeleting] = useState(null);
  const copyTimeoutRef = useRef(null);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (props.user) {
        try {
          const adminStatus = await auth.isAdmin(props.user);
          setIsAdmin(adminStatus);
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

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const copyTxt = (id, text) => {
    navigator.clipboard.writeText(clean(text));
    setCopiedId(id);
    addToast(t('common.textCopied'), 'success', 2000);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 1500);
  };

  const edit = (s) => {
    props.setEditSurvey({ ...s, blockData: s.blockData || [] });
    navigate('/editor');
  };

  const deleteSurvey = async (id) => {
    setDeleting(id);
    try {
      await db.deleteSurvey(id);
      await props.loadSurveys();
      addToast(t('dashboard.deleted'), 'success');
    } catch (err) {
      console.error('Failed to delete survey:', err);
      addToast(t('dashboard.deleteFailed') + err.message, 'error');
    } finally {
      setDeleting(null);
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm(t('dashboard.deleteSurvey'))) {
      deleteSurvey(id);
    }
  };

  const stats = useMemo(() => ({
    total: props.surveys.length,
    week: props.surveys.filter(s => new Date(s.created) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
  }), [props.surveys]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] shadow-lg shadow-[#FF6B35]/20 transition-transform group-hover:scale-105">
              <Zap className="h-6 w-6 text-[#0A0A0B]" />
            </div>
            <span className="font-['Syne'] text-lg font-bold">Breaking Dynamics</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="hidden text-sm text-white/40 sm:block">{props.user?.email}</span>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.admin')}</span>
              </Link>
            )}
            <button onClick={props.handleLogout} className="btn-ghost flex items-center gap-2">
              <LogOut className="h-4 w-4" />{t('nav.logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex rounded-xl border border-white/10 bg-[#111113] p-1">
            {[{ k: 'home', i: Home, l: t('dashboard.home') }, { k: 'history', i: History, l: t('dashboard.history') }, { k: 'analyse', i: LineChart, l: t('dashboard.analysis') }].map(item => (
              <button key={item.k} onClick={() => setTab(item.k)} className={"flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all " + (tab === item.k ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B]' : 'text-white/60 hover:text-white hover:bg-white/5')}>
                <item.i className="h-4 w-4" />{item.l}
              </button>
            ))}
          </div>
          <Link to="/editor" className="btn-primary">
            <Plus className="h-4 w-4" />{t('dashboard.newValidation')}
          </Link>
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
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="card-dark p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{t('dashboard.totalTests')}</span>
                      <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-[#FF6B35]" />
                      </div>
                    </div>
                    <p className="font-['Syne'] text-4xl font-bold text-gradient-orange">{stats.total}</p>
                  </div>
                  <div className="card-dark p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{t('dashboard.thisWeek')}</span>
                      <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-[#00E676]" />
                      </div>
                    </div>
                    <p className="font-['Syne'] text-4xl font-bold text-[#00E676]">{stats.week}</p>
                  </div>
                </div>

                <div className="card-dark p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-3 font-['Syne'] text-lg font-bold">
                      <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center">
                        <LineChart className="h-5 w-5 text-[#00D4FF]" />
                      </div>
                      Test-Verlauf
                    </h3>
                    <div className="flex rounded-lg border border-white/10 bg-[#1A1A1D] p-1">
                      {['week', 'month', 'year'].map(p => (
                        <button
                          key={p}
                          onClick={() => setChartPeriod(p)}
                          className={"rounded-md px-3 py-1.5 text-xs font-medium transition-all " + (chartPeriod === p ? 'bg-[#FF6B35] text-[#0A0A0B]' : 'text-white/50 hover:text-white')}
                        >
                          {p === 'week' ? 'Woche' : p === 'month' ? 'Monate' : 'Jahre'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-48">
                    {props.surveys.length > 0 ? (
                      <div className="flex h-full items-end justify-between gap-2 px-4">
                        {(() => {
                          const chartData = [];

                          if (chartPeriod === 'week') {
                            for (let i = 6; i >= 0; i--) {
                              const date = new Date();
                              date.setDate(date.getDate() - i);
                              const dateStr = date.toISOString().split('T')[0];
                              const count = props.surveys.filter(s => s.created === dateStr).length;
                              chartData.push({ label: date.toLocaleDateString('de-DE', { weekday: 'short' }), count });
                            }
                          } else if (chartPeriod === 'month') {
                            for (let i = 11; i >= 0; i--) {
                              const date = new Date();
                              date.setMonth(date.getMonth() - i);
                              const monthStr = date.toISOString().slice(0, 7);
                              const count = props.surveys.filter(s => s.created?.startsWith(monthStr)).length;
                              chartData.push({ label: date.toLocaleDateString('de-DE', { month: 'short' }), count });
                            }
                          } else {
                            for (let i = 4; i >= 0; i--) {
                              const year = new Date().getFullYear() - i;
                              const count = props.surveys.filter(s => s.created?.startsWith(year.toString())).length;
                              chartData.push({ label: year.toString(), count });
                            }
                          }

                          const maxCount = Math.max(...chartData.map(d => d.count)) || 1;

                          return chartData.map((d, idx) => {
                            const height = d.count > 0 ? Math.max((d.count / maxCount) * 100, 10) : 5;
                            return (
                              <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                                <div className="relative w-full flex justify-center">
                                  {d.count > 0 && (
                                    <span className="absolute -top-6 text-xs font-bold text-[#FF6B35]">{d.count}</span>
                                  )}
                                  <div
                                    className={"w-full max-w-[40px] rounded-t-lg transition-all " + (d.count > 0 ? 'bg-gradient-to-t from-[#FF6B35] to-[#FF8C5A]' : 'bg-white/10')}
                                    style={{ height: `${height}%`, minHeight: '8px' }}
                                  />
                                </div>
                                <span className="text-xs text-white/40">{d.label}</span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/30">
                        <div className="text-center">
                          <LineChart className="mx-auto mb-2 h-10 w-10 opacity-50" />
                          <p className="text-sm">Noch keine Daten</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

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
              <div className="card-dark overflow-hidden">
                {props.surveys.length === 0 ? (
                  <div className="p-12 text-center">
                    <History className="mx-auto mb-4 h-12 w-12 text-white/20" />
                    <h3 className="font-['Syne'] text-lg font-bold text-white">{t('dashboard.noSurveys')}</h3>
                    <p className="mt-2 text-sm text-white/40">{t('dashboard.createFirst')}</p>
                    <Link to="/editor" className="btn-primary mt-6">
                      {t('dashboard.newValidation')}
                    </Link>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="border-b border-white/10 bg-[#1A1A1D]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{t('dashboard.title')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{t('dashboard.hypothesis')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{t('dashboard.created')}</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">{t('dashboard.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.surveys.map(s => (
                        <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors" onClick={() => setDetailSurvey(s)}>
                          <td className="px-6 py-4 font-medium text-white">{s.title}</td>
                          <td className="px-6 py-4">
                            {s.validation_challenge ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-purple-500/10 border border-purple-500/20 px-2 py-1 text-xs font-medium text-purple-400">
                                <FlaskConical className="h-3 w-3" />
                                <span className="max-w-[200px] truncate">{s.validation_challenge}</span>
                              </span>
                            ) : (
                              <span className="text-xs text-white/30">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-white/50">{s.created}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button onClick={(e) => { e.stopPropagation(); copyTxt(s.id, s.text); }} className={"rounded-lg p-2 transition-colors " + (copiedId === s.id ? 'bg-[#00E676]/10 text-[#00E676]' : 'text-white/30 hover:bg-white/5 hover:text-white')}>
                                {copiedId === s.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); edit(s); }} className="rounded-lg p-2 text-white/30 hover:bg-white/5 hover:text-white transition-colors">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setDetailSurvey(s); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); confirmDelete(s.id); }}
                                disabled={deleting === s.id}
                                className="rounded-lg p-2 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              >
                                {deleting === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
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
