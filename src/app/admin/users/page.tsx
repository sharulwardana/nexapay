import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/../auth';
import UsersClient from './UsersClient';

export const metadata = {
  title: 'Manajemen Pelanggan | NexaAdmin',
  description: 'Kelola data pengguna dan role NexaPay.',
};

export default async function AdminUsersPage() {

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      walletBalance: true,
      loyaltyLevel: true,
      loyaltyPoints: true,
      createdAt: true,
      _count: {
        select: { transactions: true },
      },
    },
  });

  return <UsersClient users={users} />;
}
