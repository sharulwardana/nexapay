'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import { Search, Receipt, ShieldCheck, ArrowRight, Sparkles, Clipboard } from 'lucide-react';
import RealTimeTransactions from '@/components/shared/RealTimeTransactions';
import { toast } from 'sonner';

export default function TrackClient() {
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
      <main className="min-h-screen pt-28 tablet:pt-36 pb-24">
        <div className="container-app max-w-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold mb-4 shadow-sm">
              <Receipt className="w-4 h-4" />
              <span>Cek & Lacak Pesanan</span>
            </div>
            <h1 className="heading-2 mb-3">Lacak Status Transaksi</h1>
            <p className="body-default text-muted-foreground text-xs tablet:text-sm">
              Masukkan Kode Invoice pembayaran kamu untuk melihat status proses top-up secara real-time.
            </p>
          </div>

          <div className="bg-[#121620] p-6 tablet:p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
            <form onSubmit={handleSearch} className="space-y-4 relative z-10">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground font-heading">
                    Nomor Invoice
                  </label>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) {
                          setInvoiceId(text.trim());
                          toast.success('Nomor invoice berhasil ditempel!');
                        }
                      } catch {
                        toast.error('Gagal mengakses clipboard');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/25 text-brand-500 text-[10.5px] sm:text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Clipboard className="w-3 h-3" />
                    <span>Tempel</span>
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    placeholder="Contoh: NXP-M7X9K2-AB12"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#0B0E14] border border-white/10 text-sm tablet:text-base font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 transition-all text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-primary text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-brand"
              >
                <span>Lacak Status Pesanan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#181E2B] border border-white/5">
                <ShieldCheck className="w-5 h-5 text-brand-500 mx-auto mb-1" />
                <p className="text-xs font-bold text-foreground">100% Terverifikasi</p>
                <p className="text-[10px] text-muted-foreground">Sistem Otomatis 24/7</p>
              </div>
              <div className="p-3 rounded-xl bg-[#181E2B] border border-white/5">
                <Sparkles className="w-5 h-5 text-brand-500 mx-auto mb-1" />
                <p className="text-xs font-bold text-foreground">Proses Kilat</p>
                <p className="text-[10px] text-muted-foreground">1 - 3 Detik Masuk</p>
              </div>
            </div>
          </div>

          {/* Real-Time Incoming Transactions Feed */}
          <RealTimeTransactions compact />
        </div>
      </main>
      <Footer />
    </>
  );
}
