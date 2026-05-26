'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Receipt, Search, Filter, CheckCircle, Clock, XCircle, ArrowLeft, ChevronRight, Download, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn, getStatusColor, getStatusLabel } from '@/lib/utils';

const transactions = [
  { id: 'NXP-X7K2M9', product: 'Mobile Legends — 568 Diamonds', status: 'COMPLETED', amount: 140000, payment: 'QRIS', date: '25 Mei 2026, 10:30' },
  { id: 'NXP-A1B2C3', product: 'Genshin Impact — Welkin Moon', status: 'COMPLETED', amount: 75000, payment: 'GoPay', date: '24 Mei 2026, 14:15' },
  { id: 'NXP-D4E5F6', product: 'Pulsa Telkomsel 50.000', status: 'PROCESSING', amount: 50500, payment: 'OVO', date: '24 Mei 2026, 09:20' },
  { id: 'NXP-G7H8I9', product: 'Token PLN 100.000', status: 'COMPLETED', amount: 101500, payment: 'BCA VA', date: '23 Mei 2026, 18:45' },
  { id: 'NXP-J0K1L2', product: 'VALORANT — 1375 VP', status: 'COMPLETED', amount: 149000, payment: 'DANA', date: '22 Mei 2026, 21:10' },
  { id: 'NXP-M3N4O5', product: 'Steam Wallet Rp 250.000', status: 'FAILED', amount: 260000, payment: 'BNI VA', date: '21 Mei 2026, 15:30' },
  { id: 'NXP-P6Q7R8', product: 'Free Fire — 520 Diamonds', status: 'COMPLETED', amount: 72000, payment: 'ShopeePay', date: '20 Mei 2026, 12:00' },
  { id: 'NXP-S9T0U1', product: 'Netflix Gift Card Rp 200.000', status: 'COMPLETED', amount: 205000, payment: 'QRIS', date: '19 Mei 2026, 08:30' },
  { id: 'NXP-V2W3X4', product: 'Paket Data Telkomsel 6GB', status: 'COMPLETED', amount: 45000, payment: 'GoPay', date: '18 Mei 2026, 16:20' },
  { id: 'NXP-Y5Z6A7', product: 'Google Play Rp 100.000', status: 'REFUNDED', amount: 103000, payment: 'OVO', date: '17 Mei 2026, 11:45' },
];

const statusFilters = ['SEMUA', 'COMPLETED', 'PROCESSING', 'PENDING', 'FAILED', 'REFUNDED'];

export default function TransactionHistoryPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('SEMUA');

  const filtered = transactions.filter((tx) => {
    const matchSearch = !search || tx.product.toLowerCase().includes(search.toLowerCase()) || tx.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'SEMUA' || tx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 tablet:pt-24 pb-24">
        <div className="container-app max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg tablet:text-xl font-bold">Riwayat Transaksi</h1>
              <p className="text-xs text-muted-foreground">{transactions.length} transaksi total</p>
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
              <p className="text-sm text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
