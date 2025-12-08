import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Bug, Lightbulb, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

const FeedbackWidget = function() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
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
      addToast(t('feedback.sent'), 'success');
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
      addToast(t('feedback.sendFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-56 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] text-[#0A0A0B] shadow-lg shadow-[#FF6B35]/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-[#FF6B35]/40 active:scale-95"
        title={t('feedback.title')}
      >
        <MessageSquare className="h-5 w-5" />
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
                <h3 className="font-['Syne'] text-xl font-bold text-white">{t('feedback.thanks')}</h3>
                <p className="mt-2 text-white/50">{t('feedback.willContact')}</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
                      <MessageSquare className="h-5 w-5 text-[#0A0A0B]" />
                    </div>
                    <h3 className="font-['Syne'] text-lg font-bold text-white">{t('feedback.title')}</h3>
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
                    {t('feedback.bugReport')}
                  </button>
                  <button
                    onClick={() => setFeedbackType('feature')}
                    className={"flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition-all " +
                      (feedbackType === 'feature' ? 'border-[#00D4FF] bg-[#00D4FF]/10 text-[#00D4FF]' : 'border-white/10 bg-transparent text-white/50 hover:border-white/20 hover:text-white')}
                  >
                    <Lightbulb className="h-4 w-4" />
                    {t('feedback.idea')}
                  </button>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={feedbackType === 'bug' ? t('feedback.describeBug') : t('feedback.describeIdea')}
                  className="input-dark mb-4 resize-none"
                  rows={4}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('feedback.emailOptional')}
                  className="input-dark mb-4"
                />

                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || loading}
                  className="btn-primary w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {t('feedback.submit')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;
