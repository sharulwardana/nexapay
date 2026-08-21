'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Gamepad2, Smartphone, Zap, Gift, Tv, Wallet, Ticket, Wifi, Cpu } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import CyberGameCard from '@/components/shared/CyberGameCard';
import type { ProductWithDenominations } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Gamepad2, Ticket, Smartphone, Wifi, Zap, Gift, Tv, Wallet,
};

export default function ProductsClient({ products }: { products: ProductWithDenominations[] }) {
  const searchParams = useSearchParams();
  const rawParam = searchParams.get('category') || searchParams.get('cat');
  const normalizedCategoryParam = rawParam 
    ? (rawParam === 'EWALLET' ? 'EWALLET_TOPUP' : rawParam)
    : null;
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(normalizedCategoryParam || 'ALL');

  useEffect(() => {
    if (normalizedCategoryParam) {
      setActiveCategory(normalizedCategoryParam);
    }
  }, [normalizedCategoryParam]);

  const filteredProducts = useMemo(() => {
    let result = products;
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
  }, [products, search, activeCategory]);

  const nonGameCategories = CATEGORIES.filter(c => c.id !== 'GAME_TOPUP');
  
  // Prepare categories list including ALL
  const allCategories = [{ id: 'ALL', label: 'Semua Produk', icon: 'ShoppingBag' }, ...nonGameCategories];

  return (
    <>
      <main className="min-h-screen pt-24 tablet:pt-28 pb-24 relative overflow-hidden aurora-bg">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="container-app relative z-10">
          {/* Cyber Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ ease: [0.33, 1, 0.68, 1] }}
            className="mb-8 tablet:mb-10 text-center tablet:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4 shadow-sm mx-auto tablet:mx-0">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold tracking-widest text-primary uppercase font-heading">Nexa Digital Market</span>
            </div>
            <h1 className="heading-1 mb-2">
              Katalog <span className="gradient-text">Produk Digital</span>
            </h1>
            <p className="body-default max-w-xl text-muted-foreground mx-auto tablet:mx-0">
              Akses instan ke ribuan voucher, pulsa, token listrik, dan paket langganan streaming dengan harga distributor terbaik.
            </p>
          </motion.div>

          {/* Search & Category Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="mb-8"
          >
            <div className="relative mb-6 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
              <input
                type="text"
                placeholder="Search digital products... (e.g. Netflix, Telkomsel, Token PLN, Google Play)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card/60 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 backdrop-blur-xl shadow-lg transition-all"
              />
            </div>

            {/* Category pills - Framer Motion Sliding Pill */}
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
              {allCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const Icon = iconMap[cat.icon] || ShoppingBag;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap border border-transparent',
                      isActive
                        ? 'text-white'
                        : 'text-muted-foreground border-border/60 bg-card/40 hover:text-foreground hover:border-border'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeProductCatPill"
                        className="absolute inset-0 gradient-primary rounded-full z-0 shadow-md shadow-primary/25"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <p className="text-xs font-semibold text-muted-foreground font-heading uppercase tracking-wider mb-4">
            Menampilkan {filteredProducts.length} Produk Digital
          </p>

          {/* Product Grid — Unified CyberGameCard Design (6 Cols) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 tablet:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 tablet:gap-4 pb-8">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="h-full">
                <CyberGameCard
                  game={product}
                  index={index}
                  priorityImage={index < 6}
                />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/5">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold font-heading mb-2">Produk tidak ditemukan</h3>
              <p className="text-sm text-muted-foreground">Sistem tidak dapat menemukan produk yang cocok dengan pencarian Anda.</p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
