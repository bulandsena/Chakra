import type { Handler } from '@netlify/functions';

/**
 * Netlify Function: refund
 * Processes proportional refunds for orders:
 * - 20% owner marketplace commission reversal
 * - 80% seller share reversal
 * Calls Razorpay Refund API if live credentials exist.
 */
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { paymentId, orderId, orderNumber, amountPaise, reason } = JSON.parse(
      event.body || '{}'
    );

    if (!paymentId || !amountPaise || amountPaise <= 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid refund parameters. paymentId and amountPaise are required.' }),
      };
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Fixed 20% platform commission reversal & 80% seller share deduction
    const ownerDeductionPaise = Math.round(amountPaise * 0.2); // 20%
    const sellerDeductionPaise = amountPaise - ownerDeductionPaise; // 80%

    // If live credentials are provided, invoke Razorpay refund API
    if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('YOUR_')) {
      const basicAuth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
      const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountPaise,
          notes: {
            order_id: orderId,
            order_number: orderNumber,
            reason: reason || 'Customer requested refund prior to digital file download',
          },
        }),
      });

      if (!rzpRes.ok) {
        const errorText = await rzpRes.text();
        return {
          statusCode: 502,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Razorpay refund API call failed',
            details: errorText,
          }),
        };
      }

      const rzpData = await rzpRes.json();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          status: 'processed',
          refundId: rzpData.id,
          amountPaise,
          ownerDeductionPaise,
          sellerDeductionPaise,
          message: 'Razorpay refund executed. Proportional 20% platform / 80% seller deductions recorded.',
        }),
      };
    }

    // Sandbox / Test fallback
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        status: 'processed_simulated',
        refundId: `rfnd_sim_${Date.now()}`,
        amountPaise,
        ownerDeductionPaise,
        sellerDeductionPaise,
        message: 'Refund simulation complete. 20% owner fee reversed, 80% seller share debited.',
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server refund error', message: err.message }),
    };
  }
};
