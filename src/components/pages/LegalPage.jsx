import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LegalPage = function({ title }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
          <button onClick={() => navigate('/')} className="btn-ghost flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">{t('nav.back')}</span>
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-['Syne'] mb-6 text-3xl font-bold text-white">{title}</h1>
        <div className="card-dark p-8">
          <p className="text-white/60">Dies ist ein Platzhaltertext für {title}.</p>
        </div>
      </main>
    </div>
  );
};

export default LegalPage;
