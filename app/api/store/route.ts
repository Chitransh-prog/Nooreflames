import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getStoreData, saveStoreData } from '@/lib/store';
import { getAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const store = getStoreData();
    const response = NextResponse.json(store);

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error: any) {
    console.error('Error in GET /api/store:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to read store data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Restrict store modification strictly to authenticated Admins
    const session = getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin JWT authentication required to modify store data' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const success = saveStoreData(body);

    if (success) {
      // Invalidate Next.js static and server-side cache so frontend updates immediately
      try {
        revalidatePath('/');
        revalidatePath('/admin');
        revalidatePath('/api/store');
        revalidatePath('/product/[id]', 'page');
      } catch (revalErr) {
        console.warn('revalidatePath warning (non-fatal):', revalErr);
      }

      return NextResponse.json({ success: true, message: 'Store saved successfully' });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to write store data to disk' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in POST /api/store:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

