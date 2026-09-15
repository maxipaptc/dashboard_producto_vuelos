import React from 'react';

interface TurismocityLogoProps {
  variant?: 'full' | 'text-only' | 'icon';
  colorMode?: 'positive' | 'negative';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const TurismocityLogo: React.FC<TurismocityLogoProps> = ({
  variant = 'full',
  colorMode = 'positive',
  className = '',
  size = 'md',
}) => {
  const isNeg = colorMode === 'negative';
  const navyColor = isNeg ? '#FFFFFF' : '#0D47A1';
  const blueColor = isNeg ? '#FFFFFF' : '#3069F6';
  const planeMain = isNeg ? '#FFFFFF' : '#3069F6';
  const planeShadow = isNeg ? '#D1D5DB' : '#0B3B8A';
  const planeWing = isNeg ? '#E5E7EB' : '#1D4ED8';
  const trailColor = isNeg ? '#E2E8F0' : '#3069F6';

  // Sizing map
  const heightClass =
    size === 'sm'
      ? 'h-6'
      : size === 'md'
      ? 'h-8'
      : size === 'lg'
      ? 'h-10'
      : 'h-12';

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightClass} w-auto shrink-0 ${className}`}
        aria-label="Turismocity"
      >
        <circle cx="24" cy="24" r="22" fill={isNeg ? '#FFFFFF' : '#3069F6'} />
        <g transform="translate(10, 9) scale(0.9)">
          <path d="M29 2 L2 15 L12 21.5 L29 2Z" fill={isNeg ? '#0D47A1' : '#FFFFFF'} />
          <path d="M29 2 L12 21.5 L15 28 L17.5 23 L29 2Z" fill={isNeg ? '#1E40AF' : '#DDE7FF'} />
          <path d="M29 2 L17.5 23 L25 21 L29 2Z" fill={isNeg ? '#2563EB' : '#EEF3FF'} />
          <path d="M15 28 L17.5 23 L14.5 22.5 Z" fill={isNeg ? '#1D4ED8' : '#B3CCFF'} />
        </g>
      </svg>
    );
  }

  if (variant === 'text-only') {
    return (
      <svg
        viewBox="0 0 240 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightClass} w-auto ${className}`}
        aria-label="Turismocity"
      >
        <text
          x="0"
          y="29"
          fill={navyColor}
          style={{
            fontFamily: "'Bryant Alternate', 'Comfortaa', 'Nunito', 'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: '32px',
            letterSpacing: '0.04em',
          }}
        >
          TURISMOCITY
        </text>
      </svg>
    );
  }

  // variant === 'full' (Logo + Avión: TURISMO : CITY)
  return (
    <svg
      viewBox="0 0 280 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${heightClass} w-auto shrink-0 ${className}`}
      aria-label="Turismocity Logo"
    >
      <g transform="translate(0, 10)">
        {/* "TURISMO" */}
        <text
          x="0"
          y="28"
          fill={navyColor}
          style={{
            fontFamily: "'Bryant Alternate', 'Comfortaa', 'Nunito', 'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: '30px',
            letterSpacing: '0.04em',
          }}
        >
          TURISMO
        </text>

        {/* Curved dotted flight trail between TURISMO and CITY */}
        <path
          d="M 160 30 C 163 22, 168 12, 178 3 C 182 -1, 187 -4, 192 -6"
          stroke={trailColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeDasharray="2 5"
          fill="none"
        />

        {/* "CITY" */}
        <text
          x="172"
          y="28"
          fill={blueColor}
          style={{
            fontFamily: "'Bryant Alternate', 'Comfortaa', 'Nunito', 'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: '30px',
            letterSpacing: '0.04em',
          }}
        >
          CITY
        </text>

        {/* Paper airplane taking off towards northeast */}
        <g transform="translate(193, -15) scale(0.72) rotate(-6)">
          {/* Main top wing */}
          <path d="M30 1 L2 14 L12 21 L30 1Z" fill={planeMain} />
          {/* Underfold shadow */}
          <path d="M30 1 L12 21 L15 28 L18 23 L30 1Z" fill={planeShadow} />
          {/* Right wing facet */}
          <path d="M30 1 L18 23 L26 21 L30 1Z" fill={planeWing} />
          {/* Small keel */}
          <path d="M15 28 L18 23 L14.5 22.5 Z" fill={isNeg ? '#9CA3AF' : '#173E8F'} />
        </g>
      </g>
    </svg>
  );
};
