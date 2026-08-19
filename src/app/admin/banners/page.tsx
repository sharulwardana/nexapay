import prisma from '@/lib/prisma';
import BannersClient from './BannersClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Manajemen Banner | NexaAdmin',
  description: 'Kelola banner promo & slider NexaPay.',
};

export default async function AdminBannersPage() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return <BannersClient banners={banners || []} />;
  } catch (error) {
    console.error('Failed to load admin banners:', error);
    return <BannersClient banners={[]} />;
  }
}
