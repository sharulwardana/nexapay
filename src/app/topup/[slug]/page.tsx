import { notFound } from 'next/navigation';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import TopUpSlugClient from './TopUpSlugClient';
import { digitalProducts } from '@/data/products';
import type { Product } from '@/types';

// React cache() deduplicates the query so generateMetadata and TopUpDetailPage execute it only once per request
const getGameData = cache(async (slug: string): Promise<Product | null> => {
  const staticGame = digitalProducts.find((p) => p.slug === slug);

  let dbGame: any = null;
  try {
    dbGame = await prisma.product.findUnique({
      where: { slug },
      include: {
        denominations: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
      },
    });
  } catch {
    // If DB is offline or slow, fallback seamlessly to in-memory static game data
  }

  if (!dbGame && !staticGame) return null;

  const resolved = {
    ...(dbGame || {}),
    ...(staticGame || {}),
    denominations: (staticGame?.denominations && staticGame.denominations.length > 0)
      ? staticGame.denominations
      : (dbGame?.denominations || []),
  } as unknown as Product;

  return resolved;
});

// Incremental Static Regeneration: Cache rendered pages on the server for 2 minutes
export const revalidate = 120;

// Pre-render top-up game pages at build time so TTFB is near-instant (< 50ms)
export async function generateStaticParams() {
  return digitalProducts
    .filter((p) => p.category === 'GAME_TOPUP')
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const game = await getGameData(resolvedParams.slug);
  const gameName = game?.name || resolvedParams.slug;

  return {
    title: `Top Up ${gameName} Termurah | NexaPay`,
    description: `Top up ${gameName} dengan mudah, aman, dan instan di NexaPay.`,
  };
}

export default async function TopUpDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const game = await getGameData(resolvedParams.slug);

  if (!game || game.isActive === false) {
    notFound();
  }

  return <TopUpSlugClient game={game} />;
}
