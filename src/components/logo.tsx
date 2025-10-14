import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export default function Logo({ size = 'md', className = '', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img
        src="/logo.png"
        alt="SPARK AI SALES AGENT"
        className={`${sizeClasses[size]} object-contain`}
      />
      
      {showText && (
        <span className={`font-bold spark-gradient-text ${textSizeClasses[size]}`}>
          SPARK AI SALES AGENT
        </span>
      )}
    </div>
  );
}
