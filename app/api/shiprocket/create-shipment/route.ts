import { NextResponse } from 'next/server';
import { getOrders, updateOrder } from '@/lib/store';
import { createShiprocketShipment } from '@/lib/shiprocket';
import { sendOpenWaMessage } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'orderId is required' },
        { status: 400 }
      );
    }

    const orders = getOrders();
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: `Order #${orderId} not found` },
        { status: 404 }
      );
    }

    // Call Shiprocket engine to create shipment & generate AWB
    const shipmentResult = await createShiprocketShipment({
      id: order.id,
      customer: order.customer,
      email: order.email,
      phone: order.phone,
      address: order.address,
      destination: order.destination,
      pincode: order.pincode,
      amount: order.amount,
      isPartialCod: order.isPartialCod,
      remainingCodAmount: order.remainingCodAmount,
      items: order.items || [],
    });

    if (!shipmentResult.success) {
      return NextResponse.json(
        { success: false, message: shipmentResult.message || 'Failed to generate shipment in Shiprocket' },
        { status: 500 }
      );
    }

    // Update order in store
    const updated = updateOrder(order.id, {
      deliveryStatus: 'dispatched',
      shiprocketOrderId: shipmentResult.orderId,
      shiprocketShipmentId: shipmentResult.shipmentId,
      shiprocketAwb: shipmentResult.awbCode,
      shiprocketCourier: shipmentResult.courierName,
      shiprocketTrackingUrl: shipmentResult.trackingUrl,
    });

    // Notify customer on WhatsApp with tracking details
    if (order.phone && shipmentResult.awbCode) {
      try {
        const msg = `🚚 *Noor-E-Flames Order Dispatched via ${shipmentResult.courierName || 'Shiprocket'}!*\n\nHello *${order.customer}*,\n\nYour order *#${order.id}* has been carefully hand-packaged and handed over to our express courier partner.\n\n📦 *AWB Tracking Code:* ${shipmentResult.awbCode}\n🔗 *Live Tracking Link:* ${shipmentResult.trackingUrl || `https://shiprocket.co/tracking/${shipmentResult.awbCode}`}\n\n${order.isPartialCod ? `💵 *Reminder:* Balance of ₹${(order.remainingCodAmount ?? 0).toLocaleString()} will be collected on delivery.` : ''}\n\nThank you for choosing Noor-E-Flames Atelier!`;
        
        sendOpenWaMessage({
          phone: order.phone,
          text: msg,
        }).catch((err) => console.warn('Shiprocket WhatsApp notification failed:', err));
      } catch (err) {
        console.warn('Shiprocket WhatsApp notification exception:', err);
      }
    }

    return NextResponse.json({
      success: true,
      order: updated,
      shipment: shipmentResult,
    });
  } catch (error: any) {
    console.error('Shiprocket Create Shipment Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Server error creating Shiprocket shipment' },
      { status: 500 }
    );
  }
}
