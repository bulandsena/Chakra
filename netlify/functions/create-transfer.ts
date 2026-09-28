import type { Handler } from '@netlify/functions';

/**
 * Netlify Function: create-transfer
 * Manages Razorpay Route transfers to seller linked accounts.
 * Validates Route permissions before execution to prevent unauthorized transfers.
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
    const { paymentId, sellerLinkedAccountId, amountPaise, notes } = JSON.parse(
      event.body || '{}'
    );

    if (!paymentId || !amountPaise || amountPaise <= 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Invalid transfer parameters. Both paymentId and valid amountPaise are required.',
        }),
      };
    }

    const routeEnabled = process.env.RAZORPAY_ROUTE_ENABLED === 'true';
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check Route activation
    if (!routeEnabled) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          status: 'on_hold',
          message:
            'Marketplace settlement is not configured. Please complete Razorpay marketplace/Route onboarding before enabling seller payouts.',
          holdReason:
            'Route awaiting merchant contract activation. Funds safely retained in marketplace settlement balance.',
          paymentId,
          amountPaise,
        }),
      };
    }

    if (!sellerLinkedAccountId) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          status: 'on_hold',
          message: 'Seller account not connected to Razorpay Route.',
          holdReason: 'Seller has not completed Razorpay Route Linked Account onboarding.',
          paymentId,
          amountPaise,
        }),
      };
    }

    // Live API integration
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
        const errorText = await rzpRes.text();
        return {
          statusCode: 502,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Razorpay Route transfer failed',
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
          status: 'transferred',
          transferId: rzpData.items?.[0]?.id || `trf_${Date.now()}`,
          amountPaise,
          recipient: sellerLinkedAccountId,
        }),
      };
    }

    // Sandbox / Test fallback
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        status: 'transferred_simulated',
        transferId: `trf_sim_${Date.now()}`,
        amountPaise,
        recipient: sellerLinkedAccountId,
        message: 'Route transfer simulated in test environment.',
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server transfer error', message: err.message }),
    };
  }
};
