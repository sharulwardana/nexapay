import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { digitalProducts } from '@/data/products';
import ProductsClient from './ProductsClient';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Produk Digital | NexaPay',
  description: 'Beli pulsa, paket data, token PLN, voucher, gift card, streaming, dan e-wallet dengan harga terbaik di NexaPay.',
};

export const revalidate = 60;

export default async function ProductsPage() {
  const staticNonGameProducts = digitalProducts.filter(p => p.category !== 'GAME_TOPUP');
  let products = staticNonGameProducts as unknown as any[];

  try {
    const productsFromDb = await prisma.product.findMany({
      where: {
        isActive: true,
        category: { not: 'GAME_TOPUP' },
      },
      include: {
        denominations: {
          where: { isActive: true },
          select: { price: true },
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    if (productsFromDb && productsFromDb.length > 0) {
      products = productsFromDb;
    }
  } catch (error) {
    console.warn('Prisma fetch failed on /products, using static fallback:', error);
  }

  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen pt-28 text-center text-sm text-muted-foreground">Memuat katalog...</div>}>
        <ProductsClient products={products} />
      </Suspense>
    </>
  );
}
