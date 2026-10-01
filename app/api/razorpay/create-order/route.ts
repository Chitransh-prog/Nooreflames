import { NextResponse } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid amount is required to create a payment order' },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayClient();

    // Razorpay amount is in the smallest currency unit (paise for INR, 1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    const orderOptions = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId:
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        process.env.RAZORPAY_KEY_ID ||
        'rzp_live_TiG51r1lqSUAZ6',
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.error?.description || error?.message || 'Failed to initialize payment gateway order',
      },
      { status: 500 }
    );
  }
}
