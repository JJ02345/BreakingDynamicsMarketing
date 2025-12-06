import React, { useState, useEffect } from 'react';
import {
  X, ChevronLeft, ChevronRight, QrCode, Smartphone, Share2,
  Download, BarChart3, CheckCircle, ArrowRight, Copy
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { generateResponseId } from '../../utils/surveyTemplates';
import SurveyBlock from './SurveyBlock';

const SurveyPreview = ({ survey, onClose }) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [allResponses, setAllResponses] = useState([]);
  const [copied, setCopied] = useState(false);

  // Get question blocks only (for step navigation)
  const questionBlocks = survey?.blocks.filter(b => {
    const type = b.type;
    return ['SINGLE_CHOICE', 'MULTI_CHOICE', 'RATING', 'NPS', 'TEXT_INPUT', 'YES_NO', 'SOLUTION_TEST'].includes(type);
  }) || [];

  // Get content blocks that should show before each question
  const getBlocksForStep = (stepIndex) => {
    if (!survey?.blocks) return [];

    // For step-by-step mode, we'll show one question at a time
    // Find the nth question and show all preceding content blocks
    let questionCount = 0;
    const blocksToShow = [];

    for (const block of survey.blocks) {
      const isQuestion = ['SINGLE_CHOICE', 'MULTI_CHOICE', 'RATING', 'NPS', 'TEXT_INPUT', 'YES_NO', 'SOLUTION_TEST'].includes(block.type);

      if (isQuestion) {
        if (questionCount === stepIndex) {
          blocksToShow.push(block);
          break;
        }
        questionCount++;
        blocksToShow.length = 0; // Reset content blocks for next question
      } else {
        // For step 0, include header blocks
        if (stepIndex === 0 || blocksToShow.length > 0) {
          blocksToShow.push(block);
        }
        // Always include content blocks right before the target question
        if (questionCount === stepIndex) {
          blocksToShow.push(block);
        }
      }
    }

    return blocksToShow;
  };

  // Load existing responses from localStorage
  useEffect(() => {
    const savedResponses = localStorage.getItem(`survey_responses_${survey?.id}`);
    if (savedResponses) {
      setAllResponses(JSON.parse(savedResponses));
    }
  }, [survey?.id]);

  const handleResponse = (blockId, value) => {
    setResponses(prev => ({
      ...prev,
      [blockId]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < questionBlocks.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const newResponse = {
      id: generateResponseId(),
      surveyId: survey.id,
      responses,
      submittedAt: new Date().toISOString(),
    };

    const updatedResponses = [...allResponses, newResponse];
    setAllResponses(updatedResponses);
    localStorage.setItem(`survey_responses_${survey.id}`, JSON.stringify(updatedResponses));
    setIsCompleted(true);
  };

  const handleCopyLink = () => {
    // In a real app, this would be a shareable link
    const demoLink = `${window.location.origin}/survey/${survey.id}`;
    navigator.clipboard.writeText(demoLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progress = questionBlocks.length > 0
    ? ((currentStep + 1) / questionBlocks.length) * 100
    : 0;

  // QR Code View
  if (showQR) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0B] flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <button
            onClick={() => setShowQR(false)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="font-['Syne'] font-bold">
            {language === 'de' ? 'QR-Code teilen' : 'Share QR Code'}
          </h2>
          <div className="w-9" />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Placeholder QR Code - in production, use a QR library */}
          <div className="w-64 h-64 bg-white rounded-2xl flex items-center justify-center mb-6">
            <div className="text-center p-4">
              <QrCode className="h-32 w-32 text-[#0A0A0B] mx-auto mb-2" />
              <p className="text-xs text-gray-500">QR Code Placeholder</p>
            </div>
          </div>

          <p className="text-white/60 text-center mb-6 max-w-sm">
            {language === 'de'
              ? 'Scanne diesen Code, um die Umfrage auf einem mobilen Gerät zu öffnen'
              : 'Scan this code to open the survey on a mobile device'}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? (language === 'de' ? 'Kopiert!' : 'Copied!') : (language === 'de' ? 'Link kopieren' : 'Copy Link')}
            </button>
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <Download className="h-4 w-4" />
              {language === 'de' ? 'QR speichern' : 'Save QR'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  if (showResults) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0B] flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <button
            onClick={() => setShowResults(false)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="font-['Syne'] font-bold">
            {language === 'de' ? 'Ergebnisse' : 'Results'}
          </h2>
          <div className="w-9" />
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#00D4FF]/10 to-[#0A66C2]/5 border border-[#00D4FF]/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#00D4FF]/20 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-[#00D4FF]" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{allResponses.length}</p>
                  <p className="text-white/60">
                    {language === 'de' ? 'Antworten gesammelt' : 'Responses collected'}
                  </p>
                </div>
              </div>
            </div>

            {allResponses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/40">
                  {language === 'de' ? 'Noch keine Antworten' : 'No responses yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allResponses.map((response, index) => (
                  <div
                    key={response.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-white/40">
                        {language === 'de' ? 'Antwort' : 'Response'} #{index + 1}
                      </span>
                      <span className="text-xs text-white/30">
                        {new Date(response.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(response.responses).map(([blockId, value]) => {
                        const block = survey.blocks.find(b => b.id === blockId);
                        return (
                          <div key={blockId} className="text-sm">
                            <span className="text-white/40">{block?.content?.question || 'Question'}:</span>
                            <span className="text-white ml-2">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Completed View
  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0B] flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="w-9" />
          <h2 className="font-['Syne'] font-bold">{survey.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="font-['Syne'] text-2xl font-bold mb-3">
            {language === 'de' ? 'Vielen Dank!' : 'Thank You!'}
          </h2>
          <p className="text-white/60 text-center max-w-sm mb-8">
            {survey.settings?.thankYouMessage || (language === 'de' ? 'Ihre Antwort wurde gespeichert.' : 'Your response has been saved.')}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsCompleted(false);
                setCurrentStep(0);
                setResponses({});
              }}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              {language === 'de' ? 'Neue Antwort' : 'New Response'}
            </button>
            <button
              onClick={() => setShowResults(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00D4FF] text-white hover:opacity-90 transition-opacity"
            >
              <BarChart3 className="h-4 w-4" />
              {language === 'de' ? 'Ergebnisse' : 'View Results'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Survey Preview/Response View
  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0B] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="font-['Syne'] font-bold text-sm">{survey.title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQR(true)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <QrCode className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowResults(true)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      {survey.settings?.showProgressBar && questionBlocks.length > 0 && (
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#0A66C2] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg mx-auto">
          {/* Show all blocks at once (scroll mode) or step by step */}
          {survey?.blocks.map((block, index) => (
            <SurveyBlock
              key={block.id}
              block={block}
              index={index}
              totalBlocks={survey.blocks.length}
              isPreview={true}
              response={responses[block.id]}
              onResponse={(value) => handleResponse(block.id, value)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="text-sm text-white/40">
            {allResponses.length} {language === 'de' ? 'Antworten' : 'responses'}
          </div>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0A66C2] text-white font-medium hover:opacity-90 transition-opacity"
          >
            {language === 'de' ? 'Absenden' : 'Submit'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SurveyPreview;
