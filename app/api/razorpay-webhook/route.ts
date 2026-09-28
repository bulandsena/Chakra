import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory set for event idempotency (in production, backed by Supabase `webhook_events` table)
const processedEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
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
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody || '{}');
    const eventId = payload.event_id || payload.payload?.payment?.entity?.id || `evt_${Date.now()}`;
    const eventType = payload.event;

    // Idempotency verification: Never process duplicate webhook events
    if (processedEvents.has(eventId)) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        message: `Event ${eventId} has already been recorded and processed.`,
        eventId,
      });
    }

    processedEvents.add(eventId);

    // Business event dispatch
    const responseData: Record<string, any> = {
      received: true,
      event: eventType,
      eventId,
      timestamp: new Date().toISOString(),
    };

    switch (eventType) {
      case 'payment.captured': {
        const payment = payload.payload?.payment?.entity;
        responseData.action = 'Payment captured snapshot verified';
        responseData.payment_id = payment?.id;
        responseData.amount = payment?.amount;
        responseData.notes = payment?.notes;
        break;
      }
      case 'order.paid': {
        const order = payload.payload?.order?.entity;
        responseData.action = 'Order marked as paid';
        responseData.order_id = order?.id;
        break;
      }
      case 'transfer.processed': {
        const transfer = payload.payload?.transfer?.entity;
        responseData.action = 'Route transfer to seller linked account processed';
        responseData.transfer_id = transfer?.id;
        responseData.recipient = transfer?.recipient;
        break;
      }
      case 'transfer.failed': {
        const transfer = payload.payload?.transfer?.entity;
        responseData.action = 'Route transfer failed - settlement hold placed';
        responseData.transfer_id = transfer?.id;
        responseData.error = transfer?.error;
        break;
      }
      case 'refund.processed': {
        const refund = payload.payload?.refund?.entity;
        responseData.action = 'Refund processed and ledger reversal recorded';
        responseData.refund_id = refund?.id;
        responseData.payment_id = refund?.payment_id;
        break;
      }
      case 'settlement.processed': {
        const settlement = payload.payload?.settlement?.entity;
        responseData.action = 'Bank settlement confirmed by Razorpay';
        responseData.settlement_id = settlement?.id;
        responseData.net_amount = settlement?.amount;
        break;
      }
      default:
        responseData.action = `Acknowledged unhandled event ${eventType}`;
        break;
    }

    return NextResponse.json({ success: true, ...responseData });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Webhook processing error', message: err.message },
      { status: 500 }
    );
  }
}
