import prisma from '@/lib/prisma';
import ProductClient from './ProductClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Manajemen Produk | NexaAdmin',
  description: 'Kelola produk dan harga NexaPay.',
};

export default async function AdminProductsPage() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { denominations: true }
        }
      }
    });

    return <ProductClient products={products || []} />;
  } catch (error) {
    console.error('Failed to load admin products:', error);
    return <ProductClient products={[]} />;
  }
}
