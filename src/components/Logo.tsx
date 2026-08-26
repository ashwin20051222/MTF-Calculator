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
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <clipPath id="right-bar-clip">
          <rect x="64" y="25" width="13" height="54" rx="4.5" />
        </clipPath>
      </defs>

      {/* Rounded Squircle Background */}
      <rect width="100" height="100" rx="22" fill="#616715" />

      {/* Baseline */}
      <line
        x1="18"
        y1="82"
        x2="82"
        y2="82"
        stroke="#848b29"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Left Bar (Shortest - White) */}
      <rect x="23" y="57" width="13" height="22" rx="4.5" fill="#f5f5f0" />

      {/* Middle Bar (Medium - White) */}
      <rect x="43.5" y="41" width="13" height="38" rx="4.5" fill="#f5f5f0" />

      {/* Right Bar (Tallest - Top Yellow / Bottom White) */}
      <g clipPath="url(#right-bar-clip)">
        {/* Bottom portion (White) */}
        <rect x="64" y="47.5" width="13" height="32" fill="#f5f5f0" />
        {/* Top portion (Vibrant Yellow) */}
        <rect x="64" y="25" width="13" height="23" fill="#ffff00" />
      </g>
    </svg>
  );
};
