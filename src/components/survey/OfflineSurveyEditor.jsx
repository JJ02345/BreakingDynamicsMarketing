import React, { useState, useEffect } from 'react';
import { Plus, WifiOff, Download, Upload, Smartphone, QrCode } from 'lucide-react';
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
  const isDE = language === 'de';
  const [survey, setSurvey] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedSurveys, setSavedSurveys] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [collectedResponses, setCollectedResponses] = useState([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load collected responses from localStorage
  useEffect(() => {
    const responses = localStorage.getItem('offlineSurveyResponses');
    if (responses) setCollectedResponses(JSON.parse(responses));
  }, []);

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

  // Export responses as CSV
  const handleExportResponses = () => {
    if (!survey?.responses || survey.responses.length === 0) {
      alert(isDE ? 'Keine Antworten zum Exportieren' : 'No responses to export');
      return;
    }

    const headers = survey.blocks
      .filter(b => ['SINGLE_CHOICE', 'MULTI_CHOICE', 'RATING', 'NPS', 'TEXT_INPUT', 'YES_NO'].includes(b.type))
      .map(b => b.content.question || b.type);

    const rows = survey.responses.map(response => {
      return headers.map((_, i) => {
        const answer = response.answers[i];
        return typeof answer === 'object' ? JSON.stringify(answer) : String(answer || '');
      });
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `responses_${survey.id}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Import survey from JSON file
  const handleImportSurvey = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.blocks && imported.id) {
          setSurvey(imported);
          setShowTemplates(false);
        } else {
          alert(isDE ? 'Ungültiges Umfrage-Format' : 'Invalid survey format');
        }
      } catch (err) {
        alert(isDE ? 'Fehler beim Importieren' : 'Error importing file');
      }
    };
    reader.readAsText(file);
  };

  // Start data collection mode (kiosk mode)
  const handleStartCollection = () => {
    setShowPreview(true);
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
      {/* Offline Status Banner */}
      {isOffline && (
        <div className="bg-[#00D4FF]/10 border-b border-[#00D4FF]/20 px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-[#00D4FF] text-sm">
            <WifiOff className="h-4 w-4" />
            <span>{isDE ? 'Offline-Modus aktiv - Alle Daten werden lokal gespeichert' : 'Offline mode active - All data saved locally'}</span>
          </div>
        </div>
      )}

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
          {/* Offline Actions */}
          <div className="mb-6 p-3 rounded-xl bg-[#00D4FF]/5 border border-[#00D4FF]/20">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="h-4 w-4 text-[#00D4FF]" />
              <span className="text-sm font-medium text-white">
                {isDE ? 'Offline Sammlung' : 'Offline Collection'}
              </span>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleStartCollection}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#00D4FF] text-white text-sm font-medium hover:bg-[#00D4FF]/90 transition-colors"
              >
                <QrCode className="h-4 w-4" />
                {isDE ? 'Sammlung starten' : 'Start Collection'}
              </button>
              {survey?.responses?.length > 0 && (
                <button
                  onClick={handleExportResponses}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  {isDE ? `${survey.responses.length} Antworten exportieren` : `Export ${survey.responses.length} responses`}
                </button>
              )}
            </div>
          </div>

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
