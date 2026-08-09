'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, ShieldCheck, Clock, Headphones } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Proses Instan',
    description: 'Diamond, voucher, pulsa langsung masuk ke akun dalam hitungan detik.',
    gradient: 'from-orange-500/10 to-amber-500/10',
    iconBg: 'bg-orange-500/15 border-orange-500/20',
    iconColor: 'text-orange-500',
    glowColor: 'rgba(249, 115, 22, 0.08)',
  },
  {
    icon: ShieldCheck,
    title: '100% Aman',
    description: 'Transaksi terenkripsi dan dilindungi. Data kamu tidak pernah dibagikan.',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    iconBg: 'bg-emerald-500/15 border-emerald-500/20',
    iconColor: 'text-emerald-500',
    glowColor: 'rgba(16, 185, 129, 0.08)',
  },
  {
    icon: Clock,
    title: '24/7 Tersedia',
    description: 'Top up kapan saja, di mana saja. Tidak ada jam operasional.',
    gradient: 'from-violet-500/10 to-purple-500/10',
    iconBg: 'bg-violet-500/15 border-violet-500/20',
    iconColor: 'text-violet-500',
    glowColor: 'rgba(139, 92, 246, 0.08)',
  },
  {
    icon: Headphones,
    title: 'CS Responsif',
    description: 'Tim support kami siap membantu lewat live chat dan WhatsApp.',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    iconBg: 'bg-cyan-500/15 border-cyan-500/20',
    iconColor: 'text-cyan-500',
    glowColor: 'rgba(6, 182, 212, 0.08)',
  },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString('id-ID')}{suffix}</span>;
}

const stats = [
  { value: 500, suffix: '+', label: 'Game & Produk' },
  { value: 125000, suffix: '+', label: 'Pengguna Aktif' },
  { value: 99, suffix: '%', label: 'Uptime Server' },
  { value: 3, suffix: ' Detik', label: 'Rata-rata Proses' },
];

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none mesh-gradient opacity-50" />

      <div className="container-app relative z-10">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 tablet:gap-6 mb-12 tablet:mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center p-5 tablet:p-6 rounded-2xl glass-card"
            >
              <div className="text-2xl tablet:text-3xl lg:text-4xl font-bold font-heading gradient-text mb-1.5">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs tablet:text-sm text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Kenapa NexaPay</span>
          </div>
          <h2 className="heading-3">Top up jadi lebih mudah</h2>
          <p className="body-default mt-2 max-w-md mx-auto">Platform terpercaya dengan jutaan transaksi sukses</p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-4 gap-4 tablet:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group text-center p-6 rounded-2xl border border-border bg-card hover:border-primary/15 transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: feature.glowColor }}
              />

              <div className="relative z-10">
                <div className={`inline-flex w-12 h-12 rounded-xl ${feature.iconBg} border items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
