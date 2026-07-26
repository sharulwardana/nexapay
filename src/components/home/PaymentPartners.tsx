'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

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
  { name: 'Alfamart', icon: '/images/payments/alfamart.svg', badge: 'MINIMARKET' },
  { name: 'Indomaret', icon: '/images/payments/indomaret.svg', badge: 'MINIMARKET' },
];

const duplicatedPartners = [...partners, ...partners];

export default function PaymentPartners() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-12 relative overflow-hidden">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8"
        >
          <p className="label mb-2 text-primary font-bold">Partner Resmi</p>
          <h2 className="heading-3">Metode Pembayaran Lengkap</h2>
          <p className="body-default mt-1.5 max-w-lg mx-auto text-xs tablet:text-sm text-muted-foreground">
            Dukungan pembayaran instan tanpa ribet 24/7 otomatis
          </p>
        </motion.div>
      </div>

      {/* Infinite Running Marquee Slider with Fade Mask */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left & Right Edge Gradient Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 tablet:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 tablet:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-3">
          {duplicatedPartners.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-md shadow-sm hover:border-primary/40 hover:bg-card transition-all flex-shrink-0"
            >
              <div className="w-10 h-6 relative flex-shrink-0">
                <Image src={item.icon} alt={item.name} fill sizes="40px" className="object-contain" />
              </div>
              <span className="text-xs font-bold text-foreground tracking-wide">{item.name}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold border border-primary/20">
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
