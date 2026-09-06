import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'compact';
  variant?: 'dark' | 'light';
}

export default function Logo({ size = 'medium', variant = 'dark' }: LogoProps) {
  const height =
    size === 'compact'
      ? 38
      : size === 'small'
      ? 48
      : size === 'large'
      ? 84
      : 60;

  const logoSrc = variant === 'light' ? '/images/logo/logo-light.png' : '/images/logo/logo-dark.png';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      <img
        src={logoSrc}
        alt="NOOR-E-FLAMES — Where Fragrance Meets Flames"
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
}
