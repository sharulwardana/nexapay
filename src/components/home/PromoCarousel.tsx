'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { promotions } from '@/data/testimonials';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/shared/TiltCard';

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? '80%' : '-80%', opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-80%' : '80%', opacity: 0, scale: 0.96 }),
};

// Brand-aligned gradient palettes
const gradients = [
  'from-cyan-600 via-teal-600 to-blue-700',
  'from-blue-600 via-cyan-600 to-teal-700',
  'from-amber-600 via-orange-500 to-rose-600',
  'from-emerald-600 via-teal-600 to-cyan-700',
];

export default function PromoCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  return (
    <section ref={ref} className="pt-24 tablet:pt-28 pb-6 tablet:pb-10">
      <h1 className="sr-only">NexaPay - Platform Top Up Game Tercepat dan Termurah di Indonesia</h1>
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="relative"
        >
          {/* Carousel */}
          <TiltCard>
            <div className="relative rounded-2xl overflow-hidden aspect-[2/1] tablet:aspect-[3/1] lg:aspect-[3.5/1]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(_e, { offset, velocity }) => {
                    const swipeThreshold = 50;
                    const swipePower = Math.abs(offset.x) * velocity.x;
                    if (offset.x < -swipeThreshold || swipePower < -500) {
                      setDirection(1);
                      setCurrent((p) => (p + 1) % promotions.length);
                    } else if (offset.x > swipeThreshold || swipePower > 500) {
                      setDirection(-1);
                      setCurrent((p) => (p - 1 + promotions.length) % promotions.length);
                    }
                  }}
                >
                  {/* Gradient BG */}
                  <div className={cn('absolute inset-0 bg-gradient-to-br', gradients[current % gradients.length])} />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center p-6 tablet:p-10 lg:p-14">
                    <div className="max-w-lg">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm mb-3">
                        <Tag className="w-3 h-3 text-white" />
                        <span className="text-[10px] tablet:text-xs font-medium text-white/90">
                          {promotions[current].code}
                        </span>
                      </div>
                      <h3 className="text-lg tablet:text-2xl lg:text-3xl font-bold font-heading text-white mb-2 tracking-tight">
                        {promotions[current].title}
                      </h3>
                      <p className="text-xs tablet:text-sm text-white/70 mb-4 tablet:mb-6 line-clamp-2">
                        {promotions[current].subtitle}
                      </p>
                      <Link
                        href="/promo"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-gray-900 text-xs tablet:text-sm font-medium hover:bg-white/90 transition-colors"
                      >
                        Klaim Sekarang
                      </Link>
                    </div>
                  </div>

                  {/* Decorative */}
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 tablet:w-64 tablet:h-64 rounded-full bg-white/5" />
                </motion.div>
              </AnimatePresence>

              {/* Arrows (Hidden on mobile & small screens for clean text readability) */}
              <button
                onClick={() => { setDirection(-1); setCurrent((p) => (p - 1 + promotions.length) % promotions.length); }}
                className="hidden tablet:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur text-white items-center justify-center hover:bg-black/50 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setDirection(1); setCurrent((p) => (p + 1) % promotions.length); }}
                className="hidden tablet:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur text-white items-center justify-center hover:bg-black/50 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </TiltCard>

          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  'rounded-full transition-all duration-300',
                  current === index
                    ? 'w-5 h-1.5 bg-foreground'
                    : 'w-1.5 h-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/40'
                )}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
