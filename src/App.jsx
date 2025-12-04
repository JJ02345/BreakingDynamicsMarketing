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
          className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg animate-slide-in ${
            toast.type === 'error' ? 'bg-red-600 text-white' :
            toast.type === 'success' ? 'bg-green-600 text-white' :
            toast.type === 'warning' ? 'bg-amber-500 text-white' :
            'bg-gray-800 text-white'
          }`}
        >
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)}
            className="ml-2 rounded-lg p-1 hover:bg-white/20"
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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center px-4">
          <button onClick={() => props.nav('landing')} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Zurück</span>
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">{props.title}</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <p className="text-gray-600">Dies ist ein Platzhaltertext für {props.title}.</p>
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Fast geschafft!</h1>
            <p className="mt-2 text-gray-600">Bestätige deine E-Mail-Adresse</p>
          </div>

          <div className="mb-6 rounded-xl bg-blue-50 p-4">
            <p className="text-center text-sm text-blue-800">
              Wir haben eine Bestätigungs-E-Mail an
            </p>
            <p className="mt-1 text-center font-bold text-blue-900">
              {props.email}
            </p>
            <p className="mt-2 text-center text-sm text-blue-800">
              gesendet. Klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.
            </p>
          </div>

          <div className="mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">1</div>
              <p className="text-sm text-gray-600">Öffne dein E-Mail-Postfach</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">2</div>
              <p className="text-sm text-gray-600">Suche nach einer E-Mail von Breaking Dynamics</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">3</div>
              <p className="text-sm text-gray-600">Klicke auf "E-Mail bestätigen"</p>
            </div>
          </div>

          <div className="mb-6 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>Keine E-Mail erhalten? Schau in deinem Spam-Ordner nach oder warte einige Minuten.</span>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCheckAgain}
              disabled={checking}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-800 px-4 py-3 text-sm font-bold text-white hover:bg-amber-900 disabled:opacity-50"
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Anmeldung
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'login' ? 'Anmelden' : 'Registrieren'}
          </h2>
          <button onClick={props.onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="E-Mail" 
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" 
          />
          
          <input 
            type="password" 
            value={pw} 
            onChange={(e) => setPw(e.target.value)} 
            placeholder="Passwort" 
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" 
          />
          
          {mode === 'register' && (
            <input 
              type="password" 
              value={pwConfirm} 
              onChange={(e) => setPwConfirm(e.target.value)} 
              placeholder="Passwort bestätigen" 
              className={"w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 " + 
                (pwConfirm && pw !== pwConfirm 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                )
              } 
            />
          )}
          
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <button 
            onClick={mode === 'login' ? handleLogin : handleRegister} 
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Anmelden' : 'Registrieren'}
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">oder</span>
            </div>
          </div>
          
          <button 
            onClick={switchMode} 
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Breaking Dynamics</p>
              <p className="text-xs text-blue-600">Survey Marketing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button onClick={() => props.nav('dashboard')} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Dashboard</button>
            ) : (
              <button onClick={props.showLogin} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <LogIn className="h-4 w-4" />Anmelden
              </button>
            )}
            <button onClick={() => props.nav('editor')} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">Kostenlos starten</button>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-gray-50 to-white px-4 pb-20 pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            <TestTube className="h-4 w-4" />Für Gründer
          </div>
          <h1 className="mb-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Validiere Deinen <span className="text-blue-600">Market-Fit</span> in 48h
          </h1>
          <p className="mb-8 text-lg text-gray-600">Breaking Dynamics liefert präzise Marktdaten durch LinkedIn-Umfragen.</p>
          <button onClick={() => props.nav('editor')} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white hover:bg-blue-700">
            Validierung starten
          </button>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {[
            { icon: Gauge, title: 'Schnelle Validierung', desc: 'Daten in 48h' },
            { icon: Target, title: 'Echtes Feedback', desc: 'Von potenziellen Kunden' },
            { icon: Rocket, title: 'Growth-Hebel', desc: 'Content + Insights' }
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:border-blue-500">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-gray-900 px-4 py-12">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">Breaking Dynamics Marketing</span>
          </div>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <button onClick={() => props.nav('datenschutz')} className="hover:text-white">Datenschutz</button>
            <button onClick={() => props.nav('agb')} className="hover:text-white">AGB</button>
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
    
    if (dragIdx === idx) return 'border-amber-700 bg-amber-800';
    if (activeBlock === id) {
      if (isChallenge) return 'border-purple-500 bg-purple-50 ring-2 ring-purple-500';
      return 'border-amber-700 bg-amber-50 ring-2 ring-amber-700';
    }
    if (isChallenge) return 'border-purple-200 bg-white hover:border-purple-300';
    return 'border-gray-200 bg-white hover:border-gray-300';
  };

  const handleNewSurvey = () => {
    setStep('edit');
    setResult('');
    setBlocks(defaultBlocks());
    props.setEditSurvey(null);
  };

  if (step === 'result') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900">Fertig!</h2>
          </div>
          <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">{result}</pre>
          </div>
          <button onClick={copyTxt} className={"flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold " + (copied ? 'bg-green-600 text-white' : 'bg-amber-800 text-white hover:bg-amber-900')}>
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copied ? 'Kopiert!' : 'Text kopieren'}
          </button>
          <div className="mt-3 flex gap-3">
            <button onClick={handleNewSurvey} className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Neue Umfrage</button>
            {isAuthenticated && <button onClick={() => props.nav('dashboard')} className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200">Dashboard</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button onClick={() => props.nav('dashboard')} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Home className="h-4 w-4" />Dashboard
              </button>
            ) : (
              <button onClick={() => props.nav('landing')} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4" />Zurück
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Flame className="h-4 w-4 text-white" />
              </div>
              <span className="hidden text-sm font-bold text-gray-900 sm:block">Breaking Dynamics</span>
            </div>
          </div>
          <span className="rounded-full bg-amber-800 px-3 py-1 text-xs font-bold uppercase text-white">Editor</span>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        <div className={"flex flex-shrink-0 flex-col border-r border-gray-200 bg-white transition-all " + (sidebar ? 'w-56' : 'w-12')}>
          <button onClick={() => setSidebar(!sidebar)} className={"flex items-center justify-center border-b border-gray-200 p-3 " + (sidebar ? 'bg-amber-800 text-white' : 'bg-white text-gray-500 hover:bg-gray-50')}>
            <Plus className={"h-5 w-5 transition-transform " + (sidebar ? 'rotate-45' : '')} />
          </button>
          {sidebar && (
            <div className="flex-1 overflow-y-auto p-2">
              <p className="mb-2 px-2 text-xs font-bold uppercase text-gray-400">Bausteine</p>
              {Object.entries(BLOCKS).map(([k, v]) => {
                const isChallenge = k === 'CHALLENGE';
                return (
                  <button 
                    key={k} 
                    onClick={() => { if (!v.req) addBlock(k); }} 
                    disabled={v.req}
                    draggable={!v.req}
                    onDragStart={(e) => { if (!v.req) handleSidebarDragStart(e, k); }}
                    className={"flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm transition-all " + 
                      (v.req ? 'cursor-not-allowed opacity-40' : 
                       isChallenge ? 'text-purple-700 hover:bg-purple-100 cursor-grab active:cursor-grabbing' : 
                       'text-gray-700 hover:bg-amber-800 hover:text-white cursor-grab active:cursor-grabbing')}
                  >
                    <v.icon className="h-4 w-4" />
                    <span className="truncate">{v.name}</span>
                    {isChallenge && <span className="ml-auto rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-600">Intern</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div 
            className="flex-1 overflow-y-auto p-4"
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
                      (isDragOver ? 'border-dashed border-blue-500 bg-blue-50 ' : '') +
                      (isDragging ? 'cursor-grabbing ' : 'cursor-grab ') +
                      getStyle(b.id, i)
                    }
                  >
                    <div className={"flex items-center gap-2 border-b px-3 py-2 " + 
                      (activeBlock === b.id 
                        ? (isChallenge ? 'border-purple-200 bg-purple-100' : 'border-amber-200 bg-amber-100') 
                        : (isChallenge ? 'border-purple-100 bg-purple-50' : 'border-gray-100 bg-gray-50'))}>
                      <GripVertical className={"h-4 w-4 " + (isDragging ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600')} />
                      {React.createElement(BLOCKS[b.type].icon, { className: 'h-4 w-4 ' + (isChallenge ? 'text-purple-600' : 'text-gray-600') })}
                      <span className={"flex-1 text-xs font-bold " + 
                        (activeBlock === b.id 
                          ? (isChallenge ? 'uppercase text-purple-700' : 'uppercase text-amber-800') 
                          : (isChallenge ? 'text-purple-700' : 'text-gray-700'))}>{BLOCKS[b.type].name}</span>
                      {isChallenge && (
                        <span className="rounded bg-purple-200 px-2 py-0.5 text-xs font-bold text-purple-700">Intern</span>
                      )}
                      {BLOCKS[b.type].req ? (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">Pflicht</span>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); deleteBlock(b.id); }} className="rounded p-1 hover:bg-red-100">
                          <Trash2 className="h-4 w-4 text-red-400" />
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
                  className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-400 transition-all hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600"
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-amber-500', 'bg-amber-100'); }}
                  onDragLeave={(e) => { e.currentTarget.classList.remove('border-amber-500', 'bg-amber-100'); }}
                  onDrop={(e) => { handleDropFromSidebar(e); e.currentTarget.classList.remove('border-amber-500', 'bg-amber-100'); }}
                >
                  <Plus className="mx-auto mb-2 h-6 w-6" />
                  Baustein hier ablegen oder aus der Sidebar ziehen
                </div>
              )}

              <div className="mt-4 space-y-3 rounded-xl border-2 border-gray-200 bg-white p-4">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="E-Mail-Adresse" 
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                  disabled={isAuthenticated}
                />
                
                {saveError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {saveError}
                  </div>
                )}
                
                <button 
                  onClick={handleGen} 
                  disabled={!canGen || saving} 
                  className={"flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold uppercase " + (canGen && !saving ? 'bg-amber-800 text-white hover:bg-amber-900' : 'cursor-not-allowed bg-gray-200 text-gray-400')}
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
                  {saving ? 'Speichern...' : 'Erstellen'}
                </button>
                <button onClick={() => props.nav(isAuthenticated ? 'dashboard' : 'landing')} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold uppercase text-gray-600 hover:bg-gray-50">
                  <X className="h-4 w-4" />{isAuthenticated ? 'Abbrechen' : 'Zur Startseite'}
                </button>
              </div>
            </div>
          </div>

          <div className="hidden w-80 flex-col border-l border-gray-200 bg-white lg:flex">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <p className="text-sm font-bold uppercase text-gray-900">Vorschau</p>
              <div className="flex rounded-lg border border-gray-200 p-1">
                <button onClick={() => setPreviewMode('desktop')} className={"rounded p-1.5 " + (previewMode === 'desktop' ? 'bg-amber-800 text-white' : 'text-gray-400')}>
                  <Monitor className="h-4 w-4" />
                </button>
                <button onClick={() => setPreviewMode('mobile')} className={"rounded p-1.5 " + (previewMode === 'mobile' ? 'bg-amber-800 text-white' : 'text-gray-400')}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-800">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Daten sichern?</h3>
              </div>
              <button onClick={() => setModal(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => { setModalMode('login'); setRegError(''); setPw(''); setPwConfirm(''); }}
                className={"flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all " +
                  (modalMode === 'login' 
                    ? 'bg-amber-800 text-white' 
                    : 'text-gray-600 hover:bg-gray-100')}
              >
                Anmelden
              </button>
              <button
                onClick={() => { setModalMode('register'); setRegError(''); setPw(''); setPwConfirm(''); }}
                className={"flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all " +
                  (modalMode === 'register' 
                    ? 'bg-amber-800 text-white' 
                    : 'text-gray-600 hover:bg-gray-100')}
              >
                Registrieren
              </button>
            </div>

            <input 
              type="email" 
              value={email} 
              readOnly 
              className="mb-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm" 
            />

            <input 
              type="password" 
              value={pw} 
              onChange={(e) => setPw(e.target.value)} 
              placeholder="Passwort" 
              className="mb-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" 
            />

            {modalMode === 'register' && (
              <input 
                type="password" 
                value={pwConfirm} 
                onChange={(e) => setPwConfirm(e.target.value)} 
                placeholder="Passwort bestätigen" 
                className={"mb-2 w-full rounded-lg border px-4 py-3 text-sm " + 
                  (pwConfirm && pw !== pwConfirm ? 'border-red-300' : 'border-gray-300')} 
              />
            )}

            {modalMode === 'register' && (
              <label className="mb-3 flex items-start gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={privacy} 
                  onChange={(e) => setPrivacy(e.target.checked)} 
                  className="mt-1 rounded" 
                />
                <span className="text-gray-600">Ich stimme den Datenschutzbestimmungen zu.</span>
              </label>
            )}

            {regError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {regError}
              </div>
            )}

            {modalMode === 'login' ? (
              <button 
                onClick={handleLogin} 
                disabled={pw.length < 6 || authLoading} 
                className={"flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold uppercase " + 
                  (pw.length >= 6 && !authLoading
                    ? 'bg-amber-800 text-white hover:bg-amber-900' 
                    : 'cursor-not-allowed bg-gray-200 text-gray-400')}
              >
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Anmelden
              </button>
            ) : (
              <button 
                onClick={handleReg} 
                disabled={!privacy || pw.length < 6 || pw !== pwConfirm || authLoading} 
                className={"flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold uppercase " + 
                  (privacy && pw.length >= 6 && pw === pwConfirm && !authLoading
                    ? 'bg-amber-800 text-white hover:bg-amber-900' 
                    : 'cursor-not-allowed bg-gray-200 text-gray-400')}
              >
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                Registrieren
              </button>
            )}

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">oder</span>
              </div>
            </div>

            <button 
              onClick={() => { setModal(false); finalize(); }} 
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
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
  const cls = "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm";

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
        <span className={`absolute bottom-2 right-2 text-xs ${isNearLimit ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
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
        <span className={`absolute top-1/2 right-3 -translate-y-1/2 text-xs ${isNearLimit ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
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
        <div className="flex items-start gap-2 rounded-lg bg-purple-50 p-3 text-xs text-purple-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>Dieser Inhalt wird <strong>nicht</strong> im LinkedIn-Post veröffentlicht. Er dient der internen Dokumentation deiner Validierungs-Hypothese.</span>
        </div>
        {renderTextareaWithLimit(
          b.data.text,
          (val) => props.update(b.id, { text: val }),
          'Beschreibe dein Problem oder deine Hypothese, die du validieren möchtest...\n\nBeispiel: Wir glauben, dass B2B-SaaS-Gründer Schwierigkeiten haben, schnelles Marktfeedback zu erhalten.',
          INPUT_LIMITS.CHALLENGE,
          5,
          'border-purple-200 focus:border-purple-400 focus:ring-purple-400'
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
    <div className={"rounded-2xl border border-gray-200 bg-white shadow-xl " + (props.mobile ? 'text-xs' : 'text-sm')}>
      {props.mobile && <div className="flex justify-center border-b border-gray-100 py-2"><div className="h-1 w-16 rounded-full bg-gray-300"></div></div>}
      <div className="p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">LM</div>
          <div>
            <p className="font-bold text-gray-900">Lea Meier</p>
            <p className="text-xs text-gray-500">Startup Gründerin</p>
          </div>
        </div>
        {has ? visibleBlocks.map(b => {
          if (b.type === 'TITLE' && b.data.text) return <p key={b.id} className="mb-3 text-gray-800">{b.data.text}</p>;
          if (b.type === 'POLL' && b.data.q) return (
            <div key={b.id} className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <p className="mb-2 font-semibold text-gray-900">🎯 {b.data.q}</p>
              {b.data.opts?.filter(Boolean).map((o, i) => <div key={i} className="mb-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700">{o}</div>)}
            </div>
          );
          if (b.type === 'CTA' && b.data.text) return <p key={b.id} className="mb-3 font-semibold text-blue-600">👉 {b.data.text}</p>;
          if (b.type === 'HASHTAG' && b.data.tags) return <p key={b.id} className="mb-3 text-blue-600">{b.data.tags}</p>;
          return null;
        }) : (
          <div className="py-12 text-center text-gray-400">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{s.title}</h2>
            <p className="text-sm text-gray-500">Erstellt am {s.created}</p>
          </div>
          <button onClick={props.onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {s.validation_challenge && (
            <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-purple-900">Validierungs-Herausforderung</h3>
                <span className="rounded bg-purple-200 px-2 py-0.5 text-xs font-bold text-purple-700">Intern</span>
              </div>
              <p className="text-sm text-purple-800 whitespace-pre-wrap">{s.validation_challenge}</p>
            </div>
          )}
          
          {s.question && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="mb-2 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-gray-900">Umfrage-Frage</h3>
              </div>
              <p className="text-sm text-gray-700">{s.question}</p>
            </div>
          )}
          
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Generierter LinkedIn-Post</h3>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-700 border border-gray-200">{s.text || 'Kein Text generiert'}</pre>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={copyText} 
              className={"flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold " + (copied ? 'bg-green-600 text-white' : 'bg-amber-800 text-white hover:bg-amber-900')}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Kopiert!' : 'Post-Text kopieren'}
            </button>
            <button 
              onClick={() => { props.onEdit(s); props.onClose(); }} 
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <button onClick={() => props.nav('landing')} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">Breaking Dynamics</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-500 sm:block">{props.user?.email}</span>
            {isAdmin && (
              <button 
                onClick={() => props.nav('admin')} 
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-indigo-700"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
            <button onClick={props.logout} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <LogOut className="h-4 w-4" />Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex rounded-xl border border-gray-200 bg-white p-1">
            {[{ k: 'home', i: Home, l: 'Dashboard' }, { k: 'history', i: History, l: 'Historie' }, { k: 'analyse', i: LineChart, l: 'Analyse' }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} className={"flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium " + (tab === t.k ? 'bg-amber-800 text-white' : 'text-gray-600 hover:bg-gray-100')}>
                <t.i className="h-4 w-4" />{t.l}
              </button>
            ))}
          </div>
          <button onClick={() => props.nav('editor')} className="flex items-center gap-2 rounded-xl bg-amber-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-900">
            <Plus className="h-4 w-4" />Neue Validierung
          </button>
        </div>

        {props.error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Fehler beim Laden: {props.error}</span>
            <button onClick={props.loadSurveys} className="ml-auto rounded bg-red-100 px-2 py-1 text-xs font-medium hover:bg-red-200">
              Erneut versuchen
            </button>
          </div>
        )}

        {props.loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : (
          <>
            {tab === 'home' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Gesamt Tests</span>
                      <BarChart3 className="h-5 w-5 text-amber-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Diese Woche</span>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.week}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-bold text-gray-900">
                      <LineChart className="h-5 w-5 text-blue-600" />
                      Test-Verlauf
                    </h3>
                    <div className="flex rounded-lg border border-gray-200 p-1">
                      {['week', 'month', 'year'].map(p => (
                        <button 
                          key={p}
                          onClick={() => setChartPeriod(p)} 
                          className={"rounded px-3 py-1 text-xs font-medium transition-all " + (chartPeriod === p ? 'bg-amber-800 text-white' : 'text-gray-600 hover:bg-gray-100')}
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
                                    <span className="absolute -top-6 text-xs font-bold text-amber-700">{d.count}</span>
                                  )}
                                  <div 
                                    className={"w-full max-w-[40px] rounded-t-lg transition-all " + (d.count > 0 ? 'bg-gradient-to-t from-amber-600 to-amber-400' : 'bg-gray-200')}
                                    style={{ height: `${height}%`, minHeight: '8px' }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{d.label}</span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
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
                  className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-amber-400 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                      <History className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Letzte Tests</h3>
                      <p className="text-sm text-gray-500">{props.surveys.length} Validierungen insgesamt</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            )}

            {tab === 'history' && (
              <div className="rounded-2xl border border-gray-200 bg-white">
                {props.surveys.length === 0 ? (
                  <div className="p-12 text-center">
                    <History className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <h3 className="text-lg font-bold text-gray-900">Keine Umfragen</h3>
                    <p className="mt-2 text-sm text-gray-500">Erstelle deine erste Validierung!</p>
                    <button onClick={() => props.nav('editor')} className="mt-4 rounded-xl bg-amber-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-900">
                      Neue Validierung
                    </button>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Titel</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Hypothese</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Erstellt</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.surveys.map(s => (
                        <tr key={s.id} className="border-b border-gray-100 hover:bg-amber-50 cursor-pointer" onClick={() => setDetailSurvey(s)}>
                          <td className="px-6 py-4 font-medium text-gray-900">{s.title}</td>
                          <td className="px-6 py-4">
                            {s.validation_challenge ? (
                              <span className="inline-flex items-center gap-1 rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                                <FlaskConical className="h-3 w-3" />
                                <span className="max-w-[200px] truncate">{s.validation_challenge}</span>
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{s.created}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button onClick={(e) => { e.stopPropagation(); copyTxt(s.id, s.text); }} className={"rounded-lg p-2 " + (copiedId === s.id ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-gray-100')}>
                                {copiedId === s.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); edit(s); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setDetailSurvey(s); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); confirmDelete(s.id); }} 
                                disabled={deleting === s.id}
                                className="rounded-lg p-2 text-gray-400 hover:bg-red-100 hover:text-red-600"
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
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                <LineChart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900">Analyse</h3>
                <p className="mt-2 text-sm text-gray-500">Kommt bald...</p>
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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95"
        title="Feedback geben"
      >
        <Rocket className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 sm:items-center sm:justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Danke für dein Feedback!</h3>
                <p className="mt-2 text-gray-600">Wir melden uns bei dir.</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                      <Rocket className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Feedback</h3>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 flex gap-2">
                  <button
                    onClick={() => setFeedbackType('bug')}
                    className={"flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition-all " + 
                      (feedbackType === 'bug' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300')}
                  >
                    <Bug className="h-4 w-4" />
                    Bug melden
                  </button>
                  <button
                    onClick={() => setFeedbackType('feature')}
                    className={"flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition-all " + 
                      (feedbackType === 'feature' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300')}
                  >
                    <Lightbulb className="h-4 w-4" />
                    Idee
                  </button>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={feedbackType === 'bug' ? 'Beschreibe den Bug...' : 'Beschreibe deine Idee...'}
                  className="mb-4 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  rows={4}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-Mail (optional, für Rückfragen)"
                  className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />

                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || loading}
                  className={"flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all " + 
                    (message.trim() && !loading ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-200 text-gray-400')}
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
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </ToastProvider>
  );
};

export default AppWithProviders;
