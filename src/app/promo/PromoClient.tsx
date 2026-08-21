'use client';

import Link from 'next/link';
import { Tag, Clock, Copy, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { promotions } from '@/data/testimonials';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function PromoClient() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 aurora-bg">
        <div className="container-app">
          <div className="mb-8">
            <h1 className="heading-2 mb-2">🔥 Promo & Diskon</h1>
            <p className="body-default">Jangan lewatkan penawaran terbaik dari NexaPay</p>
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 tablet:gap-6">
            {promotions.map((promo, i) => (
              <div
                key={promo.id}
                className="glass-card overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[0_15px_35px_rgba(249,115,22,0.15)] rounded-3xl flex flex-col justify-between relative"
              >
                <div>
                  {/* Banner gradient */}
                  <div className={cn(
                    'h-36 tablet:h-44 bg-gradient-to-br p-5 tablet:p-6 relative overflow-hidden',
                    i % 4 === 0 && 'from-violet-600 via-purple-600 to-indigo-800',
                    i % 4 === 1 && 'from-cyan-600 via-blue-600 to-indigo-800',
                    i % 4 === 2 && 'from-emerald-600 via-teal-600 to-cyan-800',
                    i % 4 === 3 && 'from-amber-500 via-orange-600 to-rose-700'
                  )}>
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white text-[11px] font-black tracking-wider uppercase mb-2.5 shadow-md">
                        <Tag className="w-3.5 h-3.5 text-amber-300" />
                        DISKON {promo.discount}{promo.type === 'PERCENTAGE' ? '%' : ''}
                      </div>
                      <h3 className="text-xl tablet:text-2xl font-black font-heading text-white tracking-tight leading-snug">{promo.title}</h3>
                    </div>
                  </div>

                  <div className="p-5 tablet:p-6">
                    <p className="text-xs tablet:text-sm text-muted-foreground mb-4 leading-relaxed">{promo.subtitle}</p>

                    {/* Voucher Ticket Code Box */}
                    <div className="flex items-center gap-2 mb-4 p-1.5 pl-3 rounded-2xl bg-muted/40 border border-dashed border-primary/40 group-hover:border-primary transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Kode Kupon</p>
                        <span className="font-mono text-sm tablet:text-base font-black text-primary tracking-wider truncate block">{promo.code}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(promo.code);
                          toast.success(`Kode promo ${promo.code} berhasil disalin! 🎟️`);
                        }}
                        className="px-3.5 py-2 rounded-xl gradient-primary text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                        aria-label="Salin Kode Promo"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 tablet:px-6 tablet:pb-6 pt-0 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Berlaku s/d {new Date(promo.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <Link href="/topup" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline group-hover:translate-x-0.5 transition-transform">
                    <span>Gunakan</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
