import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/../auth';
import PromosClient from './PromosClient';

export const metadata = {
  title: 'Manajemen Promo | NexaAdmin',
  description: 'Kelola kode promo dan diskon NexaPay.',
};

export default async function AdminPromosPage() {

  const promos = await prisma.promo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <PromosClient promos={promos} />;
}
