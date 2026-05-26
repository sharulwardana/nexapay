'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Plus, ArrowUpRight, ArrowDownLeft, Clock, CreditCard, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn } from '@/lib/utils';

const walletHistory = [
  { id: 'w1', type: 'topup', description: 'Top Up Wallet via GoPay', amount: 100000, date: '25 Mei 2026, 09:00', status: 'completed' },
  { id: 'w2', type: 'purchase', description: 'Pembelian ML 568 Diamonds', amount: -140000, date: '25 Mei 2026, 10:30', status: 'completed' },
  { id: 'w3', type: 'cashback', description: 'Cashback QRIS 10%', amount: 14000, date: '25 Mei 2026, 10:31', status: 'completed' },
  { id: 'w4', type: 'refund', description: 'Refund Genshin Impact', amount: 79000, date: '24 Mei 2026, 15:00', status: 'completed' },
  { id: 'w5', type: 'topup', description: 'Top Up Wallet via BCA VA', amount: 500000, date: '22 Mei 2026, 12:00', status: 'completed' },
  { id: 'w6', type: 'purchase', description: 'Pembelian Pulsa Telkomsel 50K', amount: -50500, date: '21 Mei 2026, 08:00', status: 'completed' },
  { id: 'w7', type: 'referral', description: 'Bonus Referral — Diana bergabung', amount: 10000, date: '20 Mei 2026, 14:30', status: 'completed' },
];

export default function WalletPage() {
  const balance = 250000;
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL' ? walletHistory : walletHistory.filter((h) => h.type === filter.toLowerCase());

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 tablet:pt-24 pb-24">
        <div className="container-app max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg tablet:text-xl font-bold">Wallet</h1>
          </motion.div>

          {/* Balance Card */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="glass-card p-6 tablet:p-8 gradient-primary text-white rounded-2xl mb-6 relative overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute -right-4 bottom-4 w-20 h-20 rounded-full bg-white/5" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-white/70" />
                <span className="text-sm text-white/70">Saldo NexaPay</span>
              </div>
              <p className="text-3xl tablet:text-4xl font-bold font-heading mb-6">{formatCurrency(balance)}</p>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-white/90 transition-colors">
                  <Plus className="w-4 h-4" /> Top Up
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 text-white text-sm font-semibold hover:bg-white/30 transition-colors">
                  <ArrowUpRight className="w-4 h-4" /> Transfer
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex gap-2 overflow-x-auto no-scrollbar mb-4"
          >
            {['ALL', 'TOPUP', 'PURCHASE', 'CASHBACK', 'REFUND', 'REFERRAL'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  filter === f ? 'gradient-primary text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                {f === 'ALL' ? 'Semua' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </motion.div>

          {/* History */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-semibold">Riwayat Wallet</h2>
            </div>
            <div className="divide-y divide-border">
              {filtered.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    item.amount > 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                  )}>
                    {item.amount > 0 ? (
                      <ArrowDownLeft className={cn('w-5 h-5', 'text-green-500')} />
                    ) : (
                      <ArrowUpRight className={cn('w-5 h-5', 'text-red-500')} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.description}</p>
                    <p className="text-[10px] text-muted-foreground">{item.date}</p>
                  </div>
                  <span className={cn('text-sm font-bold', item.amount > 0 ? 'text-green-500' : 'text-red-500')}>
                    {item.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(item.amount))}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
