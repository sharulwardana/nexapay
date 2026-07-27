'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag, Clock, Copy, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { promotions } from '@/data/testimonials';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function PromoPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24">
        <div className="container-app">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="heading-2 mb-2">🔥 Promo & Diskon</h1>
            <p className="body-default mb-8">Jangan lewatkan penawaran terbaik dari NexaPay</p>
          </motion.div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 tablet:gap-6">
            {promotions.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden group"
              >
                {/* Banner gradient */}
                <div className={cn(
                  'h-32 tablet:h-40 bg-gradient-to-br p-5 tablet:p-6 relative',
                  i % 4 === 0 && 'from-violet-600 to-purple-700',
                  i % 4 === 1 && 'from-cyan-600 to-blue-700',
                  i % 4 === 2 && 'from-emerald-600 to-teal-700',
                  i % 4 === 3 && 'from-orange-600 to-red-700'
                )}>
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-bold mb-2">
                      <Tag className="w-3 h-3" />
                      DISKON {promo.discount}{promo.type === 'PERCENTAGE' ? '%' : ''}
                    </div>
                    <h3 className="text-lg tablet:text-xl font-bold text-white">{promo.title}</h3>
                  </div>
                </div>

                <div className="p-4 tablet:p-5">
                  <p className="text-sm text-muted-foreground mb-3">{promo.subtitle}</p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-dashed border-primary/30">
                      <span className="font-mono text-sm font-bold gradient-text">{promo.code}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(promo.code);
                        toast.success('Kode promo disalin!');
                      }}
                      className="p-2.5 rounded-lg border border-border hover:bg-primary/10 hover:border-primary/30 transition-all"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {mounted ? (
                        <span>Berlaku hingga {new Date(promo.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      ) : (
                        <span>Memuat...</span>
                      )}
                    </div>
                    <Link href="/topup" className="text-primary hover:underline flex items-center gap-0.5">
                      Pakai <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
