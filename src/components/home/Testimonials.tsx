'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, BadgeCheck, MessageSquare } from 'lucide-react';

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
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary/[0.04] blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <RatingStars rating={t.rating} />
          {t.verified && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
        <Quote className="w-5 h-5 text-primary/15 mb-2" />
        <p className="text-sm text-foreground mb-4 leading-relaxed">{t.content}</p>
        <div className="flex items-center gap-3 pt-3 border-t border-border/50">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.avatarBg} flex items-center justify-center shadow-md`}>
            <span className="text-xs font-bold text-white">{t.avatar}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{t.name}</p>
            <p className="text-[11px] text-muted-foreground">{t.role}</p>
          </div>
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
    <section ref={ref} className="section-padding relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="container-app relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
            <MessageSquare className="w-3 h-3 text-violet-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-500">Testimonials</span>
          </div>
          <h2 className="heading-3">Kata mereka tentang NexaPay</h2>
          <p className="body-default mt-2 max-w-md mx-auto">Lebih dari 100.000 gamer sudah mempercayai NexaPay</p>
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
              initial={{ opacity: 0, x: 20, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded-2xl border border-border bg-card"
            >
              <Quote className="w-6 h-6 text-primary/15 mb-3" />
              <div className="flex items-center justify-between mb-3">
                <RatingStars rating={testimonials[current].rating} />
                {testimonials[current].verified && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">&ldquo;{testimonials[current].content}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${testimonials[current].avatarBg} flex items-center justify-center shadow-md`}>
                  <span className="text-xs font-bold text-white">{testimonials[current].avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{testimonials[current].name}</p>
                  <p className="text-[11px] text-muted-foreground">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-3 mt-5">
            <button onClick={prev} className="p-2 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/20 transition-all" aria-label="Previous">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground tabular-nums font-medium">
              {current + 1} / {testimonials.length}
            </span>
            <button onClick={next} className="p-2 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/20 transition-all" aria-label="Next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
