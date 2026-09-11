'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Zap, ArrowRight, Flame } from 'lucide-react';
import { useCurrencyStore } from '@/store/currencyStore';
import { cn } from '@/lib/utils';
import { getGameColor, GAME_INITIALS } from '@/lib/colors';
import type { ProductWithDenominations } from '@/types';

function calculateTimeLeft(endDate: string | Date) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownTimer({ endDate }: { endDate?: string | Date | null }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetDate = endDate && new Date(endDate).getTime() > Date.now()
      ? endDate
      : new Date(Date.now() + 12 * 60 * 60 * 1000);

    setTimeLeft(calculateTimeLeft(targetDate));
    const timer = setInterval(() => {
      const next = calculateTimeLeft(targetDate);
      setTimeLeft(next);
      if (next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {[
        { value: mounted ? timeLeft.days : 0, label: 'Hari' },
        { value: mounted ? timeLeft.hours : 0, label: 'Jam' },
        { value: mounted ? timeLeft.minutes : 0, label: 'Menit' },
        { value: mounted ? timeLeft.seconds : 0, label: 'Detik' },
      ].map((unit) => (
        <div key={unit.label} className="text-center">
          <div 
            suppressHydrationWarning
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#121620] border border-white/12 flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-[#FF7300] tabular-nums shadow-sm"
          >
            {String(unit.value).padStart(2, '0')}
          </div>
          <span className="text-[9px] font-medium text-slate-400 mt-1 block">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function FlashSale({ games }: { games: ProductWithDenominations[] }) {
  const flashSaleItems = games.flatMap((game) =>
    game.denominations
      .filter((d) => d.isFlashSale && d.flashSalePrice)
      .map((d) => ({
        ...d,
        gameName: game.name,
        gameSlug: game.slug,
        gamePublisher: game.publisher,
        gameImage: game.image,
      }))
  );

  const { formatPrice } = useCurrencyStore();

  if (flashSaleItems.length === 0) return null;
  const rawEnd = flashSaleItems[0]?.flashSaleEnd;

  return (
    <section className="py-6 tablet:py-10 relative">
      <div className="container-app relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 sm:p-5 rounded-2xl bg-[#121620] border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#161D2C] border border-[#FF7300]/40 flex items-center justify-center flex-shrink-0 text-[#FF851A] shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="heading-card">Flash Sale Terbatas</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#161D2C] border border-rose-500/40 text-rose-300 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                  <Flame className="w-3 h-3" />
                  <span>Hemat s/d 30%</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Penawaran harga terbaik berakhir dalam:</p>
            </div>
          </div>

          <CountdownTimer endDate={rawEnd} />
        </div>

        {/* Flash Sale Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {flashSaleItems.map((item, index) => {
            const gc = getGameColor(item.gameSlug);
            const currentPrice = item.flashSalePrice || item.price;
            const basePrice = (item.originalPrice && item.originalPrice > currentPrice) 
              ? item.originalPrice 
              : (item.price > currentPrice ? item.price : Math.round(currentPrice * 1.2));
            const discountPercent = item.discount && item.discount > 0 
              ? item.discount 
              : Math.max(5, Math.round(((basePrice - currentPrice) / basePrice) * 100));

            return (
              <div key={`${item.gameSlug}-${item.id || index}`}>
                <Link
                  href={`/topup/${item.gameSlug}`}
                  className="group flex gap-3.5 p-3.5 rounded-2xl border border-white/10 hover:border-[#FF7300]/40 bg-[#121620] hover:bg-[#161D2C] transition-all duration-200 shadow-sm relative overflow-hidden active:scale-[0.99]"
                >
                  {/* Discount badge */}
                  {discountPercent > 0 && (
                    <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[10px] font-extrabold shadow-sm">
                      -{discountPercent}%
                    </div>
                  )}

                  {/* Game thumb */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden relative bg-slate-900 border border-white/10">
                    {item.gameImage ? (
                      <Image
                        src={item.gameImage}
                        alt={item.gameName}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center', gc.from, gc.to)}>
                        <span className="text-sm font-heading font-bold text-white/90">
                          {GAME_INITIALS[item.gameSlug] || item.gameName.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 leading-tight group-hover:text-[#FF7300] transition-colors font-heading">
                      {item.gameName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 mb-2 truncate">{item.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#FF7300]">
                        {formatPrice(currentPrice)}
                      </span>
                      {basePrice > currentPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(basePrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="flex-shrink-0 self-center w-4 h-4 text-slate-400 group-hover:text-[#FF7300] group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
