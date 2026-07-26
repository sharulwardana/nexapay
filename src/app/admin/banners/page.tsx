import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/../auth';
import BannersClient from './BannersClient';

export const metadata = {
  title: 'Manajemen Banner | NexaAdmin',
  description: 'Kelola banner promo & slider NexaPay.',
};

export default async function AdminBannersPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return <BannersClient banners={banners} adminUser={session.user} />;
}
