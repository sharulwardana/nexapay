import { redirect } from 'next/navigation';
import { auth } from '@/../auth';
import prisma from '@/lib/prisma';
import FavoritesClient from './FavoritesClient';

export const metadata = {
  title: 'Favorit',
};

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch real favorites from DB
  const favoriteRecords = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          denominations: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
            take: 1
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const favorites = favoriteRecords.map(f => ({
    id: f.id,
    productId: f.productId,
    name: f.product.name,
    slug: f.product.slug,
    category: f.product.category,
    publisher: f.product.publisher || 'Unknown',
    minPrice: f.product.denominations[0]?.price || 0,
  }));

  return <FavoritesClient initialFavorites={favorites} />;
}
