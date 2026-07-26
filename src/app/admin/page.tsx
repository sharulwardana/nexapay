import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import AdminClient from './AdminClient';
import { auth } from '@/../auth';

export const metadata = {
  title: 'Admin Dashboard | NexaPay',
  description: 'NexaPay Admin CMS.',
};

export default async function AdminPage() {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Aggregate stats
  const totalUsers = await prisma.user.count();
  
  // New users today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newUsersToday = await prisma.user.count({
    where: {
      createdAt: {
        gte: today,
      }
    }
  });

  const totalTransactions = await prisma.transaction.count();
  
  const revenueResult = await prisma.transaction.aggregate({
    where: {
      status: 'COMPLETED'
    },
    _sum: {
      totalAmount: true
    }
  });

  const stats = {
    totalUsers,
    newUsersToday,
    totalTransactions,
    totalRevenue: revenueResult._sum.totalAmount || 0,
  };

  const recentTransactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      user: {
        select: { email: true }
      },
      product: {
        select: { name: true }
      },
      denomination: {
        select: { label: true }
      }
    }
  });

  // Sales Data (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentTxsForChart = await prisma.transaction.findMany({
    where: {
      status: 'COMPLETED',
      createdAt: { gte: sevenDaysAgo }
    },
    select: { totalAmount: true, createdAt: true }
  });

  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const salesMap = new Map();
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    salesMap.set(d.toDateString(), { day: days[d.getDay()], value: 0 });
  }

  for (const tx of recentTxsForChart) {
    const dString = new Date(tx.createdAt).toDateString();
    if (salesMap.has(dString)) {
      salesMap.get(dString).value += tx.totalAmount;
    }
  }

  const salesData = Array.from(salesMap.values());

  // Top Products
  const topProductsRaw = await prisma.transaction.groupBy({
    by: ['productId'],
    where: { status: 'COMPLETED' },
    _sum: { totalAmount: true },
    _count: { id: true },
    orderBy: {
      _sum: { totalAmount: 'desc' }
    },
    take: 5
  });

  // Fetch product names
  const productIds = topProductsRaw.map(p => p.productId);
  const productsData = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true }
  });
  const productMap = new Map(productsData.map(p => [p.id, p.name]));

  const topProducts = topProductsRaw.map((p) => ({
    name: productMap.get(p.productId) || 'Unknown Product',
    revenue: p._sum.totalAmount || 0,
    count: p._count.id,
    growth: Math.floor(Math.random() * 30) + 1 // Dummy growth percentage for visual aesthetic
  }));

  return (
    <AdminClient 
      stats={stats} 
      recentTransactions={recentTransactions} 
      salesData={salesData}
      topProducts={topProducts}
      adminUser={session.user} 
    />
  );
}
