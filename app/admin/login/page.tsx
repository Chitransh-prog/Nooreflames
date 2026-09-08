'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('nooreflamesadmin@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0c0c0c',
        backgroundImage:
          'radial-gradient(ellipse at 50% 30%, rgba(187, 165, 142, 0.12) 0%, rgba(12, 12, 12, 0.98) 75%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: 'var(--font-body-family, sans-serif)',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(18, 18, 18, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(187, 165, 142, 0.35)',
          borderRadius: '12px',
          padding: '36px 32px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(187, 165, 142, 0.08)',
          position: 'relative',
        }}
      >
        {/* Top Emblem with Noor-E-Flames Brand Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(223, 171, 114, 0.22) 0%, rgba(20, 18, 16, 0.95) 75%)',
              border: '1.5px solid rgba(223, 171, 114, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 28px rgba(0, 0, 0, 0.6), 0 0 24px rgba(223, 171, 114, 0.15)',
              padding: '10px',
              overflow: 'hidden',
            }}
          >
            <img
              src="/images/logo/logo-light.png"
              alt="NOOR-E-FLAMES Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 6px rgba(223, 171, 114, 0.35))',
              }}
            />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#BBA58E',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            <Sparkles size={11} />
            <span>EXECUTIVE GATEWAY</span>
          </div>

          <h1
            style={{
              margin: '0 0 6px 0',
              fontFamily: 'var(--font-heading-family, serif)',
              fontSize: '26px',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#ffffff',
            }}
          >
            Commerce Hub
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#9d9890' }}>
            Noor-E-Flames Master Administration
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              fontSize: '12.5px',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: '#BBA58E',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                color="#8a857b"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nooreflamesadmin@gmail.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#BBA58E')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: '#BBA58E',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="#8a857b"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#BBA58E')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#8a857b',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 20px',
              backgroundColor: '#121212',
              color: '#ffffff',
              border: '1px solid #BBA58E',
              borderRadius: '6px',
              fontSize: '13.5px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 8px 24px rgba(223, 171, 114, 0.3)',
              opacity: isLoading ? 0.75 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#e8b87d';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#BBA58E';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Commerce Hub</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              color: '#8a857b',
              fontSize: '12px',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#BBA58E')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8a857b')}
          >
            ← Return to Live Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
