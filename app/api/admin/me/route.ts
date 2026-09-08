import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const session = getAdminSession(request);

  const response = NextResponse.json({
    authenticated: Boolean(session.authenticated),
    user: session.user || null,
  });

  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  return response;
}

