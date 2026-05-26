'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      id="page-transition-wrapper"
      style={{ position: 'relative' }}
      className="origin-top"
      initial={{ opacity: 0, y: 20, scale: 0.98, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, scale: 0.98, filter: 'blur(4px)' }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30, 
        mass: 1,
        // Ensure filter doesn't overshoot into negative values
        filter: { type: 'tween', duration: 0.3, ease: 'easeOut' }
      }}
      onAnimationComplete={(definition) => {
        // Remove transform and filter after animation so `fixed` elements (like Navbar) 
        // stick to the viewport properly instead of scrolling away.
        const el = document.getElementById('page-transition-wrapper');
        if (el) {
          el.style.transform = '';
          el.style.filter = '';
        }
      }}
    >
      {children}
    </motion.div>
  );
}
