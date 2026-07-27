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

export async function toggleUserRole(userId: string, currentRole: string) {
  try {
    await requireAdmin();

    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

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

    const user = await prisma.user.update({
      where: { id: userId },
      data: { walletBalance: { increment: amount } },
    });

    revalidatePath('/admin/users');
    return { success: true, balance: user.walletBalance };
  } catch (error: unknown) {
    console.error('Failed to update balance:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update balance' };
  }
}
