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
  let dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      walletBalance: true,
      loyaltyPoints: true,
      referralCode: true,
      lastCheckIn: true,
      createdAt: true,
    }
  });

  if (!dbUser) {
    redirect('/login');
  }

  // Auto generate referralCode if null
  if (!dbUser.referralCode) {
    const randomCode = 'NXP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      dbUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode: randomCode },
        select: {
          id: true,
          name: true,
          email: true,
          walletBalance: true,
          loyaltyPoints: true,
          referralCode: true,
          lastCheckIn: true,
          createdAt: true,
        }
      });
    } catch {
      // fallback
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hasCheckInToday = dbUser.lastCheckIn ? new Date(dbUser.lastCheckIn) >= today : false;

  // Fetch real transaction history
  let recentTransactions: any[] = [];
  try {
    recentTransactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  } catch (error) {
    console.error('Failed to fetch recent transactions:', error);
  }

  return (
    <DashboardClient 
      dbUser={dbUser} 
      recentTransactions={recentTransactions}
      initialHasClaimed={hasCheckInToday}
    />
  );
}
