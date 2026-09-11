'use client';

import Image from 'next/image';
import { CreditCard, Shield, Zap } from 'lucide-react';

const partners = [
  { name: 'QRIS', icon: '/images/payments/qris.svg', badge: 'INSTANT' },
  { name: 'GoPay', icon: '/images/payments/gopay.svg', badge: 'E-WALLET' },
  { name: 'OVO', icon: '/images/payments/ovo.svg', badge: 'E-WALLET' },
  { name: 'DANA', icon: '/images/payments/dana.svg', badge: 'E-WALLET' },
  { name: 'ShopeePay', icon: '/images/payments/shopeepay.svg', badge: 'E-WALLET' },
  { name: 'BCA', icon: '/images/payments/bca.svg', badge: 'VIRTUAL ACCOUNT' },
  { name: 'BNI', icon: '/images/payments/bni.svg', badge: 'VIRTUAL ACCOUNT' },
  { name: 'BRI', icon: '/images/payments/bri.svg', badge: 'VIRTUAL ACCOUNT' },
  { name: 'Mandiri', icon: '/images/payments/mandiri.svg', badge: 'VIRTUAL ACCOUNT' },
  { name: 'Alfamart', icon: '/images/payments/alfamart.svg', badge: 'GERAI RETAIL' },
  { name: 'Indomaret', icon: '/images/payments/indomaret.svg', badge: 'GERAI RETAIL' },
];

const duplicatedPartners = [...partners, ...partners];

export default function PaymentPartners() {
  return (
    <section className="py-10 tablet:py-16 relative overflow-hidden">
      <div className="container-app relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161D2C] border border-[#FF7300]/40 text-[#FF851A] text-xs font-extrabold uppercase tracking-wider mb-3 shadow-sm">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Kanal Pembayaran Resmi</span>
          </div>
          <h2 className="heading-section">Metode Pembayaran Terlengkap</h2>
          <p className="body-base mt-1 text-slate-400 max-w-lg mx-auto">
            Transaksi aman dan nyaman dengan berbagai pilihan pembayaran digital terverifikasi di Indonesia.
          </p>
        </div>

        {/* Honest Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>ENKRIPSI SSL 256-BIT</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7300]/10 border border-[#FF7300]/25 text-[#FF7300] text-xs font-bold shadow-sm">
            <Zap className="w-3.5 h-3.5" />
            <span>VERIFIKASI SISTEM INSTAN</span>
          </div>
        </div>
      </div>

      {/* Infinite Running Marquee */}
      <div className="relative w-full max-w-full overflow-hidden py-2">
        <div className="absolute left-0 top-0 bottom-0 w-16 tablet:w-36 bg-gradient-to-r from-[#0B0E14] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 tablet:w-36 bg-gradient-to-l from-[#0B0E14] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-3">
          {duplicatedPartners.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="group flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-[#121620] hover:border-[#FF7300]/40 hover:bg-[#161D2C] transition-all duration-200 flex-shrink-0 shadow-sm"
            >
              <div className="w-10 h-7 relative flex-shrink-0">
                <Image src={item.icon} alt={item.name} fill unoptimized sizes="40px" className="object-contain" />
              </div>
              <span className="text-xs font-bold text-white font-heading">{item.name}</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10">
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
