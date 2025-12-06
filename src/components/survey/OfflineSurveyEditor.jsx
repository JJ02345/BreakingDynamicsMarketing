import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { createSurveyFromTemplate, createBlock } from '../../utils/surveyTemplates';
import SurveyBlock from './SurveyBlock';
import SurveyBlockPalette from './SurveyBlockPalette';
import SurveyPreview from './SurveyPreview';
import OfflineSurveyHeader from './OfflineSurveyHeader';
import OfflineSurveyTemplates from './OfflineSurveyTemplates';
import OfflineSurveySettingsPanel from './OfflineSurveySettingsPanel';

const OfflineSurveyEditor = () => {
  const { language } = useLanguage();
  const [survey, setSurvey] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedSurveys, setSavedSurveys] = useState([]);

  // Load saved surveys from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('offlineSurveys');
    if (saved) setSavedSurveys(JSON.parse(saved));
  }, []);

  // Auto-save survey
  useEffect(() => {
    if (!survey) return;

    const updatedSurvey = { ...survey, updatedAt: new Date().toISOString() };
    const existingIndex = savedSurveys.findIndex(s => s.id === survey.id);

    const newSavedSurveys = existingIndex >= 0
      ? savedSurveys.map((s, i) => i === existingIndex ? updatedSurvey : s)
      : [...savedSurveys, updatedSurvey];

    localStorage.setItem('offlineSurveys', JSON.stringify(newSavedSurveys));
    setSavedSurveys(newSavedSurveys);
    setIsSaved(true);

    const timeout = setTimeout(() => setIsSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [survey?.blocks, survey?.title, survey?.settings]);

  const handleSelectTemplate = (templateId) => {
    setSurvey(createSurveyFromTemplate(templateId));
    setShowTemplates(false);
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

  const handleExportSurvey = () => {
    const dataStr = JSON.stringify(survey, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `survey_${survey.id}.json`);
    link.click();
  };

  const handleLoadSurvey = (savedSurvey) => {
    setSurvey(savedSurvey);
    setShowTemplates(false);
  };

  const handleDeleteSurvey = (surveyId) => {
    const newSavedSurveys = savedSurveys.filter(s => s.id !== surveyId);
    localStorage.setItem('offlineSurveys', JSON.stringify(newSavedSurveys));
    setSavedSurveys(newSavedSurveys);
    if (survey?.id === surveyId) {
      setSurvey(null);
      setShowTemplates(true);
    }
  };

  // Template Selection View
  if (showTemplates) {
    return (
      <OfflineSurveyTemplates
        savedSurveys={savedSurveys}
        onSelectTemplate={handleSelectTemplate}
        onLoadSurvey={handleLoadSurvey}
        onDeleteSurvey={handleDeleteSurvey}
      />
    );
  }

  // Preview Mode
  if (showPreview) {
    return <SurveyPreview survey={survey} onClose={() => setShowPreview(false)} />;
  }

  // Editor View
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <OfflineSurveyHeader
        survey={survey}
        isSaved={isSaved}
        showSettings={showSettings}
        onTitleChange={(title) => setSurvey({ ...survey, title })}
        onBack={() => setShowTemplates(true)}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onExport={handleExportSurvey}
        onPreview={() => setShowPreview(true)}
      />

      <div className="flex">
        {/* Left Sidebar - Block Palette */}
        <aside className="w-72 border-r border-white/5 h-[calc(100vh-4rem)] overflow-y-auto p-4 bg-[#0A0A0B]">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
            {language === 'de' ? 'Blöcke hinzufügen' : 'Add Blocks'}
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
              />
            ))}

            {survey?.blocks.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-white/30" />
                </div>
                <p className="text-white/40">
                  {language === 'de'
                    ? 'Füge Blöcke aus der linken Seitenleiste hinzu'
                    : 'Add blocks from the left sidebar'}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Settings */}
        {showSettings && (
          <OfflineSurveySettingsPanel survey={survey} onUpdate={setSurvey} />
        )}
      </div>
    </div>
  );
};

export default OfflineSurveyEditor;
