import crypto from 'crypto';
import { cookies } from 'next/headers';
import { AdminRole, ROLE_DEFINITIONS } from '@/lib/rbac';

export const ADMIN_EMAIL = 'nooreflamesadmin@gmail.com';
export const ADMIN_PASSWORD = 'nooreflames';
export const ADMIN_COOKIE_NAME = 'nf_admin_token';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'noor-e-flames-master-jwt-secret-key-2026';

export interface AdminJwtPayload {
  email: string;
  role: AdminRole;
  name?: string;
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
export function signAdminToken(
  email: string = ADMIN_EMAIL,
  role: AdminRole = 'administrator',
  name: string = 'Executive Administrator'
): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: AdminJwtPayload = {
    email,
    role,
    name,
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

const POSSIBLE_SECRETS = [
  process.env.ADMIN_JWT_SECRET,
  'nooreflames-master-luxury-jwt-secret-key-2026',
  'noor-e-flames-master-jwt-secret-key-2026',
].filter(Boolean) as string[];

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
  const sigBuf = Buffer.from(signature);

  let signatureValid = false;
  for (const secret of POSSIBLE_SECRETS) {
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      signatureValid = true;
      break;
    }
  }

  if (!signatureValid) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const rawPayload: any = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (rawPayload.exp && rawPayload.exp < now) {
      return { valid: false, error: 'Token has expired' };
    }

    // Support legacy 'admin' role mapping to 'administrator'
    const role: AdminRole = rawPayload.role === 'admin' ? 'administrator' : rawPayload.role;
    if (!ROLE_DEFINITIONS[role]) {
      return { valid: false, error: 'Unauthorized role claims' };
    }

    const payload: AdminJwtPayload = {
      email: rawPayload.email,
      role,
      name: rawPayload.name || (role === 'administrator' ? 'Administrator' : 'Staff Member'),
      iat: rawPayload.iat,
      exp: rawPayload.exp,
    };

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message || 'Failed to parse payload' };
  }
}

// Extract and verify admin session from Request or Next.js cookies
export function getAdminSession(request?: Request): {
  authenticated: boolean;
  user?: { email: string; role: AdminRole; name?: string };
} {
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

  if (!token || typeof token !== 'string' || token.trim() === '' || token === 'undefined' || token === 'null') {
    return { authenticated: false };
  }

  const result = verifyAdminToken(token);
  if (result.valid && result.payload) {
    return {
      authenticated: true,
      user: {
        email: result.payload.email,
        role: result.payload.role,
        name: result.payload.name,
      },
    };
  }

  return { authenticated: false };
}
