import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/../auth';
import AnalyticsClient from './AnalyticsClient';

export const metadata = {
  title: 'Analitik & Laporan | NexaAdmin',
  description: 'Laporan keuangan dan performa penjualan NexaPay.',
};

export default async function AdminAnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Aggregate Total Revenue
  const totalRevenueResult = await prisma.transaction.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { totalAmount: true },
    _count: { id: true },
  });

  // Aggregate Payment Method Breakdown
  const paymentBreakdown = await prisma.transaction.groupBy({
    by: ['paymentMethod'],
    where: { status: 'COMPLETED' },
    _sum: { totalAmount: true },
    _count: { id: true },
    orderBy: { _sum: { totalAmount: 'desc' } },
  });

  return (
    <AnalyticsClient
      totalRevenue={totalRevenueResult._sum.totalAmount || 0}
      totalCompleted={totalRevenueResult._count.id || 0}
      paymentBreakdown={paymentBreakdown}
      adminUser={session.user}
    />
  );
}
