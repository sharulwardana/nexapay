'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Wallet, Plus, ArrowUpRight, ArrowDownLeft, Clock, X, Loader2, 
  Send, CheckCircle2, QrCode, Building2, Copy, Check, Zap, Sparkles 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { topUpWallet, transferWallet } from '@/actions/wallet';
import confetti from 'canvas-confetti';

interface WalletHistoryItem {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  status: string;
}

const PRESET_AMOUNTS = [10000, 20000, 50000, 100000, 250000, 500000];

const PAYMENT_METHODS_TOPUP = [
  { id: 'QRIS', name: 'QRIS Instant', desc: 'Scan GoPay, OVO, DANA, ShopeePay', icon: QrCode, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { id: 'BCA_VA', name: 'BCA Virtual Account', desc: 'Verifikasi Otomatis 24 Jam', icon: Building2, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'MANDIRI_VA', name: 'Mandiri Virtual Account', desc: 'Verifikasi Otomatis 24 Jam', icon: Building2, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'INSTANT', name: 'Direct Instan (Dev)', desc: 'Pengujian Cepat Tanpa Transfer', icon: Zap, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
];

export default function WalletClient({ 
  initialBalance, 
  history 
}: { 
  initialBalance: number; 
  history: WalletHistoryItem[];
}) {
  const [balance, setBalance] = useState(initialBalance);
  const [filter, setFilter] = useState('ALL');
  
  // Top Up Modal State
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpStep, setTopUpStep] = useState<1 | 2>(1);
  const [topUpAmount, setTopUpAmount] = useState<number | ''>(50000);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Real-time Countdown Timer State for TopUp Invoice (Step 2)
  const [timeLeft, setTimeLeft] = useState(86399); // 23h 59m 59s

  // Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [isTransferLoading, setIsTransferLoading] = useState(false);

  const filtered = filter === 'ALL' ? history : history.filter((h) => h.type === filter.toLowerCase());

  // Countdown timer interval when step 2 invoice is opened
  useEffect(() => {
    if (topUpStep !== 2) return;
    setTimeLeft(86399);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [topUpStep]);

  const formatCountdown = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(topUpAmount);
    if (!amount || amount < 10000) {
      toast.error('Minimal top up adalah Rp 10.000');
      return;
    }
    if (paymentMethod === 'INSTANT') {
      executeTopUp();
    } else {
      setTopUpStep(2);
    }
  };

  const executeTopUp = async () => {
    const amount = Number(topUpAmount);
    setIsTopUpLoading(true);
    const res = await topUpWallet(amount);
    setIsTopUpLoading(false);

    if (res.success && res.balance !== undefined) {
      setBalance(res.balance);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      toast.success(`Top Up ${formatCurrency(amount)} Berhasil Masuk Ke Database!`);
      setShowTopUpModal(false);
      setTopUpStep(1);
    } else {
      toast.error(res.error || 'Gagal melakukan top up saldo');
    }
  };

  const handleCopyVA = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success('Nomor Virtual Account disalin!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(transferAmount);
    if (!recipient.trim()) {
      toast.error('Email atau Nomor HP penerima wajib diisi');
      return;
    }
    if (!amount || amount < 5000) {
      toast.error('Minimal transfer adalah Rp 5.000');
      return;
    }
    if (amount > balance) {
      toast.error('Saldo NexaPay Anda tidak mencukupi');
      return;
    }

    setIsTransferLoading(true);
    const res = await transferWallet(recipient.trim(), amount, notes.trim());
    setIsTransferLoading(false);

    if (res.success) {
      setBalance((prev) => prev - amount);
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
      toast.success(`Transfer ${formatCurrency(amount)} ke ${res.recipientName} Berhasil!`);
      setShowTransferModal(false);
      setRecipient('');
      setTransferAmount('');
      setNotes('');
    } else {
      toast.error(res.error || 'Gagal melakukan transfer saldo');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 aurora-bg">
        <div className="container-app max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg tablet:text-xl font-bold">Wallet NexaPay</h1>
          </div>

          {/* 3D Holographic Metallic NexaPay Card (2026 Edition) */}
          <div 
            className="group relative p-6 tablet:p-8 rounded-3xl mb-6 overflow-hidden transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(255,115,0,0.25)] border border-white/20"
            style={{
              background: 'linear-gradient(135deg, #141414 0%, #1f1f23 40%, #0a0a0d 100%)',
            }}
          >
            {/* Holographic Refraction Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gradient-to-br from-primary/30 to-amber-500/20 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-violet-600/15 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Card Header: Brand & Contactless */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-md">
                    <span className="text-white font-heading font-bold text-xs">N</span>
                  </div>
                  <span className="font-heading font-black text-sm tracking-wider uppercase text-white/90">
                    NexaPay <span className="text-xs font-mono text-primary font-normal">BLACK</span>
                  </span>
                </div>
                
                {/* Contactless Wave Icon & EMV Chip */}
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8.5 14.5A5 5 0 0 0 8.5 9.5" />
                    <path d="M11.5 17.5A9 9 0 0 0 11.5 6.5" />
                    <path d="M14.5 20.5A13 13 0 0 0 14.5 3.5" />
                  </svg>
                  <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 p-[1px] shadow-sm">
                    <div className="w-full h-full rounded-[5px] bg-amber-400/90 grid grid-cols-2 grid-rows-2 gap-[1px]">
                      <div className="border-r border-b border-amber-600/40" />
                      <div className="border-b border-amber-600/40" />
                      <div className="border-r border-amber-600/40" />
                      <div />
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div className="my-4">
                <span className="text-xs font-medium text-white/50 uppercase tracking-widest block mb-1">Total Saldo Wallet</span>
                <p className="text-3xl tablet:text-4xl font-bold font-heading tracking-tight text-white drop-shadow-md">
                  {formatCurrency(balance)}
                </p>
              </div>

              {/* Masked Card Number */}
              <div className="my-4 font-mono text-xs tablet:text-sm text-white/40 tracking-[0.25em] select-none">
                •••• •••• •••• <span className="text-white/70">2026</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowTopUpModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-xs tablet:text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-neon-orange active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Isi Saldo
                </button>
                <button 
                  onClick={() => setShowTransferModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs tablet:text-sm font-bold active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                >
                  <ArrowUpRight className="w-4 h-4" /> Transfer
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div
            className="flex gap-2 overflow-x-auto no-scrollbar mb-4"
          >
            {['ALL', 'TOPUP', 'PURCHASE', 'CASHBACK', 'REFUND', 'REFERRAL'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
                  filter === f ? 'gradient-primary text-white font-bold shadow-sm' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                {f === 'ALL' ? 'Semua' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* History */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-semibold">Riwayat Transaksi Wallet</h2>
            </div>
            <div className="divide-y divide-border">
              {filtered.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    item.amount > 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                  )}>
                    {item.amount > 0 ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.description}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(item.date).toLocaleString('id-ID')}</p>
                  </div>
                  <span className={cn('text-sm font-bold flex-shrink-0', item.amount > 0 ? 'text-green-500' : 'text-red-500')}>
                    {item.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(item.amount))}
                  </span>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Belum ada riwayat transaksi wallet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Top Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <div 
            onClick={() => setShowTopUpModal(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-24 tablet:pb-4 bg-black/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md max-h-[75vh] tablet:max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-xl border border-violet-500/30 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(139,92,246,0.2)] space-y-3.5 sm:space-y-5 cursor-default relative no-scrollbar"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-border/60 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Top Up Saldo NexaPay</h3>
                    <p className="text-xs text-muted-foreground">
                      {topUpStep === 1 ? 'Isi ulang saldo wallet secara instan' : 'Konfirmasi & Pembayaran Tagihan'}
                    </p>
                  </div>
                </div>
                <button onClick={() => { setShowTopUpModal(false); setTopUpStep(1); }} className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {topUpStep === 1 ? (
                <form onSubmit={handleNextStep} className="space-y-4 relative z-10">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Pilih Nominal Top Up</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {PRESET_AMOUNTS.map((amt) => (
                        <motion.button
                          key={amt}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTopUpAmount(amt)}
                          className={cn(
                            'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5',
                            topUpAmount === amt 
                              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-violet-400 shadow-md shadow-violet-500/30' 
                              : 'bg-muted/40 border-border text-foreground hover:bg-muted/70 hover:border-violet-500/30'
                          )}
                        >
                          <span>{formatCurrency(amt)}</span>
                        </motion.button>
                      ))}
                    </div>

                    <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Atau Nominal Lainnya</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 font-bold text-sm text-violet-400 select-none">Rp</span>
                      <input
                        type="number"
                        min={10000}
                        max={10000000}
                        required
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="50.000"
                        className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-muted/40 border border-border text-sm font-bold text-foreground focus:outline-none focus:border-violet-500 focus:bg-muted/70 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Pilih Metode Pembayaran</label>
                    <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar pr-1">
                      {PAYMENT_METHODS_TOPUP.map((pm) => {
                        const IconComponent = pm.icon;
                        const isSelected = paymentMethod === pm.id;
                        return (
                          <div
                            key={pm.id}
                            onClick={() => setPaymentMethod(pm.id)}
                            className={cn(
                              'p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all',
                              isSelected 
                                ? 'bg-gradient-to-r from-violet-600/20 via-fuchsia-600/10 to-transparent border-violet-500 text-foreground shadow-sm' 
                                : 'bg-muted/30 border-border hover:bg-muted/60'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center border', pm.color)}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-foreground">{pm.name}</p>
                                <p className="text-[10px] text-muted-foreground">{pm.desc}</p>
                              </div>
                            </div>
                            <div className={cn(
                              'w-4 h-4 rounded-full border flex items-center justify-center transition-all',
                              isSelected ? 'border-violet-500 bg-violet-600 text-white' : 'border-border'
                            )}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl gradient-primary text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(249,115,22,0.35)] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer tracking-wide uppercase mt-2"
                  >
                    <span>Lanjutkan Pembayaran</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              ) : (
                <div className="space-y-4 relative z-10">
                  {/* Step 2 Invoice View */}
                  <div className="p-4 rounded-2xl bg-surface/90 border border-border space-y-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-bold bg-amber-500/10 py-1.5 px-3 rounded-full w-fit mx-auto border border-amber-500/20">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Selesaikan Pembayaran Dalam {formatCountdown(timeLeft)}</span>
                    </div>

                    <div className="py-2 border-y border-border/50">
                      <p className="text-xs text-muted-foreground">Total Tagihan Top Up</p>
                      <p className="text-2xl font-black font-heading text-foreground mt-0.5">{formatCurrency(Number(topUpAmount))}</p>
                    </div>

                    {paymentMethod === 'QRIS' ? (
                      <div className="space-y-2 py-1">
                        <p className="text-xs font-semibold text-muted-foreground">Scan QRIS Di Bawah Menggunakan E-Wallet Anda</p>
                        <div className="w-44 h-44 bg-white p-2.5 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-border">
                          {/* Mock QRIS Code SVG */}
                          <div className="w-full h-full border-4 border-dashed border-gray-900 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                            <QrCode className="w-16 h-16 text-gray-900 mb-1" />
                            <span className="text-[10px] font-black text-gray-900 tracking-wider">NEXAPAY QRIS</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 py-2">
                        <p className="text-xs font-semibold text-muted-foreground">Nomor Virtual Account Bank</p>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                          <span className="text-sm font-mono font-bold tracking-wider text-foreground">88012 0892 1820 19</span>
                          <button
                            onClick={() => handleCopyVA('880120892182019')}
                            className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTopUpStep(1)}
                      className="py-3 px-4 rounded-2xl bg-muted/50 hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer"
                    >
                      ← Kembali
                    </button>

                    <button
                      type="button"
                      onClick={executeTopUp}
                      disabled={isTopUpLoading}
                      className="flex-1 py-3 rounded-2xl gradient-primary text-white font-extrabold text-xs shadow-[0_8px_25px_rgba(249,115,22,0.35)] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 uppercase tracking-wide"
                    >
                      {isTopUpLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Simulasi Bayar Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <div 
            onClick={() => setShowTransferModal(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-24 tablet:pb-4 bg-black/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md max-h-[75vh] tablet:max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] space-y-3.5 sm:space-y-5 cursor-default relative no-scrollbar"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-border/60 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Transfer Saldo NexaPay</h3>
                    <p className="text-xs text-muted-foreground">Kirim saldo instan ke sesama pengguna</p>
                  </div>
                </div>
                <button onClick={() => setShowTransferModal(false)} className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4 relative z-10">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Penerima (Email / No. HP)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-bold text-sm text-cyan-400 select-none">@</span>
                    <input
                      type="text"
                      required
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="email@penerima.com atau 0812xxx"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/40 border border-border text-sm font-medium text-foreground focus:outline-none focus:border-cyan-500 focus:bg-muted/70 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Jumlah Transfer</label>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Saldo: <span className="text-foreground font-bold">{formatCurrency(balance)}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                    {[10000, 25000, 50000, 100000].map((amt) => (
                      <motion.button
                        key={amt}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTransferAmount(amt)}
                        className={cn(
                          'py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer text-center',
                          transferAmount === amt 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/20' 
                            : 'bg-muted/40 border-border text-foreground hover:bg-muted/70 hover:border-cyan-500/30'
                        )}
                      >
                        {formatCurrency(amt)}
                      </motion.button>
                    ))}
                  </div>

                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-bold text-sm text-cyan-400 select-none">Rp</span>
                    <input
                      type="number"
                      min={5000}
                      max={balance}
                      required
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="25.000"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted/40 border border-border text-sm font-bold text-foreground focus:outline-none focus:border-cyan-500 focus:bg-muted/70 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Catatan / Pesan (Opsional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Pembayaran jajan"
                    className="w-full px-4 py-3 rounded-2xl bg-muted/40 border border-border text-sm font-medium text-foreground focus:outline-none focus:border-cyan-500 focus:bg-muted/70 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isTransferLoading}
                  className="w-full py-3.5 rounded-2xl gradient-primary text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(249,115,22,0.35)] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 tracking-wide uppercase mt-2"
                >
                  {isTransferLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Saldo Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
