import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId } = body;

    if (!invoiceId) {
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

    // Process the payment
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
      // Guest users have ID 'guest-user', or we can check if it's not a guest
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
  } catch (error) {
    console.error('Mock webhook error:', error);
    return NextResponse.json({ error: 'Server error during mock payment' }, { status: 500 });
  }
}
