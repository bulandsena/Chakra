import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amountPaise, items, customerEmail, affiliateCode, transfers } = body;

    if (!amountPaise || amountPaise <= 0) {
      return NextResponse.json(
        { error: 'Invalid order amount' },
        { status: 400 }
      );
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    const isLiveRequested = body.isLive === true || process.env.RAZORPAY_LIVE_MODE === 'true';

    // If live/real test credentials are provided, invoke Razorpay API
    if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('YOUR_')) {
      const basicAuth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
      
      const orderPayload: Record<string, any> = {
        amount: amountPaise, // in paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          customer_email: customerEmail || 'buyer@example.com',
          affiliate_code: affiliateCode || 'direct',
        },
      };

      // If Razorpay Route transfers are requested and valid linked account is provided
      if (Array.isArray(transfers) && transfers.length > 0) {
        orderPayload.transfers = transfers.map((t: any) => ({
          account: t.account,
          amount: t.amount,
          currency: 'INR',
          notes: t.notes || {},
          on_hold: t.on_hold ? 1 : 0,
        }));
      }

      const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
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
        isLive: isLiveRequested,
        transfers: rzpData.transfers,
      });
    }

    // Never simulate live payments when live mode is requested
    if (isLiveRequested) {
      return NextResponse.json(
        {
          error: 'Live payment unavailable: Real Razorpay API credentials (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) must be set in Netlify environment variables. Live payments are never simulated.',
        },
        { status: 503 }
      );
    }

    // Default simulation response for sandbox/demo mode only
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
