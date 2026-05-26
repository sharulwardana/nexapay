'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Gamepad2, Smartphone, Zap, Gift, Tv, Wallet, Ticket, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { games } from '@/data/games';
import { digitalProducts } from '@/data/products';
import { formatCurrency } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import TiltCard from '@/components/shared/TiltCard';

const iconMap: Record<string, React.ElementType> = {
  Gamepad2, Ticket, Smartphone, Wifi, Zap, Gift, Tv, Wallet,
};

const itemVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.35, delay: i * 0.04, ease: [0.33, 1, 0.68, 1] },
  }),
};

export default function TrendingProducts() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeCategory, setActiveCategory] = useState('ALL');

  const allProducts = [...games, ...digitalProducts];
  const filteredProducts =
    activeCategory === 'ALL'
      ? allProducts.filter((p) => p.isFeatured).slice(0, 12)
      : allProducts.filter((p) => p.category === activeCategory).slice(0, 12);

  return (
    <section ref={ref} className="section-padding surface">
      <div className="container-app">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col tablet:flex-row tablet:items-end tablet:justify-between gap-3 mb-8"
        >
          <div>
            <p className="label mb-2">Trending</p>
            <h2 className="heading-3">Produk Trending</h2>
          </div>
          <Link
            href="/products"
            className="hidden tablet:flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Semua Produk
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Category Tabs — pill style */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="flex gap-1.5 overflow-x-auto no-scrollbar pb-4 mb-8"
        >
          <button
            onClick={() => setActiveCategory('ALL')}
            className={cn(
              'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border',
              activeCategory === 'ALL'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground'
            )}
          >
            Semua
          </button>
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Gamepad2;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap',
                  activeCategory === cat.id
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground'
                )}
              >
                <Icon className="w-3 h-3" />
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filteredProducts.map((product, index) => {
            return (
              <motion.div
                key={product.id}
                custom={index}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={itemVariant}
                className="group relative"
              >
                <TiltCard>
                  <Link
                    href={product.category === 'GAME_TOPUP' ? `/topup/${product.slug}` : `/products/${product.slug}`}
                    className="group flex flex-col bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:border-primary/50 transition-all duration-300 relative z-10"
                  >
                    {/* Image Container (Square) */}
                    <div className="relative w-full aspect-square bg-muted/30 overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center gap-2">
                          <Wallet className="w-10 h-10 text-primary/50" />
                        </div>
                      )}
                      
                      {/* Inner Hover Glow */}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"></div>
                    </div>

                    {/* Content Section (Always Visible, Glassmorphism) */}
                    <div className="p-3 tablet:p-4 text-center bg-card/50 backdrop-blur-md relative z-20 border-t border-white/5 group-hover:bg-card transition-colors duration-300">
                      <h3 className="font-bold text-sm tablet:text-base text-foreground line-clamp-1 mb-0.5 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[10px] tablet:text-xs text-muted-foreground line-clamp-1">
                        {product.publisher || product.category}
                      </p>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Belum ada produk di kategori ini.</p>
          </div>
        )}

        {/* Mobile CTA */}
        <div className="flex justify-center mt-8 tablet:hidden">
          <Link href="/products" className="btn-secondary px-6 py-2.5 text-sm">
            Semua Produk
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
