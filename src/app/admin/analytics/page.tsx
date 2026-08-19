import prisma from '@/lib/prisma';
import AnalyticsClient from './AnalyticsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Analitik & Laporan | NexaAdmin',
  description: 'Laporan keuangan dan performa penjualan NexaPay.',
};

export default async function AdminAnalyticsPage() {
  try {
    // Aggregate Total Revenue
    const totalRevenueResult = await prisma.transaction.aggregate({
      where: { status: { in: ['COMPLETED', 'PAID'] } },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    // Aggregate Payment Method Breakdown
    const paymentBreakdown = await prisma.transaction.groupBy({
      by: ['paymentMethod'],
      where: { status: { in: ['COMPLETED', 'PAID'] } },
      _sum: { totalAmount: true },
      _count: { id: true },
      orderBy: { _sum: { totalAmount: 'desc' } },
    });

    return (
      <AnalyticsClient
        totalRevenue={totalRevenueResult._sum?.totalAmount || 0}
        totalCompleted={(totalRevenueResult._count as { id?: number } | null)?.id || 0}
        paymentBreakdown={paymentBreakdown || []}
      />
    );
  } catch (error) {
    console.error('Failed to load admin analytics:', error);
    return (
      <AnalyticsClient
        totalRevenue={0}
        totalCompleted={0}
        paymentBreakdown={[]}
      />
    );
  }
}
