import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const EmailConfirmation = function({ email, onBack }) {
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
              {email}
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
              onClick={onBack}
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

export default EmailConfirmation;
