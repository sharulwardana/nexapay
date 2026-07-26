'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/../auth';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || user.role !== 'ADMIN') throw new Error('Forbidden');
  return session;
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  try {
    await requireAdmin();

    await prisma.product.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    revalidatePath('/admin/products');
    revalidatePath('/topup');
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to toggle product status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update status' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();

    await prisma.product.delete({
      where: { id }
    });
    revalidatePath('/admin/products');
    revalidatePath('/topup');
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to delete product:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete product' };
  }
}

export async function createProduct(data: {
  name: string;
  slug: string;
  category: string;
  publisher: string;
  image: string;
}) {
  try {
    await requireAdmin();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        category: data.category,
        publisher: data.publisher,
        image: data.image,
        isActive: true,
      }
    });
    revalidatePath('/admin/products');
    revalidatePath('/topup');
    return { success: true, product };
  } catch (error: unknown) {
    console.error('Failed to create product:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create product' };
  }
}
