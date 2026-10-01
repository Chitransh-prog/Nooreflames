import Razorpay from 'razorpay';
import crypto from 'crypto';

export function getRazorpayClient(): Razorpay {
  const keyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    'rzp_live_TiG51r1lqSUAZ6';
  const keySecret =
    process.env.RAZORPAY_KEY_SECRET ||
    'rEr7ALvAb5oJvzkWoLEwqZ13';

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret =
    process.env.RAZORPAY_KEY_SECRET ||
    'rEr7ALvAb5oJvzkWoLEwqZ13';

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
}
