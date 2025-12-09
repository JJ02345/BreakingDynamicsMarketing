import React from 'react';

/**
 * Breaking Dynamics Logo - Unique Brandmark
 *
 * Design concept: A stylized "BD" monogram combined with dynamic arrows
 * representing breakthrough and forward momentum. The design features:
 * - Abstract letterform suggesting "B" and "D"
 * - Dynamic arrow elements representing momentum and change
 * - Angular geometry conveying energy and innovation
 *
 * This design is unique to Breaking Dynamics and suitable for trademark registration.
 */
const BreakingDynamicsLogo = ({
  className = '',
  size = 24,
  color = '#FF6B35',
  secondaryColor = '#FF8C5A',
  style = {}
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Breaking Dynamics Logo"
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="bd-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
        <linearGradient id="bd-arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={secondaryColor} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>

      {/* Main shape: Stylized "B" forming a dynamic breakthrough symbol */}
      <g transform="translate(4, 6)">
        {/* Left vertical bar of "B" with angular cut */}
        <path
          d="M4 0 L4 36 L8 36 L8 4 L4 4 Z"
          fill="url(#bd-gradient)"
        />

        {/* Upper curve of "B" */}
        <path
          d="M8 0 L8 4 L18 4 C24 4 26 8 26 12 C26 16 24 18 20 18 L8 18 L8 14 L18 14 C20 14 22 13 22 12 C22 10 20 8 18 8 L8 8 L8 0 Z"
          fill="url(#bd-gradient)"
        />

        {/* Lower curve of "B" */}
        <path
          d="M8 18 L8 22 L20 22 C24 22 26 24 26 28 C26 32 24 36 18 36 L8 36 L8 32 L18 32 C22 32 22 30 22 28 C22 26 22 24 18 26 L8 26 L8 18 Z"
          fill="url(#bd-gradient)"
        />

        {/* Dynamic arrow breaking through - represents "Dynamics" */}
        <path
          d="M24 18 L38 8 L38 14 L28 20 L38 26 L38 32 L24 22 L24 18 Z"
          fill="url(#bd-arrow-gradient)"
        />

        {/* Small accent element - spark/energy */}
        <circle cx="36" cy="6" r="2" fill={color} />
      </g>
    </svg>
  );
};

/**
 * Alternative minimal version - just the icon mark
 */
export const BreakingDynamicsIcon = ({
  className = '',
  size = 24,
  color = '#FF6B35',
  style = {}
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Breaking Dynamics"
    >
      {/* Stylized angular "B" with breakthrough arrow */}
      <defs>
        <linearGradient id="bd-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#FF8C5A" />
        </linearGradient>
      </defs>

      {/* Main B shape */}
      <path
        d="M4 4 L4 28 L14 28 C18 28 22 26 22 22 C22 19 20 17 17 16 C19 15 21 13 21 10 C21 6 18 4 14 4 L4 4 Z
           M8 8 L12 8 C14 8 16 9 16 11 C16 13 14 14 12 14 L8 14 L8 8 Z
           M8 18 L13 18 C16 18 18 19 18 22 C18 24 16 24 13 24 L8 24 L8 18 Z"
        fill="url(#bd-icon-grad)"
        fillRule="evenodd"
      />

      {/* Dynamic breakthrough arrow */}
      <path
        d="M18 14 L28 8 L28 12 L22 16 L28 20 L28 24 L18 18 L18 14 Z"
        fill={color}
      />

      {/* Energy spark */}
      <circle cx="27" cy="6" r="1.5" fill={color} opacity="0.8" />
    </svg>
  );
};

/**
 * Compact version - for favicon and small displays
 */
export const BreakingDynamicsCompact = ({
  className = '',
  size = 24,
  color = '#FF6B35',
  style = {}
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Breaking Dynamics"
    >
      {/* Simplified dynamic arrow with angular shapes */}
      <defs>
        <linearGradient id="bd-compact-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#FF8C5A" />
        </linearGradient>
      </defs>

      {/* Primary shape - angular breakthrough */}
      <path
        d="M3 4 L3 20 L7 20 L7 14 L11 14 C14 14 16 12 16 10 C16 7 14 6 11 6 L7 6 L7 4 Z
           M7 8 L10 8 C12 8 13 9 13 10 C13 11 12 12 10 12 L7 12 L7 8 Z"
        fill="url(#bd-compact-grad)"
        fillRule="evenodd"
      />

      {/* Arrow indicating dynamics/movement */}
      <path
        d="M14 10 L21 5 L21 9 L17 12 L21 15 L21 19 L14 14 L14 10 Z"
        fill={color}
      />
    </svg>
  );
};

export default BreakingDynamicsLogo;
