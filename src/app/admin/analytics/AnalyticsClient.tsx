'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, Receipt, Megaphone, Image as ImageIcon, BarChart3,
  TrendingUp, DollarSign, ShoppingCart, CreditCard, ShieldCheck, Zap, X, LogOut, Menu
} from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const sidebarItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Transactions', href: '/admin/transactions', icon: Receipt },
  { label: 'Customers', href: '/admin/users', icon: Users },
  { label: 'Campaigns', href: '/admin/promos', icon: Megaphone },
  { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export default function AnalyticsClient({
  totalRevenue,
  totalCompleted,
  paymentBreakdown,
  adminUser
}: {
  totalRevenue: number;
  totalCompleted: number;
  paymentBreakdown: any[];
  adminUser: any;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-violet-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px]" />
      </div>

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 bg-[#0d0d0d] border-r border-white/10 transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) lg:translate-x-0 lg:static flex flex-col',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
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

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto min-h-0 pb-16 lg:pb-4">
          <p className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 mt-2">Menu</p>
          {sidebarItems.map((item) => {
            const isActive = item.href === '/admin/analytics';
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden',
                  isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                {isActive && <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-white/10 rounded-xl" />}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-violet-400 rounded-r-full shadow-[0_0_10px_#a78bfa]" />}
                <item.icon className={cn("w-4 h-4 relative z-10", isActive ? "text-violet-400" : "text-white/40 group-hover:text-white/70")} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        <header className="sticky top-0 z-40 h-20 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex items-center px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black font-heading">Analitik & Performa Laporan</h1>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* High-Level Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 border border-violet-500/30 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-violet-300 uppercase tracking-widest">Total Gross Revenue</p>
                <div className="w-10 h-10 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-300 font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black font-heading tracking-tight text-white">{formatCurrency(totalRevenue)}</h2>
              <p className="text-xs text-white/50">Akumulasi total pendapatan berhasil diterima.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-3xl bg-gradient-to-br from-cyan-600/20 to-blue-600/10 border border-cyan-500/30 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Sukses Selesai</p>
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black font-heading tracking-tight text-white">{formatNumber(totalCompleted)} <span className="text-sm font-normal text-cyan-300/80">transaksi</span></h2>
              <p className="text-xs text-white/50">Pesanan telah berhasil terkirim ke akun pembeli.</p>
            </motion.div>
          </div>

          {/* Payment Method Distribution */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="font-bold text-base text-white">Distribusi Metode Pembayaran</h3>
                <p className="text-xs text-white/40">Perbandingan perolehan pendapatan berdasarkan saluran pembayaran pembeli.</p>
              </div>
              <CreditCard className="w-5 h-5 text-violet-400" />
            </div>

            <div className="space-y-3">
              {paymentBreakdown.map((pm, index) => {
                const percent = totalRevenue > 0 ? Math.round(((pm._sum.totalAmount || 0) / totalRevenue) * 100) : 0;
                return (
                  <div key={pm.paymentMethod} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="uppercase text-white/80">{pm.paymentMethod}</span>
                      <span className="text-violet-300">{formatCurrency(pm._sum.totalAmount || 0)} ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-1000"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
