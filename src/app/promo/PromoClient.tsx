'use client';

import Link from 'next/link';
import { Tag, Clock, Copy, ArrowRight } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { promotions } from '@/data/testimonials';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PromoItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  discount: string;
  type: string;
  endDate: string;
}

export default function PromoClient({ dbPromos = [] }: { dbPromos?: PromoItem[] }) {
  const displayPromos = dbPromos.length > 0 ? dbPromos : promotions;

  return (
    <>
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 bg-background">
        <div className="container-app">
          <div className="mb-8">
            <h1 className="heading-2 mb-2">Promo & Diskon Eksklusif</h1>
            <p className="body-default text-muted-foreground">Klaim voucher diskon dan promo cashback top up game terbaik di NexaPay</p>
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 tablet:gap-6">
            {displayPromos.map((promo, i) => (
              <div
                key={promo.id}
                className="bg-[#121620] border border-white/10 rounded-2xl overflow-hidden group hover:border-brand-500/40 transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-brand flex flex-col justify-between relative"
              >
                <div>
                  {/* Banner gradient */}
                  <div className={cn(
                    'h-36 tablet:h-44 bg-gradient-to-br p-5 tablet:p-6 relative overflow-hidden',
                    i % 4 === 0 && 'from-purple-700 via-indigo-700 to-slate-900',
                    i % 4 === 1 && 'from-cyan-700 via-blue-700 to-slate-900',
                    i % 4 === 2 && 'from-emerald-700 via-teal-700 to-slate-900',
                    i % 4 === 3 && 'from-brand-600 via-brand-700 to-slate-900'
                  )}>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-black tracking-wider uppercase mb-2.5 shadow-md">
                        <Tag className="w-3.5 h-3.5 text-amber-300" />
                        DISKON {promo.discount}{promo.type === 'PERCENTAGE' ? '%' : ''}
                      </div>
                      <h3 className="text-xl tablet:text-2xl font-black font-heading text-white tracking-tight leading-snug">{promo.title}</h3>
                    </div>
                  </div>

                  <div className="p-5 tablet:p-6">
                    <p className="text-xs tablet:text-sm text-muted-foreground mb-4 leading-relaxed">{promo.subtitle}</p>

                    {/* Voucher Ticket Code Box */}
                    <div className="flex items-center gap-2 mb-4 p-1.5 pl-3 rounded-xl bg-[#181E2B] border border-dashed border-brand-500/30 group-hover:border-brand-500 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Kode Kupon</p>
                        <span className="font-mono text-sm tablet:text-base font-black text-brand-500 tracking-wider truncate block">{promo.code}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(promo.code);
                          toast.success(`Kode promo ${promo.code} berhasil disalin! 🎟️`);
                        }}
                        className="px-3.5 py-2 rounded-lg btn-primary text-white text-xs font-bold shadow-brand transition-all cursor-pointer flex items-center gap-1.5"
                        aria-label="Salin Kode Promo"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 tablet:px-6 tablet:pb-6 pt-3.5 sm:pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    <span suppressHydrationWarning>Berlaku s/d {new Date(promo.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <Link href="/topup" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-xs font-bold text-brand-500 active:scale-95 transition-all">
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
