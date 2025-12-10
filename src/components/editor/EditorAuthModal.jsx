import React from 'react';
import { X, Rocket, LogIn, AlertCircle, Loader2, Mail, Lock } from 'lucide-react';

// Registration is temporarily disabled
const REGISTRATION_DISABLED = true;

const EditorAuthModal = ({
  email,
  pw,
  setPw,
  pwConfirm,
  setPwConfirm,
  privacy,
  setPrivacy,
  modalMode,
  setModalMode,
  regError,
  authLoading,
  sendingEmail,
  onClose,
  onLogin,
  onRegister,
  onCopyOnly,
  t
}) => {
  const switchModalMode = (mode) => {
    if (REGISTRATION_DISABLED && mode === 'register') return; // Prevent switching to register mode
    setModalMode(mode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#111113] border border-white/10 p-6 animate-scale-in">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
              <Rocket className="h-5 w-5 text-[#0A0A0B]" />
            </div>
            <h3 className="font-['Syne'] text-lg font-bold text-white">{t('editor.saveData')}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {REGISTRATION_DISABLED ? (
          /* Login only mode when registration is disabled */
          <>
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

            {regError && (
              <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {regError}
              </div>
            )}

            <button
              onClick={onLogin}
              disabled={pw.length < 6 || authLoading}
              className="btn-primary w-full"
            >
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {t('auth.login')}
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white/40">
              <Lock className="h-4 w-4" />
              <span>Registrierung aktuell nicht verfügbar</span>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#111113] px-3 text-white/40">{t('auth.or')}</span>
              </div>
            </div>

            <button
              onClick={onCopyOnly}
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
          </>
        ) : (
          /* Full login/register mode when registration is enabled */
          <>
            <div className="mb-4 flex rounded-lg border border-white/10 bg-[#1A1A1D] p-1">
              <button
                onClick={() => switchModalMode('login')}
                className={"flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all " +
                  (modalMode === 'login'
                    ? 'bg-[#FF6B35] text-[#0A0A0B]'
                    : 'text-white/50 hover:text-white')}
              >
                {t('auth.login')}
              </button>
              <button
                onClick={() => switchModalMode('register')}
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
                onClick={onLogin}
                disabled={pw.length < 6 || authLoading}
                className="btn-primary w-full"
              >
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                {t('auth.login')}
              </button>
            ) : (
              <button
                onClick={onRegister}
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
              onClick={onCopyOnly}
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
          </>
        )}
      </div>
    </div>
  );
};

export default EditorAuthModal;
