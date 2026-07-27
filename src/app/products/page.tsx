import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import ProductsClient from './ProductsClient';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Produk Digital | NexaPay',
  description: 'Beli pulsa, paket data, token PLN, voucher, gift card, streaming, dan e-wallet dengan harga terbaik di NexaPay.',
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
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

  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen pt-28 text-center text-sm text-muted-foreground">Memuat katalog...</div>}>
        <ProductsClient products={products} />
      </Suspense>
    </>
  );
}
