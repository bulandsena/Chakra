import { NextRequest, NextResponse } from 'next/server';
import { calculateCommission } from '@/lib/commission';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amountPaise, items, customerEmail, affiliateCode } = body;

    if (!amountPaise || amountPaise <= 0) {
      return NextResponse.json(
        { error: 'Invalid order amount' },
        { status: 400 }
      );
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live credentials are provided, invoke Razorpay API
    if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('YOUR_')) {
      const basicAuth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
      const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountPaise, // in paise
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customer_email: customerEmail,
            affiliate_code: affiliateCode || 'organic',
          },
        }),
      });

      if (!rzpResponse.ok) {
        const errorText = await rzpResponse.text();
        return NextResponse.json(
          { error: 'Failed to create Razorpay order', details: errorText },
          { status: 502 }
        );
      }

      const rzpData = await rzpResponse.json();
      return NextResponse.json({
        success: true,
        orderId: rzpData.id,
        amountPaise: rzpData.amount,
        currency: 'INR',
        keyId: razorpayKeyId,
      });
    }

    // Default simulation response for sandbox/demo mode
    const simulatedOrderId = `order_sim_${Date.now().toString(36)}`;
    return NextResponse.json({
      success: true,
      orderId: simulatedOrderId,
      amountPaise,
      currency: 'INR',
      keyId: 'rzp_test_simulation',
      isDemo: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
