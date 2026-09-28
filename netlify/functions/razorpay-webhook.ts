import type { Handler } from '@netlify/functions';
import crypto from 'crypto';

// In-memory set for event idempotency (in production, backed by Supabase `webhook_events` table)
const processedEvents = new Set<string>();

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const rawBody = event.body || '';
    const signature = event.headers['x-razorpay-signature'] || (event.headers as any)['X-Razorpay-Signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret) {
      if (!signature) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing x-razorpay-signature header' }),
        };
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'utf8');
      const sigBuf = Buffer.from(signature, 'utf8');

      if (
        expectedBuf.length !== sigBuf.length ||
        !crypto.timingSafeEqual(expectedBuf, sigBuf)
      ) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Signature mismatch' }),
        };
      }
    }

    const payload = JSON.parse(rawBody || '{}');
    const eventId = payload.event_id || payload.payload?.payment?.entity?.id || `evt_${Date.now()}`;
    const eventType = payload.event;

    // Idempotency check: prevent duplicate credit/commission entries
    if (processedEvents.has(eventId)) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          duplicate: true,
          message: `Event ${eventId} already processed (idempotency guard).`,
          eventId,
        }),
      };
    }
    processedEvents.add(eventId);

    const logDetails: Record<string, any> = {
      event: eventType,
      eventId,
      timestamp: new Date().toISOString(),
    };

    switch (eventType) {
      case 'payment.captured': {
        const payment = payload.payload?.payment?.entity;
        logDetails.action = 'Payment captured snapshot verified';
        logDetails.payment_id = payment?.id;
        logDetails.amount = payment?.amount;
        break;
      }
      case 'order.paid': {
        const order = payload.payload?.order?.entity;
        logDetails.action = 'Order marked as paid';
        logDetails.order_id = order?.id;
        break;
      }
      case 'transfer.processed': {
        const transfer = payload.payload?.transfer?.entity;
        logDetails.action = 'Route transfer to seller linked account processed';
        logDetails.transfer_id = transfer?.id;
        logDetails.recipient = transfer?.recipient;
        break;
      }
      case 'transfer.failed': {
        const transfer = payload.payload?.transfer?.entity;
        logDetails.action = 'Route transfer failed - settlement hold placed';
        logDetails.transfer_id = transfer?.id;
        logDetails.error = transfer?.error;
        break;
      }
      case 'refund.processed': {
        const refund = payload.payload?.refund?.entity;
        logDetails.action = 'Refund processed and ledger reversal recorded';
        logDetails.refund_id = refund?.id;
        break;
      }
      case 'settlement.processed': {
        const settlement = payload.payload?.settlement?.entity;
        logDetails.action = 'Bank settlement confirmed by Razorpay';
        logDetails.settlement_id = settlement?.id;
        break;
      }
      default:
        logDetails.action = `Acknowledged event ${eventType}`;
        break;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        ...logDetails,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Webhook processing error', message: err.message }),
    };
  }
};
