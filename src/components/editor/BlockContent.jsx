import React from 'react';
import { AlertCircle } from 'lucide-react';
import { INPUT_LIMITS } from '../../constants';
import { LINKEDIN_LIMITS } from '../../lib/postCompiler';

const BlockContent = function({ block: b, update, t }) {
  const cls = "w-full rounded-lg border border-white/10 bg-[#1A1A1D] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20";

  const renderTextareaWithLimit = (value, onChange, placeholder, limit, rows = 2, extraClass = '') => {
    const remaining = limit - (value?.length || 0);
    const isNearLimit = remaining < limit * 0.1;
    const isOverLimit = remaining < 0;

    return (
      <div className="relative">
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value.slice(0, limit))}
          placeholder={placeholder}
          className={cls + " resize-none " + extraClass}
          rows={rows}
          maxLength={limit}
        />
        <span className={`absolute bottom-2 right-2 text-xs ${isOverLimit ? 'text-red-400 font-bold' : isNearLimit ? 'text-[#FF6B35] font-medium' : 'text-white/30'}`}>
          {remaining}
        </span>
      </div>
    );
  };

  const renderInputWithLimit = (value, onChange, placeholder, limit, extraClass = '') => {
    const remaining = limit - (value?.length || 0);
    const isNearLimit = remaining < limit * 0.1;
    const isOverLimit = remaining < 0;

    return (
      <div className="relative">
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value.slice(0, limit))}
          placeholder={placeholder}
          className={cls + " " + extraClass}
          maxLength={limit}
        />
        <span className={`absolute top-1/2 right-3 -translate-y-1/2 text-xs ${isOverLimit ? 'text-red-400 font-bold' : isNearLimit ? 'text-[#FF6B35] font-medium' : 'text-white/30'}`}>
          {remaining}
        </span>
      </div>
    );
  };

  if (b.type === 'TITLE') {
    return renderTextareaWithLimit(
      b.data.text,
      (val) => update(b.id, { text: val }),
      t('editor.postTitle'),
      INPUT_LIMITS.TITLE,
      2
    );
  }

  if (b.type === 'CHALLENGE') {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2 rounded-lg bg-purple-500/10 border border-purple-500/20 p-3 text-xs text-purple-400">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: t('editor.challengeInfo').replace('NOT', '<strong class="text-purple-300">NOT</strong>').replace('NICHT', '<strong class="text-purple-300">NICHT</strong>') }} />
        </div>
        {renderTextareaWithLimit(
          b.data.text,
          (val) => update(b.id, { text: val }),
          t('editor.challengePlaceholder'),
          INPUT_LIMITS.CHALLENGE,
          5,
          '!border-purple-500/30 focus:!border-purple-500 focus:!ring-purple-500/20'
        )}
      </div>
    );
  }

  if (b.type === 'POLL') {
    const questionLength = b.data.q?.length || 0;
    const questionOverLimit = questionLength > LINKEDIN_LIMITS.POLL_QUESTION;

    return (
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={b.data.q || ''}
            onChange={(e) => update(b.id, { q: e.target.value })}
            placeholder={t('editor.hypothesisQuestion')}
            className={cls + " resize-none " + (questionOverLimit ? '!border-red-500' : '')}
            rows={2}
          />
          <span className={`absolute bottom-2 right-2 text-xs ${questionOverLimit ? 'text-red-400 font-bold' : 'text-white/30'}`}>
            {LINKEDIN_LIMITS.POLL_QUESTION - questionLength}
          </span>
        </div>
        {questionOverLimit && (
          <p className="text-xs text-red-400">LinkedIn max: {LINKEDIN_LIMITS.POLL_QUESTION} Zeichen</p>
        )}
        <div className="grid grid-cols-2 gap-2">
          {b.data.opts?.map((o, i) => {
            const optLength = o?.length || 0;
            const optOverLimit = optLength > LINKEDIN_LIMITS.POLL_OPTION;
            return (
              <div key={i} className="relative">
                <input
                  value={o}
                  onChange={(e) => {
                    const opts = [...(b.data.opts || [])];
                    opts[i] = e.target.value;
                    update(b.id, { opts });
                  }}
                  placeholder={t('editor.option') + " " + (i + 1)}
                  className={cls + (optOverLimit ? ' !border-red-500' : '')}
                />
                <span className={`absolute top-1/2 right-2 -translate-y-1/2 text-xs ${optOverLimit ? 'text-red-400 font-bold' : 'text-white/30'}`}>
                  {LINKEDIN_LIMITS.POLL_OPTION - optLength}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (b.type === 'CTA') {
    return renderInputWithLimit(
      b.data.text,
      (val) => update(b.id, { text: val }),
      t('editor.ctaPlaceholder'),
      INPUT_LIMITS.CTA
    );
  }

  if (b.type === 'HASHTAG') {
    return renderInputWithLimit(
      b.data.tags,
      (val) => update(b.id, { tags: val }),
      t('editor.hashtagPlaceholder'),
      INPUT_LIMITS.HASHTAG
    );
  }

  if (b.type === 'CUSTOM') {
    return renderTextareaWithLimit(
      b.data.text,
      (val) => update(b.id, { text: val }),
      t('editor.customText'),
      INPUT_LIMITS.CUSTOM,
      2
    );
  }

  if (b.type === 'MENTION') {
    return renderInputWithLimit(
      b.data.text,
      (val) => update(b.id, { text: val }),
      t('editor.mentionPlaceholder'),
      INPUT_LIMITS.MENTION
    );
  }

  if (b.type === 'NUMBER') {
    return renderInputWithLimit(
      b.data.text,
      (val) => update(b.id, { text: val }),
      t('editor.numberPlaceholder'),
      INPUT_LIMITS.NUMBER
    );
  }

  if (b.type === 'DURATION') {
    const durLabels = {
      '1day': t('editor.duration1day'),
      '3days': t('editor.duration3days'),
      '1week': t('editor.duration1week')
    };
    return (
      <div className="flex gap-2">
        {Object.entries(durLabels).map(([v, l]) => (
          <label key={v} className={"flex-1 cursor-pointer rounded-lg border-2 py-3 text-center text-sm font-bold transition-all " + (b.data.val === v ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35]' : 'border-white/10 bg-[#1A1A1D] text-white/60 hover:border-white/20')}>
            <input type="radio" name={"dur-" + b.id} value={v} checked={b.data.val === v} onChange={(e) => update(b.id, { val: e.target.value })} className="sr-only" />{l}
          </label>
        ))}
      </div>
    );
  }

  if (b.type === 'DIVIDER') return (
    <div className="flex gap-2">
      {['line', 'stars'].map((s) => (
        <label key={s} className={"flex-1 cursor-pointer rounded-lg border-2 py-3 text-center text-sm font-bold transition-all " + (b.data.style === s ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35]' : 'border-white/10 bg-[#1A1A1D] text-white/60 hover:border-white/20')}>
          <input type="radio" name={"div-" + b.id} value={s} checked={b.data.style === s} onChange={(e) => update(b.id, { style: e.target.value })} className="sr-only" />{s === 'line' ? '────────' : '* * *'}
        </label>
      ))}
    </div>
  );

  if (b.type === 'SCHEDULE') return (
    <div className="flex gap-2">
      <input type="date" value={b.data.date || ''} onChange={(e) => update(b.id, { date: e.target.value })} className={cls + " flex-1"} />
      <input type="time" value={b.data.time || ''} onChange={(e) => update(b.id, { time: e.target.value })} className={cls + " w-32"} />
    </div>
  );

  return null;
};

export default BlockContent;
