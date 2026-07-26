'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

const WA_NUMBER = '6281234567890'; // Ganti dengan nomor CS asli
const WA_MESSAGE = encodeURIComponent('Halo NexaPay! Saya butuh bantuan.');

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-[84px] right-4 tablet:bottom-6 tablet:right-6 z-40">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-14 right-0 w-56 p-3 rounded-xl bg-card border border-border shadow-xl"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 p-0.5 rounded-md hover:bg-muted"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
            <p className="text-xs font-semibold text-foreground mb-1">Butuh bantuan?</p>
            <p className="text-[11px] text-muted-foreground mb-3">
              Chat langsung dengan CS kami via WhatsApp. Respon cepat!
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat via WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setShowTooltip(!showTooltip)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-colors"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
