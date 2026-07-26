'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, ShieldCheck, Clock, Headphones } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Proses Instan',
    description: 'Diamond, voucher, pulsa langsung masuk ke akun dalam hitungan detik.',
  },
  {
    icon: ShieldCheck,
    title: '100% Aman',
    description: 'Transaksi terenkripsi dan dilindungi. Data kamu tidak pernah dibagikan.',
  },
  {
    icon: Clock,
    title: '24/7 Tersedia',
    description: 'Top up kapan saja, di mana saja. Tidak ada jam operasional.',
  },
  {
    icon: Headphones,
    title: 'CS Responsif',
    description: 'Tim support kami siap membantu lewat live chat dan WhatsApp.',
  },
];

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <p className="label mb-2">Kenapa NexaPay</p>
          <h2 className="heading-3">Top up jadi lebih mudah</h2>
        </motion.div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-4 gap-4 tablet:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="text-center p-6 rounded-xl border border-border bg-card"
            >
              <div className="inline-flex w-10 h-10 rounded-lg bg-primary/10 items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
