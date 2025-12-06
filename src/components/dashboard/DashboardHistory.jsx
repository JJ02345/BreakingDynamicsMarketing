import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, Edit3, Eye, Trash2, Loader2, History, FlaskConical } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../lib/supabase';
import { clean } from '../../utils/helpers';

const DashboardHistory = ({ surveys, onViewDetail, onEdit, loadSurveys }) => {
  const { addToast } = useToast();
  const { t } = useLanguage();
  const [copiedId, setCopiedId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const copyTxt = (id, text) => {
    navigator.clipboard.writeText(clean(text));
    setCopiedId(id);
    addToast(t('common.textCopied'), 'success', 2000);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 1500);
  };

  const deleteSurvey = async (id) => {
    setDeleting(id);
    try {
      await db.deleteSurvey(id);
      await loadSurveys();
      addToast(t('dashboard.deleted'), 'success');
    } catch (err) {
      console.error('Failed to delete survey:', err);
      addToast(t('dashboard.deleteFailed') + err.message, 'error');
    } finally {
      setDeleting(null);
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm(t('dashboard.deleteSurvey'))) deleteSurvey(id);
  };

  if (surveys.length === 0) {
    return (
      <div className="card-dark overflow-hidden">
        <div className="p-12 text-center">
          <History className="mx-auto mb-4 h-12 w-12 text-white/20" />
          <h3 className="font-['Syne'] text-lg font-bold text-white">{t('dashboard.noSurveys')}</h3>
          <p className="mt-2 text-sm text-white/40">{t('dashboard.createFirst')}</p>
          <Link to="/editor" className="btn-primary mt-6">
            {t('dashboard.newValidation')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card-dark overflow-hidden">
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
          {surveys.map(s => (
            <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors" onClick={() => onViewDetail(s)}>
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
                  <button onClick={(e) => { e.stopPropagation(); onEdit(s); }} className="rounded-lg p-2 text-white/30 hover:bg-white/5 hover:text-white transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onViewDetail(s); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
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
    </div>
  );
};

export default DashboardHistory;
