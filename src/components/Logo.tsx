import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="mtf-logo-bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6b6d13" />
          <stop offset="100%" stopColor="#2c2d04" />
        </linearGradient>
        <linearGradient id="mtf-logo-accent" x1="6" y1="30" x2="30" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fdfd00" />
          <stop offset="100%" stopColor="#d4cb00" />
        </linearGradient>
        <linearGradient id="mtf-chart-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Rounded squircle backdrop */}
      <rect width="36" height="36" rx="9" fill="url(#mtf-logo-bg)" />
      <rect
        width="34"
        height="34"
        x="1"
        y="1"
        rx="8"
        fill="none"
        stroke="#fdfd00"
        strokeOpacity="0.3"
        strokeWidth="1"
      />

      {/* Stylized 'M' / Margin Growth Chart */}
      {/* Left Column */}
      <rect x="7.5" y="16" width="4" height="12" rx="2" fill="url(#mtf-chart-bar)" />
      
      {/* Center Peak Column */}
      <rect x="16" y="11" width="4" height="17" rx="2" fill="url(#mtf-logo-accent)" />
      
      {/* Right Column with upward growth */}
      <rect x="24.5" y="7" width="4" height="21" rx="2" fill="url(#mtf-logo-accent)" />

      {/* Connecting Trend Line / Margin Multiplier Arrow */}
      <path
        d="M9.5 16L18 9L26.5 6"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Arrowhead at top right */}
      <path
        d="M23 6H26.5V9.5"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
