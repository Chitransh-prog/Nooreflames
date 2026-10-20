import { NextResponse } from 'next/server';
import { getOrders, updateOrder } from '@/lib/store';
import { sendOpenWaMessage } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    // Shiprocket sends tracking webhook updates
    const awb = payload.awb || payload.awb_code;
    const currentStatus = (payload.current_status || payload.status || '').toLowerCase();
    const orderId = payload.order_id;

    if (!awb && !orderId) {
      return NextResponse.json({ success: true, message: 'No action taken' });
    }

    const orders = getOrders();
    const order = orders.find(
      (o) => (awb && o.shiprocketAwb === awb) || (orderId && o.id === orderId)
    );

    if (!order) {
      return NextResponse.json({ success: true, message: 'Order not matched' });
    }

    let mappedStatus = order.deliveryStatus;
    if (currentStatus.includes('delivered')) {
      mappedStatus = 'delivered';
    } else if (
      currentStatus.includes('transit') ||
      currentStatus.includes('out for delivery') ||
      currentStatus.includes('reached')
    ) {
      mappedStatus = 'in-transit';
    } else if (currentStatus.includes('canceled') || currentStatus.includes('rto')) {
      mappedStatus = 'cancelled';
    }

    updateOrder(order.id, { deliveryStatus: mappedStatus });

    // Send WhatsApp notification if status changed to out for delivery or delivered
    if (order.phone && (mappedStatus === 'delivered' || currentStatus.includes('out for delivery'))) {
      const isDelivered = mappedStatus === 'delivered';
      const text = isDelivered
        ? `🎉 *Your Noor-E-Flames Order Has Arrived!*\n\nHello *${order.customer}*,\n\nYour order *#${order.id}* has been successfully delivered! We hope our artisanal fragrance illuminates your day.\n\n✨ Tag us @nooreflames on Instagram to be featured!\nhttps://nooreflames.vercel.app`
        : `🚚 *Out for Delivery:* Your Noor-E-Flames order *#${order.id}* is out for delivery today with the courier executive.\n${order.isPartialCod ? `💵 *Reminder:* Please keep ₹${(order.remainingCodAmount ?? 0).toLocaleString()} cash ready.` : ''}`;

      sendOpenWaMessage({
        phone: order.phone,
        text,
      }).catch((e) => console.warn('Webhook WhatsApp notification failed:', e));
    }

    return NextResponse.json({ success: true, orderId: order.id, status: mappedStatus });
  } catch (error: any) {
    console.error('Shiprocket webhook error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
