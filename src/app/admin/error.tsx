'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Panel Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white/[0.02] border border-red-500/20 backdrop-blur-xl text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold font-heading mb-2">
          Kendala Panel Admin
        </h1>
        <p className="text-xs text-white/50 mb-6 leading-relaxed">
          Gagal memuat telemetri atau statistik platform. Pastikan database aktif dan hak akses ADMIN Anda valid.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/25 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Panel
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Beranda
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-[10px] font-mono text-white/30">
            Digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
