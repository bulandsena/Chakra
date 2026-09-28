import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isDemo,
    } = body;

    // In demo mode simulation:
    if (isDemo || razorpay_payment_id?.startsWith('pay_sim_')) {
      return NextResponse.json({
        verified: true,
        status: 'paid',
        paymentId: razorpay_payment_id || `pay_sim_${Date.now()}`,
        message: 'Demo simulation payment verified by server engine.',
      });
    }

    // In live mode: Strict cryptographic HMAC-SHA256 signature check
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: 'Server payment secret configuration missing' },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      return NextResponse.json(
        { verified: false, error: 'Cryptographic signature mismatch. Potential tampering detected.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      status: 'paid',
      paymentId: razorpay_payment_id,
      message: 'Razorpay webhook signature verified successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Payment verification failed', message: error.message },
      { status: 500 }
    );
  }
}
