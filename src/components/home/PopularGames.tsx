'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Flame, ArrowRight, TrendingUp } from 'lucide-react';
import type { ProductWithDenominations } from '@/types';
import CyberGameCard from '@/components/shared/CyberGameCard';

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function PopularGames({ games }: { games: ProductWithDenominations[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const popularGames = games.filter((g) => g.category === 'GAME_TOPUP' && g.isPopular).slice(0, 8);

  return (
    <section ref={ref} className="section-padding relative">
      {/* Section background accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-32 top-0 w-[500px] h-[300px] bg-orange-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="container-app relative z-10">
        {/* Section Header — 2026 Style */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="flex items-end justify-between mb-8 tablet:mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Paling Populer</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500">Live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
            <h2 className="heading-3">Game Populer</h2>
            <p className="text-sm text-muted-foreground mt-1">Pilihan terfavorit para gamer Indonesia</p>
          </div>
          <Link
            href="/topup"
            className="hidden tablet:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-all group"
          >
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 tablet:gap-6">
          {popularGames.map((game, index) => {
            return (
              <motion.div
                key={game.id}
                custom={index}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={itemVariants}
                className="h-full"
              >
                <CyberGameCard game={game} index={index} priorityImage={index < 4} />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex justify-center mt-8 tablet:hidden"
        >
          <Link
            href="/topup"
            className="btn-primary px-6 py-2.5 text-sm btn-glow"
          >
            Lihat Semua Game
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
