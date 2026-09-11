'use client';

import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import type { ProductWithDenominations } from '@/types';
import GameCard from '@/components/shared/GameCard';

export default function PopularGames({ games }: { games: ProductWithDenominations[] }) {
  const popularGames = games.filter((g) => g.category === 'GAME_TOPUP' && g.isPopular).slice(0, 12);

  return (
    <section className="py-6 tablet:py-10 relative">
      <div className="container-app relative z-10">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 tablet:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161D2C] border border-[#FF7300]/40 text-[#FF851A] text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <Flame className="w-3.5 h-3.5" />
                <span>Paling Banyak Dimainkan</span>
              </div>
            </div>
            <h2 className="heading-section">Game Populer</h2>
            <p className="body-base mt-1 text-slate-400">
              Pilihan top-up terfavorit para gamer dengan konfirmasi akun instan
            </p>
          </div>

          <Link
            href="/topup"
            className="hidden tablet:inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#FF7300] transition-colors group"
          >
            <span>Lihat Semua Game</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Games Grid: 2 cols Mobile, 3 cols sm, 4 cols tablet, 6 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 tablet:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5 tablet:gap-4">
          {popularGames.map((game, index) => (
            <div key={game.id} className="h-full">
              <GameCard game={game} index={index} priorityImage={index < 6} />
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="flex justify-center mt-6 tablet:hidden">
          <Link
            href="/topup"
            className="btn-secondary w-full py-3 text-xs font-bold"
          >
            <span suppressHydrationWarning>Lihat Semua ({popularGames.length > 0 ? games.filter((g) => g.category === 'GAME_TOPUP').length : 0}+ Game)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
