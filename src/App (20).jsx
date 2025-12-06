import React, { useState, useCallback, useMemo, useEffect, useRef, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { Copy, Check, Sparkles, TrendingUp, Rocket, CheckCircle2, Flame, Lightbulb, TestTube, Gauge, GripVertical, Trash2, Plus, Hash, MessageSquare, Type, Timer, PlusCircle, AtSign, Calendar, Minus, BarChart3, Database, LineChart, FileText, Bold, Home, History, Settings, Eye, Edit3, Zap, Award, ChevronRight, X, LogOut, Files, Download, Smartphone, Monitor, Target, Quote, ArrowLeft, LogIn, FlaskConical, AlertCircle, Bug, Send, Loader2, Mail, RefreshCw, AlertTriangle, Shield, Users, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from './lib/AuthContext';
import { db, auth } from './lib/supabase';
import { compilePostFromBlocks, LINKEDIN_LIMITS, validateBlock, toBoldUnicode } from './lib/postCompiler';
import AdminDashboard from './AdminDashboard';

// ============================================
// LANGUAGE SYSTEM
// ============================================
const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      login: 'Sign In',
      startFree: 'Start Free',
      logout: 'Sign Out',
      admin: 'Admin',
      editor: 'Editor',
      back: 'Back',
    },
    // Landing Page
    landing: {
      badge: 'For Ambitious Founders',
      headline1: 'Validate your',
      headline2: 'Market-Fit in 48h',
      subheadline: 'Precise market data through LinkedIn surveys.',
      subheadline2: ' Fast. Data-driven. Effective.',
      ctaButton: 'Start Validation',
      stat1Value: '48h',
      stat1Label: 'Time to Insights',
      stat2Value: '10x',
      stat2Label: 'Faster than Interviews',
      stat3Value: '100%',
      stat3Label: 'Data-Driven',
      whyTitle: 'Why Breaking Dynamics?',
      whySubtitle: 'Three reasons why founders choose us',
      feature1Title: 'Lightning Fast',
      feature1Desc: 'Market data in 48 hours instead of weeks. Time is your most valuable asset.',
      feature2Title: 'Precise',
      feature2Desc: 'Real feedback from real decision-makers. No guesses, only facts.',
      feature3Title: 'Scalable',
      feature3Desc: 'From idea to product-market-fit. Content + insights in one.',
      communityBadge: 'Community',
      communityTitle: 'Join the',
      communityTitle2: 'Founder Community',
      communityDesc: 'Exclusive insights, beta access & direct exchange with other founders.',
      communityButton: 'Join Community',
      privacy: 'Privacy',
      terms: 'Terms',
    },
    // Auth
    auth: {
      login: 'Sign In',
      register: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      or: 'or',
      createAccount: 'Create new account',
      alreadyRegistered: 'Already registered? Sign In',
      privacyConsent: 'I agree to the privacy policy.',
      emailExists: 'This email is already registered. Please sign in.',
      wrongCredentials: 'Email or password incorrect',
      passwordMinLength: 'Password must be at least 6 characters',
      passwordMismatch: 'Passwords do not match',
      loginFailed: 'Login failed',
      registerFailed: 'Registration failed',
    },
    // Dashboard
    dashboard: {
      home: 'Dashboard',
      history: 'History',
      analysis: 'Analysis',
      newValidation: 'New Validation',
      totalTests: 'Total Tests',
      thisWeek: 'This Week',
      testProgress: 'Test Progress',
      week: 'Week',
      months: 'Months',
      years: 'Years',
      noData: 'No data yet',
      lastTests: 'Recent Tests',
      validationsTotal: 'validations total',
      noSurveys: 'No Surveys',
      createFirst: 'Create your first validation!',
      title: 'Title',
      hypothesis: 'Hypothesis',
      created: 'Created',
      actions: 'Actions',
      loadError: 'Loading error:',
      retry: 'Retry',
      comingSoon: 'Coming soon...',
      inDevelopment: 'In Development',
      deleteSurvey: 'Really delete survey?',
      deleted: 'Survey deleted',
      deleteFailed: 'Delete failed:',
    },
    // Editor
    editor: {
      blocks: 'Blocks',
      preview: 'Preview',
      required: 'Required',
      internal: 'Internal',
      dropHere: 'Drop block here or drag from sidebar',
      createButton: 'Create',
      saving: 'Saving...',
      cancel: 'Cancel',
      toHome: 'To Home',
      done: 'Done!',
      postReady: 'Your post is ready',
      copyText: 'Copy Text',
      copied: 'Copied!',
      newSurvey: 'New Survey',
      saveData: 'Save Data?',
      copyOnly: 'Copy only',
      copyAndEmail: 'Copy + Get Email',
      sendingEmail: 'Sending survey...',
      emailSent: 'Survey sent to your email!',
      emailFailed: 'Survey created! (Email could not be sent)',
      postTitle: 'Post title...',
      hypothesisQuestion: 'Hypothesis question...',
      option: 'Option',
      challengeInfo: 'This content will NOT be published in the LinkedIn post. It serves as internal documentation of your validation hypothesis.',
      challengePlaceholder: 'Describe your problem or hypothesis that you want to validate...\n\nExample: We believe that B2B SaaS founders have difficulty getting quick market feedback.',
      emailAddress: 'Email address',
      saveFailed: 'Save failed: ',
      surveyUpdated: 'Survey updated!',
      surveyCreated: 'Survey created!',
      ctaPlaceholder: "e.g. Comment 'PDF'",
      hashtagPlaceholder: '#Startup #MVP',
      customText: 'Custom text...',
      mentionPlaceholder: '@JohnDoe',
      numberPlaceholder: '87% of founders...',
      duration1day: '24H',
      duration3days: '3 DAYS',
      duration1week: '1 WEEK',
      durationLabel: 'Duration',
      dateLabel: 'Date',
      timeLabel: 'Time',
      survey: 'Survey',
      acceptPrivacy: 'Please accept privacy policy',
      emailAlreadyRegistered: 'This email is already registered. Please sign in.',
      charCount: 'characters',
      linkedInLimit: 'LinkedIn Limit',
      shareToLinkedIn: 'Share to LinkedIn',
      copiedForLinkedIn: 'Text copied! LinkedIn is opening...',
      pollInstructions: 'Add your poll on LinkedIn:',
      pollStep1: 'Paste the copied text into the post',
      pollStep2: 'Click the "Poll" icon (bar chart) in the toolbar',
      pollStep3: 'Add your poll question and options',
    },
    // Blocks
    blocks: {
      POLL: 'Poll Core',
      CHALLENGE: 'Validation Challenge',
      TITLE: 'Post Title',
      CTA: 'Call-to-Action',
      HASHTAG: 'Hashtags',
      DURATION: 'Duration',
      CUSTOM: 'Custom Text',
      DIVIDER: 'Divider',
      MENTION: '@Mention',
      NUMBER: 'Numbers',
      SCHEDULE: 'Schedule',
    },
    // Feedback
    feedback: {
      title: 'Feedback',
      bugReport: 'Report Bug',
      idea: 'Idea',
      describeBug: 'Describe the bug...',
      describeIdea: 'Describe your idea...',
      emailOptional: 'Email (optional, for follow-up)',
      submit: 'Submit',
      thanks: 'Thanks for your feedback!',
      willContact: 'We will get back to you.',
      sent: 'Feedback sent!',
      sendFailed: 'Feedback could not be sent',
    },
    // Common
    common: {
      textCopied: 'Text copied!',
      loading: 'Loading...',
    },
    // Warnings
    warnings: {
      postTooLong: 'Post exceeds LinkedIn limit',
      pollQuestionTooLong: 'Poll question too long',
      pollOptionTooLong: 'Poll option too long',
    },
  },
  de: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      login: 'Anmelden',
      startFree: 'Kostenlos starten',
      logout: 'Abmelden',
      admin: 'Admin',
      editor: 'Editor',
      back: 'Zurück',
    },
    // Landing Page
    landing: {
      badge: 'Für ambitionierte Gründer',
      headline1: 'Validiere deinen',
      headline2: 'Market-Fit in 48h',
      subheadline: 'Präzise Marktdaten durch LinkedIn-Umfragen.',
      subheadline2: ' Schnell. Datengetrieben. Effektiv.',
      ctaButton: 'Validierung starten',
      stat1Value: '48h',
      stat1Label: 'Time to Insights',
      stat2Value: '10x',
      stat2Label: 'Schneller als Interviews',
      stat3Value: '100%',
      stat3Label: 'Datengetrieben',
      whyTitle: 'Warum Breaking Dynamics?',
      whySubtitle: 'Drei Gründe, warum Gründer auf uns setzen',
      feature1Title: 'Blitzschnell',
      feature1Desc: 'Marktdaten in 48 Stunden statt Wochen. Zeit ist dein wertvollstes Asset.',
      feature2Title: 'Präzise',
      feature2Desc: 'Echtes Feedback von echten Entscheidern. Keine Vermutungen, nur Fakten.',
      feature3Title: 'Skalierbar',
      feature3Desc: 'Von der Idee zum Product-Market-Fit. Content + Insights in einem.',
      communityBadge: 'Community',
      communityTitle: 'Werde Teil der',
      communityTitle2: 'Gründer-Community',
      communityDesc: 'Exklusive Insights, Beta-Zugang & direkter Austausch mit anderen Gründern.',
      communityButton: 'Community beitreten',
      privacy: 'Datenschutz',
      terms: 'AGB',
    },
    // Auth
    auth: {
      login: 'Anmelden',
      register: 'Registrieren',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      or: 'oder',
      createAccount: 'Neues Konto erstellen',
      alreadyRegistered: 'Bereits registriert? Anmelden',
      privacyConsent: 'Ich stimme den Datenschutzbestimmungen zu.',
      emailExists: 'Diese E-Mail ist bereits registriert. Bitte melde dich an.',
      wrongCredentials: 'E-Mail oder Passwort falsch',
      passwordMinLength: 'Passwort muss mindestens 6 Zeichen haben',
      passwordMismatch: 'Passwörter stimmen nicht überein',
      loginFailed: 'Anmeldung fehlgeschlagen',
      registerFailed: 'Registrierung fehlgeschlagen',
    },
    // Dashboard
    dashboard: {
      home: 'Dashboard',
      history: 'Historie',
      analysis: 'Analyse',
      newValidation: 'Neue Validierung',
      totalTests: 'Gesamt Tests',
      thisWeek: 'Diese Woche',
      testProgress: 'Test-Verlauf',
      week: 'Woche',
      months: 'Monate',
      years: 'Jahre',
      noData: 'Noch keine Daten',
      lastTests: 'Letzte Tests',
      validationsTotal: 'Validierungen insgesamt',
      noSurveys: 'Keine Umfragen',
      createFirst: 'Erstelle deine erste Validierung!',
      title: 'Titel',
      hypothesis: 'Hypothese',
      created: 'Erstellt',
      actions: 'Aktionen',
      loadError: 'Fehler beim Laden:',
      retry: 'Erneut versuchen',
      comingSoon: 'Kommt bald...',
      inDevelopment: 'In Entwicklung',
      deleteSurvey: 'Umfrage wirklich löschen?',
      deleted: 'Umfrage gelöscht',
      deleteFailed: 'Löschen fehlgeschlagen:',
    },
    // Editor
    editor: {
      blocks: 'Bausteine',
      preview: 'Vorschau',
      required: 'Pflicht',
      internal: 'Intern',
      dropHere: 'Baustein hier ablegen oder aus der Sidebar ziehen',
      createButton: 'Erstellen',
      saving: 'Speichern...',
      cancel: 'Abbrechen',
      toHome: 'Zur Startseite',
      done: 'Fertig!',
      postReady: 'Dein Post ist bereit',
      copyText: 'Text kopieren',
      copied: 'Kopiert!',
      newSurvey: 'Neue Umfrage',
      saveData: 'Daten sichern?',
      copyOnly: 'Nur kopieren',
      copyAndEmail: 'Kopieren + E-Mail erhalten',
      sendingEmail: 'Survey wird gesendet...',
      emailSent: 'Survey wurde an deine E-Mail gesendet!',
      emailFailed: 'Survey erstellt! (E-Mail konnte nicht gesendet werden)',
      postTitle: 'Post-Titel...',
      hypothesisQuestion: 'Hypothesen-Frage...',
      option: 'Option',
      challengeInfo: 'Dieser Inhalt wird NICHT im LinkedIn-Post veröffentlicht. Er dient der internen Dokumentation deiner Validierungs-Hypothese.',
      challengePlaceholder: 'Beschreibe dein Problem oder deine Hypothese, die du validieren möchtest...\n\nBeispiel: Wir glauben, dass B2B-SaaS-Gründer Schwierigkeiten haben, schnelles Marktfeedback zu erhalten.',
      emailAddress: 'E-Mail-Adresse',
      saveFailed: 'Speichern fehlgeschlagen: ',
      surveyUpdated: 'Umfrage aktualisiert!',
      surveyCreated: 'Umfrage erstellt!',
      ctaPlaceholder: "z.B. Kommentiere 'PDF'",
      hashtagPlaceholder: '#Startup #MVP',
      customText: 'Eigener Text...',
      mentionPlaceholder: '@MaxMuster',
      numberPlaceholder: '87% der Gründer...',
      duration1day: '24H',
      duration3days: '3 TAGE',
      duration1week: '1 WOCHE',
      durationLabel: 'Laufzeit',
      dateLabel: 'Datum',
      timeLabel: 'Uhrzeit',
      survey: 'Umfrage',
      acceptPrivacy: 'Bitte Datenschutz akzeptieren',
      emailAlreadyRegistered: 'Diese E-Mail ist bereits registriert. Bitte melde dich an.',
      charCount: 'Zeichen',
      linkedInLimit: 'LinkedIn Limit',
      shareToLinkedIn: 'Auf LinkedIn teilen',
      copiedForLinkedIn: 'Text kopiert! LinkedIn wird geöffnet...',
      pollInstructions: 'Füge deine Umfrage auf LinkedIn hinzu:',
      pollStep1: 'Füge den kopierten Text in den Post ein',
      pollStep2: 'Klicke auf das "Umfrage" Symbol (Balkendiagramm) in der Toolbar',
      pollStep3: 'Füge deine Umfrage-Frage und Optionen hinzu',
    },
    // Blocks
    blocks: {
      POLL: 'Umfrage-Kern',
      CHALLENGE: 'Validierungs-Herausforderung',
      TITLE: 'Post-Titel',
      CTA: 'Call-to-Action',
      HASHTAG: 'Hashtags',
      DURATION: 'Laufzeit',
      CUSTOM: 'Custom Text',
      DIVIDER: 'Trenner',
      MENTION: '@Mention',
      NUMBER: 'Zahlen',
      SCHEDULE: 'Termin',
    },
    // Feedback
    feedback: {
      title: 'Feedback',
      bugReport: 'Bug melden',
      idea: 'Idee',
      describeBug: 'Beschreibe den Bug...',
      describeIdea: 'Beschreibe deine Idee...',
      emailOptional: 'E-Mail (optional, für Rückfragen)',
      submit: 'Absenden',
      thanks: 'Danke für dein Feedback!',
      willContact: 'Wir melden uns bei dir.',
      sent: 'Feedback gesendet!',
      sendFailed: 'Feedback konnte nicht gesendet werden',
    },
    // Common
    common: {
      textCopied: 'Text kopiert!',
      loading: 'Laden...',
    },
    // Warnings
    warnings: {
      postTooLong: 'Post überschreitet LinkedIn-Limit',
      pollQuestionTooLong: 'Poll-Frage zu lang',
      pollOptionTooLong: 'Poll-Option zu lang',
    },
  },
};

const LanguageContext = createContext(null);

const LanguageProvider = ({ children }) => {
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

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Language Switcher Component
const LanguageSwitcher = () => {
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
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
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

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
const ToastContext = React.createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col gap-2">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl animate-slide-in backdrop-blur-sm border ${
            toast.type === 'error' ? 'bg-red-500/90 border-red-400/30 text-white' :
            toast.type === 'success' ? 'bg-[#00E676]/90 border-[#00E676]/30 text-[#0A0A0B]' :
            toast.type === 'warning' ? 'bg-[#FFAB00]/90 border-[#FFAB00]/30 text-[#0A0A0B]' :
            'bg-[#1A1A1D]/95 border-white/10 text-white'
          }`}
        >
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)}
            className="ml-2 rounded-lg p-1 hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// ============================================
// CONSTANTS & HELPERS
// ============================================
const BLOCKS = {
  POLL: { name: 'Umfrage-Kern', icon: BarChart3, req: true },
  CHALLENGE: { name: 'Validierungs-Herausforderung', icon: FlaskConical, req: false },
  TITLE: { name: 'Post-Titel', icon: Type, req: false },
  CTA: { name: 'Call-to-Action', icon: MessageSquare, req: false },
  HASHTAG: { name: 'Hashtags', icon: Hash, req: false },
  DURATION: { name: 'Laufzeit', icon: Timer, req: false },
  CUSTOM: { name: 'Custom Text', icon: PlusCircle, req: false },
  DIVIDER: { name: 'Trenner', icon: Minus, req: false },
  MENTION: { name: '@Mention', icon: AtSign, req: false },
  NUMBER: { name: 'Zahlen', icon: Bold, req: false },
  SCHEDULE: { name: 'Termin', icon: Calendar, req: false }
};

// Input validation limits
const INPUT_LIMITS = {
  TITLE: 150,
  CHALLENGE: 2000,
  POLL_QUESTION: LINKEDIN_LIMITS.POLL_QUESTION, // 140 from LinkedIn
  POLL_OPTION: LINKEDIN_LIMITS.POLL_OPTION,     // 30 from LinkedIn
  CTA: 200,
  HASHTAG: 300,
  CUSTOM: 1000,
  MENTION: 100,
  NUMBER: 200,
};

const DUR_LABELS = { '1day': '24H', '3days': '3 TAGE', '1week': '1 WOCHE' };

const genId = function() { return 'b' + Date.now() + '-' + Math.random().toString(36).substr(2, 9); };

const initData = function(t) {
  if (t === 'POLL') return { q: '', opts: ['', '', '', ''] };
  if (t === 'DURATION') return { val: '3days' };
  if (t === 'DIVIDER') return { style: 'line' };
  if (t === 'SCHEDULE') return { date: '', time: '' };
  if (t === 'HASHTAG') return { tags: '' };
  if (t === 'CHALLENGE') return { text: '' };
  return { text: '' };
};

const clean = function(t) { 
  return t.replace(/\u00A0/g, ' ').replace(/&nbsp;/g, ' ').replace(/\r\n?/g, '\n').replace(/\n{4,}/g, '\n\n\n').trim(); 
};

const defaultBlocks = function() {
  return [
    { id: genId(), type: 'CHALLENGE', data: { text: '' } },
    { id: genId(), type: 'TITLE', data: { text: '' } },
    { id: genId(), type: 'POLL', data: { q: '', opts: ['', '', '', ''] } },
    { id: genId(), type: 'DURATION', data: { val: '3days' } }
  ];
};

// ============================================
// MAIN APP COMPONENT
// ============================================
// ============================================
// APP CONTEXT (for shared state across routes)
// ============================================
const AppContext = createContext(null);

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const AppProvider = ({ children }) => {
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [editSurvey, setEditSurvey] = useState(null);
  const [loginModal, setLoginModal] = useState(false);
  const [surveysLoading, setSurveysLoading] = useState(false);
  const [surveysError, setSurveysError] = useState(null);
  
  const [pendingEmail, setPendingEmailState] = useState(() => {
    try {
      return localStorage.getItem('pendingEmail') || null;
    } catch {
      return null;
    }
  });

  const setPendingEmail = (email) => {
    setPendingEmailState(email);
    try {
      if (email) {
        localStorage.setItem('pendingEmail', email);
      } else {
        localStorage.removeItem('pendingEmail');
      }
    } catch {}
  };

  useEffect(() => {
    if (isAuthenticated && pendingEmail) {
      setPendingEmail(null);
    }
  }, [isAuthenticated, pendingEmail]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSurveys();
    } else {
      setSurveys([]);
      setSurveysError(null);
    }
  }, [isAuthenticated]);

  const loadSurveys = async () => {
    setSurveysLoading(true);
    setSurveysError(null);
    try {
      const data = await db.getSurveys();
      setSurveys(data);
    } catch (err) {
      console.error('Failed to load surveys:', err);
      setSurveysError(err.message);
    } finally {
      setSurveysLoading(false);
    }
  };

  const handleLogin = () => {
    setLoginModal(false);
    loadSurveys();
  };

  const handleLogout = async () => {
    await signOut();
  };

  const showLogin = () => {
    setLoginModal(true);
  };

  return (
    <AppContext.Provider value={{
      user,
      authLoading,
      isAuthenticated,
      surveys,
      setSurveys,
      editSurvey,
      setEditSurvey,
      loginModal,
      setLoginModal,
      surveysLoading,
      surveysError,
      pendingEmail,
      setPendingEmail,
      loadSurveys,
      handleLogin,
      handleLogout,
      showLogin,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useApp();
  const location = useLocation();
  
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return children;
};

// ============================================
// APP ROUTES COMPONENT
// ============================================
const AppRoutes = function() {
  const { pendingEmail, setPendingEmail, authLoading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to dashboard after email confirmation
  useEffect(() => {
    const { isAuthenticated } = useApp;
    if (pendingEmail) {
      // Stay on email confirmation
    }
  }, [pendingEmail]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  // Show email confirmation page when awaiting verification
  if (pendingEmail) {
    return <EmailConfirmation email={pendingEmail} onBack={() => setPendingEmail(null)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminPage />
        </ProtectedRoute>
      } />
      <Route path="/datenschutz" element={<LegalPage title="Datenschutz" />} />
      <Route path="/agb" element={<LegalPage title="AGB" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// ============================================
// PAGE WRAPPER COMPONENTS (connect to AppContext)
// ============================================
const LandingPage = function() {
  const app = useApp();
  return <Landing {...app} />;
};

const EditorPage = function() {
  const app = useApp();
  return <Editor {...app} />;
};

const DashboardPage = function() {
  const app = useApp();
  return <Dashboard {...app} />;
};

const AdminPage = function() {
  return <AdminDashboard />;
};

// ============================================
// LEGAL PAGE
// ============================================
const LegalPage = function(props) {
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
        <h1 className="font-['Syne'] mb-6 text-3xl font-bold text-white">{props.title}</h1>
        <div className="card-dark p-8">
          <p className="text-white/60">Dies ist ein Platzhaltertext für {props.title}.</p>
        </div>
      </main>
    </div>
  );
};

// ============================================
// EMAIL CONFIRMATION PAGE
// ============================================
const EmailConfirmation = function(props) {
  const [checking, setChecking] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleCheckAgain = () => {
    setChecking(true);
    setTimeout(() => setChecking(false), 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B] p-4">
      <div className="absolute inset-0 bg-glow-center opacity-50" />
      <div className="relative w-full max-w-md">
        <div className="card-dark p-8 animate-scale-in">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20">
              <Mail className="h-10 w-10 text-[#FF6B35]" />
            </div>
            <h1 className="font-['Syne'] text-2xl font-bold text-white">Fast geschafft!</h1>
            <p className="mt-2 text-white/50">Bestätige deine E-Mail-Adresse</p>
          </div>

          <div className="mb-6 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 p-4">
            <p className="text-center text-sm text-[#00D4FF]/80">
              Wir haben eine Bestätigungs-E-Mail an
            </p>
            <p className="mt-1 text-center font-bold text-[#00D4FF]">
              {props.email}
            </p>
            <p className="mt-2 text-center text-sm text-[#00D4FF]/80">
              gesendet. Klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.
            </p>
          </div>

          <div className="mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FF6B35]/20 text-xs font-bold text-[#FF6B35]">1</div>
              <p className="text-sm text-white/60">Öffne dein E-Mail-Postfach</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FF6B35]/20 text-xs font-bold text-[#FF6B35]">2</div>
              <p className="text-sm text-white/60">Suche nach einer E-Mail von Breaking Dynamics</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FF6B35]/20 text-xs font-bold text-[#FF6B35]">3</div>
              <p className="text-sm text-white/60">Klicke auf "E-Mail bestätigen"</p>
            </div>
          </div>

          <div className="mb-6 flex items-start gap-2 rounded-lg bg-white/5 border border-white/10 p-3 text-xs text-white/40">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Keine E-Mail erhalten? Schau in deinem Spam-Ordner nach oder warte einige Minuten.</span>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCheckAgain}
              disabled={checking}
              className="btn-primary w-full"
            >
              {checking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Prüfe...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Status prüfen
                </>
              )}
            </button>
            <button
              onClick={props.onBack}
              className="btn-secondary w-full"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Anmeldung
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          Nach der Bestätigung wirst du automatisch eingeloggt.
        </p>
      </div>
    </div>
  );
};

// ============================================
// LOGIN MODAL
// ============================================
const LoginModal = function(props) {
  const { signIn, signUp, error: authError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (pw.length < 6) {
      setError(t('auth.passwordMinLength'));
      return;
    }
    
    setLoading(true);
    const result = await signIn(email, pw);
    setLoading(false);
    
    if (result.success) {
      props.onLogin();
      navigate('/dashboard');
    } else {
      setError(result.error === 'Invalid login credentials' 
        ? t('auth.wrongCredentials')
        : result.error);
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (pw.length < 6) {
      setError(t('auth.passwordMinLength'));
      return;
    }
    if (pw !== pwConfirm) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    
    setLoading(true);
    const result = await signUp(email, pw);
    setLoading(false);
    
    if (result.success) {
      if (result.data?.user?.identities?.length === 0) {
        setError(t('auth.emailExists'));
      } else if (result.data?.user && !result.data?.session) {
        props.onClose();
        if (props.setPendingEmail) {
          props.setPendingEmail(email);
        }
      } else {
        props.onLogin();
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setPw('');
    setPwConfirm('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#111113] border border-white/10 p-6 shadow-2xl animate-scale-in">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-['Syne'] text-xl font-bold text-white">
            {mode === 'login' ? t('auth.login') : t('auth.register')}
          </h2>
          <button onClick={props.onClose} className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder={t('auth.email')} 
            className="input-dark" 
          />
          
          <input 
            type="password" 
            value={pw} 
            onChange={(e) => setPw(e.target.value)} 
            placeholder={t('auth.password')} 
            className="input-dark" 
          />
          
          {mode === 'register' && (
            <input 
              type="password" 
              value={pwConfirm} 
              onChange={(e) => setPwConfirm(e.target.value)} 
              placeholder={t('auth.confirmPassword')} 
              className={"input-dark " + 
                (pwConfirm && pw !== pwConfirm 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : ''
                )
              } 
            />
          )}
          
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <button 
            onClick={mode === 'login' ? handleLogin : handleRegister} 
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'login' ? t('auth.login') : t('auth.register')}
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#111113] px-3 text-white/40">{t('auth.or')}</span>
            </div>
          </div>
          
          <button 
            onClick={switchMode} 
            className="btn-secondary w-full"
          >
            {mode === 'login' ? t('auth.createAccount') : t('auth.alreadyRegistered')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LANDING PAGE
// ============================================
const Landing = function(props) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] shadow-lg shadow-[#FF6B35]/20">
              <Zap className="h-6 w-6 text-[#0A0A0B]" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] blur-xl opacity-40" />
            </div>
            <div>
              <p className="font-['Syne'] text-lg font-bold tracking-tight">Breaking Dynamics</p>
              <p className="text-xs font-medium text-[#FF6B35] tracking-wider uppercase">Survey Marketing</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-ghost text-sm">{t('nav.dashboard')}</Link>
            ) : (
              <button onClick={props.showLogin} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
                <LogIn className="h-4 w-4" />{t('nav.login')}
              </button>
            )}
            <Link to="/editor" className="btn-primary">
              <Rocket className="h-4 w-4" />
              {t('nav.startFree')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-glow-top" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FF6B35]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="animate-slide-up delay-0 mb-8 inline-flex items-center gap-2 badge-orange">
            <Zap className="h-3.5 w-3.5" />
            <span>{t('landing.badge')}</span>
          </div>
          
          {/* Headline */}
          <h1 className="animate-slide-up delay-100 font-['Syne'] text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
            {t('landing.headline1')}
            <br />
            <span className="text-gradient">{t('landing.headline2')}</span>
          </h1>
          
          {/* Subheadline */}
          <p className="animate-slide-up delay-200 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('landing.subheadline')}
            <span className="text-white/80">{t('landing.subheadline2')}</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="animate-slide-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/editor" className="btn-primary btn-lg animate-glow-pulse">
              {t('landing.ctaButton')}
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
          
          {/* Stats Row */}
          <div className="animate-slide-up delay-400 mt-16 flex items-center justify-center gap-8 sm:gap-16">
            {[
              { value: t('landing.stat1Value'), label: t('landing.stat1Label') },
              { value: t('landing.stat2Value'), label: t('landing.stat2Label') },
              { value: t('landing.stat3Value'), label: t('landing.stat3Label') },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-['Syne'] text-3xl sm:text-4xl font-bold text-gradient-orange">{stat.value}</p>
                <p className="text-xs sm:text-sm text-white/40 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-diagonal" />
        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="accent-line mx-auto mb-6" />
            <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold mb-4">
              {t('landing.whyTitle')}
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              {t('landing.whySubtitle')}
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { 
                icon: Gauge, 
                title: t('landing.feature1Title'), 
                desc: t('landing.feature1Desc'),
                accent: '#FF6B35'
              },
              { 
                icon: Target, 
                title: t('landing.feature2Title'), 
                desc: t('landing.feature2Desc'),
                accent: '#00D4FF'
              },
              { 
                icon: TrendingUp, 
                title: t('landing.feature3Title'), 
                desc: t('landing.feature3Desc'),
                accent: '#00E676'
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="card-glow p-8 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]"
                  style={{ 
                    background: `linear-gradient(135deg, ${item.accent}20 0%, ${item.accent}10 100%)`,
                    border: `1px solid ${item.accent}30`
                  }}
                >
                  <item.icon className="h-7 w-7" style={{ color: item.accent }} />
                </div>
                <h3 className="font-['Syne'] text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-glow-center" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="badge-cyan mb-6 inline-flex items-center gap-2">
            <Users className="h-3.5 w-3.5" />
            <span>{t('landing.communityBadge')}</span>
          </div>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-bold mb-6">
            {t('landing.communityTitle')}
            <span className="text-gradient"> {t('landing.communityTitle2')}</span>
          </h2>
          <p className="text-white/50 text-lg mb-8">
            {t('landing.communityDesc')}
          </p>
          
          {/* Avatar Stack */}
          <div className="flex justify-center mb-8">
            <div className="flex -space-x-3">
              {['🚀', '💡', '⚡', '🎯', '🔥'].map((emoji, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8C5A]/20 border-2 border-[#0A0A0B] flex items-center justify-center text-xl shadow-lg">
                  {emoji}
                </div>
              ))}
              <div className="w-12 h-12 rounded-full bg-[#FF6B35] border-2 border-[#0A0A0B] flex items-center justify-center text-sm font-bold text-[#0A0A0B] shadow-lg">
                +99
              </div>
            </div>
          </div>
          
          <a 
            href="https://discord.gg/dein-link" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary btn-xl"
          >
            {t('landing.communityButton')}
            <ChevronRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A0A0B] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
                <Zap className="h-4 w-4 text-[#0A0A0B]" />
              </div>
              <span className="font-['Syne'] font-bold">Breaking Dynamics</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/40">
              <Link to="/datenschutz" className="hover:text-white transition-colors">{t('landing.privacy')}</Link>
              <Link to="/agb" className="hover:text-white transition-colors">{t('landing.terms')}</Link>
              <span>© 2025</span>
            </div>
          </div>
        </div>
      </footer>

      {props.loginModal && <LoginModal onClose={() => props.setLoginModal(false)} onLogin={props.handleLogin} setPendingEmail={props.setPendingEmail} />}
    </div>
  );
};

// ============================================
// EDITOR COMPONENT
// ============================================
const Editor = function(props) {
  const { user, isAuthenticated, signUp, signIn } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState(() => props.editSurvey?.blockData || defaultBlocks());
  const [sidebar, setSidebar] = useState(true);
  const [email, setEmail] = useState(user?.email || '');
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [result, setResult] = useState('');
  const [step, setStep] = useState('edit');
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState('register');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [regError, setRegError] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [postStats, setPostStats] = useState({ characters: 0, maxCharacters: LINKEDIN_LIMITS.POST_TEXT });
  
  const copyTimeoutRef = useRef(null);
  const draggedBlockRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (props.editSurvey?.blockData) {
      setBlocks(props.editSurvey.blockData);
    } else {
      setBlocks(defaultBlocks());
    }
  }, [props.editSurvey]);

  // Live character count update
  useEffect(() => {
    const { stats } = compilePostFromBlocks(blocks, {
      includeChallenge: false,
      includePollCTA: true,
      validate: false
    });
    setPostStats(stats);
  }, [blocks]);

  const addBlock = (t) => { 
    const id = genId(); 
    setBlocks(p => [...p, { id, type: t, data: initData(t) }]); 
    setActiveBlock(id); 
  };
  
  const updateBlock = (id, d) => { 
    setBlocks(p => p.map(b => b.id === id ? { ...b, data: { ...b.data, ...d } } : b)); 
  };
  
  const deleteBlock = (id) => { 
    const b = blocks.find(x => x.id === id); 
    if (b && !BLOCKS[b.type].req) setBlocks(p => p.filter(x => x.id !== id)); 
  };

  // ============================================
  // DRAG & DROP HANDLERS
  // ============================================
  const handleDragStart = (e, idx) => {
    setDragIdx(idx);
    draggedBlockRef.current = blocks[idx];
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx.toString());
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIdx !== null && idx !== dragIdx) {
      setDragOverIdx(idx);
    }
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIdx(null);
    }
  };

  const handleDrop = (e, dropIdx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }

    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks];
      const [draggedBlock] = newBlocks.splice(dragIdx, 1);
      newBlocks.splice(dropIdx, 0, draggedBlock);
      return newBlocks;
    });

    setDragIdx(null);
    setDragOverIdx(null);
    draggedBlockRef.current = null;
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
    draggedBlockRef.current = null;
  };

  const handleSidebarDragStart = (e, blockType) => {
    e.dataTransfer.setData('blockType', blockType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDropFromSidebar = (e, dropIdx = null) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('blockType');
    
    if (blockType && BLOCKS[blockType] && !BLOCKS[blockType].req) {
      const id = genId();
      const newBlock = { id, type: blockType, data: initData(blockType) };
      
      setBlocks(prevBlocks => {
        if (dropIdx !== null) {
          const newBlocks = [...prevBlocks];
          newBlocks.splice(dropIdx, 0, newBlock);
          return newBlocks;
        }
        return [...prevBlocks, newBlock];
      });
      
      setActiveBlock(id);
    }
    
    setDragOverIdx(null);
  };

  const canGen = useMemo(() => { 
    const p = blocks.find(b => b.type === 'POLL'); 
    const filled = p?.data.opts?.filter(o => o?.trim()).length || 0; 
    return p?.data.q?.trim() && filled >= 2 && email.trim(); 
  }, [blocks, email]);

  const getValidationChallenge = () => {
    const challengeBlock = blocks.find(b => b.type === 'CHALLENGE');
    return challengeBlock?.data?.text?.trim() || '';
  };

  const genText = () => {
    const { text } = compilePostFromBlocks(blocks, {
      includeChallenge: false,
      includePollCTA: true,
      includeDuration: false,
      validate: false
    });
    return text;
  };

  const finalize = async () => {
    setSaving(true);
    setSaveError(null);
    
    const { text: txt, warnings, stats } = compilePostFromBlocks(blocks, {
      includeChallenge: false,
      includePollCTA: true,
      validate: true
    });
    
    if (warnings.length > 0) {
      warnings.forEach(w => addToast(w, 'warning', 5000));
    }
    
    console.log('Post Stats:', stats);
    
    const validationChallenge = getValidationChallenge();
    
    const surveyData = { 
      title: blocks.find(b => b.type === 'TITLE')?.data.text?.slice(0, 50) || t('editor.survey'), 
      question: blocks.find(b => b.type === 'POLL')?.data.q || '', 
      blocks: blocks.length, 
      text: txt, 
      blockData: blocks,
      validation_challenge: validationChallenge
    };
    
    try {
      if (isAuthenticated) {
        if (props.editSurvey?.id) {
          await db.updateSurvey(props.editSurvey.id, surveyData);
          addToast(t('editor.surveyUpdated'), 'success');
        } else {
          await db.createSurvey(surveyData);
          addToast(t('editor.surveyCreated'), 'success');
        }
        await props.loadSurveys();
      } else {
        const s = {
          id: Date.now(),
          ...surveyData,
          created: new Date().toISOString().split('T')[0],
          scheduled: null,
        };
        props.setSurveys(p => [s, ...p]);
      }
      
      setResult(txt);
      setStep('result');
      props.setEditSurvey(null);
    } catch (err) {
      console.error('Failed to save survey:', err);
      setSaveError(err.message);
      addToast(t('editor.saveFailed') + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // HANDLE COPY ONLY WITH EMAIL - SOFT LOGIN
  // ============================================
  const handleCopyOnly = async () => {
    setSendingEmail(true);
    
    const txt = genText();
    const surveyData = {
      email: email,
      surveyTitle: blocks.find(b => b.type === 'TITLE')?.data.text?.slice(0, 50) || t('editor.survey'),
      surveyQuestion: blocks.find(b => b.type === 'POLL')?.data.q || '',
      surveyText: txt,
      blockData: blocks,
      validationChallenge: getValidationChallenge(),
    };

    try {
      // Lead speichern + E-Mail senden
      const result = await db.saveLead(surveyData);
      
      if (result.emailSent) {
        addToast('📧 ' + t('editor.emailSent'), 'success', 4000);
      } else {
        addToast(t('editor.emailFailed'), 'warning', 4000);
      }
    } catch (err) {
      console.error('Failed to save lead:', err);
      // Trotzdem weitermachen - User soll sein Survey bekommen
      addToast('Survey erstellt!', 'success', 3000);
    }

    // Survey anzeigen (auch wenn E-Mail fehlschlägt)
    setResult(txt);
    setStep('result');
    setModal(false);
    setSendingEmail(false);
  };

  const handleGen = () => { 
    if (!canGen) return; 
    if (!isAuthenticated) { 
      setModal(true); 
      return; 
    } 
    finalize(); 
  };
  
  const handleReg = async () => {
    setRegError('');
    
    if (pw.length < 6) {
      setRegError(t('auth.passwordMinLength'));
      return;
    }
    if (pw !== pwConfirm) {
      setRegError(t('auth.passwordMismatch'));
      return;
    }
    if (!privacy) {
      setRegError(t('editor.acceptPrivacy'));
      return;
    }
    
    setAuthLoading(true);
    const result = await signUp(email, pw);
    setAuthLoading(false);
    
    if (result.success) {
      if (result.data?.user?.identities?.length === 0) {
        setRegError(t('editor.emailAlreadyRegistered'));
        setModalMode('login');
        setPw('');
        setPwConfirm('');
      } else if (result.data?.user && !result.data?.session) {
        setModal(false);
        if (props.setPendingEmail) {
          props.setPendingEmail(email);
        }
      } else {
        setModal(false);
        finalize();
      }
    } else {
      if (result.error?.includes('already registered')) {
        setRegError(t('editor.emailAlreadyRegistered'));
        setModalMode('login');
        setPw('');
      } else {
        setRegError(result.error || t('auth.registerFailed'));
      }
    }
  };

  const handleLogin = async () => {
    setRegError('');
    
    if (pw.length < 6) {
      setRegError(t('auth.passwordMinLength'));
      return;
    }
    
    setAuthLoading(true);
    const result = await signIn(email, pw);
    setAuthLoading(false);
    
    if (result.success) {
      setModal(false);
      finalize();
    } else {
      if (result.error === 'Invalid login credentials') {
        setRegError(t('auth.wrongCredentials'));
      } else {
        setRegError(result.error || t('auth.loginFailed'));
      }
    }
  };

  const switchModalMode = () => {
    setModalMode(modalMode === 'login' ? 'register' : 'login');
    setRegError('');
    setPw('');
    setPwConfirm('');
  };
  
  const copyTxt = () => { 
    navigator.clipboard.writeText(clean(result)); 
    setCopied(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000); 
  };

  const getStyle = (id, idx) => {
    const block = blocks.find(x => x.id === id);
    const isChallenge = block?.type === 'CHALLENGE';
    
    if (dragIdx === idx) return 'border-[#FF6B35] bg-[#FF6B35]/10';
    if (activeBlock === id) {
      if (isChallenge) return 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/50';
      return 'border-[#FF6B35] bg-[#FF6B35]/5 ring-2 ring-[#FF6B35]/50';
    }
    if (isChallenge) return 'border-purple-500/30 bg-[#111113] hover:border-purple-500/50';
    return 'border-white/10 bg-[#111113] hover:border-white/20';
  };

  const handleNewSurvey = () => {
    setStep('edit');
    setResult('');
    setBlocks(defaultBlocks());
    props.setEditSurvey(null);
  };

  const shareToLinkedIn = () => {
    navigator.clipboard.writeText(clean(result));
    setCopied(true);
    addToast(t('editor.copiedForLinkedIn'), 'success', 3000);
    
    setTimeout(() => {
      window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank', 'width=600,height=600');
    }, 500);
    
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 3000);
  };

  if (step === 'result') {
    const hasPoll = blocks.some(b => b.type === 'POLL' && b.data?.q?.trim());
    
    return (
      <div className="min-h-screen bg-[#0A0A0B] p-6 flex items-center justify-center">
        <div className="w-full max-w-xl card-dark p-8 animate-scale-in">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-[#00E676]" />
            </div>
            <div>
              <h2 className="font-['Syne'] text-2xl font-bold text-white">{t('editor.done')}</h2>
              <p className="text-white/40 text-sm">{t('editor.postReady')}</p>
            </div>
          </div>
          
          <div className="mb-4 rounded-xl bg-[#1A1A1D] border border-white/10 p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm text-white/80">{result}</pre>
          </div>
          
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-white/40">{postStats.characters} / {postStats.maxCharacters} {t('editor.charCount')}</span>
            <span className={`font-medium ${postStats.characters > LINKEDIN_LIMITS.POST_TEXT ? 'text-red-400' : 'text-[#00E676]'}`}>
              {postStats.characters > LINKEDIN_LIMITS.POST_TEXT ? '⚠️ ' + t('editor.linkedInLimit') : '✓ LinkedIn Ready'}
            </span>
          </div>
          
          <button onClick={shareToLinkedIn} className="btn-linkedin w-full mb-3">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            {t('editor.shareToLinkedIn')}
          </button>
          
          {hasPoll && (
            <div className="mb-4 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#0A66C2]/20">
                  <BarChart3 className="h-4 w-4 text-[#0A66C2]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-2">{t('editor.pollInstructions')}</h4>
                  <ol className="text-xs text-white/60 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0A66C2]/20 text-[10px] font-bold text-[#0A66C2]">1</span>
                      <span>{t('editor.pollStep1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0A66C2]/20 text-[10px] font-bold text-[#0A66C2]">2</span>
                      <span>{t('editor.pollStep2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0A66C2]/20 text-[10px] font-bold text-[#0A66C2]">3</span>
                      <span>{t('editor.pollStep3')}</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}
          
          <button onClick={copyTxt} className={copied ? "btn-success w-full mb-3" : "btn-secondary w-full mb-3"}>
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copied ? t('editor.copied') : t('editor.copyText')}
          </button>
          
          <div className="flex gap-3">
            <button onClick={handleNewSurvey} className="btn-ghost flex-1">{t('editor.newSurvey')}</button>
            {isAuthenticated && <Link to="/dashboard" className="btn-ghost flex-1">{t('nav.dashboard')}</Link>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-ghost flex items-center gap-2">
                <Home className="h-4 w-4" />{t('nav.dashboard')}
              </Link>
            ) : (
              <Link to="/" className="btn-ghost flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />{t('nav.back')}
              </Link>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
                <Zap className="h-4 w-4 text-[#0A0A0B]" />
              </div>
              <span className="hidden font-['Syne'] text-sm font-bold text-white sm:block">Breaking Dynamics</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
              postStats.characters > LINKEDIN_LIMITS.POST_TEXT 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                : 'bg-white/5 text-white/50 border border-white/10'
            }`}>
              <FileText className="h-3.5 w-3.5" />
              {postStats.characters}/{LINKEDIN_LIMITS.POST_TEXT}
            </div>
            <LanguageSwitcher />
            <span className="badge-orange">{t('nav.editor')}</span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        <div className={"flex flex-shrink-0 flex-col border-r border-white/5 bg-[#111113] transition-all " + (sidebar ? 'w-56' : 'w-12')}>
          <button onClick={() => setSidebar(!sidebar)} className={"flex items-center justify-center border-b border-white/5 p-3 transition-all " + (sidebar ? 'bg-[#FF6B35] text-[#0A0A0B]' : 'text-white/50 hover:bg-white/5 hover:text-white')}>
            <Plus className={"h-5 w-5 transition-transform " + (sidebar ? 'rotate-45' : '')} />
          </button>
          {sidebar && (
            <div className="flex-1 overflow-y-auto p-2">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-white/30">{t('editor.blocks')}</p>
              {Object.entries(BLOCKS).map(([k, v]) => {
                const isChallenge = k === 'CHALLENGE';
                return (
                  <button 
                    key={k} 
                    onClick={() => { if (!v.req) addBlock(k); }} 
                    disabled={v.req}
                    draggable={!v.req}
                    onDragStart={(e) => { if (!v.req) handleSidebarDragStart(e, k); }}
                    className={"flex w-full items-center gap-2 rounded-lg p-2.5 text-left text-sm transition-all " + 
                      (v.req ? 'cursor-not-allowed opacity-30' : 
                       isChallenge ? 'text-purple-400 hover:bg-purple-500/10 cursor-grab active:cursor-grabbing' : 
                       'text-white/60 hover:bg-[#FF6B35] hover:text-[#0A0A0B] cursor-grab active:cursor-grabbing')}
                  >
                    <v.icon className="h-4 w-4" />
                    <span className="truncate">{t('blocks.' + k)}</span>
                    {isChallenge && <span className="ml-auto rounded bg-purple-500/20 px-1.5 py-0.5 text-xs font-medium text-purple-400">{t('editor.internal')}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div 
            className="flex-1 overflow-y-auto p-4 bg-[#0A0A0B]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropFromSidebar(e)}
          >
            <div className="mx-auto max-w-xl space-y-3">
              {blocks.map((b, i) => {
                const isChallenge = b.type === 'CHALLENGE';
                const isDragging = dragIdx === i;
                const isDragOver = dragOverIdx === i;
                return (
                  <div 
                    key={b.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, i)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setActiveBlock(b.id)} 
                    className={
                      "rounded-xl border-2 transition-all " + 
                      (isDragging ? 'opacity-50 scale-95 ' : '') +
                      (isDragOver ? 'border-dashed !border-[#00D4FF] !bg-[#00D4FF]/5 ' : '') +
                      (isDragging ? 'cursor-grabbing ' : 'cursor-grab ') +
                      getStyle(b.id, i)
                    }
                  >
                    <div className={"flex items-center gap-2 border-b px-3 py-2.5 " + 
                      (activeBlock === b.id 
                        ? (isChallenge ? 'border-purple-500/30 bg-purple-500/10' : 'border-[#FF6B35]/30 bg-[#FF6B35]/10') 
                        : (isChallenge ? 'border-purple-500/20 bg-[#1A1A1D]' : 'border-white/5 bg-[#1A1A1D]'))}>
                      <GripVertical className={"h-4 w-4 " + (isDragging ? 'text-[#FF6B35]' : 'text-white/30 hover:text-white/50')} />
                      {React.createElement(BLOCKS[b.type].icon, { className: 'h-4 w-4 ' + (isChallenge ? 'text-purple-400' : 'text-white/50') })}
                      <span className={"flex-1 text-xs font-bold uppercase tracking-wider " + 
                        (activeBlock === b.id 
                          ? (isChallenge ? 'text-purple-400' : 'text-[#FF6B35]') 
                          : (isChallenge ? 'text-purple-400/70' : 'text-white/50'))}>{t('blocks.' + b.type)}</span>
                      {isChallenge && (
                        <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-400">{t('editor.internal')}</span>
                      )}
                      {BLOCKS[b.type].req ? (
                        <span className="rounded bg-[#FF6B35]/20 px-2 py-0.5 text-xs font-bold text-[#FF6B35]">{t('editor.required')}</span>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); deleteBlock(b.id); }} className="rounded p-1 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="h-4 w-4 text-red-400/50 hover:text-red-400" />
                        </button>
                      )}
                    </div>
                    <div className="p-3">
                      <BlockContent block={b} update={updateBlock} t={t} />
                    </div>
                  </div>
                );
              })}

              {dragIdx === null && (
                <div 
                  className="rounded-xl border-2 border-dashed border-white/10 bg-transparent p-6 text-center text-sm text-white/30 transition-all hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5 hover:text-[#FF6B35]"
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('!border-[#FF6B35]', '!bg-[#FF6B35]/10'); }}
                  onDragLeave={(e) => { e.currentTarget.classList.remove('!border-[#FF6B35]', '!bg-[#FF6B35]/10'); }}
                  onDrop={(e) => { handleDropFromSidebar(e); e.currentTarget.classList.remove('!border-[#FF6B35]', '!bg-[#FF6B35]/10'); }}
                >
                  <Plus className="mx-auto mb-2 h-6 w-6" />
                  {t('editor.dropHere')}
                </div>
              )}

              <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-[#111113] p-4">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder={t('editor.emailAddress')} 
                  className="input-dark"
                  disabled={isAuthenticated}
                />
                
                {saveError && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {saveError}
                  </div>
                )}
                
                {postStats.characters > LINKEDIN_LIMITS.POST_TEXT && (
                  <div className="flex items-center gap-2 rounded-xl bg-[#FFAB00]/10 border border-[#FFAB00]/20 px-4 py-3 text-sm text-[#FFAB00]">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    {t('warnings.postTooLong')}: {postStats.characters}/{LINKEDIN_LIMITS.POST_TEXT} {t('editor.charCount')}
                  </div>
                )}
                
                <button 
                  onClick={handleGen} 
                  disabled={!canGen || saving} 
                  className="btn-primary w-full"
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
                  {saving ? t('editor.saving') : t('editor.createButton')}
                </button>
                <button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')} className="btn-secondary w-full">
                  <X className="h-4 w-4" />{isAuthenticated ? t('editor.cancel') : t('editor.toHome')}
                </button>
              </div>
            </div>
          </div>

          <div className="hidden w-80 flex-col border-l border-white/5 bg-[#111113] lg:flex">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <p className="text-sm font-bold uppercase tracking-wider text-white/50">{t('editor.preview')}</p>
              <div className="flex rounded-lg border border-white/10 bg-[#1A1A1D] p-1">
                <button onClick={() => setPreviewMode('desktop')} className={"rounded p-1.5 transition-colors " + (previewMode === 'desktop' ? 'bg-[#FF6B35] text-[#0A0A0B]' : 'text-white/40 hover:text-white')}>
                  <Monitor className="h-4 w-4" />
                </button>
                <button onClick={() => setPreviewMode('mobile')} className={"rounded p-1.5 transition-colors " + (previewMode === 'mobile' ? 'bg-[#FF6B35] text-[#0A0A0B]' : 'text-white/40 hover:text-white')}>
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <Preview blocks={blocks} mobile={previewMode === 'mobile'} />
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#111113] border border-white/10 p-6 animate-scale-in">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
                  <Rocket className="h-5 w-5 text-[#0A0A0B]" />
                </div>
                <h3 className="font-['Syne'] text-lg font-bold text-white">{t('editor.saveData')}</h3>
              </div>
              <button onClick={() => setModal(false)} className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex rounded-lg border border-white/10 bg-[#1A1A1D] p-1">
              <button
                onClick={() => { setModalMode('login'); setRegError(''); setPw(''); setPwConfirm(''); }}
                className={"flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all " +
                  (modalMode === 'login' 
                    ? 'bg-[#FF6B35] text-[#0A0A0B]' 
                    : 'text-white/50 hover:text-white')}
              >
                {t('auth.login')}
              </button>
              <button
                onClick={() => { setModalMode('register'); setRegError(''); setPw(''); setPwConfirm(''); }}
                className={"flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all " +
                  (modalMode === 'register' 
                    ? 'bg-[#FF6B35] text-[#0A0A0B]' 
                    : 'text-white/50 hover:text-white')}
              >
                {t('auth.register')}
              </button>
            </div>

            <input 
              type="email" 
              value={email} 
              readOnly 
              className="input-dark mb-2 opacity-60" 
            />

            <input 
              type="password" 
              value={pw} 
              onChange={(e) => setPw(e.target.value)} 
              placeholder={t('auth.password')} 
              className="input-dark mb-2" 
            />

            {modalMode === 'register' && (
              <input 
                type="password" 
                value={pwConfirm} 
                onChange={(e) => setPwConfirm(e.target.value)} 
                placeholder={t('auth.confirmPassword')} 
                className={"input-dark mb-2 " + 
                  (pwConfirm && pw !== pwConfirm ? '!border-red-500' : '')} 
              />
            )}

            {modalMode === 'register' && (
              <label className="mb-3 flex items-start gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={privacy} 
                  onChange={(e) => setPrivacy(e.target.checked)} 
                  className="mt-1 rounded border-white/20 bg-[#1A1A1D] text-[#FF6B35] focus:ring-[#FF6B35]/50" 
                />
                <span className="text-white/50">{t('auth.privacyConsent')}</span>
              </label>
            )}

            {regError && (
              <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {regError}
              </div>
            )}

            {modalMode === 'login' ? (
              <button 
                onClick={handleLogin} 
                disabled={pw.length < 6 || authLoading} 
                className="btn-primary w-full"
              >
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                {t('auth.login')}
              </button>
            ) : (
              <button 
                onClick={handleReg} 
                disabled={!privacy || pw.length < 6 || pw !== pwConfirm || authLoading} 
                className="btn-primary w-full"
              >
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                {t('auth.register')}
              </button>
            )}

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#111113] px-3 text-white/40">{t('auth.or')}</span>
              </div>
            </div>

            {/* SOFT LOGIN BUTTON - Copy + Email */}
            <button 
              onClick={handleCopyOnly}
              disabled={sendingEmail}
              className="btn-secondary w-full"
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('editor.sendingEmail')}
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  {t('editor.copyAndEmail')}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// BLOCK CONTENT COMPONENT (with input validation)
// ============================================
const BlockContent = function(props) {
  const b = props.block;
  const t = props.t;
  const cls = "w-full rounded-lg border border-white/10 bg-[#1A1A1D] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20";

  const renderTextareaWithLimit = (value, onChange, placeholder, limit, rows = 2, extraClass = '') => {
    const remaining = limit - (value?.length || 0);
    const isNearLimit = remaining < limit * 0.1;
    const isOverLimit = remaining < 0;
    
    return (
      <div className="relative">
        <textarea 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value.slice(0, limit))} 
          placeholder={placeholder} 
          className={cls + " resize-none " + extraClass} 
          rows={rows}
          maxLength={limit}
        />
        <span className={`absolute bottom-2 right-2 text-xs ${isOverLimit ? 'text-red-400 font-bold' : isNearLimit ? 'text-[#FF6B35] font-medium' : 'text-white/30'}`}>
          {remaining}
        </span>
      </div>
    );
  };

  const renderInputWithLimit = (value, onChange, placeholder, limit, extraClass = '') => {
    const remaining = limit - (value?.length || 0);
    const isNearLimit = remaining < limit * 0.1;
    const isOverLimit = remaining < 0;
    
    return (
      <div className="relative">
        <input 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value.slice(0, limit))} 
          placeholder={placeholder} 
          className={cls + " " + extraClass}
          maxLength={limit}
        />
        <span className={`absolute top-1/2 right-3 -translate-y-1/2 text-xs ${isOverLimit ? 'text-red-400 font-bold' : isNearLimit ? 'text-[#FF6B35] font-medium' : 'text-white/30'}`}>
          {remaining}
        </span>
      </div>
    );
  };

  if (b.type === 'TITLE') {
    return renderTextareaWithLimit(
      b.data.text,
      (val) => props.update(b.id, { text: val }),
      t('editor.postTitle'),
      INPUT_LIMITS.TITLE,
      2
    );
  }
  
  if (b.type === 'CHALLENGE') {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2 rounded-lg bg-purple-500/10 border border-purple-500/20 p-3 text-xs text-purple-400">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: t('editor.challengeInfo').replace('NOT', '<strong class="text-purple-300">NOT</strong>').replace('NICHT', '<strong class="text-purple-300">NICHT</strong>') }} />
        </div>
        {renderTextareaWithLimit(
          b.data.text,
          (val) => props.update(b.id, { text: val }),
          t('editor.challengePlaceholder'),
          INPUT_LIMITS.CHALLENGE,
          5,
          '!border-purple-500/30 focus:!border-purple-500 focus:!ring-purple-500/20'
        )}
      </div>
    );
  }
  
  if (b.type === 'POLL') {
    const questionLength = b.data.q?.length || 0;
    const questionOverLimit = questionLength > LINKEDIN_LIMITS.POLL_QUESTION;
    
    return (
      <div className="space-y-3">
        <div className="relative">
          <textarea 
            value={b.data.q || ''} 
            onChange={(e) => props.update(b.id, { q: e.target.value })} 
            placeholder={t('editor.hypothesisQuestion')} 
            className={cls + " resize-none " + (questionOverLimit ? '!border-red-500' : '')} 
            rows={2}
          />
          <span className={`absolute bottom-2 right-2 text-xs ${questionOverLimit ? 'text-red-400 font-bold' : 'text-white/30'}`}>
            {LINKEDIN_LIMITS.POLL_QUESTION - questionLength}
          </span>
        </div>
        {questionOverLimit && (
          <p className="text-xs text-red-400">⚠️ LinkedIn max: {LINKEDIN_LIMITS.POLL_QUESTION} Zeichen</p>
        )}
        <div className="grid grid-cols-2 gap-2">
          {b.data.opts?.map((o, i) => {
            const optLength = o?.length || 0;
            const optOverLimit = optLength > LINKEDIN_LIMITS.POLL_OPTION;
            return (
              <div key={i} className="relative">
                <input 
                  value={o} 
                  onChange={(e) => { 
                    const opts = [...(b.data.opts || [])]; 
                    opts[i] = e.target.value; 
                    props.update(b.id, { opts }); 
                  }} 
                  placeholder={t('editor.option') + " " + (i + 1)} 
                  className={cls + (optOverLimit ? ' !border-red-500' : '')}
                />
                <span className={`absolute top-1/2 right-2 -translate-y-1/2 text-xs ${optOverLimit ? 'text-red-400 font-bold' : 'text-white/30'}`}>
                  {LINKEDIN_LIMITS.POLL_OPTION - optLength}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (b.type === 'CTA') {
    return renderInputWithLimit(
      b.data.text,
      (val) => props.update(b.id, { text: val }),
      t('editor.ctaPlaceholder'),
      INPUT_LIMITS.CTA
    );
  }
  
  if (b.type === 'HASHTAG') {
    return renderInputWithLimit(
      b.data.tags,
      (val) => props.update(b.id, { tags: val }),
      t('editor.hashtagPlaceholder'),
      INPUT_LIMITS.HASHTAG
    );
  }
  
  if (b.type === 'CUSTOM') {
    return renderTextareaWithLimit(
      b.data.text,
      (val) => props.update(b.id, { text: val }),
      t('editor.customText'),
      INPUT_LIMITS.CUSTOM,
      2
    );
  }
  
  if (b.type === 'MENTION') {
    return renderInputWithLimit(
      b.data.text,
      (val) => props.update(b.id, { text: val }),
      t('editor.mentionPlaceholder'),
      INPUT_LIMITS.MENTION
    );
  }
  
  if (b.type === 'NUMBER') {
    return renderInputWithLimit(
      b.data.text,
      (val) => props.update(b.id, { text: val }),
      t('editor.numberPlaceholder'),
      INPUT_LIMITS.NUMBER
    );
  }

  if (b.type === 'DURATION') {
    const durLabels = {
      '1day': t('editor.duration1day'),
      '3days': t('editor.duration3days'),
      '1week': t('editor.duration1week')
    };
    return (
      <div className="flex gap-2">
        {Object.entries(durLabels).map(([v, l]) => (
          <label key={v} className={"flex-1 cursor-pointer rounded-lg border-2 py-3 text-center text-sm font-bold transition-all " + (b.data.val === v ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35]' : 'border-white/10 bg-[#1A1A1D] text-white/60 hover:border-white/20')}>
            <input type="radio" name={"dur-" + b.id} value={v} checked={b.data.val === v} onChange={(e) => props.update(b.id, { val: e.target.value })} className="sr-only" />{l}
          </label>
        ))}
      </div>
    );
  }

  if (b.type === 'DIVIDER') return (
    <div className="flex gap-2">
      {['line', 'stars'].map((s) => (
        <label key={s} className={"flex-1 cursor-pointer rounded-lg border-2 py-3 text-center text-sm font-bold transition-all " + (b.data.style === s ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35]' : 'border-white/10 bg-[#1A1A1D] text-white/60 hover:border-white/20')}>
          <input type="radio" name={"div-" + b.id} value={s} checked={b.data.style === s} onChange={(e) => props.update(b.id, { style: e.target.value })} className="sr-only" />{s === 'line' ? '────────' : '* * *'}
        </label>
      ))}
    </div>
  );

  if (b.type === 'SCHEDULE') return (
    <div className="flex gap-2">
      <input type="date" value={b.data.date || ''} onChange={(e) => props.update(b.id, { date: e.target.value })} className={cls + " flex-1"} />
      <input type="time" value={b.data.time || ''} onChange={(e) => props.update(b.id, { time: e.target.value })} className={cls + " w-32"} />
    </div>
  );

  return null;
};

// ============================================
// PREVIEW COMPONENT
// ============================================
const Preview = function(props) {
  const visibleBlocks = props.blocks.filter(b => b.type !== 'CHALLENGE');
  const has = visibleBlocks.some(b => b.data.text || b.data.q || b.data.tags);
  
  return (
    <div className={"rounded-2xl border border-white/10 bg-[#1A1A1D] shadow-xl " + (props.mobile ? 'text-xs' : 'text-sm')}>
      {props.mobile && <div className="flex justify-center border-b border-white/5 py-2"><div className="h-1 w-16 rounded-full bg-white/20"></div></div>}
      <div className="p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] text-lg font-bold text-[#0A0A0B]">LM</div>
          <div>
            <p className="font-bold text-white">Lea Meier</p>
            <p className="text-xs text-white/40">Startup Gründerin</p>
          </div>
        </div>
        {has ? visibleBlocks.map(b => {
          if (b.type === 'TITLE' && b.data.text) return <p key={b.id} className="mb-3 text-white/80 font-bold">{toBoldUnicode(b.data.text)}</p>;
          if (b.type === 'POLL' && b.data.q) return (
            <div key={b.id} className="mb-3 rounded-xl border border-white/10 bg-[#111113] p-3">
              <p className="mb-2 font-semibold text-white">🎯 {b.data.q}</p>
              {b.data.opts?.filter(Boolean).map((o, i) => <div key={i} className="mb-1.5 rounded-lg border border-white/10 bg-[#1A1A1D] px-3 py-2 text-white/70">{o}</div>)}
            </div>
          );
          if (b.type === 'CTA' && b.data.text) return <p key={b.id} className="mb-3 font-semibold text-[#FF6B35]">👉 {b.data.text}</p>;
          if (b.type === 'HASHTAG' && b.data.tags) return <p key={b.id} className="mb-3 text-[#00D4FF]">{b.data.tags}</p>;
          if (b.type === 'CUSTOM' && b.data.text) return <p key={b.id} className="mb-3 text-white/70">{b.data.text}</p>;
          if (b.type === 'NUMBER' && b.data.text) return <p key={b.id} className="mb-3 text-white/70">📊 {b.data.text}</p>;
          if (b.type === 'DIVIDER') return <div key={b.id} className="mb-3 text-center text-white/30">{b.data.style === 'stars' ? '✦ ✦ ✦' : '━━━━━━━━━━'}</div>;
          return null;
        }) : (
          <div className="py-12 text-center text-white/30">
            <Lightbulb className="mx-auto mb-2 h-10 w-10 opacity-50" />
            <p>Füge Bausteine hinzu...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// SURVEY DETAIL MODAL
// ============================================
const SurveyDetailModal = function(props) {
  const s = props.survey;
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);
  
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);
  
  const copyText = () => {
    navigator.clipboard.writeText(clean(s.text));
    setCopied(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111113] border border-white/10 shadow-2xl animate-scale-in">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111113] px-6 py-4">
          <div>
            <h2 className="font-['Syne'] text-xl font-bold text-white">{s.title}</h2>
            <p className="text-sm text-white/40">Erstellt am {s.created}</p>
          </div>
          <button onClick={props.onClose} className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {s.validation_challenge && (
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5">
              <div className="mb-3 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-400" />
                <h3 className="font-bold text-purple-300">Validierungs-Herausforderung</h3>
                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-400">Intern</span>
              </div>
              <p className="text-sm text-purple-200/80 whitespace-pre-wrap">{s.validation_challenge}</p>
            </div>
          )}
          
          {s.question && (
            <div className="rounded-xl border border-[#FF6B35]/30 bg-[#FF6B35]/5 p-5">
              <div className="mb-2 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#FF6B35]" />
                <h3 className="font-bold text-white">Umfrage-Frage</h3>
              </div>
              <p className="text-sm text-white/70">{s.question}</p>
            </div>
          )}
          
          <div className="rounded-xl border border-white/10 bg-[#1A1A1D] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#00D4FF]" />
                <h3 className="font-bold text-white">Generierter LinkedIn-Post</h3>
              </div>
              <span className="text-xs text-white/40">{s.text?.length || 0}/{LINKEDIN_LIMITS.POST_TEXT}</span>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-[#111113] border border-white/10 p-4 text-sm text-white/70">{s.text || 'Kein Text generiert'}</pre>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={copyText} 
              className={copied ? "btn-success flex-1" : "btn-primary flex-1"}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Kopiert!' : 'Post-Text kopieren'}
            </button>
            <button 
              onClick={() => { props.onEdit(s); props.onClose(); }} 
              className="btn-secondary flex-1"
            >
              <Edit3 className="h-4 w-4" />
              Bearbeiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD COMPONENT
// ============================================
const Dashboard = function(props) {
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState('home');
  const [copiedId, setCopiedId] = useState(null);
  const [detailSurvey, setDetailSurvey] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('week');
  const [deleting, setDeleting] = useState(null);
  const copyTimeoutRef = useRef(null);

  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (props.user) {
        try {
          const adminStatus = await auth.isAdmin(props.user);
          setIsAdmin(adminStatus);
        } catch (err) {
          console.error('Admin check failed:', err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [props.user]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const copyTxt = (id, text) => { 
    navigator.clipboard.writeText(clean(text)); 
    setCopiedId(id);
    addToast(t('common.textCopied'), 'success', 2000);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 1500); 
  };
  
  const edit = (s) => { 
    props.setEditSurvey({ ...s, blockData: s.blockData || [] }); 
    navigate('/editor'); 
  };

  const deleteSurvey = async (id) => {
    setDeleting(id);
    try {
      await db.deleteSurvey(id);
      await props.loadSurveys();
      addToast(t('dashboard.deleted'), 'success');
    } catch (err) {
      console.error('Failed to delete survey:', err);
      addToast(t('dashboard.deleteFailed') + err.message, 'error');
    } finally {
      setDeleting(null);
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm(t('dashboard.deleteSurvey'))) {
      deleteSurvey(id);
    }
  };

  const stats = useMemo(() => ({ 
    total: props.surveys.length, 
    week: props.surveys.filter(s => new Date(s.created) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length 
  }), [props.surveys]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] shadow-lg shadow-[#FF6B35]/20 transition-transform group-hover:scale-105">
              <Zap className="h-6 w-6 text-[#0A0A0B]" />
            </div>
            <span className="font-['Syne'] text-lg font-bold">Breaking Dynamics</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="hidden text-sm text-white/40 sm:block">{props.user?.email}</span>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.admin')}</span>
              </Link>
            )}
            <button onClick={props.handleLogout} className="btn-ghost flex items-center gap-2">
              <LogOut className="h-4 w-4" />{t('nav.logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex rounded-xl border border-white/10 bg-[#111113] p-1">
            {[{ k: 'home', i: Home, l: t('dashboard.home') }, { k: 'history', i: History, l: t('dashboard.history') }, { k: 'analyse', i: LineChart, l: t('dashboard.analysis') }].map(item => (
              <button key={item.k} onClick={() => setTab(item.k)} className={"flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all " + (tab === item.k ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B]' : 'text-white/60 hover:text-white hover:bg-white/5')}>
                <item.i className="h-4 w-4" />{item.l}
              </button>
            ))}
          </div>
          <Link to="/editor" className="btn-primary">
            <Plus className="h-4 w-4" />{t('dashboard.newValidation')}
          </Link>
        </div>

        {props.surveysError && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{t('dashboard.loadError')} {props.surveysError}</span>
            <button onClick={props.loadSurveys} className="ml-auto rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium hover:bg-red-500/30 transition-colors">
              {t('dashboard.retry')}
            </button>
          </div>
        )}

        {props.surveysLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
          </div>
        ) : (
          <>
            {tab === 'home' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="card-dark p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{t('dashboard.totalTests')}</span>
                      <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-[#FF6B35]" />
                      </div>
                    </div>
                    <p className="font-['Syne'] text-4xl font-bold text-gradient-orange">{stats.total}</p>
                  </div>
                  <div className="card-dark p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{t('dashboard.thisWeek')}</span>
                      <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-[#00E676]" />
                      </div>
                    </div>
                    <p className="font-['Syne'] text-4xl font-bold text-[#00E676]">{stats.week}</p>
                  </div>
                </div>

                <div className="card-dark p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-3 font-['Syne'] text-lg font-bold">
                      <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center">
                        <LineChart className="h-5 w-5 text-[#00D4FF]" />
                      </div>
                      Test-Verlauf
                    </h3>
                    <div className="flex rounded-lg border border-white/10 bg-[#1A1A1D] p-1">
                      {['week', 'month', 'year'].map(p => (
                        <button 
                          key={p}
                          onClick={() => setChartPeriod(p)} 
                          className={"rounded-md px-3 py-1.5 text-xs font-medium transition-all " + (chartPeriod === p ? 'bg-[#FF6B35] text-[#0A0A0B]' : 'text-white/50 hover:text-white')}
                        >
                          {p === 'week' ? 'Woche' : p === 'month' ? 'Monate' : 'Jahre'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-48">
                    {props.surveys.length > 0 ? (
                      <div className="flex h-full items-end justify-between gap-2 px-4">
                        {(() => {
                          const chartData = [];
                          
                          if (chartPeriod === 'week') {
                            for (let i = 6; i >= 0; i--) {
                              const date = new Date();
                              date.setDate(date.getDate() - i);
                              const dateStr = date.toISOString().split('T')[0];
                              const count = props.surveys.filter(s => s.created === dateStr).length;
                              chartData.push({ label: date.toLocaleDateString('de-DE', { weekday: 'short' }), count });
                            }
                          } else if (chartPeriod === 'month') {
                            for (let i = 11; i >= 0; i--) {
                              const date = new Date();
                              date.setMonth(date.getMonth() - i);
                              const monthStr = date.toISOString().slice(0, 7);
                              const count = props.surveys.filter(s => s.created?.startsWith(monthStr)).length;
                              chartData.push({ label: date.toLocaleDateString('de-DE', { month: 'short' }), count });
                            }
                          } else {
                            for (let i = 4; i >= 0; i--) {
                              const year = new Date().getFullYear() - i;
                              const count = props.surveys.filter(s => s.created?.startsWith(year.toString())).length;
                              chartData.push({ label: year.toString(), count });
                            }
                          }
                          
                          const maxCount = Math.max(...chartData.map(d => d.count)) || 1;
                          
                          return chartData.map((d, idx) => {
                            const height = d.count > 0 ? Math.max((d.count / maxCount) * 100, 10) : 5;
                            return (
                              <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                                <div className="relative w-full flex justify-center">
                                  {d.count > 0 && (
                                    <span className="absolute -top-6 text-xs font-bold text-[#FF6B35]">{d.count}</span>
                                  )}
                                  <div 
                                    className={"w-full max-w-[40px] rounded-t-lg transition-all " + (d.count > 0 ? 'bg-gradient-to-t from-[#FF6B35] to-[#FF8C5A]' : 'bg-white/10')}
                                    style={{ height: `${height}%`, minHeight: '8px' }}
                                  />
                                </div>
                                <span className="text-xs text-white/40">{d.label}</span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/30">
                        <div className="text-center">
                          <LineChart className="mx-auto mb-2 h-10 w-10 opacity-50" />
                          <p className="text-sm">Noch keine Daten</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setTab('history')} 
                  className="card-glow flex w-full items-center justify-between p-6 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center transition-all group-hover:scale-110">
                      <History className="h-6 w-6 text-[#FF6B35]" />
                    </div>
                    <div>
                      <h3 className="font-['Syne'] font-bold text-white">Letzte Tests</h3>
                      <p className="text-sm text-white/40">{props.surveys.length} Validierungen insgesamt</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-[#FF6B35] group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            )}

            {tab === 'history' && (
              <div className="card-dark overflow-hidden">
                {props.surveys.length === 0 ? (
                  <div className="p-12 text-center">
                    <History className="mx-auto mb-4 h-12 w-12 text-white/20" />
                    <h3 className="font-['Syne'] text-lg font-bold text-white">{t('dashboard.noSurveys')}</h3>
                    <p className="mt-2 text-sm text-white/40">{t('dashboard.createFirst')}</p>
                    <Link to="/editor" className="btn-primary mt-6">
                      {t('dashboard.newValidation')}
                    </Link>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="border-b border-white/10 bg-[#1A1A1D]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{t('dashboard.title')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{t('dashboard.hypothesis')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{t('dashboard.created')}</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">{t('dashboard.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.surveys.map(s => (
                        <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors" onClick={() => setDetailSurvey(s)}>
                          <td className="px-6 py-4 font-medium text-white">{s.title}</td>
                          <td className="px-6 py-4">
                            {s.validation_challenge ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-purple-500/10 border border-purple-500/20 px-2 py-1 text-xs font-medium text-purple-400">
                                <FlaskConical className="h-3 w-3" />
                                <span className="max-w-[200px] truncate">{s.validation_challenge}</span>
                              </span>
                            ) : (
                              <span className="text-xs text-white/30">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-white/50">{s.created}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button onClick={(e) => { e.stopPropagation(); copyTxt(s.id, s.text); }} className={"rounded-lg p-2 transition-colors " + (copiedId === s.id ? 'bg-[#00E676]/10 text-[#00E676]' : 'text-white/30 hover:bg-white/5 hover:text-white')}>
                                {copiedId === s.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); edit(s); }} className="rounded-lg p-2 text-white/30 hover:bg-white/5 hover:text-white transition-colors">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setDetailSurvey(s); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); confirmDelete(s.id); }} 
                                disabled={deleting === s.id}
                                className="rounded-lg p-2 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              >
                                {deleting === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {tab === 'analyse' && (
              <div className="card-dark p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center mx-auto mb-4">
                  <LineChart className="h-8 w-8 text-[#00D4FF]" />
                </div>
                <h3 className="font-['Syne'] text-xl font-bold text-white">Analyse</h3>
                <p className="mt-2 text-sm text-white/40">Kommt bald...</p>
                <div className="mt-6 inline-flex items-center gap-2 badge-cyan">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>In Entwicklung</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {detailSurvey && (
        <SurveyDetailModal 
          survey={detailSurvey} 
          onClose={() => setDetailSurvey(null)} 
          onEdit={edit}
        />
      )}
    </div>
  );
};

// ============================================
// FEEDBACK WIDGET
// ============================================
const FeedbackWidget = function() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const submitTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      await db.submitFeedback({
        type: feedbackType,
        message: message,
        email: email || user?.email,
      });
      
      setSubmitted(true);
      addToast(t('feedback.sent'), 'success');
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
      submitTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setMessage('');
        setEmail('');
      }, 2000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      addToast(t('feedback.sendFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B] shadow-lg shadow-[#FF6B35]/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-[#FF6B35]/40 active:scale-95"
        title={t('feedback.title')}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 sm:items-center sm:justify-center">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-md rounded-2xl bg-[#111113] border border-white/10 p-6 shadow-2xl animate-scale-in">
            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00E676]/10 border border-[#00E676]/20">
                  <CheckCircle2 className="h-8 w-8 text-[#00E676]" />
                </div>
                <h3 className="font-['Syne'] text-xl font-bold text-white">{t('feedback.thanks')}</h3>
                <p className="mt-2 text-white/50">{t('feedback.willContact')}</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
                      <MessageSquare className="h-5 w-5 text-[#0A0A0B]" />
                    </div>
                    <h3 className="font-['Syne'] text-lg font-bold text-white">{t('feedback.title')}</h3>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 flex gap-2">
                  <button
                    onClick={() => setFeedbackType('bug')}
                    className={"flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition-all " + 
                      (feedbackType === 'bug' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-white/10 bg-transparent text-white/50 hover:border-white/20 hover:text-white')}
                  >
                    <Bug className="h-4 w-4" />
                    {t('feedback.bugReport')}
                  </button>
                  <button
                    onClick={() => setFeedbackType('feature')}
                    className={"flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition-all " + 
                      (feedbackType === 'feature' ? 'border-[#00D4FF] bg-[#00D4FF]/10 text-[#00D4FF]' : 'border-white/10 bg-transparent text-white/50 hover:border-white/20 hover:text-white')}
                  >
                    <Lightbulb className="h-4 w-4" />
                    {t('feedback.idea')}
                  </button>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={feedbackType === 'bug' ? t('feedback.describeBug') : t('feedback.describeIdea')}
                  className="input-dark mb-4 resize-none"
                  rows={4}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('feedback.emailOptional')}
                  className="input-dark mb-4"
                />

                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || loading}
                  className="btn-primary w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {t('feedback.submit')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// ============================================
// MAIN APP WITH PROVIDERS
// ============================================
const AppWithProviders = function() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <AppProvider>
            <AppRoutes />
            <FeedbackWidget />
          </AppProvider>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default AppWithProviders;
