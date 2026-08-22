'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Check, Gamepad2, CreditCard, ShieldCheck, Loader2,
  Info, Tag, Zap, Star, ShoppingCart, Gem, Heart, User, X, Home, CheckCircle2, HelpCircle, Sparkles, Globe, ChevronDown, Phone, MessageSquare
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
import Footer from '@/components/layout/Footer';
import type { ProductWithDenominations, Denomination } from '@/types';

/**
 * Derive a subtle background tint from the shared GAME_COLORS palette.
 * Falls back to a warm orange tint for unknown games.
 */
function getGameBgTint(slug: string): string {
  const colorMap: Record<string, string> = {
    'mobile-legends': 'rgba(234, 179, 8, 0.22)',
    'free-fire': 'rgba(249, 115, 22, 0.22)',
    'free-fire-max': 'rgba(249, 115, 22, 0.22)',
    'valorant': 'rgba(244, 63, 94, 0.22)',
    'genshin-impact': 'rgba(6, 182, 212, 0.22)',
    'pubg-mobile': 'rgba(245, 158, 11, 0.22)',
    'honkai-star-rail': 'rgba(168, 85, 247, 0.22)',
    'call-of-duty-mobile': 'rgba(16, 185, 129, 0.22)',
    'roblox': 'rgba(239, 68, 68, 0.22)',
    'steam-wallet': 'rgba(59, 130, 246, 0.22)',
    'wild-rift': 'rgba(6, 182, 212, 0.22)',
    'arena-of-valor': 'rgba(168, 85, 247, 0.22)',
    'zenless-zone-zero': 'rgba(234, 179, 8, 0.22)',
  };
  return colorMap[slug] || 'rgba(255, 115, 0, 0.18)';
}

function FaqAccordionSection({
  items,
  gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
}: {
  items: Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    content: React.ReactNode;
    iconBg?: string;
    borderGlow?: string;
  }>;
  gridCols?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {/* Mobile Glassmorphic Accordion Dropdowns (block tablet:hidden) */}
      <div className="tablet:hidden space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={cn(
                'rounded-2xl bg-card/40 backdrop-blur-xl border transition-all overflow-hidden shadow-md',
                isOpen
                  ? item.borderGlow || 'border-primary/50 bg-card/70 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                  : 'border-white/10 hover:border-white/20'
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left font-bold font-heading text-xs sm:text-sm active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center font-bold flex-shrink-0',
                    item.iconBg || 'bg-primary/10 text-primary'
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-foreground font-bold text-xs sm:text-sm leading-snug">{item.title}</span>
                </div>
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center bg-background/50 border border-white/10 transition-transform duration-300 flex-shrink-0',
                  isOpen && 'rotate-180 bg-primary/20 text-primary border-primary/30'
                )}>
                  <ChevronDown className="w-3.5 h-3.5 text-primary" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-border/30 text-xs text-muted-foreground space-y-3 leading-relaxed">
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Tablet & Desktop Glassmorphic Cards Grid (hidden tablet:grid) */}
      <div className={cn('hidden tablet:grid gap-5', gridCols)}>
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={cn(
                'p-6 rounded-3xl bg-card/40 backdrop-blur-xl border transition-all space-y-4 shadow-lg group flex flex-col justify-between',
                item.borderGlow || 'border-white/10 hover:border-primary/30'
              )}
            >
              <div className="space-y-4">
                <div className={cn(
                  'w-10 h-10 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform',
                  item.iconBg || 'bg-primary/10 text-primary'
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold font-heading text-foreground">{item.title}</h3>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
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

  const hasCurrency = game.denominations.some((d) => {
    if (!d.isActive) return false;
    const lbl = (d.label || '').toLowerCase();
    return !lbl.includes('chronal nexus') && !lbl.includes('2x recharge bonus') && !lbl.includes('pengisian pertama') && !lbl.includes('pass') && !lbl.includes('twilight') && !lbl.includes('membership') && !lbl.includes('blessing') && !lbl.includes('welkin') && !lbl.includes('bundle') && !lbl.includes('pack');
  });

  const hasPopular = game.denominations.some((d) => d.isActive && d.isPopular);
  const hasFlash = game.denominations.some((d) => d.isActive && d.isFlashSale && d.flashSalePrice);

  const denomCategories = [
    { id: 'ALL', label: 'Semua', icon: Gem },
    ...(hasRecharge ? [{ id: 'RECHARGE', label: '2x Bonus', icon: Zap }] : []),
    ...(hasChronalNexus ? [{ id: 'NEXUS', label: 'Chronal Nexus', icon: Gem }] : []),
    ...(hasCurrency ? [{ id: 'CURRENCY', label: currencyLabel, icon: Gem }] : []),
    ...(hasPass ? [{ id: 'PASS', label: 'Pass', icon: ShieldCheck }] : []),
    ...(hasPopular ? [{ id: 'HOT', label: 'Populer', icon: Star }] : []),
    ...(hasFlash ? [{ id: 'FLASH', label: 'Flash Sale', icon: Zap }] : []),
  ];

  const filteredDenominations = game.denominations.filter((d) => {
    if (!d.isActive) return false;
    if (denomCategoryFilter === 'NEXUS') {
      return (d.label || '').toLowerCase().includes('chronal nexus');
    }
    if (denomCategoryFilter === 'RECHARGE') {
      const lbl = (d.label || '').toLowerCase();
      return lbl.includes('2x recharge bonus') || lbl.includes('pengisian pertama');
    }
    if (denomCategoryFilter === 'CURRENCY') {
      const lbl = (d.label || '').toLowerCase();
      return !lbl.includes('chronal nexus') && !lbl.includes('2x recharge bonus') && !lbl.includes('pengisian pertama') && !lbl.includes('pass') && !lbl.includes('twilight') && !lbl.includes('membership') && !lbl.includes('blessing') && !lbl.includes('welkin') && !lbl.includes('bundle') && !lbl.includes('pack');
    }
    if (denomCategoryFilter === 'FLASH') return d.isFlashSale && d.flashSalePrice;
    if (denomCategoryFilter === 'HOT') return d.isPopular;
    if (denomCategoryFilter === 'PASS') {
      const lbl = (d.label || '').toLowerCase();
      return lbl.includes('pass') || lbl.includes('weekly') || lbl.includes('starlight') || lbl.includes('twilight') || lbl.includes('membership') || lbl.includes('blessing') || lbl.includes('welkin') || lbl.includes('bundle') || lbl.includes('pack');
    }
    return true;
  });

  const paymentCategoryPills = [
    { id: 'ALL', label: 'Semua' },
    { id: 'QRIS', label: 'QRIS' },
    { id: 'E-Wallet', label: 'E-Wallet' },
    { id: 'Bank Transfer', label: 'Bank VA' },
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

  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [verifiedNickname, setVerifiedNickname] = useState<string | null>(null);
  const [nicknameRegion, setNicknameRegion] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  // Auto-check in-game nickname when User ID (and Server ID if required) is typed
  useEffect(() => {
    if (isVoucherProduct || !userId || userId.trim().length < 4) {
      setVerifiedNickname(null);
      setNicknameRegion(null);
      setNicknameError(null);
      setIsCheckingNickname(false);
      return;
    }

    // For games that strictly require server/zone ID
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
      {/* Dynamic Game-Themed Ambient Glow */}
      <div
        className="fixed top-1/6 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1000px] h-[450px] blur-[140px] pointer-events-none rounded-full z-0 opacity-80 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${gameColor} 0%, rgba(249,115,22,0.06) 50%, transparent 80%)`,
        }}
      />

      <div className="container-app pt-28 pb-4 tablet:pt-36 tablet:pb-12 relative z-10">

        {/* Top Game Hero Banner Header */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 border border-border/60 glass-card shadow-2xl">
          <div className="relative min-h-[140px] sm:min-h-[170px] tablet:min-h-[210px] w-full bg-gradient-to-r from-background via-card to-background overflow-hidden flex items-center p-3.5 sm:p-6 tablet:p-8">
            {game.bannerImage && (
              <Image
                src={game.bannerImage || game.image}
                alt={game.name}
                fill
                priority
                loading="eager"
                sizes="100vw"
                className="object-cover opacity-20 filter blur-[3px] scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            <div className="relative z-10 flex items-center gap-3 sm:gap-6 tablet:gap-8 w-full">
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 tablet:w-28 tablet:h-28 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-primary/40 shadow-[0_0_25px_rgba(255,115,0,0.3)] flex-shrink-0 bg-card">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 768px) 96px, 112px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1 tablet:space-y-2">
                {game.publisher && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                      {game.publisher}
                    </span>
                  </div>
                )}
                <h1 className="text-base sm:text-2xl tablet:text-3xl font-black font-heading text-foreground tracking-tight leading-snug">
                  {game.name}
                </h1>
                <p className="text-[11px] sm:text-xs tablet:text-sm text-muted-foreground line-clamp-3 max-w-xl leading-relaxed">
                  {game.description}
                </p>
                <div className="flex items-center gap-x-2.5 gap-y-1 pt-0.5 text-[9.5px] sm:text-[11px] text-muted-foreground font-medium flex-wrap">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Proses Instan 24 Jam
                  </span>
                  <span className="flex items-center gap-1 text-sky-400 font-semibold">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 100% Resmi & Legal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid Main Content — 2 Columns on Tablet & Desktop (>= 768px) with sticky tracking */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 tablet:gap-6 lg:gap-8 items-start">
          {/* Left Column: Interactive Form Steps (7 cols on tablet, 8 cols on laptop/desktop) */}
          <div className="md:col-span-7 lg:col-span-8 space-y-5 sm:space-y-6 lg:space-y-8">

            {/* STEP 1: Account Identification / Data Akun */}
            <section ref={accountSectionRef} id="step-account">
              <div className="glass-card p-4 sm:p-5 tablet:p-6 rounded-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_12px_rgba(255,115,0,0.2)] flex-shrink-0">
                      1
                    </div>
                    <User className="w-4 h-4 text-primary flex-shrink-0 hidden sm:block" />
                    <h2 className="text-xs sm:text-sm tablet:text-base font-bold font-heading text-foreground whitespace-nowrap">
                      {isVoucherProduct ? (
                        'Status Voucher'
                      ) : (
                        <>
                          <span className="lg:hidden">Data Akun</span>
                          <span className="hidden lg:inline">Masukkan Data Akun</span>
                        </>
                      )}
                    </h2>
                  </div>
                  {!isVoucherProduct && (
                    <button 
                      type="button"
                      onClick={() => setShowHelpModal(true)}
                      className="flex items-center gap-1 text-[9.5px] sm:text-[11px] font-bold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-primary/20 transition-all active:scale-95 flex-shrink-0 cursor-pointer"
                    >
                      <Info className="w-3 h-3" />
                      <span>Petunjuk ID</span>
                    </button>
                  )}
                </div>
                <div className="space-y-3 sm:space-y-4 relative z-10">
                  {isVoucherProduct ? (
                    <div className="p-3.5 sm:p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs sm:text-sm text-foreground space-y-1">
                      <div className="font-bold text-primary flex items-center gap-2">
                        <span>🎟️ Voucher Langsung Dikirim ke Email / No. WA</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        Ini adalah produk Kode Voucher Resmi ({game.name}). Tidak memerlukan User ID Game. Kode voucher akan dikirimkan otomatis secara instan setelah pembayaran berhasil.
                      </p>
                    </div>
                  ) : ['mobile-legends'].includes(game.slug) ? (
                    <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                      <div className="col-span-3">
                        <label className="block text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          User ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={userId}
                          onChange={(e) => { setUserId(e.target.value); setIsValidated(false); }}
                          placeholder="Contoh: 12345678"
                          className="w-full px-3 py-2.5 sm:px-3.5 sm:py-3 rounded-xl bg-background/50 border border-border text-xs sm:text-sm font-semibold outline-none focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200 shadow-inner"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Zone ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={serverId}
                          onChange={(e) => { setServerId(e.target.value); setIsValidated(false); }}
                          placeholder="(2103)"
                          className="w-full px-3 py-2.5 sm:px-3.5 sm:py-3 rounded-xl bg-background/50 border border-border text-xs sm:text-sm font-semibold outline-none focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200 shadow-inner"
                        />
                      </div>
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
                    </div>
                  )}
                  {['genshin-impact', 'honkai-star-rail', 'zenless-zone-zero'].includes(game.slug) ? (
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="block text-sm font-medium">
                          Pilih Server Game <span className="text-red-500">*</span>
                        </label>
                        {serverId && (
                          <span className="text-xs text-primary font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Server: {serverId === 'TW_HK_MO' ? 'TW, HK, MO' : serverId}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: 'Asia', name: 'Asia', code: 'Awal UID 8 / 9' },
                          { id: 'America', name: 'America', code: 'Awal UID 6' },
                          { id: 'Europe', name: 'Europe', code: 'Awal UID 7' },
                          { id: 'TW_HK_MO', name: 'TW, HK, MO', code: 'Awal UID 9' },
                        ].map((srv) => {
                          const isSelected = serverId === srv.id;
                          return (
                            <button
                              key={srv.id}
                              type="button"
                              onClick={() => { setServerId(srv.id); setIsValidated(false); }}
                              className={cn(
                                'relative flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all duration-300 active:scale-95 group backdrop-blur-md',
                                isSelected
                                  ? 'bg-gradient-to-b from-primary/20 via-primary/10 to-background/50 border-primary text-foreground shadow-[0_0_20px_rgba(255,115,0,0.3)] font-bold ring-1 ring-primary/50'
                                  : 'bg-background/40 hover:bg-background/80 border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:shadow-md'
                              )}
                            >
                              <div className={cn(
                                'w-8 h-8 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110',
                                isSelected
                                  ? 'bg-primary/20 text-primary border border-primary/40 shadow-sm'
                                  : 'bg-muted/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10'
                              )}>
                                <Globe className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold font-heading text-foreground">{srv.name}</span>
                              <span className="text-[10px] text-muted-foreground/80 mt-1 font-mono px-2 py-0.5 rounded-full bg-background/50 border border-border/30">
                                {srv.code}
                              </span>
                              {isSelected && (
                                <span className="absolute top-2 right-2 flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {/* Real-Time Nickname Verification Badge */}
                  {!isVoucherProduct && (
                    <div className="pt-1">
                      {isCheckingNickname && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-semibold shadow-sm backdrop-blur-md"
                        >
                          <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                          <span>Menghubungi server game & memverifikasi akun...</span>
                        </motion.div>
                      )}

                      {!isCheckingNickname && verifiedNickname && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-teal-500/15 border border-emerald-500/30 shadow-[0_0_25px_rgba(52,211,153,0.15)] flex items-center justify-between gap-2.5 relative overflow-hidden backdrop-blur-xl"
                        >
                          {/* Ambient Glow */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

                          <div className="flex items-center gap-2.5 min-w-0 relative z-10">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-[9px] sm:text-[10px] text-emerald-400/70 font-mono font-bold tracking-wider flex-shrink-0">NICKNAME:</span>
                                <span className="text-xs sm:text-sm font-black text-white tracking-wide truncate">{verifiedNickname}</span>
                              </div>
                              <p className="text-[10px] text-emerald-400 font-medium truncate mt-0.5">
                                Akun Resmi Terverifikasi
                              </p>
                            </div>
                          </div>

                          {nicknameRegion && (
                            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[9px] sm:text-[10px] font-extrabold border border-emerald-500/30 flex-shrink-0 relative z-10 shadow-sm">
                              {nicknameRegion}
                            </span>
                          )}
                        </motion.div>
                      )}

                      {!isCheckingNickname && nicknameError && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium"
                        >
                          <Info className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                          <span className="truncate">{nicknameError}</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

              <div
                ref={denomSectionRef}
                className="glass-card p-4 sm:p-5 tablet:p-6 rounded-2xl relative overflow-hidden group scroll-mt-28"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 mb-3.5 sm:mb-4 relative z-10 pb-3 border-b border-border/40">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_12px_rgba(255,115,0,0.2)] flex-shrink-0">
                    2
                  </div>
                  <Tag className="w-4 h-4 text-primary flex-shrink-0" />
                  <h2 className="text-xs sm:text-sm tablet:text-base font-bold font-heading text-foreground">Pilih Nominal</h2>
                </div>

                {/* Live Flash Sale Countdown Banner */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 p-2.5 sm:p-3 mb-4 sm:mb-5 rounded-xl bg-gradient-to-r from-red-500/15 via-orange-500/10 to-primary/10 border border-red-500/25 text-[11px] sm:text-xs font-bold relative z-10">
                  <div className="flex items-center gap-1.5 text-red-400">
                    <Zap className="w-3.5 h-3.5 text-red-500 animate-pulse flex-shrink-0" />
                    <span className="truncate">FLASH SALE LIMITED TIME</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs">
                    <span className="text-[9.5px] text-muted-foreground mr-0.5">Berakhir:</span>
                    <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30 font-bold">
                      {String(timeLeft.hours).padStart(2, '0')}h
                    </span>
                    <span className="text-red-400">:</span>
                    <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30 font-bold">
                      {String(timeLeft.minutes).padStart(2, '0')}m
                    </span>
                    <span className="text-red-400">:</span>
                    <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30 font-bold">
                      {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                </div>

                {/* Denomination Category Filter Pills */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-4 sm:mb-5 no-scrollbar relative z-10">
                  {denomCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setDenomCategoryFilter(cat.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all border flex-shrink-0 active:scale-95 cursor-pointer',
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

                {denomCategoryFilter === 'RECHARGE' && (
                  <div className="p-3.5 sm:p-4 mb-4 sm:mb-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-primary/10 border border-amber-500/30 text-xs relative z-10 space-y-1">
                    <div className="flex items-center gap-2 text-amber-400 font-bold font-heading">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>2x Recharge Bonus (Bonus Top Up Pertama)</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Selama event ini, player yang belum top up nominal 100, 300, 500, atau 1000 Diamonds melalui platform lain bisa menikmati bonus ganda 2x lipat pada pembelian pertama mereka!
                    </p>
                  </div>
                )}

                {denomCategoryFilter === 'PASS' && (
                  <div className="p-3.5 sm:p-4 mb-4 sm:mb-5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-primary/10 to-sky-500/10 border border-purple-500/30 text-xs relative z-10 space-y-2">
                    <div className="flex items-center gap-2 text-purple-300 font-bold font-heading">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>Syarat & Keuntungan Pass / Bundle Limited</span>
                    </div>
                    <ul className="text-muted-foreground text-[11px] leading-relaxed space-y-1 list-disc list-inside">
                      <li><strong>Weekly Diamond Pass:</strong> Pastikan membeli setelah Level 5 tercapai & durasi tersisa kurang dari 70 hari.</li>
                      <li><strong>Weekly Elite Pack:</strong> Beli 55 Diamonds + dapatkan Crystal of Aurora ×20, Rare Skin Fragment ×2, & BP Card 4-Win ×1 GRATIS!</li>
                      <li><strong>Monthly Elite Pack:</strong> Beli 275 Diamonds + dapatkan Crystal of Aurora ×180, Rare Skin Fragment ×10, & BP Card 10-Win ×1 GRATIS!</li>
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-2 tablet:grid-cols-2 laptop:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3.5 tablet:gap-4 relative z-10">
                  {filteredDenominations.length > 0 ? (
                    filteredDenominations.map((d: Denomination) => {
                      const isFlash = d.isFlashSale && d.flashSalePrice;
                      const displayPrice = isFlash ? d.flashSalePrice! : d.price;
                      const isSelected = selectedDenom === d.id;
                      const finalPrice = displayPrice - Math.floor(displayPrice * (rank.discount / 100));

                      return (
                        <button
                          key={d.id}
                          onClick={() => handleSelectDenom(d.id)}
                          className={cn(
                            'relative flex flex-col items-center justify-between p-2.5 sm:p-4 tablet:p-5 rounded-2xl border bg-card/60 text-center transition-all duration-300 backdrop-blur-md group cursor-pointer overflow-hidden min-h-[135px] sm:min-h-[160px]',
                            isSelected
                              ? 'border-primary bg-primary/[0.12] ring-2 ring-primary shadow-[0_0_25px_rgba(255,115,0,0.3)] z-10 scale-[1.02]'
                              : d.isPopular
                              ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/[0.06] via-card/60 to-card/90 shadow-sm hover:border-amber-500/80 hover:shadow-md hover:-translate-y-0.5'
                              : 'border-white/10 hover:border-primary/50 hover:bg-card/90 hover:-translate-y-0.5 hover:shadow-md'
                          )}
                        >
                          {/* Top Badges */}
                          {isFlash ? (
                            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10">
                              <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white text-[7.5px] sm:text-[9px] font-black tracking-wider animate-pulse shadow-md flex items-center gap-0.5">
                                <Zap className="w-2.5 h-2.5 fill-current" /> FLASH
                              </span>
                            </div>
                          ) : d.isPopular ? (
                            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10">
                              <span className="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[7.5px] sm:text-[9px] font-black tracking-wider shadow-md border border-amber-300/30">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                BEST
                              </span>
                            </div>
                          ) : null}

                          {/* Center: Gem Icon & Label */}
                          <div className="flex flex-col items-center gap-1 sm:gap-1.5 w-full pt-1 sm:pt-2">
                            <div className={cn(
                              "w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 relative",
                              isSelected 
                                ? "bg-primary text-white shadow-[0_0_15px_rgba(255,115,0,0.5)] scale-105" 
                                : "bg-white/5 text-primary border border-white/10 group-hover:scale-105 group-hover:border-primary/30"
                            )}>
                              <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <p className={cn(
                              "text-[10px] sm:text-xs xl:text-sm font-black font-heading tracking-tight transition-colors text-center px-0.5 leading-tight break-words line-clamp-3",
                              isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                            )}>
                              {d.label}
                            </p>
                          </div>

                          {/* Bottom: Price Capsule & Strikethrough */}
                          <div className="w-full flex flex-col items-center mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-white/5 space-y-0.5 sm:space-y-1">
                            {/* Strikethrough Original Price if Discounted */}
                            {(d.originalPrice || isFlash || rank.discount > 0) && (
                              <span className="text-[9px] sm:text-[11px] text-muted-foreground/70 line-through font-mono leading-none">
                                {formatCurrency(isFlash ? d.price : (d.originalPrice || displayPrice))}
                              </span>
                            )}

                            {/* Gleaming Price Container Pill */}
                            <div className={cn(
                              "w-full py-1 sm:py-1.5 px-1.5 sm:px-2.5 rounded-xl font-mono font-black text-[11px] sm:text-sm transition-all duration-300 flex items-center justify-center shadow-sm",
                              isSelected
                                ? "gradient-primary text-white shadow-[0_0_15px_rgba(255,115,0,0.4)]"
                                : "bg-white/[0.04] border border-white/10 text-foreground group-hover:border-primary/40 group-hover:text-primary"
                            )}>
                              {formatCurrency(finalPrice)}
                            </div>

                            {/* Nexa Loyalty Points Tag */}
                            <span className="text-[8px] sm:text-[9.5px] font-bold text-amber-400/90 font-mono">
                              +{Math.floor(displayPrice / 200).toLocaleString('id-ID')} Pts
                            </span>
                          </div>

                          {/* Active Selected Checkmark Top-Right Badge */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full gradient-primary text-white flex items-center justify-center shadow-lg border-2 border-background animate-in zoom-in duration-200 z-20">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
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
              </div>

              {/* STEP 3: Payment Method Selection */}
              <div
                ref={paymentSectionRef}
                className="glass-card p-4 sm:p-5 tablet:p-6 rounded-2xl relative overflow-hidden group scroll-mt-28"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 mb-3.5 sm:mb-4 relative z-10 pb-3 border-b border-border/40">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_12px_rgba(255,115,0,0.2)] flex-shrink-0">
                    3
                  </div>
                  <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
                  <h2 className="text-xs sm:text-sm tablet:text-base font-bold font-heading text-foreground">Pilih Pembayaran</h2>
                </div>

                {/* Payment Category Filter Pills */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-4 sm:mb-5 no-scrollbar relative z-10">
                  {paymentCategoryPills.map((pill) => (
                    <button
                      key={pill.id}
                      onClick={() => setPaymentCategoryFilter(pill.id)}
                      className={cn(
                        'px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all border flex-shrink-0 active:scale-95',
                        paymentCategoryFilter === pill.id
                          ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(255,115,0,0.35)]'
                          : 'bg-background/60 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50'
                      )}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-4 sm:space-y-6 relative z-10">
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
                      <h3 className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3 pl-1">
                        {category}
                      </h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        {methods.map((pm) => {
                          const isPmSelected = selectedPayment === pm.id;
                          const netTotalForPm = denom ? price + pm.fee : null;

                          return (
                            <button
                              key={pm.id}
                              type="button"
                              onClick={() => setSelectedPayment(pm.id)}
                              className={cn(
                                'w-full flex items-center justify-between p-2 sm:p-3 tablet:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 text-left group cursor-pointer backdrop-blur-sm',
                                isPmSelected
                                  ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(255,115,0,0.15)] ring-1 ring-primary'
                                  : 'border-border/60 bg-background/50 hover:border-primary/40 hover:bg-muted/40'
                              )}
                            >
                              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                                <div className="w-10 h-7 sm:w-12 sm:h-8 rounded-lg bg-white/5 border border-white/10 p-0.5 sm:p-1 flex items-center justify-center flex-shrink-0">
                                  <div className="relative w-full h-full">
                                    <Image src={pm.icon} alt={pm.name} fill sizes="40px" className="object-contain" />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={cn("text-xs sm:text-sm font-bold truncate group-hover:text-primary transition-colors font-heading leading-tight", isPmSelected && "text-primary")}>
                                    {pm.name}
                                  </p>
                                  <p className="text-[9.5px] sm:text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                                    {pm.fee > 0 ? `+${formatCurrency(pm.fee)}` : 'Bebas Biaya'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 pl-1.5">
                                {netTotalForPm !== null ? (
                                  <span className={cn("text-[11px] sm:text-sm font-black font-heading", isPmSelected ? "text-primary" : "text-foreground")}>
                                    {formatCurrency(netTotalForPm)}
                                  </span>
                                ) : (
                                  <span className="text-[9.5px] sm:text-[10px] text-muted-foreground font-semibold">
                                    {pm.fee > 0 ? `+${formatCurrency(pm.fee)}` : 'Gratis'}
                                  </span>
                                )}
                                {isPmSelected ? (
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
              </div>

              {/* STEP 4: WhatsApp Contact Number (for Invoice & Receipt Delivery) */}
              <section id="step-whatsapp">
                <div className="glass-card p-4 sm:p-5 tablet:p-6 rounded-2xl relative overflow-hidden group">
                  <div className="flex items-center gap-2 sm:gap-2.5 mb-3.5 pb-3 border-b border-border/40">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary border border-primary/30 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_12px_rgba(255,115,0,0.2)] flex-shrink-0">
                      4
                    </div>
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <h2 className="text-xs sm:text-sm tablet:text-base font-bold font-heading text-foreground">Nomor WhatsApp</h2>
                  </div>

                  <div className="space-y-3.5 relative z-10">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        No. WhatsApp / Kontak <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Contoh: 081234567890"
                          className="w-full pl-3.5 pr-10 py-2.5 sm:py-3 rounded-xl bg-background/50 border border-border text-xs sm:text-sm font-semibold outline-none focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200 shadow-inner"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1 leading-relaxed">
                        <Info className="w-3 h-3 text-primary flex-shrink-0" />
                        Bukti pembayaran dan status transaksi otomatis dikirimkan ke WhatsApp Anda.
                      </p>
                    </div>

                    {/* Collapsible Promo Code Toggle (Mobile only: < 768px) */}
                    <div className="pt-2 border-t border-border/30 md:hidden">
                      <button
                        type="button"
                        onClick={() => setShowPromoInput(!showPromoInput)}
                        className="flex items-center justify-between w-full py-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          Punya Kode Promo / Voucher?
                        </span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", showPromoInput && "rotate-180")} />
                      </button>

                      <AnimatePresence>
                        {showPromoInput && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pt-2"
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                placeholder="Kode Promo (contoh: NEXAWIN)"
                                className="flex-1 min-w-0 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-background/50 border border-border text-xs uppercase font-bold tracking-wider outline-none focus:border-primary focus:bg-background/80 transition-all placeholder:text-[11px] sm:placeholder:text-xs placeholder:text-muted-foreground/60"
                              />
                              <button
                                type="button"
                                onClick={handleApplyPromo}
                                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl gradient-primary text-white text-xs font-bold whitespace-nowrap shadow-md hover:shadow-neon-violet transition-all active:scale-95 flex-shrink-0 cursor-pointer"
                              >
                                Gunakan
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </section>

              {/* Mobile Security & Instant Process Guarantee Trust Card (Mobile only: < 768px) */}
              <div className="md:hidden">
                <div className="glass-card p-3.5 sm:p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="text-[11px] sm:text-xs leading-snug">
                    <span className="font-bold text-foreground block">Garansi Transaksi 100% Resmi</span>
                    <span className="text-muted-foreground">Diproses otomatis dalam &lt; 30 detik melalui server partner terverifikasi.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Summary & Checkout Widget (Tablet & Desktop: >= 768px) */}
            <div className="hidden md:block md:col-span-5 lg:col-span-4 sticky top-28 xl:top-32 self-start z-30">
              <div className="glass-card p-4 sm:p-5 xl:p-6 space-y-3.5 sm:space-y-4 xl:space-y-5 rounded-3xl border border-white/10 shadow-2xl">
                <h3 className="text-base sm:text-lg font-bold font-heading flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Detail Pesanan
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden relative shadow-inner">
                      {game.image ? (
                        <Image src={game.image} alt={game.name} fill priority loading="eager" sizes="48px" className="object-cover" />
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
                  <label className="text-[11px] font-bold font-heading uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Punya Kode Promo / Voucher? <span className="font-normal text-[10px]">(Opsional)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Contoh: NEXAWIN"
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

        {/* Panduan & FAQ Game Section (Modern 2026 Glassmorphism Cards) */}
        <div className="mt-4 tablet:mt-10 pt-4 tablet:pt-8 border-t border-border/40 space-y-4 tablet:space-y-8 max-w-6xl mx-auto px-4 pb-12 tablet:pb-16">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              Pusat Informasi &amp; FAQ
            </span>
            <h2 className="text-xl tablet:text-2xl font-black font-heading tracking-tight">
              Panduan Top Up <span className="gradient-text">{game.name}</span> Termurah
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Dapatkan informasi lengkap cara transaksi, daftar harga terbaru, serta kelengkapan metode pembayaran top up game di NexaPay.
            </p>
          </div>

          {game.slug === 'mobile-legends' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Beli & Kirim Gift Diamond MLBB",
                  content: (
                    <>
                      <p>Isi ulang Diamond untuk akun sendiri atau kirim sebagai <strong className="text-foreground">Kado ke Teman &amp; Keluarga</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Masukkan <strong className="text-foreground">User ID &amp; Zone ID</strong> MLBB kamu (atau ID temanmu).</li>
                        <li>Pilih jumlah Diamond, WDP, StarLight, atau Twilight Pass.</li>
                        <li>Pilih metode pembayaran favoritmu &amp; tuntaskan transaksi.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Diamond langsung ditambahkan ke akun MLBB!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Cara Kerja Bonus Double Diamonds",
                  iconBg: "bg-amber-500/15 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Bonus 1x untuk pembelian pertama per tier Diamond:</p>
                      <ul className="space-y-1 text-[11px] border-b border-border/20 pb-2">
                        <li className="flex items-center justify-between">
                          <span>Beli 50 Diamonds</span>
                          <strong className="text-emerald-400">Dapat 100 DM (50 + 50 Bonus)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Beli 150 Diamonds</span>
                          <strong className="text-emerald-400">Dapat 300 DM (150 + 150 Bonus)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Beli 250 Diamonds</span>
                          <strong className="text-emerald-400">Dapat 500 DM (250 + 250 Bonus)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Beli 500 Diamonds</span>
                          <strong className="text-emerald-400 font-bold">Dapat 1000 DM (500 + 500)!</strong>
                        </li>
                      </ul>
                      <p className="text-[10px] italic pt-1">
                        💡 Bonus 2x berlaku 1 kali per tier terlepas dari metode pembayaran.
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Weekly Diamond Pass (WDP - Rp 27.550)",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Cara paling hemat mengumpulkan total <strong className="text-primary font-bold">220 Diamonds</strong>:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Hadiah Instan:</strong> 80 Diamonds langsung masuk setelah bayar.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Hadiah Harian:</strong> 20 DM/hari × 7 hari = +140 DM tambahan.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Late Sign-in Card:</strong> Fitur penebus klaim harian yang terlewat!</span>
                        </li>
                      </ul>
                      <p className="text-[10px] pt-1 border-t border-border/20">
                        ⚠️ <em>WDP tidak dihitung sebagai milestone event recharge MLBB.</em>
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "StarLight Member (300 / 750 DM)",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Beli min. 300 DM (Member) atau 750 DM (Plus) ➔ buka menu StarLight in-game untuk klaim:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Skin StarLight Eksklusif bulanan + 4 pilihan skin eksklusif ekstra.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Avatar Border, Battle Emote unik, &amp; Hero gratis mingguan.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Bonus XP &amp; keistimewaan prioritas saat fase Banning Rank.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Gem,
                  title: "Twilight Pass (Rp 150.000)",
                  iconBg: "bg-pink-500/15 text-pink-400",
                  borderGlow: "border-pink-500/30 hover:border-pink-500/50",
                  content: (
                    <>
                      <p>Pass premium berhadiah item langka &amp; skin eksklusif:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-pink-400 font-bold">•</span>
                          <span><strong className="text-foreground">Twilight Coins:</strong> Ditukar dengan skin hero &amp; item langka.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-pink-400 font-bold">•</span>
                          <span><strong className="text-foreground">Skin Spesial Hero:</strong> Buka skin spesial (Miya Suzuhime) &amp; Efek Recall unik.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-pink-400 font-bold">•</span>
                          <span>Hadiah mingguan bonus seiring progres Level akunmu.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Rincian Harga & Direct API Moonton",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>3 s/d 4.830 Diamonds berkisar dari <strong className="text-foreground">Rp 1.171 s/d Rp 1.140.000</strong>:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> WDP: Rp 27.550 | Twilight: Rp 150.000
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> 100% Direct API Moonton (Tanpa Password)
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'genshin-impact' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Temukan UID & Server Game",
                  content: (
                    <>
                      <p>Top up Genesis Crystals &amp; Chronal Nexus diproses via <strong className="text-foreground">UID &amp; Server HoYoverse</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka Genshin Impact ➔ Buka Menu Paimon (pojok kiri atas).</li>
                        <li>Salin <strong>UID 9-digit</strong> di bawah Avatar profil / sudut kanan bawah layar.</li>
                        <li>Pilih Server (<strong className="text-foreground">Asia, America, Europe, TW/HK/MO</strong>) di form atas.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Crystals dikirim otomatis ke inbox in-game!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Bonus 2X Double Genesis Crystals",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Jika akunmu belum pernah top up tier nominal tertentu, kamu mendapatkan <strong className="text-emerald-400">Bonus 2X Lipat</strong>:</p>
                      <ul className="space-y-1 text-[11px]">
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>60 Crystals</span>
                          <strong className="text-emerald-400">Bonus +120</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>300+30 Crystals</span>
                          <strong className="text-emerald-400">Bonus +600</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>980+110 Crystals</span>
                          <strong className="text-emerald-400">Bonus +1.960</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>1.980+260 Crystals</span>
                          <strong className="text-emerald-400">Bonus +3.960</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>6.480+1.600 Crystals</span>
                          <strong className="text-emerald-400 font-bold">Bonus +12.960!</strong>
                        </li>
                      </ul>
                      <p className="text-[10px] italic pt-1 border-t border-border/20">
                        💡 Termasuk bonus Chronal Nexus (+30 s/d +1.600 ekstra).
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Blessing of the Welkin Moon & Rules",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Mendapatkan <strong className="text-foreground">300 Genesis Crystals instan</strong> + <strong className="text-primary">90 Primogems harian</strong> selama 30 hari (Total 3.000 Primogems):</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Durasi diperpanjang jika sisa durasi saat ini ≤ 180 hari.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Primogems harian wajib klaim via login (tidak hangus bertumpuk).</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Adventure Rank (AR) min. Level 5 untuk melihat counter sisa hari.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "100% Legal Multi-Platform Partner",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Pengisian diproses langsung melalui API Partner Resmi HoYoverse (Mihoyo):</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Android, iOS, PC &amp; PSN Supported
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Akses Password / Email
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Garansi 100% Anti-Minus Crystals
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'honkai-star-rail' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Top Up & Kirim Gift ke Teman",
                  content: (
                    <>
                      <p>Isi ulang Oneiric Shards untuk akun sendiri atau kirim sebagai <strong className="text-foreground">Hadiah ke Teman / Kerabat</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka HSR ➔ Masuk Menu Ponsel / Profil (pojok kiri atas).</li>
                        <li>Salin <strong>UID 9-digit</strong> akunmu (atau UID temanmu).</li>
                        <li>Pilih Server (<strong className="text-foreground">Asia, America, Europe, TW/HK/MO</strong>).</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Shards langsung dikirim instan!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Bonus 2X Double Oneiric Shards",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Top-up pertama per nominal mendapatkan <strong className="text-emerald-400">Bonus 2X Lipat Shards</strong>:</p>
                      <ul className="space-y-1 text-[11px]">
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>60 Shards (Rp 14.414)</span>
                          <strong className="text-emerald-400">Bonus +120</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>330 Shards (Rp 71.171)</span>
                          <strong className="text-emerald-400">Bonus +600</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>1.090 Shards (Rp 224.324)</span>
                          <strong className="text-emerald-400">Bonus +1.960</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>2.240 Shards (Rp 431.532)</span>
                          <strong className="text-emerald-400">Bonus +3.960</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>8.080 Shards (Rp 1.440.541)</span>
                          <strong className="text-emerald-400 font-bold">Bonus +12.960!</strong>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Express Supply Pass (Rp 71.171)",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Mendapatkan <strong className="text-foreground">300 Oneiric Shards instan</strong> + <strong className="text-primary">90 Stellar Jades harian</strong> selama 30 hari (Total 3.000 Stellar Jades):</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span>Bisa dikirimkan langsung sebagai kado Pass ke teman/kerabat.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span>Durasi hanya dapat ditambah jika sisa durasi saat ini ≤ 180 hari.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Rincian Harga & Garansi Official",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Top up resmi dari Rp 14.414 s/d Rp 1.440.541 via API Server Resmi HoYoverse:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Login / Password Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Garansi Bebas Risiko Banned 100%
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Cash-Points Loyalty NexaPay
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'zenless-zone-zero' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Top Up ZZZ Monochromes",
                  content: (
                    <>
                      <p>Isi ulang Monochromes instan menggunakan <strong className="text-foreground">UID &amp; Server ZZZ</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka game ZZZ ➔ Masuk menu Pause/Profil ➔ Salin <strong className="text-foreground">UID 9-digit</strong>.</li>
                        <li>Masukkan UID &amp; pilih Server (<strong className="text-foreground">Asia, America, Europe, TW/HK/MO</strong>).</li>
                        <li>Pilih nominal Monochromes / Inter-Knot Membership &amp; bayar.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Monochromes langsung masuk instan!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Bonus 2X Double Monochromes",
                  iconBg: "bg-amber-500/15 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Pembelian pertama per nominal mendapatkan <strong className="text-emerald-400">Bonus 2X Lipat Monochromes</strong>:</p>
                      <ul className="space-y-1 text-[11px]">
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>60 Monochromes (Rp 14.414)</span>
                          <strong className="text-emerald-400">Bonus +60</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>300 Monochromes (Rp 71.171)</span>
                          <strong className="text-emerald-400">Bonus +300</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>980 Monochromes (Rp 224.324)</span>
                          <strong className="text-emerald-400">Bonus +980</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>1.980 Monochromes (Rp 431.532)</span>
                          <strong className="text-emerald-400">Bonus +1.980</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>3.280 Monochromes (Rp 719.820)</span>
                          <strong className="text-emerald-400">Bonus +3.280</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>6.480 Monochromes (Rp 1.440.541)</span>
                          <strong className="text-emerald-400 font-bold">Bonus +6.480!</strong>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Keanggotaan Inter-Knot (Rp 71.171)",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Dapatkan total <strong className="text-primary font-bold">3.000 Monochromes</strong> selama 30 hari:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">300 Monochromes instan</strong> langsung setelah pembelian.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">90 Monochromes harian</strong> saat login setiap jam 04:00 server.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Batas perpanjangan durasi sisa <code className="text-purple-300">≤ 179 hari</code>.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Official Direct Server HoYoverse",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Support PS5, PC, App Store, Google Play, &amp; Epic Games Store:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Login / Password Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Garansi Bebas Risiko Banned 100%
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Cash-Points Loyalty NexaPay
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'valorant' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Beli & Kirim VP VALORANT",
                  content: (
                    <>
                      <p>Isi ulang VALORANT Points (VP) instan menggunakan <strong className="text-foreground">Riot ID &amp; Tagline</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka VALORANT ➔ Salin <strong className="text-foreground">Riot ID + Tagline</strong> di profil (Contoh: <code className="text-primary">PlayerName#ID1</code>).</li>
                        <li>Masukkan Riot ID pada form NexaPay di atas (atau Riot ID teman untuk kirim gift).</li>
                        <li>Pilih paket VP yang kamu inginkan &amp; tuntaskan pembayaran.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> VP otomatis masuk ke akun VALORANT-mu!
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Cara Upgrade Battle Pass (1.000 VP)",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Unlock Battle Pass Premium seharga <strong className="text-primary font-bold">1.000 VP (Rp 112.000)</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Beli paket <strong className="text-foreground">1.000 VP</strong> di NexaPay.</li>
                        <li>Buka game VALORANT ➔ klik menu <strong className="text-foreground">&quot;Battle Pass&quot;</strong> di pojok kiri atas.</li>
                        <li>Di pojok kanan bawah, klik <strong className="text-purple-300 font-bold">&quot;Upgrade Battle Pass&quot;</strong> seharga 1.000 VP.</li>
                      </ol>
                      <p className="text-[10px] italic pt-1 border-t border-border/20">
                        🎉 Buka Skin Senjata, Gun Buddies, Cards, &amp; Radianite Points!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Store Rotation & Night Market",
                  iconBg: "bg-rose-500/15 text-rose-400",
                  borderGlow: "border-rose-500/30 hover:border-rose-500/50",
                  content: (
                    <>
                      <p>Gunakan VP untuk belanja skin Senjata impian:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>Beli skin Vandal/Phantom legendaris (Kuronami, Prime, Reaver, Sovereign, Elderflame) di rotasi Store harian.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>Dapatkan diskon super miring untuk skin incaranmu saat acara <strong className="text-foreground">VALORANT Night Market</strong> tiba!</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Garansi Direct API Riot Games",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>475 s/d 11.000 VP berkisar dari <strong className="text-foreground">Rp 56.000 s/d Rp 1.120.000</strong>:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> 100% Direct API Resmi Riot Games
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Butuh Password / Login Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'steam-wallet' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Beli Steam Wallet Code",
                  content: (
                    <>
                      <p>Beli voucher Steam Wallet IDR resmi instan via NexaPay:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Pilih nominal Steam Wallet Code yang kamu inginkan.</li>
                        <li>Masukkan alamat email &amp; nomor WA aktif untuk pengiriman kode.</li>
                        <li>Tinjau pesanan &amp; selesaikan pembayaran. Kode voucher langsung dikirim!</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Kode voucher muncul di layar &amp; email instan!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Cara Redeem di Steam App & Web",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Panduan memasukkan kode voucher 15-16 digit:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Via Aplikasi Steam Client PC:</strong> Login ➔ klik nama profil di pojok kanan atas ➔ pilih <strong className="text-foreground">View My Wallet</strong> ➔ klik <strong className="text-sky-400">Redeem a Steam Gift Card or Wallet Code</strong>.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Via Browser:</strong> Kunjungi <code className="text-sky-300 break-all font-mono text-[10px]">store.steampowered.com/account/redeemwalletcode</code>.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Gem,
                  title: "Beli Game PC & Item Community Market",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Gunakan saldo IDR Steam Wallet tanpa kartu kredit:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Beli Game AAA/Indie terbaru di Steam Store saat disensor diskon Steam Summer/Winter Sales.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Beli item in-game, Skin CS2, Inscribed Arcana Dota 2, TF2 Keys, &amp; Battle Pass di <strong className="text-foreground">Steam Community Market</strong>.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Garansi Official Voucher Valve",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Tersedia dari nominal <strong className="text-foreground">IDR 12.000 s/d IDR 600.000</strong>:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> 100% Kode Voucher Resmi Valve Corp
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Butuh Password / Login Steam
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'roblox' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Beli & Redeem Gift Card",
                  content: (
                    <>
                      <p>Kode PIN voucher dikirimkan langsung via <strong className="text-foreground">Email &amp; WhatsApp</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Beli voucher Roblox Gift Card di NexaPay &amp; bayar.</li>
                        <li>Buka browser, login akunmu di <strong className="text-primary">roblox.com/redeem</strong>.</li>
                        <li>Tempel kode PIN voucher yang kamu terima, lalu klik <strong className="text-foreground">Redeem</strong>. Saldo otomatis masuk ke Roblox Balance!</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Kode voucher dikirim instan 24 jam!
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Cara Aktivasi Roblox Premium",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Langganan Roblox Premium menggunakan saldo Roblox Balance:</p>
                      <ul className="space-y-1 text-[11px]">
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>USD $4.99</span>
                          <strong className="text-purple-300">Premium 450 Robux / bln</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>USD $9.99</span>
                          <strong className="text-purple-300">Premium 1000 Robux / bln</strong>
                        </li>
                        <li className="flex items-center justify-between py-0.5 border-b border-border/20">
                          <span>USD $19.99</span>
                          <strong className="text-purple-300">Premium 2200 Robux / bln</strong>
                        </li>
                      </ul>
                      <p className="text-[10px] pt-1">
                        💡 Buka <strong className="text-foreground">roblox.com/premium</strong> ➔ pilih paket ➔ gunakan Roblox Balance sebagai metode bayar.
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Item Virtual GRATIS Setiap Redeem",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Bonus eksklusif spesial dari Roblox Corporation:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>Setiap kali menukarkan kode Gift Card di <strong className="text-foreground">roblox.com/redeem</strong>, kamu otomatis menerima <strong className="text-emerald-400 font-bold">Exclusive Virtual Item GRATIS</strong>!</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>Item virtual eksklusif langsung dikirimkan ke Inventory Avatar akun Roblox-mu secara otomatis.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Gem,
                  title: "Penggunaan Saldo Gift Card",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Roblox Gift Card memberikan fleksibilitas penuh untuk akunmu:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Membeli Robux:</strong> Untuk avatar outfit, skin, aksesoris, emote, &amp; animasi avatar.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Game Pass Eksklusif:</strong> Beli VIP Pass di Blox Fruits, Adopt Me, Brookhaven, Tower of Hell, dll.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-sky-400 font-bold">•</span>
                          <span><strong className="text-foreground">Trading Item:</strong> Buka akses perdagangan item langka antar pemain.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Voucher Resmi Roblox Corp",
                  iconBg: "bg-amber-500/15 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Nominal tersedia dari <strong className="text-foreground">Rp 50.000 s/d Rp 500.000</strong>:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> 100% Kode Voucher Valid &amp; Resmi
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Membutuhkan Password Roblox
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'pubg-mobile' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Temukan Character ID PUBG",
                  content: (
                    <>
                      <p>Isi ulang UC instan menggunakan <strong className="text-foreground">Player ID (Character ID)</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka PUBG Mobile ➔ Masuk ke profil akun (ketuk foto avatar di pojok kiri atas).</li>
                        <li>Salin <strong>Character ID 5-12 digit</strong> di bawah nama profilmu.</li>
                        <li>Masukkan ID di form NexaPay di atas, pilih paket UC &amp; tuntaskan pembayaran.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> UC otomatis dikirim via Midasbuy Direct API!
                      </p>
                    </>
                  )
                },
                {
                  icon: Sparkles,
                  title: "Royale Pass & Skema Bonus UC",
                  iconBg: "bg-amber-500/15 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Top-up UC dengan tambahan bonus ekstra permanen:</p>
                      <ul className="space-y-1 text-[11px] border-b border-border/20 pb-2">
                        <li className="flex items-center justify-between">
                          <span>300 UC (Rp 81.000)</span>
                          <strong className="text-emerald-400">Bonus +25 UC (Total 325)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>600 UC (Rp 162.000)</span>
                          <strong className="text-emerald-400">Bonus +60 UC (Total 660)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>1.500 UC (Rp 405.000)</span>
                          <strong className="text-emerald-400">Bonus +300 UC (Total 1.800)</strong>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>6.000 UC (Rp 1.620.000)</span>
                          <strong className="text-emerald-400 font-bold">Bonus +2.100 UC (Total 8.100)!</strong>
                        </li>
                      </ul>
                      <p className="text-[10px] pt-1">
                        💡 Royale Pass Upgrade: Cukup beli <strong className="text-foreground">325 UC</strong> (Elite) atau <strong className="text-foreground">660 UC</strong> (Elite Plus).
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Gacha Crate & X-Suit Upgrade",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Gunakan saldo UC dari NexaPay untuk membuka konten eksklusif in-game:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Unlock &amp; upgrade Baju Armor legendaris <strong className="text-foreground">X-Suit Series</strong>.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Putar gacha <strong className="text-foreground">Mythic Forge Draw</strong> &amp; Lucky Spin Skin Senjata Upgrade.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>Membuka Custom Crate, Premium Crate, &amp; Emote Mitos terbatas.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Direct API Official Midasbuy Partner",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>60 s/d 8.100 UC berkisar dari <strong className="text-foreground">Rp 16.000 s/d Rp 1.620.000</strong>:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Direct Server Midasbuy &amp; Tencent Cloud
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Password / Email Akun Game
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'wild-rift' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Top Up Wild Cores",
                  content: (
                    <>
                      <p>Isi ulang Wild Cores instan menggunakan <strong className="text-foreground">Riot ID &amp; Tagline</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka LoL: Wild Rift ➔ Salin <strong className="text-foreground">Riot ID + Tagline</strong> di profil (Contoh: <code className="text-primary">WildRiftHero#SEA</code>).</li>
                        <li>Masukkan Riot ID pada form NexaPay di atas.</li>
                        <li>Pilih paket Wild Cores / Bundle &amp; tuntaskan pembayaran.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Wild Cores langsung masuk secara real-time!
                      </p>
                    </>
                  )
                },
                {
                  icon: Heart,
                  title: "Kirim Gift & Wishlist Teman",
                  iconBg: "bg-rose-500/15 text-rose-400",
                  borderGlow: "border-rose-500/30 hover:border-rose-500/50",
                  content: (
                    <>
                      <p>Gunakan saldo Wild Cores dari NexaPay untuk memberikan kado skin / champion ke sahabatmu:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-rose-400 font-bold">•</span>
                          <span><strong className="text-foreground">In-Game Gifting:</strong> Pilih item di Store ➔ ketuk <strong className="text-foreground">Purchase</strong> ➔ pilih ikon <strong className="text-rose-400">Gift</strong> di sebelah kiri &amp; sertakan pesan manis.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-rose-400 font-bold">•</span>
                          <span><strong className="text-foreground">Wishlist Profil:</strong> Kunjungi laman profil teman ➔ ketuk ikon <strong className="text-rose-400 font-bold">Love (❤️)</strong> di sebelah kanan.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Gem,
                  title: "Fungsi Wild Cores & Bundles",
                  iconBg: "bg-cyan-500/15 text-cyan-400",
                  borderGlow: "border-cyan-500/30 hover:border-cyan-500/50",
                  content: (
                    <>
                      <p>Wild Core adalah mata uang premium resmi League of Legends: Wild Rift:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>Membuka Champion baru, Skin Legendary/Supreme, Aksesoris Pintu Keluar, Emote &amp; Wild Pass.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>Tersedia paket khusus <strong className="text-foreground">Stellacorn's Gift</strong> (Rp 56.000) &amp; <strong className="text-foreground">Celestial Blessing</strong> (Rp 395.000).</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Garansi Direct Server Riot Games",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Top up terhubung langsung ke API Server Resmi Riot Games SEA:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Login / Password Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Jaminan Safe Account 100%
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'arena-of-valor' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 tablet:grid-cols-3"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Temukan Player ID & Top Up Vouchers",
                  content: (
                    <>
                      <p>Isi ulang Vouchers Arena of Valor (AOV) resmi instan hanya butuh <strong className="text-foreground">Player ID Akun Garena</strong>:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka game AOV ➔ Ketuk ikon <strong className="text-foreground">Pengaturan (Settings)</strong> ➔ scroll ke bawah pilih menu <strong className="text-foreground">Umum</strong> ➔ salin <strong className="text-foreground">Player ID</strong>.</li>
                        <li>Masukkan Player ID pada kolom form NexaPay di atas.</li>
                        <li>Pilih nominal Voucher AOV favoritmu &amp; tuntaskan pembayaran.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Vouchers otomatis masuk ke dompet in-game AOV secara real-time!
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Valor Pass & Skin Mirage Draw",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Gunakan Vouchers AOV dari NexaPay untuk membuka konten eksklusif terbaru:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Valor Pass Normal:</strong> Cukup pilih paket <strong className="text-primary">230 Vouchers</strong> (Rp 45.045) untuk unlock pass level 1.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Valor Pass Elite:</strong> Pilih paket <strong className="text-primary">470 Vouchers</strong> (Rp 90.090) untuk unlock 15 Level instan + skin eksklusif.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Dimensional Draw:</strong> Kumpulkan Vouchers untuk gacha skin Dimensional Breaker SS &amp; Supreme Hero.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Garansi Server Garena 100% Legal",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Sistem top-up NexaPay terhubung langsung ke Server Garena AOV Indonesia secara otomatis:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Perlu Login / Password Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Bebas Risiko Banned / Safe Account
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Dapat 0.5% Nexa Loyalty Cash-Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'call-of-duty-mobile' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 tablet:grid-cols-3"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Temukan OpenID & Top Up CP",
                  content: (
                    <>
                      <p>Top up CP CODM diproses langsung menggunakan <strong className="text-foreground">OpenID Akun Garena</strong> kamu:</p>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Buka game CODM ➔ Masuk ke <strong className="text-foreground">Pengaturan (Settings)</strong> ➔ pilih tab <strong className="text-foreground">Lainnya (Legal &amp; Privacy)</strong>.</li>
                        <li>Salin <strong>OpenID</strong> unik milikmu.</li>
                        <li>Tempelkan OpenID di form NexaPay di atas, pilih paket CP, &amp; bayar.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> CP akan langsung dikirimkan ke akunmu dalam hitungan detik!
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Panduan Battle Pass & Mythic Draw",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Dapatkan konten eksklusif CODM musim ini dengan saldo CP dari NexaPay:</p>
                      <ul className="space-y-1.5 text-[11px]">
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Battle Pass Standard:</strong> Cukup top-up <strong className="text-primary">220 CP</strong> untuk klaim skin Karakter &amp; Senjata Epic.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Battle Pass Bundle:</strong> Top-up <strong className="text-primary">520 CP</strong> untuk melompati 12 Level BP instan + bonus frame unik.</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-purple-400 font-bold">•</span>
                          <span><strong className="text-foreground">Mythic Armory:</strong> Saldo CP langsung dapat dipakai putar Lucky Draw di Armory resmi game.</span>
                        </li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "100% Garansi Legal Server Garena",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Seluruh transaksi Call of Duty: Mobile terintegrasi langsung dengan API Server Resmi Garena Indonesia:</p>
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Tanpa Password / Login Akun
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Jaminan Bebas Risiko Banned 100%
                        </li>
                        <li className="flex items-center gap-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Otomatis Tambah Nexa Loyalty Points
                        </li>
                      </ul>
                    </>
                  )
                }
              ]}
            />
          ) : game.slug === 'free-fire-max' ? (
            <FaqAccordionSection
              gridCols="grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3"
              items={[
                {
                  icon: HelpCircle,
                  title: "Cara Top Up FF MAX?",
                  content: (
                    <>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Masukkan <strong className="text-foreground">Player ID Free Fire MAX-mu</strong>.</li>
                        <li>Masukkan jumlah <strong className="text-primary">Diamond</strong> yang Kamu inginkan.</li>
                        <li>Pilih cara pembayaran yang Kamu inginkan.</li>
                        <li>Klik tombol <strong className="text-foreground">&quot;Beli Sekarang&quot;</strong> untuk menyelesaikan transaksi.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Diamond akan langsung ditambahkan ke akun Free Fire MAX secara instan!
                      </p>
                    </>
                  )
                },
                {
                  icon: Star,
                  title: "Cara Membeli Booyah Pass di FF MAX?",
                  iconBg: "bg-purple-500/15 text-purple-400",
                  borderGlow: "border-purple-500/30 hover:border-purple-500/50",
                  content: (
                    <>
                      <p>Isi ulang <strong className="text-primary">399 Diamond</strong> untuk Premium, dan <strong className="text-primary">899 Diamond</strong> untuk Premium Plus:</p>
                      <ol className="space-y-1 list-decimal list-inside text-[11px]">
                        <li>Beli Diamond di Free Fire MAX via NexaPay.</li>
                        <li>Begitu memiliki cukup Diamond, buka aplikasi Free Fire MAX.</li>
                        <li>Pada bagian bawah kiri layar utama, klik <strong>&quot;Booyah Pass&quot;</strong>.</li>
                        <li>Klik tombol <strong>&quot;Upgrade&quot;</strong> dan beli Premium (399 Diamond) atau Premium Plus (899 Diamond).</li>
                      </ol>
                    </>
                  )
                },
                {
                  icon: Tag,
                  title: "Diamonds Free Fire MAX Harga di Indonesia",
                  iconBg: "bg-amber-500/10 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Diamonds sebanyak 5 hingga 73.100 memiliki kisaran harga terjangkau dari Rp 901 hingga Rp 9.009.009 di NexaPay:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {game.denominations.slice(0, 5).map((d: Denomination) => (
                          <div key={d.id} className="flex items-center justify-between py-0.5 border-b border-border/30 last:border-0 text-[11px]">
                            <span className="font-semibold text-foreground">{d.label}</span>
                            <span className="font-mono text-primary font-bold">{formatCurrency(d.isFlashSale && d.flashSalePrice ? d.flashSalePrice : d.price)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Akun & Item FF di FF MAX?",
                  iconBg: "bg-emerald-500/15 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>Berkat teknologi <strong className="text-emerald-400">Firelink</strong>, Anda dapat masuk ke Free Fire MAX menggunakan akun Free Fire yang sudah ada dan mengakses semua progres Anda.</p>
                      <p className="pt-1 border-t border-border/30">
                        💡 Mode permainan dapat dimainkan lintas platform (cross-play).
                      </p>
                    </>
                  )
                },
                {
                  icon: Gamepad2,
                  title: "Perbedaan FF MAX dengan Free Fire?",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Free Fire MAX menawarkan grafis HD, animasi efek ultra, serta gameplay yang ditingkatkan dibandingkan dengan Free Fire asli.</p>
                    </>
                  )
                }
              ]}
            />
          ) : (
            <FaqAccordionSection
              gridCols="grid-cols-1 tablet:grid-cols-2 lg:grid-cols-4"
              items={[
                {
                  icon: HelpCircle,
                  title: `Cara Top Up ${game.name}?`,
                  content: (
                    <>
                      <ol className="space-y-1.5 list-decimal list-inside text-[11px]">
                        <li>Masukkan <strong className="text-foreground">User ID {game.name}</strong> kamu dengan benar.</li>
                        <li>Pilih nominal <strong className="text-primary">{currencyLabel}</strong> yang ingin dibeli.</li>
                        <li>Pilih metode pembayaran favorit (QRIS, E-Wallet, atau Virtual Account).</li>
                        <li>Klik tombol <strong className="text-foreground">Beli Sekarang</strong> &amp; selesaikan pembayaran.</li>
                      </ol>
                      <p className="pt-2 border-t border-border/30 flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Item akan masuk ke akun game kamu secara instan!
                      </p>
                    </>
                  )
                },
                {
                  icon: ShieldCheck,
                  title: "Keamanan & Garansi Transaksi",
                  iconBg: "bg-sky-500/15 text-sky-400",
                  borderGlow: "border-sky-500/30 hover:border-sky-500/50",
                  content: (
                    <>
                      <p>Seluruh transaksi {game.name} diproses 100% legal melalui server partner resmi. Saldo game Anda dijamin aman tanpa risiko banned.</p>
                    </>
                  )
                },
                {
                  icon: CreditCard,
                  title: "Metode Pembayaran Apa Saja?",
                  iconBg: "bg-emerald-500/10 text-emerald-400",
                  borderGlow: "border-emerald-500/30 hover:border-emerald-500/50",
                  content: (
                    <>
                      <p>NexaPay mendukung seluruh saluran pembayaran utama di Indonesia tanpa biaya tersembunyi:</p>
                      <ul className="space-y-1.5 list-disc list-inside text-[11px]">
                        <li><strong>QRIS Instant:</strong> BCA, Mandiri, BRI, BNI, Dana, OVO, ShopeePay.</li>
                        <li><strong>Virtual Account:</strong> VA BCA, Mandiri, BRI, BNI, Permata, CIMB.</li>
                        <li><strong>E-Wallet:</strong> GoPay, ShopeePay, Dana, OVO.</li>
                      </ul>
                    </>
                  )
                },
                {
                  icon: Tag,
                  title: `Daftar Harga ${currencyLabel} ${game.name}`,
                  iconBg: "bg-amber-500/10 text-amber-400",
                  borderGlow: "border-amber-500/30 hover:border-amber-500/50",
                  content: (
                    <>
                      <p>Berikut sampel harga pilihan di NexaPay:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {game.denominations.slice(0, 5).map((d: Denomination) => (
                          <div key={d.id} className="flex items-center justify-between py-0.5 border-b border-border/30 last:border-0 text-[11px]">
                            <span className="font-semibold text-foreground">{d.label}</span>
                            <span className="font-mono text-primary font-bold">{formatCurrency(d.isFlashSale && d.flashSalePrice ? d.flashSalePrice : d.price)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                }
              ]}
            />
          )}
        </div>

        {/* Global Modern Footer */}
        <Footer />

      {/* Option A: Floating Dynamic Island Capsule Dock (Mobile phones only: < 768px - z-40) */}
      <div 
        className="fixed bottom-3 inset-x-2.5 sm:inset-x-4 z-40 md:hidden max-w-md mx-auto pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="pointer-events-auto w-full py-2 px-3.5 sm:py-2.5 sm:px-4 rounded-full border border-white/20 bg-slate-900/90 dark:bg-black/90 backdrop-blur-2xl flex items-center justify-between gap-2.5 sm:gap-3 h-12 sm:h-13 shadow-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate leading-tight">
              {denom ? denom.label : 'Pilih Item'}
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
              ) : !userId && !isVoucherProduct ? (
                <><User className="w-3.5 h-3.5" /> 1. Isi Akun</>
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
