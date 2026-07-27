'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TransactionItem {
  id: string;
  invoiceMasked: string;
  productName: string;
  itemLabel: string;
  price: number;
  paymentMethod: string;
  status: 'SUCCESS' | 'PENDING';
  timeAgo: string;
}

export default function RealTimeTransactions() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch actual real database transactions from /api/transactions/recent
  const fetchDbTransactions = async () => {
    try {
      const res = await fetch('/api/transactions/recent');
      if (!res.ok) {
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      if (data.transactions) {
        // Mask invoice ID for privacy
        const masked = data.transactions.map((tx: any) => ({
          ...tx,
          invoiceMasked: tx.invoiceId ? `${tx.invoiceId.substring(0, 8)}****${tx.invoiceId.slice(-3)}` : 'INV-8910****8CD',
        }));
        setTransactions(masked);
      }
    } catch (e) {
      console.error('Failed to load DB transactions', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDbTransactions();
    const interval = setInterval(fetchDbTransactions, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mt-10 tablet:mt-14">
      {/* Clean Minimalist Header */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold mb-2">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Live Order Stream</span>
        </div>
        <h2 className="text-lg tablet:text-xl font-bold font-heading text-foreground">
          Transaksi Terbaru
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pesanan masuk yang berhasil diproses secara otomatis.
        </p>
      </div>

      {/* Ultra-Clean Minimalist Stream Cards */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl bg-card/60 backdrop-blur-md">
        <div className="divide-y divide-border/30">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
              <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground/60 text-xs font-medium">
              Belum ada transaksi terbaru yang berhasil diproses.
            </div>
          ) : (
            <AnimatePresence initial={false}>
            {transactions.map((tx) => {
              const isSuccess = ['COMPLETED', 'PAID', 'SUCCESS'].includes(tx.status);
              const isWallet = tx.productName?.includes('Wallet');
              const displayProd = isWallet ? 'Isi Saldo Wallet' : tx.productName;
              const displayItem = isWallet ? 'Direct Wallet' : tx.itemLabel;

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: -10, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                  animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3.5 tablet:p-4 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Left: Status Icon + Game & Item */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSuccess
                        ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
                        : 'bg-amber-500/10 border border-amber-500/25 text-amber-400'
                    }`}>
                      {isSuccess ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4 animate-spin" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs tablet:text-sm font-bold text-foreground truncate">
                        {displayProd}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {displayItem}
                      </p>
                    </div>
                  </div>

                  {/* Right: Price + Masked Invoice & Status */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground/80">
                        {tx.invoiceMasked}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                        isSuccess
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                        {isSuccess ? 'Berhasil' : 'Diproses'}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className="text-xs font-bold text-primary">
                        {formatCurrency(tx.price)}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70">• {tx.timeAgo}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
