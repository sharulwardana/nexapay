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

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="flex gap-1.5 overflow-x-auto no-scrollbar pb-4 mb-8"
        >
          <button
            onClick={() => setActiveCategory('ALL')}
            className={cn(
              'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border',
              activeCategory === 'ALL'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground'
            )}
          >
            Semua
          </button>
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Gamepad2;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap',
                  activeCategory === cat.id
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground'
                )}
              >
                <Icon className="w-3 h-3" />
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 tablet:gap-6">
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
