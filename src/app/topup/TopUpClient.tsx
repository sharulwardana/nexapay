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
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24">
        <div className="container-app">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: [0.33, 1, 0.68, 1] }}
            className="mb-6 tablet:mb-8 pt-6"
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
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
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
          <div className="grid grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 tablet:gap-4 pb-8">
            {filteredGames.map((game, index) => {
              const minPrice = game.denominations && game.denominations.length > 0
                ? Math.min(...game.denominations.map((d) => d.price))
                : 0;
              
              return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={`/topup/${game.slug}`}
                  className="group block glass-card overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {game.image ? (
                      <>
                        <Image
                          src={game.image}
                          alt={game.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"></div>
                      </>
                    ) : (
                      <>
                        <div className={cn('absolute inset-0 bg-gradient-to-br', getGameColor(game.slug).from, getGameColor(game.slug).to, 'group-hover:scale-105 transition-transform duration-500')} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                          <span className="text-2xl tablet:text-3xl font-heading font-black text-white/90 mb-1">
                            {GAME_INITIALS[game.slug] || game.name.split(' ')[0]}
                          </span>
                          <span className="text-[10px] tablet:text-xs text-white/60 text-center leading-tight line-clamp-2">
                            {game.name}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {game.isFeatured && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          HOT
                        </span>
                      )}
                      {game.isPopular && !game.isFeatured && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold">
                          <TrendingUp className="w-2.5 h-2.5" />
                          Popular
                        </span>
                      )}
                    </div>

                    {game.denominations?.some((d: any) => d.isFlashSale) && (
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 rounded-md bg-red-500 text-white text-[9px] font-bold animate-pulse">
                          FLASH SALE
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 tablet:p-4">
                    <h3 className="text-xs tablet:text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {game.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {game.subcategory}
                      </span>
                    </div>
                    {minPrice > 0 && (
                      <p className="text-xs font-medium text-primary mt-2">
                        Mulai {formatCurrency(minPrice)}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            )})}
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
