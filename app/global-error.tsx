'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: '#FAF8F5',
          color: '#121212',
          fontFamily: "'Montserrat', sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <div style={{ padding: '24px', maxWidth: '480px' }}>
          <h2 style={{ fontFamily: 'serif', fontSize: '26px', marginBottom: '12px' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            We encountered a system error. Please reload the page to continue.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              background: '#121212',
              color: '#F9F7F2',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
