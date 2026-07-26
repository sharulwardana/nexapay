import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/../auth';
import ProductClient from './ProductClient';

export const metadata = {
  title: 'Manajemen Produk | NexaAdmin',
  description: 'Kelola produk dan harga NexaPay.',
};

export default async function AdminProductsPage() {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Fetch all products with their denominations count
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { denominations: true }
      }
    }
  });

  return (
    <ProductClient products={products} adminUser={session.user} />
  );
}
