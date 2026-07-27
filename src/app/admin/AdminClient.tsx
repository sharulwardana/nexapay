'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, Receipt, Megaphone, Image as ImageIcon, BarChart3,
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, UserPlus,
  ChevronRight, ArrowUpRight, ArrowDownRight, LogOut,
  Menu, X, Search, MoreHorizontal, Activity, Zap
} from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { signOut } from 'next-auth/react';

const sidebarItems = [
  { label: 'Ringkasan', href: '/admin', icon: LayoutDashboard },
  { label: 'Produk', href: '/admin/products', icon: Package },
  { label: 'Transaksi', href: '/admin/transactions', icon: Receipt },
  { label: 'Pelanggan', href: '/admin/users', icon: Users },
  { label: 'Promo & Voucher', href: '/admin/promos', icon: Megaphone },
  { label: 'Banner Hero', href: '/admin/banners', icon: ImageIcon },
  { label: 'Analitik', href: '/admin/analytics', icon: BarChart3 },
];

export default function AdminClient({ 
  stats, 
  recentTransactions, 
  salesData,
  topProducts,
  adminUser 
}: { 
  stats: any, 
  recentTransactions: any[], 
  salesData: any[],
  topProducts: any[],
  adminUser: any 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [chartMenuOpen, setChartMenuOpen] = useState(false);
  const router = useRouter();

  const statsCards = [
    { label: 'Total Pendapatan', value: stats.totalRevenue, change: 12.5, icon: DollarSign, color: 'from-violet-500 to-fuchsia-600', shadow: 'shadow-violet-500/20' },
    { label: 'Total Transaksi', value: stats.totalTransactions, change: 8.3, icon: ShoppingCart, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
    { label: 'Pengguna Terdaftar', value: stats.totalUsers, change: 15.2, icon: Users, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20' },
    { label: 'Pengguna Baru Hari Ini', value: stats.newUsersToday, change: -2.1, icon: UserPlus, color: 'from-orange-400 to-pink-500', shadow: 'shadow-orange-500/20' },
  ];
  
  const maxSale = Math.max(...salesData.map(d => d.value), 10000); // dynamic minimum scale

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-violet-500/30">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px]" />
      </div>

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 bg-[#0d0d0d] border-r border-white/10 transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) lg:translate-x-0 lg:static flex flex-col',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-heading font-black tracking-tight text-base">
              Nexa<span className="text-violet-400">Admin</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Profile Card AT TOP - Instant access, 0% cut off on mobile/iOS */}
        <div className="p-3 border-b border-white/10 bg-white/[0.02] flex-shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white shadow-lg flex-shrink-0">
              {adminUser?.name ? adminUser.name.charAt(0) : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{adminUser?.name || 'Administrator'}</p>
              <p className="text-[10px] text-white/40 truncate font-mono">{adminUser?.email || 'admin@nexapay.id'}</p>
            </div>
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0"
              title="Kembali ke Website Utama"
            >
              <Zap className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-1.5 rounded-lg hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
              title="Keluar Akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Menu Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto min-h-0 pb-16 lg:pb-4">
          <p className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 mt-2">Menu</p>
          {sidebarItems.map((item) => {
            const isActive = item.href === '/admin';
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden',
                  isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-violet-600/25 via-fuchsia-600/15 to-transparent border border-violet-500/30 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bar"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-violet-400 via-fuchsia-400 to-violet-500 rounded-r-full shadow-[0_0_12px_#c084fc]"
                  />
                )}
                <item.icon className={cn("w-4 h-4 relative z-10 transition-colors duration-300", isActive ? "text-violet-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" : "text-white/40 group-hover:text-white/70")} />
                <span className={cn("relative z-10 transition-colors", isActive ? "text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-white/50 group-hover:text-white")}>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-black/20 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold font-heading tracking-tight">Ringkasan</h1>
              <p className="text-xs text-white/40 mt-0.5">Selamat datang kembali, berikut statistik performa platform hari ini.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-none justify-end">
            <div className="relative group w-full sm:w-64 max-w-xs min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-violet-400 transition-colors pointer-events-none" />
              <input 
                type="text"
                placeholder="Cari transaksi, email..." 
                className="w-full pl-10 pr-12 py-2 sm:py-2.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:bg-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-white/30 truncate" 
              />
              <div className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/50 font-mono pointer-events-none">⌘K</div>
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {statsCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors duration-500 overflow-hidden"
                >
                  <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br", stat.color)} />
                  
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg', stat.color, stat.shadow)}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border',
                      stat.change >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                    )}>
                      {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(stat.change)}%
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-white/40 text-xs font-medium mb-1">{stat.label}</p>
                    <h3 className="text-2xl lg:text-3xl font-bold font-heading tracking-tight">
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
                          {tx.user?.email || (tx as any).userEmail || 'Anonymous'}
                        </td>
                        <td className="p-4 min-w-[160px]">
                          <p className="text-xs sm:text-sm font-bold text-white/90 whitespace-nowrap">
                            {tx.product?.name || ((tx as any).productName?.includes('Wallet') ? 'Isi Saldo Wallet' : (tx as any).productName) || 'Isi Saldo Wallet'}
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
      </div>
    </div>
  );
}
