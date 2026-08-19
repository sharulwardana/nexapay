import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import AdminClient from './AdminClient';
import { auth } from '@/../auth';

export const metadata = {
  title: 'Admin Dashboard | NexaPay',
  description: 'NexaPay Admin CMS.',
};

export default async function AdminPage() {

  // Run all database queries in parallel for maximum speed
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, newUsersToday, totalTransactions, revenueResult, recentTransactions] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.transaction.count(),
    prisma.transaction.aggregate({
      where: { status: { in: ['COMPLETED', 'PAID'] } },
      _sum: { totalAmount: true },
    }),
    prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { email: true } },
        product: { select: { name: true } },
        denomination: { select: { label: true } },
      },
    }),
  ]);

  const stats = {
    totalUsers,
    newUsersToday,
    totalTransactions,
    totalRevenue: revenueResult._sum?.totalAmount || 0,
  };

  // Sales Data (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentTxsForChart = await prisma.transaction.findMany({
    where: {
      status: { in: ['COMPLETED', 'PAID'] },
      OR: [
        { createdAt: { gte: sevenDaysAgo } },
        { updatedAt: { gte: sevenDaysAgo } }
      ]
    },
    select: { totalAmount: true, createdAt: true, updatedAt: true, paidAt: true }
  });

  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const salesMap = new Map();
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    salesMap.set(d.toDateString(), { day: days[d.getDay()], value: 0 });
  }

  for (const tx of recentTxsForChart) {
    const txDate = tx.paidAt || tx.updatedAt || tx.createdAt;
    const dString = new Date(txDate).toDateString();
    if (salesMap.has(dString)) {
      salesMap.get(dString).value += tx.totalAmount;
    }
  }

  const salesData = Array.from(salesMap.values());

  // Top Products (Game & Digital Products Only)
  const topProductsRaw = await prisma.transaction.groupBy({
    by: ['productId'],
    where: {
      status: { in: ['COMPLETED', 'PAID'] },
      productId: { not: null }
    },
    _sum: { totalAmount: true },
    _count: { id: true },
    orderBy: {
      _sum: { totalAmount: 'desc' }
    },
    take: 5
  });

  // Fetch product names
  const productIds = topProductsRaw.map(p => p.productId).filter((id): id is string => Boolean(id));
  const productsData = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true }
  });
  const productMap = new Map(productsData.map(p => [p.id, p.name]));

  const topProducts = topProductsRaw.map((p) => ({
    name: p.productId ? (productMap.get(p.productId) || 'Produk Digital') : 'Isi Saldo Wallet NexaPay',
    revenue: p._sum?.totalAmount || 0,
    count: (p._count as { id?: number } | null)?.id ?? 0,
    growth: 0
  }));

  return (
    <AdminClient 
      stats={stats} 
      recentTransactions={recentTransactions} 
      salesData={salesData}
      topProducts={topProducts}
    />
  );
}
