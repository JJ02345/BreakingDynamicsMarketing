import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LandingFooter = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/5 bg-[#0A0A0B] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
              <Zap className="h-4 w-4 text-[#0A0A0B]" />
            </div>
            <span className="font-['Syne'] font-bold">Breaking Dynamics</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-white transition-colors">{t('landing.privacy')}</Link>
            <span>© 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
