import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createHmac, createHash, timingSafeEqual } from 'crypto';
import { sendPushToUser } from '@/lib/push';
import { formatCurrency } from '@/lib/utils';

/**
 * Verifies HMAC-SHA256 signature against raw body string
 */
function verifyHmacSha256(payload: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const expected = createHmac('sha256', secret).update(payload).digest('hex');
    const sig = Buffer.from(signature.toLowerCase(), 'hex');
    const exp = Buffer.from(expected.toLowerCase(), 'hex');
    if (sig.length !== exp.length) return false;
    return timingSafeEqual(sig, exp);
  } catch {
    return false;
  }
}

/**
 * Verifies Midtrans SHA512 signature: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string | null,
  serverKey: string
): boolean {
  if (!signatureKey || !serverKey) return false;
  try {
    const raw = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    const expected = createHash('sha512').update(raw).digest('hex');
    return expected.toLowerCase() === signatureKey.toLowerCase();
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    if (!rawBody) {
      return NextResponse.json({ error: 'Payload body is empty' }, { status: 400 });
    }

    let payload: Record<string, any>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const headers = req.headers;
    const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
    const tripayPrivateKey = process.env.TRIPAY_PRIVATE_KEY;
    const xenditCallbackToken = process.env.XENDIT_CALLBACK_TOKEN;
    const genericWebhookSecret = process.env.WEBHOOK_SECRET;

    // Detect Gateway and Invoice ID
    let invoiceId: string | undefined;
    let paymentGatewayStatus: string | undefined;
    let isSignatureValid = false;
    let isSignatureEnforced = false;

    // 1. Midtrans Webhook Detection
    if (payload.order_id && payload.status_code && payload.signature_key) {
      isSignatureEnforced = true;
      invoiceId = String(payload.order_id);
      paymentGatewayStatus = String(payload.transaction_status || '');

      if (midtransServerKey) {
        isSignatureValid = verifyMidtransSignature(
          invoiceId,
          String(payload.status_code),
          String(payload.gross_amount),
          String(payload.signature_key),
          midtransServerKey
        );
      } else if (process.env.NODE_ENV !== 'production') {
        isSignatureValid = true; // Development fallback if server key unset
      }
    }
    // 2. Tripay Webhook Detection
    else if (headers.get('x-callback-signature') || payload.merchant_ref) {
      isSignatureEnforced = true;
      invoiceId = String(payload.merchant_ref || payload.reference || '');
      paymentGatewayStatus = String(payload.status || '');

      const tripaySig = headers.get('x-callback-signature');
      const secret = tripayPrivateKey || genericWebhookSecret;
      if (secret && tripaySig) {
        isSignatureValid = verifyHmacSha256(rawBody, tripaySig, secret);
      } else if (process.env.NODE_ENV !== 'production') {
        isSignatureValid = true;
      }
    }
    // 3. Xendit Webhook Detection
    else if (headers.get('x-callback-token') || (payload.external_id && payload.status)) {
      isSignatureEnforced = true;
      invoiceId = String(payload.external_id || '');
      paymentGatewayStatus = String(payload.status || '');

      const callbackToken = headers.get('x-callback-token');
      const expectedToken = xenditCallbackToken || genericWebhookSecret;
      if (expectedToken && callbackToken) {
        isSignatureValid = callbackToken === expectedToken;
      } else if (process.env.NODE_ENV !== 'production') {
        isSignatureValid = true;
      }
    }
    // 4. Generic Custom NexaPay Gateway Webhook
    else {
      invoiceId = String(payload.invoiceId || payload.orderId || payload.reference || '');
      paymentGatewayStatus = String(payload.status || '');

      const sig = headers.get('x-webhook-signature');
      if (genericWebhookSecret) {
        isSignatureEnforced = true;
        isSignatureValid = verifyHmacSha256(rawBody, sig, genericWebhookSecret);
      } else {
        // If no secret configured and not in production, allow pass-through
        isSignatureValid = process.env.NODE_ENV !== 'production';
      }
    }

    // Security Check: reject if signature enforced and verification failed
    if (isSignatureEnforced && !isSignatureValid) {
      console.warn(`[PaymentWebhook] Invalid webhook signature rejected for order ${invoiceId}`);
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice identifier not found in payload' }, { status: 400 });
    }

    // Fetch existing transaction
    const transaction = await prisma.transaction.findUnique({
      where: { invoiceId },
      include: {
        denomination: true,
        user: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: `Transaction with invoice ${invoiceId} not found` }, { status: 404 });
    }

    // Idempotency: If already paid or completed, return success immediately
    if (transaction.status === 'COMPLETED' || transaction.status === 'PAID') {
      return NextResponse.json({
        success: true,
        message: 'Transaction already completed previously',
        invoiceId: transaction.invoiceId,
      });
    }

    // Determine normalized status
    const normStatus = (paymentGatewayStatus || '').toLowerCase();
    const isSuccess = ['settlement', 'capture', 'paid', 'completed', 'success'].includes(normStatus);
    const isFailed = ['deny', 'cancel', 'expire', 'expired', 'failed', 'failure'].includes(normStatus);

    if (isSuccess) {
      const pointsEarned = Math.floor(transaction.totalAmount / 1000);

      // Execute atomic transaction update
      await prisma.$transaction(async (tx) => {
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'COMPLETED',
            paidAt: new Date(),
            completedAt: new Date(),
          },
        });

        // Award loyalty points to registered users
        if (transaction.userId && transaction.userId !== 'guest-user') {
          await tx.user.update({
            where: { id: transaction.userId },
            data: {
              loyaltyPoints: { increment: pointsEarned },
            },
          });
        }
      });

      // Dispatch Web Push notification
      if (transaction.userId && transaction.userId !== 'guest-user') {
        sendPushToUser(transaction.userId, {
          title: 'Top Up Berhasil! 💎',
          body: `Pembayaran ${formatCurrency(transaction.totalAmount)} untuk ${transaction.productName} telah diterima & diproses!`,
          icon: '/favicon.ico',
          url: `/payment-status/${transaction.invoiceId}`,
        }).catch((err) => console.error('[PaymentWebhook] Error dispatching push:', err));
      }

      return NextResponse.json({
        success: true,
        message: `Transaction ${invoiceId} marked as COMPLETED`,
        pointsEarned,
      });
    } else if (isFailed) {
      // Revert stock if denomination was limited
      await prisma.$transaction(async (tx) => {
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'FAILED',
          },
        });

        if (transaction.denominationId && transaction.denomination?.stock !== -1) {
          await tx.denomination.update({
            where: { id: transaction.denominationId },
            data: {
              stock: { increment: 1 },
            },
          });
        }
      });

      return NextResponse.json({
        success: true,
        message: `Transaction ${invoiceId} marked as FAILED`,
      });
    }

    // Default: Return acknowledgment for intermediary statuses (e.g. pending, challenge)
    return NextResponse.json({
      success: true,
      message: `Status ${normStatus} acknowledged for invoice ${invoiceId}`,
    });

  } catch (error: any) {
    console.error('[PaymentWebhook] Exception processing callback:', error);
    return NextResponse.json(
      { error: 'Internal server error processing payment webhook' },
      { status: 500 }
    );
  }
}
