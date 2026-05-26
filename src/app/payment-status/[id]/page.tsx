'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Clock, Copy, ArrowRight, Download, Home, Receipt, CheckCircle2, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

import confetti from 'canvas-confetti';

export default function PaymentStatusPage() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const txId = params?.id as string;
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed'>('pending');

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus('processing'), 3000);
    const timer2 = setTimeout(() => {
      setStatus('completed');
      
      // Fire Confetti Blast!
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

      toast.success('Transaksi berhasil! Item sudah dikirim ke akun kamu.');
    }, 6000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  const statusConfig = {
    pending: { label: 'Menunggu Pembayaran', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock },
    processing: { label: 'Sedang Diproses', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Loader2 },
    completed: { label: 'Transaksi Berhasil', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2 },
  };

  const current = statusConfig[status];

  return (
    <>
      <main className="min-h-screen pt-20 tablet:pt-24 pb-24 relative overflow-hidden perspective-[1000px]">
        {/* Animated Cyberpunk Background Glow */}
        {status === 'completed' && (
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
          </div>
        )}

        <div className="container-app max-w-lg">
          {/* Status Header */}
          <div className="text-center mb-8">
            <motion.div
              key={status}
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className={cn('w-24 h-24 rounded-[2rem] mx-auto mb-4 flex items-center justify-center shadow-2xl relative', current.bg)}
            >
              {status === 'completed' && <div className="absolute inset-0 rounded-[2rem] border-2 border-green-500/50 animate-ping" />}
              <current.icon className={cn('w-12 h-12', current.color, status === 'processing' && 'animate-spin')} />
            </motion.div>
            <h1 className={cn('text-2xl tablet:text-3xl font-black font-heading tracking-tight mb-2', current.color)}>
              {current.label}
            </h1>
            <p className="text-sm text-muted-foreground">
              {status === 'pending' && 'Silakan selesaikan pembayaran sebelum batas waktu habis'}
              {status === 'processing' && 'Pembayaran diterima, sistem sedang memproses otomatis...'}
              {status === 'completed' && 'Item sudah berhasil dikirim ke akun game kamu! 🎉'}
            </p>
          </div>

          {/* 3D Holographic Cyberpunk Ticket */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 1 }}
            className="group relative preserve-3d transition-transform duration-500 hover:-translate-y-2 hover:rotate-x-12 hover:-rotate-y-12 mb-8"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Holographic glowing edge */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-primary/50 via-cyan-500/50 to-purple-500/50 opacity-50 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500" />
            
            {/* Ticket Body */}
            <div className="relative bg-card/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              
              {/* Top Section */}
              <div className="p-6 tablet:p-8 bg-gradient-to-br from-white/5 to-transparent border-b border-dashed border-border/50 relative">
                {/* Decorative circles on edges */}
                <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-background border-r border-t border-border/50" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-background border-l border-t border-border/50" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Receipt Number</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-black tracking-tight">{txId}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(txId);
                          toast.success('Invoice disalin!');
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Status</p>
                    <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider', current.bg, current.color)}>
                      {status === 'completed' ? 'PAID' : status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Item Purchased</p>
                    <p className="text-base font-bold">Mobile Legends — 336 Diamonds</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Target Account</p>
                      <p className="text-sm font-semibold">123456789 (Zone: 1234)</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Payment Method</p>
                      <p className="text-sm font-semibold">QRIS Pay</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section (Tear-off) */}
              <div className="p-6 tablet:p-8 bg-black/5 relative">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Payment</p>
                    <p className="text-3xl font-black gradient-text tracking-tighter">{formatCurrency(78000)}</p>
                  </div>
                  
                  {/* Barcode Mock */}
                  <div className="flex flex-col items-end opacity-50 mix-blend-overlay">
                    <div className="h-8 w-24 bg-[repeating-linear-gradient(90deg,currentColor_0,currentColor_2px,transparent_2px,transparent_4px)]" />
                    <p className="text-[8px] font-mono mt-1 tracking-[0.2em]">{txId}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

            {/* Actions */}
            <div className="flex flex-col tablet:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-all"
              >
                <Home className="w-4 h-4" />
                Kembali ke Home
              </Link>
              <Link
                href="/dashboard/transactions"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-primary text-white text-sm font-medium hover:shadow-neon-violet transition-all"
              >
                <Receipt className="w-4 h-4" />
                Lihat Riwayat
              </Link>
            </div>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
