'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Gift, X, Loader2, Coins, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import confetti from 'canvas-confetti';

export default function ScratchAndWin() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [pointsWon, setPointsWon] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 80) {
      setIsShrunk(true);
    } else if (latest < previous || latest < 40) {
      setIsShrunk(false);
    }
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // When opened, check status first
  useEffect(() => {
    if (isOpen && session && pointsWon === null && !hasPlayedToday) {
      setIsFetching(true);
      fetch('/api/user/scratch')
        .then((res) => res.json())
        .then((data) => {
          if (data.hasScratched) {
            setHasPlayedToday(true);
            setIsFetching(false);
          } else {
            // Not scratched yet, generate reward
            fetch('/api/user/scratch', { method: 'POST' })
              .then(async (res) => {
                const postData = await res.json();
                if (res.ok) {
                  setPointsWon(postData.pointsWon);
                } else {
                  setHasPlayedToday(true);
                }
              })
              .catch(() => {
                toast.error('Terjadi kesalahan jaringan');
              })
              .finally(() => {
                setIsFetching(false);
              });
          }
        })
        .catch(() => setIsFetching(false));
    }
  }, [isOpen, session, pointsWon, hasPlayedToday]);

  useEffect(() => {
    if (!isOpen || isScratched || hasPlayedToday || isFetching || pointsWon === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with metallic gray gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#94a3b8');
    gradient.addColorStop(0.5, '#cbd5e1');
    gradient.addColorStop(1, '#64748b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise texture
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
    
    // Add text overlay
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('GOSOK DI SINI 🪙', canvas.width / 2, canvas.height / 2 + 7);

    let isDrawing = false;
    let scratchedArea = 0;
    const totalArea = canvas.width * canvas.height;

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      
      const pos = getMousePos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
      ctx.fill();

      scratchedArea += Math.PI * 25 * 25;
      
      // If scratched enough (~40%), auto-reveal
      if (scratchedArea > totalArea * 0.4 && !isScratched) {
        setIsScratched(true);
        canvas.style.opacity = '0';
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          toast.success(`Selamat! Kamu mendapatkan +${pointsWon} Loyalty Points!`);
        }, 300);
      }
    };

    const handleDown = (e: MouseEvent | TouchEvent) => { isDrawing = true; scratch(e); };
    const handleUp = () => { isDrawing = false; };

    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', handleUp);
    canvas.addEventListener('mouseleave', handleUp);
    
    canvas.addEventListener('touchstart', handleDown, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    canvas.addEventListener('touchend', handleUp);

    return () => {
      canvas.removeEventListener('mousedown', handleDown);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('mouseup', handleUp);
      canvas.removeEventListener('mouseleave', handleUp);
      canvas.removeEventListener('touchstart', handleDown);
      canvas.removeEventListener('touchmove', scratch);
      canvas.removeEventListener('touchend', handleUp);
    };
  }, [isOpen, isScratched, hasPlayedToday, isFetching, pointsWon]);

  if (!session) return null; // Don't show floating gift button if not logged in

  return (
    <>
      {/* Floating Gift Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          y: isMobile ? (isShrunk ? 16 : 0) : 0
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(true);
        }}
        className="flex fixed bottom-[144px] right-4 tablet:right-6 tablet:bottom-[92px] w-12 h-12 tablet:w-14 tablet:h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.4)] items-center justify-center z-40 transition-shadow duration-200"
      >
        <Gift className="w-5 h-5 tablet:w-6 tablet:h-6 text-white" />
      </motion.button>

      {/* Scratch Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-card border border-border shadow-2xl rounded-3xl overflow-hidden z-10 text-center p-6"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8" />
              </div>
              <h2 className="heading-3 mb-2">Gosok & Menang!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Gosok kartu di bawah ini untuk mendapatkan hadiah kejutan Loyalty Points harian.
              </p>

              <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-muted border-2 border-dashed border-border flex items-center justify-center select-none">
                {isFetching ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground">Menyiapkan kartu...</span>
                  </div>
                ) : hasPlayedToday ? (
                  <div className="text-center p-4 flex flex-col items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                    <h3 className="font-bold text-foreground text-sm mb-1">Sudah Gosok Hari Ini!</h3>
                    <p className="text-xs text-muted-foreground">Kamu sudah mengambil kesempatan gosok kartu harian. Kembali lagi besok jam 00:00 WIB!</p>
                  </div>
                ) : (
                  <>
                    {/* The revealed prize underneath */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                      <p className="text-sm font-bold text-muted-foreground mb-1">SELAMAT! KAMU DAPAT</p>
                      <div className="flex items-center gap-2">
                        <Coins className="w-6 h-6 text-yellow-500" />
                        <span className="text-3xl font-black gradient-text">+{pointsWon}</span>
                      </div>
                      <p className="text-xs font-bold text-primary mt-1">Loyalty Points</p>
                    </div>

                    {/* The scratchable overlay */}
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={160}
                      className="absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-500 touch-none"
                    />
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
