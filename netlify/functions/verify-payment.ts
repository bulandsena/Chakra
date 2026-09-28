import type { Handler } from '@netlify/functions';
import crypto from 'crypto';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isDemo } = JSON.parse(
      event.body || '{}'
    );

    if (isDemo || razorpay_payment_id?.startsWith('pay_sim_')) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verified: true,
          status: 'paid',
          paymentId: razorpay_payment_id || `pay_sim_${Date.now()}`,
        }),
      };
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing RAZORPAY_KEY_SECRET configuration' }),
      };
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ verified: false, error: 'Signature mismatch' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verified: true,
        status: 'paid',
        paymentId: razorpay_payment_id,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Verification failed', message: err.message }),
    };
  }
};
