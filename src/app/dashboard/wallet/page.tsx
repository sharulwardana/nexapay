import { redirect } from 'next/navigation';
import { auth } from '@/../auth';
import prisma from '@/lib/prisma';
import WalletClient from './WalletClient';

export const metadata = {
  title: 'Wallet',
};

export default async function WalletPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch user to get real balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { walletBalance: true }
  });

  // Fetch real transaction history related to wallet
  let transactions: Array<{
    id: string;
    invoiceId: string;
    productId: string | null;
    notes: string | null;
    amount: number;
    totalAmount: number;
    createdAt: Date;
    status: string;
  }> = [];
  try {
    transactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  } catch (error) {
    console.error('Failed to fetch wallet transactions:', error);
  }

  // Map to the format expected by the client
  const history = transactions.map(t => ({
    id: t.id,
    type: t.productId === 'wallet-topup' ? 'topup' : 'purchase',
    description: t.productId === 'wallet-topup' ? t.notes || 'Top Up Wallet' : `Pembayaran Transaksi ${t.invoiceId}`,
    amount: t.productId === 'wallet-topup' ? t.amount : -t.totalAmount, // Negative for purchases
    date: t.createdAt.toISOString(),
    status: t.status.toLowerCase(),
  }));

  return (
    <WalletClient 
      initialBalance={user?.walletBalance || 0} 
      history={history} 
    />
  );
}
