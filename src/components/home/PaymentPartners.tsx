'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { CreditCard, Shield } from 'lucide-react';

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
    <section ref={ref} className="py-12 tablet:py-16 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-cyan-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="container-app relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md mb-4 shadow-sm">
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-heading">HIGH-SPEED PAYMENT GATEWAY</span>
          </div>
          <h2 className="heading-3">Metode Pembayaran Lintas Platform</h2>
          <p className="body-default mt-2 max-w-lg mx-auto text-xs tablet:text-sm text-muted-foreground font-medium">
            Dukungan transaksi otomatis dengan verifikasi instan 24 jam nonstop.
          </p>
        </motion.div>
      </div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 px-4"
      >
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md shadow-sm">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400 tracking-wide font-heading">SSL 256-BIT ENCRYPTED</span>
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-md shadow-sm">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-bold text-blue-400 tracking-wide font-heading">PCI DSS LEVEL 1 COMPLIANT</span>
        </div>
      </motion.div>

      {/* Infinite Running Marquee Slider with Fade Mask */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left & Right Edge Gradient Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 tablet:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 tablet:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-3">
          {duplicatedPartners.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-card/60 backdrop-blur-md shadow-sm hover:border-primary/40 hover:bg-card/90 hover:shadow-neon-violet transition-all duration-300 flex-shrink-0"
            >
              <div className="w-10 h-7 relative flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Image src={item.icon} alt={item.name} fill sizes="40px" className="object-contain" />
              </div>
              <span className="text-xs font-bold text-foreground tracking-wide font-heading">{item.name}</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold border border-primary/20">
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
