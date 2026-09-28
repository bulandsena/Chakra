import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { amountPaise, customerEmail, affiliateCode, transfers } = JSON.parse(event.body || '{}');

    if (!amountPaise || amountPaise <= 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid order amount' }),
      };
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const isLiveRequested = Boolean(process.env.RAZORPAY_LIVE_MODE === 'true');

    if (keyId && keySecret && !keyId.includes('YOUR_')) {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      
      const payload: Record<string, any> = {
        amount: amountPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          customer_email: customerEmail || 'buyer@example.com',
          affiliate_code: affiliateCode || 'direct',
        },
      };

      if (Array.isArray(transfers) && transfers.length > 0) {
        payload.transfers = transfers.map((t: any) => ({
          account: t.account,
          amount: t.amount,
          currency: 'INR',
          notes: t.notes || {},
          on_hold: t.on_hold ? 1 : 0,
        }));
      }

      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          statusCode: 502,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Razorpay order creation failed', details: errorText }),
        };
      }

      const data = await res.json();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          orderId: data.id,
          amountPaise: data.amount,
          currency: 'INR',
          keyId,
          transfers: data.transfers,
        }),
      };
    }

    if (isLiveRequested) {
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Live payment unavailable: Configure RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in Netlify environment variables. Never simulating live payments.',
        }),
      };
    }

    // Demo simulation fallback
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        orderId: `order_sim_${Date.now().toString(36)}`,
        amountPaise,
        currency: 'INR',
        isDemo: true,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error', message: err.message }),
    };
  }
};
