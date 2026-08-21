import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import TopUpSlugClient from './TopUpSlugClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const game = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug }
  });
  if (!game) return { title: 'Not Found' };
  return {
    title: `Top Up ${game.name} Termurah | NexaPay`,
    description: game.description || `Top up ${game.name} dengan mudah dan cepat.`,
  };
}

import { digitalProducts } from '@/data/products';
import type { Product } from '@/types';

export default async function TopUpDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let game: Product | null = null;

  try {
    const dbGame = await prisma.product.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        denominations: {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        }
      }
    });
    if (dbGame) {
      game = dbGame as unknown as Product;
    }
  } catch (e) {
    console.error('Error fetching game from DB:', e);
  }

  // Always sync with static products for accurate denominations, images, and pricing
  const staticGame = digitalProducts.find(p => p.slug === resolvedParams.slug);
  if (staticGame) {
    game = {
      ...(game || {}),
      ...staticGame,
      denominations: staticGame.denominations,
    } as unknown as Product;
  }

  if (!game || game.isActive === false) {
    notFound();
  }

  return <TopUpSlugClient game={game} />;
}
