'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, ShoppingCart, Gamepad2, Clock } from 'lucide-react';

const stats = [
  { icon: Users, value: '2.5M+', label: 'Pengguna Aktif', description: 'Trust dari jutaan gamer Indonesia' },
  { icon: ShoppingCart, value: '15M+', label: 'Transaksi Selesai', description: 'Diproses cepat dan aman' },
  { icon: Gamepad2, value: '500+', label: 'Produk Digital', description: 'Game, voucher, dan lainnya' },
  { icon: Clock, value: '<3 detik', label: 'Waktu Proses', description: 'Langsung masuk ke akun' },
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
          className="text-center mb-12"
        >
          <p className="label mb-2">Why NexaPay</p>
          <h2 className="heading-3">Dipercaya jutaan pengguna</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tablet:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="text-center p-6 rounded-xl border border-border bg-card"
            >
              <div className="inline-flex w-10 h-10 rounded-lg bg-primary/8 items-center justify-center mb-4">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl tablet:text-3xl font-bold font-heading tracking-tight text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-foreground mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
