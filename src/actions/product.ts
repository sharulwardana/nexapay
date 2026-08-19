'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-helpers';
import { z } from 'zod';
import { sanitizeInput } from '@/lib/sanitize';

// --- Zod Schemas ---
const createProductSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi').max(100).transform(sanitizeInput),
  slug: z.string().min(1, 'Slug wajib diisi').max(100).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  category: z.string().min(1, 'Kategori wajib diisi').max(50),
  publisher: z.string().max(100).transform(sanitizeInput).optional().default(''),
  image: z.string().min(1, 'URL gambar wajib diisi').max(500),
});

const updateProductSchema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeInput).optional(),
  category: z.string().min(1).max(50).optional(),
  publisher: z.string().max(100).transform(sanitizeInput).optional(),
  image: z.string().max(500).optional(),
});

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  try {
    await requireAdmin();

    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid product ID' };
    }

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

    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid product ID' };
    }

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

    // Validate with Zod
    const parsed = createProductSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        category: parsed.data.category,
        publisher: parsed.data.publisher,
        image: parsed.data.image,
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

export async function updateProduct(id: string, data: {
  name?: string;
  category?: string;
  publisher?: string;
  image?: string;
}) {
  try {
    await requireAdmin();

    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid product ID' };
    }

    // Validate with Zod
    const parsed = updateProductSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });
    revalidatePath('/admin/products');
    revalidatePath('/topup');
    return { success: true, product };
  } catch (error: unknown) {
    console.error('Failed to update product:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update product' };
  }
}
