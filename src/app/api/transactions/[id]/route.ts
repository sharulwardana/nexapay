import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/transactions/[id]
 * Returns the current status of a transaction by invoiceId.
 * Used by PaymentStatusClient for real-time polling.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id.length > 100) {
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { invoiceId: id },
          { id },
        ],
      },
      select: {
        id: true,
        invoiceId: true,
        status: true,
        paymentMethod: true,
        totalAmount: true,
        paidAt: true,
        completedAt: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Auto-expire pending transactions past their expiry
    if (
      transaction.status === 'PENDING' &&
      transaction.expiresAt &&
      new Date(transaction.expiresAt) < new Date()
    ) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED' },
      });

      return NextResponse.json({
        ...transaction,
        status: 'FAILED',
      });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Transaction lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
