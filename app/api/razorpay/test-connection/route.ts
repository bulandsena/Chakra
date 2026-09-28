import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes('YOUR_')) {
      return NextResponse.json({
        success: true,
        message: 'Sandbox / Simulation Engine Ready: Set real RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in Netlify environment variables for live merchant gateway operations.',
        mode: 'test_simulation',
      });
    }

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/payments?count=1', {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    });

    if (rzpRes.ok) {
      return NextResponse.json({
        success: true,
        message: `Successfully connected to Razorpay Merchant API. Key ID verified (${keyId.substring(0, 10)}...).`,
        mode: 'live_connected',
      });
    }

    const errText = await rzpRes.text();
    return NextResponse.json({
      success: false,
      message: `Razorpay rejected authorization: ${errText}`,
      mode: 'auth_failed',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: `Connection test error: ${err.message}`,
    });
  }
}
