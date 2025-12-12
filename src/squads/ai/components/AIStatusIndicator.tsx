// AI Status Indicator Component
// Shows AI service availability status

import React from 'react';
import { Wifi, WifiOff, Loader2, RefreshCw } from 'lucide-react';
import { useAIHealth } from '../hooks/useAIHealth';

interface AIStatusIndicatorProps {
  /**
   * Size variant
   * @default 'sm'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Show refresh button
   * @default false
   */
  showRefresh?: boolean;

  /**
   * Show last check time
   * @default false
   */
  showLastCheck?: boolean;

  /**
   * Custom class name
   */
  className?: string;
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  size = 'sm',
  showRefresh = false,
  showLastCheck = false,
  className = '',
}) => {
  const { isAvailable, isChecking, timeSinceLastCheck, checkNow } = useAIHealth({
    checkOnMount: true,
    refreshInterval: 60000,
  });

  const sizeClasses = {
    sm: 'text-xs gap-1.5',
    md: 'text-sm gap-2',
    lg: 'text-base gap-2.5',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '';
    if (seconds < 60) return 'vor wenigen Sekunden';
    if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Min.`;
    return `vor ${Math.floor(seconds / 3600)} Std.`;
  };

  if (isChecking) {
    return (
      <div className={`flex items-center ${sizeClasses[size]} text-white/40 ${className}`}>
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
        <span>Prüfe AI...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      {/* Status indicator */}
      <div
        className={`flex items-center gap-1.5 ${
          isAvailable ? 'text-green-400' : 'text-red-400'
        }`}
      >
        <div className="relative">
          {isAvailable ? (
            <Wifi className={iconSizes[size]} />
          ) : (
            <WifiOff className={iconSizes[size]} />
          )}
          <div
            className={`absolute -top-0.5 -right-0.5 ${dotSizes[size]} rounded-full ${
              isAvailable ? 'bg-green-400' : 'bg-red-400'
            } ${isAvailable ? 'animate-pulse' : ''}`}
          />
        </div>
        <span className="font-medium">{isAvailable ? 'AI Online' : 'AI Offline'}</span>
      </div>

      {/* Last check time */}
      {showLastCheck && timeSinceLastCheck !== null && (
        <span className="text-white/30">({formatTime(timeSinceLastCheck)})</span>
      )}

      {/* Refresh button */}
      {showRefresh && (
        <button
          onClick={checkNow}
          disabled={isChecking}
          className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors disabled:opacity-50"
          title="Status aktualisieren"
        >
          <RefreshCw className={iconSizes[size]} />
        </button>
      )}
    </div>
  );
};

export default AIStatusIndicator;
