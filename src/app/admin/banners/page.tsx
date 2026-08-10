import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/../auth';
import BannersClient from './BannersClient';

export const metadata = {
  title: 'Manajemen Banner | NexaAdmin',
  description: 'Kelola banner promo & slider NexaPay.',
};

export default async function AdminBannersPage() {

  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return <BannersClient banners={banners} />;
}
