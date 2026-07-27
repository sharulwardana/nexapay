'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Zap, ChevronRight, Gamepad2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getGameColor, GAME_INITIALS } from '@/lib/colors';
import type { ProductWithDenominations } from '@/types';

interface CyberGameCardProps {
  game: ProductWithDenominations;
  index?: number;
  priorityImage?: boolean;
}

export default function CyberGameCard({ game, priorityImage = false }: CyberGameCardProps) {
  const [imageError, setImageError] = useState(false);

  // Calculate starting price
  const activeDenoms = (game.denominations || []).filter((d) => d.isActive);
  const minPrice = activeDenoms.length
    ? Math.min(
        ...activeDenoms.map((d) => (d.isFlashSale && d.flashSalePrice ? d.flashSalePrice : d.price))
      )
    : null;

  const gameColors = getGameColor(game.slug);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative w-full h-full"
    >
      <Link
        href={game.category === 'GAME_TOPUP' ? `/topup/${game.slug}` : `/products/${game.slug}`}
        className="relative flex flex-col h-full rounded-2xl bg-card border border-border/80 group-hover:border-primary/60 overflow-hidden shadow-lg group-hover:shadow-[0_12px_30px_rgba(255,115,0,0.2)] transition-all duration-300"
      >
        {/* Top Image Container */}
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-background">
          {/* Image OR Styled Gradient Fallback */}
          {game.image && !imageError ? (
            <Image
              src={game.image}
              alt={game.name}
              fill
              priority={priorityImage}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${gameColors.from} ${gameColors.to} flex flex-col items-center justify-center p-4 text-white`}>
              <Gamepad2 className="w-10 h-10 mb-2 opacity-80" />
              <span className="text-xl font-heading font-black tracking-wider text-center">
                {GAME_INITIALS[game.slug] || game.name.split(' ')[0]}
              </span>
            </div>
          )}

          {/* Soft Dark Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
            {game.isPopular ? (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white shadow-md">
                <Star className="w-2.5 h-2.5 fill-current" />
                HOT
              </span>
            ) : game.publisher ? (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-black/70 text-white/90 border border-white/10 backdrop-blur-md">
                {game.publisher}
              </span>
            ) : (
              <div />
            )}

            {activeDenoms.some((d) => d.isFlashSale) && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500 text-white shadow-md animate-pulse">
                <Zap className="w-2.5 h-2.5 fill-current" />
                SALE
              </span>
            )}
          </div>

          {/* Quick Action Pill on Hover */}
          <div className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-250 ease-out pointer-events-none hidden tablet:block">
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl gradient-primary text-white text-xs font-bold shadow-md">
              <span>Top Up ⚡</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Bottom Title & Price Section */}
        <div className="p-3.5 tablet:p-4 flex flex-col justify-between flex-1 bg-card">
          <div>
            <h3 className="font-bold text-xs tablet:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1 font-heading">
              {game.name}
            </h3>
            {game.publisher && (
              <p className="text-[11px] text-muted-foreground line-clamp-1 font-medium mt-0.5">
                {game.publisher}
              </p>
            )}
          </div>

          {/* Starting Price Pill */}
          <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground">Mulai</span>
            <span className="text-xs font-extrabold text-primary gradient-text">
              {minPrice ? formatCurrency(minPrice) : 'Tersedia'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
