'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw, Gamepad2, ShieldAlert } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('NexaPay System Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background pt-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 gradient-hero opacity-60" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        className="relative text-center px-4 max-w-lg z-10"
      >
        {/* Animated Error Icon */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/20 backdrop-blur-xl"
        >
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </motion.div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold font-heading mb-4">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>System Exception Handled</span>
        </div>

        <h1 className="text-2xl tablet:text-3xl font-black font-heading tracking-tight mb-3 text-foreground">
          Terjadi Gangguan Sistem
        </h1>
        <p className="text-xs tablet:text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          Sistem mendeteksi kendala pada koneksi atau pemrosesan data. Tim teknis NexaPay telah mencatat log kesalahan ini.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl gradient-primary text-white text-xs font-bold font-heading shadow-lg shadow-primary/25 hover:shadow-neon-orange transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Muat Ulang
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl text-foreground text-xs font-bold font-heading hover:bg-muted/50 transition-all"
          >
            <Home className="w-4 h-4" />
            Kembali ke Home
          </Link>
          <Link
            href="/topup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl text-foreground text-xs font-bold font-heading hover:bg-muted/50 transition-all"
          >
            <Gamepad2 className="w-4 h-4" />
            Top Up Game
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-[10px] font-mono text-muted-foreground/60">
            Error Digest ID: {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
