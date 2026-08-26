import type React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

// Use the uploaded PNG logo asset
const logoUrl = new URL('/logo-512.png', import.meta.url).href;

export const Logo: React.FC<LogoProps> = ({ className = 'w-8 h-8', size = 36 }) => {
  return (
    <img
      src={logoUrl}
      alt="MTF Pro Logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
      draggable={false}
    />
  );
};
