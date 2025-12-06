import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, GripVertical, Trash2, Home, ArrowLeft, Zap, FileText,
  Rocket, CheckCircle2, Copy, Check, X, Monitor, Smartphone,
  BarChart3, AlertCircle, AlertTriangle, Loader2, LogIn, Mail
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/supabase';
import { compilePostFromBlocks, LINKEDIN_LIMITS } from '../../lib/postCompiler';
import { useToast } from '../../context/ToastContext';
import { useLanguage, LanguageSwitcher } from '../../context/LanguageContext';
import { BLOCKS } from '../../constants';
import { genId, initData, defaultBlocks, clean } from '../../utils/helpers';
import BlockContent from './BlockContent';
import Preview from './Preview';

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

  const addBlock = (type) => {
    const id = genId();
    setBlocks(p => [...p, { id, type, data: initData(type) }]);
    setActiveBlock(id);
  };

  const updateBlock = (id, d) => {
    setBlocks(p => p.map(b => b.id === id ? { ...b, data: { ...b.data, ...d } } : b));
  };

  const deleteBlock = (id) => {
    const b = blocks.find(x => x.id === id);
    if (b && !BLOCKS[b.type].req) setBlocks(p => p.filter(x => x.id !== id));
  };

  // Drag & Drop Handlers
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
      const result = await db.saveLead(surveyData);

      if (result.emailSent) {
        addToast(t('editor.emailSent'), 'success', 4000);
      } else {
        addToast(t('editor.emailFailed'), 'warning', 4000);
      }
    } catch (err) {
      console.error('Failed to save lead:', err);
      addToast('Survey erstellt!', 'success', 3000);
    }

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
      <div className="min-h-screen h-screen bg-[#0A0A0B] p-6 flex items-center justify-center overflow-auto">
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
              {postStats.characters > LINKEDIN_LIMITS.POST_TEXT ? t('editor.linkedInLimit') : 'LinkedIn Ready'}
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
    <div className="min-h-screen h-screen bg-[#0A0A0B] flex flex-col overflow-hidden">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl flex-shrink-0">
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

      <div className="flex flex-1 overflow-hidden">
        {/* Baukasten Sidebar - Grid Layout */}
        <div className={"flex flex-shrink-0 flex-col border-r border-white/5 bg-[#111113] transition-all " + (sidebar ? 'w-72' : 'w-12')}>
          <button onClick={() => setSidebar(!sidebar)} className={"flex items-center justify-center border-b border-white/5 p-3 transition-all " + (sidebar ? 'bg-[#FF6B35] text-[#0A0A0B]' : 'text-white/50 hover:bg-white/5 hover:text-white')}>
            <Plus className={"h-5 w-5 transition-transform " + (sidebar ? 'rotate-45' : '')} />
          </button>
          {sidebar && (
            <div className="flex-1 overflow-y-auto p-3">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/30 text-center">{t('editor.blocks')}</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(BLOCKS).map(([k, v]) => {
                  const isChallenge = k === 'CHALLENGE';
                  const isRequired = v.req;
                  return (
                    <button
                      key={k}
                      onClick={() => { if (!isRequired) addBlock(k); }}
                      disabled={isRequired}
                      draggable={!isRequired}
                      onDragStart={(e) => { if (!isRequired) handleSidebarDragStart(e, k); }}
                      className={
                        "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 text-center transition-all aspect-square " +
                        (isRequired
                          ? 'cursor-not-allowed opacity-30 bg-white/5'
                          : isChallenge
                            ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/40 hover:scale-105 cursor-grab active:cursor-grabbing active:scale-95'
                            : 'bg-white/5 border border-white/10 text-white/60 hover:bg-[#FF6B35]/10 hover:border-[#FF6B35]/40 hover:text-[#FF6B35] hover:scale-105 cursor-grab active:cursor-grabbing active:scale-95')
                      }
                      title={t('blocks.' + k)}
                    >
                      <v.icon className={
                        "h-5 w-5 transition-transform group-hover:scale-110 " +
                        (isChallenge ? 'text-purple-400' : 'group-hover:text-[#FF6B35]')
                      } />
                      <span className="text-[10px] font-medium leading-tight truncate w-full">
                        {t('blocks.' + k).split(' ')[0]}
                      </span>
                      {isChallenge && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Drag hint */}
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/20">
                <GripVertical className="h-3 w-3" />
                <span>Drag & Drop</span>
              </div>
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

export default Editor;
