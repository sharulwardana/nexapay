'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Gamepad2, TrendingUp, Clock, Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchStore } from '@/store/globalStore';

const trendingSearches = [
  'Mobile Legends', 'Genshin Impact', 'Free Fire', 'VALORANT',
  'Pulsa Telkomsel', 'Token PLN', 'Steam Wallet',
];

export default function SearchOverlay() {
  const { isOpen, setIsOpen } = useSearchStore();
  const [query, setQuery] = useState('');

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        const combined = (data.results || []).slice(0, 8);
        setResults(combined);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.33, 1, 0.68, 1] }}
            className="fixed top-0 left-0 right-0 z-[61] p-4 tablet:p-6 tablet:pt-24"
          >
            <div className="max-w-xl mx-auto rounded-xl bg-card border border-border shadow-xl overflow-hidden" role="dialog" aria-label="Pencarian" aria-modal="true">
              {/* Input */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-50" />
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border relative z-10">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tanya AI: 'game tembak-tembakan'..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 text-foreground"
                    autoFocus
                    aria-label="Cari produk"
                  />
                  <button onClick={handleClose} className="p-1 rounded-md hover:bg-muted transition-colors" aria-label="Tutup pencarian">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* AI Recommendation Context (Mock) */}
                {query.length > 2 && results.length > 0 && (
                  <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                    <Bot className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-medium text-primary">Rekomendasi Pintar NexaAI</span>
                  </div>
                )}
                {/* Results */}
                {results.length > 0 && (
                  <div className="p-1.5">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={product.category === 'GAME_TOPUP' ? `/topup/${product.slug}` : `/products/${product.slug}`}
                        onClick={handleClose}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                          <Gamepad2 className="w-4 h-4 text-primary/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground">{product.publisher}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* No results */}
                {query.length >= 2 && results.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="w-6 h-6 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Tidak ditemukan hasil untuk &quot;{query}&quot;</p>
                  </div>
                )}

                {/* Trending (when empty) */}
                {query.length < 2 && (
                  <div className="p-4">
                    <p className="label mb-2.5 flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" /> Populer
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {trendingSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>

                    <p className="label mt-5 mb-2.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Terakhir Dicari
                    </p>
                    <div className="space-y-0.5">
                      {['Mobile Legends', 'Pulsa Telkomsel 50K'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted/50 transition-colors text-left"
                        >
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-border flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Ketik minimal 2 karakter</span>
                <div className="flex items-center gap-1.5">
                  <kbd className="hidden tablet:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[9px] text-muted-foreground font-mono border border-border">⌘K</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted text-[9px] text-muted-foreground font-mono border border-border">ESC</kbd>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
