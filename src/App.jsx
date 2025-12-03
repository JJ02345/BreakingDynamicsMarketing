import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Sparkles, TrendingUp, Rocket, CheckCircle2, Flame, Lightbulb, TestTube, Gauge, GripVertical, Trash2, Plus, Hash, MessageSquare, Type, Timer, PlusCircle, AtSign, Calendar, Minus, BarChart3, Database, LineChart, FileText, Bold, Home, History, Settings, Eye, Edit3, Zap, Award, ChevronRight, X, LogOut, Files, Download, Smartphone, Monitor, Target, Quote, ArrowLeft, LogIn, FlaskConical, AlertCircle } from 'lucide-react';

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

const App = function() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [surveys, setSurveys] = useState([
    { 
      id: 1, 
      title: 'Problem-Solution Fit', 
      question: 'Was ist euer größtes Problem?', 
      blocks: 5, 
      created: '2024-01-15', 
      scheduled: null, 
      text: 'Test...', 
      blockData: [],
      validation_challenge: 'Wir glauben, dass Startups Schwierigkeiten haben, schnelles Marktfeedback zu erhalten. Unsere Hypothese ist, dass LinkedIn-Umfragen eine effektive Methode zur Validierung von Geschäftsideen sind.'
    }
  ]);
  const [editSurvey, setEditSurvey] = useState(null);
  const [loginModal, setLoginModal] = useState(false);

  const login = function(email) { setUser({ email: email, name: email.split('@')[0] }); setLoginModal(false); };
  const logout = function() { setUser(null); setPage('landing'); };

  if (page === 'dashboard' && !user) {
    return React.createElement(Landing, { nav: setPage, showLogin: function() { setLoginModal(true); }, user: user, loginModal: loginModal, setLoginModal: setLoginModal, login: login });
  }

  if (page === 'datenschutz' || page === 'agb') {
    return React.createElement(LegalPage, { title: page === 'datenschutz' ? 'Datenschutz' : 'AGB', nav: setPage });
  }

  if (page === 'landing') {
    return React.createElement(Landing, { nav: setPage, showLogin: function() { setLoginModal(true); }, user: user, loginModal: loginModal, setLoginModal: setLoginModal, login: login });
  }

  if (page === 'editor') {
    return React.createElement(Editor, { nav: setPage, user: user, login: login, surveys: surveys, setSurveys: setSurveys, editSurvey: editSurvey, setEditSurvey: setEditSurvey });
  }

  if (page === 'dashboard') {
    return React.createElement(Dashboard, { nav: setPage, user: user, logout: logout, surveys: surveys, setEditSurvey: setEditSurvey });
  }

  return null;
};

const LegalPage = function(props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center px-4">
          <button onClick={function() { props.nav('landing'); }} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
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

const LoginModal = function(props) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const handleLogin = function() {
    if (email.includes('@') && pw.length >= 6) {
      props.onLogin(email);
      props.nav('dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Anmelden</h2>
          <button onClick={props.onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <input type="email" value={email} onChange={function(e) { setEmail(e.target.value); }} placeholder="E-Mail" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" />
          <input type="password" value={pw} onChange={function(e) { setPw(e.target.value); }} placeholder="Passwort" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" />
          <button onClick={handleLogin} className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">Anmelden</button>
        </div>
      </div>
    </div>
  );
};

const Landing = function(props) {
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
            {props.user ? (
              <button onClick={function() { props.nav('dashboard'); }} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Dashboard</button>
            ) : (
              <button onClick={props.showLogin} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <LogIn className="h-4 w-4" />Anmelden
              </button>
            )}
            <button onClick={function() { props.nav('editor'); }} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">Kostenlos starten</button>
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
          <button onClick={function() { props.nav('editor'); }} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white hover:bg-blue-700">
            <Rocket className="h-5 w-5" />Validierung starten
          </button>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {[
            { icon: Gauge, title: 'Schnelle Validierung', desc: 'Daten in 48h' },
            { icon: Target, title: 'Echtes Feedback', desc: 'Von potenziellen Kunden' },
            { icon: Rocket, title: 'Growth-Hebel', desc: 'Content + Insights' }
          ].map(function(item, i) {
            return (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:border-blue-500">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            );
          })}
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
            <button onClick={function() { props.nav('datenschutz'); }} className="hover:text-white">Datenschutz</button>
            <button onClick={function() { props.nav('agb'); }} className="hover:text-white">AGB</button>
          </div>
        </div>
      </footer>

      {props.loginModal && <LoginModal onClose={function() { props.setLoginModal(false); }} onLogin={props.login} nav={props.nav} />}
    </div>
  );
};

const Editor = function(props) {
  const [blocks, setBlocks] = useState(function() { return props.editSurvey?.blockData || defaultBlocks(); });
  const [sidebar, setSidebar] = useState(true);
  const [email, setEmail] = useState(props.user?.email || '');
  const [dragIdx, setDragIdx] = useState(null);
  const [result, setResult] = useState('');
  const [step, setStep] = useState('edit');
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState(false);
  const [pw, setPw] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');

  const addBlock = function(t) { var id = genId(); setBlocks(function(p) { return [...p, { id: id, type: t, data: initData(t) }]; }); setActiveBlock(id); };
  const updateBlock = function(id, d) { setBlocks(function(p) { return p.map(function(b) { return b.id === id ? { ...b, data: { ...b.data, ...d } } : b; }); }); };
  const deleteBlock = function(id) { var b = blocks.find(function(x) { return x.id === id; }); if (b && !BLOCKS[b.type].req) setBlocks(function(p) { return p.filter(function(x) { return x.id !== id; }); }); };

  var canGen = useMemo(function() { var p = blocks.find(function(b) { return b.type === 'POLL'; }); var filled = p?.data.opts?.filter(function(o) { return o?.trim(); }).length || 0; return p?.data.q?.trim() && filled >= 2 && email.trim(); }, [blocks, email]);

  // Extract validation_challenge from CHALLENGE block (NOT included in post text)
  var getValidationChallenge = function() {
    var challengeBlock = blocks.find(function(b) { return b.type === 'CHALLENGE'; });
    return challengeBlock?.data?.text?.trim() || '';
  };

  // Generate LinkedIn post text - EXCLUDES CHALLENGE block
  var genText = function() {
    var t = '';
    blocks.forEach(function(b) {
      // CHALLENGE block is explicitly excluded from generated text
      if (b.type === 'CHALLENGE') return;
      
      if (b.type === 'TITLE' && b.data.text) t += b.data.text + '\n\n\n';
      if (b.type === 'POLL' && b.data.q) t += '🎯 ' + b.data.q + '\n\n';
      if (b.type === 'CTA' && b.data.text) t += '👉 ' + b.data.text + '\n\n\n';
      if (b.type === 'CUSTOM' && b.data.text) t += b.data.text + '\n\n\n';
      if (b.type === 'HASHTAG' && b.data.tags) t += '\n\n' + b.data.tags;
    });
    return t.trim();
  };

  var finalize = function() {
    var txt = genText();
    var validationChallenge = getValidationChallenge();
    
    var s = { 
      id: Date.now(), 
      title: blocks.find(function(b) { return b.type === 'TITLE'; })?.data.text?.slice(0, 50) || 'Umfrage', 
      question: blocks.find(function(b) { return b.type === 'POLL'; })?.data.q || '', 
      blocks: blocks.length, 
      created: new Date().toISOString().split('T')[0], 
      scheduled: null, 
      text: txt, 
      blockData: blocks,
      // Separate field for Supabase storage - NOT included in post text
      validation_challenge: validationChallenge
    };
    
    // TODO: Supabase Integration
    // await supabase.from('surveys').insert({
    //   ...s,
    //   validation_challenge: validationChallenge  // Stored in dedicated column
    // });
    
    props.setSurveys(function(p) { return [s, ...p]; });
    setResult(txt);
    setStep('result');
  };

  var handleGen = function() { if (!canGen) return; if (!props.user) { setModal(true); return; } finalize(); };
  var handleReg = function() { if (pw.length >= 6 && privacy) { props.login(email); setModal(false); finalize(); } };
  var copyTxt = function() { navigator.clipboard.writeText(clean(result)); setCopied(true); setTimeout(function() { setCopied(false); }, 2000); };

  var getStyle = function(id, idx) {
    var block = blocks.find(function(x) { return x.id === id; });
    var isChallenge = block?.type === 'CHALLENGE';
    
    if (dragIdx === idx) return 'border-amber-700 bg-amber-800';
    if (activeBlock === id) {
      if (isChallenge) return 'border-purple-500 bg-purple-50 ring-2 ring-purple-500';
      return 'border-amber-700 bg-amber-50 ring-2 ring-amber-700';
    }
    if (isChallenge) return 'border-purple-200 bg-white hover:border-purple-300';
    return 'border-gray-200 bg-white hover:border-gray-300';
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
            <button onClick={function() { setStep('edit'); setResult(''); setBlocks(defaultBlocks()); }} className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Neue Umfrage</button>
            {props.user && <button onClick={function() { props.nav('dashboard'); }} className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200">Dashboard</button>}
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
            {props.user ? (
              <button onClick={function() { props.nav('dashboard'); }} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Home className="h-4 w-4" />Dashboard
              </button>
            ) : (
              <button onClick={function() { props.nav('landing'); }} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
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
          <button onClick={function() { setSidebar(!sidebar); }} className={"flex items-center justify-center border-b border-gray-200 p-3 " + (sidebar ? 'bg-amber-800 text-white' : 'bg-white text-gray-500 hover:bg-gray-50')}>
            <Plus className={"h-5 w-5 transition-transform " + (sidebar ? 'rotate-45' : '')} />
          </button>
          {sidebar && (
            <div className="flex-1 overflow-y-auto p-2">
              <p className="mb-2 px-2 text-xs font-bold uppercase text-gray-400">Bausteine</p>
              {Object.entries(BLOCKS).map(function([k, v]) {
                var isChallenge = k === 'CHALLENGE';
                return (
                  <button 
                    key={k} 
                    onClick={function() { if (!v.req) addBlock(k); }} 
                    disabled={v.req} 
                    className={"flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm transition-all " + 
                      (v.req ? 'cursor-not-allowed opacity-40' : 
                       isChallenge ? 'text-purple-700 hover:bg-purple-100' : 
                       'text-gray-700 hover:bg-amber-800 hover:text-white')}
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
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mx-auto max-w-xl space-y-3">
              {blocks.map(function(b, i) {
                var isChallenge = b.type === 'CHALLENGE';
                return (
                  <div key={b.id} onClick={function() { setActiveBlock(b.id); }} className={"cursor-pointer rounded-xl border-2 transition-all " + getStyle(b.id, i)}>
                    <div className={"flex items-center gap-2 border-b px-3 py-2 " + 
                      (activeBlock === b.id 
                        ? (isChallenge ? 'border-purple-200 bg-purple-100' : 'border-amber-200 bg-amber-100') 
                        : (isChallenge ? 'border-purple-100 bg-purple-50' : 'border-gray-100 bg-gray-50'))}>
                      <GripVertical className="h-4 w-4 text-gray-400" />
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
                        <button onClick={function(e) { e.stopPropagation(); deleteBlock(b.id); }} className="rounded p-1 hover:bg-red-100">
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

              <div className="mt-4 space-y-3 rounded-xl border-2 border-gray-200 bg-white p-4">
                <input type="email" value={email} onChange={function(e) { setEmail(e.target.value); }} placeholder="E-Mail-Adresse" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" />
                <button onClick={handleGen} disabled={!canGen} className={"flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold uppercase " + (canGen ? 'bg-amber-800 text-white hover:bg-amber-900' : 'cursor-not-allowed bg-gray-200 text-gray-400')}>
                  <Rocket className="h-5 w-5" />Erstellen
                </button>
                <button onClick={function() { props.nav(props.user ? 'dashboard' : 'landing'); }} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold uppercase text-gray-600 hover:bg-gray-50">
                  <X className="h-4 w-4" />{props.user ? 'Abbrechen' : 'Zur Startseite'}
                </button>
              </div>
            </div>
          </div>

          <div className="hidden w-80 flex-col border-l border-gray-200 bg-white lg:flex">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <p className="text-sm font-bold uppercase text-gray-900">Vorschau</p>
              <div className="flex rounded-lg border border-gray-200 p-1">
                <button onClick={function() { setPreviewMode('desktop'); }} className={"rounded p-1.5 " + (previewMode === 'desktop' ? 'bg-amber-800 text-white' : 'text-gray-400')}>
                  <Monitor className="h-4 w-4" />
                </button>
                <button onClick={function() { setPreviewMode('mobile'); }} className={"rounded p-1.5 " + (previewMode === 'mobile' ? 'bg-amber-800 text-white' : 'text-gray-400')}>
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
            <div className="mb-4 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-800">
                <Rocket className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Daten sichern?</h3>
            </div>
            <input type="email" value={email} readOnly className="mb-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm" />
            <input type="password" value={pw} onChange={function(e) { setPw(e.target.value); }} placeholder="Passwort (min. 6)" className="mb-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" />
            <label className="mb-4 flex items-start gap-2 text-sm">
              <input type="checkbox" checked={privacy} onChange={function(e) { setPrivacy(e.target.checked); }} className="mt-1 rounded" />
              <span className="text-gray-600">Ich stimme den Datenschutzbestimmungen zu.</span>
            </label>
            <button onClick={handleReg} disabled={!privacy || pw.length < 6} className={"w-full rounded-xl px-4 py-3 text-sm font-bold uppercase " + (privacy && pw.length >= 6 ? 'bg-amber-800 text-white hover:bg-amber-900' : 'cursor-not-allowed bg-gray-200 text-gray-400')}>Registrieren</button>
            <button onClick={function() { setModal(false); finalize(); }} className="mt-2 w-full text-sm text-gray-400 hover:text-gray-600">Nur kopieren</button>
          </div>
        </div>
      )}
    </div>
  );
};

const BlockContent = function(props) {
  var b = props.block;
  var cls = "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm";

  if (b.type === 'TITLE') return <textarea value={b.data.text || ''} onChange={function(e) { props.update(b.id, { text: e.target.value.slice(0, 150) }); }} placeholder="Post-Titel..." className={cls + " resize-none"} rows={2} />;
  
  // CHALLENGE block - internal validation hypothesis (NOT included in LinkedIn post)
  if (b.type === 'CHALLENGE') return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 rounded-lg bg-purple-50 p-3 text-xs text-purple-700">
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <span>Dieser Inhalt wird <strong>nicht</strong> im LinkedIn-Post veröffentlicht. Er dient der internen Dokumentation deiner Validierungs-Hypothese.</span>
      </div>
      <textarea 
        value={b.data.text || ''} 
        onChange={function(e) { props.update(b.id, { text: e.target.value }); }} 
        placeholder="Beschreibe dein Problem oder deine Hypothese, die du validieren möchtest...

Beispiel: Wir glauben, dass B2B-SaaS-Gründer Schwierigkeiten haben, schnelles Marktfeedback zu erhalten. Unsere Hypothese ist, dass LinkedIn-Umfragen eine effektive Methode zur Validierung von Geschäftsideen sind." 
        className={cls + " resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400"} 
        rows={5} 
      />
    </div>
  );
  
  if (b.type === 'POLL') return (
    <div className="space-y-3">
      <textarea value={b.data.q || ''} onChange={function(e) { props.update(b.id, { q: e.target.value }); }} placeholder="Hypothesen-Frage..." className={cls + " resize-none"} rows={2} />
      <div className="grid grid-cols-2 gap-2">
        {b.data.opts?.map(function(o, i) {
          return <input key={i} value={o} onChange={function(e) { var opts = [...(b.data.opts || [])]; opts[i] = e.target.value; props.update(b.id, { opts: opts }); }} placeholder={"Option " + (i + 1)} className={cls} />;
        })}
      </div>
    </div>
  );

  if (b.type === 'CTA') return <input value={b.data.text || ''} onChange={function(e) { props.update(b.id, { text: e.target.value }); }} placeholder="z.B. Kommentiere 'PDF'" className={cls} />;
  if (b.type === 'HASHTAG') return <input value={b.data.tags || ''} onChange={function(e) { props.update(b.id, { tags: e.target.value }); }} placeholder="#Startup #MVP" className={cls} />;
  if (b.type === 'CUSTOM') return <textarea value={b.data.text || ''} onChange={function(e) { props.update(b.id, { text: e.target.value }); }} placeholder="Eigener Text..." className={cls + " resize-none"} rows={2} />;
  if (b.type === 'MENTION') return <input value={b.data.text || ''} onChange={function(e) { props.update(b.id, { text: e.target.value }); }} placeholder="@MaxMuster" className={cls} />;
  if (b.type === 'NUMBER') return <input value={b.data.text || ''} onChange={function(e) { props.update(b.id, { text: e.target.value }); }} placeholder="87% der Gründer..." className={cls} />;

  if (b.type === 'DURATION') return (
    <div className="flex gap-2">
      {Object.entries(DUR_LABELS).map(function([v, l]) {
        return (
          <label key={v} className={"flex-1 cursor-pointer rounded-lg border-2 py-3 text-center text-sm font-bold " + (b.data.val === v ? 'border-amber-700 bg-amber-800 text-white' : 'border-gray-200 bg-white text-gray-600')}>
            <input type="radio" name={"dur-" + b.id} value={v} checked={b.data.val === v} onChange={function(e) { props.update(b.id, { val: e.target.value }); }} className="sr-only" />{l}
          </label>
        );
      })}
    </div>
  );

  if (b.type === 'DIVIDER') return (
    <div className="flex gap-2">
      {['line', 'stars'].map(function(s) {
        return (
          <label key={s} className={"flex-1 cursor-pointer rounded-lg border-2 py-3 text-center text-sm font-bold " + (b.data.style === s ? 'border-amber-700 bg-amber-800 text-white' : 'border-gray-200 bg-white text-gray-600')}>
            <input type="radio" name={"div-" + b.id} value={s} checked={b.data.style === s} onChange={function(e) { props.update(b.id, { style: e.target.value }); }} className="sr-only" />{s === 'line' ? '────────' : '* * *'}
          </label>
        );
      })}
    </div>
  );

  if (b.type === 'SCHEDULE') return (
    <div className="flex gap-2">
      <input type="date" value={b.data.date || ''} onChange={function(e) { props.update(b.id, { date: e.target.value }); }} className={cls + " flex-1"} />
      <input type="time" value={b.data.time || ''} onChange={function(e) { props.update(b.id, { time: e.target.value }); }} className={cls + " w-32"} />
    </div>
  );

  return null;
};

const Preview = function(props) {
  // Filter out CHALLENGE blocks from preview (internal only)
  var visibleBlocks = props.blocks.filter(function(b) { return b.type !== 'CHALLENGE'; });
  var has = visibleBlocks.some(function(b) { return b.data.text || b.data.q || b.data.tags; });
  
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
        {has ? visibleBlocks.map(function(b) {
          if (b.type === 'TITLE' && b.data.text) return <p key={b.id} className="mb-3 text-gray-800">{b.data.text}</p>;
          if (b.type === 'POLL' && b.data.q) return (
            <div key={b.id} className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <p className="mb-2 font-semibold text-gray-900">🎯 {b.data.q}</p>
              {b.data.opts?.filter(Boolean).map(function(o, i) { return <div key={i} className="mb-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700">{o}</div>; })}
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

// Survey Detail Modal for Dashboard
const SurveyDetailModal = function(props) {
  var s = props.survey;
  
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
          {/* Validation Challenge Section */}
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
          
          {/* Poll Question */}
          {s.question && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="mb-2 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-gray-900">Umfrage-Frage</h3>
              </div>
              <p className="text-sm text-gray-700">{s.question}</p>
            </div>
          )}
          
          {/* Generated Post Text */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Generierter LinkedIn-Post</h3>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-700 border border-gray-200">{s.text || 'Kein Text generiert'}</pre>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={function() { navigator.clipboard.writeText(clean(s.text)); }} 
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-800 px-4 py-3 text-sm font-bold text-white hover:bg-amber-900"
            >
              <Copy className="h-4 w-4" />
              Post-Text kopieren
            </button>
            <button 
              onClick={function() { props.onEdit(s); props.onClose(); }} 
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

const Dashboard = function(props) {
  const [tab, setTab] = useState('home');
  const [copiedId, setCopiedId] = useState(null);
  const [detailSurvey, setDetailSurvey] = useState(null);

  var copyTxt = function(id, t) { navigator.clipboard.writeText(clean(t)); setCopiedId(id); setTimeout(function() { setCopiedId(null); }, 1500); };
  var edit = function(s) { props.setEditSurvey({ ...s, blockData: s.blockData || [] }); props.nav('editor'); };

  var stats = useMemo(function() { return { total: props.surveys.length, week: props.surveys.filter(function(s) { return new Date(s.created) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); }).length }; }, [props.surveys]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <button onClick={function() { props.nav('landing'); }} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">Breaking Dynamics</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-500 sm:block">{props.user?.email}</span>
            <button onClick={props.logout} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <LogOut className="h-4 w-4" />Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex rounded-xl border border-gray-200 bg-white p-1">
            {[{ k: 'home', i: Home, l: 'Dashboard' }, { k: 'history', i: History, l: 'Historie' }].map(function(t) {
              return (
                <button key={t.k} onClick={function() { setTab(t.k); }} className={"flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium " + (tab === t.k ? 'bg-amber-800 text-white' : 'text-gray-600 hover:bg-gray-100')}>
                  <t.i className="h-4 w-4" />{t.l}
                </button>
              );
            })}
          </div>
          <button onClick={function() { props.nav('editor'); }} className="flex items-center gap-2 rounded-xl bg-amber-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-900">
            <Plus className="h-4 w-4" />Neue Validierung
          </button>
        </div>

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

            <div>
              <h3 className="mb-4 font-bold text-gray-900">Letzte Tests</h3>
              <div className="space-y-3">
                {props.surveys.slice(0, 5).map(function(s) {
                  return (
                    <div key={s.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 hover:border-amber-300 cursor-pointer" onClick={function() { setDetailSurvey(s); }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">{s.title}</p>
                          {s.validation_challenge && (
                            <span className="flex-shrink-0 rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                              <FlaskConical className="inline h-3 w-3 mr-1" />
                              Hypothese
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{s.created}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={function(e) { e.stopPropagation(); copyTxt(s.id, s.text); }} className={"rounded-lg p-2 " + (copiedId === s.id ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-gray-100')}>
                          {copiedId === s.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <button onClick={function(e) { e.stopPropagation(); edit(s); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={function(e) { e.stopPropagation(); setDetailSurvey(s); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="rounded-2xl border border-gray-200 bg-white">
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
                {props.surveys.map(function(s) {
                  return (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-amber-50 cursor-pointer" onClick={function() { setDetailSurvey(s); }}>
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
                          <button onClick={function(e) { e.stopPropagation(); copyTxt(s.id, s.text); }} className={"rounded-lg p-2 " + (copiedId === s.id ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-gray-100')}>
                            {copiedId === s.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                          <button onClick={function(e) { e.stopPropagation(); edit(s); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={function(e) { e.stopPropagation(); setDetailSurvey(s); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Survey Detail Modal */}
      {detailSurvey && (
        <SurveyDetailModal 
          survey={detailSurvey} 
          onClose={function() { setDetailSurvey(null); }} 
          onEdit={edit}
        />
      )}
    </div>
  );
};

export default App;
