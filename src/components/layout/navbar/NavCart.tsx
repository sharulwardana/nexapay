'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Zap } from 'lucide-react';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';

interface NavCartProps {
  isOpen: boolean;
  onToggle: () => void;
  closeAll: () => void;
}

export default function NavCart({ isOpen, onToggle, closeAll }: NavCartProps) {
  const { playHover, playClick } = useSoundEffect();
  const { items: cartItems, getItemCount, getTotal, removeItem } = useCartStore();

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
    <div className="relative">
      <button
        onClick={() => {
          playClick();
          onToggle();
        }}
        onMouseEnter={playHover}
        className="relative flex items-center px-2 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Cart"
      >
        <ShoppingCart className="w-4 h-4" />
        {getItemCount() > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full gradient-primary text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
            {getItemCount()}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Dark Backdrop - High Z-Index & Event Shielding */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              className="tablet:hidden fixed inset-0 bg-black/85 backdrop-blur-xl z-[90] pointer-events-auto touch-none select-none cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 right-3 w-[calc(100vw-24px)] max-w-sm tablet:absolute tablet:top-full tablet:right-0 tablet:left-auto tablet:w-[360px] tablet:mt-2 glass-card border border-white/15 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[100] max-h-[70vh] flex flex-col"
            >
              {/* Mobile Visual Drag Handle */}
              <div className="tablet:hidden w-10 h-1 bg-white/25 rounded-full mx-auto mt-2.5 flex-shrink-0" />

              <div className="p-3.5 border-b border-border/60 flex justify-between items-center bg-muted/40 flex-shrink-0">
                <div>
                  <h3 className="font-bold text-sm">Keranjang Belanja</h3>
                  <p className="text-[11px] text-muted-foreground">{getItemCount()} item tersimpan</p>
                </div>
                <button
                  onClick={() => { playClick(); onToggle(); }}
                  className="p-1 rounded-lg bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Tutup Keranjang"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto no-scrollbar p-3 space-y-2 flex-1 min-h-0">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.denominationId} className="flex gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/40 items-center">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate">{item.productName}</h4>
                        <p className="text-[11px] text-muted-foreground">{item.quantity}x {item.gameUserId || item.phoneNumber}</p>
                        <p className="text-xs font-bold text-primary mt-0.5">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                      <button
                        onClick={() => { playClick(); removeItem(item.denominationId); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mb-2">
                      <ShoppingCart className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <h4 className="font-bold text-xs mb-0.5">Keranjang Kosong</h4>
                    <p className="text-[11px] text-muted-foreground mb-3">Belum ada item yang ditambahkan.</p>
                    <Link
                      href="/topup"
                      onClick={() => { playClick(); closeAll(); }}
                      className="px-4 py-2 rounded-xl gradient-primary text-white text-xs font-bold shadow-neon-violet"
                    >
                      Mulai Belanja
                    </Link>
                  </div>
                )}
              </div>

              {cartItems.length > 0 ? (
                <div className="p-3.5 border-t border-border/60 bg-background/95 backdrop-blur-xl flex-shrink-0 sticky bottom-0 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Subtotal ({getItemCount()} item)</span>
                    <span className="font-bold text-base gradient-text">{formatCurrency(getTotal())}</span>
                  </div>
                  <Link
                    href={cartItems[0]?.productId ? (['game-mlbb', 'game-ff', 'game-val', 'game-genshin', 'game-pubgm', 'game-hsr', 'game-codm', 'game-roblox', 'game-steam', 'game-wr', 'game-aov', 'game-zzz'].includes(cartItems[0].productId) || cartItems[0].productId.startsWith('game-') ? `/topup/${cartItems[0].productId.replace('game-mlbb', 'mobile-legends').replace('game-ff', 'free-fire').replace('game-val', 'valorant').replace('game-genshin', 'genshin-impact').replace('game-pubgm', 'pubg-mobile').replace('game-hsr', 'honkai-star-rail').replace('game-codm', 'call-of-duty-mobile').replace('game-roblox', 'roblox').replace('game-steam', 'steam-wallet').replace('game-wr', 'wild-rift').replace('game-aov', 'arena-of-valor').replace('game-zzz', 'zenless-zone-zero').replace('game-', '')}` : `/products/${cartItems[0].productId}`) : '/topup'}
                    onClick={() => { playClick(); closeAll(); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-primary text-white font-bold text-xs shadow-neon-violet transition-all active:scale-[0.98]"
                  >
                    <Zap className="w-3.5 h-3.5" /> Lanjutkan Pembayaran
                  </Link>
                  <button
                    onClick={() => { playClick(); onToggle(); }}
                    className="tablet:hidden w-full py-1.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <X className="w-3.5 h-3.5" /> Tutup Keranjang
                  </button>
                </div>
              ) : (
                <div className="tablet:hidden p-2.5 border-t border-border/40 bg-background/95 backdrop-blur-md flex-shrink-0">
                  <button
                    onClick={() => { playClick(); onToggle(); }}
                    className="w-full py-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold flex items-center justify-center gap-1.5 border border-border/50 transition-all active:scale-[0.98]"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground" /> Tutup Keranjang
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
