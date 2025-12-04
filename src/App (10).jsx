import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Copy, Check, Sparkles, TrendingUp, Rocket, CheckCircle2, Flame, Lightbulb, TestTube, Gauge, GripVertical, Trash2, Plus, Hash, MessageSquare, Type, Timer, PlusCircle, AtSign, Calendar, Minus, BarChart3, Database, LineChart, FileText, Bold, Home, History, Settings, Eye, Edit3, Zap, Award, ChevronRight, X, LogOut, Files, Download, Smartphone, Monitor, Target, Quote, ArrowLeft, LogIn, FlaskConical, AlertCircle, Bug, Send, Loader2, Mail, RefreshCw, AlertTriangle, Shield } from 'lucide-react';
import { useAuth } from './lib/AuthContext';
import { db, auth } from './lib/supabase';
import AdminDashboard from './AdminDashboard';

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
  POLL_QUESTION: 300,
  POLL_OPTION: 100,
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
const App = function() {
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();
  const [page, setPage] = useState('landing');
  const [dashboardKey, setDashboardKey] = useState(0);
  const [surveys, setSurveys] = useState([]);
  const [editSurvey, setEditSurvey] = useState(null);
  const [loginModal, setLoginModal] = useState(false);
  const [surveysLoading, setSurveysLoading] = useState(false);
  const [surveysError, setSurveysError] = useState(null);
  
  // Initialize pendingEmail from localStorage (survives page reload after email confirmation)
  const [pendingEmail, setPendingEmailState] = useState(() => {
    try {
      return localStorage.getItem('pendingEmail') || null;
    } catch {
      return null;
    }
  });

  // Wrapper to persist pendingEmail to localStorage
  const setPendingEmail = (email) => {
    setPendingEmailState(email);
    try {
      if (email) {
        localStorage.setItem('pendingEmail', email);
      } else {
        localStorage.removeItem('pendingEmail');
      }
    } catch {
      // localStorage not available
    }
  };

  // Auto-navigate to dashboard when user becomes authenticated after email confirmation
  useEffect(() => {
    if (isAuthenticated) {
      // Clear pendingEmail and go to dashboard
      if (pendingEmail) {
        setPendingEmail(null);
        setPage('dashboard');
      }
    }
  }, [isAuthenticated, pendingEmail]);

  // Load surveys when user logs in
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
    setDashboardKey(k => k + 1);
    loadSurveys();
  };

  const handleLogout = async () => {
    await signOut();
    setPage('landing');
  };

  // Navigation handler that resets editSurvey when going to editor for new survey
  const navigateTo = (targetPage, options = {}) => {
    if (targetPage === 'editor' && !options.edit) {
      setEditSurvey(null);
    }
    setPage(targetPage);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show email confirmation page when awaiting verification
  if (pendingEmail) {
    return <EmailConfirmation email={pendingEmail} onBack={() => setPendingEmail(null)} nav={navigateTo} />;
  }

  if (page === 'dashboard' && !isAuthenticated) {
    return <Landing nav={navigateTo} showLogin={() => setLoginModal(true)} user={user} loginModal={loginModal} setLoginModal={setLoginModal} onLogin={handleLogin} setPendingEmail={setPendingEmail} />;
  }

  if (page === 'datenschutz' || page === 'agb') {
    return <LegalPage title={page === 'datenschutz' ? 'Datenschutz' : 'AGB'} nav={navigateTo} />;
  }

  if (page === 'landing') {
    return <Landing nav={navigateTo} showLogin={() => setLoginModal(true)} user={user} loginModal={loginModal} setLoginModal={setLoginModal} onLogin={handleLogin} setPendingEmail={setPendingEmail} />;
  }

  if (page === 'editor') {
    return <Editor nav={navigateTo} user={user} onLogin={handleLogin} surveys={surveys} setSurveys={setSurveys} editSurvey={editSurvey} setEditSurvey={setEditSurvey} loadSurveys={loadSurveys} setPendingEmail={setPendingEmail} />;
  }

  if (page === 'dashboard') {
    return <Dashboard key={dashboardKey} nav={navigateTo} user={user} logout={handleLogout} surveys={surveys} setSurveys={setSurveys} setEditSurvey={setEditSurvey} loading={surveysLoading} loadSurveys={loadSurveys} error={surveysError} />;
  }

  if (page === 'admin') {
    return <AdminDashboard nav={navigateTo} />;
  }

  return null;
};

// ============================================
// LEGAL PAGE
// ============================================
const LegalPage = function(props) {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
          <button onClick={() => props.nav('landing')} className="btn-ghost flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Zurück</span>
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

  // Auto-redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      props.nav('dashboard');
    }
  }, [isAuthenticated]);

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
              className="btn-primary w-full justify-center disabled:opacity-50"
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
              className="btn-secondary w-full justify-center"
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
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.includes('@')) {
      setError('Bitte gib eine gültige E-Mail ein');
      return;
    }
    if (pw.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen haben');
      return;
    }
    
    setLoading(true);
    const result = await signIn(email, pw);
    setLoading(false);
    
    if (result.success) {
      props.onLogin();
      props.nav('dashboard');
    } else {
      setError(result.error === 'Invalid login credentials' 
        ? 'E-Mail oder Passwort falsch' 
        : result.error);
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!email.includes('@')) {
      setError('Bitte gib eine gültige E-Mail ein');
      return;
    }
    if (pw.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen haben');
      return;
    }
    if (pw !== pwConfirm) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
    
    setLoading(true);
    const result = await signUp(email, pw);
    setLoading(false);
    
    if (result.success) {
      if (result.data?.user?.identities?.length === 0) {
        setError('Diese E-Mail ist bereits registriert');
      } else if (result.data?.user && !result.data?.session) {
        props.onClose();
        if (props.setPendingEmail) {
          props.setPendingEmail(email);
        }
      } else {
        props.onLogin();
        props.nav('dashboard');
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
            {mode === 'login' ? 'Anmelden' : 'Registrieren'}
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
            placeholder="E-Mail" 
            className="input-dark" 
          />
          
          <input 
            type="password" 
            value={pw} 
            onChange={(e) => setPw(e.target.value)} 
            placeholder="Passwort" 
            className="input-dark" 
          />
          
          {mode === 'register' && (
            <input 
              type="password" 
              value={pwConfirm} 
              onChange={(e) => setPwConfirm(e.target.value)} 
              placeholder="Passwort bestätigen" 
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
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Anmelden' : 'Registrieren'}
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#111113] px-3 text-white/40">oder</span>
            </div>
          </div>
          
          <button 
            onClick={switchMode} 
            className="btn-secondary w-full justify-center"
          >
            {mode === 'login' ? 'Neues Konto erstellen' : 'Bereits registriert? Anmelden'}
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
            {isAuthenticated ? (
              <button onClick={() => props.nav('dashboard')} className="btn-ghost text-sm">Dashboard</button>
            ) : (
              <button onClick={props.showLogin} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
                <LogIn className="h-4 w-4" />Anmelden
              </button>
            )}
            <button onClick={() => props.nav('editor')} className="btn-primary">
              <span className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Kostenlos starten
              </span>
            </button>
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
            <span>Für ambitionierte Gründer</span>
          </div>
          
          {/* Headline */}
          <h1 className="animate-slide-up delay-100 font-['Syne'] text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Validiere deinen
            <br />
            <span className="text-gradient">Market-Fit in 48h</span>
          </h1>
          
          {/* Subheadline */}
          <p className="animate-slide-up delay-200 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Präzise Marktdaten durch LinkedIn-Umfragen. 
            <span className="text-white/80"> Schnell. Datengetrieben. Effektiv.</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="animate-slide-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => props.nav('editor')} className="btn-primary text-base px-8 py-4 animate-glow-pulse">
              <span className="flex items-center gap-2">
                Validierung starten
                <ChevronRight className="h-5 w-5" />
              </span>
            </button>
            <button className="btn-secondary">
              <span className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                So funktioniert's
              </span>
            </button>
          </div>
          
          {/* Stats Row */}
          <div className="animate-slide-up delay-500 mt-16 flex items-center justify-center gap-8 sm:gap-16">
            {[
              { value: '48h', label: 'Time to Insights' },
              { value: '10x', label: 'Schneller als Interviews' },
              { value: '100%', label: 'Datengetrieben' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-['Syne'] text-3xl sm:text-4xl font-bold text-gradient-orange">{stat.value}</p>
                <p className="text-xs sm:text-sm text-white/40 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-[#FF6B35] rounded-full animate-pulse" />
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
              Warum Breaking Dynamics?
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Drei Gründe, warum Gründer auf uns setzen
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { 
                icon: Gauge, 
                title: 'Blitzschnell', 
                desc: 'Marktdaten in 48 Stunden statt Wochen. Zeit ist dein wertvollstes Asset.',
                accent: '#FF6B35'
              },
              { 
                icon: Target, 
                title: 'Präzise', 
                desc: 'Echtes Feedback von echten Entscheidern. Keine Vermutungen, nur Fakten.',
                accent: '#00D4FF'
              },
              { 
                icon: TrendingUp, 
                title: 'Skalierbar', 
                desc: 'Von der Idee zum Product-Market-Fit. Content + Insights in einem.',
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

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-glow-center" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="badge-cyan mb-6 inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Starte jetzt</span>
          </div>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-bold mb-6">
            Bereit für den
            <span className="text-gradient"> Durchbruch?</span>
          </h2>
          <p className="text-white/50 text-lg mb-10">
            Erstelle deine erste Validierungs-Umfrage in unter 5 Minuten.
          </p>
          <button onClick={() => props.nav('editor')} className="btn-primary text-lg px-10 py-5">
            <span className="flex items-center gap-2">
              Jetzt kostenlos starten
              <Rocket className="h-5 w-5" />
            </span>
          </button>
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
              <button onClick={() => props.nav('datenschutz')} className="hover:text-white transition-colors">Datenschutz</button>
              <button onClick={() => props.nav('agb')} className="hover:text-white transition-colors">AGB</button>
              <span>© 2025</span>
            </div>
          </div>
        </div>
      </footer>

      {props.loginModal && <LoginModal onClose={() => props.setLoginModal(false)} onLogin={props.onLogin} nav={props.nav} setPendingEmail={props.setPendingEmail} />}
    </div>
  );
};

// ============================================
// EDITOR COMPONENT
// ============================================
const Editor = function(props) {
  const { user, isAuthenticated, signUp, signIn } = useAuth();
  const { addToast } = useToast();
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
    // Für besseres visuelles Feedback
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
    // Nur zurücksetzen wenn wir wirklich den Container verlassen
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

  // Sidebar: Block zur Liste hinzufügen (am Ende oder an bestimmter Position)
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
    let t = '';
    blocks.forEach(b => {
      if (b.type === 'CHALLENGE') return;
      if (b.type === 'TITLE' && b.data.text) t += b.data.text + '\n\n\n';
      if (b.type === 'POLL' && b.data.q) t += '🎯 ' + b.data.q + '\n\n';
      if (b.type === 'CTA' && b.data.text) t += '👉 ' + b.data.text + '\n\n\n';
      if (b.type === 'CUSTOM' && b.data.text) t += b.data.text + '\n\n\n';
      if (b.type === 'HASHTAG' && b.data.tags) t += '\n\n' + b.data.tags;
    });
    return t.trim();
  };

  const finalize = async () => {
    setSaving(true);
    setSaveError(null);
    
    const txt = genText();
    const validationChallenge = getValidationChallenge();
    
    const surveyData = { 
      title: blocks.find(b => b.type === 'TITLE')?.data.text?.slice(0, 50) || 'Umfrage', 
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
          addToast('Umfrage aktualisiert!', 'success');
        } else {
          await db.createSurvey(surveyData);
          addToast('Umfrage erstellt!', 'success');
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
      addToast('Speichern fehlgeschlagen: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
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
      setRegError('Passwort muss mindestens 6 Zeichen haben');
      return;
    }
    if (pw !== pwConfirm) {
      setRegError('Passwörter stimmen nicht überein');
      return;
    }
    if (!privacy) {
      setRegError('Bitte Datenschutz akzeptieren');
      return;
    }
    
    setAuthLoading(true);
    const result = await signUp(email, pw);
    setAuthLoading(false);
    
    if (result.success) {
      if (result.data?.user?.identities?.length === 0) {
        setRegError('Diese E-Mail ist bereits registriert. Bitte melde dich an.');
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
        setRegError('Diese E-Mail ist bereits registriert. Bitte melde dich an.');
        setModalMode('login');
        setPw('');
      } else {
        setRegError(result.error || 'Registrierung fehlgeschlagen');
      }
    }
  };

  const handleLogin = async () => {
    setRegError('');
    
    if (pw.length < 6) {
      setRegError('Passwort muss mindestens 6 Zeichen haben');
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
        setRegError('E-Mail oder Passwort falsch');
      } else {
        setRegError(result.error || 'Anmeldung fehlgeschlagen');
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

  if (step === 'result') {
    return (
      <div className="min-h-screen bg-[#0A0A0B] p-6 flex items-center justify-center">
        <div className="w-full max-w-xl card-dark p-8 animate-scale-in">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-[#00E676]" />
            </div>
            <div>
              <h2 className="font-['Syne'] text-2xl font-bold text-white">Fertig!</h2>
              <p className="text-white/40 text-sm">Dein Post ist bereit</p>
            </div>
          </div>
          <div className="mb-6 rounded-xl bg-[#1A1A1D] border border-white/10 p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm text-white/80">{result}</pre>
          </div>
          <button onClick={copyTxt} className={"btn-primary w-full justify-center " + (copied ? '!bg-[#00E676] !text-[#0A0A0B]' : '')}>
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copied ? 'Kopiert!' : 'Text kopieren'}
          </button>
          <div className="mt-4 flex gap-3">
            <button onClick={handleNewSurvey} className="btn-secondary flex-1 justify-center">Neue Umfrage</button>
            {isAuthenticated && <button onClick={() => props.nav('dashboard')} className="btn-ghost flex-1 justify-center">Dashboard</button>}
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
              <button onClick={() => props.nav('dashboard')} className="btn-ghost flex items-center gap-2">
                <Home className="h-4 w-4" />Dashboard
              </button>
            ) : (
              <button onClick={() => props.nav('landing')} className="btn-ghost flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />Zurück
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
                <Zap className="h-4 w-4 text-[#0A0A0B]" />
              </div>
              <span className="hidden font-['Syne'] text-sm font-bold text-white sm:block">Breaking Dynamics</span>
            </div>
          </div>
          <span className="badge-orange">Editor</span>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        <div className={"flex flex-shrink-0 flex-col border-r border-white/5 bg-[#111113] transition-all " + (sidebar ? 'w-56' : 'w-12')}>
          <button onClick={() => setSidebar(!sidebar)} className={"flex items-center justify-center border-b border-white/5 p-3 transition-all " + (sidebar ? 'bg-[#FF6B35] text-[#0A0A0B]' : 'text-white/50 hover:bg-white/5 hover:text-white')}>
            <Plus className={"h-5 w-5 transition-transform " + (sidebar ? 'rotate-45' : '')} />
          </button>
          {sidebar && (
            <div className="flex-1 overflow-y-auto p-2">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-white/30">Bausteine</p>
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
                    <span className="truncate">{v.name}</span>
                    {isChallenge && <span className="ml-auto rounded bg-purple-500/20 px-1.5 py-0.5 text-xs font-medium text-purple-400">Intern</span>}
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
                          : (isChallenge ? 'text-purple-400/70' : 'text-white/50'))}>{BLOCKS[b.type].name}</span>
                      {isChallenge && (
                        <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-400">Intern</span>
                      )}
                      {BLOCKS[b.type].req ? (
                        <span className="rounded bg-[#FF6B35]/20 px-2 py-0.5 text-xs font-bold text-[#FF6B35]">Pflicht</span>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); deleteBlock(b.id); }} className="rounded p-1 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="h-4 w-4 text-red-400/50 hover:text-red-400" />
                        </button>
                      )}
                    </div>
                    <div className="p-3">
                      <BlockContent block={b} update={updateBlock} />
                    </div>
                  </div>
                );
              })}

              {/* Drop Zone für Blöcke aus der Sidebar */}
              {dragIdx === null && (
                <div 
                  className="rounded-xl border-2 border-dashed border-white/10 bg-transparent p-6 text-center text-sm text-white/30 transition-all hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5 hover:text-[#FF6B35]"
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('!border-[#FF6B35]', '!bg-[#FF6B35]/10'); }}
                  onDragLeave={(e) => { e.currentTarget.classList.remove('!border-[#FF6B35]', '!bg-[#FF6B35]/10'); }}
                  onDrop={(e) => { handleDropFromSidebar(e); e.currentTarget.classList.remove('!border-[#FF6B35]', '!bg-[#FF6B35]/10'); }}
                >
                  <Plus className="mx-auto mb-2 h-6 w-6" />
                  Baustein hier ablegen oder aus der Sidebar ziehen
                </div>
              )}

              <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-[#111113] p-4">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="E-Mail-Adresse" 
                  className="input-dark"
                  disabled={isAuthenticated}
                />
                
                {saveError && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {saveError}
                  </div>
                )}
                
                <button 
                  onClick={handleGen} 
                  disabled={!canGen || saving} 
                  className={"btn-primary w-full justify-center " + (!canGen || saving ? 'opacity-50 cursor-not-allowed' : '')}
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
                  {saving ? 'Speichern...' : 'Erstellen'}
                </button>
                <button onClick={() => props.nav(isAuthenticated ? 'dashboard' : 'landing')} className="btn-secondary w-full justify-center">
                  <X className="h-4 w-4" />{isAuthenticated ? 'Abbrechen' : 'Zur Startseite'}
                </button>
              </div>
            </div>
          </div>

          <div className="hidden w-80 flex-col border-l border-white/5 bg-[#111113] lg:flex">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <p className="text-sm font-bold uppercase tracking-wider text-white/50">Vorschau</p>
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
                <h3 className="font-['Syne'] text-lg font-bold text-white">Daten sichern?</h3>
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
                Anmelden
              </button>
              <button
                onClick={() => { setModalMode('register'); setRegError(''); setPw(''); setPwConfirm(''); }}
                className={"flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all " +
                  (modalMode === 'register' 
                    ? 'bg-[#FF6B35] text-[#0A0A0B]' 
                    : 'text-white/50 hover:text-white')}
              >
                Registrieren
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
              placeholder="Passwort" 
              className="input-dark mb-2" 
            />

            {modalMode === 'register' && (
              <input 
                type="password" 
                value={pwConfirm} 
                onChange={(e) => setPwConfirm(e.target.value)} 
                placeholder="Passwort bestätigen" 
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
                <span className="text-white/50">Ich stimme den Datenschutzbestimmungen zu.</span>
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
                className={"btn-primary w-full justify-center " + 
                  (pw.length < 6 || authLoading ? 'opacity-50 cursor-not-allowed' : '')}
              >
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Anmelden
              </button>
            ) : (
              <button 
                onClick={handleReg} 
                disabled={!privacy || pw.length < 6 || pw !== pwConfirm || authLoading} 
                className={"btn-primary w-full justify-center " + 
                  (!privacy || pw.length < 6 || pw !== pwConfirm || authLoading ? 'opacity-50 cursor-not-allowed' : '')}
              >
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                Registrieren
              </button>
            )}

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#111113] px-3 text-white/40">oder</span>
              </div>
            </div>

            <button 
              onClick={() => { setModal(false); finalize(); }} 
              className="btn-secondary w-full justify-center"
            >
              Nur kopieren (ohne Speichern)
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
  const cls = "w-full rounded-lg border border-white/10 bg-[#1A1A1D] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20";

  // Helper for validated input with character count
  const renderTextareaWithLimit = (value, onChange, placeholder, limit, rows = 2, extraClass = '') => {
    const remaining = limit - (value?.length || 0);
    const isNearLimit = remaining < limit * 0.1;
    
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
        <span className={`absolute bottom-2 right-2 text-xs ${isNearLimit ? 'text-[#FF6B35] font-medium' : 'text-white/30'}`}>
          {remaining}
        </span>
      </div>
    );
  };

  const renderInputWithLimit = (value, onChange, placeholder, limit, extraClass = '') => {
    const remaining = limit - (value?.length || 0);
    const isNearLimit = remaining < limit * 0.1;
    
    return (
      <div className="relative">
        <input 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value.slice(0, limit))} 
          placeholder={placeholder} 
          className={cls + " " + extraClass}
          maxLength={limit}
        />
        <span className={`absolute top-1/2 right-3 -translate-y-1/2 text-xs ${isNearLimit ? 'text-[#FF6B35] font-medium' : 'text-white/30'}`}>
          {remaining}
        </span>
      </div>
    );
  };

  if (b.type === 'TITLE') {
    return renderTextareaWithLimit(
      b.data.text,
      (val) => props.update(b.id, { text: val }),
      'Post-Titel...',
      INPUT_LIMITS.TITLE,
      2
    );
  }
  
  if (b.type === 'CHALLENGE') {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2 rounded-lg bg-purple-500/10 border border-purple-500/20 p-3 text-xs text-purple-400">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>Dieser Inhalt wird <strong className="text-purple-300">nicht</strong> im LinkedIn-Post veröffentlicht. Er dient der internen Dokumentation deiner Validierungs-Hypothese.</span>
        </div>
        {renderTextareaWithLimit(
          b.data.text,
          (val) => props.update(b.id, { text: val }),
          'Beschreibe dein Problem oder deine Hypothese, die du validieren möchtest...\n\nBeispiel: Wir glauben, dass B2B-SaaS-Gründer Schwierigkeiten haben, schnelles Marktfeedback zu erhalten.',
          INPUT_LIMITS.CHALLENGE,
          5,
          '!border-purple-500/30 focus:!border-purple-500 focus:!ring-purple-500/20'
        )}
      </div>
    );
  }
  
  if (b.type === 'POLL') {
    return (
      <div className="space-y-3">
        {renderTextareaWithLimit(
          b.data.q,
          (val) => props.update(b.id, { q: val }),
          'Hypothesen-Frage...',
          INPUT_LIMITS.POLL_QUESTION,
          2
        )}
        <div className="grid grid-cols-2 gap-2">
          {b.data.opts?.map((o, i) => (
            <div key={i} className="relative">
              <input 
                value={o} 
                onChange={(e) => { 
                  const opts = [...(b.data.opts || [])]; 
                  opts[i] = e.target.value.slice(0, INPUT_LIMITS.POLL_OPTION); 
                  props.update(b.id, { opts }); 
                }} 
                placeholder={"Option " + (i + 1)} 
                className={cls}
                maxLength={INPUT_LIMITS.POLL_OPTION}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (b.type === 'CTA') {
    return renderInputWithLimit(
      b.data.text,
      (val) => props.update(b.id, { text: val }),
      "z.B. Kommentiere 'PDF'",
      INPUT_LIMITS.CTA
    );
  }
  
  if (b.type === 'HASHTAG') {
    return renderInputWithLimit(
      b.data.tags,
      (val) => props.update(b.id, { tags: val }),
      '#Startup #MVP',
      INPUT_LIMITS.HASHTAG
    );
  }
  
  if (b.type === 'CUSTOM') {
    return renderTextareaWithLimit(
      b.data.text,
      (val) => props.update(b.id, { text: val }),
      'Eigener Text...',
      INPUT_LIMITS.CUSTOM,
      2
    );
  }
  
  if (b.type === 'MENTION') {
    return renderInputWithLimit(
      b.data.text,
      (val) => props.update(b.id, { text: val }),
      '@MaxMuster',
      INPUT_LIMITS.MENTION
    );
  }
  
  if (b.type === 'NUMBER') {
    return renderInputWithLimit(
      b.data.text,
      (val) => props.update(b.id, { text: val }),
      '87% der Gründer...',
      INPUT_LIMITS.NUMBER
    );
  }

  if (b.type === 'DURATION') return (
    <div className="flex gap-2">
      {Object.entries(DUR_LABELS).map(([v, l]) => (
        <label key={v} className={"flex-1 cursor-pointer rounded-lg border-2 py-3 text-center text-sm font-bold " + (b.data.val === v ? 'border-amber-700 bg-amber-800 text-white' : 'border-gray-200 bg-white text-gray-600')}>
          <input type="radio" name={"dur-" + b.id} value={v} checked={b.data.val === v} onChange={(e) => props.update(b.id, { val: e.target.value })} className="sr-only" />{l}
        </label>
      ))}
    </div>
  );

  if (b.type === 'DIVIDER') return (
    <div className="flex gap-2">
      {['line', 'stars'].map((s) => (
        <label key={s} className={"flex-1 cursor-pointer rounded-lg border-2 py-3 text-center text-sm font-bold " + (b.data.style === s ? 'border-amber-700 bg-amber-800 text-white' : 'border-gray-200 bg-white text-gray-600')}>
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
          if (b.type === 'TITLE' && b.data.text) return <p key={b.id} className="mb-3 text-white/80">{b.data.text}</p>;
          if (b.type === 'POLL' && b.data.q) return (
            <div key={b.id} className="mb-3 rounded-xl border border-white/10 bg-[#111113] p-3">
              <p className="mb-2 font-semibold text-white">🎯 {b.data.q}</p>
              {b.data.opts?.filter(Boolean).map((o, i) => <div key={i} className="mb-1.5 rounded-lg border border-white/10 bg-[#1A1A1D] px-3 py-2 text-white/70">{o}</div>)}
            </div>
          );
          if (b.type === 'CTA' && b.data.text) return <p key={b.id} className="mb-3 font-semibold text-[#FF6B35]">👉 {b.data.text}</p>;
          if (b.type === 'HASHTAG' && b.data.tags) return <p key={b.id} className="mb-3 text-[#00D4FF]">{b.data.tags}</p>;
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
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#00D4FF]" />
              <h3 className="font-bold text-white">Generierter LinkedIn-Post</h3>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-[#111113] border border-white/10 p-4 text-sm text-white/70">{s.text || 'Kein Text generiert'}</pre>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={copyText} 
              className={"btn-primary flex-1 justify-center " + (copied ? '!bg-[#00E676] !text-[#0A0A0B]' : '')}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Kopiert!' : 'Post-Text kopieren'}
            </button>
            <button 
              onClick={() => { props.onEdit(s); props.onClose(); }} 
              className="btn-secondary flex-1 justify-center"
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
// DASHBOARD COMPONENT (with improved error handling)
// ============================================
const Dashboard = function(props) {
  const { addToast } = useToast();
  const [tab, setTab] = useState('home');
  const [copiedId, setCopiedId] = useState(null);
  const [detailSurvey, setDetailSurvey] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('week');
  const [deleting, setDeleting] = useState(null);
  const copyTimeoutRef = useRef(null);

  // Admin-Status aus Datenbank laden (sicher)
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

  const copyTxt = (id, t) => { 
    navigator.clipboard.writeText(clean(t)); 
    setCopiedId(id);
    addToast('Text kopiert!', 'success', 2000);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 1500); 
  };
  
  const edit = (s) => { 
    props.setEditSurvey({ ...s, blockData: s.blockData || [] }); 
    props.nav('editor', { edit: true }); 
  };

  const deleteSurvey = async (id) => {
    setDeleting(id);
    try {
      await db.deleteSurvey(id);
      await props.loadSurveys();
      addToast('Umfrage gelöscht', 'success');
    } catch (err) {
      console.error('Failed to delete survey:', err);
      addToast('Löschen fehlgeschlagen: ' + err.message, 'error');
    } finally {
      setDeleting(null);
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm('Umfrage wirklich löschen?')) {
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
          <button onClick={() => props.nav('landing')} className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] shadow-lg shadow-[#FF6B35]/20 transition-transform group-hover:scale-105">
              <Zap className="h-6 w-6 text-[#0A0A0B]" />
            </div>
            <span className="font-['Syne'] text-lg font-bold">Breaking Dynamics</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-white/40 sm:block">{props.user?.email}</span>
            {isAdmin && (
              <button 
                onClick={() => props.nav('admin')} 
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
            <button onClick={props.logout} className="btn-ghost flex items-center gap-2">
              <LogOut className="h-4 w-4" />Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex rounded-xl border border-white/10 bg-[#111113] p-1">
            {[{ k: 'home', i: Home, l: 'Dashboard' }, { k: 'history', i: History, l: 'Historie' }, { k: 'analyse', i: LineChart, l: 'Analyse' }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} className={"flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all " + (tab === t.k ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B]' : 'text-white/60 hover:text-white hover:bg-white/5')}>
                <t.i className="h-4 w-4" />{t.l}
              </button>
            ))}
          </div>
          <button onClick={() => props.nav('editor')} className="btn-primary">
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />Neue Validierung
            </span>
          </button>
        </div>

        {props.error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Fehler beim Laden: {props.error}</span>
            <button onClick={props.loadSurveys} className="ml-auto rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium hover:bg-red-500/30 transition-colors">
              Erneut versuchen
            </button>
          </div>
        )}

        {props.loading ? (
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
                      <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Gesamt Tests</span>
                      <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-[#FF6B35]" />
                      </div>
                    </div>
                    <p className="font-['Syne'] text-4xl font-bold text-gradient-orange">{stats.total}</p>
                  </div>
                  <div className="card-dark p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Diese Woche</span>
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
                    <h3 className="font-['Syne'] text-lg font-bold text-white">Keine Umfragen</h3>
                    <p className="mt-2 text-sm text-white/40">Erstelle deine erste Validierung!</p>
                    <button onClick={() => props.nav('editor')} className="btn-primary mt-6">
                      Neue Validierung
                    </button>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="border-b border-white/10 bg-[#1A1A1D]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Titel</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Hypothese</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Erstellt</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">Aktionen</th>
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
      addToast('Feedback gesendet!', 'success');
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
      addToast('Feedback konnte nicht gesendet werden', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B] shadow-lg shadow-[#FF6B35]/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-[#FF6B35]/40 active:scale-95"
        title="Feedback geben"
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
                <h3 className="font-['Syne'] text-xl font-bold text-white">Danke für dein Feedback!</h3>
                <p className="mt-2 text-white/50">Wir melden uns bei dir.</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
                      <MessageSquare className="h-5 w-5 text-[#0A0A0B]" />
                    </div>
                    <h3 className="font-['Syne'] text-lg font-bold text-white">Feedback</h3>
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
                    Bug melden
                  </button>
                  <button
                    onClick={() => setFeedbackType('feature')}
                    className={"flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition-all " + 
                      (feedbackType === 'feature' ? 'border-[#00D4FF] bg-[#00D4FF]/10 text-[#00D4FF]' : 'border-white/10 bg-transparent text-white/50 hover:border-white/20 hover:text-white')}
                  >
                    <Lightbulb className="h-4 w-4" />
                    Idee
                  </button>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={feedbackType === 'bug' ? 'Beschreibe den Bug...' : 'Beschreibe deine Idee...'}
                  className="input-dark mb-4 resize-none"
                  rows={4}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-Mail (optional, für Rückfragen)"
                  className="input-dark mb-4"
                />

                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || loading}
                  className={"btn-primary w-full justify-center " + 
                    (!message.trim() || loading ? 'opacity-50 cursor-not-allowed' : '')}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Absenden
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
    <ToastProvider>
      <App />
      <FeedbackWidget />
    </ToastProvider>
  );
};

export default AppWithProviders;
