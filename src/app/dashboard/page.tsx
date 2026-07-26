import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import DashboardClient from './DashboardClient';
import { auth } from '@/../auth';

export const metadata = {
  title: 'Dashboard | NexaPay',
  description: 'Kelola akun dan lihat riwayat transaksi NexaPay kamu.',
};

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch real user data from DB
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      walletBalance: true,
      loyaltyPoints: true,
      createdAt: true,
    }
  });

  if (!dbUser) {
    redirect('/login');
  }

  // Fetch real transaction history
  const recentTransactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return <DashboardClient dbUser={dbUser} recentTransactions={recentTransactions} />;
}
