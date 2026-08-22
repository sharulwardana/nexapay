'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Gamepad2 } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import type { ProductWithActiveDenominations } from '@/types';
import CyberGameCard from '@/components/shared/CyberGameCard';

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
      <main className="min-h-screen pt-24 tablet:pt-28 pb-24 relative overflow-hidden aurora-bg">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-app relative z-10">
          {/* Page Header */}
          <div className="mb-8 tablet:mb-10 text-center tablet:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4 shadow-sm mx-auto tablet:mx-0">
              <Gamepad2 className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold tracking-widest text-primary uppercase font-heading">Nexa Game Center</span>
            </div>
            <h1 className="heading-1 mb-2">
              Top-Up <span className="gradient-text">Gaming Ecosystem</span>
            </h1>
            <p className="body-default max-w-xl text-muted-foreground mx-auto tablet:mx-0">
              Injeksi diamond dan game items instan dalam hitungan detik. Harga termurah dengan garansi masuk 100%.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col tablet:flex-row gap-4 mb-8">
            {/* Cyber Search */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
              <input
                type="text"
                placeholder="Search game title... (e.g. Mobile Legends, Genshin)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card/60 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 backdrop-blur-xl shadow-lg transition-all"
              />
            </div>

            {/* Category filter — Framer Motion Sliding Pill */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {subcategories.map((subcat) => {
                const isActive = activeSubcat === subcat;
                return (
                  <button
                    key={subcat}
                    onClick={() => setActiveSubcat(subcat)}
                    className={cn(
                      'relative flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap border border-transparent',
                      isActive
                        ? 'text-white'
                        : 'text-muted-foreground border-border/60 bg-card/40 hover:text-foreground hover:border-border'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSubcatPill"
                        className="absolute inset-0 gradient-primary rounded-full z-0 shadow-md shadow-primary/25"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{subcat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-4">
            Menampilkan {filteredGames.length} game
          </p>

          {/* Games Grid — Codashop & UniPin Density (6 Cols) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 tablet:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 tablet:gap-4 pb-8">
            {filteredGames.map((game, index) => (
              <div key={game.id} className="h-full">
                <CyberGameCard game={game as unknown as import('@/types').ProductWithDenominations} index={index} priorityImage={index < 6} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredGames.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Gamepad2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Game tidak ditemukan
              </h3>
              <p className="text-sm text-muted-foreground">
                Coba kata kunci lain atau hapus filter
              </p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
