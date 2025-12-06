import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, X, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { LINKEDIN_LIMITS } from '../../lib/postCompiler';

const EditorFooter = ({
  email,
  setEmail,
  isAuthenticated,
  canGen,
  saving,
  saveError,
  postStats,
  onGenerate,
  t
}) => {
  const navigate = useNavigate();

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-[#111113] p-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('editor.emailAddress')}
        className="input-dark"
        disabled={isAuthenticated}
      />

      {saveError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {saveError}
        </div>
      )}

      {postStats.characters > LINKEDIN_LIMITS.POST_TEXT && (
        <div className="flex items-center gap-2 rounded-xl bg-[#FFAB00]/10 border border-[#FFAB00]/20 px-4 py-3 text-sm text-[#FFAB00]">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {t('warnings.postTooLong')}: {postStats.characters}/{LINKEDIN_LIMITS.POST_TEXT} {t('editor.charCount')}
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={!canGen || saving}
        className="btn-primary w-full"
      >
        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
        {saving ? t('editor.saving') : t('editor.createButton')}
      </button>
      <button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')} className="btn-secondary w-full">
        <X className="h-4 w-4" />{isAuthenticated ? t('editor.cancel') : t('editor.toHome')}
      </button>
    </div>
  );
};

export default EditorFooter;
