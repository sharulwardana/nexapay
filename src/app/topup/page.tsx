import prisma from '@/lib/prisma';
import { digitalProducts } from '@/data/products';
import TopUpClient from './TopUpClient';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Top Up Game Termurah | NexaPay',
  description: 'Top up game favoritmu dengan harga termurah dan proses tercepat di NexaPay.',
};

export default async function TopUpPage() {
  const gamesFromDb = await prisma.product.findMany({
    where: {
      isActive: true,
      category: 'GAME_TOPUP',
    },
    include: {
      denominations: {
        where: { isActive: true },
        select: { price: true, isFlashSale: true }
      }
    },
    orderBy: [
      { sortOrder: 'asc' },
      { name: 'asc' }
    ]
  });

  const validGameProducts = digitalProducts.filter((p) => p.category === 'GAME_TOPUP');
  const staticMap = new Map(validGameProducts.map((p) => [p.slug, p]));
  const validSlugs = new Set(validGameProducts.map((p) => p.slug));
  const filteredDbGames = gamesFromDb.filter((p) => validSlugs.has(p.slug));
  const dbSlugs = new Set(filteredDbGames.map((g) => g.slug));
  const missingFromDb = validGameProducts.filter((p) => !dbSlugs.has(p.slug));
  const combined = [...filteredDbGames, ...missingFromDb];

  const games = combined.map((g) => {
    const staticInfo = staticMap.get(g.slug);
    return {
      ...g,
      image: staticInfo?.image || g.image,
      bannerImage: staticInfo?.bannerImage || g.bannerImage || g.image,
      denominations: staticInfo?.denominations || g.denominations,
    };
  });

  return (
    <>
      <Navbar />
      <TopUpClient games={games} />
    </>
  );
}
