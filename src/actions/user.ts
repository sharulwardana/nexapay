'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-helpers';
import { z } from 'zod';
import type { Role } from '@/types';

const updateUserBalanceSchema = z.object({
  userId: z.string().min(1, 'User ID required'),
  amount: z.number().int('Jumlah harus integer').min(-100000000).max(100000000),
});

export async function toggleUserRole(userId: string, currentRole: string) {
  try {
    await requireAdmin();

    if (!userId || typeof userId !== 'string') {
      return { success: false, error: 'User ID tidak valid' };
    }

    const newRole: Role = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath('/admin/users');
    revalidatePath('/admin');
    return { success: true, role: newRole };
  } catch (error: unknown) {
    console.error('Failed to toggle user role:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update role' };
  }
}

export async function updateUserBalance(userId: string, amount: number) {
  try {
    await requireAdmin();

    const parsed = updateUserBalanceSchema.safeParse({ userId, amount });
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const user = await prisma.user.update({
      where: { id: parsed.data.userId },
      data: { walletBalance: { increment: parsed.data.amount } },
    });

    revalidatePath('/admin/users');
    return { success: true, balance: user.walletBalance };
  } catch (error: unknown) {
    console.error('Failed to update balance:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update balance' };
  }
}
