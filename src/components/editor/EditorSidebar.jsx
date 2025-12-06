import React from 'react';
import { Plus, GripVertical } from 'lucide-react';
import { BLOCKS } from '../../constants';

const EditorSidebar = ({
  sidebar,
  setSidebar,
  addBlock,
  onSidebarDragStart,
  t
}) => {
  return (
    <div className={"flex flex-shrink-0 flex-col border-r border-white/5 bg-[#111113] transition-all " + (sidebar ? 'w-72' : 'w-12')}>
      <button
        onClick={() => setSidebar(!sidebar)}
        className={"flex items-center justify-center border-b border-white/5 p-3 transition-all " + (sidebar ? 'bg-[#FF6B35] text-[#0A0A0B]' : 'text-white/50 hover:bg-white/5 hover:text-white')}
      >
        <Plus className={"h-5 w-5 transition-transform " + (sidebar ? 'rotate-45' : '')} />
      </button>
      {sidebar && (
        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/30 text-center">{t('editor.blocks')}</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(BLOCKS).map(([k, v]) => {
              const isChallenge = k === 'CHALLENGE';
              const isRequired = v.req;
              return (
                <button
                  key={k}
                  onClick={() => { if (!isRequired) addBlock(k); }}
                  disabled={isRequired}
                  draggable={!isRequired}
                  onDragStart={(e) => { if (!isRequired) onSidebarDragStart(e, k); }}
                  className={
                    "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 text-center transition-all aspect-square " +
                    (isRequired
                      ? 'cursor-not-allowed opacity-30 bg-white/5'
                      : isChallenge
                        ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/40 hover:scale-105 cursor-grab active:cursor-grabbing active:scale-95'
                        : 'bg-white/5 border border-white/10 text-white/60 hover:bg-[#FF6B35]/10 hover:border-[#FF6B35]/40 hover:text-[#FF6B35] hover:scale-105 cursor-grab active:cursor-grabbing active:scale-95')
                  }
                  title={t('blocks.' + k)}
                >
                  <v.icon className={
                    "h-5 w-5 transition-transform group-hover:scale-110 " +
                    (isChallenge ? 'text-purple-400' : 'group-hover:text-[#FF6B35]')
                  } />
                  <span className="text-[10px] font-medium leading-tight truncate w-full">
                    {t('blocks.' + k).split(' ')[0]}
                  </span>
                  {isChallenge && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/20">
            <GripVertical className="h-3 w-3" />
            <span>Drag & Drop</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorSidebar;
