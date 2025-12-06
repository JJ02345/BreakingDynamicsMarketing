import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Edit3, X, FlaskConical, BarChart3, FileText } from 'lucide-react';
import { LINKEDIN_LIMITS } from '../../lib/postCompiler';
import { clean } from '../../utils/helpers';

const SurveyDetailModal = ({ survey: s, onClose, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const copyText = () => {
    navigator.clipboard.writeText(clean(s.text));
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
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

export default SurveyDetailModal;
