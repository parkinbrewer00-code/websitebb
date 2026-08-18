import React from 'react';
import logoSvg from '../assets/images/logo svg.svg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  isDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  isDark = false
}) => {
  const heightMap = {
    sm: 'h-8 sm:h-9 max-w-[160px]',
    md: 'h-10 sm:h-11 max-w-[200px]',
    lg: 'h-14 max-w-[260px]',
    xl: 'h-18 sm:h-20 max-w-[320px]',
  };

  const currentHeight = heightMap[size];

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <div className="flex items-center">
        <img 
          src={logoSvg} 
          alt="Beyond Borders English Academy" 
          className={`${currentHeight} w-auto object-contain transition-transform duration-200 hover:opacity-95`}
        />
      </div>

      {showTagline && (
        <span className={`text-[10px] font-bold tracking-wider uppercase mt-1 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
          Thai ↔ English Language Platform
        </span>
      )}
    </div>
  );
};

