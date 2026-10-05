import { NextResponse } from 'next/server';
import { getOrders, createOrder, updateOrderStatus } from '@/lib/store';
import { sendOpenWaMessage, personalizeMessage, ORDER_CONFIRMATION_TEMPLATE } from '@/lib/whatsapp';

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

    const order = createOrder({
      ...body,
      isPartialCod: Boolean(body.isPartialCod),
      advanceAmount: body.advanceAmount !== undefined ? Number(body.advanceAmount) : undefined,
      remainingCodAmount: body.remainingCodAmount !== undefined ? Number(body.remainingCodAmount) : undefined,
      distanceKm: body.distanceKm !== undefined ? Number(body.distanceKm) : undefined,
      zoneName: body.zoneName || undefined,
    });

    // Trigger automated personalized WhatsApp Order Confirmation via Open-WA
    if (order.phone) {
      try {
        const itemsSummary = (order.items || [])
          .map((i: any) => `• ${i.title} × ${i.quantity} (₹${(Number(i.price) * (i.quantity || 1)).toLocaleString()})`)
          .join('\n');

        let codBreakdown = '';
        if (order.isPartialCod) {
          codBreakdown = `💳 *Advance Paid via UPI:* ₹${(order.advanceAmount ?? 0).toLocaleString()}\n💵 *Cash to Pay on Delivery:* ₹${(order.remainingCodAmount ?? (order.amount - (order.advanceAmount ?? 0))).toLocaleString()}`;
        } else {
          codBreakdown = `💳 *Payment:* Paid Online via Razorpay`;
        }

        const waText = personalizeMessage(ORDER_CONFIRMATION_TEMPLATE, {
          name: order.customer,
          orderId: order.id,
          itemsSummary,
          totalAmount: order.amount.toLocaleString(),
          codBreakdown,
          address: order.address || order.destination || '',
          pincode: order.pincode || '',
        });

        sendOpenWaMessage({
          phone: order.phone,
          text: waText,
        }).catch((e) => console.warn('Async WhatsApp dispatch error:', e));
      } catch (waErr) {
        console.warn('WhatsApp order dispatch trigger failed:', waErr);
      }
    }

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

    // Trigger automated WhatsApp delivery status update
    if (updated.phone) {
      try {
        const statusEmoji = deliveryStatus === 'delivered' ? '🎉' : deliveryStatus === 'dispatched' ? '🚚' : '📍';
        const statusMessage = `${statusEmoji} *Order Update from Noor-E-Flames Atelier*\n\nHello *${updated.customer}*,\n\nYour order *#${updated.id}* delivery status is now: *${deliveryStatus.toUpperCase()}*.\n\nThank you for choosing Noor-E-Flames!\nhttps://nooreflames.vercel.app`;

        sendOpenWaMessage({
          phone: updated.phone,
          text: statusMessage,
        }).catch((e) => console.warn('Async WhatsApp status error:', e));
      } catch (e) {
        console.warn('WhatsApp delivery status dispatch failed:', e);
      }
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Error updating order' },
      { status: 500 }
    );
  }
}
