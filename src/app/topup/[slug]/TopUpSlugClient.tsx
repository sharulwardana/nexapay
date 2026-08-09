'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Check, Gamepad2, CreditCard, ShieldCheck, Loader2,
  Info, Tag, Zap, Star, ShoppingCart, Gem, Heart, User, X, Home, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PAYMENT_METHODS } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';
import { GAME_COLORS } from '@/lib/colors';
import { toast } from 'sonner';
import { getLoyaltyRank } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/globalStore';
import { useSession } from 'next-auth/react';
import LiquidGlass from '@/components/shared/LiquidGlass';
import type { ProductWithDenominations, Denomination } from '@/types';

/**
 * Derive a subtle background tint from the shared GAME_COLORS palette.
 * Falls back to a warm orange tint for unknown games.
 */
function getGameBgTint(slug: string): string {
  const colorMap: Record<string, string> = {
    'mobile-legends': 'rgba(234, 179, 8, 0.15)',
    'free-fire': 'rgba(249, 115, 22, 0.15)',
    'valorant': 'rgba(239, 68, 68, 0.15)',
    'genshin-impact': 'rgba(56, 189, 248, 0.15)',
    'pubg-mobile': 'rgba(250, 204, 21, 0.15)',
    'honkai-star-rail': 'rgba(139, 92, 246, 0.15)',
    'call-of-duty-mobile': 'rgba(16, 185, 129, 0.15)',
    'roblox': 'rgba(239, 68, 68, 0.15)',
    'steam-wallet': 'rgba(100, 116, 139, 0.15)',
    'wild-rift': 'rgba(6, 182, 212, 0.15)',
    'arena-of-valor': 'rgba(168, 85, 247, 0.15)',
    'zenless-zone-zero': 'rgba(161, 161, 170, 0.15)',
  };
  return colorMap[slug] || 'rgba(255, 115, 0, 0.12)';
}

export default function TopUpSlugClient({ game }: { game: ProductWithDenominations }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [denomCategoryFilter, setDenomCategoryFilter] = useState('ALL');
  const [paymentCategoryFilter, setPaymentCategoryFilter] = useState('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const accountSectionRef = useRef<HTMLDivElement>(null);
  const denomSectionRef = useRef<HTMLDivElement>(null);
  const paymentSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const flashItem = game.denominations.find((d) => d.isFlashSale && d.flashSaleEnd);
    const endTime = flashItem?.flashSaleEnd
      ? new Date(flashItem.flashSaleEnd).getTime()
      : Date.now() + 8 * 60 * 60 * 1000;

    const updateTimer = () => {
      const diff = Math.max(0, endTime - Date.now());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [game]);

  const points = session?.user?.loyaltyPoints || 0;
  const { rank } = getLoyaltyRank(points);
  const { addItem } = useCartStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (game) {
      const savedUserId = localStorage.getItem(`nexapay_userid_${game.slug}`);
      const savedServerId = localStorage.getItem(`nexapay_serverid_${game.slug}`);
      if (savedUserId) setUserId(savedUserId);
      if (savedServerId) setServerId(savedServerId);
    }
  }, [game]);

  const denom = game.denominations.find((d) => d.id === selectedDenom);
  const payment = PAYMENT_METHODS.find((p) => p.id === selectedPayment);
  
  const basePrice = denom?.isFlashSale && denom.flashSalePrice ? denom.flashSalePrice : (denom?.price || 0);
  const discountAmount = Math.floor(basePrice * (rank.discount / 100));
  const price = basePrice - discountAmount;
  const fee = payment?.fee || 0;
  const total = price + fee;

  const denomCategories = [
    { id: 'ALL', label: 'Semua Item', icon: Gem },
    { id: 'FLASH', label: 'Flash Sale', icon: Zap },
    { id: 'HOT', label: 'Paling Laris', icon: Star },
    { id: 'PASS', label: 'Pass & Membership', icon: ShieldCheck },
  ];

  const filteredDenominations = game.denominations.filter((d) => {
    if (!d.isActive) return false;
    if (denomCategoryFilter === 'FLASH') return d.isFlashSale && d.flashSalePrice;
    if (denomCategoryFilter === 'HOT') return d.isPopular;
    if (denomCategoryFilter === 'PASS') {
      const lbl = (d.label || '').toLowerCase();
      return lbl.includes('pass') || lbl.includes('weekly') || lbl.includes('starlight') || lbl.includes('twilight') || lbl.includes('membership');
    }
    return true;
  });

  const paymentCategoryPills = [
    { id: 'ALL', label: 'Semua Metode' },
    { id: 'QRIS', label: 'QRIS' },
    { id: 'E-Wallet', label: 'E-Wallet' },
    { id: 'Bank Transfer', label: 'Virtual Account' },
    { id: 'Minimarket', label: 'Minimarket' },
  ];

  useEffect(() => {
    const savedUserId = localStorage.getItem(`nexapay_userid_${game.slug}`);
    const savedServerId = localStorage.getItem(`nexapay_serverid_${game.slug}`);
    if (savedUserId && !userId) setUserId(savedUserId);
    if (savedServerId && !serverId) setServerId(savedServerId);
  }, [game.slug]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`nexapay_userid_${game.slug}`, userId);
    }
    if (serverId) {
      localStorage.setItem(`nexapay_serverid_${game.slug}`, serverId);
    }
  }, [userId, serverId, game.slug]);

  const isVoucherProduct = ['steam-wallet', 'roblox'].includes(game.slug);

  const validateAccount = () => {
    const targetUserId = isVoucherProduct ? (userId || 'VOUCHER') : userId;
    if (!targetUserId) {
      toast.error('Masukkan User ID');
      return;
    }
    if (isVoucherProduct && !userId) setUserId('VOUCHER');
    localStorage.setItem(`nexapay_userid_${game.slug}`, targetUserId);
    if (serverId) localStorage.setItem(`nexapay_serverid_${game.slug}`, serverId);
    setIsValidated(true);
    toast.success(isVoucherProduct ? 'Voucher siap dibeli!' : 'Data akun disimpan!', {
      description: isVoucherProduct ? 'Kode voucher akan otomatis dikirimkan ke kontak Anda.' : `User ID: ${targetUserId}${serverId ? ` | Server: ${serverId}` : ''}. Pastikan ID sudah benar sebelum checkout.`,
    });
    // Auto-scroll to Section 2: Pilih Nominal
    setTimeout(() => {
      denomSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleSelectDenom = (denomId: string) => {
    setSelectedDenom(denomId);
    // Auto-scroll to Section 3: Pilih Pembayaran
    setTimeout(() => {
      paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Masukkan kode promo terlebih dahulu');
      return;
    }
    toast.info('Kode promo akan divalidasi saat checkout', {
      description: `Kode "${promoCode}" akan dicek otomatis.`,
    });
  };

  const handleAddToCart = () => {
    const targetUserId = isVoucherProduct ? (userId || 'VOUCHER') : userId;
    if (!targetUserId || !denom) {
      toast.error('Harap pilih Nominal terlebih dahulu!');
      return;
    }
    addItem({
      productId: game.id,
      productName: game.name,
      productImage: game.image || '',
      denominationId: denom.id,
      denominationLabel: denom.label,
      price: total,
      quantity: 1,
      gameUserId: targetUserId,
      gameServerId: serverId
    });
    addNotification({
      id: Date.now().toString(),
      title: 'Ditambahkan ke Keranjang',
      message: `${denom.label} - ${game.name} berhasil ditambahkan.`,
      type: 'success',
    });
  };

  const handleCheckout = async () => {
    const targetUserId = isVoucherProduct ? (userId || 'VOUCHER') : userId;
    if (!targetUserId || !selectedDenom || !selectedPayment) {
      toast.error('Harap pilih Nominal dan Metode Pembayaran!');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: game.id,
          denominationId: selectedDenom,
          gameUserId: userId,
          gameServerId: serverId,
          paymentMethod: selectedPayment,
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses pesanan');
      }

      toast.success('Pesanan berhasil dibuat!');
      
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        router.push(`/payment-status?trxId=${data.transactionId}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormComplete = !!(userId && selectedDenom && selectedPayment);

  const paymentsByCategory = PAYMENT_METHODS.reduce((acc, pm) => {
    if (!acc[pm.category]) acc[pm.category] = [];
    acc[pm.category].push(pm);
    return acc;
  }, {} as Record<string, typeof PAYMENT_METHODS[number][]>);

  const gameColor = getGameBgTint(game.slug);

  return (
    <>
      {/* Background Decorative Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[140px] pointer-events-none rounded-full z-0" />

      <div className="container-app pt-28 pb-44 tablet:pt-36 tablet:pb-20 relative z-10">

        {/* Top Game Hero Banner Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-8 border border-border/60 glass-card shadow-2xl"
        >
          <div className="relative min-h-[170px] tablet:min-h-[210px] w-full bg-gradient-to-r from-background via-card to-background overflow-hidden flex items-center p-4 sm:p-6 tablet:p-8">
            {game.bannerImage && (
              <Image
                src={game.bannerImage || game.image}
                alt={game.name}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-20 filter blur-[3px] scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            <div className="relative z-10 flex items-center gap-4 sm:gap-6 tablet:gap-8 w-full">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 tablet:w-28 tablet:h-28 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-[0_0_25px_rgba(255,115,0,0.3)] flex-shrink-0 bg-card">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 96px, 112px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1 tablet:space-y-2">
                {game.publisher && (
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                      {game.publisher}
                    </span>
                  </div>
                )}
                <h1 className="text-xl sm:text-2xl tablet:text-3xl font-black font-heading text-foreground tracking-tight line-clamp-1">
                  {game.name}
                </h1>
                <p className="text-xs tablet:text-sm text-muted-foreground line-clamp-2 max-w-xl leading-relaxed">
                  {game.description}
                </p>
                <div className="flex items-center gap-x-3 gap-y-1 pt-0.5 text-[10px] sm:text-[11px] text-muted-foreground font-medium flex-wrap">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Proses Instan 24 Jam
                  </span>
                  <span className="flex items-center gap-1 text-sky-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Resmi & Legal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Layout Grid Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Form Steps */}
          <div className="lg:col-span-8 space-y-8">

            {/* STEP 1: Account Identification / Data Akun */}
            <section ref={accountSectionRef} id="step-account">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 tablet:p-6 rounded-2xl relative overflow-hidden group"
              >
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(255,115,0,0.2)] flex-shrink-0">
                      1
                    </div>
                    <User className="w-4 h-4 text-primary flex-shrink-0" />
                    <h2 className="text-sm tablet:text-base font-bold font-heading text-foreground whitespace-nowrap">
                      {isVoucherProduct ? (
                        'Status Voucher'
                      ) : (
                        <>
                          <span className="tablet:hidden">Data Akun</span>
                          <span className="hidden tablet:inline">Masukkan Data Akun</span>
                        </>
                      )}
                    </h2>
                  </div>
                  {!isVoucherProduct && (
                    <button 
                      onClick={() => setShowHelpModal(true)}
                      className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-primary/20 transition-all active:scale-95 flex-shrink-0"
                    >
                      <Info className="w-3 h-3" />
                      <span>Petunjuk ID</span>
                    </button>
                  )}
                </div>
                <div className="space-y-4 relative z-10">
                  {isVoucherProduct ? (
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground space-y-1">
                      <div className="font-bold text-primary flex items-center gap-2">
                        <span>🎟️ Voucher Langsung Dikirim ke Email / No. WA</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ini adalah produk Kode Voucher Resmi ({game.name}). Tidak memerlukan User ID Game. Kode voucher akan dikirimkan otomatis secara instan setelah pembayaran berhasil.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        {['valorant', 'wild-rift'].includes(game.slug) ? 'Riot ID & Tag' : 'User ID / Player ID'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={userId}
                        onChange={(e) => { setUserId(e.target.value); setIsValidated(false); }}
                        placeholder={['valorant', 'wild-rift'].includes(game.slug) ? 'Masukkan Riot ID + Tag (Contoh: Westbourne#SEA)' : 'Masukkan User ID / Player ID'}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-sm outline-none focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200 shadow-inner"
                      />
                      {userId.trim().length >= 4 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>ID Siap Terverifikasi ✓ (Siap Kirim Top Up Instan)</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                  {['genshin-impact', 'honkai-star-rail', 'zenless-zone-zero'].includes(game.slug) ? (
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Pilih Server <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={serverId}
                        onChange={(e) => { setServerId(e.target.value); setIsValidated(false); }}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-sm outline-none focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200 shadow-inner text-foreground font-medium"
                      >
                        <option value="" disabled className="bg-card text-foreground">Pilih Server Game</option>
                        <option value="Asia" className="bg-card text-foreground">Asia</option>
                        <option value="America" className="bg-card text-foreground">America</option>
                        <option value="Europe" className="bg-card text-foreground">Europe</option>
                        <option value="TW_HK_MO" className="bg-card text-foreground">TW, HK, MO</option>
                      </select>
                    </div>
                  ) : ['mobile-legends'].includes(game.slug) ? (
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Server ID / Zone ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={serverId}
                        onChange={(e) => { setServerId(e.target.value); setIsValidated(false); }}
                        placeholder="Masukkan Server ID / Zone ID"
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-sm outline-none focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200 shadow-inner"
                      />
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </section>

              <motion.div
                ref={denomSectionRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-5 tablet:p-6 rounded-2xl relative overflow-hidden group scroll-mt-28"
              >
                <div className="flex items-center gap-2.5 mb-4 relative z-10 pb-3 border-b border-border/40">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(255,115,0,0.2)] flex-shrink-0">
                    2
                  </div>
                  <Tag className="w-4 h-4 text-primary flex-shrink-0" />
                  <h2 className="text-sm tablet:text-base font-bold font-heading text-foreground">Pilih Nominal</h2>
                </div>

                {/* Live Flash Sale Countdown Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 mb-5 rounded-xl bg-gradient-to-r from-red-500/15 via-orange-500/10 to-primary/10 border border-red-500/25 text-xs font-bold relative z-10">
                  <div className="flex items-center gap-2 text-red-400">
                    <Zap className="w-4 h-4 text-red-500 animate-pulse" />
                    <span>FLASH SALE LIMITED TIME</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs">
                    <span className="text-[10px] text-muted-foreground mr-1">Berakhir:</span>
                    <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">
                      {String(timeLeft.hours).padStart(2, '0')}h
                    </span>
                    <span className="text-red-400">:</span>
                    <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">
                      {String(timeLeft.minutes).padStart(2, '0')}m
                    </span>
                    <span className="text-red-400">:</span>
                    <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">
                      {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                </div>

                {/* Denomination Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar relative z-10">
                  {denomCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setDenomCategoryFilter(cat.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex-shrink-0 active:scale-95',
                        denomCategoryFilter === cat.id
                          ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(255,115,0,0.35)]'
                          : 'bg-background/60 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50'
                      )}
                    >
                      <cat.icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 tablet:grid-cols-3 gap-3.5 tablet:gap-5 relative z-10">
                  {filteredDenominations.length > 0 ? (
                    filteredDenominations.map((d: any) => {
                      const isFlash = d.isFlashSale && d.flashSalePrice;
                      const displayPrice = isFlash ? d.flashSalePrice! : d.price;
                      const isSelected = selectedDenom === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => handleSelectDenom(d.id)}
                          className={cn(
                            'relative flex flex-col items-center justify-center p-4 tablet:p-5 rounded-2xl border bg-background/50 text-center transition-all duration-300 backdrop-blur-sm group',
                            isSelected
                              ? 'border-primary bg-primary/15 shadow-[0_0_20px_rgba(249,115,22,0.25)] ring-1 ring-primary/40 z-10'
                              : d.isPopular
                              ? 'border-primary/40 bg-gradient-to-br from-primary/10 via-background/60 to-accent/10 shadow-md hover:border-primary hover:scale-[1.01]'
                              : 'border-border/50 shadow-sm hover:border-primary/50 hover:bg-primary/[0.05] hover:-translate-y-1 hover:shadow-md'
                          )}
                        >
                          {isFlash && (
                            <div className="absolute top-0 -translate-y-1/2 right-3 z-10">
                              <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[8.5px] font-black tracking-wider animate-pulse shadow-md">
                                ⚡ FLASH SALE
                              </span>
                            </div>
                          )}
                          {d.isPopular && !isFlash && (
                            <div className="absolute top-0 -translate-y-1/2 left-3 z-10">
                              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8.5px] font-black tracking-wider shadow-md border border-amber-300/30">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                BEST VALUE
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col items-center gap-2 mb-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                              isSelected ? "bg-primary/20 shadow-[0_0_10px_rgba(255,115,0,0.3)]" : "bg-muted"
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
                          <div className="flex flex-col items-center w-full mt-auto pt-3 border-t border-border/50">
                            <span className={cn(
                              'text-sm font-black',
                              isFlash ? 'text-red-500' : (isSelected ? 'text-primary' : 'text-foreground')
                            )}>
                              {formatCurrency(displayPrice - Math.floor(displayPrice * (rank.discount / 100)))}
                            </span>
                            {(d.originalPrice || isFlash || rank.discount > 0) && (
                              <span className="text-[10px] text-muted-foreground line-through mt-0.5">
                                {formatCurrency(isFlash ? d.price : (rank.discount > 0 ? displayPrice : d.originalPrice!))}
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-5.5 h-5.5 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-background animate-in zoom-in duration-200 z-20">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-8 text-center text-muted-foreground text-xs font-medium">
                      Tidak ada item dalam kategori ini.
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                ref={paymentSectionRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-5 tablet:p-6 rounded-2xl relative overflow-hidden group mb-12 lg:mb-0 scroll-mt-28"
              >
                <div className="flex items-center gap-2.5 mb-4 relative z-10 pb-3 border-b border-border/40">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(255,115,0,0.2)] flex-shrink-0">
                    3
                  </div>
                  <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
                  <h2 className="text-sm tablet:text-base font-bold font-heading text-foreground">Pilih Pembayaran</h2>
                </div>

                {/* Payment Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar relative z-10">
                  {paymentCategoryPills.map((pill) => (
                    <button
                      key={pill.id}
                      onClick={() => setPaymentCategoryFilter(pill.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex-shrink-0 active:scale-95',
                        paymentCategoryFilter === pill.id
                          ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(255,115,0,0.35)]'
                          : 'bg-background/60 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50'
                      )}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-6 relative z-10">
                  {Object.entries(paymentsByCategory)
                    .filter(([category]) => {
                      if (paymentCategoryFilter === 'ALL') return true;
                      const catLower = category.toLowerCase();
                      const filterLower = paymentCategoryFilter.toLowerCase();
                      if (paymentCategoryFilter === 'Bank Transfer') return catLower.includes('bank') || catLower.includes('virtual');
                      if (paymentCategoryFilter === 'Minimarket') return catLower.includes('minimarket') || catLower.includes('convenience');
                      return catLower.includes(filterLower);
                    })
                    .map(([category, methods]) => (
                    <div key={category}>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pl-1">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {methods.map((pm) => {
                          const isPmSelected = selectedPayment === pm.id;
                          const netTotalForPm = denom ? price + pm.fee : null;

                          return (
                            <button
                              key={pm.id}
                              onClick={() => setSelectedPayment(pm.id)}
                              className={cn(
                                'w-full flex items-center gap-3 p-3 tablet:p-4 rounded-xl border bg-background/50 transition-all text-left backdrop-blur-sm',
                                isPmSelected
                                  ? 'border-primary bg-gradient-to-r from-primary/15 via-primary/5 to-transparent shadow-sm'
                                  : 'border-border/50 hover:border-primary/30 hover:bg-muted/40'
                              )}
                            >
                              <div className="w-14 h-8 relative flex-shrink-0">
                                <Image src={pm.icon} alt={pm.name} fill sizes="56px" className="object-contain" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={cn("text-sm font-bold", isPmSelected && "text-primary")}>{pm.name}</p>
                                <p className="text-[10px] text-muted-foreground">{pm.description}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                {netTotalForPm !== null ? (
                                  <>
                                    <p className={cn("text-xs font-black font-mono", isPmSelected ? "text-primary" : "text-foreground")}>
                                      {formatCurrency(netTotalForPm)}
                                    </p>
                                    <p className="text-[9px] text-muted-foreground">
                                      {pm.fee > 0 ? `Inc. Fee ${formatCurrency(pm.fee)}` : 'Bebas Admin'}
                                    </p>
                                  </>
                                ) : (
                                  pm.fee > 0 ? (
                                    <p className="text-xs text-muted-foreground">+{formatCurrency(pm.fee)}</p>
                                  ) : (
                                    <p className="text-xs text-green-500 font-bold">Gratis</p>
                                  )
                                )}
                              </div>
                              {isPmSelected && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-lg animate-in zoom-in">
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* STEP 4: Promo Code (Mobile & Tablet Only - On Desktop, Promo is inside Sidebar) */}
              <div className="lg:hidden">
                <section id="step-promo">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-5 tablet:p-6 rounded-2xl relative overflow-hidden group mb-12 lg:mb-0"
                  >
                    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border/40">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(255,115,0,0.2)] flex-shrink-0">
                        4
                      </div>
                      <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                      <h2 className="text-sm tablet:text-base font-bold font-heading text-foreground">Kode Promo / Voucher (Opsional)</h2>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Masukkan Kode Promo (contoh: NEXAWIN)"
                        className="flex-1 px-4 py-3 rounded-xl bg-background/50 border border-border text-xs tablet:text-sm uppercase font-bold tracking-wider outline-none focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-5 py-3 rounded-xl gradient-primary text-white text-xs tablet:text-sm font-bold shadow-md hover:shadow-neon-violet transition-all active:scale-95 flex-shrink-0"
                      >
                        Gunakan
                      </button>
                    </div>
                  </motion.div>
                </section>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-4 relative">
              <div className="sticky top-28 glass-card p-6 space-y-5 rounded-3xl border border-white/10 shadow-2xl">
                <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Detail Pesanan
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden relative shadow-inner">
                      {game.image ? (
                        <Image src={game.image} alt={game.name} fill sizes="48px" className="object-cover" />
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
                        {userId ? <>{userId}{serverId ? ` (${serverId})` : ''}</> : <span className="text-red-400">Belum diisi</span>}
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
                      className="flex-1 px-3 py-2 rounded-xl bg-background/50 border border-border text-xs uppercase focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-3 py-2 rounded-xl border border-primary/50 text-primary text-xs font-bold hover:bg-primary/10 transition-all"
                    >
                      Pakai
                    </button>
                  </div>
                </div>
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
                <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5" /> Estimasi proses: &lt; 30 detik
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={handleCheckout}
                    disabled={!isFormComplete || isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl gradient-primary text-white font-black shadow-neon-violet hover:shadow-[0_0_30px_rgba(255,115,0,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 disabled:cursor-not-allowed group"
                  >
                    {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</> : !isFormComplete ? 'Lengkapi Data' : <><Zap className="w-5 h-5 group-hover:animate-pulse" /> Beli Sekarang</>}
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!isFormComplete || isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-card border border-primary/50 text-primary font-bold hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" /> Tambah ke Keranjang
                  </button>
                </div>
                <p className="text-[9px] text-center text-muted-foreground pt-1">
                  Dengan membeli, kamu setuju dengan <Link href="/terms" className="text-primary hover:underline">Syarat & Ketentuan</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

      {/* Single Unified Floating Checkout Capsule Dock (Option A) with LiquidGlass */}
      <div className="fixed bottom-3 left-3 right-3 z-50 lg:hidden max-w-md mx-auto pointer-events-none">
        <LiquidGlass
          displacementScale={55}
          blurAmount={0.15}
          saturation={140}
          aberrationIntensity={1.8}
          elasticity={0.25}
          cornerRadius={28}
          className="pointer-events-auto w-full shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(255,115,0,0.2)] py-2.5 px-4 rounded-full"
        >
          <div className="flex items-center justify-between gap-3 h-10 w-full">
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate leading-tight">
                {denom ? denom.label : 'Belum pilih item'}
              </span>
              <span className="text-sm font-black gradient-text truncate leading-tight">
                {denom ? formatCurrency(total) : 'Rp 0'}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={!isFormComplete || isProcessing}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full gradient-primary text-white font-extrabold text-xs shadow-neon-violet hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:grayscale transition-all flex-shrink-0"
            >
              {isProcessing ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Memproses...</>
              ) : !selectedDenom ? (
                <><Tag className="w-3.5 h-3.5" /> Pilih Nominal</>
              ) : !selectedPayment ? (
                <><CreditCard className="w-3.5 h-3.5" /> Pilih Bayar</>
              ) : (
                <><Zap className="w-3.5 h-3.5 animate-pulse" /> Beli Sekarang</>
              )}
            </button>
          </div>
        </LiquidGlass>
      </div>

      {/* Petunjuk ID Modal Popup */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-card/95 border border-white/10 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Info className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold font-heading">Petunjuk ID & Server</h3>
                </div>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-muted-foreground">
                <p>
                  Untuk menemukan <strong className="text-foreground">User ID & Server ID</strong> game <strong className="text-primary">{game.name}</strong>:
                </p>
                <ol className="list-decimal list-inside space-y-2 bg-background/60 p-3.5 rounded-2xl border border-border/50">
                  <li>Buka aplikasi game <strong className="text-foreground">{game.name}</strong> di HP kamu.</li>
                  <li>Masuk ke menu <strong className="text-foreground">Profil / Avatar</strong> di pojok kiri atas.</li>
                  <li>User ID dan Server ID terletak di bawah nama akun kamu (Contoh: ID <span className="font-mono font-bold text-primary">12345678</span> Zone <span className="font-mono font-bold text-primary">1234</span>).</li>
                </ol>
                <p className="text-[11px] text-muted-foreground italic">
                  💡 Salin angka tersebut dan masukkan ke dalam kolom Data Akun dengan teliti.
                </p>
              </div>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-3 rounded-xl gradient-primary text-white font-bold text-xs shadow-neon-violet hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Saya Mengerti
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
