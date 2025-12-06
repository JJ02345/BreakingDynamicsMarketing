import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Copy, Check, BarChart3 } from 'lucide-react';
import { LINKEDIN_LIMITS } from '../../lib/postCompiler';

const EditorResultView = ({
  result,
  postStats,
  blocks,
  copied,
  isAuthenticated,
  onCopy,
  onShareLinkedIn,
  onNewSurvey,
  t
}) => {
  const hasPoll = blocks.some(b => b.type === 'POLL' && b.data?.q?.trim());

  return (
    <div className="min-h-screen h-screen bg-[#0A0A0B] p-6 flex items-center justify-center overflow-auto">
      <div className="w-full max-w-xl card-dark p-8 animate-scale-in">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-[#00E676]" />
          </div>
          <div>
            <h2 className="font-['Syne'] text-2xl font-bold text-white">{t('editor.done')}</h2>
            <p className="text-white/40 text-sm">{t('editor.postReady')}</p>
          </div>
        </div>

        <div className="mb-4 rounded-xl bg-[#1A1A1D] border border-white/10 p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm text-white/80">{result}</pre>
        </div>

        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-white/40">{postStats.characters} / {postStats.maxCharacters} {t('editor.charCount')}</span>
          <span className={`font-medium ${postStats.characters > LINKEDIN_LIMITS.POST_TEXT ? 'text-red-400' : 'text-[#00E676]'}`}>
            {postStats.characters > LINKEDIN_LIMITS.POST_TEXT ? t('editor.linkedInLimit') : 'LinkedIn Ready'}
          </span>
        </div>

        <button onClick={onShareLinkedIn} className="btn-linkedin w-full mb-3">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          {t('editor.shareToLinkedIn')}
        </button>

        {hasPoll && (
          <div className="mb-4 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#0A66C2]/20">
                <BarChart3 className="h-4 w-4 text-[#0A66C2]" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm mb-2">{t('editor.pollInstructions')}</h4>
                <ol className="text-xs text-white/60 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0A66C2]/20 text-[10px] font-bold text-[#0A66C2]">1</span>
                    <span>{t('editor.pollStep1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0A66C2]/20 text-[10px] font-bold text-[#0A66C2]">2</span>
                    <span>{t('editor.pollStep2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0A66C2]/20 text-[10px] font-bold text-[#0A66C2]">3</span>
                    <span>{t('editor.pollStep3')}</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <button onClick={onCopy} className={copied ? "btn-success w-full mb-3" : "btn-secondary w-full mb-3"}>
          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          {copied ? t('editor.copied') : t('editor.copyText')}
        </button>

        <div className="flex gap-3">
          <button onClick={onNewSurvey} className="btn-ghost flex-1">{t('editor.newSurvey')}</button>
          {isAuthenticated && <Link to="/dashboard" className="btn-ghost flex-1">{t('nav.dashboard')}</Link>}
        </div>
      </div>
    </div>
  );
};

export default EditorResultView;
