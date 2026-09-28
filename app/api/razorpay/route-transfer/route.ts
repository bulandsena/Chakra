import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentId, sellerLinkedAccountId, amountPaise, notes } = body;

    if (!paymentId || !amountPaise || amountPaise <= 0) {
      return NextResponse.json(
        { error: 'Invalid transfer parameters' },
        { status: 400 }
      );
    }

    const routeEnabled = process.env.RAZORPAY_ROUTE_ENABLED === 'true';
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if Route is officially activated for this merchant
    if (!routeEnabled) {
      return NextResponse.json({
        success: true,
        status: 'on_hold',
        holdReason: 'Razorpay Route contract is awaiting merchant activation. Payment kept in merchant settlement balance for manual payout.',
        paymentId,
        amountPaise,
      });
    }

    if (!sellerLinkedAccountId) {
      return NextResponse.json({
        success: true,
        status: 'on_hold',
        holdReason: 'Seller has not completed Razorpay Route Linked Account onboarding. Payout held until account verified.',
        paymentId,
        amountPaise,
      });
    }

    // When live credentials and Route are available:
    if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('YOUR_')) {
      const basicAuth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
      const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/transfers`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transfers: [
            {
              account: sellerLinkedAccountId,
              amount: amountPaise,
              currency: 'INR',
              notes: notes || { type: 'marketplace_seller_split' },
            },
          ],
        }),
      });

      if (!rzpRes.ok) {
        const errorData = await rzpRes.text();
        return NextResponse.json({
          success: false,
          status: 'failed',
          error: 'Razorpay Route transfer rejected by provider',
          details: errorData,
        }, { status: 502 });
      }

      const rzpData = await rzpRes.json();
      return NextResponse.json({
        success: true,
        status: 'transferred',
        transferId: rzpData.items?.[0]?.id || `trf_${Date.now()}`,
        amountPaise,
        recipient: sellerLinkedAccountId,
      });
    }

    // Test/simulation response
    return NextResponse.json({
      success: true,
      status: 'transferred_simulated',
      transferId: `trf_sim_${Date.now().toString(36)}`,
      amountPaise,
      recipient: sellerLinkedAccountId,
      message: 'Route transfer simulated successfully in sandbox mode.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal transfer error', message: error.message },
      { status: 500 }
    );
  }
}
