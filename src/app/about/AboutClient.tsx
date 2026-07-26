'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap, Heart, Target, Sparkles, Users, Award, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  award: Award,
  globe: Globe,
  shield: Shield,
};

const values = [
  { icon: Zap, title: 'Kecepatan', desc: 'Proses transaksi instan dalam hitungan detik, bukan menit.', color: 'from-yellow-500 to-amber-600' },
  { icon: Shield, title: 'Keamanan', desc: 'Perlindungan berlapis untuk setiap transaksi yang kamu lakukan.', color: 'from-green-500 to-emerald-600' },
  { icon: Heart, title: 'Kepuasan', desc: 'Customer satisfaction adalah prioritas utama kami selalu.', color: 'from-pink-500 to-rose-600' },
  { icon: Target, title: 'Inovasi', desc: 'Selalu menghadirkan fitur terbaru dan teknologi terdepan.', color: 'from-blue-500 to-cyan-600' },
];

const milestones = [
  { year: '2023', event: 'NexaPay didirikan di Jakarta' },
  { year: '2023', event: 'Mencapai 100.000 pengguna pertama' },
  { year: '2024', event: 'Ekspansi ke 500+ game dan produk digital' },
  { year: '2024', event: 'Meraih 1 juta pengguna aktif' },
  { year: '2025', event: 'Peluncuran NexaPay Wallet & Loyalty System' },
  { year: '2025', event: 'Partnership resmi dengan Moonton, HoYoverse, Garena' },
  { year: '2026', event: 'Mencapai 2.5 juta pengguna aktif' },
  { year: '2026', event: 'Peluncuran Crypto Payment & AI Chatbot' },
];

const team = [
  { name: 'Reza Pratama', role: 'CEO & Co-Founder', initial: 'RP' },
  { name: 'Diana Chen', role: 'CTO & Co-Founder', initial: 'DC' },
  { name: 'Ahmad Fauzi', role: 'Head of Product', initial: 'AF' },
  { name: 'Sarah Kusuma', role: 'Head of Marketing', initial: 'SK' },
];

export default function AboutClient({ stats }: { stats: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <main className="min-h-screen pt-20 tablet:pt-24 pb-24">
      {/* Hero */}
      <section className="relative py-16 tablet:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <motion.div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-neon-violet/10 blur-[100px]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />

        <div className="container-app relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full glass-card border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium gradient-text">Tentang NexaPay</span>
            </div>
            <h1 className="heading-1 mb-4">
              Kami Membangun Masa Depan <br />
              <span className="gradient-text">Digital Top-Up</span>
            </h1>
            <p className="body-large max-w-2xl mx-auto">
              NexaPay adalah platform top-up game dan produk digital #1 di Indonesia.
              Misi kami adalah membuat setiap gamer dan pengguna digital bisa mengakses
              produk yang mereka butuhkan dengan mudah, cepat, dan aman.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-app">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-8 mb-16 relative z-10"
        >
          {stats.map((stat: any) => {
            const Icon = iconMap[stat.iconName] || Users;
            return (
              <div key={stat.label} className="glass-card p-4 tablet:p-6 text-center">
                <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl tablet:text-3xl font-bold font-heading gradient-text">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Values */}
        <div ref={ref} className="mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="heading-3 text-center mb-8">Nilai-Nilai Kami</motion.h2>
          <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="glass-card p-5 text-center">
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br mx-auto mb-3 flex items-center justify-center', value.color)}>
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-semibold mb-1">{value.title}</h3>
                <p className="text-xs text-muted-foreground">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="heading-3 text-center mb-8">Perjalanan Kami</h2>
          <div className="max-w-2xl mx-auto space-y-0">
            {milestones.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex gap-4 relative"
              >
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full gradient-primary flex-shrink-0 z-10" />
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
                </div>
                <div className="pb-6">
                  <span className="text-xs font-bold text-primary">{m.year}</span>
                  <p className="text-sm">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="heading-3 text-center mb-8">Tim Kami</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-5 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3 text-xl font-bold text-white">
                  {member.initial}
                </div>
                <h3 className="text-sm font-semibold">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
