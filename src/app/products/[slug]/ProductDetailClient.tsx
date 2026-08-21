'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Check, CreditCard, ShieldCheck, Loader2, Zap,
  ShoppingBag, ShoppingCart, Phone, Sparkles, Clock, Shield,
  Smartphone, Gift, Tv, Wallet, ChevronRight, HelpCircle,
  Tag, Star, CheckCircle2, Info, Lock, Flame, Ticket, Receipt,
  CheckCircle, ArrowRight
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { PAYMENT_METHODS, CATEGORIES } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';
import { getGameColor, GAME_INITIALS } from '@/lib/colors';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/globalStore';
import type { Product, Denomination } from '@/types';

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();

  const [selectedDenom, setSelectedDenom] = useState<string | null>(
    product.denominations?.find((d: Denomination) => d.isPopular)?.id || product.denominations?.[0]?.id || null
  );
  const [accountInput, setAccountInput] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string | null>('qris');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [denomFilter, setDenomFilter] = useState<'ALL' | 'POPULAR' | 'LOW' | 'HIGH'>('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const denomSectionRef = useRef<HTMLDivElement>(null);
  const paymentSectionRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCartStore();
  const { addNotification } = useNotificationStore();

  const denom = product.denominations?.find((d: Denomination) => d.id === selectedDenom);
  const payment = PAYMENT_METHODS.find((p) => p.id === selectedPayment);
  const basePrice = denom?.price || 0;
  const fee = payment?.fee || 0;
  const promoDiscount = appliedPromo ? Math.min(appliedPromo.discount, basePrice) : 0;
  const total = Math.max(0, basePrice - promoDiscount + fee);
  const catInfo = CATEGORIES.find((c) => c.id === product.category);

  const needsPhone = ['PULSA', 'PAKET_DATA', 'EWALLET_TOPUP'].includes(product.category);
  const needsAccount = product.category === 'PLN';
  const inputLabel = needsPhone ? 'Nomor Handphone' : needsAccount ? 'Nomor Meter / ID PLN' : 'Email / WhatsApp Pengiriman';
  const inputPlaceholder = needsPhone ? '08xxxxxxxxxx' : needsAccount ? 'Contoh: 14012345678' : 'nama@email.com / 08xxxxxxxxxx';
  const inputHelper = needsPhone
    ? 'Pulsa/saldo otomatis terisi ke nomor ini.'
    : needsAccount
    ? 'Token PLN otomatis terbit setelah pembayaran.'
    : 'Kode voucher dikirimkan otomatis ke kontak ini.';

  const productColors = getGameColor(product.slug);

  const fallbackIconMap: Record<string, React.ElementType> = {
    'GAME_TOPUP': ShoppingBag,
    'PULSA': Smartphone,
    'PLN': Zap,
    'GIFT_CARD': Gift,
    'STREAMING': Tv,
    'EWALLET_TOPUP': Wallet,
    'PAKET_DATA': Smartphone,
  };
  const FallbackIcon = fallbackIconMap[product.category] || CreditCard;

  const paymentsByCategory = PAYMENT_METHODS.reduce((acc, pm) => {
    if (!acc[pm.category]) acc[pm.category] = [];
    acc[pm.category].push(pm);
    return acc;
  }, {} as Record<string, typeof PAYMENT_METHODS[number][]>);

  // Filtered denominations
  const allDenoms = product.denominations || [];
  const filteredDenoms = allDenoms.filter((d: Denomination) => {
    if (!d.isActive) return false;
    if (denomFilter === 'POPULAR') return d.isPopular;
    if (denomFilter === 'LOW') return d.price <= 50000;
    if (denomFilter === 'HIGH') return d.price > 50000;
    return true;
  });

  const handleSelectDenom = (denomId: string) => {
    setSelectedDenom(denomId);
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Masukkan kode promo');
      return;
    }
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'NEXANEW' || cleanCode === 'HEMAT50' || cleanCode === 'NEXAPAY') {
      setAppliedPromo({ code: cleanCode, discount: 5000 });
      toast.success('Kode promo berhasil diterapkan!', {
        description: 'Potongan harga Rp 5.000 telah diaktifkan.',
      });
    } else {
      toast.error('Kode promo tidak valid atau telah kedaluwarsa');
    }
  };

  const handleCheckout = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!accountInput.trim()) {
      toast.error(`Harap isi ${inputLabel} terlebih dahulu!`);
      const el = document.getElementById('step-account');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!selectedDenom) {
      toast.error('Harap pilih Nominal Produk terlebih dahulu!');
      denomSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!selectedPayment) {
      toast.error('Harap pilih Metode Pembayaran terlebih dahulu!');
      paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          denominationId: selectedDenom,
          gameUserId: accountInput,
          paymentMethod: selectedPayment,
          promoCode: appliedPromo?.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal melakukan checkout');
      }

      toast.success('Pesanan berhasil dibuat!');
      router.push(`/payment-status/${data.transactionId}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal memproses pesanan';
      toast.error('Terjadi kesalahan', { description: message });
      setIsProcessing(false);
    }
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!accountInput.trim()) {
      toast.error(`Harap isi ${inputLabel} terlebih dahulu!`);
      const el = document.getElementById('step-account');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!denom) {
      toast.error('Harap pilih Nominal Produk terlebih dahulu!');
      denomSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.image || '',
      denominationId: denom.id,
      denominationLabel: denom.label,
      price: total,
      quantity: 1,
      phoneNumber: needsPhone ? accountInput : undefined,
      gameUserId: needsAccount ? accountInput : undefined,
    });

    addNotification({
      id: Date.now().toString(),
      title: 'Ditambahkan ke Keranjang',
      message: `${denom.label} - ${product.name} berhasil ditambahkan.`,
      type: 'success',
    });

    toast.success('Produk berhasil ditambahkan ke keranjang!');
  };

  return (
    <>
      {/* Background Decorative Ambient Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[140px] pointer-events-none rounded-full z-0" />

      <main className="min-h-screen pt-28 pb-36 tablet:pt-36 tablet:pb-24 relative z-10 aurora-bg">
        <div className="container-app max-w-7xl 4k:max-w-[1600px] relative z-10">

          {/* Top Hero Banner Header — Streamlined 2026 Digital Service Grade */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: [0.33, 1, 0.68, 1] }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-5 sm:mb-8 border border-border/60 glass-card shadow-2xl"
          >
            <div className="relative min-h-[120px] sm:min-h-[150px] w-full bg-gradient-to-r from-background via-card to-background overflow-hidden flex items-center p-3.5 sm:p-6">
              {/* Dynamic Ambient Glow */}
              <div className={cn('absolute -right-16 -top-16 w-64 h-64 rounded-full blur-[90px] opacity-25 bg-gradient-to-br', productColors.from, productColors.to)} />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center gap-3.5 sm:gap-6 w-full">
                {/* Digital Product Logo / Artwork Container */}
                <div className="relative w-16 h-16 sm:w-22 sm:h-22 rounded-xl sm:rounded-2xl overflow-hidden border border-primary/30 shadow-[0_0_20px_rgba(255,115,0,0.2)] flex-shrink-0 bg-slate-950/90 flex items-center justify-center">
                  {product.image && !imageError ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      priority
                      onError={() => setImageError(true)}
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${productColors.from} ${productColors.to} flex flex-col items-center justify-center p-2 text-white`}>
                      <FallbackIcon className="w-7 h-7 opacity-90" />
                    </div>
                  )}
                </div>

                {/* Info Bar (Concise & Zero Clutter) */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                      {catInfo?.label || product.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wide uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Proses Otomatis
                    </span>
                  </div>

                  <h1 className="text-base sm:text-2xl font-black font-heading text-foreground tracking-tight leading-snug">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-muted-foreground font-semibold flex-wrap pt-0.5">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Zap className="w-3 h-3 text-amber-400" /> Kirim 1-3 Detik
                    </span>
                    <span className="flex items-center gap-1 text-sky-400">
                      <ShieldCheck className="w-3 h-3" /> 100% Legal &amp; Resmi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main 12-Column Layout — 2 Columns on Tablet & Desktop (>= 768px) with sticky tracking */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 tablet:gap-6 lg:gap-8 items-start">

            {/* Left Column: Interactive Form Steps (7 cols on tablet, 8 cols on laptop/desktop) */}
            <div className="md:col-span-7 lg:col-span-8 space-y-5 sm:space-y-6 lg:space-y-8">

              {/* STEP 1: Account Identification / Data Tujuan */}
              <section id="step-account">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 sm:p-5 tablet:p-6 rounded-2xl relative overflow-hidden group shadow-xl"
                >
                  <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-border/40">
                    <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_12px_rgba(255,115,0,0.2)] flex-shrink-0 font-heading">
                        1
                      </div>
                      <h2 className="text-xs sm:text-sm tablet:text-base font-bold font-heading text-foreground whitespace-nowrap">
                        <span className="sm:hidden">Data Tujuan</span>
                        <span className="hidden sm:inline">Masukkan Data Tujuan</span>
                      </h2>
                    </div>
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-primary/10 text-primary text-[9px] sm:text-[10px] font-bold border border-primary/20 whitespace-nowrap flex-shrink-0">
                      <span className="sm:hidden">Instan</span>
                      <span className="hidden sm:inline">Verifikasi Instan</span>
                    </span>
                  </div>

                  <div className="space-y-3 relative z-10">
                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground font-heading">
                      {inputLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {needsPhone && (
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      )}
                      <input
                        type={needsPhone ? 'tel' : 'text'}
                        value={accountInput}
                        onChange={(e) => setAccountInput(e.target.value)}
                        placeholder={inputPlaceholder}
                        className={cn(
                          'w-full pr-4 py-2.5 sm:py-3.5 rounded-xl bg-background/50 border border-border text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background/80 transition-all shadow-inner',
                          needsPhone ? 'pl-10 font-mono tracking-wide' : 'pl-3.5'
                        )}
                      />
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1.5 pt-0.5">
                      <HelpCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{inputHelper}</span>
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* STEP 2: Select Denomination / Pilih Nominal */}
              <section ref={denomSectionRef} id="step-denom">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-4 sm:p-5 tablet:p-6 rounded-2xl relative overflow-hidden group shadow-xl scroll-mt-28"
                >
                  <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-border/40">
                    <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_12px_rgba(255,115,0,0.2)] flex-shrink-0 font-heading">
                        2
                      </div>
                      <Tag className="w-4 h-4 text-primary flex-shrink-0 hidden sm:block" />
                      <h2 className="text-xs sm:text-sm tablet:text-base font-bold font-heading text-foreground whitespace-nowrap">
                        <span className="sm:hidden">Pilih Nominal</span>
                        <span className="hidden sm:inline">Pilih Nominal Produk</span>
                      </h2>
                    </div>
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] sm:text-[11px] font-bold font-mono whitespace-nowrap flex-shrink-0">
                      {product.denominations?.length || 0} Pilihan
                    </span>
                  </div>

                  {/* Filter Pills */}
                  {allDenoms.length > 4 && (
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-3 sm:mb-4 no-scrollbar relative z-10">
                      {[
                        { id: 'ALL', label: 'Semua' },
                        { id: 'POPULAR', label: '★ Populer' },
                        { id: 'LOW', label: '< 50 Ribu' },
                        { id: 'HIGH', label: '≥ 50 Ribu' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setDenomFilter(tab.id as any)}
                          className={cn(
                            'flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all border flex-shrink-0 active:scale-95',
                            denomFilter === tab.id
                              ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(255,115,0,0.35)]'
                              : 'bg-background/60 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50'
                          )}
                        >
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Denomination Cards Grid — Codashop & UniPin Style */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 tablet:grid-cols-2 laptop:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 tablet:gap-3.5 relative z-10">
                    {filteredDenoms.map((d: Denomination) => {
                      const isSelected = selectedDenom === d.id;
                      const pointsBonus = Math.floor(d.price / 200);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => handleSelectDenom(d.id)}
                          className={cn(
                            'relative flex flex-col items-center justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border bg-background/50 text-center transition-all duration-200 backdrop-blur-sm group cursor-pointer active:scale-95 min-h-[125px] sm:min-h-[150px]',
                            isSelected
                              ? 'border-primary bg-primary/15 shadow-[0_0_20px_rgba(249,115,22,0.25)] ring-1 ring-primary/40 z-10'
                              : d.isPopular
                              ? 'border-primary/40 bg-gradient-to-br from-primary/10 via-background/60 to-accent/10 shadow-md hover:border-primary hover:scale-[1.01]'
                              : 'border-border/50 shadow-sm hover:border-primary/50 hover:bg-primary/[0.05] hover:-translate-y-1 hover:shadow-md'
                          )}
                        >
                          {/* Popular / Best Value Badge */}
                          {d.isPopular && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-wider shadow-md border border-amber-300/30">
                                <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" />
                                BEST VALUE
                              </span>
                            </div>
                          )}

                          {/* Center Emblem Icon */}
                          <div className="flex flex-col items-center gap-1.5 sm:gap-2 mb-1.5 mt-0.5 sm:mt-1 w-full">
                            <div className={cn(
                              'w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors relative overflow-hidden',
                              isSelected ? 'bg-primary/20 shadow-[0_0_10px_rgba(255,115,0,0.3)]' : 'bg-muted/70'
                            )}>
                              <FallbackIcon className={cn(
                                'w-3.5 h-3.5 sm:w-4 sm:h-4',
                                isSelected ? 'text-primary' : 'text-muted-foreground'
                              )} />
                            </div>
                            <p className={cn(
                              'text-[10.5px] sm:text-xs xl:text-sm font-bold transition-colors text-center font-heading leading-tight break-words line-clamp-3',
                              isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
                            )}>
                              {d.label}
                            </p>
                          </div>

                          {/* Bottom Price Tag */}
                          <div className="flex flex-col items-center w-full mt-auto pt-1.5 sm:pt-2 border-t border-border/40">
                            <div className="flex items-center gap-1 justify-center">
                              <span className={cn(
                                'text-[11px] sm:text-sm font-black font-heading',
                                isSelected ? 'text-primary' : 'text-foreground'
                              )}>
                                {formatCurrency(d.price)}
                              </span>
                            </div>

                            {d.originalPrice && d.originalPrice > d.price ? (
                              <span className="text-[8.5px] sm:text-[9px] text-muted-foreground line-through">
                                {formatCurrency(d.originalPrice)}
                              </span>
                            ) : (
                              <span className="text-[8.5px] sm:text-[9px] font-semibold text-amber-400/90 mt-0.5">
                                +{pointsBonus} Pts
                              </span>
                            )}
                          </div>

                          {/* Active Selected Checkmark Top-Right Badge */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full gradient-primary text-white flex items-center justify-center shadow-lg border-2 border-background animate-in zoom-in duration-200 z-20">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </section>

              {/* STEP 3: Payment Method / Pilih Pembayaran */}
              <section ref={paymentSectionRef} id="step-payment">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-4 sm:p-5 tablet:p-6 rounded-2xl relative overflow-hidden group shadow-xl scroll-mt-28"
                >
                  <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-border/40">
                    <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_12px_rgba(255,115,0,0.2)] flex-shrink-0 font-heading">
                        3
                      </div>
                      <CreditCard className="w-4 h-4 text-primary flex-shrink-0 hidden sm:block" />
                      <h2 className="text-xs sm:text-sm tablet:text-base font-bold font-heading text-foreground whitespace-nowrap">
                        <span className="sm:hidden">Pilih Pembayaran</span>
                        <span className="hidden sm:inline">Pilih Metode Pembayaran</span>
                      </h2>
                    </div>
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] sm:text-[10px] font-bold border border-emerald-500/20 whitespace-nowrap flex-shrink-0">
                      <span className="sm:hidden">24 Jam</span>
                      <span className="hidden sm:inline">Otomatis 24 Jam</span>
                    </span>
                  </div>

                  <div className="space-y-4 sm:space-y-5 relative z-10">
                    {Object.entries(paymentsByCategory).map(([category, methods]) => (
                      <div key={category} className="space-y-1.5 sm:space-y-2">
                        <h3 className="text-[10px] sm:text-[11px] font-bold font-heading uppercase tracking-wider text-muted-foreground px-1">
                          {category}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                          {methods.map((pm) => {
                            const isSelected = selectedPayment === pm.id;
                            const methodTotal = basePrice + (pm.fee || 0);
                            return (
                              <button
                                key={pm.id}
                                type="button"
                                onClick={() => setSelectedPayment(pm.id)}
                                className={cn(
                                  'w-full flex items-center justify-between p-2 sm:p-3 tablet:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 text-left group cursor-pointer backdrop-blur-sm',
                                  isSelected
                                    ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(255,115,0,0.15)] ring-1 ring-primary'
                                    : 'border-border/70 bg-background/50 hover:border-primary/40 hover:bg-muted/40'
                                )}
                              >
                                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                                  <div className="w-10 h-7 sm:w-12 sm:h-8 rounded-lg bg-white/5 border border-white/10 p-0.5 sm:p-1 flex items-center justify-center flex-shrink-0">
                                    <div className="relative w-full h-full">
                                      <Image
                                        src={pm.icon}
                                        alt={pm.name}
                                        fill
                                        sizes="40px"
                                        className="object-contain"
                                      />
                                    </div>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className={cn("text-xs sm:text-sm font-bold truncate group-hover:text-primary transition-colors font-heading leading-tight", isSelected && "text-primary")}>
                                      {pm.name}
                                    </p>
                                    <p className="text-[9.5px] sm:text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                                      {pm.fee > 0 ? `+${formatCurrency(pm.fee)}` : 'Bebas Biaya'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 pl-1.5">
                                  {denom && (
                                    <span className={cn("text-[11px] sm:text-sm font-black font-heading", isSelected ? "text-primary" : "text-foreground")}>
                                      {formatCurrency(methodTotal)}
                                    </span>
                                  )}
                                  {isSelected ? (
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full gradient-primary flex items-center justify-center shadow-sm flex-shrink-0">
                                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />
                                    </div>
                                  ) : (
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-border/80 flex-shrink-0" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* STEP 4: Optional Promo Code / Voucher Box in Main Flow (Mobile only: < 768px) */}
              <section id="step-promo" className="md:hidden">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="glass-card p-4 sm:p-5 rounded-2xl border border-border/80 relative z-10 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="w-4 h-4 text-primary" />
                    <h3 className="text-xs sm:text-sm font-bold font-heading text-foreground">
                      Punya Kode Promo / Voucher? <span className="text-muted-foreground font-normal">(Opsional)</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Kode Promo (contoh: NEXAPAY)"
                      className="flex-1 min-w-0 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-background/60 border border-border text-xs sm:text-sm font-mono font-bold uppercase focus:outline-none focus:border-primary transition-all placeholder:text-[11px] sm:placeholder:text-xs placeholder:text-muted-foreground/60"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl gradient-primary text-white text-xs font-bold font-heading hover:shadow-md transition-all flex-shrink-0 cursor-pointer active:scale-95 whitespace-nowrap"
                    >
                      Gunakan
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-between">
                      <span>✓ Promo Aktif: {appliedPromo.code}</span>
                      <span>-{formatCurrency(promoDiscount)}</span>
                    </div>
                  )}
                </motion.div>
              </section>
            </div>

            {/* Right Column: Sticky Summary & Checkout Widget (Tablet & Desktop: >= 768px) */}
            <div className="hidden md:block md:col-span-5 lg:col-span-4 sticky top-28 xl:top-32 self-start z-30">
              <div className="glass-card p-4 sm:p-5 xl:p-6 rounded-3xl border border-border/80 shadow-2xl space-y-3.5 sm:space-y-4 xl:space-y-5 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3 gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Receipt className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-primary flex-shrink-0" />
                      <h3 className="text-xs xl:text-sm font-bold font-heading uppercase tracking-normal truncate text-foreground">
                        Ringkasan Pembelian
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] xl:text-[10px] font-bold border border-primary/20 whitespace-nowrap flex-shrink-0 font-mono">
                      Fast Checkout
                    </span>
                  </div>

                  {/* Selected Product Card */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-card/60 border border-border/50">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950/80 flex-shrink-0 border border-white/10">
                      {product.image && !imageError ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${productColors.from} ${productColors.to} flex items-center justify-center text-white text-xs font-bold`}>
                          {GAME_INITIALS[product.slug] || 'NEXA'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold font-heading truncate text-foreground">{product.name}</p>
                      <p className="text-[11px] text-muted-foreground">{catInfo?.label || product.category}</p>
                    </div>
                  </div>

                  {/* Line Items Breakdown */}
                  <div className="space-y-2 text-xs">
                    {accountInput && (
                      <div className="flex justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-muted-foreground">Tujuan</span>
                        <span className="font-mono font-bold text-primary truncate max-w-[160px]">{accountInput}</span>
                      </div>
                    )}
                    {denom && (
                      <div className="flex justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-muted-foreground">Nominal</span>
                        <span className="font-bold text-foreground font-heading">{denom.label}</span>
                      </div>
                    )}
                    {payment && (
                      <div className="flex justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-muted-foreground">Pembayaran</span>
                        <span className="font-bold text-foreground">{payment.name}</span>
                      </div>
                    )}
                    {denom && (
                      <div className="flex justify-between p-2 rounded-xl bg-white/[0.02]">
                        <span className="text-muted-foreground">Subtotal Produk</span>
                        <span className="font-semibold">{formatCurrency(basePrice)}</span>
                      </div>
                    )}
                    {fee > 0 && (
                      <div className="flex justify-between p-2 rounded-xl bg-white/[0.02]">
                        <span className="text-muted-foreground">Biaya Admin</span>
                        <span className="font-semibold text-muted-foreground">{formatCurrency(fee)}</span>
                      </div>
                    )}
                    {appliedPromo && (
                      <div className="flex justify-between p-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold">
                        <span>Diskon Promo ({appliedPromo.code})</span>
                        <span>-{formatCurrency(promoDiscount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Promo Code Input Box (Desktop Sidebar) */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold font-heading uppercase tracking-wider text-muted-foreground mb-1.5">
                      Punya Kode Promo / Voucher? <span className="font-normal text-[10px]">(Opsional)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Contoh: NEXAPAY"
                        className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-background/60 border border-border text-xs font-mono font-bold uppercase focus:outline-none focus:border-primary transition-all placeholder:text-[11px] placeholder:text-muted-foreground/60 placeholder:normal-case placeholder:font-sans"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2.5 rounded-xl gradient-primary text-white text-xs font-bold font-heading hover:shadow-md transition-all cursor-pointer flex-shrink-0 whitespace-nowrap active:scale-95"
                      >
                        Gunakan
                      </button>
                    </div>
                    {appliedPromo && (
                      <div className="mt-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center justify-between">
                        <span>✓ Diskon Aktif: {appliedPromo.code}</span>
                        <span>-{formatCurrency(promoDiscount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total Payment Box */}
                  <div className="pt-3 border-t border-border/60 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground block font-medium">Total Pembayaran</span>
                      <span className="text-[10px] text-emerald-400 font-bold">✓ Sudah Termasuk PPN</span>
                    </div>
                    <span className="text-2xl font-black gradient-text font-heading">
                      {denom ? formatCurrency(total) : 'Rp 0'}
                    </span>
                  </div>

                  {/* Loyalty Points Earned Badge */}
                  {denom && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Cashback NexaPoints
                      </span>
                      <span>+{Math.floor(total / 200)} pts</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={!selectedDenom || !accountInput.trim() || !selectedPayment || isProcessing}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl gradient-primary text-white text-sm font-bold font-heading shadow-xl shadow-primary/25 hover:shadow-neon-orange hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Memproses Pesanan...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" /> Beli Sekarang {denom ? `• ${formatCurrency(total)}` : ''}
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!selectedDenom || !accountInput.trim() || isProcessing}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-card/60 border border-primary/40 text-primary text-xs font-bold font-heading hover:bg-primary/10 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" /> Tambah ke Keranjang
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[11px] font-semibold leading-tight">Transaksi dienkripsi 256-bit SSL & diproses otomatis.</span>
                  </div>
                </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />

      {/* Option A: Floating Dynamic Island Capsule Dock (Mobile phones only: < 768px - z-40) */}
      <div 
        className="fixed bottom-3 inset-x-2.5 sm:inset-x-4 z-40 md:hidden max-w-md mx-auto pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="pointer-events-auto w-full shadow-[0_0_20px_rgba(255,115,0,0.15),inset_0_1px_1.5px_rgba(255,255,255,0.35)] py-2 px-3.5 sm:py-2.5 sm:px-4 rounded-full border border-white/20 bg-slate-900/60 dark:bg-black/45 backdrop-blur-2xl flex items-center justify-between gap-2.5 sm:gap-3 h-12 sm:h-13"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate leading-tight">
              {denom ? denom.label : 'Pilih Nominal'}
            </span>
            <span className="text-xs sm:text-sm font-black gradient-text truncate leading-tight font-heading">
              {denom ? formatCurrency(total) : 'Rp 0'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isProcessing}
              className="w-9 h-9 rounded-full bg-card/80 border border-primary/40 text-primary flex items-center justify-center hover:bg-primary/10 active:scale-95 transition-all cursor-pointer shadow-sm"
              aria-label="Tambah ke Keranjang"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isProcessing}
              className="flex items-center justify-center gap-1 sm:gap-1.5 px-3.5 sm:px-4 py-2 rounded-full gradient-primary text-white font-extrabold text-[11px] sm:text-xs shadow-neon-orange hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer font-heading"
            >
              {isProcessing ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Proses...</>
              ) : !accountInput.trim() ? (
                <><Smartphone className="w-3.5 h-3.5" /> 1. Isi Nomor</>
              ) : !selectedDenom ? (
                <><Tag className="w-3.5 h-3.5" /> 2. Pilih Nominal</>
              ) : !selectedPayment ? (
                <><CreditCard className="w-3.5 h-3.5" /> 3. Pilih Bayar</>
              ) : (
                <><Zap className="w-3.5 h-3.5 animate-pulse" /> Beli Sekarang</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
