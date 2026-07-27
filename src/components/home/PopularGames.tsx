'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import type { ProductWithDenominations } from '@/types';
import CyberGameCard from '@/components/shared/CyberGameCard';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.33, 1, 0.68, 1] as const },
  }),
};

export default function PopularGames({ games }: { games: ProductWithDenominations[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const popularGames = games.filter((g) => g.category === 'GAME_TOPUP' && g.isPopular).slice(0, 8);

  return (
    <section ref={ref} className="section-padding">
      <div className="container-app">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="flex items-end justify-between mb-8 tablet:mb-10"
        >
          <div>
            <p className="label mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Paling Populer
            </p>
            <h2 className="heading-3">Game Populer</h2>
          </div>
          <Link
            href="/topup"
            className="hidden tablet:flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5" />
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
        <div className="flex justify-center mt-8 tablet:hidden">
          <Link
            href="/topup"
            className="btn-secondary px-6 py-2.5 text-sm"
          >
            Lihat Semua Game
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
