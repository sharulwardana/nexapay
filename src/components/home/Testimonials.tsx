'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Ahmad Rizki', role: 'Pro Player ML', content: 'Top up diamond ML disini paling cepat. Biasanya belum selesai klik confirm, diamond udah masuk. Mantap!', rating: 5 },
  { name: 'Siti Nurhaliza', role: 'Gamer Casual', content: 'Harganya paling murah dibanding platform lain. Udah gitu proses-nya instan lagi. Recommended banget!', rating: 5 },
  { name: 'Budi Santoso', role: 'Content Creator', content: 'Selalu top up di NexaPay buat konten. Prosesnya stabil, ga pernah gagal. Support payment lengkap.', rating: 5 },
  { name: 'Dewi Anggraeni', role: 'Mahasiswa', content: 'Suka banget sama flash sale-nya. Bisa hemat banyak buat top up game dan beli kuota. Promo sering banget.', rating: 5 },
  { name: 'Farhan Yusuf', role: 'Freelancer', content: 'Buat beli token PLN dan pulsa juga bisa, ga cuma game. Praktis banget satu app buat semua digital products.', rating: 4 },
];

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
          {testimonials.slice(0, 6).map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, ease: [0.33, 1, 0.68, 1] }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
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
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonials[current].rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">&ldquo;{testimonials[current].content}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{testimonials[current].name[0]}</span>
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
