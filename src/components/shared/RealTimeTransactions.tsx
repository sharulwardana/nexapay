'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Activity, Zap, ShoppingBag } from 'lucide-react';
import { useCurrencyStore } from '@/store/currencyStore';

interface TransactionItem {
  id: string;
  invoiceMasked?: string;
  invoiceId?: string;
  productName: string;
  itemLabel: string;
  price: number;
  paymentMethod: string;
  status: string;
  timeAgo: string;
}

export default function RealTimeTransactions({ compact = false }: { compact?: boolean }) {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { formatPrice } = useCurrencyStore();

  // Fetch actual real database transactions from /api/transactions/recent
  const fetchDbTransactions = async () => {
    try {
      const res = await fetch('/api/transactions/recent');
      if (!res.ok) {
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      if (data.transactions && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
    } catch {
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDbTransactions();
    const interval = setInterval(fetchDbTransactions, 8000); // 8 seconds polling

    // Listen for live transaction events across browser tabs
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('nexapay_live_transactions');
        channel.onmessage = (event) => {
          if (event.data?.type === 'NEW_TRANSACTION') {
            fetchDbTransactions();
          }
        };
      } catch {
        // Fallback to polling
      }
    }

    return () => {
      clearInterval(interval);
      if (channel) channel.close();
    };
  }, []);

  const displayList = transactions.slice(0, 5);

  const content = (
    <div className="glass-card overflow-hidden border border-white/10 shadow-xl">
      {/* Header */}
      <div className="p-3.5 sm:p-5 tablet:p-6 border-b border-border/50 flex items-center justify-between gap-3 bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-bold text-xs sm:text-sm tablet:text-base text-foreground flex items-center gap-1.5">
              <span>Aktivitas Transaksi Real-Time</span>
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 hidden sm:inline" />
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5 truncate">
              Pantau pesanan yang baru saja berhasil diproses instan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase flex-shrink-0 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>LIVE</span>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="p-4 sm:p-6 space-y-3">
          <div className="h-11 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-11 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-11 bg-white/5 rounded-xl animate-pulse" />
        </div>
      ) : displayList.length > 0 ? (
        <div className="divide-y divide-border/40">
          <AnimatePresence initial={false}>
            {displayList.map((tx) => {
              const isSuccess = ['COMPLETED', 'PAID'].includes(tx.status);
              const isWallet = tx.productName?.includes('Wallet');
              const displayProd = isWallet ? 'Isi Saldo Wallet' : tx.productName;
              const displayItem = isWallet ? 'Direct Wallet' : tx.itemLabel;

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="p-3 sm:p-4 flex items-center justify-between gap-2.5 sm:gap-4 hover:bg-white/[0.03] transition-colors"
                >
                  {/* Left: Status Icon + Game & Item */}
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                        isSuccess
                          ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
                          : 'bg-amber-500/10 border border-amber-500/25 text-amber-400'
                      }`}
                    >
                      {isSuccess ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate font-heading leading-tight">
                        {displayProd}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate leading-tight mt-0.5">
                        {displayItem}
                      </p>
                    </div>
                  </div>

                  {/* Right: Price + Masked Invoice & Status */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/80 hidden xs:inline">
                        {tx.invoiceMasked || (tx.invoiceId ? `${tx.invoiceId.slice(0, 7)}***` : 'INV-***')}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-extrabold ${
                          isSuccess
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        <span
                          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                            isSuccess ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                          }`}
                        />
                        {isSuccess ? 'Berhasil' : 'Diproses'}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1 sm:gap-2 mt-1">
                      <span className="text-xs sm:text-sm font-bold text-primary font-heading">
                        {formatPrice(tx.price)}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground/70">• {tx.timeAgo}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-muted/40 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-muted-foreground/50" />
          </div>
          <p className="text-xs font-semibold text-foreground">Belum Ada Transaksi Terbaru</p>
          <p className="text-[11px] text-muted-foreground max-w-xs">
            Transaksi yang berhasil diselesaikan di sistem akan langsung muncul di sini secara otomatis.
          </p>
        </div>
      )}
    </div>
  );

  if (compact) {
    return <div className="mt-8">{content}</div>;
  }

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-app">{content}</div>
    </section>
  );
}
