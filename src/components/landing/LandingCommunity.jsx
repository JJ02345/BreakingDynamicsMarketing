import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingCommunity = () => {
  const { language } = useLanguage();
  const isDE = language === 'de';

  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-glow-center" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="badge-cyan mb-6 inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{isDE ? 'Bereit?' : 'Ready?'}</span>
        </div>
        <h2 className="font-['Syne'] text-4xl sm:text-5xl font-bold mb-6">
          {isDE ? 'Erstelle jetzt dein' : 'Create your'}
          <span className="text-gradient"> {isDE ? 'erstes Carousel' : 'first Carousel'}</span>
        </h2>
        <p className="text-white/50 text-lg mb-8">
          {isDE
            ? 'Keine Anmeldung, keine Kreditkarte. Einfach loslegen und in 2 Minuten dein erstes LinkedIn Carousel erstellen.'
            : 'No sign-up, no credit card. Just start and create your first LinkedIn carousel in 2 minutes.'}
        </p>

        <Link
          to="/carousel"
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B] hover:scale-105 hover:shadow-2xl hover:shadow-[#FF6B35]/30"
        >
          <Linkedin className="h-5 w-5" />
          {isDE ? 'Carousel erstellen' : 'Create Carousel'}
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default LandingCommunity;
