// Page Loader Component
import React from 'react';
import { Logo } from './Logo';

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center">
      <div className="animate-pulse">
        <Logo size="lg" />
      </div>
      {message && (
        <p className="mt-4 text-white/60 text-sm">{message}</p>
      )}
      <div className="mt-6 flex gap-1">
        <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default PageLoader;
