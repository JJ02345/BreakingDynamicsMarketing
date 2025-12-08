import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, Plus, Sparkles, Share2, Eye, Save, Settings,
  Loader2, CheckCircle, Copy, ExternalLink, Palette, Globe
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../lib/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createSurveyFromTemplate, createBlock } from '../../utils/surveyTemplates';
import SurveyBlock from './SurveyBlock';
import SurveyBlockPalette from './SurveyBlockPalette';
import SurveyPreview from './SurveyPreview';
import OnlineSurveyTemplates from './OnlineSurveyTemplates';
import OnlineSurveyStylePanel from './OnlineSurveyStylePanel';
import AISurveyGeneratorModal from './AIsurveyGeneratorModal';

const OnlineSurveyEditor = () => {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const isDE = language === 'de';

  const [survey, setSurvey] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleSelectTemplate = (templateId) => {
    const newSurvey = createSurveyFromTemplate(templateId);
    // Add default styling
    newSurvey.settings = {
      ...newSurvey.settings,
      theme: 'dark',
      accentColor: '#00D4FF',
      backgroundColor: '#0A0A0B',
      fontFamily: "'Space Grotesk', sans-serif",
      borderRadius: 'lg',
      showBranding: true,
    };
    setSurvey(newSurvey);
    setShowTemplates(false);
  };

  const handleAIGenerated = (generatedSurvey) => {
    setSurvey(generatedSurvey);
    setShowTemplates(false);
    addToast(isDE ? 'Umfrage erfolgreich generiert!' : 'Survey generated successfully!', 'success');
  };

  const handleAddBlock = (blockType) => {
    if (!survey) return;
    const newBlock = createBlock(blockType);
    setSurvey({ ...survey, blocks: [...survey.blocks, newBlock] });
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (blockId, newContent) => {
    setSurvey({
      ...survey,
      blocks: survey.blocks.map(b => b.id === blockId ? { ...b, content: newContent } : b),
    });
  };

  const handleDeleteBlock = (blockId) => {
    setSurvey({ ...survey, blocks: survey.blocks.filter(b => b.id !== blockId) });
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  };

  const handleDuplicateBlock = (blockId) => {
    const block = survey.blocks.find(b => b.id === blockId);
    if (!block) return;

    const newBlock = {
      ...block,
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: { ...block.content },
    };

    const index = survey.blocks.findIndex(b => b.id === blockId);
    const newBlocks = [...survey.blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setSurvey({ ...survey, blocks: newBlocks });
  };

  const handleMoveBlock = (blockId, direction) => {
    const index = survey.blocks.findIndex(b => b.id === blockId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === survey.blocks.length - 1)) return;

    const newBlocks = [...survey.blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setSurvey({ ...survey, blocks: newBlocks });
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      addToast(isDE ? 'Bitte melde dich an um zu speichern' : 'Please login to save', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      addToast(isDE ? 'Umfrage gespeichert!' : 'Survey saved!', 'success');
    } catch (error) {
      addToast(isDE ? 'Fehler beim Speichern' : 'Error saving survey', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    // Generate shareable URL
    const url = `${window.location.origin}/s/${survey.id}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
    addToast(isDE ? 'Link kopiert!' : 'Link copied!', 'success');
  };

  const handleUpdateStyle = (key, value) => {
    setSurvey({
      ...survey,
      settings: { ...survey.settings, [key]: value }
    });
  };

  // Template Selection View
  if (showTemplates) {
    return (
      <>
        <OnlineSurveyTemplates
          onSelectTemplate={handleSelectTemplate}
          onOpenAI={() => setShowAIGenerator(true)}
        />
        <AISurveyGeneratorModal
          isOpen={showAIGenerator}
          onClose={() => setShowAIGenerator(false)}
          onGenerated={handleAIGenerated}
        />
      </>
    );
  }

  // Preview Mode
  if (showPreview) {
    return <SurveyPreview survey={survey} onClose={() => setShowPreview(false)} />;
  }

  // Editor View
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
            >
              <Home className="h-4 w-4 text-[#00D4FF]" />
              <span className="text-sm font-medium text-white hidden sm:inline">
                {isAuthenticated ? 'Dashboard' : (isDE ? 'Zurück' : 'Back')}
              </span>
            </Link>
            <input
              type="text"
              value={survey?.title || ''}
              onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
              className="bg-transparent font-['Syne'] font-bold text-lg focus:outline-none border-b border-transparent hover:border-white/20 focus:border-[#00D4FF]/50 transition-colors px-1"
              placeholder={isDE ? 'Umfrage Titel...' : 'Survey Title...'}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* AI Generator Button */}
            <button
              onClick={() => setShowAIGenerator(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#0A66C2]/10 border border-[#00D4FF]/30 hover:border-[#00D4FF]/50 text-[#00D4FF] transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">KI</span>
            </button>

            {/* Style Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2.5 rounded-lg transition-colors ${
                showSettings ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Palette className="h-5 w-5" />
            </button>

            {/* Preview Button */}
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">{isDE ? 'Vorschau' : 'Preview'}</span>
            </button>

            {/* Save Button */}
            {isAuthenticated && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span className="hidden sm:inline">{isDE ? 'Speichern' : 'Save'}</span>
              </button>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#0A66C2] text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">{isDE ? 'Teilen' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Share URL Bar */}
        {shareUrl && (
          <div className="flex items-center gap-2 px-6 py-2 bg-[#00D4FF]/10 border-t border-[#00D4FF]/20">
            <Globe className="h-4 w-4 text-[#00D4FF]" />
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-white/70 focus:outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                addToast(isDE ? 'Kopiert!' : 'Copied!', 'success');
              }}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
            >
              <Copy className="h-4 w-4 text-[#00D4FF]" />
            </button>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-[#00D4FF]" />
            </a>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Left Sidebar - Block Palette */}
        <aside className="w-72 border-r border-white/5 h-[calc(100vh-4rem)] overflow-y-auto p-4 bg-[#0A0A0B]">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
            {isDE ? 'Blöcke hinzufügen' : 'Add Blocks'}
          </h3>
          <SurveyBlockPalette onAddBlock={handleAddBlock} />
        </aside>

        {/* Main Content - Blocks */}
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto space-y-4">
            {survey?.blocks.map((block, index) => (
              <SurveyBlock
                key={block.id}
                block={block}
                index={index}
                totalBlocks={survey.blocks.length}
                isSelected={selectedBlockId === block.id}
                isEditing={true}
                onSelect={setSelectedBlockId}
                onChange={handleUpdateBlock}
                onDelete={handleDeleteBlock}
                onDuplicate={handleDuplicateBlock}
                onMoveUp={(id) => handleMoveBlock(id, 'up')}
                onMoveDown={(id) => handleMoveBlock(id, 'down')}
                accentColor={survey.settings?.accentColor || '#00D4FF'}
              />
            ))}

            {survey?.blocks.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-white/30" />
                </div>
                <p className="text-white/40">
                  {isDE
                    ? 'Füge Blöcke aus der linken Seitenleiste hinzu'
                    : 'Add blocks from the left sidebar'}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Style Settings */}
        {showSettings && (
          <OnlineSurveyStylePanel
            settings={survey?.settings || {}}
            onUpdate={handleUpdateStyle}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>

      {/* AI Generator Modal */}
      <AISurveyGeneratorModal
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onGenerated={handleAIGenerated}
      />
    </div>
  );
};

export default OnlineSurveyEditor;
