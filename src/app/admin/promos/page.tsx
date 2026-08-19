import prisma from '@/lib/prisma';
import PromosClient from './PromosClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Manajemen Promo | NexaAdmin',
  description: 'Kelola kode promo dan diskon NexaPay.',
};

export default async function AdminPromosPage() {
  try {
    const promos = await prisma.promo.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return <PromosClient promos={promos || []} />;
  } catch (error) {
    console.error('Failed to load admin promos:', error);
    return <PromosClient promos={[]} />;
  }
}
