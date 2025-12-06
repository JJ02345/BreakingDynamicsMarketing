import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, ArrowLeft, Play, Save, Download, Trash2, Plus,
  Settings, Eye, Edit3, QrCode, Smartphone, BarChart3,
  FileText, Copy, CheckCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  SURVEY_TEMPLATES,
  createSurveyFromTemplate,
  createBlock,
  generateSurveyId,
} from '../../utils/surveyTemplates';
import SurveyBlock from './SurveyBlock';
import SurveyBlockPalette from './SurveyBlockPalette';
import SurveyPreview from './SurveyPreview';

const OfflineSurveyEditor = () => {
  const { t, language } = useLanguage();
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
    if (saved) {
      setSavedSurveys(JSON.parse(saved));
    }
  }, []);

  // Auto-save survey
  useEffect(() => {
    if (survey) {
      const updatedSurvey = { ...survey, updatedAt: new Date().toISOString() };
      const existingIndex = savedSurveys.findIndex(s => s.id === survey.id);

      let newSavedSurveys;
      if (existingIndex >= 0) {
        newSavedSurveys = [...savedSurveys];
        newSavedSurveys[existingIndex] = updatedSurvey;
      } else {
        newSavedSurveys = [...savedSurveys, updatedSurvey];
      }

      localStorage.setItem('offlineSurveys', JSON.stringify(newSavedSurveys));
      setSavedSurveys(newSavedSurveys);
      setIsSaved(true);

      const timeout = setTimeout(() => setIsSaved(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [survey?.blocks, survey?.title, survey?.settings]);

  const handleSelectTemplate = (templateId) => {
    const newSurvey = createSurveyFromTemplate(templateId);
    setSurvey(newSurvey);
    setShowTemplates(false);
  };

  const handleAddBlock = (blockType) => {
    if (!survey) return;
    const newBlock = createBlock(blockType);
    setSurvey({
      ...survey,
      blocks: [...survey.blocks, newBlock],
    });
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (blockId, newContent) => {
    setSurvey({
      ...survey,
      blocks: survey.blocks.map(b =>
        b.id === blockId ? { ...b, content: newContent } : b
      ),
    });
  };

  const handleDeleteBlock = (blockId) => {
    setSurvey({
      ...survey,
      blocks: survey.blocks.filter(b => b.id !== blockId),
    });
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
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
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === survey.blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...survey.blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];

    setSurvey({ ...survey, blocks: newBlocks });
  };

  const handleExportSurvey = () => {
    const dataStr = JSON.stringify(survey, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportName = `survey_${survey.id}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
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
      <div className="min-h-screen bg-[#0A0A0B] text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0A66C2]">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="font-['Syne'] font-bold">
                  {language === 'de' ? 'Offline Umfragen' : 'Offline Surveys'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-6 py-12">
          {/* Saved Surveys */}
          {savedSurveys.length > 0 && (
            <div className="mb-12">
              <h2 className="font-['Syne'] text-2xl font-bold mb-6">
                {language === 'de' ? 'Gespeicherte Umfragen' : 'Saved Surveys'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedSurveys.map((saved) => (
                  <div
                    key={saved.id}
                    className="group relative p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <button
                      onClick={() => handleLoadSurvey(saved)}
                      className="w-full text-left"
                    >
                      <h3 className="font-semibold text-white mb-1">{saved.title}</h3>
                      <p className="text-sm text-white/40">
                        {saved.blocks.length} {language === 'de' ? 'Blöcke' : 'blocks'}
                      </p>
                      <p className="text-xs text-white/30 mt-2">
                        {new Date(saved.updatedAt).toLocaleDateString()}
                      </p>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSurvey(saved.id);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Templates */}
          <h2 className="font-['Syne'] text-2xl font-bold mb-2">
            {language === 'de' ? 'Vorlage wählen' : 'Choose a Template'}
          </h2>
          <p className="text-white/50 mb-8">
            {language === 'de'
              ? 'Starte mit einer Vorlage für Problem- oder Ideen-Validierung'
              : 'Start with a template for problem or idea validation'}
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(SURVEY_TEMPLATES).map(([key, template]) => {
              const Icon = template.icon;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectTemplate(key)}
                  className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${template.color}10 0%, transparent 50%)`,
                    }}
                  />
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{
                        background: `${template.color}15`,
                        border: `1px solid ${template.color}30`,
                      }}
                    >
                      <Icon className="h-6 w-6" style={{ color: template.color }} />
                    </div>
                    <h3 className="font-['Syne'] text-lg font-bold mb-2">
                      {language === 'de' ? template.nameDE : template.name}
                    </h3>
                    <p className="text-sm text-white/50">
                      {language === 'de' ? template.descriptionDE : template.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
                      <span>{template.defaultBlocks.length} blocks</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Preview Mode
  if (showPreview) {
    return (
      <SurveyPreview
        survey={survey}
        onClose={() => setShowPreview(false)}
      />
    );
  }

  // Editor View
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={survey?.title || ''}
              onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
              className="bg-transparent font-['Syne'] font-bold text-lg focus:outline-none border-b border-transparent hover:border-white/20 focus:border-[#00D4FF]/50 transition-colors px-1"
              placeholder="Survey Title..."
            />
            {isSaved && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <CheckCircle className="h-3 w-3" />
                Saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2.5 rounded-lg transition-colors ${
                showSettings ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={handleExportSurvey}
              className="p-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#0A66C2] text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Eye className="h-4 w-4" />
              {language === 'de' ? 'Vorschau' : 'Preview'}
            </button>
          </div>
        </div>
      </header>

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
          <aside className="w-80 border-l border-white/5 h-[calc(100vh-4rem)] overflow-y-auto p-4 bg-[#0A0A0B]">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
              {language === 'de' ? 'Umfrage-Einstellungen' : 'Survey Settings'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
                  {language === 'de' ? 'Titel' : 'Title'}
                </label>
                <input
                  type="text"
                  value={survey?.title || ''}
                  onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#00D4FF]/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
                  {language === 'de' ? 'Beschreibung' : 'Description'}
                </label>
                <textarea
                  value={survey?.description || ''}
                  onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#00D4FF]/50 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="flex items-center gap-3 text-sm text-white/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={survey?.settings?.showProgressBar}
                    onChange={(e) =>
                      setSurvey({
                        ...survey,
                        settings: { ...survey.settings, showProgressBar: e.target.checked },
                      })
                    }
                    className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
                  />
                  {language === 'de' ? 'Fortschrittsbalken anzeigen' : 'Show progress bar'}
                </label>

                <label className="flex items-center gap-3 text-sm text-white/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={survey?.settings?.allowBack}
                    onChange={(e) =>
                      setSurvey({
                        ...survey,
                        settings: { ...survey.settings, allowBack: e.target.checked },
                      })
                    }
                    className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
                  />
                  {language === 'de' ? 'Zurück-Navigation erlauben' : 'Allow back navigation'}
                </label>

                <label className="flex items-center gap-3 text-sm text-white/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={survey?.settings?.shuffleQuestions}
                    onChange={(e) =>
                      setSurvey({
                        ...survey,
                        settings: { ...survey.settings, shuffleQuestions: e.target.checked },
                      })
                    }
                    className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]/50"
                  />
                  {language === 'de' ? 'Fragen mischen' : 'Shuffle questions'}
                </label>
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
                  {language === 'de' ? 'Danke-Nachricht' : 'Thank You Message'}
                </label>
                <textarea
                  value={survey?.settings?.thankYouMessage || ''}
                  onChange={(e) =>
                    setSurvey({
                      ...survey,
                      settings: { ...survey.settings, thankYouMessage: e.target.value },
                    })
                  }
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#00D4FF]/50 focus:outline-none resize-none"
                />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default OfflineSurveyEditor;
