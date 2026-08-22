'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
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

function CountdownTimer({ endDate }: { endDate: string | Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft(endDate));
    const timer = setInterval(() => {
      const next = calculateTimeLeft(endDate);
      setTimeLeft(next);
      if (next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex gap-1.5">
      {[
        { value: mounted ? timeLeft.days : 0, label: 'H' },
        { value: mounted ? timeLeft.hours : 0, label: 'J' },
        { value: mounted ? timeLeft.minutes : 0, label: 'M' },
        { value: mounted ? timeLeft.seconds : 0, label: 'D' },
      ].map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="w-10 h-10 tablet:w-12 tablet:h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center font-heading font-bold text-sm tablet:text-base text-red-400 tabular-nums relative overflow-hidden">
            {String(unit.value).padStart(2, '0')}
            {/* Urgency pulse */}
            <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
          </div>
          <span className="text-[8px] text-muted-foreground mt-0.5 block">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

const itemVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function FlashSale({ games }: { games: ProductWithDenominations[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

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
  const endDate = rawEnd && new Date(rawEnd).getTime() > Date.now()
    ? rawEnd
    : new Date(Date.now() + 12 * 60 * 60 * 1000);

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      {/* Urgency background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="container-app relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col tablet:flex-row items-start tablet:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative">
              <Zap className="w-5 h-5 text-red-500" />
              {/* Animated glow ring */}
              <div className="absolute inset-0 rounded-xl border border-red-500/30" style={{ animation: 'glow-pulse 2s ease-in-out infinite' }} />
            </div>
            <div>
              <h2 className="heading-4 flex items-center gap-2">
                Flash Sale
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 badge-shimmer">
                  <Flame className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Hot</span>
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">Berakhir dalam</p>
            </div>
          </div>
          <CountdownTimer endDate={endDate} />
        </motion.div>

        {/* Items */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-3">
          {flashSaleItems.map((item, index) => {
            const gc = getGameColor(item.gameSlug);
            const discountPercent = Math.round(((item.price - item.flashSalePrice!) / item.price) * 100);
            return (
              <motion.div
                key={`${item.gameSlug}-${item.id || index}`}
                custom={index}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={itemVariant}
              >
                <Link
                  href={`/topup/${item.gameSlug}`}
                  className="group flex gap-3 p-3.5 rounded-xl border border-border hover:border-red-500/25 bg-card transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_8px_24px_rgba(239,68,68,0.06)] relative overflow-hidden"
                >
                  {/* Discount badge */}
                  {discountPercent > 0 && (
                    <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-bold shadow-lg shadow-red-500/25">
                      -{discountPercent}%
                    </div>
                  )}

                  {/* Game thumb */}
                  <div className="flex-shrink-0 w-14 h-14 tablet:w-16 tablet:h-16 rounded-lg overflow-hidden relative">
                    {item.gameImage ? (
                      <Image
                        src={item.gameImage}
                        alt={item.gameName}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight group-hover:text-red-400 transition-colors">
                      {item.gameName}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-red-500">
                        {formatPrice(item.flashSalePrice!)}
                      </span>
                      <span className="text-[11px] text-muted-foreground line-through">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="flex-shrink-0 self-center w-4 h-4 text-muted-foreground group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );

}
