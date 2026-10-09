import React from 'react';

interface LogoProps {
  size?: 'micro' | 'compact' | 'small' | 'medium' | 'large' | 'hero';
  variant?: 'dark' | 'light' | 'gold' | 'emblem' | 'emblem-gold' | 'emblem-light' | 'emblem-dark';
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export default function Logo({
  size = 'medium',
  variant = 'light',
  className = '',
  style = {},
  alt = 'NOOR-E-FLAMES — Where Fragrance Meets Flames',
}: LogoProps) {
  const height =
    size === 'micro'
      ? 24
      : size === 'compact'
      ? 36
      : size === 'small'
      ? 48
      : size === 'large'
      ? 84
      : size === 'hero'
      ? 112
      : 60;

  let logoSrc = '/images/logo/logo-light.png';
  if (variant === 'dark') {
    logoSrc = '/images/logo/logo-dark.png';
  } else if (variant === 'gold') {
    logoSrc = '/images/logo/logo-gold.png';
  } else if (variant === 'emblem' || variant === 'emblem-gold') {
    logoSrc = '/images/logo/logo-emblem-gold.png';
  } else if (variant === 'emblem-light') {
    logoSrc = '/images/logo/logo-emblem-light.png';
  } else if (variant === 'emblem-dark') {
    logoSrc = '/images/logo/logo-emblem-dark.png';
  }

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        ...style,
      }}
    >
      <img
        src={logoSrc}
        alt={alt}
        style={{
          height: `${height}px`,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
}

