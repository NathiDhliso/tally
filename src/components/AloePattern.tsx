import React from 'react';

interface AloePatternProps {
  className?: string;
  opacity?: number;
  color?: string;
}

export const AloePattern: React.FC<AloePatternProps> = ({
  className = '',
  opacity = 0.05,
  color = '#6b8e23',
}) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Aloe leaf-inspired geometric pattern */}
        <pattern
          id="aloe-pattern"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          {/* Central pointed leaf shape */}
          <path
            d="M50,10 L60,40 L55,70 L50,90 L45,70 L40,40 Z"
            fill={color}
            opacity="0.8"
          />

          {/* Side accent leaves */}
          <path
            d="M20,30 L28,50 L25,65 L20,75 L15,65 L12,50 Z"
            fill={color}
            opacity="0.5"
          />
          <path
            d="M80,30 L88,50 L85,65 L80,75 L75,65 L72,50 Z"
            fill={color}
            opacity="0.5"
          />

          {/* Small geometric accents (diamonds) */}
          <path d="M50,5 L53,10 L50,15 L47,10 Z" fill={color} opacity="0.6" />
          <path
            d="M30,25 L33,30 L30,35 L27,30 Z"
            fill={color}
            opacity="0.4"
          />
          <path
            d="M70,25 L73,30 L70,35 L67,30 Z"
            fill={color}
            opacity="0.4"
          />

          {/* Connecting lines (subtle) */}
          <line
            x1="50"
            y1="90"
            x2="50"
            y2="100"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.3"
          />
          <line
            x1="20"
            y1="75"
            x2="15"
            y2="85"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.3"
          />
          <line
            x1="80"
            y1="75"
            x2="85"
            y2="85"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
      </defs>

      {/* Apply pattern to full viewport */}
      <rect width="100%" height="100%" fill="url(#aloe-pattern)" />
    </svg>
  );
};
