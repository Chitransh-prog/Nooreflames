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
        backgroundColor: '#F9F7F2',
        backgroundImage:
          'radial-gradient(ellipse at 50% 30%, rgba(187, 165, 142, 0.18) 0%, #F9F7F2 80%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: 'var(--font-body-family, sans-serif)',
        color: '#121212',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#FFFFFF',
          border: '1px solid rgba(187, 165, 142, 0.35)',
          borderRadius: '18px',
          padding: '40px 32px',
          boxShadow: '0 20px 60px rgba(18, 18, 18, 0.08), 0 2px 14px rgba(187, 165, 142, 0.12)',
          position: 'relative',
        }}
      >
        {/* Top Emblem with Noor-E-Flames Brand Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #F9F7F2 0%, #FFFFFF 100%)',
              border: '1.5px solid rgba(187, 165, 142, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(18, 18, 18, 0.06), 0 0 16px rgba(187, 165, 142, 0.12)',
              padding: '12px',
              overflow: 'hidden',
            }}
          >
            <img
              src="/images/logo/logo-dark.png"
              alt="NOOR-E-FLAMES Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 4px rgba(187, 165, 142, 0.25))',
              }}
            />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#8A7258',
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
              fontSize: '28px',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#121212',
            }}
          >
            Commerce Hub
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#707070' }}>
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
              borderRadius: '10px',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              color: '#dc2626',
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
                color: '#121212',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                color="#707070"
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
                  backgroundColor: '#F9F7F2',
                  border: '1.5px solid rgba(187, 165, 142, 0.35)',
                  borderRadius: '8px',
                  color: '#121212',
                  fontSize: '13.5px',
                  outline: 'none',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#121212';
                  e.target.style.backgroundColor = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(187, 165, 142, 0.35)';
                  e.target.style.backgroundColor = '#F9F7F2';
                }}
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
                color: '#121212',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="#707070"
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
                  backgroundColor: '#F9F7F2',
                  border: '1.5px solid rgba(187, 165, 142, 0.35)',
                  borderRadius: '8px',
                  color: '#121212',
                  fontSize: '13.5px',
                  outline: 'none',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#121212';
                  e.target.style.backgroundColor = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(187, 165, 142, 0.35)';
                  e.target.style.backgroundColor = '#F9F7F2';
                }}
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
                  color: '#707070',
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
              color: '#F9F7F2',
              border: '1.5px solid #121212',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.25s ease',
              boxShadow: '0 6px 20px rgba(18, 18, 18, 0.12)',
              opacity: isLoading ? 0.75 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#BBA58E';
                e.currentTarget.style.borderColor = '#BBA58E';
                e.currentTarget.style.color = '#121212';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#121212';
                e.currentTarget.style.borderColor = '#121212';
                e.currentTarget.style.color = '#F9F7F2';
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
              color: '#707070',
              fontSize: '12px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#121212')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#707070')}
          >
            ← Return to Live Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
