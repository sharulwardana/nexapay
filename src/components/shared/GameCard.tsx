'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Zap, ChevronRight, Gamepad2, Smartphone, Gift, Tv, Wallet, CreditCard } from 'lucide-react';
import { useCurrencyStore } from '@/store/currencyStore';
import { getGameColor, GAME_INITIALS } from '@/lib/colors';
import type { ProductWithDenominations } from '@/types';

export interface GameCardProps {
  game: ProductWithDenominations;
  index?: number;
  priorityImage?: boolean;
}

export default function GameCard({ game, priorityImage = false }: GameCardProps) {
  const [imageError, setImageError] = useState(false);

  // Calculate starting price
  const activeDenoms = (game.denominations || []).filter((d) => d.isActive);
  const minPrice = activeDenoms.length
    ? Math.min(
        ...activeDenoms.map((d) => (d.isFlashSale && d.flashSalePrice ? d.flashSalePrice : d.price))
      )
    : null;

  const gameColors = getGameColor(game.slug);

  const hoverTextMap: Record<string, string> = {
    'GAME_TOPUP': 'Top Up',
    'PULSA': 'Beli Pulsa',
    'PLN': 'Beli Token',
    'GIFT_CARD': 'Beli Voucher',
    'STREAMING': 'Langganan',
    'EWALLET_TOPUP': 'Isi Saldo',
    'PAKET_DATA': 'Beli Paket',
  };
  const hoverText = hoverTextMap[game.category] || 'Beli';

  const fallbackIconMap: Record<string, React.ElementType> = {
    'GAME_TOPUP': Gamepad2,
    'PULSA': Smartphone,
    'PLN': Zap,
    'GIFT_CARD': Gift,
    'STREAMING': Tv,
    'EWALLET_TOPUP': Wallet,
    'PAKET_DATA': Smartphone,
  };
  const FallbackIcon = fallbackIconMap[game.category] || CreditCard;

  const { formatPrice } = useCurrencyStore();

  return (
    <div className="group relative w-full h-full">
      <Link
        href={game.category === 'GAME_TOPUP' ? `/topup/${game.slug}` : `/products/${game.slug}`}
        className="relative flex flex-col h-full rounded-2xl bg-[#121620] border border-white/10 group-hover:border-[#FF7300]/50 overflow-hidden shadow-md group-hover:shadow-[0_8px_24px_-4px_rgba(255,115,0,0.2)] transition-all duration-200 group-hover:-translate-y-1.5"
      >
        {/* Top Image Container — 1:1 Square */}
        <div className="relative w-full aspect-square overflow-hidden bg-slate-950">
          {game.image && !imageError ? (
            <Image
              src={game.image}
              alt={game.name}
              fill
              quality={75}
              priority={priorityImage}
              loading={priorityImage ? 'eager' : 'lazy'}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 180px"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${gameColors.from} ${gameColors.to} flex flex-col items-center justify-center p-4 text-white`}>
              <FallbackIcon className="w-10 h-10 mb-2 opacity-80" />
              <span className="text-xl font-heading font-black tracking-wider text-center">
                {GAME_INITIALS[game.slug] || game.name.split(' ')[0]}
              </span>
            </div>
          )}

          {/* Subtle Bottom Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
            {game.isPopular ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-[#FF7300] text-[#0B0E14] shadow-sm">
                <Star className="w-2.5 h-2.5 fill-current" />
                POPULER
              </span>
            ) : game.publisher ? (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/75 text-slate-300 border border-white/10 backdrop-blur-sm truncate max-w-[120px]">
                {game.publisher}
              </span>
            ) : <div />}

            {activeDenoms.some((d) => d.isFlashSale) && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-sm">
                <Zap className="w-2.5 h-2.5 fill-current" />
                DISKON
              </span>
            )}
          </div>

          {/* Quick Action Pill on Desktop Hover */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-200 pointer-events-none hidden tablet:block">
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#FF7300] text-white text-xs font-bold shadow-md">
              <span>{hoverText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-3 tablet:p-3.5 flex flex-col justify-between flex-1 bg-[#121620]">
          <div>
            <h3 className="font-bold text-xs tablet:text-sm text-white group-hover:text-[#FF7300] transition-colors line-clamp-2 font-heading leading-tight min-h-[2rem]">
              {game.name}
            </h3>
            {game.publisher && (
              <p className="text-[11px] text-slate-400 truncate font-medium mt-0.5">
                {game.publisher}
              </p>
            )}
          </div>

          {/* Pricing Footnote */}
          <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400">Mulai</span>
            <span className="text-xs font-bold text-[#FF7300]">
              {minPrice ? formatPrice(minPrice) : 'Tersedia'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
