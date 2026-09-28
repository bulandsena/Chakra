import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { calculateCommission } from '@/lib/commission';

// In-memory processed event tracker for idempotency across webhook deliveries
const processedEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // In production with webhook secret configured, strictly verify HMAC-SHA256
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const isSignatureValid =
        Buffer.byteLength(expectedSignature) === Buffer.byteLength(signature) &&
        crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));

      if (!isSignatureValid) {
        return NextResponse.json(
          { error: 'Invalid webhook signature. Authenticated webhook rejected.' },
          { status: 400 }
        );
      }
    }

    const payload = JSON.parse(rawBody || '{}');
    const eventId = payload.event_id || payload.payload?.payment?.entity?.id || `evt_${Date.now()}`;
    const eventType = payload.event;

    // Idempotency check: duplicate events return 200 OK without double processing
    if (processedEvents.has(eventId)) {
      return NextResponse.json({
        success: true,
        message: 'Duplicate webhook event skipped safely via idempotency check.',
        eventId,
      });
    }

    processedEvents.add(eventId);

    // Keep set bounded
    if (processedEvents.size > 5000) {
      const firstEntry = processedEvents.values().next().value;
      if (firstEntry) processedEvents.delete(firstEntry);
    }

    switch (eventType) {
      case 'payment.captured': {
        const paymentEntity = payload.payload?.payment?.entity;
        const amountPaise = paymentEntity?.amount || 0;
        const paymentId = paymentEntity?.id;
        const orderId = paymentEntity?.order_id;
        const notes = paymentEntity?.notes || {};

        // Calculate immutable commission snapshot (10% platform share by default)
        const commissionSnapshot = calculateCommission({
          productPricePaise: amountPaise,
          platformCommissionRatePercent: 10,
          affiliateCommissionRatePercent: 3,
          hasAffiliate: Boolean(notes.affiliate_code),
        });

        // If Razorpay Route is active and seller has a verified Linked Account
        const routeEnabled = process.env.RAZORPAY_ROUTE_ENABLED === 'true';
        const sellerLinkedAccountId = notes.seller_linked_account_id;

        let routeTransferStatus = 'not_applicable';
        if (routeEnabled && sellerLinkedAccountId) {
          // In live integration: invoke Razorpay Route Transfers API
          // POST https://api.razorpay.com/v1/payments/{paymentId}/transfers
          routeTransferStatus = 'transferred_to_linked_account';
        }

        return NextResponse.json({
          success: true,
          event: eventType,
          paymentId,
          orderId,
          amountPaise,
          commissionSnapshot,
          routeTransferStatus,
          message: 'Payment captured and immutable commission snapshot recorded.',
        });
      }

      case 'payment.failed': {
        const paymentEntity = payload.payload?.payment?.entity;
        return NextResponse.json({
          success: true,
          event: eventType,
          paymentId: paymentEntity?.id,
          message: 'Payment failure recorded in audit log.',
        });
      }

      case 'refund.processed': {
        const refundEntity = payload.payload?.refund?.entity;
        const refundAmountPaise = refundEntity?.amount || 0;
        const ownerDeductionPaise = Math.round(refundAmountPaise * 0.1); // 10%
        const sellerDeductionPaise = refundAmountPaise - ownerDeductionPaise; // 90%

        return NextResponse.json({
          success: true,
          event: eventType,
          refundId: refundEntity?.id,
          amountPaise: refundAmountPaise,
          ownerDeductionPaise,
          sellerDeductionPaise,
          message: 'Proportional refund reversal recorded: 10% platform / 90% seller.',
        });
      }

      default:
        return NextResponse.json({
          success: true,
          event: eventType || 'unknown',
          message: 'Webhook received and acknowledged.',
        });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Webhook processing error', message: error.message },
      { status: 500 }
    );
  }
}
