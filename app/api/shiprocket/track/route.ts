import { NextResponse } from 'next/server';
import { trackShiprocketShipment } from '@/lib/shiprocket';
import { getOrders } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const awb = searchParams.get('awb');
    const orderId = searchParams.get('orderId');

    let awbToTrack = awb;

    if (!awbToTrack && orderId) {
      const orders = getOrders();
      const order = orders.find((o) => o.id === orderId);
      if (order && order.shiprocketAwb) {
        awbToTrack = order.shiprocketAwb;
      }
    }

    if (!awbToTrack) {
      return NextResponse.json(
        { success: false, message: 'AWB code or valid orderId with shipment is required' },
        { status: 400 }
      );
    }

    const trackingData = await trackShiprocketShipment(awbToTrack);
    return NextResponse.json(trackingData);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Error tracking shipment' },
      { status: 500 }
    );
  }
}
