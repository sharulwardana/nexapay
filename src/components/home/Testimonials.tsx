'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, BadgeCheck } from 'lucide-react';

import { testimonials } from '@/data/testimonials';

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, j) => (
        <Star
          key={j}
          className={`w-3.5 h-3.5 ${
            j < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted'
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t, i, isInView }: { t: typeof testimonials[number]; i: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.08, ease: [0.33, 1, 0.68, 1] }}
      className="p-5 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <RatingStars rating={t.rating} />
        {t.verified && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-primary/70">
            <BadgeCheck className="w-3.5 h-3.5" />
            Verified
          </span>
        )}
      </div>
      <p className="text-sm text-foreground mb-4 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center shadow-md`}>
          <span className="text-xs font-bold text-white">{t.avatar}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{t.name}</p>
          <p className="text-[11px] text-muted-foreground">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={ref} className="section-padding surface">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="label mb-2">Testimonials</p>
          <h2 className="heading-3">Kata mereka tentang NexaPay</h2>
        </motion.div>

        {/* Desktop: Grid */}
        <div className="hidden tablet:grid grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} i={i} isInView={isInView} />
          ))}
        </div>

        {/* Mobile: Single card with navigation */}
        <div className="tablet:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <Quote className="w-6 h-6 text-muted-foreground/20 mb-3" />
              <div className="flex items-center justify-between mb-3">
                <RatingStars rating={testimonials[current].rating} />
                {testimonials[current].verified && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-primary/70">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">&ldquo;{testimonials[current].content}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${testimonials[current].avatarBg} flex items-center justify-center shadow-md`}>
                  <span className="text-xs font-bold text-white">{testimonials[current].avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{testimonials[current].name}</p>
                  <p className="text-[11px] text-muted-foreground">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={prev} className="p-1.5 rounded-lg border border-border hover:bg-muted" aria-label="Previous">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground tabular-nums">
              {current + 1} / {testimonials.length}
            </span>
            <button onClick={next} className="p-1.5 rounded-lg border border-border hover:bg-muted" aria-label="Next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
