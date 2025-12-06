import React from 'react';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { BLOCKS } from '../../constants';
import BlockContent from './BlockContent';

const EditorBlockList = ({
  blocks,
  activeBlock,
  dragIdx,
  dragOverIdx,
  onBlockClick,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onDropFromSidebar,
  onDeleteBlock,
  onUpdateBlock,
  getBlockStyle,
  t
}) => {
  return (
    <div
      className="flex-1 overflow-y-auto p-4 bg-[#0A0A0B]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropFromSidebar(e)}
    >
      <div className="mx-auto max-w-xl space-y-3">
        {blocks.map((b, i) => {
          const isChallenge = b.type === 'CHALLENGE';
          const isDragging = dragIdx === i;
          const isDragOver = dragOverIdx === i;
          return (
            <div
              key={b.id}
              draggable
              onDragStart={(e) => onDragStart(e, i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, i)}
              onDragEnd={onDragEnd}
              onClick={() => onBlockClick(b.id)}
              className={
                "rounded-xl border-2 transition-all " +
                (isDragging ? 'opacity-50 scale-95 ' : '') +
                (isDragOver ? 'border-dashed !border-[#00D4FF] !bg-[#00D4FF]/5 ' : '') +
                (isDragging ? 'cursor-grabbing ' : 'cursor-grab ') +
                getBlockStyle(b.id, i)
              }
            >
              <div className={"flex items-center gap-2 border-b px-3 py-2.5 " +
                (activeBlock === b.id
                  ? (isChallenge ? 'border-purple-500/30 bg-purple-500/10' : 'border-[#FF6B35]/30 bg-[#FF6B35]/10')
                  : (isChallenge ? 'border-purple-500/20 bg-[#1A1A1D]' : 'border-white/5 bg-[#1A1A1D]'))}>
                <GripVertical className={"h-4 w-4 " + (isDragging ? 'text-[#FF6B35]' : 'text-white/30 hover:text-white/50')} />
                {React.createElement(BLOCKS[b.type].icon, { className: 'h-4 w-4 ' + (isChallenge ? 'text-purple-400' : 'text-white/50') })}
                <span className={"flex-1 text-xs font-bold uppercase tracking-wider " +
                  (activeBlock === b.id
                    ? (isChallenge ? 'text-purple-400' : 'text-[#FF6B35]')
                    : (isChallenge ? 'text-purple-400/70' : 'text-white/50'))}>{t('blocks.' + b.type)}</span>
                {isChallenge && (
                  <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-400">{t('editor.internal')}</span>
                )}
                {BLOCKS[b.type].req ? (
                  <span className="rounded bg-[#FF6B35]/20 px-2 py-0.5 text-xs font-bold text-[#FF6B35]">{t('editor.required')}</span>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); onDeleteBlock(b.id); }} className="rounded p-1 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="h-4 w-4 text-red-400/50 hover:text-red-400" />
                  </button>
                )}
              </div>
              <div className="p-3">
                <BlockContent block={b} update={onUpdateBlock} t={t} />
              </div>
            </div>
          );
        })}

        {dragIdx === null && (
          <div
            className="rounded-xl border-2 border-dashed border-white/10 bg-transparent p-6 text-center text-sm text-white/30 transition-all hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5 hover:text-[#FF6B35]"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('!border-[#FF6B35]', '!bg-[#FF6B35]/10'); }}
            onDragLeave={(e) => { e.currentTarget.classList.remove('!border-[#FF6B35]', '!bg-[#FF6B35]/10'); }}
            onDrop={(e) => { onDropFromSidebar(e); e.currentTarget.classList.remove('!border-[#FF6B35]', '!bg-[#FF6B35]/10'); }}
          >
            <Plus className="mx-auto mb-2 h-6 w-6" />
            {t('editor.dropHere')}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorBlockList;
