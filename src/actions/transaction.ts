'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-helpers';

export async function updateTransactionStatus(invoiceId: string, newStatus: string) {
  try {
    await requireAdmin();

    if (!invoiceId || typeof invoiceId !== 'string') {
      return { success: false, error: 'Invalid invoice ID' };
    }

    // Validate status value
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PAID'];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` };
    }

    // Use $transaction for atomic status update + loyalty points award
    const result = await prisma.$transaction(async (tx) => {
      const existingTx = await tx.transaction.findUnique({
        where: { invoiceId },
      });

      if (!existingTx) {
        throw new Error('Transaction not found');
      }

      const updated = await tx.transaction.update({
        where: { invoiceId },
        data: {
          status: newStatus,
          completedAt: newStatus === 'COMPLETED' ? new Date() : existingTx.completedAt,
          paidAt: newStatus === 'COMPLETED' || newStatus === 'PAID' ? new Date() : existingTx.paidAt,
        },
      });

      // Credit loyalty points to registered user if status changed to COMPLETED
      if (newStatus === 'COMPLETED' && existingTx.status !== 'COMPLETED' && existingTx.userId !== 'guest-user') {
        const pointsEarned = Math.floor(existingTx.totalAmount / 1000);
        await tx.user.update({
          where: { id: existingTx.userId },
          data: { loyaltyPoints: { increment: pointsEarned } },
        });
      }

      return updated;
    });

    revalidatePath('/admin');
    revalidatePath('/admin/transactions');
    revalidatePath(`/payment-status/${invoiceId}`);
    return { success: true, status: result.status };
  } catch (error: unknown) {
    console.error('Failed to update transaction status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update transaction status',
    };
  }
}
