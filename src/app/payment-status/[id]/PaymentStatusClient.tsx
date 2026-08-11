'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Copy, Home, Receipt, CheckCircle2, Loader2, AlertCircle, XCircle, Zap, MessageCircle, Printer } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PaymentStatusClientProps {
  txId: string;
  productName: string;
  denomLabel: string;
  totalAmount: number;
  paymentMethod: string;
  gameUserId: string;
  gameServerId: string;
  status: string;
  expiresAt: string | null;
}

function ExpiryCountdown({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Kedaluwarsa');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!mounted) return <span className="font-mono tabular-nums">--:--:--</span>;

  return (
    <span className={cn(
      "font-mono tabular-nums font-bold",
      timeLeft === 'Kedaluwarsa' ? 'text-red-500' : 'text-yellow-500'
    )}>
      {timeLeft}
    </span>
  );
}

export default function PaymentStatusClient({
  txId,
  productName,
  denomLabel,
  totalAmount,
  paymentMethod,
  gameUserId,
  gameServerId,
  status: initialStatus,
  expiresAt,
}: PaymentStatusClientProps) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [isSimulating, setIsSimulating] = useState(false);

  const isCompleted = currentStatus === 'COMPLETED' || currentStatus === 'PAID';
  const isFailed = currentStatus === 'FAILED';
  const isPending = currentStatus === 'PENDING';
  const isProcessing = currentStatus === 'PROCESSING';

  useEffect(() => {
    if (isCompleted) {
      fireConfetti();
    }
  }, [isCompleted]);

  // Real-time polling auto-check (Feature 4)
  useEffect(() => {
    if (!isPending) return;
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/transactions/${txId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'COMPLETED' || data.status === 'PAID') {
            setCurrentStatus('COMPLETED');
            toast.success('Pembayaran Berhasil! Diamond sedang dikirim ke akun kamu... 🎉');
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        // silent check catch
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [isPending, txId]);

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const handleSimulatePayment = async () => {
    if (!isPending) return;
    setIsSimulating(true);
    try {
      const res = await fetch('/api/webhooks/mock-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: txId })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Pembayaran berhasil disimulasikan!');
        setCurrentStatus('COMPLETED');
      } else {
        toast.error(data.error || 'Gagal mensimulasikan pembayaran');
      }
    } catch (e) {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsSimulating(false);
    }
  };

  const statusConfig = {
    PENDING: { label: 'Menunggu Pembayaran', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock },
    PROCESSING: { label: 'Sedang Diproses', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Loader2 },
    COMPLETED: { label: 'Transaksi Berhasil', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2 },
    FAILED: { label: 'Transaksi Gagal', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle },
    REFUNDED: { label: 'Dikembalikan', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: AlertCircle },
  };

  const current = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.COMPLETED;

  return (
    <main className="min-h-screen pt-32 tablet:pt-36 pb-24 relative overflow-hidden">
      {/* Animated Background Glow */}
      {isCompleted && (
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
        </div>
      )}

      <div className="container-app max-w-lg">
        {/* Status Header */}
        <div className="text-center mb-8">
          <motion.div
            key={currentStatus}
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className={cn('w-24 h-24 rounded-[2rem] mx-auto mb-4 flex items-center justify-center shadow-2xl relative', current.bg)}
          >
            {isCompleted && <div className="absolute inset-0 rounded-[2rem] border-2 border-green-500/50 animate-ping" />}
            <current.icon className={cn('w-12 h-12', current.color, isProcessing && 'animate-spin')} />
          </motion.div>
          <h1 className={cn('text-2xl tablet:text-3xl font-black font-heading tracking-tight mb-2', current.color)}>
            {current.label}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isPending && 'Silakan selesaikan pembayaran sebelum batas waktu habis'}
            {isProcessing && 'Pembayaran diterima, sistem sedang memproses otomatis...'}
            {isCompleted && 'Item sudah berhasil dikirim ke akun kamu! 🎉'}
            {isFailed && 'Pembayaran gagal atau kedaluwarsa. Silakan coba lagi.'}
          </p>
        </div>

        {/* 2026 Interactive Order Progress Timeline Bar */}
        <div className="flex items-center justify-between p-4 mb-6 rounded-2xl bg-card/60 backdrop-blur-md border border-border shadow-sm">
          <div className="flex flex-col items-center gap-1">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all", isPending || isProcessing || isCompleted ? "gradient-primary text-white" : "bg-muted text-muted-foreground")}>1</div>
            <span className="text-[10px] font-bold text-foreground">Order</span>
          </div>
          <div className={cn("h-1 flex-1 mx-2 rounded-full transition-all duration-500", isProcessing || isCompleted ? "gradient-primary" : "bg-muted")} />
          <div className="flex flex-col items-center gap-1">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all", isProcessing || isCompleted ? "gradient-primary text-white" : "bg-muted text-muted-foreground")}>2</div>
            <span className="text-[10px] font-bold text-foreground">Bayar</span>
          </div>
          <div className={cn("h-1 flex-1 mx-2 rounded-full transition-all duration-500", isCompleted ? "bg-emerald-500" : "bg-muted")} />
          <div className="flex flex-col items-center gap-1">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all", isCompleted ? "bg-emerald-500 text-white shadow-emerald-500/30 animate-pulse" : "bg-muted text-muted-foreground")}>3</div>
            <span className="text-[10px] font-bold text-foreground">Selesai</span>
          </div>
        </div>

        {/* Expiry Countdown for Pending */}
        {isPending && expiresAt && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 p-4 mb-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5"
          >
            <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-0.5">Batas waktu pembayaran</p>
              <ExpiryCountdown expiresAt={expiresAt} />
            </div>
          </motion.div>
        )}

        {/* Holographic Ticket */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: "spring", bounce: 0.4, duration: 1 }}
          className="group relative mb-8"
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
                    {isCompleted ? 'PAID' : initialStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Item Purchased</p>
                  <p className="text-base font-bold">{productName} — {denomLabel}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Target Account</p>
                    <p className="text-sm font-semibold">{gameUserId}{gameServerId ? ` (Zone: ${gameServerId})` : ''}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Payment Method</p>
                    <p className="text-sm font-semibold">{paymentMethod.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section (Tear-off) */}
            <div className="p-6 tablet:p-8 bg-black/5 relative">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Payment</p>
                  <p className="text-3xl font-black gradient-text tracking-tighter">{formatCurrency(totalAmount)}</p>
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

        {/* Smart Action Buttons (Feature 1) */}
        {isPending && (
          <div className="mb-6 p-4 rounded-2xl bg-card border border-border/60 space-y-3 shadow-lg">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">
              Tindakan Pembayaran Cepat
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['gopay', 'dana', 'shopeepay', 'ovo'].includes(paymentMethod) && (
              <button
                onClick={() => {
                  const deepLinks: Record<string, { url: string; label: string }> = {
                    gopay: { url: 'gopay://', label: 'GoPay' },
                    dana: { url: 'dana://', label: 'DANA' },
                    shopeepay: { url: 'shopeeid://', label: 'ShopeePay' },
                    ovo: { url: 'ovo://', label: 'OVO' },
                  };
                  const wallet = deepLinks[paymentMethod] || deepLinks.gopay;
                  toast.success(`Membuka aplikasi ${wallet.label}...`);
                  window.location.href = wallet.url;
                }}
                className="px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-bold hover:bg-primary/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>📱 Buka App {
                  paymentMethod === 'gopay' ? 'GoPay' :
                  paymentMethod === 'dana' ? 'DANA' :
                  paymentMethod === 'shopeepay' ? 'ShopeePay' :
                  paymentMethod === 'ovo' ? 'OVO' : 'E-Wallet'
                }</span>
              </button>
              )}
              <button
                onClick={() => {
                  toast.success('Kode bayar / Invoice disalin!');
                  navigator.clipboard.writeText(txId);
                }}
                className="px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-foreground text-xs font-bold hover:bg-muted active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>📋 Salin Kode Bayar / Invoice</span>
              </button>
            </div>
          </div>
        )}

        {/* Smart Receipt Sharing & Print Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6 print:hidden">
          <button
            onClick={() => {
              const text = `*STRUK BUKTI TRANSAKSI NEXAPAY*%0A` +
                `---------------------------------------%0A` +
                `📄 *No Invoice:* ${txId}%0A` +
                `🎮 *Produk:* ${productName} - ${denomLabel}%0A` +
                `🎯 *ID Akun:* ${gameUserId}${gameServerId ? ` (${gameServerId})` : ''}%0A` +
                `💳 *Metode:* ${paymentMethod.toUpperCase()}%0A` +
                `💰 *Total Bayar:* ${formatCurrency(totalAmount)}%0A` +
                `⚡ *Status:* ${isCompleted ? 'BERHASIL ✅' : currentStatus}%0A` +
                `---------------------------------------%0A` +
                `Terima kasih telah bertransaksi di NexaPay! 🚀`;
              window.open(`https://wa.me/?text=${text}`, '_blank');
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span>Kirim Struk ke WA</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted/40 hover:bg-muted border border-border text-foreground text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <Printer className="w-4 h-4 text-muted-foreground" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>

        {/* Dev Simulation Button */}
        {isPending && process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 rounded-xl border border-dashed border-primary/50 bg-primary/5 flex flex-col items-center gap-3 print:hidden">
            <p className="text-xs text-muted-foreground text-center">
              *Hanya muncul di Development Mode. Gunakan tombol ini untuk menyelesaikan pesanan layaknya callback dari Payment Gateway.
            </p>
            <button
              onClick={handleSimulatePayment}
              disabled={isSimulating}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-neon-violet"
            >
              {isSimulating ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : <><Zap className="w-4 h-4" /> Simulasikan Pembayaran Berhasil</>}
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col tablet:flex-row gap-3 print:hidden">
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
  );
}
