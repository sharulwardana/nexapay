'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, CheckCircle, Clock, XCircle, RefreshCw, Receipt } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { formatCurrency, getStatusColor, getStatusLabel, cn } from '@/lib/utils';
import EmptyState from '@/components/shared/EmptyState';

interface TransactionHistoryItem {
  id: string;
  invoiceId: string;
  product: string;
  amount: number;
  payment: string;
  status: string;
  date: string;
}

const statusFilters = ['SEMUA', 'COMPLETED', 'PROCESSING', 'PENDING', 'FAILED', 'REFUNDED'];

export default function TransactionsClient({
  initialTransactions,
}: {
  initialTransactions: TransactionHistoryItem[];
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('SEMUA');

  const filtered = initialTransactions.filter((tx) => {
    const matchSearch =
      tx.product.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.invoiceId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'SEMUA' || tx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 aurora-bg">
        <div className="container-app max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg tablet:text-xl font-bold">Riwayat Transaksi</h1>
              <p className="text-xs text-muted-foreground">{initialTransactions.length} transaksi total</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-3 mb-6">
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
                    'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
                    statusFilter === s ? 'gradient-primary text-white font-bold' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {s === 'SEMUA' ? 'Semua' : getStatusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-2 tablet:space-y-3">
            {filtered.map((tx) => (
              <div key={tx.id}>
                <Link 
                  href={`/payment-status/${tx.invoiceId || tx.id}`} 
                  className="p-3.5 sm:p-4 glass-card hover:border-primary/30 transition-all block group rounded-2xl"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={cn('w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm', getStatusColor(tx.status))}>
                        {tx.status === 'COMPLETED' && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {tx.status === 'PROCESSING' && <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />}
                        {tx.status === 'PENDING' && <Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {tx.status === 'FAILED' && <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {tx.status === 'REFUNDED' && <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground font-heading leading-snug group-hover:text-primary transition-colors break-words">
                          {tx.product}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1 flex-wrap">
                          <span className="font-mono">{tx.payment}</span>
                          <span>•</span>
                          <span>{tx.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 flex flex-col items-end">
                      <span className="text-xs sm:text-sm font-bold font-mono text-foreground">
                        {formatCurrency(tx.amount)}
                      </span>
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold mt-1 shadow-sm border whitespace-nowrap',
                        tx.status === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                        tx.status === 'PENDING' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                        tx.status === 'PROCESSING' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' :
                        tx.status === 'REFUNDED' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                        'bg-red-500/15 text-red-400 border-red-500/30'
                      )}>
                        {getStatusLabel(tx.status)}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {filtered.length === 0 && (
              <EmptyState
                icon={Receipt}
                title="Tidak Ada Transaksi"
                description={search ? `Tidak ditemukan transaksi dengan kata kunci "${search}".` : "Belum ada transaksi pada status filter ini."}
                actionHref="/topup"
                actionLabel="Mulai Top Up Game"
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
