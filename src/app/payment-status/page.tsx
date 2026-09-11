import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Status Pembayaran — NexaPay',
  description: 'Cek status pesanan transaksi top up game di NexaPay.',
};

export default async function PaymentStatusIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ trxId?: string; id?: string; invoiceId?: string }>;
}) {
  const params = await searchParams;
  const targetId = params?.trxId || params?.id || params?.invoiceId;

  if (targetId) {
    redirect(`/payment-status/${encodeURIComponent(targetId)}`);
  }

  redirect('/track');
}
