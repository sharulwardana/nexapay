'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Clock, Zap, ArrowRight } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
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
      ].map((unit, i) => (
        <div key={unit.label} className="text-center">
          <div className="w-9 h-9 tablet:w-11 tablet:h-11 rounded-lg bg-card border border-border flex items-center justify-center font-heading font-bold text-sm tablet:text-base text-foreground tabular-nums">
            {String(unit.value).padStart(2, '0')}
          </div>
          <span className="text-[8px] text-muted-foreground mt-0.5 block">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.33, 1, 0.68, 1] as const },
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

  if (flashSaleItems.length === 0) return null;
  const rawEnd = flashSaleItems[0]?.flashSaleEnd;
  const endDate = rawEnd && new Date(rawEnd).getTime() > Date.now()
    ? rawEnd
    : new Date(Date.now() + 12 * 60 * 60 * 1000);

  return (
    <section ref={ref} className="section-padding">
      <div className="container-app">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col tablet:flex-row items-start tablet:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="heading-4 flex items-center gap-1.5">
                Flash Sale
                <span className="inline-flex w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
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
                  className="group flex gap-3 p-3 rounded-xl border border-border hover:border-red-500/20 bg-card transition-all"
                >
                  {/* Game thumb */}
                  <div className="flex-shrink-0 w-14 h-14 tablet:w-16 tablet:h-16 rounded-lg overflow-hidden relative">
                    {item.gameImage ? (
                      <Image
                        src={item.gameImage}
                        alt={item.gameName}
                        fill
                        sizes="64px"
                        className="object-cover"
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
                    <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {item.gameName}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1.5">{item.label}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-red-500">
                        {formatCurrency(item.flashSalePrice!)}
                      </span>
                      <span className="text-[11px] text-muted-foreground line-through">
                        {formatCurrency(item.price)}
                      </span>
                      {Math.round(((item.price - item.flashSalePrice!) / item.price) * 100) > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[10px] font-bold">
                          -{Math.round(((item.price - item.flashSalePrice!) / item.price) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="flex-shrink-0 self-center w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
