'use client';

import { useState } from 'react';
import { Gift, Coins, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useSoundEffect } from '@/hooks/useSoundEffect';

export default function DailyCheckIn() {
  const [hasClaimed, setHasClaimed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { playSuccess, playClick } = useSoundEffect();

  const handleClaim = () => {
    if (hasClaimed || isAnimating) return;
    
    playClick();
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsAnimating(false);
      setHasClaimed(true);
      playSuccess();
      
      // Fire confetti burst
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#F59E0B', '#10B981'],
        disableForReducedMotion: true
      });

      toast(
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
            <Coins className="w-4 h-4 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Reward Harian Berhasil Diklaim!</p>
            <p className="text-xs text-yellow-500">+500 NexaPoints</p>
          </div>
        </div>,
        {
          duration: 4000,
          className: 'bg-card/90 border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)] backdrop-blur-md rounded-2xl',
        }
      );
    }, 1200); // 1.2s loading state for suspense
  };

  return (
    <button
      onClick={handleClaim}
      disabled={hasClaimed || isAnimating}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-500 group relative overflow-hidden",
        hasClaimed 
          ? "border-green-500/20 bg-green-500/5 cursor-default" 
          : "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
      )}
    >
      {/* Shimmer effect for unclaimed state */}
      {!hasClaimed && (
        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
      )}
      
      <div className="flex items-center gap-3 relative z-10">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500",
          hasClaimed 
            ? "bg-gradient-to-br from-green-400 to-emerald-600 scale-95" 
            : "bg-gradient-to-br from-yellow-400 to-orange-500 group-hover:scale-105"
        )}>
          {hasClaimed ? <Check className="w-5 h-5 text-white" /> : <Gift className="w-5 h-5 text-white" />}
        </div>
        <div className="text-left">
          <p className={cn(
            "text-sm font-bold flex items-center gap-1.5 transition-colors duration-300",
            hasClaimed ? "text-green-500" : "text-foreground group-hover:text-primary"
          )}>
            Daily Check-in
          </p>
          <p className="text-[11px] text-muted-foreground">
            {hasClaimed ? 'Kembali besok untuk hadiah!' : 'Klaim hadiah gratis setiap hari!'}
          </p>
        </div>
      </div>
      
      <div className="relative z-10">
        <span className={cn(
          "px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all duration-500",
          hasClaimed 
            ? "bg-green-500/20 text-green-500 border border-green-500/30" 
            : "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]"
        )}>
          {isAnimating ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> Mengklaim</>
          ) : hasClaimed ? (
            <><Check className="w-3 h-3" /> Diklaim</>
          ) : (
            'Klaim'
          )}
        </span>
      </div>
    </button>
  );
}
