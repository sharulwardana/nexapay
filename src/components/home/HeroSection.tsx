'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, ChevronRight } from 'lucide-react';
import MagneticButton from '@/components/shared/MagneticButton';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.33, 1, 0.68, 1] },
  }),
};

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      {/* Ambient gradient — subtle, sophisticated */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Dot grid */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Single ambient orb — minimal */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, hsl(239, 84%, 67%, 0.1), transparent 70%)' }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative container-app">
        <div className="max-w-3xl mx-auto text-center pt-28 tablet:pt-36 lg:pt-40">
          {/* Badge */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border bg-card"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Platform Top Up #1 di Indonesia
            </span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </motion.div>

          {/* Heading — tight tracking like Linear */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="heading-1 mb-6"
          >
            <span className="text-foreground">Top up game{' '}</span>
            <span className="gradient-text">lebih cepat</span>
            <br />
            <span className="text-foreground">dari sebelumnya.</span>
          </motion.h1>

          {/* Description — clean, spaced */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="body-large max-w-xl mx-auto mb-10"
          >
            Top up game, beli voucher digital, bayar tagihan — semua dalam satu platform.
            Proses instan, harga terbaik, 100% aman.
          </motion.p>

          {/* CTA Buttons — Apple-style spacing */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col xs:flex-row items-center justify-center gap-3 mb-16 tablet:mb-20"
          >
            <MagneticButton strength={20}>
              <Link
                href="/topup"
                className="group w-full xs:w-auto btn-primary px-7 py-3.5 text-sm tablet:text-base flex items-center justify-center"
              >
                <Zap className="w-4 h-4" />
                Top Up Sekarang
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </MagneticButton>
            <MagneticButton strength={15}>
              <Link
                href="/products"
                className="w-full xs:w-auto btn-secondary px-7 py-3.5 text-sm tablet:text-base flex items-center justify-center"
              >
                Lihat Produk
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Stats — minimal, clean */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex items-center justify-center gap-8 tablet:gap-12 lg:gap-16"
          >
            {[
              { value: '2.5M+', label: 'Pengguna' },
              { value: '15M+', label: 'Transaksi' },
              { value: '500+', label: 'Game' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl tablet:text-2xl lg:text-3xl font-bold font-heading tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="text-[10px] tablet:text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Trust — subtle badges */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex items-center justify-center gap-6 mt-10"
          >
            {[
              { icon: Shield, text: 'SSL Encrypted' },
              { icon: Zap, text: 'Instant Process' },
            ].map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-1.5 text-xs text-muted-foreground/70"
              >
                <badge.icon className="w-3.5 h-3.5" />
                {badge.text}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
