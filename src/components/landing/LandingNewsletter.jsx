import React, { useState } from 'react';
import { Mail, Loader2, Check, Bell } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../lib/supabase';

const LandingNewsletter = () => {
  const { language } = useLanguage();
  const isDE = language === 'de';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setErrorMsg(isDE ? 'Bitte gib eine gültige Email ein' : 'Please enter a valid email');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const result = await db.subscribeNewsletter(email);

      if (result.alreadySubscribed) {
        setStatus('success');
      } else {
        setStatus('success');
      }
      setEmail('');
    } catch (err) {
      console.error('Newsletter subscription failed:', err);
      setErrorMsg(isDE ? 'Fehler beim Anmelden. Bitte versuche es später.' : 'Failed to subscribe. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section className="relative py-20 px-6">
      <div className="relative z-10 mx-auto max-w-xl text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 mb-4">
          <Bell className="h-6 w-6 text-[#FF6B35]" />
        </div>

        {/* Title */}
        <h3 className="font-['Syne'] text-xl font-bold mb-2">
          {isDE ? 'Bleib auf dem Laufenden' : 'Stay Updated'}
        </h3>
        <p className="text-white/40 text-sm mb-6">
          {isDE
            ? 'Erfahre als Erstes, wenn neue Tools live gehen.'
            : 'Be the first to know when new tools go live.'}
        </p>

        {/* Form */}
        {status === 'success' ? (
          <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">
              {isDE ? 'Du bist dabei! Wir melden uns.' : "You're in! We'll be in touch."}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder={isDE ? 'deine@email.de' : 'your@email.com'}
                className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                  status === 'error'
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/10 focus:border-[#FF6B35]/50'
                }`}
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-xl bg-[#FF6B35] text-[#0A0A0B] font-semibold text-sm hover:bg-[#FF8C5A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isDE ? 'Moment...' : 'Wait...'}</span>
                </>
              ) : (
                <span>{isDE ? 'Benachrichtigen' : 'Notify me'}</span>
              )}
            </button>
          </form>
        )}

        {/* Error Message */}
        {status === 'error' && errorMsg && (
          <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
        )}

        {/* Privacy Note */}
        <p className="mt-4 text-xs text-white/20">
          {isDE
            ? 'Kein Spam. Nur Updates zu neuen Tools. Jederzeit abmelden.'
            : 'No spam. Only updates on new tools. Unsubscribe anytime.'}
        </p>
      </div>
    </section>
  );
};

export default LandingNewsletter;
