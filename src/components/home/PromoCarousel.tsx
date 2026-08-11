'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag, Sparkles } from 'lucide-react';
import { promotions } from '@/data/testimonials';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/shared/TiltCard';

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? '80%' : '-80%', opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-80%' : '80%', opacity: 0, scale: 0.95 }),
};

// 2026 Multi-accent gradient palettes with mesh feel
const gradients = [
  'from-violet-600 via-fuchsia-500 to-cyan-500',
  'from-cyan-600 via-teal-500 to-emerald-500',
  'from-amber-500 via-orange-500 to-rose-500',
  'from-blue-600 via-violet-500 to-purple-600',
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
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Carousel */}
          <TiltCard>
            <div className="relative rounded-2xl tablet:rounded-3xl overflow-hidden aspect-[2/1] tablet:aspect-[3/1] lg:aspect-[3.5/1]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                  {/* Gradient BG with mesh overlay */}
                  <div className={cn('absolute inset-0 bg-gradient-to-br', gradients[current % gradients.length])} />
                  {/* Mesh pattern overlay */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-white/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] bg-black/10 rounded-full blur-[60px]" />
                  </div>
                  {/* Grid pattern */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center p-6 tablet:p-10 lg:p-14">
                    <div className="max-w-lg">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-3"
                      >
                        <Tag className="w-3 h-3 text-white" />
                        <span className="text-[10px] tablet:text-xs font-bold text-white/90 tracking-wide">
                          {promotions[current].code}
                        </span>
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="text-lg tablet:text-2xl lg:text-3xl font-bold font-heading text-white mb-2 tracking-tight drop-shadow-lg"
                      >
                        {promotions[current].title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        className="text-xs tablet:text-sm text-white/75 mb-4 tablet:mb-6 line-clamp-2"
                      >
                        {promotions[current].subtitle}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        <Link
                          href="/promo"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-950 text-xs tablet:text-sm font-bold font-heading hover:bg-white/90 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-md"
                        >
                          <Sparkles className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                          <span>Klaim Cyber Boost ⚡</span>
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  {/* Decorative circles */}
                  <div className="absolute -right-16 -bottom-16 w-56 h-56 tablet:w-72 tablet:h-72 rounded-full bg-white/5 border border-white/5" />
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 tablet:w-44 tablet:h-44 rounded-full bg-white/5" />
                </motion.div>
              </AnimatePresence>

              {/* Arrows */}
              <button
                onClick={() => { setDirection(-1); setCurrent((p) => (p - 1 + promotions.length) % promotions.length); }}
                className="hidden tablet:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white items-center justify-center hover:bg-black/50 hover:scale-105 transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setDirection(1); setCurrent((p) => (p + 1) % promotions.length); }}
                className="hidden tablet:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white items-center justify-center hover:bg-black/50 hover:scale-105 transition-all"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </TiltCard>

          {/* Dots — animated pill style */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className="relative rounded-full transition-all duration-400"
                aria-label={`Slide ${index + 1}`}
              >
                <div className={cn(
                  'rounded-full transition-all duration-400',
                  current === index
                    ? 'w-7 h-2 bg-primary shadow-lg shadow-primary/30'
                    : 'w-2 h-2 bg-muted-foreground/20 hover:bg-muted-foreground/40'
                )} />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
