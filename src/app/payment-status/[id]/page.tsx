import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PaymentStatusClient from './PaymentStatusClient';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Status Pembayaran ${resolvedParams.id} | NexaPay`,
  };
}

export default async function PaymentStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const txId = resolvedParams.id;

  const transaction = await prisma.transaction.findUnique({
    where: { invoiceId: txId },
    include: {
      product: true,
      denomination: true,
    },
  });

  if (!transaction) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <PaymentStatusClient
        txId={txId}
        productName={transaction.product.name}
        denomLabel={transaction.denomination.label}
        totalAmount={transaction.totalAmount}
        paymentMethod={transaction.paymentMethod}
        gameUserId={transaction.gameUserId || '-'}
        gameServerId={transaction.gameServerId || ''}
        status={transaction.status}
        expiresAt={transaction.expiresAt?.toISOString() || null}
      />
      <MobileNav />
    </>
  );
}

