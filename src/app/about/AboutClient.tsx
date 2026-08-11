'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap, Heart, Target, Sparkles, Users, Award, Globe, Rocket, Cpu, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  award: Award,
  globe: Globe,
  shield: Shield,
};

const values = [
  { icon: Zap, title: 'Ultra-Low Latency', desc: 'Sistem auto-injection diamond diproses dalam hitungan milidetik secara paralel.', color: 'from-orange-500 to-amber-600' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'Enkripsi SSL 256-bit & perlindungan fraud berbasis Machine Learning.', color: 'from-emerald-500 to-teal-600' },
  { icon: Heart, title: 'Gamer-First Support', desc: 'Tim CS 24/7 yang terdiri dari gamer profesional yang paham kendala akun kamu.', color: 'from-pink-500 to-rose-600' },
  { icon: Target, title: 'Non-Stop Innovation', desc: 'Mengintegrasikan metode pembayaran terdepan dari QRIS hingga Web3.', color: 'from-cyan-500 to-blue-600' },
];

const milestones = [
  { year: '2024', event: 'NexaPay Engine v1.0 diluncurkan di Jakarta dengan infrastruktur Cloud Microservices' },
  { year: '2024', event: 'Mencapai 100.000+ pengguna aktif bulanan & ekspansi katalog ke 100+ game' },
  { year: '2025', event: 'Integrasi API langsung dengan publisher Moonton, HoYoverse, & Garena' },
  { year: '2025', event: 'Peluncuran Nexa Wallet & Sistem Cashback Otomatis tanpa ribet' },
  { year: '2026', event: 'Generasi Cyber Fintech 2026 diluncurkan: Latensi transaksi < 5 detik & fitur instant sharing' },
];

const team = [
  { name: 'Reza Pratama', role: 'Chief Executive Officer', initial: 'RP' },
  { name: 'Diana Chen', role: 'Chief Technology Officer', initial: 'DC' },
  { name: 'Ahmad Fauzi', role: 'Head of Infrastructure', initial: 'AF' },
  { name: 'Sarah Kusuma', role: 'Head of Growth & Gamer Care', initial: 'SK' },
];

export default function AboutClient({ stats }: { stats: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <main className="min-h-screen pt-28 tablet:pt-32 pb-24 relative overflow-hidden">
      {/* Hero Header */}
      <section className="relative py-12 tablet:py-20 text-center">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <motion.div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-neon-violet/10 blur-[120px]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />

        <div className="container-app relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold tracking-widest text-primary uppercase font-heading">Nexa Ecosystem Mission</span>
            </div>
            <h1 className="heading-1 mb-4">
              Forging the Future of <br />
              <span className="gradient-text">Gaming & Digital Top-Up</span>
            </h1>
            <p className="body-large max-w-2xl mx-auto text-muted-foreground">
              Membangun infrastruktur top-up digital dengan latensi paling rendah, harga paling kompetitif, dan keamanan tanpa kompromi untuk seluruh gamer Indonesia.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-app relative z-10">
        {/* Real-time Telemetry Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((stat: any) => {
            const Icon = iconMap[stat.iconName] || Users;
            return (
              <div key={stat.label} className="p-5 rounded-2xl bg-card/50 border border-border/80 hover:border-primary/40 backdrop-blur-xl text-center shadow-lg transition-all duration-300">
                <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl tablet:text-3xl font-bold font-heading gradient-text">{stat.value}</p>
                <p className="text-xs font-semibold text-muted-foreground mt-1">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Values */}
        <div ref={ref} className="mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-10">
            <h2 className="heading-2">Nilai Utama Nexa Ecosystem</h2>
            <p className="body-default text-muted-foreground mt-1">Prinsip dasar yang menggerakkan seluruh sistem & layanan kami</p>
          </motion.div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="p-5 rounded-2xl bg-card/40 border border-border/80 backdrop-blur-md">
                <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br mb-3 flex items-center justify-center shadow-md', value.color)}>
                  <value.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold font-heading mb-1">{value.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Roadmap */}
        <div className="mb-20 max-w-3xl mx-auto">
          <h2 className="heading-2 text-center mb-10">Peta Jalan (Roadmap Timeline)</h2>
          <div className="space-y-0 relative border-l-2 border-primary/20 ml-4 tablet:ml-8 pl-6">
            {milestones.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="mb-8 relative"
              >
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-neon-orange" />
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold font-heading mb-1.5">{m.year}</span>
                <p className="text-xs tablet:text-sm font-medium text-foreground leading-relaxed">{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Executive Team */}
        <div className="mb-16">
          <h2 className="heading-2 text-center mb-10">Tim Di Balik NexaPay</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-card/40 border border-border/80 backdrop-blur-md text-center hover:border-primary/40 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3 text-lg font-bold font-heading text-white shadow-md">
                  {member.initial}
                </div>
                <h3 className="text-sm font-bold font-heading">{member.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
