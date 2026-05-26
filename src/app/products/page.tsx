'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Gamepad2, Smartphone, Zap, Gift, Tv, Wallet, Ticket, Wifi, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { digitalProducts } from '@/data/products';
import { games } from '@/data/games';
import { CATEGORIES } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Gamepad2, Ticket, Smartphone, Wifi, Zap, Gift, Tv, Wallet,
};

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const allProducts = [...digitalProducts, ...games.filter(g => g.category !== 'GAME_TOPUP')];

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((p) => p.isActive);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || p.publisher?.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'ALL') {
      result = result.filter((p) => p.category === activeCategory);
    }
    return result;
  }, [search, activeCategory]);

  const nonGameCategories = CATEGORIES.filter(c => c.id !== 'GAME_TOPUP');

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 tablet:pt-24 pb-24">
        <div className="container-app">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 tablet:mb-8">
            <h1 className="heading-2 mb-2">
              <ShoppingBag className="inline w-7 h-7 tablet:w-9 tablet:h-9 mr-2 text-primary" />
              Produk Digital
            </h1>
            <p className="body-default">Pulsa, paket data, token PLN, voucher, gift card, dan lainnya</p>
          </motion.div>

          {/* Search & Category Filter */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari produk digital..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={cn(
                  'flex-shrink-0 px-4 py-2.5 rounded-xl text-xs tablet:text-sm font-medium transition-all whitespace-nowrap',
                  activeCategory === 'ALL' ? 'gradient-primary text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                Semua
              </button>
              {nonGameCategories.map((cat) => {
                const Icon = iconMap[cat.icon] || ShoppingBag;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs tablet:text-sm font-medium transition-all whitespace-nowrap',
                      activeCategory === cat.id ? 'gradient-primary text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <p className="text-xs text-muted-foreground mb-4">Menampilkan {filteredProducts.length} produk</p>

          {/* Product Grid */}
          <div className="grid grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 tablet:gap-4">
            {filteredProducts.map((product, index) => {
              const minPrice = Math.min(...product.denominations.map(d => d.price));
              const catInfo = CATEGORIES.find(c => c.id === product.category);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link href={`/products/${product.slug}`} className="group block glass-card overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div className={cn('absolute inset-0 bg-gradient-to-br', catInfo?.color || 'from-primary/30 to-accent/30')} style={{ opacity: 0.3 }} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                        <span className="text-base tablet:text-lg font-heading font-bold text-foreground/80 text-center leading-tight">
                          {product.name.length > 25 ? product.name.split(' ').slice(0, 3).join(' ') : product.name}
                        </span>
                        {product.publisher && (
                          <span className="text-[10px] text-muted-foreground mt-1">{product.publisher}</span>
                        )}
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-md bg-black/40 dark:bg-white/10 backdrop-blur text-white dark:text-white text-[9px] font-medium">
                          {catInfo?.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 tablet:p-4">
                      <h3 className="text-xs tablet:text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{product.denominations.length} pilihan</p>
                      <p className="text-xs tablet:text-sm font-bold text-primary mt-2">
                        Mulai {formatCurrency(minPrice)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Produk tidak ditemukan</h3>
              <p className="text-sm text-muted-foreground">Coba kata kunci atau kategori lain</p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
