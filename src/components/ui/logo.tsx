import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = '', width = 150, height = 50 }: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width={height} height={height} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="zigzagPattern" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)">
            <path d="M0 0L3 3L6 0L9 3L12 0L12 6L9 9L6 6L3 9L0 6Z" fill="currentColor"/>
          </pattern>
          <mask id="circleMask">
            <circle cx="25" cy="25" r="23" fill="white"/>
          </mask>
        </defs>
        <circle cx="25" cy="25" r="25" fill="url(#zigzagPattern)" mask="url(#circleMask)"/>
        <circle cx="25" cy="25" r="25" fill="currentColor" fillOpacity="0.15"/>
        <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="2"/>
      </svg>
      <div className="flex flex-row items-center gap-2">
        <span className="text-sm font-semibold leading-tight">Student</span>
        <span className="text-sm font-semibold leading-tight">Achievement</span>
        <span className="text-sm font-semibold leading-tight">Partners</span>
      </div>
    </div>
  );
}; 