import { NextResponse } from 'next/server';
import { checkShiprocketServiceability } from '@/lib/shiprocket';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode') || '110001';
    const weight = Number(searchParams.get('weight') || 0.5);
    const cod = searchParams.get('cod') === '1' || searchParams.get('cod') === 'true';
    const amount = Number(searchParams.get('amount') || 1000);

    const result = await checkShiprocketServiceability(pincode, weight, cod, amount);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Error checking Shiprocket serviceability' },
      { status: 500 }
    );
  }
}
