'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { useCurrencyStore, CURRENCIES, type CurrencyCode } from '@/store/currencyStore';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { cn } from '@/lib/utils';

export default function CurrencySwitcher({
  compact = false,
  className = '',
}: {
  compact?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency } = useCurrencyStore();
  const { playClick } = useSoundEffect();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeCurrency = CURRENCIES[currency] || CURRENCIES.IDR;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (code: CurrencyCode) => {
    playClick();
    setCurrency(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Pilih Mata Uang"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-xl border transition-all duration-200 focus:outline-none',
          compact
            ? 'px-2 py-1 text-[11px] font-bold bg-white/[0.04] border-white/10 hover:border-primary/40 hover:bg-white/[0.08] text-foreground shadow-sm'
            : 'px-2.5 py-1.5 text-xs font-semibold bg-card/60 border-border/80 hover:border-primary/50 text-foreground backdrop-blur-md shadow-sm'
        )}
      >
        <span className="text-xs leading-none">{activeCurrency.flag}</span>
        <span className="font-mono font-bold tracking-tight text-[11px] text-foreground">
          {activeCurrency.code}
        </span>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180 text-primary'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-card/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-1.5 z-[120] overflow-hidden"
          >
            <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border/40 mb-1 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-primary" />
              <span>Mata Uang</span>
            </div>

            <div className="space-y-0.5">
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                const item = CURRENCIES[code];
                const isSelected = item.code === currency;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelect(code)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all',
                      isSelected
                        ? 'gradient-primary text-white font-bold shadow-md shadow-primary/20'
                        : 'text-foreground hover:bg-white/[0.08] hover:text-primary'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm leading-none">{item.flag}</span>
                      <span className="font-mono font-bold text-xs">{item.code}</span>
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-bold font-mono',
                        isSelected ? 'text-white' : 'text-muted-foreground'
                      )}
                    >
                      {item.symbol}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
