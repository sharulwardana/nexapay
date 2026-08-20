'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, ShoppingCart, Users, UserPlus,
  ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import { cn, formatCurrency, formatNumber, triggerHaptic } from '@/lib/utils';

export default function AdminClient({ 
  stats, 
  recentTransactions, 
  salesData,
  topProducts,
}: { 
  stats: { totalRevenue: number; totalTransactions: number; totalUsers: number; newUsersToday: number }, 
  recentTransactions: {
    id: string;
    invoiceId: string;
    productName: string;
    totalAmount: number;
    status: string;
    createdAt: string | Date;
    user?: { email: string | null } | null;
    product?: { name: string } | null;
    denomination?: { label: string } | null;
    [key: string]: unknown;
  }[], 
  salesData: { day: string; value: number }[],
  topProducts: { name: string; revenue: number; count: number; growth: number }[],
}) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [chartMenuOpen, setChartMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  // Feature 2: Real-time Auto-Refresh Stats (every 15 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      router.refresh();
      setTimeout(() => setIsRefreshing(false), 800);
    }, 15000);

    return () => clearInterval(interval);
  }, [router]);

  const handleManualRefresh = () => {
    triggerHaptic('medium');
    setIsRefreshing(true);
    router.refresh();
    toast.success('Memperbarui statistik real-time...');
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const statsCards = [
    { label: 'Total Pendapatan', value: stats.totalRevenue, change: 12.5, icon: DollarSign, color: 'from-violet-500 to-fuchsia-600', shadow: 'shadow-violet-500/20' },
    { label: 'Total Transaksi', value: stats.totalTransactions, change: 8.3, icon: ShoppingCart, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
    { label: 'Pengguna Terdaftar', value: stats.totalUsers, change: 15.2, icon: Users, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20' },
    { label: 'Pengguna Baru Hari Ini', value: stats.newUsersToday, change: -2.1, icon: UserPlus, color: 'from-orange-400 to-pink-500', shadow: 'shadow-orange-500/20' },
  ];
  
  const maxSale = Math.max(...salesData.map(d => d.value), 10000);

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 h-20 bg-black/20 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="block">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading tracking-tight">Ringkasan</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>
            <p className="text-xs text-white/40 mt-0.5">Selamat datang kembali, berikut statistik performa platform hari ini.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white/80 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            title="Refresh Data Live"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-violet-400", isRefreshing && "animate-spin")} />
            <span className="hidden sm:inline">Refresh Live</span>
          </button>
        </div>
      </header>

        {/* Dashboard Grid (Bento Box) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto custom-scrollbar"
        >
          <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 laptop-l:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
              {statsCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group p-3.5 sm:p-5 laptop-l:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors duration-500 overflow-hidden"
                >
                  <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br", stat.color)} />
                  
                  <div className="flex items-start justify-between mb-3 sm:mb-4 relative z-10">
                    <div className={cn('w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg', stat.color, stat.shadow)}>
                      <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border',
                      stat.change >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                    )}>
                      {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(stat.change)}%
                    </div>
                  </div>
                  
                  <div className="relative z-10 min-w-0">
                    <p className="text-white/40 text-xs font-medium mb-1 truncate">{stat.label}</p>
                    <h3 className="text-lg mobile-m:text-xl tablet:text-2xl laptop-l:text-3xl font-bold font-heading tracking-tight truncate">
                      {stat.label.includes('Pendapatan') ? formatCurrency(stat.value) : formatNumber(stat.value)}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Middle Section: Chart & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Sales Chart (Interactive Framer Motion) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                className="lg:col-span-2 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4 relative z-30">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Grafik Pendapatan</h3>
                    <p className="text-[11px] sm:text-xs text-white/40 mt-0.5">Performa 7 hari terakhir</p>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setChartMenuOpen(!chartMenuOpen)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors active:scale-95 cursor-pointer"
                      title="Opsi Grafik"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {chartMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          className="absolute right-0 mt-2 w-48 rounded-xl bg-[#141414] border border-white/10 shadow-2xl p-1.5 z-50 space-y-1 text-xs"
                        >
                          <button
                            onClick={() => {
                              setChartMenuOpen(false);
                              router.push('/admin/analytics');
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-between transition-colors"
                          >
                            <span>Analitik Lengkap</span>
                            <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
                          </button>

                          <button
                            onClick={() => {
                              setChartMenuOpen(false);
                              router.refresh();
                              toast.success('Data grafik diperbarui!');
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-between transition-colors"
                          >
                            <span>Refresh Data</span>
                            <Activity className="w-3.5 h-3.5 text-emerald-400" />
                          </button>

                          <button
                            onClick={() => {
                              setChartMenuOpen(false);
                              const csvContent = 'data:text/csv;charset=utf-8,Hari,Pendapatan\n' + salesData.map(e => `${e.day},${e.value}`).join('\n');
                              const encodedUri = encodeURI(csvContent);
                              const link = document.createElement('a');
                              link.setAttribute('href', encodedUri);
                              link.setAttribute('download', 'laporan_pendapatan_7hari.csv');
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              toast.success('Laporan CSV berhasil diunduh!');
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-between transition-colors"
                          >
                            <span>Unduh Laporan (CSV)</span>
                            <Zap className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="flex-1 flex gap-3 min-h-[200px] sm:min-h-[220px] pt-4">
                  {/* Dedicated Y-Axis Column on Left */}
                  <div className="flex flex-col justify-between pb-6 text-right w-16 sm:w-20 flex-shrink-0 select-none pointer-events-none pr-2">
                    {[1, 0.75, 0.5, 0.25, 0].map((step, i) => (
                      <span key={i} className="text-[10px] text-white/30 font-mono leading-none">
                        {formatCurrency(maxSale * step)}
                      </span>
                    ))}
                  </div>

                  {/* Main Chart Grid & Bars Container */}
                  <div className="flex-1 relative flex flex-col justify-between min-w-0">
                    {/* Horizontal Grid Lines */}
                    <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                      {[1, 0.75, 0.5, 0.25, 0].map((_, i) => (
                        <div key={i} className="w-full border-b border-white/5" />
                      ))}
                    </div>

                    {/* Bars & Day Labels */}
                    <div className="flex-1 flex items-end gap-1.5 sm:gap-3 relative z-10">
                      {salesData.map((d, i) => (
                        <div 
                          key={d.day} 
                          className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative group"
                          onMouseEnter={() => setHoveredBar(i)}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          {/* Tooltip */}
                          <AnimatePresence>
                            {hoveredBar === i && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                className="absolute -top-12 bg-black border border-white/10 rounded-lg py-1.5 px-3 shadow-xl whitespace-nowrap z-50 pointer-events-none"
                              >
                                <p className="text-[10px] text-white/50 mb-0.5">{d.day}</p>
                                <p className="text-xs font-bold text-white">{formatCurrency(d.value)}</p>
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-r border-b border-white/10 rotate-45" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="w-full flex-1 flex items-end justify-center rounded-t-xl overflow-hidden bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors relative">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.max((d.value / maxSale) * 100, d.value > 0 ? 8 : 2)}%` }}
                              transition={{ duration: 1, delay: 0.5 + i * 0.1, type: "spring", bounce: 0.2 }}
                              className={cn(
                                "w-full rounded-t-xl transition-all duration-300 relative",
                                hoveredBar === i 
                                  ? "bg-gradient-to-t from-violet-600 to-fuchsia-400 shadow-[0_0_15px_rgba(167,139,250,0.5)]" 
                                  : d.value > 0
                                    ? "bg-gradient-to-t from-violet-600 to-fuchsia-500 shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                                    : "bg-gradient-to-t from-white/5 to-white/10"
                              )}
                            >
                              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                          </div>
                          <span className={cn("text-[10px] font-bold transition-colors", hoveredBar === i || d.value > 0 ? "text-violet-300" : "text-white/40")}>
                            {d.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Top Products */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Produk Terlaris</h3>
                  <div className="p-1.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="space-y-4 flex-1">
                  {topProducts.map((product, i) => (
                    <div key={product.name} className="group cursor-default">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-xs font-black text-white/20 w-4 group-hover:text-violet-400 transition-colors flex-shrink-0">0{i + 1}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-bold text-white/90 group-hover:text-white transition-colors">{product.name}</p>
                            <p className="text-[10px] text-white/40">{formatNumber(product.count)} pesanan</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs sm:text-sm font-bold text-white/90">{formatCurrency(product.revenue)}</p>
                          <p className="text-[10px] text-emerald-400">+{product.growth}% <ArrowUpRight className="inline w-2.5 h-2.5" /></p>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${Math.max((product.revenue / (topProducts[0]?.revenue || 1)) * 100, 5)}%` }}
                          transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                  {topProducts.length === 0 && (
                    <div className="py-6 flex flex-col items-center justify-center text-white/30">
                      <Package className="w-8 h-8 mb-2 opacity-50 text-white/20" />
                      <p className="text-xs font-medium">Belum ada data penjualan.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Recent Transactions Table */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
              className="rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden"
            >
              <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-white/5 gap-3">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">Transaksi Terbaru</h3>
                  <p className="text-[11px] sm:text-xs text-white/40 mt-0.5 truncate">Pencatatan pesanan real-time</p>
                </div>
                <Link
                  href="/admin/transactions"
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-300 text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Lihat Semua</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full min-w-[700px] text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02]">
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5">No. Invoice</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5">Pelanggan</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5">Produk</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5 text-right">Total Harga</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5 text-center">Status</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5 text-right">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4 text-xs font-mono text-violet-300 group-hover:text-violet-400 transition-colors whitespace-nowrap">
                          {tx.invoiceId || tx.id}
                        </td>
                        <td className="p-4 text-sm font-medium text-white/90">
                          {tx.user?.email || 'Anonymous'}
                        </td>
                        <td className="p-4 min-w-[160px]">
                          <p className="text-xs sm:text-sm font-bold text-white/90 whitespace-nowrap">
                            {tx.product?.name || (tx.productName?.includes('Wallet') ? 'Isi Saldo Wallet' : tx.productName) || 'Isi Saldo Wallet'}
                          </p>
                          <p className="text-[10px] text-white/40 whitespace-nowrap">
                            {tx.denomination?.label || 'Direct Wallet'}
                          </p>
                        </td>
                        <td className="p-4 text-sm font-bold text-white text-right">{formatCurrency(tx.totalAmount)}</td>
                        <td className="p-4 text-center">
                          <span className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border',
                            tx.status === 'COMPLETED' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]',
                            tx.status === 'PROCESSING' && 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(96,165,250,0.1)]',
                            tx.status === 'PENDING' && 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]',
                            tx.status === 'FAILED' && 'bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-[0_0_10px_rgba(244,114,182,0.1)]'
                          )}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-white/40 font-mono text-right">
                          {new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          <span className="block text-[9px] mt-0.5">{new Date(tx.createdAt).toLocaleDateString('id-ID')}</span>
                        </td>
                      </tr>
                    ))}
                    {recentTransactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center">
                          <Receipt className="w-8 h-8 text-white/20 mx-auto mb-3" />
                          <p className="text-sm text-white/40">No transactions recorded yet.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
            
          </div>
        </motion.div>
    </>
  );
}
