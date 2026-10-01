import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { createOrder } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderPayload,
    } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, message: 'Missing Razorpay signature verification parameters' },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Cryptographic signature mismatch. Payment verification failed.' },
        { status: 400 }
      );
    }

    // Build finalized order record with Razorpay transaction metadata
    const finalOrderData = {
      ...orderPayload,
      payment: `Razorpay Online (${orderPayload?.payment || 'Prepaid UPI/Card'})`,
      paymentStatus: 'paid',
      deliveryStatus: 'confirmed',
      razorpayOrderId,
      razorpayPaymentId,
    };

    const savedOrder = createOrder(finalOrderData);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      order: savedOrder,
    });
  } catch (error: any) {
    console.error('Razorpay Verify Payment Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Payment verification encountered an unexpected error' },
      { status: 500 }
    );
  }
}
