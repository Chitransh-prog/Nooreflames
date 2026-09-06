import { NextResponse } from 'next/server';
import { getStoreData, saveStoreData } from '@/lib/store';

export async function GET() {
  const store = getStoreData();
  return NextResponse.json(store);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const success = saveStoreData(body);
    if (success) {
      return NextResponse.json({ success: true, message: 'Store saved successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to save store' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
