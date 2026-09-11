'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Search, Gamepad2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductWithDenominations } from '@/types';
import GameCard from '@/components/shared/GameCard';

const categories = [
  { id: 'ALL', label: 'Semua Game' },
  { id: 'MOBA', label: 'MOBA' },
  { id: 'Battle Royale', label: 'Battle Royale' },
  { id: 'RPG', label: 'RPG' },
  { id: 'FPS', label: 'FPS' },
  { id: 'Sandbox', label: 'Sandbox' },
  { id: 'PC Store', label: 'PC & Voucher' },
];

export default function PopularGames({ games }: { games: ProductWithDenominations[] }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const allGameProducts = useMemo(() => {
    return games.filter((g) => g.category === 'GAME_TOPUP' && g.isActive);
  }, [games]);

  const displayedGames = useMemo(() => {
    let list = allGameProducts;

    if (selectedCategory !== 'ALL') {
      list = list.filter((g) => g.subcategory === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          (g.publisher && g.publisher.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allGameProducts, selectedCategory, searchQuery]);

  return (
    <section className="py-6 tablet:py-10 relative">
      <div className="container-app relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 tablet:mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161D2C] border border-[#FF7300]/40 text-[#FF851A] text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <Flame className="w-3.5 h-3.5" />
                <span>Paling Banyak Dimainkan</span>
              </div>
            </div>
            <h2 className="heading-section">Game Populer &amp; Top-Up Instan</h2>
            <p className="body-base mt-1 text-slate-400">
              Pilihan top-up resmi terfavorit gamer dengan proses 1-3 detik otomatis 24 jam
            </p>
          </div>

          <Link
            href="/topup"
            className="hidden tablet:inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#FF7300] transition-colors group flex-shrink-0"
          >
            <span>Katalog Lengkap ({allGameProducts.length} Game)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Instant Discovery Controls: Quick Search + Category Chips */}
        <div className="flex flex-col tablet:flex-row items-stretch tablet:items-center justify-between gap-3 mb-6 p-2 rounded-2xl bg-[#121620] border border-white/10 shadow-sm">
          {/* Quick Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari game (Mobile Legends, Free Fire, Valorant...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0E14] border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF7300] focus:ring-1 focus:ring-[#FF7300]/25 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/10"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Chips Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                    isActive
                      ? 'bg-[#FF7300] text-white shadow-md shadow-[#FF7300]/30'
                      : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter if Filtered */}
        {(selectedCategory !== 'ALL' || searchQuery) && (
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
            <span>
              Menampilkan <strong className="text-white font-bold">{displayedGames.length}</strong> game untuk{' '}
              <span className="text-[#FF7300] font-semibold">
                {selectedCategory !== 'ALL' ? categories.find((c) => c.id === selectedCategory)?.label : ''}
                {searchQuery ? ` "${searchQuery}"` : ''}
              </span>
            </span>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-[#FF7300] hover:underline font-bold"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Games Grid: 2 cols Mobile S/M/L, 3 cols sm, 4 cols tablet, 6 cols desktop & 4K */}
        {displayedGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 tablet:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5 tablet:gap-4">
            {displayedGames.map((game, index) => (
              <div key={game.id} className="h-full">
                <GameCard game={game} index={index} priorityImage={index < 6} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 p-6 rounded-2xl bg-[#121620] border border-white/10 space-y-3">
            <Gamepad2 className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white font-heading">Game Tidak Ditemukan</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ada game yang sesuai dengan kata kunci pencarian Anda. Coba kata kunci lain atau reset filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="btn-secondary px-4 py-2 text-xs font-bold mt-2"
            >
              Tampilkan Semua Game
            </button>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="flex justify-center mt-6 tablet:hidden">
          <Link
            href="/topup"
            className="btn-secondary w-full py-3 text-xs font-bold"
          >
            <span>Katalog Lengkap ({allGameProducts.length} Game)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
