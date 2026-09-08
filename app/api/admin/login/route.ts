import { NextResponse } from 'next/server';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_COOKIE_NAME, signAdminToken } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();

    if (cleanEmail !== ADMIN_EMAIL.toLowerCase() || cleanPassword !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = signAdminToken(cleanEmail);

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      user: {
        email: ADMIN_EMAIL,
        role: 'admin',
      },
    });

    // Set secure httpOnly cookie for 7 days
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Server error during authentication' },
      { status: 500 }
    );
  }
}
