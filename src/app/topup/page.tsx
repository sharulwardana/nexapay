import prisma from '@/lib/prisma';
import TopUpClient from './TopUpClient';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Top Up Game Termurah | NexaPay',
  description: 'Top up game favoritmu dengan harga termurah dan proses tercepat di NexaPay.',
};

export default async function TopUpPage() {
  const games = await prisma.product.findMany({
    where: { isActive: true },
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

  return (
    <>
      <Navbar />
      <TopUpClient games={games} />
    </>
  );
}
