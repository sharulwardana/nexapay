'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Gamepad2, Smartphone, Zap, Gift, Tv, Wallet, Ticket, Wifi } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import type { ProductWithDenominations } from '@/types';
import CyberGameCard from '@/components/shared/CyberGameCard';

const iconMap: Record<string, React.ElementType> = {
  Gamepad2, Ticket, Smartphone, Wifi, Zap, Gift, Tv, Wallet,
};

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.04, ease: [0.33, 1, 0.68, 1] as const },
  }),
};

export default function TrendingProducts({ games }: { games: ProductWithDenominations[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredProducts =
    activeCategory === 'ALL'
      ? games.filter((p) => p.isFeatured).slice(0, 12)
      : games.filter((p) => p.category === activeCategory).slice(0, 12);

  return (
    <section ref={ref} className="section-padding surface">
      <div className="container-app">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col tablet:flex-row tablet:items-end tablet:justify-between gap-3 mb-8"
        >
          <div>
            <p className="label mb-2">Trending</p>
            <h2 className="heading-3">Produk Trending</h2>
          </div>
          <Link
            href={activeCategory === 'GAME_TOPUP' ? '/topup' : activeCategory === 'ALL' ? '/topup' : `/products?category=${activeCategory}`}
            className="hidden tablet:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-xs font-bold text-primary transition-all duration-200 group shadow-sm"
          >
            <span>{activeCategory === 'GAME_TOPUP' || activeCategory === 'ALL' ? 'Lihat Semua Game' : 'Lihat Produk Digital'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Category Tabs — Framer Motion Sliding Pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-8"
        >
          <button
            onClick={() => setActiveCategory('ALL')}
            className={cn(
              'relative flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap border border-transparent',
              activeCategory === 'ALL'
                ? 'text-white'
                : 'text-muted-foreground border-border/60 bg-card/40 hover:text-foreground hover:border-border'
            )}
          >
            {activeCategory === 'ALL' && (
              <motion.div
                layoutId="activeCategoryPill"
                className="absolute inset-0 gradient-primary rounded-full z-0 shadow-md shadow-primary/25"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">Semua</span>
          </button>
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Gamepad2;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap border border-transparent',
                  isActive
                    ? 'text-white'
                    : 'text-muted-foreground border-border/60 bg-card/40 hover:text-foreground hover:border-border'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 gradient-primary rounded-full z-0 shadow-md shadow-primary/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Product Grid — Codashop & UniPin Density (6 Cols) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 tablet:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 tablet:gap-4">
          {filteredProducts.map((product, index) => {
            return (
              <motion.div
                key={product.id}
                custom={index}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={itemVariant}
                className="h-full"
              >
                <CyberGameCard game={product} index={index} />
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Belum ada produk di kategori ini.</p>
          </div>
        )}

        {/* Mobile CTA */}
        <div className="flex justify-center items-center gap-3 mt-8 tablet:hidden flex-wrap">
          <Link href="/topup" className="btn-secondary px-4 py-2.5 text-xs font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-primary" />
            <span>Katalog Game</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/products" className="btn-secondary px-4 py-2.5 text-xs font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>Produk Digital</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
