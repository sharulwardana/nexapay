'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Gamepad2, ArrowRight, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSoundEffect } from '@/hooks/useSoundEffect';

const trendingSearches = [
  'Mobile Legends', 'Genshin Impact', 'Free Fire', 'VALORANT',
  'Pulsa Telkomsel', 'Token PLN', 'Steam Wallet',
];

export default function NavInlineSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playHover, playClick } = useSoundEffect();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults((data.results || []).slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative z-40">
      {/* Desktop / Tablet Inline Search Bar */}
      <div className={cn(
        "hidden tablet:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/50 transition-all duration-300 backdrop-blur-sm",
        "tablet:w-52 lg:w-64",
        isOpen ? "border-primary/60 bg-background/90 ring-2 ring-primary/20 shadow-lg" : "hover:border-primary/40 hover:bg-muted/60"
      )}>
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin flex-shrink-0" />
        ) : (
          <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onFocus={() => { playClick(); setIsOpen(true); }}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          placeholder="Cari game/produk..."
          className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/60 text-foreground"
        />
        {query ? (
          <button
            onClick={() => { setQuery(''); setResults([]); }}
            className="p-0.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded bg-muted/80 text-[9px] text-muted-foreground font-mono border border-border/50">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Mobile Icon Button (Identical to Cart & Notification Buttons) */}
      <button
        onClick={() => { playClick(); setIsOpen(!isOpen); }}
        onMouseEnter={playHover}
        className="tablet:hidden flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/50"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Desktop Floating Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Desktop View Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
              className="hidden tablet:block absolute top-full left-0 mt-2 w-72 tablet:w-[380px] glass-card p-2 rounded-2xl border border-border/80 shadow-2xl overflow-hidden z-50"
            >
              {/* Live Results */}
              {query.trim().length >= 2 ? (
                results.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-3 py-1 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Hasil Pencarian
                      </span>
                      <span className="text-[10px] text-muted-foreground">{results.length} ditemukan</span>
                    </div>
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={product.category === 'GAME_TOPUP' ? `/topup/${product.slug}` : `/products/${product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                          <Gamepad2 className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">{product.publisher || product.category}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                ) : !isLoading ? (
                  <div className="p-6 text-center">
                    <p className="text-xs text-muted-foreground">Tidak ditemukan hasil untuk &quot;{query}&quot;</p>
                  </div>
                ) : null
              ) : (
                /* Trending Searches when Query is Short */
                <div className="p-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-primary" /> Pencarian Populer
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => { setQuery(term); }}
                        onMouseEnter={playHover}
                        className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-primary/15 hover:text-primary text-[11px] font-medium text-muted-foreground transition-all border border-border/40"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Mobile Dark Backdrop Overlay - High Z-Index & Event Shielding */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
              onTouchStart={(e) => e.stopPropagation()}
              className="tablet:hidden fixed inset-0 bg-black/85 backdrop-blur-xl z-[90] pointer-events-auto touch-none select-none cursor-pointer"
            />

            {/* Mobile Full-Width Glass Header Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              className="tablet:hidden fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-4 pt-3 space-y-3 rounded-b-3xl"
            >
              {/* Mobile Visual Drag Handle */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-1 flex-shrink-0" />

              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-muted/40 border border-primary/50 shadow-[0_0_15px_rgba(255,115,0,0.15)] ring-1 ring-primary/20">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                ) : (
                  <Search className="w-4 h-4 text-primary flex-shrink-0" />
                )}
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ketik nama game/produk..."
                  className="flex-1 bg-transparent text-[16px] font-semibold outline-none text-foreground placeholder:text-muted-foreground/60 placeholder:text-xs"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Drawer Results */}
              <div className="max-h-[60vh] overflow-y-auto space-y-3">
                {query.trim().length >= 2 ? (
                  results.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1 mb-1">
                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Hasil Pencarian
                        </span>
                        <span className="text-[10px] text-muted-foreground">{results.length} ditemukan</span>
                      </div>
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={product.category === 'GAME_TOPUP' ? `/topup/${product.slug}` : `/products/${product.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 hover:bg-primary/10 border border-border/40 hover:border-primary/40 transition-all active:scale-[0.98]"
                        >
                          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 border border-primary/30 text-primary">
                            <Gamepad2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{product.publisher || product.category}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  ) : !isLoading ? (
                    <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-2xl border border-border/40">
                      Tidak ditemukan hasil untuk &quot;{query}&quot;
                    </div>
                  ) : null
                ) : (
                  <div className="p-1 space-y-3">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" /> POPULER SAAT INI
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1.5 rounded-xl bg-background/80 hover:bg-primary/20 text-foreground/90 hover:text-primary text-[11px] font-bold border border-white/10 hover:border-primary/40 shadow-sm transition-all duration-200 active:scale-95 flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
