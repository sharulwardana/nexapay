'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, ShieldCheck, Clock, Headphones } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Supercharged Speed',
    description: 'Item game & nominal digital langsung terinjeksi ke akun dalam hitungan milidetik.',
    gradient: 'from-orange-500/10 to-amber-500/10',
    iconBg: 'bg-orange-500/15 border-orange-500/30',
    iconColor: 'text-orange-400',
    glowColor: 'rgba(249, 115, 22, 0.15)',
  },
  {
    icon: ShieldCheck,
    title: 'Military-Grade Encryption',
    description: 'Proses pembayaran dilindungi SSL 256-bit & OAuth 2.0 terdaftar resmi.',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30',
    iconColor: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
  {
    icon: Clock,
    title: 'Continuous Automation 24/7',
    description: 'API gateway otomatis tanpa intervensi manual. Transaksi tetap kilat meski jam 3 pagi.',
    gradient: 'from-violet-500/10 to-purple-500/10',
    iconBg: 'bg-violet-500/15 border-violet-500/30',
    iconColor: 'text-violet-400',
    glowColor: 'rgba(139, 92, 246, 0.15)',
  },
  {
    icon: Headphones,
    title: 'Dedicated Live Support',
    description: 'Customer Support manusia profesional (non-bot) tanggap siaga via Live WhatsApp.',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    iconBg: 'bg-cyan-500/15 border-cyan-500/30',
    iconColor: 'text-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.15)',
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
  { value: 500, suffix: '+', label: 'Game & Digital Catalog' },
  { value: 125000, suffix: '+', label: 'Active Cyber Gamers' },
  { value: 99.9, suffix: '%', label: 'API Gateway Uptime' },
  { value: 3, suffix: ' Detik', label: 'Avg Injection Speed' },
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
              className="text-center p-5 tablet:p-6 rounded-2xl glass-card border border-white/10 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-neon-violet"
            >
              <div className="text-2xl tablet:text-3xl lg:text-4xl font-bold font-heading gradient-text mb-1.5 tracking-tight">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs tablet:text-sm text-muted-foreground font-semibold tracking-wide">{stat.label}</p>
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-md mb-4 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-heading">SYSTEM PERFORMANCE TELEMETRY</span>
          </div>
          <h2 className="heading-3">Kecepatan Eksekusi & Keamanan Tingkat Tinggi</h2>
          <p className="body-default mt-2 max-w-lg mx-auto text-muted-foreground font-medium">Disokong infrastruktur cloud berkecepatan tinggi dengan garansi otomatisasi 24/7.</p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-4 gap-4 tablet:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group text-center p-6 rounded-2xl border border-white/10 bg-card/60 backdrop-blur-md hover:border-primary/40 transition-all duration-300 hover:shadow-neon-violet relative overflow-hidden hover:-translate-y-1"
            >
              {/* Hover glow */}
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: feature.glowColor }}
              />

              <div className="relative z-10">
                <div className={`inline-flex w-12 h-12 rounded-xl ${feature.iconBg} backdrop-blur-md border items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2 group-hover:text-primary transition-colors font-heading tracking-tight">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
