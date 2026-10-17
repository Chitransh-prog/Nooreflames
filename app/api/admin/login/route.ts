import { NextResponse } from 'next/server';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_COOKIE_NAME, signAdminToken } from '@/lib/adminAuth';
import { getStoreDataAsync } from '@/lib/store';
import { AdminRole, INITIAL_TEAM_MEMBERS } from '@/lib/rbac';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    const identifier = String(username || email || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();

    let authenticatedUser: { email: string; username: string; role: AdminRole; name: string } | null = null;

    // 1. Check primary Master Administrator credentials (email or username 'admin')
    if (
      (identifier === ADMIN_EMAIL.toLowerCase() || identifier === 'admin') &&
      cleanPassword === ADMIN_PASSWORD
    ) {
      authenticatedUser = {
        email: ADMIN_EMAIL,
        username: 'admin',
        role: 'administrator',
        name: 'Master Administrator',
      };
    } else {
      // 2. Check team members registry in store / default members
      const store = await getStoreDataAsync();
      const teamList = Array.isArray(store.adminUsers) && store.adminUsers.length > 0
        ? store.adminUsers
        : INITIAL_TEAM_MEMBERS;

      const member = teamList.find(
        (m) =>
          (m.username && m.username.toLowerCase() === identifier) ||
          m.email.toLowerCase() === identifier
      );

      if (member) {
        if (member.status === 'suspended') {
          return NextResponse.json(
            { success: false, message: 'This staff account has been suspended by an Administrator.' },
            { status: 403 }
          );
        }

        const validPassword = member.password ? member.password === cleanPassword : cleanPassword === ADMIN_PASSWORD;
        if (validPassword) {
          authenticatedUser = {
            email: member.email,
            username: member.username || member.email.split('@')[0],
            role: member.role,
            name: member.name,
          };
        }
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid username, email, or password.' },
        { status: 401 }
      );
    }

    const token = signAdminToken(
      authenticatedUser.email,
      authenticatedUser.role,
      authenticatedUser.name,
      authenticatedUser.username
    );

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: authenticatedUser,
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
