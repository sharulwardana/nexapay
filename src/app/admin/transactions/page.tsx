import prisma from '@/lib/prisma';
import TransactionsClient from './TransactionsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Transaksi | NexaAdmin',
  description: 'Monitor semua transaksi NexaPay.',
};

export default async function AdminTransactionsPage() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: { name: true, email: true, image: true }
        },
        product: {
          select: { name: true, slug: true, category: true }
        },
        denomination: {
          select: { label: true, value: true }
        },
      },
    });

    const totalRevenue = transactions
      .filter(t => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    const totalCompleted = transactions.filter(t => t.status === 'COMPLETED').length;
    const totalPending = transactions.filter(t => t.status === 'PENDING').length;

    return (
      <TransactionsClient
        transactions={transactions || []}
        stats={{ totalRevenue, totalCompleted, totalPending, totalAll: transactions?.length || 0 }}
      />
    );
  } catch (error) {
    console.error('Failed to load admin transactions:', error);
    return (
      <TransactionsClient
        transactions={[]}
        stats={{ totalRevenue: 0, totalCompleted: 0, totalPending: 0, totalAll: 0 }}
      />
    );
  }
}
