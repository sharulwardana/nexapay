'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-helpers';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/sanitize';

// --- Zod Schemas ---
const createPromoSchema = z.object({
  code: z.string().min(1, 'Kode promo wajib diisi').max(30).transform((v) => v.toUpperCase().trim()),
  name: z.string().min(1, 'Nama promo wajib diisi').max(100).transform(sanitizeInput),
  type: z.enum(['PERCENTAGE', 'FIXED'], { errorMap: () => ({ message: 'Tipe promo harus PERCENTAGE atau FIXED' }) }),
  value: z.number().int().min(1, 'Nilai promo harus lebih dari 0'),
  minPurchase: z.number().int().min(0).default(0),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal akhir wajib diisi'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, { message: 'Tanggal akhir harus setelah tanggal mulai', path: ['endDate'] });

export async function togglePromoStatus(id: string, currentStatus: boolean) {
  try {
    await requireAdmin();

    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid promo ID' };
    }

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

    // Validate with Zod
    const parsed = createPromoSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const promo = await prisma.promo.create({
      data: {
        code: parsed.data.code,
        name: parsed.data.name,
        type: parsed.data.type,
        value: parsed.data.value,
        minPurchase: parsed.data.minPurchase,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
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

    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid promo ID' };
    }

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
