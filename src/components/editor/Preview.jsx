import React from 'react';
import { Lightbulb } from 'lucide-react';
import { toBoldUnicode } from '../../lib/postCompiler';

const Preview = function({ blocks, mobile }) {
  const visibleBlocks = blocks.filter(b => b.type !== 'CHALLENGE');
  const has = visibleBlocks.some(b => b.data.text || b.data.q || b.data.tags);

  return (
    <div className={"rounded-2xl border border-white/10 bg-[#1A1A1D] shadow-xl " + (mobile ? 'text-xs' : 'text-sm')}>
      {mobile && <div className="flex justify-center border-b border-white/5 py-2"><div className="h-1 w-16 rounded-full bg-white/20"></div></div>}
      <div className="p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] text-lg font-bold text-[#0A0A0B]">LM</div>
          <div>
            <p className="font-bold text-white">Lea Meier</p>
            <p className="text-xs text-white/40">Startup Gründerin</p>
          </div>
        </div>
        {has ? visibleBlocks.map(b => {
          if (b.type === 'TITLE' && b.data.text) return <p key={b.id} className="mb-3 text-white/80 font-bold">{toBoldUnicode(b.data.text)}</p>;
          if (b.type === 'POLL' && b.data.q) return (
            <div key={b.id} className="mb-3 rounded-xl border border-white/10 bg-[#111113] p-3">
              <p className="mb-2 font-semibold text-white">{b.data.q}</p>
              {b.data.opts?.filter(Boolean).map((o, i) => <div key={i} className="mb-1.5 rounded-lg border border-white/10 bg-[#1A1A1D] px-3 py-2 text-white/70">{o}</div>)}
            </div>
          );
          if (b.type === 'CTA' && b.data.text) return <p key={b.id} className="mb-3 font-semibold text-[#FF6B35]">{b.data.text}</p>;
          if (b.type === 'HASHTAG' && b.data.tags) return <p key={b.id} className="mb-3 text-[#00D4FF]">{b.data.tags}</p>;
          if (b.type === 'CUSTOM' && b.data.text) return <p key={b.id} className="mb-3 text-white/70">{b.data.text}</p>;
          if (b.type === 'NUMBER' && b.data.text) return <p key={b.id} className="mb-3 text-white/70">{b.data.text}</p>;
          if (b.type === 'DIVIDER') return <div key={b.id} className="mb-3 text-center text-white/30">{b.data.style === 'stars' ? '* * *' : '----------'}</div>;
          return null;
        }) : (
          <div className="py-12 text-center text-white/30">
            <Lightbulb className="mx-auto mb-2 h-10 w-10 opacity-50" />
            <p>Füge Bausteine hinzu...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
