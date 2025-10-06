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
      <svg
        className={`${sizeClasses[size]} animate-pulse`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="outlineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
        
        {/* Animated outer rings */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="url(#outlineGradient)" strokeWidth="2" opacity="0.3">
          <animate attributeName="r" values="48;52;48" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="52" fill="none" stroke="url(#outlineGradient)" strokeWidth="1" opacity="0.2">
          <animate attributeName="r" values="52;56;52" dur="2s" repeatCount="indefinite" begin="0.5s" />
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        
        {/* Main circle with subtle animation */}
        <circle cx="50" cy="50" r="45" fill="url(#logoGradient)">
          <animate attributeName="r" values="45;47;45" dur="3s" repeatCount="indefinite" />
        </circle>
        
        {/* Phone icon with outline style */}
        <g transform="translate(50, 50)">
          {/* Phone body outline */}
          <rect
            x="-12"
            y="-20"
            width="24"
            height="40"
            rx="4"
            ry="4"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          
          {/* Phone screen with animated glow */}
          <rect
            x="-10"
            y="-18"
            width="20"
            height="28"
            rx="2"
            ry="2"
            fill="url(#logoGradient)"
            opacity="0.2"
          >
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" />
          </rect>
          
          {/* Home button with pulse */}
          <circle
            cx="0"
            cy="12"
            r="3"
            fill="white"
            opacity="0.8"
          >
            <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
          </circle>
          
          {/* Speaker with animated lines */}
          <rect
            x="-6"
            y="-16"
            width="12"
            height="2"
            rx="1"
            ry="1"
            fill="white"
            opacity="0.9"
          >
            <animate attributeName="opacity" values="0.9;0.6;0.9" dur="1s" repeatCount="indefinite" />
          </rect>
          
          {/* Animated call signal waves */}
          <g opacity="0.9">
            <path
              d="M-25,0 Q-20,-5 -15,0 Q-20,5 -25,0"
              stroke="white"
              strokeWidth="2"
              fill="none"
            >
              <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1.5s" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path
              d="M-30,0 Q-22,-8 -14,0 Q-22,8 -30,0"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            >
              <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
              <animateTransform attributeName="transform" type="scale" values="1;1.3;1" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
            </path>
            <path
              d="M-35,0 Q-24,-11 -13,0 Q-24,11 -35,0"
              stroke="white"
              strokeWidth="1"
              fill="none"
            >
              <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" begin="0.6s" />
              <animateTransform attributeName="transform" type="scale" values="1;1.4;1" dur="1.5s" repeatCount="indefinite" begin="0.6s" />
            </path>
          </g>
          
          {/* Voice waves on the right side */}
          <g opacity="0.8">
            <path
              d="M15,0 Q20,-3 25,0 Q20,3 15,0"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            >
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.2s" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="1.2s" repeatCount="indefinite" />
            </path>
            <path
              d="M18,0 Q23,-5 28,0 Q23,5 18,0"
              stroke="white"
              strokeWidth="1"
              fill="none"
            >
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.2s" repeatCount="indefinite" begin="0.4s" />
              <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="1.2s" repeatCount="indefinite" begin="0.4s" />
            </path>
          </g>
        </g>
        
        {/* Pulsing center dot */}
        <circle cx="50" cy="50" r="2" fill="white" opacity="0.9">
          <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
      
      {showText && (
        <span className={`font-bold spark-gradient-text ${textSizeClasses[size]}`}>
          AI Voice Caller
        </span>
      )}
    </div>
  );
}
