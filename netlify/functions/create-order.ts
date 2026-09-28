import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { amountPaise, customerEmail, affiliateCode } = JSON.parse(event.body || '{}');

    if (!amountPaise || amountPaise <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid order amount' }),
      };
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret && !keyId.includes('YOUR_')) {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: { customer_email: customerEmail, affiliate_code: affiliateCode },
        }),
      });

      const data = await res.json();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, orderId: data.id, amountPaise: data.amount, keyId }),
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
      body: JSON.stringify({ error: 'Server error', message: err.message }),
    };
  }
};
