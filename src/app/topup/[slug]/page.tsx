'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Gamepad2,
  CreditCard,
  ShieldCheck,
  Loader2,
  Info,
  Tag,
  ChevronRight,
  Zap,
  Star,
  Copy,
  Gem,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { games } from '@/data/games';
import { PAYMENT_METHODS } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUserStore, useUserGamification } from '@/store/userStore';

const gameColors: Record<string, string> = {
  'mobile-legends': 'rgba(234, 179, 8, 0.15)', // Gold
  'free-fire': 'rgba(249, 115, 22, 0.15)', // Orange
  'valorant': 'rgba(239, 68, 68, 0.15)', // Red
  'genshin-impact': 'rgba(56, 189, 248, 0.15)', // Light Blue
  'pubg-mobile': 'rgba(250, 204, 21, 0.15)', // Yellow
};

export default function TopUpDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const game = games.find((g) => g.slug === slug);

  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { addExp } = useUserStore();
  const { rank } = useUserGamification();

  // Load saved ID from LocalStorage
  useEffect(() => {
    if (game) {
      const savedUserId = localStorage.getItem(`nexapay_userid_${game.slug}`);
      const savedServerId = localStorage.getItem(`nexapay_serverid_${game.slug}`);
      if (savedUserId) setUserId(savedUserId);
      if (savedServerId) setServerId(savedServerId);
    }
  }, [game]);

  if (!game) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <Gamepad2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Game tidak ditemukan</h2>
            <Link href="/topup" className="text-primary hover:underline">
              Kembali ke katalog
            </Link>
          </div>
        </main>
        <MobileNav />
      </>
    );
  }

  const denom = game.denominations.find((d) => d.id === selectedDenom);
  const payment = PAYMENT_METHODS.find((p) => p.id === selectedPayment);
  
  // Calculate price and Gamification Discounts
  const basePrice = denom?.isFlashSale && denom.flashSalePrice ? denom.flashSalePrice : (denom?.price || 0);
  const discountAmount = Math.floor(basePrice * (rank.discount / 100));
  const price = basePrice - discountAmount;
  
  const fee = payment?.fee || 0;
  const total = price + fee;

  const validateAccount = () => {
    if (!userId) {
      toast.error('Masukkan User ID');
      return;
    }
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setIsValidated(true);
      // Auto-save ID to LocalStorage
      localStorage.setItem(`nexapay_userid_${game?.slug}`, userId);
      if (serverId) localStorage.setItem(`nexapay_serverid_${game?.slug}`, serverId);
      
      toast.success('Akun berhasil divalidasi!', {
        description: `Player: GamerPro_${userId} | Server: ${serverId || 'Asia'}`,
      });
    }, 1500);
  };

  const handleCheckout = () => {
    if (!userId || !selectedDenom || !selectedPayment) {
      toast.error('Harap lengkapi Data Akun, Nominal, dan Pembayaran!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      const expGained = Math.floor(total * 0.1);
      addExp(expGained);
      
      const txId = `NXP-${Date.now().toString(36).toUpperCase()}`;
      toast.success('Pesanan berhasil dibuat!', {
        description: `Kamu mendapatkan +${expGained} EXP!`,
      });
      router.push(`/payment-status/${txId}`);
    }, 2000);
  };

  const isFormComplete = !!(userId && selectedDenom && selectedPayment);

  // Group payments by category
  const paymentsByCategory = PAYMENT_METHODS.reduce((acc, pm) => {
    if (!acc[pm.category]) acc[pm.category] = [];
    acc[pm.category].push(pm);
    return acc;
  }, {} as Record<string, typeof PAYMENT_METHODS[number][]>);

  const gameColor = gameColors[game.slug] || 'rgba(99, 102, 241, 0.15)'; // Default Indigo

  return (
    <>
      {/* Dynamic Game Ambient Background */}
      <div 
        className="fixed inset-0 pointer-events-none -z-40 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${gameColor} 0%, transparent 70%)`
        }}
      />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-32 lg:pb-24 relative z-0">
        <div className="container-app max-w-5xl">
          {/* Back button + Game info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <button
              onClick={() => router.push('/topup')}
              className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors z-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 tablet:w-12 tablet:h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden relative">
                {game.image ? (
                  <Image src={game.image} alt={game.name} fill className="object-cover" unoptimized />
                ) : (
                  <Gamepad2 className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-base tablet:text-lg font-black">{game.name}</h1>
                  <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded text-[10px] font-bold border border-yellow-500/20">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    4.9
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{game.publisher}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Sections */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* SECTION 1: ACCOUNT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 tablet:p-6 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Gamepad2 className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-black shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    1
                  </div>
                  <h2 className="text-lg tablet:text-xl font-bold font-heading">Masukkan Data Akun</h2>
                </div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium mb-1.5">
                      <span>User ID <span className="text-red-500">*</span></span>
                      <button 
                        onClick={() => setShowHelpModal(true)}
                        className="flex items-center gap-1 text-[10px] text-primary hover:underline bg-primary/10 px-2 py-0.5 rounded-full"
                      >
                        <Info className="w-3 h-3" />
                        Cara cari ID
                      </button>
                    </label>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => { setUserId(e.target.value); setIsValidated(false); }}
                      placeholder="Masukkan User ID"
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Server ID
                    </label>
                    <input
                      type="text"
                      value={serverId}
                      onChange={(e) => { setServerId(e.target.value); setIsValidated(false); }}
                      placeholder="Masukkan Server ID (opsional)"
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                    />
                  </div>

                  {/* Validate button */}
                  <button
                    onClick={validateAccount}
                    disabled={!userId || isValidating}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all',
                      isValidated
                        ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                        : 'bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-white hover:shadow-neon-violet disabled:opacity-50'
                    )}
                  >
                    {isValidating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Memvalidasi...</>
                    ) : isValidated ? (
                      <><Check className="w-4 h-4" /> Akun Tervalidasi</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4" /> Validasi Akun</>
                    )}
                  </button>
                  
                  {/* Validated info */}
                  <AnimatePresence>
                    {isValidated && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 mt-2"
                      >
                        <p className="text-xs font-medium text-green-500">
                          ✓ Player: GamerPro_{userId} | Server: {serverId || 'Asia'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* SECTION 2: NOMINAL */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-5 tablet:p-6 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Tag className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-black shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    2
                  </div>
                  <h2 className="text-lg tablet:text-xl font-bold font-heading">Pilih Nominal</h2>
                </div>

                <div className="grid grid-cols-2 tablet:grid-cols-3 gap-3 tablet:gap-4 relative z-10">
                  {game.denominations.filter((d) => d.isActive).map((d) => {
                    const isFlash = d.isFlashSale && d.flashSalePrice;
                    const displayPrice = isFlash ? d.flashSalePrice! : d.price;
                    const isSelected = selectedDenom === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDenom(d.id)}
                        className={cn(
                          'relative flex flex-col items-center justify-center p-4 tablet:p-5 rounded-2xl border bg-background/50 text-center transition-all duration-300 backdrop-blur-sm',
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-neon-violet ring-1 ring-primary scale-[1.02]'
                            : 'border-border/50 shadow-sm hover:border-primary/50 hover:bg-primary/[0.05] hover:-translate-y-1 hover:shadow-md'
                        )}
                      >
                        {/* Flash sale badge */}
                        {isFlash && (
                          <div className="absolute -top-2 -right-2">
                            <span className="px-2 py-1 rounded-lg bg-red-500 text-white text-[9px] font-black tracking-wider animate-pulse shadow-lg">
                              FLASH SALE
                            </span>
                          </div>
                        )}

                        {/* Popular badge */}
                        {d.isPopular && !isFlash && (
                          <div className="absolute -top-2 -left-2">
                            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500 text-white text-[9px] font-black tracking-wider shadow-lg">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              HOT
                            </span>
                          </div>
                        )}

                        {/* Icon & Label */}
                        <div className="flex flex-col items-center gap-2 mb-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            isSelected ? "bg-primary/20 shadow-[0_0_10px_rgba(99,102,241,0.3)]" : "bg-muted"
                          )}>
                            <Gem className={cn(
                              "w-5 h-5",
                              isSelected ? "text-primary" : "text-muted-foreground"
                            )} />
                          </div>
                          <p className={cn(
                            "text-sm tablet:text-base font-bold transition-colors",
                            isSelected ? "text-primary" : "text-foreground"
                          )}>
                            {d.label}
                          </p>
                        </div>

                        {/* Pricing */}
                        <div className="flex flex-col items-center w-full mt-auto pt-3 border-t border-border/50">
                          <span className={cn(
                            'text-sm font-black',
                            isFlash ? 'text-red-500' : (isSelected ? 'text-primary' : 'text-foreground')
                          )}>
                            {formatCurrency(displayPrice - Math.floor(displayPrice * (rank.discount / 100)))}
                          </span>
                          
                          {/* Original price crossed out if Flash Sale or Gamification Rank Discount */}
                          {(d.originalPrice || isFlash || rank.discount > 0) && (
                            <span className="text-[10px] text-muted-foreground line-through mt-0.5">
                              {formatCurrency(isFlash ? d.price : (rank.discount > 0 ? displayPrice : d.originalPrice!))}
                            </span>
                          )}
                        </div>

                        {/* Selected Checkmark Overlay */}
                        {isSelected && (
                          <div className="absolute -right-1.5 -bottom-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* SECTION 3: PAYMENT METHOD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-5 tablet:p-6 rounded-2xl relative overflow-hidden group mb-12 lg:mb-0"
              >
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CreditCard className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-black shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    3
                  </div>
                  <h2 className="text-lg tablet:text-xl font-bold font-heading">Pilih Pembayaran</h2>
                </div>

                <div className="space-y-6 relative z-10">
                  {Object.entries(paymentsByCategory).map(([category, methods]) => (
                    <div key={category}>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pl-1">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {methods.map((pm) => (
                          <button
                            key={pm.id}
                            onClick={() => setSelectedPayment(pm.id)}
                            className={cn(
                              'w-full flex items-center gap-3 p-3 tablet:p-4 rounded-xl border bg-background/50 transition-all text-left backdrop-blur-sm',
                              selectedPayment === pm.id
                                ? 'border-primary bg-primary/10 ring-1 ring-primary/50 shadow-neon-violet'
                                : 'border-border/60 hover:border-primary/50 hover:bg-primary/[0.03]'
                            )}
                          >
                            <div className={cn(
                              "w-12 h-8 rounded bg-white flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden",
                              pm.id === 'gopay' && 'border-b-2 border-[#00AED6]',
                              pm.id === 'ovo' && 'border-b-2 border-[#4C2A86]',
                              pm.id === 'dana' && 'border-b-2 border-[#118EEA]',
                              pm.id === 'shopeepay' && 'border-b-2 border-[#EE4D2D]',
                            )}>
                              <span className="text-[10px] font-black tracking-tighter text-black">
                                {pm.name.split(' ')[0]}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm font-bold", selectedPayment === pm.id && "text-primary")}>{pm.name}</p>
                              <p className="text-[10px] text-muted-foreground">{pm.description}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {pm.fee > 0 ? (
                                <p className="text-xs text-muted-foreground">
                                  +{formatCurrency(pm.fee)}
                                </p>
                              ) : (
                                <p className="text-xs text-green-500 font-bold">Gratis</p>
                              )}
                            </div>
                            {selectedPayment === pm.id && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-lg animate-in zoom-in">
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
            </div>

            {/* SIDEBAR: DESKTOP ONLY */}
            <div className="hidden lg:block relative">
              <div className="sticky top-28 glass-card p-6 space-y-5 rounded-3xl border border-white/10 shadow-2xl">
                <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Detail Pesanan
                </h3>

                {/* Items Summary */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden relative shadow-inner">
                      {game.image ? (
                        <Image src={game.image} alt={game.name} fill className="object-cover" unoptimized />
                      ) : (
                        <Gamepad2 className="w-6 h-6 text-white/70" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold line-clamp-1">{game.name}</p>
                      <p className="text-[10px] text-muted-foreground">{game.publisher}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between p-3 rounded-xl bg-background/50 border border-border/50">
                      <span className="text-xs text-muted-foreground">Akun</span>
                      <span className="text-xs font-bold text-right">
                        {userId ? (
                          <>{userId}{serverId ? ` (${serverId})` : ''}</>
                        ) : (
                          <span className="text-red-400">Belum diisi</span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between p-3 rounded-xl bg-background/50 border border-border/50">
                      <span className="text-xs text-muted-foreground">Item</span>
                      <span className="text-xs font-bold text-right">
                        {denom ? denom.label : <span className="text-red-400">Pilih Nominal</span>}
                      </span>
                    </div>

                    <div className="flex justify-between p-3 rounded-xl bg-background/50 border border-border/50">
                      <span className="text-xs text-muted-foreground">Pembayaran</span>
                      <span className="text-xs font-bold text-right">
                        {payment ? payment.name : <span className="text-red-400">Pilih Pembayaran</span>}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="pt-4 border-t border-border/50">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Kode Promo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="KODE PROMO"
                      className="flex-1 px-3 py-2 rounded-xl bg-background/50 border border-border text-xs uppercase focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <button className="px-3 py-2 rounded-xl border border-primary/50 text-primary text-xs font-bold hover:bg-primary/10 transition-all">
                      Pakai
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Harga {rank.discount > 0 && `(Diskon ${rank.name})`}</span>
                    <span>{formatCurrency(price)}</span>
                  </div>
                  {rank.discount > 0 && denom && (
                    <div className="flex justify-between text-xs text-green-500">
                      <span>Potongan {rank.discount}%</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  {fee > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Biaya Admin</span>
                      <span>{formatCurrency(fee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-black pt-2">
                    <span>Total</span>
                    <span className="gradient-text drop-shadow-sm">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Estimation Badge */}
                <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  Estimasi proses: &lt; 30 detik
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!isFormComplete || isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl gradient-primary text-white font-black shadow-neon-violet hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 disabled:cursor-not-allowed group"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
                  ) : !isFormComplete ? (
                    'Lengkapi Data'
                  ) : (
                    <>
                      <Zap className="w-5 h-5 group-hover:animate-pulse" />
                      Beli Sekarang
                    </>
                  )}
                </button>
                <p className="text-[9px] text-center text-muted-foreground pt-1">
                  Dengan membeli, kamu setuju dengan <Link href="/terms" className="text-primary hover:underline">Syarat & Ketentuan</Link>
                </p>
              </div>
            </div>

          </div>

          {/* Floating Reviews Section */}
          <div className="mt-16 mb-24 lg:mb-0">
            <h3 className="heading-4 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              Ulasan Pembeli {game.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'R*za', date: 'Hari ini', rating: 5, comment: 'Mantap prosesnya gak nyampe 10 detik diamond udah masuk!' },
                { name: 'K*vin', date: 'Kemarin', rating: 5, comment: 'Paling murah disini, UI nya juga keren banget gampang pakenya.' },
                { name: 'A*di', date: '2 Hari yang lalu', rating: 5, comment: 'Auto save ID nya sangat membantu, topcer pokoknya.' },
                { name: 'S*sca', date: '3 Hari yang lalu', rating: 4, comment: 'Lancar jaya. Proses pembayaran qris sangat seamless.' },
              ].map((review, i) => (
                <div key={i} className="glass-card p-4 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 transition-transform">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-purple-500/50 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{review.name}</p>
                        <p className="text-[9px] text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={cn("w-2.5 h-2.5", idx < review.rating ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE STICKY CTA */}
          <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border lg:hidden z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total</span>
                <span className="text-lg font-black text-primary leading-none mt-0.5">{formatCurrency(total)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={!isFormComplete || isProcessing}
                className="flex-1 max-w-[180px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-primary text-white font-bold text-sm disabled:opacity-50 disabled:grayscale transition-all shadow-neon-violet hover:scale-105 active:scale-95"
              >
                {isProcessing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Proses...</>
                ) : !isFormComplete ? (
                  'Lengkapi Data'
                ) : (
                  <>Beli Sekarang <Zap className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
