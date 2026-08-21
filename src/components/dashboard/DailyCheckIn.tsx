'use client';

import { useState, useEffect } from 'react';
import { Gift, Check, Loader2, CalendarCheck2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import confetti from 'canvas-confetti';
import { useSoundEffect } from '@/hooks/useSoundEffect';

export default function DailyCheckIn({ initialHasClaimed = false }: { initialHasClaimed?: boolean }) {
  const [hasClaimed, setHasClaimed] = useState(initialHasClaimed);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const { playSuccess, playClick } = useSoundEffect();

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/user/checkin');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setHasClaimed(data.hasClaimed);
          }
        }
      } catch (err) {
        console.error('Failed to fetch checkin status:', err);
      } finally {
        if (isMounted) setIsLoadingStatus(false);
      }
    };
    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClaim = async () => {
    if (hasClaimed || isAnimating || isLoadingStatus) return;
    
    playClick();
    setIsAnimating(true);
    
    try {
      const res = await fetch('/api/user/checkin', { method: 'POST' });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal claim');
      }

      setHasClaimed(true);
      playSuccess();
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F97316', '#F59E0B', '#10B981'],
        disableForReducedMotion: true
      });

      showToast.success('Reward Harian Berhasil Diklaim!', `Selamat! +${data.points || 10} NexaPoints telah ditambahkan ke akun Anda.`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan saat check-in';
      if (msg.toLowerCase().includes('sudah check-in') || msg.toLowerCase().includes('already')) {
        setHasClaimed(true);
        showToast.warning('Sudah Check-In Hari Ini', 'Anda sudah mengambil klaim harian. Kembali lagi besok untuk klaim berikutnya!');
      } else {
        showToast.error('Gagal Check-In', msg);
      }
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-4 relative z-10 w-full">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-all duration-300",
            hasClaimed
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-gradient-to-br from-amber-400 via-orange-500 to-primary text-white shadow-orange-500/25"
          )}>
            {hasClaimed ? (
              <CalendarCheck2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Gift className="w-5 h-5 text-white animate-bounce-subtle" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold font-heading text-foreground leading-tight">Daily Check-in</h3>
            <p className="text-[11px] text-muted-foreground leading-tight">Klaim Poin Gratis</p>
          </div>
        </div>

        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase border shrink-0",
          hasClaimed 
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
            : "bg-amber-500/15 text-amber-400 border-amber-500/30"
        )}>
          {hasClaimed ? 'Selesai' : 'Gratis'}
        </span>
      </div>

      {/* Middle Description Box */}
      <div className="p-3 rounded-xl bg-surface/80 border border-border/40 text-left w-full">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {hasClaimed ? (
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Reward hari ini sudah diklaim. Kembali besok jam 00:00 WIB!
            </span>
          ) : (
            <span>Check-in setiap hari & klaim poin keberuntungan kamu!</span>
          )}
        </p>
      </div>

      {/* Bottom Full-Width Action Button */}
      <button
        onClick={handleClaim}
        disabled={hasClaimed || isAnimating || isLoadingStatus}
        className={cn(
          "w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 select-none shadow-md",
          hasClaimed 
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 cursor-not-allowed" 
            : "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-[0_4px_15px_rgba(249,115,22,0.4)] active:scale-95 cursor-pointer uppercase"
        )}
      >
        {isAnimating ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Membuka Hadiah...</>
        ) : isLoadingStatus ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Memuat Status...</>
        ) : hasClaimed ? (
          <><Check className="w-4 h-4 stroke-[2.5]" /> Sudah Diklaim Hari Ini</>
        ) : (
          <><Gift className="w-4 h-4" /> KLAIM HADIAH HARIAN</>
        )}
      </button>
    </div>
  );
}
