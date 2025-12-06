import React, { useState } from 'react';
import { ChevronLeft, QrCode, CheckCircle, Copy, Download } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SurveyPreviewQR = ({ surveyId, onBack }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const demoLink = `${window.location.origin}/survey/${surveyId}`;
    navigator.clipboard.writeText(demoLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          {language === 'de' ? 'QR-Code teilen' : 'Share QR Code'}
        </h2>
        <div className="w-9" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
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
};

export default SurveyPreviewQR;
