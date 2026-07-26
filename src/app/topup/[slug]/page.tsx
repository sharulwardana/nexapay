import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import TopUpSlugClient from './TopUpSlugClient';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';

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

export default async function TopUpDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const game = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      denominations: {
        where: { isActive: true },
        orderBy: { price: 'asc' }
      }
    }
  });

  if (!game || !game.isActive) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <TopUpSlugClient game={game} />
      <MobileNav />
    </>
  );
}
