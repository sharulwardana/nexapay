import { redirect } from 'next/navigation';
import { auth } from '@/../auth';
import prisma from '@/lib/prisma';
import TransactionsClient from './TransactionsClient';

export const metadata = {
  title: 'Riwayat Transaksi | NexaPay',
  description: 'Daftar riwayat transaksi top up dan produk digital kamu di NexaPay.',
};

export default async function TransactionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch real transaction history from DB for the logged-in user
  const rawTransactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    include: {
      product: { select: { name: true } },
      denomination: { select: { label: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  const transactions = rawTransactions.map((tx) => ({
    id: tx.id,
    invoiceId: tx.invoiceId || tx.id,
    product: tx.product?.name ? `${tx.product.name} — ${tx.denomination?.label || ''}` : `Transaksi ${tx.invoiceId}`,
    status: tx.status,
    amount: tx.totalAmount,
    payment: tx.paymentMethod,
    date: new Date(tx.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
  }));

  return <TransactionsClient initialTransactions={transactions} />;
}
