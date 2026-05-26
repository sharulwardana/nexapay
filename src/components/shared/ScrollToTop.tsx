'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hidden tablet:flex fixed bottom-[84px] right-6 z-40 w-10 h-10 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all items-center justify-center shadow-elevated"
          aria-label="Scroll ke atas"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
