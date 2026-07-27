'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Gamepad2, Filter, Star, TrendingUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn } from '@/lib/utils';
import { getGameColor, GAME_INITIALS } from '@/lib/colors';
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
      <main className="min-h-screen pt-24 tablet:pt-28 pb-24">
        <div className="container-app">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: [0.33, 1, 0.68, 1] }}
            className="mb-6 tablet:mb-8"
          >
            <p className="label mb-2 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-primary" />
              Game Top Up
            </p>
            <h1 className="heading-3 mb-1">Top Up Game</h1>
            <p className="body-default">
              Pilih game favorit kamu dan top up dengan harga termurah
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col tablet:flex-row gap-3 mb-6"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari game... (Mobile Legends, Free Fire, Genshin...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/40 border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:bg-muted/70 shadow-sm transition-all duration-200"
              />
            </div>

            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {subcategories.map((subcat) => (
                <button
                  key={subcat}
                  onClick={() => setActiveSubcat(subcat)}
                  className={cn(
                    'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap',
                    activeSubcat === subcat
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-transparent text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground'
                  )}
                >
                  {subcat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-4">
            Menampilkan {filteredGames.length} game
          </p>

          {/* Games Grid */}
          <div className="grid grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 tablet:gap-6 pb-8">
            {filteredGames.map((game, index) => {
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="h-full"
                >
                  <CyberGameCard game={game as unknown as import('@/types').ProductWithDenominations} index={index} />
                </motion.div>
              );
            })}
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
      <MobileNav />
    </>
  );
}
