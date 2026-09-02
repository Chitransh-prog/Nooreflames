import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'compact';
  variant?: 'dark' | 'light';
}

export default function Logo({ size = 'medium', variant = 'dark' }: LogoProps) {
  const scale =
    size === 'compact'
      ? 0.55
      : size === 'small'
      ? 0.75
      : size === 'large'
      ? 1.2
      : 1;

  const textColor = variant === 'light' ? '#ffffff' : '#121212';
  const strokeColor = variant === 'light' ? '#ffffff' : '#121212';
  const subColor = variant === 'light' ? 'rgba(255, 255, 255, 0.75)' : '#666666';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        userSelect: 'none',
        margin: size === 'compact' ? '-12px 0' : '0',
      }}
    >
      {/* Monogram SVG matching N | F vertical split logo */}
      <svg
        width="90"
        height="90"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginBottom: '2px' }}
      >
        {/* Center Vertical Divider Line */}
        <line x1="100" y1="10" x2="100" y2="190" stroke={strokeColor} strokeWidth="2.5" />

        {/* Top Left N */}
        <text
          x="65"
          y="70"
          fontFamily="Instrument Serif, Georgia, serif"
          fontSize="68"
          fontWeight="400"
          fill={textColor}
          textAnchor="middle"
        >
          N
        </text>

        {/* Top Right F */}
        <text
          x="135"
          y="70"
          fontFamily="Instrument Serif, Georgia, serif"
          fontSize="68"
          fontWeight="400"
          fill={textColor}
          textAnchor="middle"
        >
          F
        </text>

        {/* Horizontal Center Divider Bar with Text */}
        <line x1="20" y1="100" x2="180" y2="100" stroke={strokeColor} strokeWidth="1" />

        {/* Bottom Left Inverted N */}
        <text
          x="65"
          y="160"
          fontFamily="Instrument Serif, Georgia, serif"
          fontSize="68"
          fontWeight="400"
          fill={textColor}
          textAnchor="middle"
        >
          N
        </text>

        {/* Bottom Right Inverted F */}
        <text
          x="135"
          y="160"
          fontFamily="Instrument Serif, Georgia, serif"
          fontSize="68"
          fontWeight="400"
          fill={textColor}
          textAnchor="middle"
        >
          F
        </text>
      </svg>

      {/* Brand Text Bar */}
      <div
        style={{
          fontSize: '14px',
          letterSpacing: '0.35em',
          fontWeight: 600,
          color: textColor,
          textTransform: 'uppercase',
          marginTop: '1px',
          fontFamily: "'Instrument Sans', sans-serif",
          whiteSpace: 'nowrap',
        }}
      >
        NOOR - E - FLAMES
      </div>

      {/* Subtitle Tagline */}
      <div
        style={{
          fontSize: '8.5px',
          letterSpacing: '0.25em',
          color: subColor,
          textTransform: 'uppercase',
          marginTop: '2px',
          fontWeight: 500,
          fontFamily: "'Instrument Sans', sans-serif",
          whiteSpace: 'nowrap',
        }}
      >
        WHERE FRAGRANCE MEETS FLAMES
      </div>
    </div>
  );
}
