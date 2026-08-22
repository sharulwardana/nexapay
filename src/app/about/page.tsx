import Footer from '@/components/layout/Footer';
import prisma from '@/lib/prisma';
import AboutClient from './AboutClient';

export const metadata = {
  title: 'Tentang Kami',
  description: 'NexaPay adalah platform top-up game dan produk digital terpercaya di Indonesia.',
};

export default async function AboutPage() {
  let totalUsers = 0;
  let totalTransactions = 0;
  let totalProducts = 0;

  try {
    totalUsers = await prisma.user.count();
    totalTransactions = await prisma.transaction.count();
    totalProducts = await prisma.product.count();
  } catch (err) {
    console.warn('Database fallback in AboutPage:', err);
  }

  // Format stats
  const formatStat = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K+';
    return num.toString();
  };

  const realStats = [
    { value: totalUsers > 0 ? formatStat(totalUsers) : '10+', label: 'Pengguna Aktif', iconName: 'users' },
    { value: totalTransactions > 0 ? formatStat(totalTransactions) : '50+', label: 'Transaksi Sukses', iconName: 'award' },
    { value: totalProducts > 0 ? formatStat(totalProducts) : '10+', label: 'Game & Produk', iconName: 'globe' },
    { value: '99.9%', label: 'Uptime', iconName: 'shield' },
  ];

  return (
    <>
      <AboutClient stats={realStats} />
      <Footer />
    </>
  );
}
