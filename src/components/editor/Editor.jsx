import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/supabase';
import { compilePostFromBlocks, LINKEDIN_LIMITS } from '../../lib/postCompiler';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { BLOCKS } from '../../constants';
import { genId, initData, defaultBlocks, clean } from '../../utils/helpers';

// Sub-components
import EditorHeader from './EditorHeader';
import EditorSidebar from './EditorSidebar';
import EditorBlockList from './EditorBlockList';
import EditorFooter from './EditorFooter';
import EditorPreviewPanel from './EditorPreviewPanel';
import EditorResultView from './EditorResultView';
import EditorAuthModal from './EditorAuthModal';

const Editor = function(props) {
  const { user, isAuthenticated, signUp, signIn } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();

  // State
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

  // Effects
  useEffect(() => {
    return () => { if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current); };
  }, []);

  useEffect(() => {
    if (props.editSurvey?.blockData) {
      setBlocks(props.editSurvey.blockData);
    } else {
      setBlocks(defaultBlocks());
    }
  }, [props.editSurvey]);

  useEffect(() => {
    const { stats } = compilePostFromBlocks(blocks, { includeChallenge: false, includePollCTA: true, validate: false });
    setPostStats(stats);
  }, [blocks]);

  // Block Operations
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

  // Drag & Drop
  const handleDragStart = (e, idx) => {
    setDragIdx(idx);
    draggedBlockRef.current = blocks[idx];
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx !== null && idx !== dragIdx) setDragOverIdx(idx);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOverIdx(null);
  };

  const handleDrop = (e, dropIdx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx) { setDragIdx(null); setDragOverIdx(null); return; }
    setBlocks(prev => {
      const newBlocks = [...prev];
      const [draggedBlock] = newBlocks.splice(dragIdx, 1);
      newBlocks.splice(dropIdx, 0, draggedBlock);
      return newBlocks;
    });
    setDragIdx(null); setDragOverIdx(null); draggedBlockRef.current = null;
  };

  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); draggedBlockRef.current = null; };

  const handleSidebarDragStart = (e, blockType) => { e.dataTransfer.setData('blockType', blockType); e.dataTransfer.effectAllowed = 'copy'; };

  const handleDropFromSidebar = (e, dropIdx = null) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('blockType');
    if (blockType && BLOCKS[blockType] && !BLOCKS[blockType].req) {
      const id = genId();
      const newBlock = { id, type: blockType, data: initData(blockType) };
      setBlocks(prev => dropIdx !== null ? [...prev.slice(0, dropIdx), newBlock, ...prev.slice(dropIdx)] : [...prev, newBlock]);
      setActiveBlock(id);
    }
    setDragOverIdx(null);
  };

  // Validation
  const canGen = useMemo(() => {
    const p = blocks.find(b => b.type === 'POLL');
    const filled = p?.data.opts?.filter(o => o?.trim()).length || 0;
    return p?.data.q?.trim() && filled >= 2 && email.trim();
  }, [blocks, email]);

  const getValidationChallenge = () => blocks.find(b => b.type === 'CHALLENGE')?.data?.text?.trim() || '';
  const genText = () => compilePostFromBlocks(blocks, { includeChallenge: false, includePollCTA: true, includeDuration: false, validate: false }).text;

  // Save & Submit
  const finalize = async () => {
    setSaving(true); setSaveError(null);
    const { text: txt, warnings } = compilePostFromBlocks(blocks, { includeChallenge: false, includePollCTA: true, validate: true });
    warnings.forEach(w => addToast(w, 'warning', 5000));

    const surveyData = {
      title: blocks.find(b => b.type === 'TITLE')?.data.text?.slice(0, 50) || t('editor.survey'),
      question: blocks.find(b => b.type === 'POLL')?.data.q || '',
      blocks: blocks.length, text: txt, blockData: blocks, validation_challenge: getValidationChallenge()
    };

    try {
      if (isAuthenticated) {
        if (props.editSurvey?.id) { await db.updateSurvey(props.editSurvey.id, surveyData); addToast(t('editor.surveyUpdated'), 'success'); }
        else { await db.createSurvey(surveyData); addToast(t('editor.surveyCreated'), 'success'); }
        await props.loadSurveys();
      } else {
        props.setSurveys(p => [{ id: Date.now(), ...surveyData, created: new Date().toISOString().split('T')[0], scheduled: null }, ...p]);
      }
      setResult(txt); setStep('result'); props.setEditSurvey(null);
    } catch (err) { setSaveError(err.message); addToast(t('editor.saveFailed') + err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleCopyOnly = async () => {
    setSendingEmail(true);
    try {
      const result = await db.saveLead({ email, surveyTitle: blocks.find(b => b.type === 'TITLE')?.data.text?.slice(0, 50) || t('editor.survey'), surveyQuestion: blocks.find(b => b.type === 'POLL')?.data.q || '', surveyText: genText(), blockData: blocks, validationChallenge: getValidationChallenge() });
      addToast(result.emailSent ? t('editor.emailSent') : t('editor.emailFailed'), result.emailSent ? 'success' : 'warning', 4000);
    } catch { addToast('Survey erstellt!', 'success', 3000); }
    setResult(genText()); setStep('result'); setModal(false); setSendingEmail(false);
  };

  const handleGen = () => { if (!canGen) return; if (!isAuthenticated) { setModal(true); return; } finalize(); };

  // Auth
  const handleReg = async () => {
    setRegError('');
    if (pw.length < 6) { setRegError(t('auth.passwordMinLength')); return; }
    if (pw !== pwConfirm) { setRegError(t('auth.passwordMismatch')); return; }
    if (!privacy) { setRegError(t('editor.acceptPrivacy')); return; }
    setAuthLoading(true);
    const result = await signUp(email, pw);
    setAuthLoading(false);
    if (result.success) {
      if (result.data?.user?.identities?.length === 0) { setRegError(t('editor.emailAlreadyRegistered')); setModalMode('login'); setPw(''); setPwConfirm(''); }
      else if (result.data?.user && !result.data?.session) { setModal(false); props.setPendingEmail?.(email); }
      else { setModal(false); finalize(); }
    } else { setRegError(result.error?.includes('already registered') ? t('editor.emailAlreadyRegistered') : (result.error || t('auth.registerFailed'))); if (result.error?.includes('already registered')) { setModalMode('login'); setPw(''); } }
  };

  const handleLogin = async () => {
    setRegError(''); if (pw.length < 6) { setRegError(t('auth.passwordMinLength')); return; }
    setAuthLoading(true); const result = await signIn(email, pw); setAuthLoading(false);
    if (result.success) { setModal(false); finalize(); }
    else { setRegError(result.error === 'Invalid login credentials' ? t('auth.wrongCredentials') : (result.error || t('auth.loginFailed'))); }
  };

  // UI Helpers
  const copyTxt = () => { navigator.clipboard.writeText(clean(result)); setCopied(true); if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current); copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000); };

  const shareToLinkedIn = () => { navigator.clipboard.writeText(clean(result)); setCopied(true); addToast(t('editor.copiedForLinkedIn'), 'success', 3000); setTimeout(() => window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank', 'width=600,height=600'), 500); if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current); copyTimeoutRef.current = setTimeout(() => setCopied(false), 3000); };

  const handleNewSurvey = () => { setStep('edit'); setResult(''); setBlocks(defaultBlocks()); props.setEditSurvey(null); };

  const getBlockStyle = (id, idx) => {
    const block = blocks.find(x => x.id === id);
    const isChallenge = block?.type === 'CHALLENGE';
    if (dragIdx === idx) return 'border-[#FF6B35] bg-[#FF6B35]/10';
    if (activeBlock === id) return isChallenge ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/50' : 'border-[#FF6B35] bg-[#FF6B35]/5 ring-2 ring-[#FF6B35]/50';
    return isChallenge ? 'border-purple-500/30 bg-[#111113] hover:border-purple-500/50' : 'border-white/10 bg-[#111113] hover:border-white/20';
  };

  // Render
  if (step === 'result') {
    return <EditorResultView result={result} postStats={postStats} blocks={blocks} copied={copied} isAuthenticated={isAuthenticated} onCopy={copyTxt} onShareLinkedIn={shareToLinkedIn} onNewSurvey={handleNewSurvey} t={t} />;
  }

  return (
    <div className="min-h-screen h-screen bg-[#0A0A0B] flex flex-col overflow-hidden">
      <EditorHeader isAuthenticated={isAuthenticated} postStats={postStats} t={t} />
      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar sidebar={sidebar} setSidebar={setSidebar} addBlock={addBlock} onSidebarDragStart={handleSidebarDragStart} t={t} />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <EditorBlockList blocks={blocks} activeBlock={activeBlock} dragIdx={dragIdx} dragOverIdx={dragOverIdx} onBlockClick={setActiveBlock} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onDragEnd={handleDragEnd} onDropFromSidebar={handleDropFromSidebar} onDeleteBlock={deleteBlock} onUpdateBlock={updateBlock} getBlockStyle={getBlockStyle} t={t} />
            <div className="p-4 pt-0"><div className="mx-auto max-w-xl"><EditorFooter email={email} setEmail={setEmail} isAuthenticated={isAuthenticated} canGen={canGen} saving={saving} saveError={saveError} postStats={postStats} onGenerate={handleGen} t={t} /></div></div>
          </div>
          <EditorPreviewPanel blocks={blocks} previewMode={previewMode} setPreviewMode={setPreviewMode} t={t} />
        </div>
      </div>
      {modal && <EditorAuthModal email={email} pw={pw} setPw={setPw} pwConfirm={pwConfirm} setPwConfirm={setPwConfirm} privacy={privacy} setPrivacy={setPrivacy} modalMode={modalMode} setModalMode={setModalMode} regError={regError} authLoading={authLoading} sendingEmail={sendingEmail} onClose={() => setModal(false)} onLogin={handleLogin} onRegister={handleReg} onCopyOnly={handleCopyOnly} t={t} />}
    </div>
  );
};

export default Editor;
