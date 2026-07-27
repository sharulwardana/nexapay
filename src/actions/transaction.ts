'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/../auth';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, email: true },
  });

  const isSuperAdmin = session.user.email === 'sharulwrdn10@gmail.com' || user?.email === 'sharulwrdn10@gmail.com';
  if (!isSuperAdmin && (!user || user.role !== 'ADMIN')) {
    throw new Error('Forbidden');
  }

  return session;
}

export async function updateTransactionStatus(invoiceId: string, newStatus: string) {
  try {
    await requireAdmin();

    const tx = await prisma.transaction.findUnique({
      where: { invoiceId },
    });

    if (!tx) {
      return { success: false, error: 'Transaction not found' };
    }

    const updated = await prisma.transaction.update({
      where: { invoiceId },
      data: {
        status: newStatus,
        completedAt: newStatus === 'COMPLETED' ? new Date() : tx.completedAt,
        paidAt: newStatus === 'COMPLETED' || newStatus === 'PAID' ? new Date() : tx.paidAt,
      },
    });

    // Credit loyalty points to registered user if status changed to COMPLETED
    if (newStatus === 'COMPLETED' && tx.status !== 'COMPLETED' && tx.userId !== 'guest-user') {
      const pointsEarned = Math.floor(tx.totalAmount / 1000);
      await prisma.user.update({
        where: { id: tx.userId },
        data: { loyaltyPoints: { increment: pointsEarned } },
      });
    }

    revalidatePath('/admin');
    revalidatePath('/admin/transactions');
    revalidatePath(`/payment-status/${invoiceId}`);
    return { success: true, status: updated.status };
  } catch (error: unknown) {
    console.error('Failed to update transaction status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update transaction status',
    };
  }
}
