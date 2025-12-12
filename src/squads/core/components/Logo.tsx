// Breaking Dynamics Logo Component
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
        <path
          d="M8 10h10c2.2 0 4 1.8 4 4s-1.8 4-4 4h-6v4H8V10z"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M14 14h4c1.1 0 2 0.9 2 2s-0.9 2-2 2h-4V14z"
          fill="#FF6B35"
        />
        <defs>
          <linearGradient
            id="logo-gradient"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF6B35" />
            <stop offset="1" stopColor="#FF8F65" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span className={`font-bold ${text} text-white`}>
          Breaking<span className="text-[#FF6B35]">Dynamics</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
