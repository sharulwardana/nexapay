'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Gamepad2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <motion.div
        className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-neon-violet/10 blur-[100px]"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center px-4"
      >
        {/* 404 Number */}
        <motion.h1
          className="text-[120px] tablet:text-[180px] font-heading font-black leading-none gradient-text opacity-80"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          404
        </motion.h1>

        <h2 className="text-xl tablet:text-2xl font-bold font-heading mb-3 -mt-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-sm tablet:text-base text-muted-foreground mb-8 max-w-md mx-auto">
          Ups! Sepertinya kamu tersesat. Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>

        <div className="flex flex-col xs:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold shadow-neon-violet hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all"
          >
            <Home className="w-4 h-4" />
            Kembali ke Home
          </Link>
          <Link
            href="/topup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-background/50 backdrop-blur font-semibold hover:bg-muted/50 transition-all"
          >
            <Gamepad2 className="w-4 h-4" />
            Top Up Game
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
