'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-helpers';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/sanitize';

// --- Zod Schemas ---
const createBannerSchema = z.object({
  title: z.string().min(1, 'Judul banner wajib diisi').max(100).transform(sanitizeInput),
  subtitle: z.string().max(200).transform(sanitizeInput).optional(),
  image: z.string().min(1, 'URL gambar wajib diisi').max(500),
  link: z.string().max(500).optional(),
  position: z.string().max(50).optional().default('home_hero'),
});

export async function createBanner(data: {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  position?: string;
}) {
  try {
    await requireAdmin();

    // Validate with Zod
    const parsed = createBannerSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const banner = await prisma.banner.create({
      data: {
        title: parsed.data.title,
        subtitle: parsed.data.subtitle || null,
        image: parsed.data.image,
        link: parsed.data.link || null,
        position: parsed.data.position,
        isActive: true,
      },
    });

    revalidatePath('/admin/banners');
    revalidatePath('/');
    return { success: true, banner };
  } catch (error: unknown) {
    console.error('Failed to create banner:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create banner' };
  }
}

export async function toggleBannerStatus(id: string, currentStatus: boolean) {
  try {
    await requireAdmin();

    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid banner ID' };
    }

    await prisma.banner.update({
      where: { id },
      data: { isActive: !currentStatus },
    });

    revalidatePath('/admin/banners');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to toggle banner status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update banner status' };
  }
}

export async function deleteBanner(id: string) {
  try {
    await requireAdmin();

    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid banner ID' };
    }

    await prisma.banner.delete({
      where: { id },
    });

    revalidatePath('/admin/banners');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to delete banner:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete banner' };
  }
}
