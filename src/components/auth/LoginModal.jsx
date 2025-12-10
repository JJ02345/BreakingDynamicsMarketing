import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

// Registration is temporarily disabled
const REGISTRATION_DISABLED = true;

const LoginModal = function({ onClose, onLogin, setPendingEmail }) {
  const { signIn, signUp } = useAuth();
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
      onLogin();
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
        onClose();
        if (setPendingEmail) {
          setPendingEmail(email);
        }
      } else {
        onLogin();
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  const switchMode = () => {
    if (REGISTRATION_DISABLED) return; // Prevent switching to register mode
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
          <button onClick={onClose} className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors">
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

          {REGISTRATION_DISABLED ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white/40">
              <Lock className="h-4 w-4" />
              <span>Registrierung aktuell nicht verfügbar</span>
            </div>
          ) : (
            <button
              onClick={switchMode}
              className="btn-secondary w-full"
            >
              {mode === 'login' ? t('auth.createAccount') : t('auth.alreadyRegistered')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
