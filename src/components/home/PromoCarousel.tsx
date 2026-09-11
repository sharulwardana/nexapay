'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag, Sparkles, ArrowRight } from 'lucide-react';
import { promotions as fallbackPromotions } from '@/data/testimonials';
import { cn } from '@/lib/utils';

export interface DbBanner {
  id: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  link?: string | null;
}

interface PromoCarouselProps {
  banners?: DbBanner[];
}

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? '40%' : '-40%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-40%' : '40%', opacity: 0 }),
};

export default function PromoCarousel({ banners = [] }: PromoCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  // Combine DB banners or fallback
  const items = banners.length > 0 
    ? banners.map((b, idx) => ({
        id: b.id,
        code: `PROMO-${idx + 1}`,
        title: b.title,
        subtitle: b.subtitle || 'Promo spesial top-up game hemat hanya di NexaPay.',
        image: b.image,
        link: b.link || '/promo',
      }))
    : fallbackPromotions.map((p) => ({
        id: p.id,
        code: p.code,
        title: p.title,
        subtitle: p.subtitle,
        image: null as string | null,
        link: '/promo',
      }));

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const activeItem = items[current] || items[0];

  return (
    <section ref={ref} className="py-6 tablet:py-8">
      <div className="container-app">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-5 rounded-full bg-[#FF7300]" />
            <h2 className="heading-card">Promo &amp; Event Spesial</h2>
          </div>

          <Link
            href="/promo"
            className="text-xs font-semibold text-slate-400 hover:text-[#FF7300] transition-colors flex items-center gap-1"
          >
            <span>Semua Promo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Banner Slide Frame */}
        <div className="relative rounded-2xl bg-[#121620] border border-white/10 overflow-hidden shadow-lg">
          <div className="relative h-[180px] xs:h-[210px] sm:h-[260px] tablet:h-[300px] w-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeItem.id || current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <Link
                  href={activeItem.link || '/promo'}
                  className="relative block w-full h-full group"
                >
                  {/* Background Image or Clean Dark Surface */}
                  {activeItem.image ? (
                    <Image
                      src={activeItem.image}
                      alt={activeItem.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 1200px"
                      className="object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#121620] via-[#161D2C] to-[#121620]">
                      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#FF7300]/10 to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-black/40 to-transparent tablet:bg-gradient-to-r tablet:from-[#0B0E14]/95 tablet:via-[#0B0E14]/70 tablet:to-transparent" />

                  {/* Text Content */}
                  <div className="absolute inset-0 p-5 sm:p-8 tablet:p-10 flex flex-col justify-end tablet:justify-center max-w-xl z-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161D2C] border border-[#FF7300]/40 text-[#FF851A] text-[10px] sm:text-xs font-extrabold w-fit mb-2 sm:mb-3 shadow-sm">
                      <Tag className="w-3 h-3" />
                      <span>{activeItem.code}</span>
                    </div>

                    <h3 className="font-heading font-extrabold text-base sm:text-2xl tablet:text-3xl text-white line-clamp-2 leading-snug">
                      {activeItem.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-1 sm:mt-2 leading-relaxed hidden xs:block">
                      {activeItem.subtitle}
                    </p>

                    <div className="mt-3 sm:mt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF7300] group-hover:underline">
                        <span>Klaim Promo Sekarang</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows (Desktop/Tablet only to prevent text overlap on mobile) */}
            {items.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-[#FF7300] text-white border border-white/10 hidden sm:flex items-center justify-center transition-all z-20 active:scale-95 cursor-pointer shadow-md"
                  aria-label="Promo Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-[#FF7300] text-white border border-white/10 hidden sm:flex items-center justify-center transition-all z-20 active:scale-95 cursor-pointer shadow-md"
                  aria-label="Promo Berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {items.length > 1 && (
            <div className="py-2.5 bg-[#0E121B] border-t border-white/[0.06] flex items-center justify-center gap-1">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className="p-2 flex items-center justify-center cursor-pointer min-w-[28px] min-h-[28px]"
                  aria-label={`Slide ${idx + 1}`}
                >
                  <span
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300 block',
                      idx === current
                        ? 'w-6 bg-[#FF7300]'
                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
