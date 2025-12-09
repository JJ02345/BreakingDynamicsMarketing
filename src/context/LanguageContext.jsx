import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { translations } from '../constants';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bd-language') || 'en';
    }
    return 'en';
  });

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }, [language]);

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bd-language', lang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Language Switcher Component
export const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm"
      >
        <span>{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#1A1A1D] border border-white/10 shadow-2xl overflow-hidden z-50 animate-scale-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors ${
                language === lang.code
                  ? 'bg-[#FF6B35]/10 text-[#FF6B35]'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {language === lang.code && <Check className="h-4 w-4 ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageContext;
