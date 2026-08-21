'use client';

import Link from 'next/link';
import {
  User, Wallet, Receipt, Heart, Gift, Star, Settings, Copy, ChevronRight,
  TrendingUp, Clock, CheckCircle, Crown, Shield
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn } from '@/lib/utils';
import SpotlightCard from '@/components/shared/SpotlightCard';
import DailyCheckIn from '@/components/dashboard/DailyCheckIn';
import EmptyState from '@/components/shared/EmptyState';
import { getLoyaltyRank } from '@/store/userStore';
import { toast } from 'sonner';

interface DashboardUser {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  role?: string;
  walletBalance: number;
  loyaltyPoints: number;
  referralCode: string | null;
  lastCheckIn?: Date | string | null;
  createdAt: string | Date;
}

interface DashboardTransaction {
  id: string;
  invoiceId: string;
  productName: string;
  totalAmount: number;
  status: string;
  createdAt: string | Date;
}

const quickActions = [
  { label: 'Riwayat', href: '/dashboard/transactions', icon: Receipt, color: 'from-violet-500 to-purple-600' },
  { label: 'Favorit', href: '/dashboard/favorites', icon: Heart, color: 'from-pink-500 to-rose-600' },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet, color: 'from-cyan-500 to-blue-600' },
  { label: 'Referral', href: '/dashboard/referral', icon: Gift, color: 'from-amber-500 to-orange-600' },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, color: 'from-gray-500 to-gray-600' },
];

export default function DashboardClient({ 
  dbUser, 
  recentTransactions,
  initialHasClaimed = false 
}: { 
  dbUser: DashboardUser; 
  recentTransactions: DashboardTransaction[];
  initialHasClaimed?: boolean;
}) {
  // Use unified getLoyaltyRank() — single source of truth
  const points = dbUser.loyaltyPoints || 0;
  const { rank: loyalty, nextRank: nextLevel, progressPercent: progress } = getLoyaltyRank(points);

  const totalTransactions = recentTransactions.length;
  const totalSpent = recentTransactions.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <>
      <main className="min-h-screen pt-28 tablet:pt-30 pb-24 aurora-bg">
        <div className="container-app max-w-5xl">
          {/* Top Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <SpotlightCard className="h-full p-5 tablet:p-6 bg-card border-border" spotlightColor="rgba(255, 255, 255, 0.05)">
                <div className="flex items-center gap-3.5 tablet:gap-4">
                  <div className="w-14 h-14 tablet:w-16 tablet:h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-xl tablet:text-2xl font-black text-white font-heading shadow-lg shadow-amber-500/20 flex-shrink-0">
                    {dbUser.name ? dbUser.name[0] : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h1 className="text-base tablet:text-xl font-bold font-heading truncate text-foreground">{dbUser.name}</h1>
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm flex-shrink-0" style={{ backgroundColor: `${loyalty.color}15`, color: loyalty.color, border: `1px solid ${loyalty.color}30` }}>
                        <Crown className="w-3 h-3" />
                        {loyalty.name}
                      </div>
                    </div>
                    <p className="text-xs tablet:text-sm text-muted-foreground break-all leading-tight">{dbUser.email}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-amber-400" /> Member sejak {new Date(dbUser.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-muted transition-all flex-shrink-0"
                  >
                    <Settings className="w-4 h-4 tablet:w-5 tablet:h-5 text-muted-foreground hover:text-foreground" />
                  </Link>
                </div>

                {/* Loyalty Progress */}
                <div className="mt-6 p-4 rounded-xl bg-surface border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-foreground">{dbUser.loyaltyPoints.toLocaleString('id-ID')} <span className="font-normal text-muted-foreground">NexaPoints</span></span>
                    </div>
                    {nextLevel && (
                      <span className="text-xs font-medium text-muted-foreground">
                        Target: {nextLevel.minPoints.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden relative">
                    <div
                      style={{ width: `${progress}%` }}
                      className="absolute top-0 left-0 h-full rounded-full bg-primary transition-all duration-500"
                    />
                  </div>
                  {nextLevel && (
                    <p className="text-[11px] text-muted-foreground mt-2">
                      <strong className="text-foreground">{(nextLevel.minPoints - dbUser.loyaltyPoints).toLocaleString('id-ID')} poin</strong> lagi untuk naik ke tier <strong className="text-foreground">{nextLevel.name}</strong> • Diskon {nextLevel.discount}%
                    </p>
                  )}
                </div>
              </SpotlightCard>
            </div>

            {/* Daily Reward Card */}
            <div className="lg:col-span-1">
              <SpotlightCard className="h-full p-5 tablet:p-6 bg-card border-border flex flex-col justify-center" spotlightColor="rgba(255, 255, 255, 0.05)">
                <DailyCheckIn initialHasClaimed={initialHasClaimed} />
              </SpotlightCard>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 tablet:gap-4 mb-6">
            <div className="solid-card p-2.5 sm:p-4 tablet:p-5 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-1.5 sm:mb-2">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <p className="text-xs sm:text-base tablet:text-lg font-bold font-heading">{formatCurrency(dbUser.walletBalance || 0)}</p>
              <p className="text-[9.5px] sm:text-[11px] text-muted-foreground">Saldo Wallet</p>
            </div>
            <div className="solid-card p-2.5 sm:p-4 tablet:p-5 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center mb-1.5 sm:mb-2">
                <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
              </div>
              <p className="text-xs sm:text-base tablet:text-lg font-bold font-heading">{totalTransactions}</p>
              <p className="text-[9.5px] sm:text-[11px] text-muted-foreground">Total Transaksi</p>
            </div>
            <div className="solid-card p-2.5 sm:p-4 tablet:p-5 text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-1.5 sm:mb-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <p className="text-xs sm:text-base tablet:text-lg font-bold font-heading">{formatCurrency(totalSpent)}</p>
              <p className="text-[9.5px] sm:text-[11px] text-muted-foreground">Total Belanja</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-5 gap-1.5 xs:gap-2 tablet:gap-3 mb-6">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-1 p-1.5 xs:p-2 tablet:p-3 rounded-2xl hover:bg-muted/30 transition-all group text-center"
              >
                <div className={cn('w-9 h-9 xs:w-10 xs:h-10 tablet:w-12 tablet:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform', action.color)}>
                  <action.icon className="w-4 h-4 xs:w-5 xs:h-5 text-white" />
                </div>
                <span className="text-[8.5px] xs:text-[10px] tablet:text-xs font-semibold text-muted-foreground group-hover:text-foreground leading-tight w-full text-center tracking-tight">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Referral Code */}
          <div className="glass-card p-4 mb-6 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Kode Referral Kamu</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono gradient-text">{dbUser.referralCode || 'NXP-OFFICIAL'}</span>
                  <button
                    onClick={() => {
                      if (dbUser.referralCode) {
                        navigator.clipboard.writeText(dbUser.referralCode);
                        toast.success('Kode referral berhasil disalin!');
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-muted/50 transition-all cursor-pointer"
                    aria-label="Salin Kode Referral"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Ajak teman & dapatkan Rp 10.000</p>
              </div>
              <Gift className="w-8 h-8 text-primary/30" />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-sm font-semibold">Transaksi Terakhir</h2>
              <Link href="/dashboard/transactions" className="text-xs text-primary hover:underline flex items-center gap-1">
                Lihat Semua <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentTransactions.length === 0 ? (
                <div className="p-4 sm:p-6">
                  <EmptyState
                    icon={Receipt}
                    title="Belum Ada Transaksi"
                    description="Anda belum memiliki riwayat pembelian game atau produk digital."
                    actionHref="/topup"
                    actionLabel="Mulai Top Up Game"
                  />
                </div>
              ) : (
                recentTransactions.map((tx) => (
                  <Link
                    key={tx.id}
                    href={`/payment-status/${tx.invoiceId || tx.id}`}
                    className="p-3.5 sm:p-4 hover:bg-muted/30 transition-colors block group"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={cn(
                          'w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm',
                          tx.status === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        )}>
                          {tx.status === 'COMPLETED' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-blue-400 animate-pulse" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-semibold leading-snug break-words text-foreground font-heading group-hover:text-primary transition-colors">
                            {tx.productName}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                            {tx.id} • {new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 flex flex-col items-end">
                        <span className="text-xs sm:text-sm font-bold font-mono text-foreground">
                          {formatCurrency(tx.totalAmount)}
                        </span>
                        <span className={cn(
                          'inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold mt-0.5 border',
                          tx.status === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 
                          tx.status === 'FAILED' ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        )}>
                          {tx.status === 'COMPLETED' ? 'Selesai' : 
                           tx.status === 'FAILED' ? 'Gagal' : 'Diproses'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
