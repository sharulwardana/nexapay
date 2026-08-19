'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { Search, Receipt, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import RealTimeTransactions from '@/components/shared/RealTimeTransactions';
import { toast } from 'sonner';

export default function TrackPage() {
  const [invoiceId, setInvoiceId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId.trim()) {
      toast.error('Masukkan nomor transaksi / Invoice ID');
      return;
    }
    const cleanId = invoiceId.trim().toUpperCase();
    router.push(`/payment-status/${cleanId}`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-36 pb-24">
        <div className="container-app max-w-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-4">
              <Receipt className="w-4 h-4" />
              <span>Cek & Lacak Pesanan</span>
            </div>
            <h1 className="heading-2 mb-3">Lacak Status Transaksi</h1>
            <p className="body-default text-muted-foreground text-xs tablet:text-sm">
              Masukkan Kode Invoice pembayaran kamu untuk melihat status proses top-up secara real-time.
            </p>
          </div>

          <div className="glass-card p-6 tablet:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <form onSubmit={handleSearch} className="space-y-4 relative z-10">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Nomor Invoice Transaksi
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    placeholder="Contoh: INV-17850692"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-background/60 border border-border text-sm tablet:text-base font-mono font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-neon-violet transition-all active:scale-[0.98]"
              >
                <span>Cek Status Pesanan Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                <ShieldCheck className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-bold">100% Terverifikasi</p>
                <p className="text-[10px] text-muted-foreground">Sistem Otomatis 24/7</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                <Sparkles className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-bold">Proses Kilat</p>
                <p className="text-[10px] text-muted-foreground">1 - 3 Detik Masuk</p>
              </div>
            </div>
          </div>

          {/* Real-Time Incoming Transactions Feed */}
          <RealTimeTransactions />
        </div>
      </main>
      <Footer />
    </>
  );
}
