import React from 'react';
import { ChevronLeft, BarChart3 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SurveyPreviewResults = ({ survey, allResponses, onBack }) => {
  const { language } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0B] flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <button
          onClick={onBack}
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
                <div key={response.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
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
};

export default SurveyPreviewResults;
