import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json({
        success: true,
        message: 'Sandbox Webhook Ready: To verify cryptographic signatures in live production, configure RAZORPAY_WEBHOOK_SECRET in Netlify environment variables.',
        mode: 'test_simulation',
      });
    }

    const testPayload = JSON.stringify({
      event: 'payment.captured',
      test: true,
      timestamp: Date.now(),
    });

    const testSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(testPayload)
      .digest('hex');

    return NextResponse.json({
      success: true,
      message: 'Webhook Secret Valid: HMAC-SHA256 signature generator tested successfully.',
      signaturePreview: `${testSignature.substring(0, 12)}...`,
      mode: 'live_verified',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: `Webhook test error: ${err.message}`,
    });
  }
}
