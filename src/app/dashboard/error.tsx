'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home, Wallet } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 aurora-bg flex items-center justify-center">
        <div className="container-app max-w-lg text-center">
          <div className="glass-card p-8 border border-red-500/20 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-bold font-heading text-foreground mb-2">
              Gagal Memuat Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
              Terjadi kendala saat memuat data profil atau transaksi akun Anda. Silakan coba lagi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => reset()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Muat Ulang
              </button>
              <Link
                href="/dashboard/wallet"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold transition-all"
              >
                <Wallet className="w-3.5 h-3.5" /> Buka Wallet
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
