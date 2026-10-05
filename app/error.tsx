'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Caught Error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        textAlign: 'center',
        background: '#FAF8F5',
        color: '#121212',
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          color: '#dc2626',
        }}
      >
        <AlertCircle size={32} />
      </div>

      <h1
        style={{
          fontFamily: "'Bodoni Moda', serif",
          fontSize: '28px',
          fontWeight: 600,
          marginBottom: '10px',
          color: '#121212',
        }}
      >
        An Unexpected Hiccup Occurred
      </h1>

      <p
        style={{
          maxWidth: '480px',
          fontSize: '14px',
          color: '#666',
          lineHeight: 1.6,
          marginBottom: '28px',
        }}
      >
        Our atelier artisans are on it. You can try refreshing the page or return to the main gallery.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => reset()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: '#121212',
            color: '#F9F7F2',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} />
          Try Again
        </button>

        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: '#FFFFFF',
            color: '#121212',
            border: '1px solid #DCD3C5',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          <Home size={14} />
          Return Home
        </Link>
      </div>
    </div>
  );
}
