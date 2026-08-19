import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Verify webhook signature using HMAC-SHA256.
 * The signature must be sent in the `x-webhook-signature` header.
 */
function verifySignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  try {
    const expected = createHmac('sha256', secret).update(payload).digest('hex');
    const sig = Buffer.from(signature, 'hex');
    const exp = Buffer.from(expected, 'hex');
    if (sig.length !== exp.length) return false;
    return timingSafeEqual(sig, exp);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    // SECURITY: Block this mock endpoint in production entirely.
    // In production, use real payment gateway webhooks (Midtrans/Xendit)
    // with proper signature verification from the gateway provider.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is disabled in production.' },
        { status: 403 }
      );
    }

    // Read raw body for signature verification
    const rawBody = await req.text();

    // Verify webhook signature if WEBHOOK_SECRET is configured
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers.get('x-webhook-signature');
      if (!verifySignature(rawBody, signature, webhookSecret)) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    }

    const body = JSON.parse(rawBody);
    const { invoiceId } = body;

    if (!invoiceId || typeof invoiceId !== 'string') {
      return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { invoiceId },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.status === 'PAID' || transaction.status === 'COMPLETED') {
      return NextResponse.json({ message: 'Transaction already paid' }, { status: 200 });
    }

    // Process the payment atomically
    await prisma.$transaction(async (tx) => {
      // 1. Update status to PAID
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          completedAt: new Date(),
        },
      });

      // 2. Award loyalty points if it's a registered user
      if (transaction.userId !== 'guest-user') {
        const pointsEarned = Math.floor(transaction.totalAmount / 1000);
        await tx.user.update({
          where: { id: transaction.userId },
          data: {
            loyaltyPoints: { increment: pointsEarned }
          }
        });
      }
    });

    return NextResponse.json({ success: true, message: 'Payment simulated successfully' });
  } catch (error: unknown) {
    console.error('Mock webhook error:', error);
    return NextResponse.json({ error: 'Server error during mock payment' }, { status: 500 });
  }
}
