import Link from 'next/link';
import { ArrowLeft, Briefcase, Sparkles, Rocket, Terminal, Shield, Zap, Flame, Users, Send } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Karir & Squad — NexaPay',
  description: 'Bergabunglah dengan tim NexaPay untuk membangun infrastruktur top-up & fintech gaming masa depan.',
};

const perks = [
  { icon: Zap, title: 'Supercharged Tech Stack', desc: 'Next.js 14, TypeScript, Prisma, Tailwind, Redis & Cloud infrastructure modern.' },
  { icon: Rocket, title: 'Remote-First Culture', desc: 'Bekerja dari mana saja dengan jam kerja fleksibel yang menghargai work-life balance.' },
  { icon: Flame, title: 'Gaming Stipend & Perks', desc: 'Tunjangan bulanan top-up game, perlengkapan hardware gaming, & langganan streaming.' },
  { icon: Users, title: 'High-Impact Ownership', desc: 'Tim ringkas dengan dampak masif. Setiap kodingan kamu langsung digunakan jutaan gamer.' },
];

export default function CareersPage() {
  return (
    <>
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-app max-w-4xl relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold font-heading text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>

          {/* Hero section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 backdrop-blur-md mb-4 shadow-sm">
              <Terminal className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[11px] font-bold tracking-widest text-violet-400 uppercase font-heading">Nexa Engineering & Growth Squad</span>
            </div>
            <h1 className="heading-1 mb-4">
              Bangun Masa Depan <br className="hidden sm:block" />
              <span className="gradient-text">Gaming Ecosystem</span> Bersama Kami
            </h1>
            <p className="body-default max-w-xl mx-auto text-muted-foreground">
              Kami adalah tim yang terobsesi menciptakan pengalaman top-up kilat tanpa friksi untuk jutaan pengguna di Asia Tenggara.
            </p>
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {perks.map((perk) => (
              <div key={perk.title} className="p-5 rounded-2xl bg-card/40 border border-border/80 hover:border-primary/40 backdrop-blur-md transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-3">
                  <perk.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold font-heading mb-1">{perk.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>

          {/* Openspec Card */}
          <div className="p-8 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-2xl text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Sparkles className="w-32 h-32 text-primary" />
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
              <Briefcase className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading mb-2">Talent Pool Open Application</h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Saat ini posisi spesifik sedang terisi penuh, namun kami selalu memprioritaskan talenta luar biasa. Kirim portofolio atau GitHub kamu ke tim talent acquisition kami.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="mailto:career@nexapay.id?subject=NexaPay%20Talent%20Pool%20Application"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white text-xs font-bold font-heading hover:shadow-neon-orange hover:scale-105 transition-all"
              >
                <Send className="w-4 h-4" /> Drop Portfolio / CV (career@nexapay.id)
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
