'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Gamepad2, Smartphone, Zap, Gift, Tv, Wallet, Ticket, Wifi, Cpu } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { CATEGORIES } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Gamepad2, Ticket, Smartphone, Wifi, Zap, Gift, Tv, Wallet,
};

type ProductWithDenoms = {
  id: string;
  name: string;
  slug: string;
  category: string;
  publisher: string | null;
  isActive: boolean;
  denominations: { price: number }[];
};

export default function ProductsClient({ products }: { products: ProductWithDenoms[] }) {
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
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="container-app relative z-10">
          {/* Cyber Page Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 tablet:mb-10 text-center tablet:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-md mb-4 shadow-sm mx-auto tablet:mx-0">
              <Cpu className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-bold tracking-widest text-accent uppercase font-heading">Nexa Digital Market</span>
            </div>
            <h1 className="heading-1 mb-2">
              Katalog <span className="gradient-accent text-transparent bg-clip-text">Produk Digital</span>
            </h1>
            <p className="body-default max-w-xl text-muted-foreground mx-auto tablet:mx-0">
              Akses instan ke ribuan voucher, pulsa, token listrik, dan paket langganan streaming dengan harga distributor terbaik.
            </p>
          </motion.div>

          {/* Search & Category Filter */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <div className="relative mb-6 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors z-10 pointer-events-none" />
              <input
                type="text"
                placeholder="Search digital products... (e.g. Netflix, Telkomsel, Token PLN)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card/60 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 backdrop-blur-xl shadow-lg transition-all"
              />
            </div>

            {/* Category pills - Framer Motion Sliding Pill (Apple Style) */}
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
              {allCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const Icon = iconMap[cat.icon] || ShoppingBag;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'relative flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap border border-transparent',
                      isActive
                        ? 'text-white'
                        : 'text-muted-foreground border-border/60 bg-card/40 hover:text-foreground hover:border-border'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeProductCatPill"
                        className="absolute inset-0 bg-gradient-to-r from-accent to-fuchsia-600 rounded-xl z-0 shadow-md shadow-accent/25"
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
            Terdeteksi {filteredProducts.length} Produk Digital
          </p>

          {/* Product Grid */}
          <div className="grid grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => {
              const minPrice = product.denominations.length > 0
                ? Math.min(...product.denominations.map(d => d.price))
                : 0;
              const catInfo = CATEGORIES.find(c => c.id === product.category);
              
              return (
                <div
                  key={product.id}
                >
                  <Link href={`/products/${product.slug}`} className="group block h-full rounded-2xl bg-card/40 border border-border/80 hover:border-accent/50 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-accent/10">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {/* Gradient Backdrop */}
                      <div className={cn('absolute inset-0 bg-gradient-to-br transition-opacity duration-500 group-hover:opacity-60', catInfo?.color || 'from-primary/30 to-accent/30')} style={{ opacity: 0.2 }} />
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <span className="text-base tablet:text-lg font-heading font-bold text-foreground text-center leading-tight drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                          {product.name}
                        </span>
                        {product.publisher && (
                          <span className="text-xs text-muted-foreground mt-1 font-medium">
                            {product.publisher}
                          </span>
                        )}
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-black/40 text-foreground backdrop-blur-md border border-white/10 shadow-sm">
                          {catInfo?.label || product.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-card/60 flex items-center justify-between border-t border-border/50">
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Mulai dari</span>
                        <span className="text-sm font-extrabold text-foreground group-hover:text-accent transition-colors">
                          {minPrice > 0 ? formatCurrency(minPrice) : 'Lihat Pilihan'}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/5">
                <ShoppingBag className="w-8 h-8 text-accent" />
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
