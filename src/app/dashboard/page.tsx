'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User, Wallet, Receipt, Heart, Gift, Star, Settings, LogOut, Copy, ChevronRight,
  TrendingUp, Clock, CheckCircle, ArrowUpRight, Crown, Shield
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn } from '@/lib/utils';
import { LOYALTY_LEVELS } from '@/lib/constants';
import SpotlightCard from '@/components/shared/SpotlightCard';
import DailyCheckIn from '@/components/dashboard/DailyCheckIn';

const mockUser = {
  name: 'Ahmad Rizky',
  email: 'ahmad.rizky@email.com',
  avatar: null,
  walletBalance: 250000,
  loyaltyLevel: 'GOLD' as 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND',
  loyaltyPoints: 8500,
  referralCode: 'RIZKY2026',
  totalTransactions: 127,
  totalSpent: 4500000,
  memberSince: 'Jan 2025',
};

const recentTransactions = [
  { id: 'NXP-A1B2C3', product: 'Mobile Legends — 568 Diamonds', status: 'COMPLETED', amount: 140000, date: '2 jam lalu' },
  { id: 'NXP-D4E5F6', product: 'Genshin Impact — 330 Genesis Crystal', status: 'COMPLETED', amount: 79000, date: '1 hari lalu' },
  { id: 'NXP-G7H8I9', product: 'Pulsa Telkomsel 50.000', status: 'PROCESSING', amount: 50500, date: '1 hari lalu' },
  { id: 'NXP-J0K1L2', product: 'VALORANT — 420 VP', status: 'COMPLETED', amount: 49000, date: '3 hari lalu' },
  { id: 'NXP-M3N4O5', product: 'Steam Wallet Rp 90.000', status: 'COMPLETED', amount: 95000, date: '5 hari lalu' },
];

const quickActions = [
  { label: 'Riwayat', href: '/dashboard/transactions', icon: Receipt, color: 'from-violet-500 to-purple-600' },
  { label: 'Favorit', href: '/dashboard/favorites', icon: Heart, color: 'from-pink-500 to-rose-600' },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet, color: 'from-cyan-500 to-blue-600' },
  { label: 'Referral', href: '/dashboard/referral', icon: Gift, color: 'from-amber-500 to-orange-600' },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, color: 'from-gray-500 to-gray-600' },
];

export default function DashboardPage() {
  const loyalty = LOYALTY_LEVELS[mockUser.loyaltyLevel];
  const nextLevel = mockUser.loyaltyLevel === 'DIAMOND' ? null :
    Object.entries(LOYALTY_LEVELS).find(([, v]) => v.minPoints > mockUser.loyaltyPoints)?.[1];
  const progress = nextLevel
    ? ((mockUser.loyaltyPoints - loyalty.minPoints) / (nextLevel.minPoints - loyalty.minPoints)) * 100
    : 100;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 tablet:pt-24 pb-24">
        <div className="container-app max-w-5xl">
          {/* Top Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <SpotlightCard className="h-full p-5 tablet:p-6 bg-card border-border" spotlightColor="rgba(255, 255, 255, 0.05)">
                <div className="flex flex-col tablet:flex-row items-start tablet:items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white font-heading shadow-inner">
                    {mockUser.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-lg tablet:text-xl font-bold font-heading">{mockUser.name}</h1>
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm" style={{ backgroundColor: `${loyalty.color}15`, color: loyalty.color, border: `1px solid ${loyalty.color}30` }}>
                        <Crown className="w-3 h-3" />
                        {loyalty.name}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Member sejak {mockUser.memberSince}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="p-2.5 rounded-xl border border-border hover:bg-muted transition-all"
                  >
                    <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </Link>
                </div>

                {/* Loyalty Progress */}
                <div className="mt-6 p-4 rounded-xl bg-surface border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-foreground">{mockUser.loyaltyPoints.toLocaleString('id-ID')} <span className="font-normal text-muted-foreground">NexaPoints</span></span>
                    </div>
                    {nextLevel && (
                      <span className="text-xs font-medium text-muted-foreground">
                        Target: {nextLevel.minPoints.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                      className="absolute top-0 left-0 h-full rounded-full bg-primary"
                    />
                  </div>
                  {nextLevel && (
                    <p className="text-[11px] text-muted-foreground mt-2">
                      <strong className="text-foreground">{(nextLevel.minPoints - mockUser.loyaltyPoints).toLocaleString('id-ID')} poin</strong> lagi untuk naik ke tier <strong className="text-foreground">{nextLevel.name}</strong> • Diskon {nextLevel.discount}%
                    </p>
                  )}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Daily Reward Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <SpotlightCard className="h-full p-5 tablet:p-6 bg-card border-border flex flex-col justify-center" spotlightColor="rgba(255, 255, 255, 0.05)">
                <DailyCheckIn />
              </SpotlightCard>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 tablet:gap-4 mb-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="solid-card p-4 tablet:p-5 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <p className="text-base tablet:text-lg font-bold font-heading">{formatCurrency(mockUser.walletBalance)}</p>
              <p className="text-[11px] text-muted-foreground">Saldo Wallet</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="solid-card p-4 tablet:p-5 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center mb-2">
                <Receipt className="w-5 h-5 text-cyan-500" />
              </div>
              <p className="text-base tablet:text-lg font-bold font-heading">{mockUser.totalTransactions}</p>
              <p className="text-[11px] text-muted-foreground">Total Transaksi</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="solid-card p-4 tablet:p-5 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-base tablet:text-lg font-bold font-heading">{formatCurrency(mockUser.totalSpent)}</p>
              <p className="text-[11px] text-muted-foreground">Total Belanja</p>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-5 gap-2 tablet:gap-3 mb-6">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-muted/30 transition-all group"
              >
                <div className={cn('w-10 h-10 tablet:w-12 tablet:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', action.color)}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] tablet:text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  {action.label}
                </span>
              </Link>
            ))}
          </motion.div>

          {/* Referral Code */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-4 mb-6 bg-gradient-to-r from-primary/5 to-accent/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Kode Referral Kamu</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono gradient-text">{mockUser.referralCode}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(mockUser.referralCode)}
                    className="p-1.5 rounded-lg hover:bg-muted/50 transition-all"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Ajak teman & dapatkan Rp 10.000</p>
              </div>
              <Gift className="w-8 h-8 text-primary/30" />
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-sm font-semibold">Transaksi Terakhir</h2>
              <Link href="/dashboard/transactions" className="text-xs text-primary hover:underline flex items-center gap-1">
                Lihat Semua <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentTransactions.map((tx) => (
                <Link
                  key={tx.id}
                  href={`/payment-status/${tx.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    tx.status === 'COMPLETED' ? 'bg-green-500/10' : 'bg-blue-500/10'
                  )}>
                    {tx.status === 'COMPLETED' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{tx.product}</p>
                    <p className="text-[10px] text-muted-foreground">{tx.id} • {tx.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold">{formatCurrency(tx.amount)}</p>
                    <p className={cn(
                      'text-[10px] font-medium',
                      tx.status === 'COMPLETED' ? 'text-green-500' : 'text-blue-500'
                    )}>
                      {tx.status === 'COMPLETED' ? 'Selesai' : 'Diproses'}
                    </p>
                  </div>
                </Link>
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
