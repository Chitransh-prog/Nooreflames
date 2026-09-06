import { NextResponse } from 'next/server';
import { getOrders, createOrder, updateOrderStatus } from '@/lib/store';

export async function GET() {
  const orders = getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customer || !body.amount || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid order data: customer, amount, and items required' },
        { status: 400 }
      );
    }

    const order = createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Error creating order' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, deliveryStatus } = body;
    if (!orderId || !deliveryStatus) {
      return NextResponse.json(
        { success: false, message: 'orderId and deliveryStatus required' },
        { status: 400 }
      );
    }

    const updated = updateOrderStatus(orderId, deliveryStatus);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Error updating order' },
      { status: 500 }
    );
  }
}
