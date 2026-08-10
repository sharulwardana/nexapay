'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, ShoppingCart, CreditCard, ShieldCheck
} from 'lucide-react';
import { cn, formatCurrency, formatNumber, formatPaymentMethod } from '@/lib/utils';

export default function AnalyticsClient({
  totalRevenue,
  totalCompleted,
  paymentBreakdown
}: {
  totalRevenue: number;
  totalCompleted: number;
  paymentBreakdown: { paymentMethod: string; _sum: { totalAmount: number | null } }[];
}) {

  return (
    <>
        <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="lg:hidden w-10" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold font-heading tracking-tight truncate">Analitik Performa</h1>
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto"
        >
          {/* High-Level Overview */}
          <div className="grid grid-cols-1 mobile-l:grid-cols-2 gap-4 sm:gap-6">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 border border-violet-500/30 space-y-2 relative overflow-hidden min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-violet-300 uppercase tracking-widest truncate">Total Pendapatan Bersih</p>
                <div className="w-10 h-10 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-300 font-bold flex-shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-xl mobile-m:text-2xl tablet:text-3xl laptop-l:text-4xl font-black font-heading tracking-tight text-white truncate">{formatCurrency(totalRevenue)}</h2>
              <p className="text-xs text-white/50">Akumulasi total pendapatan berhasil diterima.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-cyan-600/20 to-blue-600/10 border border-cyan-500/30 space-y-2 relative overflow-hidden min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-cyan-300 uppercase tracking-widest truncate">Sukses Selesai</p>
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold flex-shrink-0">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-xl mobile-m:text-2xl tablet:text-3xl laptop-l:text-4xl font-black font-heading tracking-tight text-white truncate">{formatNumber(totalCompleted)} <span className="text-sm font-normal text-cyan-300/80">transaksi</span></h2>
              <p className="text-xs text-white/50">Pesanan telah berhasil terkirim ke akun pembeli.</p>
            </motion.div>
          </div>

          {/* Payment Method Distribution */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <div className="flex items-start justify-between border-b border-white/5 pb-4 gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-white">Distribusi Metode Pembayaran</h3>
                <p className="text-xs text-white/40 mt-0.5 leading-relaxed">Perbandingan pendapatan berdasarkan metode pembayaran.</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-400">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3">
              {paymentBreakdown.map((pm, index) => {
                const percent = totalRevenue > 0 ? Math.round(((pm._sum.totalAmount || 0) / totalRevenue) * 100) : 0;
                return (
                  <div key={pm.paymentMethod} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="font-bold text-white/80">{formatPaymentMethod(pm.paymentMethod)}</span>
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
        </motion.main>
    </>
  );
}
