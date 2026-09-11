'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Gamepad2 } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import type { ProductWithActiveDenominations } from '@/types';
import GameCard from '@/components/shared/GameCard';

const subcategories = ['Semua', 'MOBA', 'Battle Royale', 'RPG', 'FPS', 'Sandbox'];

export default function TopUpClient({ games }: { games: ProductWithActiveDenominations[] }) {
  const [search, setSearch] = useState('');
  const [activeSubcat, setActiveSubcat] = useState('Semua');

  const filteredGames = useMemo(() => {
    let result = games.filter((g) => g.isActive);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.publisher?.toLowerCase().includes(q)
      );
    }
    if (activeSubcat !== 'Semua') {
      result = result.filter((g) => g.subcategory === activeSubcat);
    }
    return result;
  }, [search, activeSubcat, games]);

  return (
    <>
      <main className="min-h-screen pt-24 tablet:pt-28 pb-20 relative overflow-hidden">
        <div className="container-app relative z-10">
          {/* Page Header */}
          <div className="mb-6 tablet:mb-8 text-center tablet:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7300]/10 border border-[#FF7300]/25 text-[#FF7300] text-xs font-bold uppercase tracking-wider mb-3 mx-auto tablet:mx-0">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Katalog Top-Up Resmi</span>
            </div>
            <h1 className="heading-hero mb-2">
              Katalog Top Up Game
            </h1>
            <p className="body-lead max-w-xl text-slate-400 mx-auto tablet:mx-0">
              Pilih game favoritmu dan beli diamond, voucher, atau cash game dengan transaksi instan 24 jam nonstop.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col tablet:flex-row gap-3 tablet:gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari nama game... (Contoh: Mobile Legends, Free Fire, Valorant)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#121620] border border-white/12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF7300] focus:ring-2 focus:ring-[#FF7300]/20 shadow-sm transition-all"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {subcategories.map((subcat) => {
                const isActive = activeSubcat === subcat;
                return (
                  <button
                    key={subcat}
                    onClick={() => setActiveSubcat(subcat)}
                    className={cn(
                      'relative flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
                      isActive
                        ? 'bg-[#FF7300] text-white shadow-md shadow-[#FF7300]/25'
                        : 'bg-[#121620] text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                    )}
                  >
                    <span>{subcat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-xs font-medium text-slate-400 mb-4">
            Menampilkan <strong className="text-white font-semibold">{filteredGames.length}</strong> game
          </p>

          {/* Games Grid: 2 cols mobile, 3 cols sm, 4 cols tablet, 6 cols desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 tablet:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5 tablet:gap-4 pb-8">
            {filteredGames.map((game, index) => (
              <div key={game.id} className="h-full">
                <GameCard game={game as unknown as import('@/types').ProductWithDenominations} index={index} priorityImage={index < 6} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredGames.length === 0 && (
            <div className="text-center py-16 bg-[#121620] rounded-2xl border border-white/10 max-w-md mx-auto p-8 space-y-3">
              <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white font-heading">
                Game tidak ditemukan
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Coba gunakan kata kunci lain atau pilih kategori &quot;Semua&quot;.
              </p>
              <button
                onClick={() => { setSearch(''); setActiveSubcat('Semua'); }}
                className="btn-secondary px-4 py-2 text-xs font-bold mt-2"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
