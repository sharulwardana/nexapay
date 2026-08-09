'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-helpers';

export async function togglePromoStatus(id: string, currentStatus: boolean) {
  try {
    await requireAdmin();

    await prisma.promo.update({
      where: { id },
      data: { isActive: !currentStatus },
    });

    revalidatePath('/admin/promos');
    revalidatePath('/promo');
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to toggle promo status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update promo' };
  }
}

export async function createPromo(data: {
  code: string;
  name: string;
  type: string;
  value: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
}) {
  try {
    await requireAdmin();

    const promo = await prisma.promo.create({
      data: {
        code: data.code.toUpperCase().trim(),
        name: data.name,
        type: data.type,
        value: data.value,
        minPurchase: data.minPurchase,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: true,
      },
    });

    revalidatePath('/admin/promos');
    revalidatePath('/promo');
    return { success: true, promo };
  } catch (error: unknown) {
    console.error('Failed to create promo:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create promo' };
  }
}

export async function deletePromo(id: string) {
  try {
    await requireAdmin();

    await prisma.promo.delete({
      where: { id },
    });

    revalidatePath('/admin/promos');
    revalidatePath('/promo');
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to delete promo:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete promo' };
  }
}
