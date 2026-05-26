'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ScratchAndWin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const promoCode = 'NEXAWIN50';

  useEffect(() => {
    if (!isOpen || isScratched) return;

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
    ctx.fillText('GOSOK DI SINI', canvas.width / 2, canvas.height / 2 + 7);

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

      // Simple calculation of scratched area based on movement
      scratchedArea += Math.PI * 25 * 25;
      
      // If scratched enough (~40%), auto-reveal
      if (scratchedArea > totalArea * 0.4 && !isScratched) {
        setIsScratched(true);
        canvas.style.opacity = '0';
        setTimeout(() => {
          navigator.clipboard.writeText(promoCode);
          toast.success('Kode promo disalin otomatis!');
        }, 500);
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
  }, [isOpen, isScratched]);

  const copyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setIsCopied(true);
    toast.success('Kode promo disalin otomatis!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Gift Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex fixed bottom-[140px] right-6 w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] items-center justify-center z-50 animate-bounce"
      >
        <Gift className="w-6 h-6 text-white" />
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

              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-black mb-2">Voucher Spesial!</h3>
              <p className="text-sm text-muted-foreground mb-6">Gosok kartu di bawah ini untuk melihat kode promo rahasia.</p>

              <div className="relative w-full h-32 bg-muted/30 rounded-2xl border-2 border-dashed border-border overflow-hidden flex items-center justify-center">
                {/* Revealed Code */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
                  <p className="text-xs text-primary font-bold mb-1 uppercase tracking-widest">Kode Promo</p>
                  <p className="text-3xl font-black font-mono tracking-wider">{promoCode}</p>
                </div>

                {/* Scratch Canvas Overlay */}
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={128}
                  className="absolute inset-0 w-full h-full cursor-pointer z-10 transition-opacity duration-1000"
                  style={{ touchAction: 'none' }}
                />
              </div>

              {/* Action after reveal */}
              {isScratched && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={copyCode}
                  className="mt-6 w-full py-3 rounded-xl gradient-primary text-white font-bold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-neon-violet"
                >
                  {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {isCopied ? 'Tersalin!' : 'Salin Kode Promo'}
                </motion.button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
