'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-helpers';

export async function createBanner(data: {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  position?: string;
}) {
  try {
    await requireAdmin();

    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        image: data.image,
        link: data.link || null,
        position: data.position || 'home_hero',
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
