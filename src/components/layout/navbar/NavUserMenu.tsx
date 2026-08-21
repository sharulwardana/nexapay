'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, LayoutDashboard, Wallet, LogOut, Star, ShieldCheck } from 'lucide-react';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { LOYALTY_LEVELS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { getLiveWalletBalance } from '@/actions/wallet';

import type { Session } from 'next-auth';

interface LoyaltyRank {
  name: string;
  color: string;
  minPoints: number;
  discount: number;
}

interface NavUserMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  closeAll: () => void;
  isLoggedIn: boolean;
  session: Session | null;
  points: number;
  rank: LoyaltyRank;
  nextRank: LoyaltyRank | null;
  progressPercent: number;
}

export default function NavUserMenu({
  isOpen,
  onToggle,
  closeAll,
  isLoggedIn,
  session,
  points,
  rank,
  nextRank,
  progressPercent
}: NavUserMenuProps) {
  const { playHover, playClick } = useSoundEffect();
  const [liveBalance, setLiveBalance] = useState<number | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      getLiveWalletBalance().then((bal) => setLiveBalance(bal));
    }
  }, [isOpen, isLoggedIn]);

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
        className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/50"
      >
        {isLoggedIn ? (
          <div className="w-full h-full rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xs">
            {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        ) : (
          <User className="w-4 h-4" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="tablet:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 right-3 w-[calc(100vw-24px)] max-w-sm tablet:absolute tablet:top-full tablet:right-0 tablet:left-auto tablet:w-72 tablet:mt-2 glass-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[70vh] flex flex-col"
            >
            {isLoggedIn ? (
              <>
                <div className="p-4 border-b border-border bg-muted/30">
                  <p className="font-bold text-sm line-clamp-1">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{session?.user?.email}</p>
                </div>
                
                {/* Level Progress */}
                <div className="p-4 border-b border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary" /> {rank.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{points} / {nextRank?.minPoints || 'MAX'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-1">
                    <div 
                      className="h-full gradient-primary rounded-full" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  {nextRank && (
                    <p className="text-[10px] text-muted-foreground text-center mt-1">
                      {nextRank.minPoints - points} poin lagi ke {nextRank.name}
                    </p>
                  )}
                </div>

                <div className="p-2 space-y-1">
                  {session?.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={closeAll}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 hover:bg-violet-500/25 transition-all shadow-lg shadow-violet-500/10 mb-1"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-4 h-4 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-amber-300 uppercase tracking-wider">Control Panel Admin 🛡️</p>
                        <p className="text-[10px] text-violet-400/80 truncate">Kelola Produk & Transaksi</p>
                      </div>
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    onClick={closeAll}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Dashboard Akun</p>
                      <p className="text-xs text-muted-foreground">Profil & Pengaturan</p>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/wallet"
                    onClick={closeAll}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">NexaPay Wallet</p>
                      <p className="text-xs font-bold text-foreground">
                        {formatCurrency(liveBalance !== null ? liveBalance : (session?.user?.walletBalance || 0))}
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="p-2 border-t border-border bg-muted/20">
                  <button
                    onClick={() => { playClick(); signOut({ redirectTo: '/' }); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar Akun
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm">Belum Login</h3>
                  <p className="text-xs text-muted-foreground mt-1">Masuk untuk transaksi lebih cepat dan dapatkan poin loyalitas.</p>
                </div>
                <Link
                  href="/login"
                  onClick={closeAll}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-neon-violet hover:shadow-[0_0_15px_rgba(255,115,0,0.5)] transition-all"
                >
                  <LogIn className="w-4 h-4" /> Masuk / Daftar
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </div>
  );
}
