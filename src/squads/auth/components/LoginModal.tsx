// Login Modal Component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../AuthProvider';
import { useLanguage, useRateLimiter, RATE_LIMIT_CONFIGS, validate, loginSchema, registerSchema } from '@/squads/core';

// Registration is temporarily disabled
const REGISTRATION_DISABLED = true;

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
  setPendingEmail?: (email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onLogin,
  setPendingEmail,
}) => {
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Rate limiting for auth attempts
  const { canRequest, checkLimit, remainingRequests } = useRateLimiter(
    'auth',
    RATE_LIMIT_CONFIGS.auth
  );

  const handleLogin = async () => {
    setError('');

    // Rate limit check
    if (!checkLimit()) {
      setError('Too many attempts. Please wait a moment.');
      return;
    }

    // Validate input
    const validation = validate({ email, password: pw }, loginSchema);
    if (!validation.success) {
      setError(validation.errors?.[0]?.message || 'Invalid input');
      return;
    }

    setLoading(true);
    const result = await signIn(email, pw);
    setLoading(false);

    if (result.success) {
      onLogin();
      navigate('/dashboard');
    } else {
      setError(
        result.error === 'Invalid login credentials'
          ? t('auth.wrongCredentials')
          : result.error || t('auth.loginFailed')
      );
    }
  };

  const handleRegister = async () => {
    setError('');

    // Rate limit check
    if (!checkLimit()) {
      setError('Too many attempts. Please wait a moment.');
      return;
    }

    // Validate input with strong password requirements
    const validation = validate(
      { email, password: pw, confirmPassword: pwConfirm, acceptPrivacy },
      registerSchema
    );
    if (!validation.success) {
      const firstError = validation.errors?.[0];
      if (firstError?.field === 'password') {
        setError(t('auth.passwordRequirements'));
      } else {
        setError(firstError?.message || 'Invalid input');
      }
      return;
    }

    setLoading(true);
    const result = await signUp(email, pw);
    setLoading(false);

    if (result.success) {
      if (result.data?.user?.identities?.length === 0) {
        setError(t('auth.emailExists'));
      } else if (result.data?.user && !result.data?.session) {
        // Email confirmation required
        onClose();
        if (setPendingEmail) {
          setPendingEmail(email);
        }
      } else {
        onLogin();
        navigate('/dashboard');
      }
    } else {
      setError(result.error || t('auth.registerFailed'));
    }
  };

  const switchMode = () => {
    if (REGISTRATION_DISABLED) return;
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setPw('');
    setPwConfirm('');
    setAcceptPrivacy(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      if (mode === 'login') {
        handleLogin();
      } else {
        handleRegister();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-sm rounded-2xl bg-[#111113] border border-white/10 p-6 shadow-2xl animate-scale-in"
        onKeyDown={handleKeyDown}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-['Syne'] text-xl font-bold text-white">
            {mode === 'login' ? t('auth.login') : t('auth.register')}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Close"
          >
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
            autoComplete="email"
            autoFocus
          />

          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder={t('auth.password')}
            className="input-dark"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {mode === 'register' && (
            <>
              <input
                type="password"
                value={pwConfirm}
                onChange={(e) => setPwConfirm(e.target.value)}
                placeholder={t('auth.confirmPassword')}
                className={`input-dark ${
                  pwConfirm && pw !== pwConfirm
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : ''
                }`}
                autoComplete="new-password"
              />

              <p className="text-xs text-white/40 px-1">
                {t('auth.passwordRequirements')}
              </p>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-[#FF6B35] focus:ring-[#FF6B35]/20"
                />
                <span className="text-sm text-white/60">
                  {t('auth.privacyConsent')}
                </span>
              </label>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {!canRequest && (
            <div className="text-xs text-white/40 text-center">
              Rate limited. {remainingRequests} attempts remaining.
            </div>
          )}

          <button
            onClick={mode === 'login' ? handleLogin : handleRegister}
            disabled={loading || !canRequest}
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
            <button onClick={switchMode} className="btn-secondary w-full">
              {mode === 'login' ? t('auth.createAccount') : t('auth.alreadyRegistered')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
