'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { CheckCircle2, ShieldCheck, Phone, MessageSquare, ChevronDown, Tag, Gem, Zap, Star } from 'lucide-react';
import { PAYMENT_METHODS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getLoyaltyRank } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/globalStore';
import { useSession } from 'next-auth/react';
import Footer from '@/components/layout/Footer';
import type { ProductWithDenominations } from '@/types';

// Modular Decomposed Components
import TopUpAccountStep from '@/components/topup/TopUpAccountStep';
import TopUpDenomStep from '@/components/topup/TopUpDenomStep';
import TopUpPaymentStep from '@/components/topup/TopUpPaymentStep';
import TopUpOrderSummary from '@/components/topup/TopUpOrderSummary';
import TopUpMobileActionDock from '@/components/topup/TopUpMobileActionDock';

// Lazy load below-the-fold heavy components to unblock main thread
const TopUpHelpModal = dynamic(() => import('@/components/topup/TopUpHelpModal'), { ssr: false });
const TopUpFaqSection = dynamic(() => import('@/components/topup/TopUpFaqSection'), { ssr: true });

export default function TopUpSlugClient({ game }: { game: ProductWithDenominations }) {
  const router = useRouter();
  const { data: session } = useSession();

  // Core Form State
  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  const [, setIsValidating] = useState(false);
  const [, setIsValidated] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [denomCategoryFilter, setDenomCategoryFilter] = useState('ALL');
  const [paymentCategoryFilter, setPaymentCategoryFilter] = useState('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Section Refs for Scroll Navigation
  const accountSectionRef = useRef<HTMLDivElement>(null);
  const denomSectionRef = useRef<HTMLDivElement>(null);
  const paymentSectionRef = useRef<HTMLDivElement>(null);

  // Flash Sale Timer
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

  // Local Storage Hydration
  useEffect(() => {
    if (game) {
      const savedUserId = localStorage.getItem(`nexapay_userid_${game.slug}`);
      const savedServerId = localStorage.getItem(`nexapay_serverid_${game.slug}`);
      const savedPhone = localStorage.getItem('nexapay_user_phone');
      if (savedUserId) setUserId(savedUserId);
      if (savedServerId) setServerId(savedServerId);
      if (savedPhone) setPhoneNumber(savedPhone);
      setDenomCategoryFilter('ALL');
    }
  }, [game]);

  useEffect(() => {
    if (phoneNumber) {
      localStorage.setItem('nexapay_user_phone', phoneNumber);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`nexapay_userid_${game.slug}`, userId);
    }
    if (serverId) {
      localStorage.setItem(`nexapay_serverid_${game.slug}`, serverId);
    }
  }, [userId, serverId, game.slug]);

  // Pricing Calculation Logic
  const denom = game.denominations.find((d) => d.id === selectedDenom);
  const payment = PAYMENT_METHODS.find((p) => p.id === selectedPayment);
  
  const basePrice = denom?.isFlashSale && denom.flashSalePrice ? denom.flashSalePrice : (denom?.price || 0);
  const discountAmount = Math.floor(basePrice * (rank.discount / 100));
  const price = basePrice - discountAmount;
  const fee = payment?.fee || 0;
  const total = price + fee;

  function getCurrencyLabel(slug: string): string {
    const map: Record<string, string> = {
      'mobile-legends': 'Diamond',
      'free-fire': 'Diamond',
      'free-fire-max': 'Diamond',
      'arena-of-valor': 'Voucher',
      'wild-rift': 'Wild Core',
      'genshin-impact': 'Genesis Crystal',
      'honkai-star-rail': 'Oneiric Shard',
      'zenless-zone-zero': 'Monochrome',
      'pubg-mobile': 'UC',
      'call-of-duty-mobile': 'CP',
      'valorant': 'VP Points',
      'roblox': 'Robux',
      'steam-wallet': 'Voucher',
    };
    return map[slug] || 'Nominal Top Up';
  }

  const currencyLabel = getCurrencyLabel(game.slug);
  const isVoucherProduct = ['steam-wallet', 'roblox'].includes(game.slug);

  // In-Game Nickname Real-Time Checking
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [verifiedNickname, setVerifiedNickname] = useState<string | null>(null);
  const [nicknameRegion, setNicknameRegion] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  useEffect(() => {
    if (isVoucherProduct || !userId || userId.trim().length < 4) {
      setVerifiedNickname(null);
      setNicknameRegion(null);
      setNicknameError(null);
      setIsCheckingNickname(false);
      return;
    }

    if (['mobile-legends', 'genshin-impact', 'honkai-star-rail', 'zenless-zone-zero'].includes(game.slug) && !serverId) {
      setVerifiedNickname(null);
      setNicknameRegion(null);
      setNicknameError(null);
      setIsCheckingNickname(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingNickname(true);
      setNicknameError(null);
      try {
        const res = await fetch('/api/game/check-nickname', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: game.slug,
            userId: userId.trim(),
            zoneId: serverId ? serverId.trim() : undefined,
          }),
        });

        const data = await res.json();
        if (data.success && data.nickname) {
          setVerifiedNickname(data.nickname);
          setNicknameRegion(data.region || null);
          setNicknameError(null);
        } else {
          setVerifiedNickname(null);
          setNicknameRegion(null);
          if (data.message && !data.message.includes('belum lengkap')) {
            setNicknameError(data.message);
          }
        }
      } catch (err) {
        console.warn('Failed to verify nickname:', err);
      } finally {
        setIsCheckingNickname(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [userId, serverId, game.slug, isVoucherProduct]);

  // Denomination Categories
  const hasRecharge = game.denominations.some((d) => {
    if (!d.isActive) return false;
    const lbl = (d.label || '').toLowerCase();
    return lbl.includes('2x recharge bonus') || lbl.includes('pengisian pertama');
  });

  const hasPass = game.denominations.some((d) => {
    if (!d.isActive) return false;
    const lbl = (d.label || '').toLowerCase();
    return lbl.includes('pass') || lbl.includes('weekly') || lbl.includes('starlight') || lbl.includes('twilight') || lbl.includes('membership') || lbl.includes('blessing') || lbl.includes('welkin') || lbl.includes('bundle') || lbl.includes('pack');
  });

  const hasChronalNexus = game.denominations.some((d) => d.isActive && (d.label || '').toLowerCase().includes('chronal nexus'));

  const denomCategories = useMemo(() => [
    { id: 'ALL', label: 'Semua', icon: Gem },
    ...(hasRecharge ? [{ id: 'RECHARGE', label: '2x Bonus', icon: Zap }] : []),
    ...(hasChronalNexus ? [{ id: 'NEXUS', label: 'Chronal Nexus', icon: Gem }] : []),
    ...(hasPass ? [{ id: 'PASS', label: 'Pass', icon: ShieldCheck }] : []),
    ...(game.denominations.some((d) => d.isActive && d.isPopular) ? [{ id: 'HOT', label: 'Populer', icon: Star }] : []),
    ...(game.denominations.some((d) => d.isActive && d.isFlashSale && d.flashSalePrice) ? [{ id: 'FLASH', label: 'Flash Sale', icon: Zap }] : []),
  ], [game.denominations, hasRecharge, hasChronalNexus, hasPass]);

  const filteredDenominations = useMemo(() => {
    return game.denominations.filter((d) => {
      if (!d.isActive) return false;
      if (denomCategoryFilter === 'NEXUS') return (d.label || '').toLowerCase().includes('chronal nexus');
      if (denomCategoryFilter === 'RECHARGE') {
        const lbl = (d.label || '').toLowerCase();
        return lbl.includes('2x recharge bonus') || lbl.includes('pengisian pertama');
      }
      if (denomCategoryFilter === 'FLASH') return d.isFlashSale && d.flashSalePrice;
      if (denomCategoryFilter === 'HOT') return d.isPopular;
      if (denomCategoryFilter === 'PASS') {
        const lbl = (d.label || '').toLowerCase();
        return lbl.includes('pass') || lbl.includes('weekly') || lbl.includes('starlight') || lbl.includes('twilight') || lbl.includes('membership') || lbl.includes('blessing') || lbl.includes('welkin') || lbl.includes('bundle') || lbl.includes('pack');
      }
      return true;
    });
  }, [game.denominations, denomCategoryFilter]);

  const paymentCategoryPills = [
    { id: 'ALL', label: 'Semua' },
    { id: 'QRIS', label: 'QRIS' },
    { id: 'E-Wallet', label: 'E-Wallet' },
    { id: 'Bank Transfer', label: 'Bank VA' },
    { id: 'Minimarket', label: 'Minimarket' },
  ];

  const paymentsByCategory = useMemo(() => {
    return PAYMENT_METHODS.reduce((acc, pm) => {
      if (!acc[pm.category]) acc[pm.category] = [];
      acc[pm.category].push(pm);
      return acc;
    }, {} as Record<string, typeof PAYMENT_METHODS[number][]>);
  }, []);

  // Handlers
  const handleSelectDenom = (denomId: string) => {
    setSelectedDenom(denomId);
    setTimeout(() => {
      paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
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

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    const targetUserId = isVoucherProduct ? (userId || 'VOUCHER') : userId;
    if (!targetUserId && !isVoucherProduct) {
      toast.error('Harap masukkan User ID terlebih dahulu!');
      accountSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!denom) {
      toast.error('Harap pilih Nominal terlebih dahulu!');
      denomSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    addItem({
      productId: game.id,
      productSlug: game.slug,
      category: game.category,
      productName: game.name,
      productImage: game.image || '',
      denominationId: denom.id,
      denominationLabel: denom.label,
      price: total,
      quantity: 1,
      gameUserId: targetUserId,
      gameServerId: serverId,
    });
    addNotification({
      id: Date.now().toString(),
      title: 'Ditambahkan ke Keranjang',
      message: `${denom.label} - ${game.name} berhasil ditambahkan.`,
      type: 'success',
    });
    toast.success('Berhasil ditambahkan ke keranjang!');
  };

  const handleCheckout = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    const targetUserId = isVoucherProduct ? (userId || 'VOUCHER') : userId;
    if (!targetUserId && !isVoucherProduct) {
      toast.error('Harap masukkan User ID terlebih dahulu!');
      accountSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!selectedDenom) {
      toast.error('Harap pilih Nominal terlebih dahulu!');
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
          productId: game.id,
          denominationId: selectedDenom,
          gameUserId: targetUserId,
          gameServerId: serverId,
          paymentMethod: selectedPayment,
          promoCode: promoCode.trim() ? promoCode.trim().toUpperCase() : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses pesanan');
      }

      toast.success('Pesanan berhasil dibuat!');

      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const channel = new BroadcastChannel('nexapay_live_transactions');
          channel.postMessage({ type: 'NEW_TRANSACTION' });
          channel.close();
        } catch {
          // ignore
        }
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        const targetId = data.invoiceId || data.transactionId || '';
        router.push(`/payment-status/${targetId}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormComplete = !!(userId && selectedDenom && selectedPayment);

  return (
    <>
      <main
        id="main-content"
        tabIndex={-1}
        className="container-app pt-24 pb-28 sm:pb-32 tablet:pt-32 tablet:pb-12 relative z-10 focus:outline-none"
      >
        {/* Game Hero Banner Header */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 border border-white/10 bg-[#121620] shadow-xl">
          <div className="relative min-h-[140px] sm:min-h-[170px] tablet:min-h-[200px] w-full flex items-center p-4 sm:p-6 tablet:p-8">
            {game.bannerImage && (
              <Image
                src={game.bannerImage || game.image}
                alt={game.name}
                fill
                priority={false}
                loading="lazy"
                quality={55}
                sizes="100vw"
                className="object-cover opacity-15 filter blur-[2px] scale-105 pointer-events-none"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#121620] via-[#121620]/90 to-transparent" />

            <div className="relative z-10 flex items-center gap-3.5 sm:gap-6 tablet:gap-8 w-full">
              <div className="relative w-14 h-14 xs:w-16 xs:h-16 sm:w-24 sm:h-24 tablet:w-28 tablet:h-28 rounded-2xl overflow-hidden border-2 border-[#FF7300]/40 shadow-lg shadow-[#FF7300]/20 flex-shrink-0 bg-[#121620]">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  priority={true}
                  // @ts-ignore
                  fetchPriority="high"
                  loading="eager"
                  quality={85}
                  sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, 112px"
                  className="object-cover scale-[1.08]"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1 tablet:space-y-1.5">
                {game.publisher && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FF7300]/15 text-[#FF7300] border border-[#FF7300]/30 inline-block">
                    {game.publisher}
                  </span>
                )}
                <h1 className="text-base xs:text-lg sm:text-2xl tablet:text-3xl font-extrabold font-heading text-white tracking-tight leading-snug">
                  {game.name}
                </h1>
                <p className="text-[11.5px] xs:text-xs tablet:text-sm text-slate-300 line-clamp-3 sm:line-clamp-none max-w-xl leading-relaxed">
                  {game.description}
                </p>
                <div className="flex items-center gap-2.5 sm:gap-3 pt-1 text-[11px] sm:text-xs text-slate-400 font-medium flex-wrap">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Proses Instan 24 Jam
                  </span>
                  <span className="flex items-center gap-1 text-sky-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" /> 100% Resmi &amp; Legal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 tablet:gap-6 lg:gap-8 items-start">
          {/* Left Column: Form Steps */}
          <div className="md:col-span-7 lg:col-span-8 space-y-5 sm:space-y-6">
            <TopUpAccountStep
              game={game}
              isVoucherProduct={isVoucherProduct}
              userId={userId}
              setUserId={setUserId}
              serverId={serverId}
              setServerId={setServerId}
              setIsValidated={setIsValidated}
              isCheckingNickname={isCheckingNickname}
              verifiedNickname={verifiedNickname}
              nicknameRegion={nicknameRegion}
              nicknameError={nicknameError}
              accountSectionRef={accountSectionRef}
              onOpenHelpModal={() => setShowHelpModal(true)}
            />

            <TopUpDenomStep
              denomSectionRef={denomSectionRef}
              timeLeft={timeLeft}
              denomCategories={denomCategories}
              denomCategoryFilter={denomCategoryFilter}
              setDenomCategoryFilter={setDenomCategoryFilter}
              filteredDenominations={filteredDenominations}
              selectedDenom={selectedDenom}
              handleSelectDenom={handleSelectDenom}
              rank={rank}
            />

            <TopUpPaymentStep
              paymentSectionRef={paymentSectionRef}
              paymentCategoryPills={paymentCategoryPills}
              paymentCategoryFilter={paymentCategoryFilter}
              setPaymentCategoryFilter={setPaymentCategoryFilter}
              paymentsByCategory={paymentsByCategory}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              denom={denom}
              price={price}
            />

            {/* Step 4: WhatsApp Contact Number */}
            <section id="step-whatsapp">
              <div className="p-4 sm:p-5 tablet:p-6 rounded-2xl bg-[#121620] border border-white/10 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-2.5 mb-3.5 pb-3 border-b border-white/8">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FF7300]/15 text-[#FF7300] border border-[#FF7300]/30 flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-sm flex-shrink-0">
                    4
                  </div>
                  <Phone className="w-4 h-4 text-[#FF7300] flex-shrink-0" />
                  <h2 className="text-xs sm:text-sm tablet:text-base font-bold font-heading text-white">
                    Nomor WhatsApp
                  </h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="topup-whatsapp-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      No. WhatsApp / Kontak <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="topup-whatsapp-input"
                        name="whatsappNumber"
                        type="tel"
                        aria-required="true"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full pl-3.5 pr-10 py-2.5 sm:py-3 rounded-xl bg-[#0B0E14] border border-white/12 text-xs sm:text-sm font-semibold text-white placeholder:text-slate-400 outline-none focus:border-[#FF7300] transition-all"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                      Bukti pembayaran dan nomor invoice transaksi akan otomatis dikirimkan ke WhatsApp kamu.
                    </p>
                  </div>

                  {/* Promo Code Toggle for Mobile */}
                  <div className="pt-2 border-t border-white/8 md:hidden">
                    <button
                      type="button"
                      onClick={() => setShowPromoInput(!showPromoInput)}
                      className="flex items-center justify-between w-full py-1 text-xs font-bold text-[#FF7300]"
                    >
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        Punya Kode Promo?
                      </span>
                      <ChevronDown className={cn('w-4 h-4 transition-transform', showPromoInput && 'rotate-180')} />
                    </button>

                    {showPromoInput && (
                      <div className="flex items-center gap-2 pt-2">
                        <label htmlFor="mobile-promo-input" className="sr-only">Kode Promo</label>
                        <input
                          id="mobile-promo-input"
                          name="mobilePromoCode"
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Kode Promo"
                          className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#0B0E14] border border-white/12 text-xs uppercase font-bold text-white placeholder:text-slate-400 outline-none focus:border-[#FF7300]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="btn-primary px-4 py-2 text-xs font-bold"
                        >
                          Gunakan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Desktop Sticky Summary */}
          <div className="hidden md:block md:col-span-5 lg:col-span-4 sticky top-24 xl:top-28 self-start z-30">
            <TopUpOrderSummary
              game={game}
              userId={userId}
              serverId={serverId}
              denom={denom}
              payment={payment}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              handleApplyPromo={handleApplyPromo}
              price={price}
              discountAmount={discountAmount}
              fee={fee}
              total={total}
              rank={rank}
              isFormComplete={isFormComplete}
              isProcessing={isProcessing}
              handleCheckout={handleCheckout}
              handleAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Informational Game FAQ & Guides */}
        <TopUpFaqSection game={game} currencyLabel={currencyLabel} />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Fixed Action Bar at Bottom */}
      <TopUpMobileActionDock
        denom={denom}
        total={total}
        userId={userId}
        isVoucherProduct={isVoucherProduct}
        selectedDenom={selectedDenom}
        selectedPayment={selectedPayment}
        isProcessing={isProcessing}
        handleCheckout={handleCheckout}
        handleAddToCart={handleAddToCart}
      />

      {/* Help Modal */}
      <TopUpHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        gameName={game.name}
      />
    </>
  );
}
