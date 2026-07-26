'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, Receipt, Megaphone, Image, BarChart3,
  DollarSign, CheckCircle, Clock, AlertCircle, Search, Filter,
  ChevronLeft, ChevronRight, LogOut, Menu, X, Zap, ArrowUpRight
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const sidebarItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Transactions', href: '/admin/transactions', icon: Receipt },
  { label: 'Customers', href: '/admin/users', icon: Users },
  { label: 'Campaigns', href: '/admin/promos', icon: Megaphone },
  { label: 'Banners', href: '/admin/banners', icon: Image },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  COMPLETED: { label: 'Selesai', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
  PENDING: { label: 'Menunggu', color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Clock },
  FAILED: { label: 'Gagal', color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertCircle },
  CANCELLED: { label: 'Dibatalkan', color: 'text-gray-400', bg: 'bg-gray-500/10', icon: AlertCircle },
};

export default function TransactionsClient({ transactions, stats, adminUser }: {
  transactions: any[];
  stats: { totalRevenue: number; totalCompleted: number; totalPending: number; totalAll: number };
  adminUser: any;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;

  const filtered = useMemo(() => {
    let result = transactions;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.invoiceId.toLowerCase().includes(q) ||
        t.user.name?.toLowerCase().includes(q) ||
        t.user.email?.toLowerCase().includes(q) ||
        t.product.name.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'ALL') {
      result = result.filter(t => t.status === statusFilter);
    }
    return result;
  }, [transactions, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

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
            const isActive = item.href === '/admin/transactions';
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 h-20 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex items-center px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black font-heading">Transaksi</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-white/40">{adminUser?.name || 'Admin'}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'from-violet-500 to-fuchsia-600' },
              { label: 'Total Transaksi', value: stats.totalAll.toString(), icon: Receipt, color: 'from-blue-500 to-cyan-500' },
              { label: 'Selesai', value: stats.totalCompleted.toString(), icon: CheckCircle, color: 'from-emerald-400 to-teal-500' },
              { label: 'Menunggu', value: stats.totalPending.toString(), icon: Clock, color: 'from-yellow-400 to-orange-500' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 overflow-hidden group hover:border-white/10 transition-all"
              >
                <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 bg-gradient-to-br', stat.color)} />
                <stat.icon className="w-5 h-5 text-white/30 mb-3" />
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-xs text-white/40 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col tablet:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Cari invoice, nama, email, produk..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap',
                    statusFilter === s
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10 hover:text-white/60'
                  )}
                >
                  {s === 'ALL' ? 'Semua' : statusConfig[s]?.label || s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Invoice</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Produk</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Total</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Pembayaran</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Tanggal</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((tx, i) => {
                    const sc = statusConfig[tx.status] || statusConfig.PENDING;
                    const StatusIcon = sc.icon;
                    return (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-violet-300">{tx.invoiceId}</span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-white/80 text-xs">{tx.user.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-white/30">{tx.user.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-white/80 text-xs">{tx.product.name}</p>
                          <p className="text-[10px] text-white/30">{tx.denomination.label}</p>
                        </td>
                        <td className="px-5 py-4 font-bold text-xs">{formatCurrency(tx.totalAmount)}</td>
                        <td className="px-5 py-4 text-xs text-white/50 uppercase">{tx.paymentMethod}</td>
                        <td className="px-5 py-4">
                          <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold', sc.bg, sc.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-white/40">{formatDate(tx.createdAt)}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {tx.status !== 'COMPLETED' && (
                              <button
                                onClick={async () => {
                                  const { updateTransactionStatus } = await import('@/actions/transaction');
                                  const { toast } = await import('sonner');
                                  const res = await updateTransactionStatus(tx.invoiceId, 'COMPLETED');
                                  if (res.success) toast.success(`Transaksi ${tx.invoiceId} diset Selesai!`);
                                  else toast.error('Gagal memperbarui status');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 active:scale-95 transition-all"
                              >
                                Selesai
                              </button>
                            )}
                            {tx.status !== 'FAILED' && (
                              <button
                                onClick={async () => {
                                  const { updateTransactionStatus } = await import('@/actions/transaction');
                                  const { toast } = await import('sonner');
                                  const res = await updateTransactionStatus(tx.invoiceId, 'FAILED');
                                  if (res.success) toast.success(`Transaksi ${tx.invoiceId} diset Gagal!`);
                                  else toast.error('Gagal memperbarui status');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold hover:bg-red-500/20 active:scale-95 transition-all"
                              >
                                Gagal
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {paginated.length === 0 && (
              <div className="text-center py-16">
                <Receipt className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/30">Belum ada transaksi.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/30">
                Menampilkan {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} dari {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-white/50 px-2">{currentPage}/{totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
