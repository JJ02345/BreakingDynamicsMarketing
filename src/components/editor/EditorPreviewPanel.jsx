import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import Preview from './Preview';

const EditorPreviewPanel = ({ blocks, previewMode, setPreviewMode, t }) => {
  return (
    <div className="hidden w-80 flex-col border-l border-white/5 bg-[#111113] lg:flex">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <p className="text-sm font-bold uppercase tracking-wider text-white/50">{t('editor.preview')}</p>
        <div className="flex rounded-lg border border-white/10 bg-[#1A1A1D] p-1">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={"rounded p-1.5 transition-colors " + (previewMode === 'desktop' ? 'bg-[#FF6B35] text-[#0A0A0B]' : 'text-white/40 hover:text-white')}
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={"rounded p-1.5 transition-colors " + (previewMode === 'mobile' ? 'bg-[#FF6B35] text-[#0A0A0B]' : 'text-white/40 hover:text-white')}
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <Preview blocks={blocks} mobile={previewMode === 'mobile'} />
      </div>
    </div>
  );
};

export default EditorPreviewPanel;
