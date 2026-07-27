'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Receipt, Search, CheckCircle, Clock, XCircle, ArrowLeft, ChevronRight, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn, getStatusColor, getStatusLabel } from '@/lib/utils';

export interface TransactionItem {
  id: string;
  product: string;
  status: string;
  amount: number;
  payment: string;
  date: string;
}

const statusFilters = ['SEMUA', 'COMPLETED', 'PROCESSING', 'PENDING', 'FAILED', 'REFUNDED'];

export default function TransactionsClient({ initialTransactions }: { initialTransactions: TransactionItem[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('SEMUA');

  const filtered = initialTransactions.filter((tx) => {
    const matchSearch = !search || tx.product.toLowerCase().includes(search.toLowerCase()) || tx.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'SEMUA' || tx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-30 pb-24">
        <div className="container-app max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg tablet:text-xl font-bold">Riwayat Transaksi</h1>
              <p className="text-xs text-muted-foreground">{initialTransactions.length} transaksi total</p>
            </div>
          </motion.div>

          {/* Search & Filters */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari transaksi atau invoice..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {statusFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    statusFilter === s ? 'gradient-primary text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {s === 'SEMUA' ? 'Semua' : getStatusLabel(s)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Transactions List */}
          <div className="space-y-2 tablet:space-y-3">
            {filtered.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.03 }}
              >
                <Link href={`/payment-status/${tx.id}`} className="flex items-center gap-3 p-4 glass-card hover:border-primary/20 transition-all">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', getStatusColor(tx.status))}>
                    {tx.status === 'COMPLETED' && <CheckCircle className="w-5 h-5" />}
                    {tx.status === 'PROCESSING' && <Clock className="w-5 h-5 animate-pulse" />}
                    {tx.status === 'PENDING' && <Clock className="w-5 h-5" />}
                    {tx.status === 'FAILED' && <XCircle className="w-5 h-5" />}
                    {tx.status === 'REFUNDED' && <RefreshCw className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{tx.product}</p>
                    <p className="text-[10px] text-muted-foreground">{tx.id} • {tx.payment} • {tx.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold">{formatCurrency(tx.amount)}</p>
                    <p className={cn('text-[10px] font-medium', getStatusColor(tx.status).split(' ')[0])}>
                      {getStatusLabel(tx.status)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-base font-semibold mb-1">Tidak ada transaksi</h3>
              <p className="text-sm text-muted-foreground">Belum ada riwayat transaksi yang cocok.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
