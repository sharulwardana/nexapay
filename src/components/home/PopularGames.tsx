'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Flame, ArrowRight, Star } from 'lucide-react';
import type { ProductWithDenominations } from '@/types';

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

  const popularGames = games.filter((g) => g.isPopular).slice(0, 8);

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
        <div className="grid grid-cols-3 tablet:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 tablet:gap-4">
          {popularGames.map((game, index) => {
            return (
              <motion.div
                key={game.id}
                custom={index}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={itemVariants}
              >
                <Link
                  href={`/topup/${game.slug}`}
                  className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-square bg-muted/30 overflow-hidden">
                    <Image
                      src={game.image}
                      alt={game.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
                    {game.isPopular && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className="flex items-center gap-1 bg-orange-500/90 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Hot</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 tablet:p-4 text-center">
                    <h3 className="font-bold text-sm tablet:text-base text-foreground line-clamp-1 mb-0.5 group-hover:text-primary transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-[10px] tablet:text-xs text-muted-foreground line-clamp-1">
                      {game.publisher}
                    </p>
                  </div>
                </Link>
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
