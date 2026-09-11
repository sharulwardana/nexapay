'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, Sparkles, Star, ShieldCheck, Gem, Tag, Zap, CheckCircle2, ChevronDown, Heart, Gamepad2, CreditCard
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { ProductWithDenominations, Denomination } from '@/types';

function FaqAccordionSection({
  items,
  gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
}: {
  items: Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    content: React.ReactNode;
    iconBg?: string;
    borderGlow?: string;
  }>;
  gridCols?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {/* Mobile Glassmorphic Accordion Dropdowns (block tablet:hidden) */}
      <div className="tablet:hidden space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={cn(
                'rounded-2xl bg-card/40 backdrop-blur-xl border transition-all overflow-hidden shadow-md',
                isOpen
                  ? item.borderGlow || 'border-primary/50 bg-card/70 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                  : 'border-white/10 hover:border-white/20'
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left font-bold font-heading text-xs sm:text-sm active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center font-bold flex-shrink-0',
                    item.iconBg || 'bg-primary/10 text-primary'
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-foreground font-bold text-xs sm:text-sm leading-snug">{item.title}</span>
                </div>
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center bg-background/50 border border-white/10 transition-transform duration-300 flex-shrink-0',
                  isOpen && 'rotate-180 bg-primary/20 text-primary border-primary/30'
                )}>
                  <ChevronDown className="w-3.5 h-3.5 text-primary" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-border/30 text-xs text-muted-foreground space-y-3 leading-relaxed">
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Tablet & Desktop Glassmorphic Cards Grid (hidden tablet:grid) */}
      <div className={cn('hidden tablet:grid gap-5', gridCols)}>
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={cn(
                'p-6 rounded-3xl bg-card/40 backdrop-blur-xl border transition-all space-y-4 shadow-lg group flex flex-col justify-between',
                item.borderGlow || 'border-white/10 hover:border-primary/30'
              )}
            >
              <div className="space-y-4">
                <div className={cn(
                  'w-10 h-10 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform',
                  item.iconBg || 'bg-primary/10 text-primary'
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold font-heading text-foreground">{item.title}</h3>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function TopUpFaqSection({
  game,
  currencyLabel,
}: {
  game: ProductWithDenominations;
  currencyLabel: string;
}) {
  return (
        <div className="mt-4 tablet:mt-10 pt-4 tablet:pt-8 border-t border-border/40 space-y-4 tablet:space-y-8 max-w-6xl mx-auto px-4 pb-12 tablet:pb-16">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              Pusat Informasi &amp; FAQ
            </span>
            <h2 className="text-xl tablet:text-2xl font-black font-heading tracking-tight">
              Panduan Top Up <span className="gradient-text">{game.name}</span> Termurah
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Dapatkan informasi lengkap cara transaksi, daftar harga terbaru, serta kelengkapan metode pembayaran top up game di NexaPay.
            </p>
          </div>

          {game.slug === 'mobile-legends' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Beli & Kirim Gift Diamond MLBB",
                  content: (
                    <>
                      <p>Isi ulang Diamond untuk akun sendiri atau kirim sebagai <strong className="text-foreground">Kado ke Teman &amp; Keluarga</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Masukkan <strong className="text-foreground">User ID &amp; Zone ID</strong> MLBB kamu (atau ID temanmu).</li>
                        <li>Pilih jumlah Diamond, WDP, StarLight, atau Twilight Pass.</li>
                        <li>Pilih metode pembayaran favoritmu &amp; tuntaskan transaksi.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Diamond langsung ditambahkan ke akun MLBB!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Cara Kerja Bonus Double Diamonds",
                  iconBg: "bg-amber-500/15 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Bonus 1x untuk pembelian pertama per tier Diamond:</p>
                      <ul className="space-y-1 text-[11px] border-b border-border/20 pb-2">
                        <li className="flex items-center justify-between">
                          <span>Beli 50 Diamonds</span>
                          <strong className="text-emerald-400">Dapat 100 DM (50 + 50 Bonus)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Beli 150 Diamonds</span>
                          <strong className="text-emerald-400">Dapat 300 DM (150 + 150 Bonus)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Beli 250 Diamonds</span>
                          <strong className="text-emerald-400">Dapat 500 DM (250 + 250 Bonus)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Beli 500 Diamonds</span>
                          <strong className="text-emerald-400 font-bold">Dapat 1000 DM (500 + 500)!</strong>
                        </li>
                      </ul>
                      <p className="text-[10px] italic pt-1">
                        💡 Bonus 2x berlaku 1 kali per tier terlepas dari metode pembayaran.
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Weekly Diamond Pass (WDP - Rp 27.550)",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Cara paling hemat mengumpulkan total <strong className="text-primary font-bold">220 Diamonds</strong>:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Hadiah Instan:</strong> 80 Diamonds langsung masuk setelah bayar.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Hadiah Harian:</strong> 20 DM/hari × 7 hari = +140 DM tambahan.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Late Sign-in Card:</strong> Fitur penebus klaim harian yang terlewat!</span>
                        </li>
                      </ul>
                      <p className="text-[10px] pt-1 border-t border-border/20">
                        ⚠️ <em>WDP tidak dihitung sebagai milestone event recharge MLBB.</em>
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "StarLight Member (300 / 750 DM)",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Beli min. 300 DM (Member) atau 750 DM (Plus) ➔ buka menu StarLight in-game untuk klaim:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Skin StarLight Eksklusif bulanan + 4 pilihan skin eksklusif ekstra.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Avatar Border, Battle Emote unik, &amp; Hero gratis mingguan.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Bonus XP &amp; keistimewaan prioritas saat fase Banning Rank.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Gem,
                  title: "Twilight Pass (Rp 150.000)",
                  iconBg: "bg-pink-500/15 text-pink-400",
                  borderGlow: "border-pink-500/30 hover:border-pink-500/50",
                  content: (
                    <>
                      <p>Pass premium berhadiah item langka &amp; skin eksklusif:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-pink-400 font-bold">•</span>
                          <span><strong className="text-foreground">Twilight Coins:</strong> Ditukar dengan skin hero &amp; item langka.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-pink-400 font-bold">•</span>
                          <span><strong className="text-foreground">Skin Spesial Hero:</strong> Buka skin spesial (Miya Suzuhime) &amp; Efek Recall unik.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-pink-400 font-bold">•</span>
                          <span>Hadiah mingguan bonus seiring progres Level akunmu.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Rincian Harga & Direct API Moonton",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>3 s/d 4.830 Diamonds berkisar dari <strong className="text-foreground">Rp 1.171 s/d Rp 1.140.000</strong>:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> WDP: Rp 27.550 | Twilight: Rp 150.000
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> 100% Direct API Moonton (Tanpa Password)
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'genshin-impact' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Temukan UID & Server Game",
                  content: (
                    <>
                      <p>Top up Genesis Crystals &amp; Chronal Nexus diproses via <strong className="text-foreground">UID &amp; Server HoYoverse</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka Genshin Impact ➔ Buka Menu Paimon (pojok kiri atas).</li>
                        <li>Salin <strong>UID 9-digit</strong> di bawah Avatar profil / sudut kanan bawah layar.</li>
                        <li>Pilih Server (<strong className="text-foreground">Asia, America, Europe, TW/HK/MO</strong>) di form atas.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Crystals dikirim otomatis ke inbox in-game!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Bonus 2X Double Genesis Crystals",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Jika akunmu belum pernah top up tier nominal tertentu, kamu mendapatkan <strong className="text-emerald-400">Bonus 2X Lipat</strong>:</p>
                      <ul className="space-y-1 text-[11px]">
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>60 Crystals</span>
                          <strong className="text-emerald-400">Bonus +120</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>300+30 Crystals</span>
                          <strong className="text-emerald-400">Bonus +600</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>980+110 Crystals</span>
                          <strong className="text-emerald-400">Bonus +1.960</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>1.980+260 Crystals</span>
                          <strong className="text-emerald-400">Bonus +3.960</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>6.480+1.600 Crystals</span>
                          <strong className="text-emerald-400 font-bold">Bonus +12.960!</strong>
                        </li>
                      </ul>
                      <p className="text-[10px] italic pt-1 border-t border-border/20">
                        💡 Termasuk bonus Chronal Nexus (+30 s/d +1.600 ekstra).
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Blessing of the Welkin Moon & Rules",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Mendapatkan <strong className="text-foreground">300 Genesis Crystals instan</strong> + <strong className="text-primary">90 Primogems harian</strong> selama 30 hari (Total 3.000 Primogems):</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Durasi diperpanjang jika sisa durasi saat ini ≤ 180 hari.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Primogems harian wajib klaim via login (tidak hangus bertumpuk).</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Adventure Rank (AR) min. Level 5 untuk melihat counter sisa hari.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "100% Legal Multi-Platform Partner",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Pengisian diproses langsung melalui API Partner Resmi HoYoverse (Mihoyo):</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Android, iOS, PC &amp; PSN Supported
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Akses Password / Email
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Garansi 100% Anti-Minus Crystals
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'honkai-star-rail' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Top Up & Kirim Gift ke Teman",
                  content: (
                    <>
                      <p>Isi ulang Oneiric Shards untuk akun sendiri atau kirim sebagai <strong className="text-foreground">Hadiah ke Teman / Kerabat</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka HSR ➔ Masuk Menu Ponsel / Profil (pojok kiri atas).</li>
                        <li>Salin <strong>UID 9-digit</strong> akunmu (atau UID temanmu).</li>
                        <li>Pilih Server (<strong className="text-foreground">Asia, America, Europe, TW/HK/MO</strong>).</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Shards langsung dikirim instan!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Bonus 2X Double Oneiric Shards",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Top-up pertama per nominal mendapatkan <strong className="text-emerald-400">Bonus 2X Lipat Shards</strong>:</p>
                      <ul className="space-y-1 text-[11px]">
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>60 Shards (Rp 14.414)</span>
                          <strong className="text-emerald-400">Bonus +120</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>330 Shards (Rp 71.171)</span>
                          <strong className="text-emerald-400">Bonus +600</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>1.090 Shards (Rp 224.324)</span>
                          <strong className="text-emerald-400">Bonus +1.960</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>2.240 Shards (Rp 431.532)</span>
                          <strong className="text-emerald-400">Bonus +3.960</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>8.080 Shards (Rp 1.440.541)</span>
                          <strong className="text-emerald-400 font-bold">Bonus +12.960!</strong>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Express Supply Pass (Rp 71.171)",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Mendapatkan <strong className="text-foreground">300 Oneiric Shards instan</strong> + <strong className="text-primary">90 Stellar Jades harian</strong> selama 30 hari (Total 3.000 Stellar Jades):</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span>Bisa dikirimkan langsung sebagai kado Pass ke teman/kerabat.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span>Durasi hanya dapat ditambah jika sisa durasi saat ini ≤ 180 hari.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Rincian Harga & Garansi Official",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Top up resmi dari Rp 14.414 s/d Rp 1.440.541 via API Server Resmi HoYoverse:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Login / Password Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Garansi Bebas Risiko Banned 100%
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Cash-Points Loyalty NexaPay
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'zenless-zone-zero' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Top Up ZZZ Monochromes",
                  content: (
                    <>
                      <p>Isi ulang Monochromes instan menggunakan <strong className="text-foreground">UID &amp; Server ZZZ</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka game ZZZ ➔ Masuk menu Pause/Profil ➔ Salin <strong className="text-foreground">UID 9-digit</strong>.</li>
                        <li>Masukkan UID &amp; pilih Server (<strong className="text-foreground">Asia, America, Europe, TW/HK/MO</strong>).</li>
                        <li>Pilih nominal Monochromes / Inter-Knot Membership &amp; bayar.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Monochromes langsung masuk instan!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Bonus 2X Double Monochromes",
                  iconBg: "bg-amber-500/15 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Pembelian pertama per nominal mendapatkan <strong className="text-emerald-400">Bonus 2X Lipat Monochromes</strong>:</p>
                      <ul className="space-y-1 text-[11px]">
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>60 Monochromes (Rp 14.414)</span>
                          <strong className="text-emerald-400">Bonus +60</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>300 Monochromes (Rp 71.171)</span>
                          <strong className="text-emerald-400">Bonus +300</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>980 Monochromes (Rp 224.324)</span>
                          <strong className="text-emerald-400">Bonus +980</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>1.980 Monochromes (Rp 431.532)</span>
                          <strong className="text-emerald-400">Bonus +1.980</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>3.280 Monochromes (Rp 719.820)</span>
                          <strong className="text-emerald-400">Bonus +3.280</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>6.480 Monochromes (Rp 1.440.541)</span>
                          <strong className="text-emerald-400 font-bold">Bonus +6.480!</strong>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Keanggotaan Inter-Knot (Rp 71.171)",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Dapatkan total <strong className="text-primary font-bold">3.000 Monochromes</strong> selama 30 hari:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">300 Monochromes instan</strong> langsung setelah pembelian.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">90 Monochromes harian</strong> saat login setiap jam 04:00 server.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Batas perpanjangan durasi sisa <code className="text-purple-300">≤ 179 hari</code>.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Official Direct Server HoYoverse",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Support PS5, PC, App Store, Google Play, &amp; Epic Games Store:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Login / Password Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Garansi Bebas Risiko Banned 100%
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Cash-Points Loyalty NexaPay
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'valorant' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Beli & Kirim VP VALORANT",
                  content: (
                    <>
                      <p>Isi ulang VALORANT Points (VP) instan menggunakan <strong className="text-foreground">Riot ID &amp; Tagline</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka VALORANT ➔ Salin <strong className="text-foreground">Riot ID + Tagline</strong> di profil (Contoh: <code className="text-primary">PlayerName#ID1</code>).</li>
                        <li>Masukkan Riot ID pada form NexaPay di atas (atau Riot ID teman untuk kirim gift).</li>
                        <li>Pilih paket VP yang kamu inginkan &amp; tuntaskan pembayaran.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> VP otomatis masuk ke akun VALORANT-mu!
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Cara Upgrade Battle Pass (1.000 VP)",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Unlock Battle Pass Premium seharga <strong className="text-primary font-bold">1.000 VP (Rp 112.000)</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Beli paket <strong className="text-foreground">1.000 VP</strong> di NexaPay.</li>
                        <li>Buka game VALORANT ➔ klik menu <strong className="text-foreground">&quot;Battle Pass&quot;</strong> di pojok kiri atas.</li>
                        <li>Di pojok kanan bawah, klik <strong className="text-purple-300 font-bold">&quot;Upgrade Battle Pass&quot;</strong> seharga 1.000 VP.</li>
                      </ol>
                      <p className="text-[10px] italic pt-1 border-t border-border/20">
                        🎉 Buka Skin Senjata, Gun Buddies, Cards, &amp; Radianite Points!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Store Rotation & Night Market",
                  iconBg: "bg-rose-500/15 text-rose-400",
                  borderGlow: "border-rose-500/30 hover:border-rose-500/50",
                  content: (
                    <>
                      <p>Gunakan VP untuk belanja skin Senjata impian:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>Beli skin Vandal/Phantom legendaris (Kuronami, Prime, Reaver, Sovereign, Elderflame) di rotasi Store harian.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>Dapatkan diskon super miring untuk skin incaranmu saat acara <strong className="text-foreground">VALORANT Night Market</strong> tiba!</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Garansi Direct API Riot Games",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>475 s/d 11.000 VP berkisar dari <strong className="text-foreground">Rp 56.000 s/d Rp 1.120.000</strong>:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> 100% Direct API Resmi Riot Games
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Butuh Password / Login Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'steam-wallet' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Beli Steam Wallet Code",
                  content: (
                    <>
                      <p>Beli voucher Steam Wallet IDR resmi instan via NexaPay:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Pilih nominal Steam Wallet Code yang kamu inginkan.</li>
                        <li>Masukkan alamat email &amp; nomor WA aktif untuk pengiriman kode.</li>
                        <li>Tinjau pesanan &amp; selesaikan pembayaran. Kode voucher langsung dikirim!</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Kode voucher muncul di layar &amp; email instan!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Cara Redeem di Steam App & Web",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Panduan memasukkan kode voucher 15-16 digit:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Via Aplikasi Steam Client PC:</strong> Login ➔ klik nama profil di pojok kanan atas ➔ pilih <strong className="text-foreground">View My Wallet</strong> ➔ klik <strong className="text-sky-400">Redeem a Steam Gift Card or Wallet Code</strong>.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Via Browser:</strong> Kunjungi <code className="text-sky-300 break-all font-mono text-[10px]">store.steampowered.com/account/redeemwalletcode</code>.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Gem,
                  title: "Beli Game PC & Item Community Market",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Gunakan saldo IDR Steam Wallet tanpa kartu kredit:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Beli Game AAA/Indie terbaru di Steam Store saat disensor diskon Steam Summer/Winter Sales.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Beli item in-game, Skin CS2, Inscribed Arcana Dota 2, TF2 Keys, &amp; Battle Pass di <strong className="text-foreground">Steam Community Market</strong>.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Garansi Official Voucher Valve",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Tersedia dari nominal <strong className="text-foreground">IDR 12.000 s/d IDR 600.000</strong>:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> 100% Kode Voucher Resmi Valve Corp
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Butuh Password / Login Steam
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'roblox' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Beli & Redeem Gift Card",
                  content: (
                    <>
                      <p>Kode PIN voucher dikirimkan langsung via <strong className="text-foreground">Email &amp; WhatsApp</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Beli voucher Roblox Gift Card di NexaPay &amp; bayar.</li>
                        <li>Buka browser, login akunmu di <strong className="text-primary">roblox.com/redeem</strong>.</li>
                        <li>Tempel kode PIN voucher yang kamu terima, lalu klik <strong className="text-foreground">Redeem</strong>. Saldo otomatis masuk ke Roblox Balance!</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Kode voucher dikirim instan 24 jam!
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Cara Aktivasi Roblox Premium",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Langganan Roblox Premium menggunakan saldo Roblox Balance:</p>
                      <ul className="space-y-1 text-[11px]">
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>USD $4.99</span>
                          <strong className="text-purple-300">Premium 450 Robux / bln</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>USD $9.99</span>
                          <strong className="text-purple-300">Premium 1000 Robux / bln</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>USD $19.99</span>
                          <strong className="text-purple-300">Premium 2200 Robux / bln</strong>
                        </li>
                      </ul>
                      <p className="text-[10px] pt-1">
                        💡 Buka <strong className="text-foreground">roblox.com/premium</strong> ➔ pilih paket ➔ gunakan Roblox Balance sebagai metode bayar.
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Item Virtual GRATIS Setiap Redeem",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Bonus eksklusif spesial dari Roblox Corporation:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>Setiap kali menukarkan kode Gift Card di <strong className="text-foreground">roblox.com/redeem</strong>, kamu otomatis menerima <strong className="text-emerald-400 font-bold">Exclusive Virtual Item GRATIS</strong>!</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>Item virtual eksklusif langsung dikirimkan ke Inventory Avatar akun Roblox-mu secara otomatis.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Gem,
                  title: "Penggunaan Saldo Gift Card",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Roblox Gift Card memberikan fleksibilitas penuh untuk akunmu:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Membeli Robux:</strong> Untuk avatar outfit, skin, aksesoris, emote, &amp; animasi avatar.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Game Pass Eksklusif:</strong> Beli VIP Pass di Blox Fruits, Adopt Me, Brookhaven, Tower of Hell, dll.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Trading Item:</strong> Buka akses perdagangan item langka antar pemain.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Voucher Resmi Roblox Corp",
                  iconBg: "bg-amber-500/15 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Nominal tersedia dari <strong className="text-foreground">Rp 50.000 s/d Rp 500.000</strong>:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> 100% Kode Voucher Valid &amp; Resmi
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Membutuhkan Password Roblox
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'pubg-mobile' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Temukan Character ID PUBG",
                  content: (
                    <>
                      <p>Isi ulang UC instan menggunakan <strong className="text-foreground">Player ID (Character ID)</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka PUBG Mobile ➔ Masuk ke profil akun (ketuk foto avatar di pojok kiri atas).</li>
                        <li>Salin <strong>Character ID 5-12 digit</strong> di bawah nama profilmu.</li>
                        <li>Masukkan ID di form NexaPay di atas, pilih paket UC &amp; tuntaskan pembayaran.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> UC otomatis dikirim via Midasbuy Direct API!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Royale Pass & Skema Bonus UC",
                  iconBg: "bg-amber-500/15 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Top-up UC dengan tambahan bonus ekstra permanen:</p>
                      <ul className="space-y-1 text-[11px] border-b border-border/20 pb-2">
                        <li className="flex items-center justify-between">
                          <span>300 UC (Rp 81.000)</span>
                          <strong className="text-emerald-400">Bonus +25 UC (Total 325)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>600 UC (Rp 162.000)</span>
                          <strong className="text-emerald-400">Bonus +60 UC (Total 660)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>1.500 UC (Rp 405.000)</span>
                          <strong className="text-emerald-400">Bonus +300 UC (Total 1.800)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>6.000 UC (Rp 1.620.000)</span>
                          <strong className="text-emerald-400 font-bold">Bonus +2.100 UC (Total 8.100)!</strong>
                        </li>
                      </ul>
                      <p className="text-[10px] pt-1">
                        💡 Royale Pass Upgrade: Cukup beli <strong className="text-foreground">325 UC</strong> (Elite) atau <strong className="text-foreground">660 UC</strong> (Elite Plus).
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Gacha Crate & X-Suit Upgrade",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Gunakan saldo UC dari NexaPay untuk membuka konten eksklusif in-game:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Unlock &amp; upgrade Baju Armor legendaris <strong className="text-foreground">X-Suit Series</strong>.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Putar gacha <strong className="text-foreground">Mythic Forge Draw</strong> &amp; Lucky Spin Skin Senjata Upgrade.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Membuka Custom Crate, Premium Crate, &amp; Emote Mitos terbatas.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Direct API Official Midasbuy Partner",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>60 s/d 8.100 UC berkisar dari <strong className="text-foreground">Rp 16.000 s/d Rp 1.620.000</strong>:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Direct Server Midasbuy &amp; Tencent Cloud
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Password / Email Akun Game
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'wild-rift' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Top Up Wild Cores",
                  content: (
                    <>
                      <p>Isi ulang Wild Cores instan menggunakan <strong className="text-foreground">Riot ID &amp; Tagline</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka LoL: Wild Rift ➔ Salin <strong className="text-foreground">Riot ID + Tagline</strong> di profil (Contoh: <code className="text-primary">WildRiftHero#SEA</code>).</li>
                        <li>Masukkan Riot ID pada form NexaPay di atas.</li>
                        <li>Pilih paket Wild Cores / Bundle &amp; tuntaskan pembayaran.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Wild Cores langsung masuk secara real-time!
                      </p>
                    </>
                  )
                },
                {
                  icon: Heart,
                  title: "Kirim Gift & Wishlist Teman",
                  iconBg: "bg-rose-500/15 text-rose-400",
                  borderGlow: "border-rose-500/30 hover:border-rose-500/50",
                  content: (
                    <>
                      <p>Gunakan saldo Wild Cores dari NexaPay untuk memberikan kado skin / champion ke sahabatmu:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-rose-400 font-bold">•</span>
                          <span><strong className="text-foreground">In-Game Gifting:</strong> Pilih item di Store ➔ ketuk <strong className="text-foreground">Purchase</strong> ➔ pilih ikon <strong className="text-rose-400">Gift</strong> di sebelah kiri &amp; sertakan pesan manis.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-rose-400 font-bold">•</span>
                          <span><strong className="text-foreground">Wishlist Profil:</strong> Kunjungi laman profil teman ➔ ketuk ikon <strong className="text-rose-400 font-bold">Love (❤️)</strong> di sebelah kanan.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Gem,
                  title: "Fungsi Wild Cores & Bundles",
                  iconBg: "bg-cyan-500/15 text-cyan-400",
                  borderGlow: "border-cyan-500/30 hover:border-cyan-500/50",
                  content: (
                    <>
                      <p>Wild Core adalah mata uang premium resmi League of Legends: Wild Rift:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>Membuka Champion baru, Skin Legendary/Supreme, Aksesoris Pintu Keluar, Emote &amp; Wild Pass.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>Tersedia paket khusus <strong className="text-foreground">Stellacorn's Gift</strong> (Rp 56.000) &amp; <strong className="text-foreground">Celestial Blessing</strong> (Rp 395.000).</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Garansi Direct Server Riot Games",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Top up terhubung langsung ke API Server Resmi Riot Games SEA:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Login / Password Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Jaminan Safe Account 100%
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'arena-of-valor' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 tablet:grid-cols-3"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Temukan Player ID & Top Up Vouchers",
                  content: (
                    <>
                      <p>Isi ulang Vouchers Arena of Valor (AOV) resmi instan hanya butuh <strong className="text-foreground">Player ID Akun Garena</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka game AOV ➔ Ketuk ikon <strong className="text-foreground">Pengaturan (Settings)</strong> ➔ scroll ke bawah pilih menu <strong className="text-foreground">Umum</strong> ➔ salin <strong className="text-foreground">Player ID</strong>.</li>
                        <li>Masukkan Player ID pada kolom form NexaPay di atas.</li>
                        <li>Pilih nominal Voucher AOV favoritmu &amp; tuntaskan pembayaran.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Vouchers otomatis masuk ke dompet in-game AOV secara real-time!
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Valor Pass & Skin Mirage Draw",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Gunakan Vouchers AOV dari NexaPay untuk membuka konten eksklusif terbaru:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Valor Pass Normal:</strong> Cukup pilih paket <strong className="text-primary">230 Vouchers</strong> (Rp 45.045) untuk unlock pass level 1.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Valor Pass Elite:</strong> Pilih paket <strong className="text-primary">470 Vouchers</strong> (Rp 90.090) untuk unlock 15 Level instan + skin eksklusif.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Dimensional Draw:</strong> Kumpulkan Vouchers untuk gacha skin Dimensional Breaker SS &amp; Supreme Hero.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Garansi Server Garena 100% Legal",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Sistem top-up NexaPay terhubung langsung ke Server Garena AOV Indonesia secara otomatis:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Perlu Login / Password Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Bebas Risiko Banned / Safe Account
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Dapat 0.5% Nexa Loyalty Cash-Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'call-of-duty-mobile' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 tablet:grid-cols-3"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Temukan OpenID & Top Up CP",
                  content: (
                    <>
                      <p>Top up CP CODM diproses langsung menggunakan <strong className="text-foreground">OpenID Akun Garena</strong> kamu:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka game CODM ➔ Masuk ke <strong className="text-foreground">Pengaturan (Settings)</strong> ➔ pilih tab <strong className="text-foreground">Lainnya (Legal &amp; Privacy)</strong>.</li>
                        <li>Salin <strong>OpenID</strong> unik milikmu.</li>
                        <li>Tempelkan OpenID di form NexaPay di atas, pilih paket CP, &amp; bayar.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> CP akan langsung dikirimkan ke akunmu dalam hitungan detik!
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Panduan Battle Pass & Mythic Draw",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Dapatkan konten eksklusif CODM musim ini dengan saldo CP dari NexaPay:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Battle Pass Standard:</strong> Cukup top-up <strong className="text-primary">220 CP</strong> untuk klaim skin Karakter &amp; Senjata Epic.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Battle Pass Bundle:</strong> Top-up <strong className="text-primary">520 CP</strong> untuk melompati 12 Level BP instan + bonus frame unik.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Mythic Armory:</strong> Saldo CP langsung dapat dipakai putar Lucky Draw di Armory resmi game.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "100% Garansi Legal Server Garena",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Seluruh transaksi Call of Duty: Mobile terintegrasi langsung dengan API Server Resmi Garena Indonesia:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Password / Login Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Jaminan Bebas Risiko Banned 100%
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'free-fire-max' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Top Up FF MAX?",
                  content: (
                    <>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Masukkan <strong className="text-foreground">Player ID Free Fire MAX-mu</strong>.</li>
                        <li>Masukkan jumlah <strong className="text-primary">Diamond</strong> yang Kamu inginkan.</li>
                        <li>Pilih cara pembayaran yang Kamu inginkan.</li>
                        <li>Klik tombol <strong className="text-foreground">&quot;Beli Sekarang&quot;</strong> untuk menyelesaikan transaksi.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Diamond akan langsung ditambahkan ke akun Free Fire MAX secara instan!
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Cara Membeli Booyah Pass di FF MAX?",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Isi ulang <strong className="text-primary">399 Diamond</strong> untuk Premium, dan <strong className="text-primary">899 Diamond</strong> untuk Premium Plus:</p>
                      <ol className="space-y-1 list-decimal list-inside text-[11px]">
                        <li>Beli Diamond di Free Fire MAX via NexaPay.</li>
                        <li>Begitu memiliki cukup Diamond, buka aplikasi Free Fire MAX.</li>
                        <li>Pada bagian bawah kiri layar utama, klik <strong>&quot;Booyah Pass&quot;</strong>.</li>
                        <li>Klik tombol <strong>&quot;Upgrade&quot;</strong> dan beli Premium (399 Diamond) atau Premium Plus (899 Diamond).</li>
                      </ol>
                    </>
                  )
                },
                {
                  icon: Tag,
                  title: "Diamonds Free Fire MAX Harga di Indonesia",
                  iconBg: "bg-amber-500/10 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Diamonds sebanyak 5 hingga 73.100 memiliki kisaran harga terjangkau dari Rp 901 hingga Rp 9.009.009 di NexaPay:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {game.denominations.slice(0, 5).map((d: Denomination) => (
                          <div key={d.id} className="flex items-center justify-between py-0.5 border-b border-border/30 last:border-0 text-[11px]">
                            <span className="font-semibold text-foreground">{d.label}</span>
                            <span className="font-mono text-primary font-bold">{formatCurrency(d.isFlashSale && d.flashSalePrice ? d.flashSalePrice : d.price)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Akun & Item FF di FF MAX?",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Berkat teknologi <strong className="text-emerald-400">Firelink</strong>, Anda dapat masuk ke Free Fire MAX menggunakan akun Free Fire yang sudah ada dan mengakses semua progres Anda.</p>
                      <p className="pt-1 border-t border-border/30">
                        💡 Mode permainan dapat dimainkan lintas platform (cross-play).
                      </p>
                    </>
                  )
                },
                {
                  icon: Gamepad2,
                  title: "Perbedaan FF MAX dengan Free Fire?",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Free Fire MAX menawarkan grafis HD, animasi efek ultra, serta gameplay yang ditingkatkan dibandingkan dengan Free Fire asli.</p>
                    </>
                  )
                }
              ]}
            />
          ) : (
            <FaqAccordionSection
              gridCols="grid-cols-1 tablet:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: `Cara Top Up ${game.name}?`,
                  content: (
                    <>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Masukkan <strong className="text-foreground">User ID {game.name}</strong> kamu dengan benar.</li>
                        <li>Pilih nominal <strong className="text-primary">{currencyLabel}</strong> yang ingin dibeli.</li>
                        <li>Pilih metode pembayaran favorit (QRIS, E-Wallet, atau Virtual Account).</li>
                        <li>Klik tombol <strong className="text-foreground">Beli Sekarang</strong> &amp; selesaikan pembayaran.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Item akan masuk ke akun game kamu secara instan!
                      </p>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Keamanan & Garansi Transaksi",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Seluruh transaksi {game.name} diproses 100% legal melalui server partner resmi. Saldo game Anda dijamin aman tanpa risiko banned.</p>
                    </>
                  )
                },
                {
                  icon: CreditCard,
                  title: "Metode Pembayaran Apa Saja?",
                  iconBg: "bg-emerald-500/10 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>NexaPay mendukung seluruh saluran pembayaran utama di Indonesia tanpa biaya tersembunyi:</p>
                      <ul className="space-y-1.5 list-disc list-inside text-[11px]">
                        <li><strong>QRIS Instant:</strong> BCA, Mandiri, BRI, BNI, Dana, OVO, ShopeePay.</li>
                        <li><strong>Virtual Account:</strong> VA BCA, Mandiri, BRI, BNI, Permata, CIMB.</li>
                        <li><strong>E-Wallet:</strong> GoPay, ShopeePay, Dana, OVO.</li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Tag,
                  title: `Daftar Harga ${currencyLabel} ${game.name}`,
                  iconBg: "bg-amber-500/10 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Berikut sampel harga pilihan di NexaPay:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {game.denominations.slice(0, 5).map((d: Denomination) => (
                          <div key={d.id} className="flex items-center justify-between py-0.5 border-b border-border/30 last:border-0 text-[11px]">
                            <span className="font-semibold text-foreground">{d.label}</span>
                            <span className="font-mono text-primary font-bold">{formatCurrency(d.isFlashSale && d.flashSalePrice ? d.flashSalePrice : d.price)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                }
              ]}
            />
          )}
        </div>
  );
}
