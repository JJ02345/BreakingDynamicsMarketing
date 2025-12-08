import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Construction } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const WorkInProgress = function() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] shadow-lg shadow-[#FF6B35]/20">
              <Zap className="h-6 w-6 text-[#0A0A0B]" />
            </div>
            <div>
              <p className="font-['Syne'] text-lg font-bold tracking-tight">Breaking Dynamics</p>
              <p className="text-xs font-medium text-[#FF6B35] tracking-wider uppercase">Survey Marketing</p>
            </div>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          {/* Icon */}
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-[#FF6B35]/10 border border-[#FF6B35]/20">
            <Construction className="h-12 w-12 text-[#FF6B35]" />
          </div>

          {/* Headline */}
          <h1 className="font-['Syne'] text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
            Work in Progress
          </h1>

          {/* Description */}
          <p className="text-xl text-white/60 mb-10 leading-relaxed">
            {t('wip.description') || 'Diese Funktion wird gerade entwickelt. Schau bald wieder vorbei!'}
          </p>

          {/* Back Button */}
          <Link to="/" className="btn-primary btn-lg inline-flex">
            <ArrowLeft className="h-5 w-5" />
            {t('nav.back') || 'Zurück'}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-white/40">
          © 2025 Breaking Dynamics
        </div>
      </footer>
    </div>
  );
};

export default WorkInProgress;
