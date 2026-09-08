import crypto from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_EMAIL = 'nooreflamesadmin@gmail.com';
export const ADMIN_PASSWORD = 'nooreflames';
export const ADMIN_COOKIE_NAME = 'nf_admin_token';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'noor-e-flames-master-jwt-secret-key-2026';

export interface AdminJwtPayload {
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}

// Base64Url encoding helpers
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

// Sign standard HMAC-SHA256 JWT
export function signAdminToken(email: string = ADMIN_EMAIL): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: AdminJwtPayload = {
    email,
    role: 'admin',
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days validity
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signature}`;
}

// Verify HMAC-SHA256 JWT
export function verifyAdminToken(token: string): { valid: boolean; payload?: AdminJwtPayload; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'No token provided' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid JWT structure' };
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;

  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const payload: AdminJwtPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Token has expired' };
    }

    if (payload.role !== 'admin' || payload.email !== ADMIN_EMAIL) {
      return { valid: false, error: 'Unauthorized claims' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message || 'Failed to parse payload' };
  }
}

// Extract and verify admin session from Request or Next.js cookies
export function getAdminSession(request?: Request): { authenticated: boolean; user?: { email: string; role: string } } {
  let token: string | undefined;

  if (request) {
    // 1. Check Authorization Bearer header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    // 2. Check Cookie header in request
    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`));
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }
  }

  // 3. Fallback to Next.js cookies() API
  if (!token) {
    try {
      const cookieStore = cookies();
      const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
      if (cookie) {
        token = cookie.value;
      }
    } catch {
      // cookies() might fail if not in Next server context
    }
  }

  if (!token) {
    return { authenticated: false };
  }

  const result = verifyAdminToken(token);
  if (result.valid && result.payload) {
    return {
      authenticated: true,
      user: {
        email: result.payload.email,
        role: result.payload.role,
      },
    };
  }

  return { authenticated: false };
}
