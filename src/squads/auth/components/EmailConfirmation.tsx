// Email Confirmation Component
import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useLanguage, Logo } from '@/squads/core';

interface EmailConfirmationProps {
  email: string;
  onBack: () => void;
}

export const EmailConfirmation: React.FC<EmailConfirmationProps> = ({
  email,
  onBack,
}) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-6" />
        </div>

        <div className="rounded-2xl bg-[#111113] border border-white/10 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FF6B35]/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-[#FF6B35]" />
          </div>

          <h2 className="font-['Syne'] text-2xl font-bold text-white mb-2">
            Check your email
          </h2>

          <p className="text-white/60 mb-6">
            We sent a confirmation link to{' '}
            <span className="text-white font-medium">{email}</span>
          </p>

          <div className="space-y-4">
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="text-sm text-white/60">
                Click the link in the email to confirm your account. If you don't see
                it, check your spam folder.
              </p>
            </div>

            <button
              onClick={onBack}
              className="btn-secondary w-full inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </button>
          </div>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          Didn't receive the email?{' '}
          <button className="text-[#FF6B35] hover:underline">
            Resend confirmation
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailConfirmation;
