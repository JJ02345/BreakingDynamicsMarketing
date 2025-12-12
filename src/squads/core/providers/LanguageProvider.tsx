// Language Provider - Internationalization (i18n)
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { translations } from '../constants/translations';
import type { LanguageCode, LanguageOption, LanguageContextValue } from '../types';

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'bd-language';

const languages: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
  { code: 'de', label: 'Deutsch', flag: '\uD83C\uDDE9\uD83C\uDDEA' },
  { code: 'es', label: 'Español', flag: '\uD83C\uDDEA\uD83C\uDDF8' },
  { code: 'fr', label: 'Français', flag: '\uD83C\uDDEB\uD83C\uDDF7' },
];

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['en', 'de', 'es', 'fr'].includes(stored)) {
        return stored as LanguageCode;
      }
    }
    return 'en';
  });

  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      let value: unknown = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key; // Return key if translation not found
        }
      }

      return typeof value === 'string' ? value : key;
    },
    [language]
  );

  const changeLanguage = useCallback((lang: LanguageCode) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Language Switcher Component
export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-xl bg-[#1A1A1D] border border-white/10 shadow-2xl overflow-hidden z-50 animate-scale-in"
          role="listbox"
        >
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
              role="option"
              aria-selected={language === lang.code}
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

export default LanguageProvider;
