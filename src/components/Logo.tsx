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
        <linearGradient id="nano-bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#222805" />
          <stop offset="100%" stopColor="#101301" />
        </linearGradient>
        <linearGradient id="banana-main" x1="6" y1="8" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff566" />
          <stop offset="50%" stopColor="#ffd400" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="banana-inner" x1="8" y1="12" x2="28" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffec4" />
          <stop offset="100%" stopColor="#ffe600" />
        </linearGradient>
        <linearGradient id="stem-grad" x1="24" y1="5" x2="28" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#84cc16" />
          <stop offset="100%" stopColor="#4d7c0f" />
        </linearGradient>
      </defs>

      {/* Rounded Squircle Backdrop */}
      <rect width="36" height="36" rx="9" fill="url(#nano-bg)" />
      <rect
        width="34"
        height="34"
        x="1"
        y="1"
        rx="8"
        fill="none"
        stroke="#ffd400"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Nano Banana Main Outer Curve */}
      <path
        d="M26 7.5C23.5 8 18 10 13 14.5C8.5 18.5 7 23 8.5 26.5C10 29.5 14 30 18.5 28C23 26 27.5 21.5 29 17C29.8 14.5 29.5 11 26 7.5Z"
        fill="url(#banana-main)"
      />

      {/* Inner Banana Highlight Ridge */}
      <path
        d="M24.5 9.5C21 11.5 16.5 14 12.5 18C9.5 21 8.5 24 10 26C11 27.5 14 27.5 17.5 26C21.5 24 25.5 20 27 16C27.8 13.5 27 11 24.5 9.5Z"
        fill="url(#banana-inner)"
        opacity="0.85"
      />

      {/* Nano Tech Circuitry Lines on Banana */}
      <path
        d="M12 19.5C15 16.5 19 14.5 23 13"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M14 23.5C17.5 21.5 21 19 24.5 16.5"
        stroke="#ffffff"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeDasharray="2 1.5"
        opacity="0.85"
      />

      {/* Nano Nodes / Tech Dots */}
      <circle cx="12" cy="19.5" r="1.2" fill="#ffffff" />
      <circle cx="23" cy="13" r="1.2" fill="#ffffff" />
      <circle cx="18" cy="15.5" r="1" fill="#ffd400" />
      <circle cx="25" cy="16.5" r="1" fill="#ffffff" />

      {/* Nano Stem Top (Green Cyber Node) */}
      <path
        d="M26 7.5L27.5 5.5C28 4.8 29 4.8 29.5 5.5C29.8 6 29.5 7 28.5 7.8L26 8.5"
        fill="url(#stem-grad)"
        stroke="#84cc16"
        strokeWidth="0.5"
      />

      {/* Nano Bottom Tip */}
      <path
        d="M8.5 26.5L7 28C6.5 28.5 6.8 29.2 7.5 29.2C8.2 29.2 9 28.5 9.5 27.5L8.5 26.5Z"
        fill="#78350f"
      />
    </svg>
  );
};
