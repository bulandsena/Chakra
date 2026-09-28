import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { paymentId, sellerLinkedAccountId, amountPaise } = JSON.parse(event.body || '{}');

    if (!paymentId || !amountPaise) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing parameters' }) };
    }

    const routeEnabled = process.env.RAZORPAY_ROUTE_ENABLED === 'true';
    if (!routeEnabled) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          status: 'on_hold',
          holdReason: 'Razorpay Route awaiting merchant contract activation.',
          amountPaise,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        status: 'transferred',
        transferId: `trf_sim_${Date.now()}`,
        amountPaise,
        sellerLinkedAccountId,
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
