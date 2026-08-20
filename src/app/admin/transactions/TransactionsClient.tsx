'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  DollarSign, CheckCircle, Clock, AlertCircle, Search, Filter,
  ChevronLeft, ChevronRight, ArrowUpRight, Receipt, Download, FileSpreadsheet
} from 'lucide-react';
import { cn, formatCurrency, formatPaymentMethod } from '@/lib/utils';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  COMPLETED: { label: 'Selesai', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
  PENDING: { label: 'Menunggu', color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Clock },
  FAILED: { label: 'Gagal', color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertCircle },
  CANCELLED: { label: 'Dibatalkan', color: 'text-gray-400', bg: 'bg-gray-500/10', icon: AlertCircle },
};

type TransactionItem = {
  id: string;
  invoiceId: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string | Date;
  user: { name: string | null; email: string | null; image?: string | null };
  product?: { name: string } | null;
  productName?: string | null;
  denomination?: { label: string } | null;
};

export default function TransactionsClient({ transactions, stats }: {
  transactions: TransactionItem[];
  stats: { totalRevenue: number; totalCompleted: number; totalPending: number; totalAll: number };
}) {
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
        t.product?.name?.toLowerCase().includes(q) ||
        t.productName?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'ALL') {
      result = result.filter(t => t.status === statusFilter);
    }
    return result;
  }, [transactions, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    if (!filtered || filtered.length === 0) {
      toast.error('Tidak ada data transaksi untuk diekspor.');
      return;
    }

    const headers = [
      'No. Invoice',
      'Waktu Transaksi',
      'Email Pelanggan',
      'Nama Pelanggan',
      'Produk Game',
      'Denominasi',
      'Metode Pembayaran',
      'Total Harga (IDR)',
      'Status',
    ];

    const rows = filtered.map((tx) => [
      `"${tx.invoiceId || tx.id}"`,
      `"${new Date(tx.createdAt).toLocaleString('id-ID')}"`,
      `"${tx.user?.email || 'Guest'}"`,
      `"${tx.user?.name || '-'}"`,
      `"${tx.product?.name || tx.productName || 'Top Up'}"`,
      `"${tx.denomination?.label || '-'}"`,
      `"${formatPaymentMethod(tx.paymentMethod)}"`,
      tx.totalAmount,
      `"${tx.status}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Laporan_Transaksi_NexaPay_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Laporan ${filtered.length} transaksi berhasil diunduh!`);
  };

  return (
    <>
        <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold font-heading tracking-tight truncate">Riwayat Transaksi</h1>
            </div>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition-all active:scale-95 shadow-sm hover:shadow-emerald-500/10 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Unduh Laporan (Excel / CSV)</span>
            <span className="sm:hidden">Unduh CSV</span>
          </button>
        </header>

        {/* Content */}
        <motion.main
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-6 space-y-6 overflow-y-auto"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 mobile-l:grid-cols-2 laptop-l:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Total Omset', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'from-violet-500 to-fuchsia-600' },
              { label: 'Total Transaksi', value: stats.totalAll.toString(), icon: Receipt, color: 'from-blue-500 to-cyan-500' },
              { label: 'Selesai', value: stats.totalCompleted.toString(), icon: CheckCircle, color: 'from-emerald-400 to-teal-500' },
              { label: 'Menunggu', value: stats.totalPending.toString(), icon: Clock, color: 'from-yellow-400 to-orange-500' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5 overflow-hidden group hover:border-white/10 transition-all min-w-0"
              >
                <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 bg-gradient-to-br', stat.color)} />
                <stat.icon className="w-5 h-5 text-white/30 mb-3" />
                <p className="text-lg mobile-m:text-xl tablet:text-2xl laptop-l:text-3xl font-black truncate">{stat.value}</p>
                <p className="text-xs text-white/40 mt-1 truncate">{stat.label}</p>
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
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
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
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[850px] text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">No. Invoice</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Pelanggan</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Produk</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Total Harga</th>
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
                          <p className="font-medium text-white/80 text-xs">{tx.user?.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-white/30">{tx.user?.email || '-'}</p>
                        </td>
                        <td className="px-5 py-4 min-w-[170px]">
                          <p className="font-bold text-white/90 text-xs whitespace-nowrap">
                            {tx.product?.name || (tx.productName?.includes('Wallet') ? 'Isi Saldo Wallet' : tx.productName) || 'Isi Saldo Wallet'}
                          </p>
                          <p className="text-[10px] text-white/40 whitespace-nowrap">
                            {tx.denomination?.label || 'Direct Wallet'}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-bold text-xs">{formatCurrency(tx.totalAmount)}</td>
                        <td className="px-5 py-4 text-xs text-white/50">{formatPaymentMethod(tx.paymentMethod)}</td>
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
        </motion.main>
    </>
  );
}
