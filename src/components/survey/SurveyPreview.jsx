import React, { useState, useEffect } from 'react';
import { X, QrCode, BarChart3, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { generateResponseId } from '../../utils/surveyTemplates';
import SurveyBlock from './SurveyBlock';
import SurveyPreviewQR from './SurveyPreviewQR';
import SurveyPreviewResults from './SurveyPreviewResults';
import SurveyPreviewCompleted from './SurveyPreviewCompleted';

const SurveyPreview = ({ survey, onClose }) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [allResponses, setAllResponses] = useState([]);

  const questionBlocks = survey?.blocks.filter(b => {
    return ['SINGLE_CHOICE', 'MULTI_CHOICE', 'RATING', 'NPS', 'TEXT_INPUT', 'YES_NO', 'SOLUTION_TEST'].includes(b.type);
  }) || [];

  useEffect(() => {
    const savedResponses = localStorage.getItem(`survey_responses_${survey?.id}`);
    if (savedResponses) setAllResponses(JSON.parse(savedResponses));
  }, [survey?.id]);

  const handleResponse = (blockId, value) => {
    setResponses(prev => ({ ...prev, [blockId]: value }));
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

  const handleNewResponse = () => {
    setIsCompleted(false);
    setCurrentStep(0);
    setResponses({});
  };

  const progress = questionBlocks.length > 0 ? ((currentStep + 1) / questionBlocks.length) * 100 : 0;

  if (showQR) {
    return <SurveyPreviewQR surveyId={survey?.id} onBack={() => setShowQR(false)} />;
  }

  if (showResults) {
    return <SurveyPreviewResults survey={survey} allResponses={allResponses} onBack={() => setShowResults(false)} />;
  }

  if (isCompleted) {
    return (
      <SurveyPreviewCompleted
        survey={survey}
        onClose={onClose}
        onNewResponse={handleNewResponse}
        onShowResults={() => setShowResults(true)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0B] flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <button onClick={onClose} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
          <X className="h-5 w-5" />
        </button>
        <h2 className="font-['Syne'] font-bold text-sm">{survey.title}</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowQR(true)} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <QrCode className="h-5 w-5" />
          </button>
          <button onClick={() => setShowResults(true)} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <BarChart3 className="h-5 w-5" />
          </button>
        </div>
      </header>

      {survey.settings?.showProgressBar && questionBlocks.length > 0 && (
        <div className="h-1 bg-white/10">
          <div className="h-full bg-gradient-to-r from-[#00D4FF] to-[#0A66C2] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg mx-auto">
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
