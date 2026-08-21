import Link from 'next/link';
import {
  ArrowLeft, Handshake, ShieldCheck, Zap, Server, BarChart3,
  CheckCircle2, Sparkles, Send, Code2, Headphones, Award, Layers
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Mitra & Reseller Resmi — NexaPay',
  description: 'Dapatkan harga modal termurah dan integrasi Direct API top-up game untuk bisnis Anda bersama NexaPay.',
};

const perks = [
  {
    icon: Zap,
    title: 'Margin & Profit Maksimal',
    desc: 'Dapatkan harga modal distributor langsung tanpa perantara untuk ribuan item game dan produk digital.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Server,
    title: 'Direct API Latency Rendah',
    desc: 'Infrastruktur API RESTful berkecepatan tinggi (<50ms) dengan sistem webhook otomatis untuk transaksi instan.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analitik Lengkap',
    desc: 'Pantau omset, mutasi saldo, laporan per produk, dan status transaksi secara real-time dari satu portal.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Headphones,
    title: 'Technical Support 24/7',
    desc: 'Dukungan tim engineer dan customer service prioritas khusus mitra untuk kelancaran integrasi teknis.',
    color: 'from-violet-500 to-purple-600',
  },
];

const tiers = [
  {
    name: 'Silver Agent',
    badge: 'Pemula & Konter',
    desc: 'Cocok untuk pemilik toko voucher, warnet, atau perorangan yang baru memulai bisnis top-up.',
    minDeposit: 'Rp 100.000',
    discount: 'Harga Reseller Dasar',
    features: [
      'Akses Web Portal Reseller',
      'Deposit otomatis 24 Jam via QRIS/VA',
      'Riwayat & mutasi transaksi lengkap',
      'CS standard support',
    ],
    isPopular: false,
    color: 'border-border',
  },
  {
    name: 'Gold Partner',
    badge: 'Paling Populer',
    desc: 'Dirancang untuk website e-commerce, bot WhatsApp/Discord, dan toko online aktif.',
    minDeposit: 'Rp 1.000.000',
    discount: 'Potongan hingga 5% dari harga modal',
    features: [
      'Semua fitur Silver Agent',
      'Akses REST API Key & Webhook',
      'Dokumentasi API & SDK komprehensif',
      'Prioritas pemrosesan server VIP',
      'Grup WhatsApp CS Mitra Prioritas',
    ],
    isPopular: true,
    color: 'border-primary shadow-neon-orange',
  },
  {
    name: 'Platinum Enterprise',
    badge: 'Distributor & Host-to-Host',
    desc: 'Solusi korporat untuk platform skala besar dengan kebutuhan jutaan transaksi per bulan.',
    minDeposit: 'Custom',
    discount: 'Harga Grosir Khusus (Tier 1)',
    features: [
      'Semua fitur Gold Partner',
      'Dedicated Server Gateway Line',
      'Dedicated Account Manager 1-on-1',
      'Custom SLA 99.99% Uptime Guarantee',
      'Biaya admin 0% untuk semua metode',
    ],
    isPopular: false,
    color: 'border-cyan-500/40 shadow-neon-cyan',
  },
];

export default function PartnerPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 relative overflow-hidden aurora-bg">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container-app max-w-5xl relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold font-heading text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>

          {/* Hero Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md mb-4 shadow-sm">
              <Handshake className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase font-heading">
                Nexa Merchant & Partner Ecosystem
              </span>
            </div>
            <h1 className="heading-1 mb-4">
              Bangun Bisnis Top-Up <br className="hidden sm:block" />
              <span className="gradient-text">Dengan Direct API Tercepat</span>
            </h1>
            <p className="body-default max-w-2xl mx-auto text-muted-foreground">
              Bergabunglah dengan ribuan mitra agen dan distributor di seluruh Indonesia. Nikmati integrasi mudah, harga modal terendah, dan uptime server 99.9%.
            </p>
          </div>

          {/* 4 Key Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="p-5 rounded-3xl bg-card/60 border border-border/80 hover:border-primary/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className={cn('w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-105 transition-transform', perk.color)}>
                    <perk.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold font-heading mb-1.5 text-foreground">{perk.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reseller Tiers */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <span className="text-[11px] font-bold tracking-widest text-primary uppercase font-heading block mb-1">
                Pilihan Skema Kemitraan
              </span>
              <h2 className="heading-2">Pilih Tier yang Sesuai untuk Bisnis Anda</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={cn(
                    'p-6 tablet:p-8 rounded-3xl bg-card/70 border backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between relative shadow-xl',
                    tier.color,
                    tier.isPopular && 'ring-1 ring-primary/40 bg-card/90'
                  )}
                >
                  {tier.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      {tier.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-black font-heading text-foreground">{tier.name}</h3>
                      {!tier.isPopular && (
                        <span className="px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground text-[10px] font-bold">
                          {tier.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                      {tier.desc}
                    </p>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-border/50 mb-6 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Minimal Saldo Awal</p>
                      <p className="text-lg font-black text-primary font-heading">{tier.minDeposit}</p>
                      <p className="text-[11px] text-emerald-400 font-semibold">{tier.discount}</p>
                    </div>

                    <div className="space-y-3 mb-8">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-heading">Fitur & Keuntungan</p>
                      {tier.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2.5 text-xs text-foreground/90">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`mailto:partner@nexapay.id?subject=Pendaftaran%20Kemitraan%20NexaPay%20(${tier.name})`}
                    className={cn(
                      'w-full py-3.5 rounded-2xl font-bold font-heading text-xs text-center flex items-center justify-center gap-2 transition-all shadow-md',
                      tier.isPopular
                        ? 'gradient-primary text-white hover:shadow-neon-orange hover:opacity-95'
                        : 'bg-muted/40 hover:bg-muted text-foreground border border-border'
                    )}
                  >
                    <Send className="w-3.5 h-3.5" /> Daftar {tier.name}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Integration / API Box */}
          <div className="p-8 tablet:p-10 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl gradient-primary text-white flex items-center justify-center mx-auto shadow-lg shadow-primary/25">
              <Code2 className="w-7 h-7" />
            </div>

            <div className="max-w-xl mx-auto">
              <h2 className="text-xl tablet:text-2xl font-bold font-heading mb-2 text-foreground">
                Siap Menghubungkan API ke Platform Anda?
              </h2>
              <p className="text-xs tablet:text-sm text-muted-foreground leading-relaxed">
                Tim teknis kami siap memandu proses integrasi Host-to-Host (H2H) dengan format JSON standar industri.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href="mailto:partner@nexapay.id?subject=Request%20Dokumentasi%20API%20NexaPay"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl gradient-primary text-white text-xs font-bold font-heading hover:shadow-neon-orange transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Hubungi Tim Kemitraan (partner@nexapay.id)
              </a>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-muted/40 hover:bg-muted border border-border text-foreground text-xs font-bold font-heading transition-all"
              >
                Live Support CS 24/7
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
