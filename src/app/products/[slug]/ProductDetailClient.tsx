'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, ShieldCheck, Loader2, Zap, ShoppingBag, ShoppingCart, Phone } from 'lucide-react';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { PAYMENT_METHODS, CATEGORIES } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/globalStore';

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();

  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);
  const [accountInput, setAccountInput] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { addItem } = useCartStore();
  const { addNotification } = useNotificationStore();

  const denom = product.denominations.find((d: any) => d.id === selectedDenom);
  const payment = PAYMENT_METHODS.find((p) => p.id === selectedPayment);
  const fee = payment?.fee || 0;
  const total = (denom?.price || 0) + fee;
  const catInfo = CATEGORIES.find((c) => c.id === product.category);

  const needsPhone = ['PULSA', 'PAKET_DATA', 'EWALLET_TOPUP'].includes(product.category);
  const needsAccount = product.category === 'PLN';
  const inputLabel = needsPhone ? 'Nomor HP' : needsAccount ? 'Nomor Meter/ID Pelanggan' : 'Email';
  const inputPlaceholder = needsPhone ? '08xxxxxxxxxx' : needsAccount ? 'Masukkan nomor meter' : 'email@contoh.com';

  const paymentsByCategory = PAYMENT_METHODS.reduce((acc, pm) => {
    if (!acc[pm.category]) acc[pm.category] = [];
    acc[pm.category].push(pm);
    return acc;
  }, {} as Record<string, typeof PAYMENT_METHODS[number][]>);

  const handleCheckout = async () => {
    if (!selectedDenom || !accountInput || !selectedPayment) {
      toast.error('Lengkapi semua data');
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal melakukan checkout');
      }

      toast.success('Pesanan berhasil dibuat!');
      router.push(`/payment-status/${data.transactionId}`);
    } catch (error: any) {
      toast.error('Terjadi kesalahan', { description: error.message });
      setIsProcessing(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedDenom || !accountInput) {
      toast.error('Lengkapi Nominal dan Data Akun');
      return;
    }
    if (!denom) return;
    
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: '',
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
  };

  return (
    <>
      <main className="min-h-screen pt-24 tablet:pt-32 pb-24 aurora-bg">
        <div className="container-app max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.push('/products')} className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 tablet:w-12 tablet:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', catInfo?.color || 'from-primary to-accent')}>
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base tablet:text-lg font-bold">{product.name}</h1>
                <p className="text-xs text-muted-foreground">{product.publisher} • {catInfo?.label}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Select Denomination */}
              <div className="glass-card p-4 tablet:p-6">
                <h2 className="text-base font-semibold mb-1">1. Pilih Nominal</h2>
                <p className="text-xs text-muted-foreground mb-4">Pilih nominal yang ingin kamu beli</p>
                <div className="grid grid-cols-2 tablet:grid-cols-3 gap-2 tablet:gap-3">
                  {product.denominations.filter((d: any) => d.isActive).map((d: any) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDenom(d.id)}
                      className={cn(
                        'relative p-3 tablet:p-4 rounded-xl border text-left transition-all',
                        selectedDenom === d.id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                          : 'border-border hover:border-primary/30 hover:bg-muted/30'
                      )}
                    >
                      {d.isPopular && (
                        <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-orange-500 text-white text-[8px] font-bold">Popular</span>
                      )}
                      <p className="text-xs tablet:text-sm font-semibold">{d.label}</p>
                      <p className="text-sm tablet:text-base font-bold text-primary mt-1">{formatCurrency(d.price)}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[9px] font-bold">
                        <span>🪙 +{Math.floor(d.price / 200).toLocaleString('id-ID')} Nexa Points</span>
                      </div>
                      {selectedDenom === d.id && (
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Account Input */}
              <div className="glass-card p-4 tablet:p-6">
                <h2 className="text-base font-semibold mb-1">2. {inputLabel}</h2>
                <p className="text-xs text-muted-foreground mb-4">Masukkan {inputLabel.toLowerCase()} tujuan</p>
                <div className="relative">
                  {needsPhone && <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />}
                  <input
                    type={needsPhone ? 'tel' : 'text'}
                    value={accountInput}
                    onChange={(e) => setAccountInput(e.target.value)}
                    placeholder={inputPlaceholder}
                    className={cn(
                      'w-full pr-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all',
                      needsPhone ? 'pl-10' : 'pl-4'
                    )}
                  />
                </div>
              </div>

              {/* Step 3: Payment */}
              <div className="glass-card p-4 tablet:p-6">
                <h2 className="text-base font-semibold mb-1">3. Metode Pembayaran</h2>
                <p className="text-xs text-muted-foreground mb-4">Pilih cara pembayaran</p>
                <div className="space-y-4">
                  {Object.entries(paymentsByCategory).slice(0, 4).map(([category, methods]) => (
                    <div key={category}>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{category}</h3>
                      <div className="space-y-1.5">
                        {methods.map((pm) => (
                          <button
                            key={pm.id}
                            onClick={() => setSelectedPayment(pm.id)}
                            className={cn(
                              'w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                              selectedPayment === pm.id ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border hover:border-primary/30'
                            )}
                          >
                            <div className="w-10 h-6 relative flex-shrink-0">
                              <Image 
                                src={pm.icon} 
                                alt={pm.name} 
                                fill 
                                className="object-contain" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{pm.name}</p>
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {pm.fee > 0 ? `+${formatCurrency(pm.fee)}` : 'Gratis'}
                            </span>
                            {selectedPayment === pm.id && (
                              <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="hidden lg:block">
              <div className="sticky top-24 glass-card p-5 space-y-4">
                <h3 className="text-sm font-semibold">Ringkasan</h3>
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', catInfo?.color || 'from-primary to-accent')}>
                    <ShoppingBag className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{catInfo?.label}</p>
                  </div>
                </div>

                {denom && <div className="p-3 rounded-lg bg-muted/30"><p className="text-xs text-muted-foreground">Nominal</p><p className="text-sm font-medium">{denom.label}</p></div>}
                {accountInput && <div className="p-3 rounded-lg bg-muted/30"><p className="text-xs text-muted-foreground">{inputLabel}</p><p className="text-sm font-medium">{accountInput}</p></div>}
                {payment && <div className="p-3 rounded-lg bg-muted/30"><p className="text-xs text-muted-foreground">Pembayaran</p><p className="text-sm font-medium">{payment.name}</p></div>}

                <div className="border-t border-border pt-3 space-y-1.5">
                  {denom && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Harga</span><span>{formatCurrency(denom.price)}</span></div>}
                  {fee > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Admin</span><span>{formatCurrency(fee)}</span></div>}
                  {denom && <div className="flex justify-between text-base font-bold pt-2 border-t border-border"><span>Total</span><span className="gradient-text">{formatCurrency(total)}</span></div>}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleCheckout}
                    disabled={!selectedDenom || !accountInput || !selectedPayment || isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-primary text-white font-semibold disabled:opacity-50 hover:shadow-neon-violet transition-all"
                  >
                    {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : <><Zap className="w-4 h-4" /> Bayar {denom ? formatCurrency(total) : ''}</>}
                  </button>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedDenom || !accountInput || isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-card border border-primary/50 text-primary font-bold hover:bg-primary/10 disabled:opacity-50 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" /> Tambah ke Keranjang
                  </button>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 text-green-500 text-xs">
                  <Zap className="w-3.5 h-3.5" /> Proses instan
                </div>
              </div>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="fixed bottom-16 left-0 right-0 p-4 glass border-t border-border lg:hidden z-30">
            <div className="flex items-center justify-between gap-3">
              {denom && <div><p className="text-xs text-muted-foreground">Total</p><p className="text-lg font-bold gradient-text">{formatCurrency(total)}</p></div>}
              
              <div className="flex items-center gap-2 flex-1 max-w-[220px]">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedDenom || !accountInput || isProcessing}
                  className="flex items-center justify-center p-3 rounded-xl bg-card border border-primary/50 text-primary disabled:opacity-50 hover:bg-primary/10 transition-all"
                  aria-label="Tambah ke keranjang"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={!selectedDenom || !accountInput || !selectedPayment || isProcessing}
                  className="flex-1 max-w-[200px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-primary text-white font-semibold text-sm disabled:opacity-50 transition-all"
                >
                  {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Proses...</> : 'Bayar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
