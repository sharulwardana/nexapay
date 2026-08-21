'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Gamepad2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-30" />


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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:shadow-lg transition-all"
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
