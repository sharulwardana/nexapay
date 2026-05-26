'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const partners = [
  'QRIS', 'GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja',
  'BCA', 'BNI', 'BRI', 'Mandiri', 'BSI', 'CIMB',
  'Visa', 'Mastercard', 'Alfamart', 'Indomaret',
  'USDT', 'BTC',
];

export default function PaymentPartners() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <p className="label mb-2">Payment</p>
          <h2 className="heading-3">Metode pembayaran lengkap</h2>
          <p className="body-default mt-2 max-w-lg mx-auto">
            Bayar dengan cara yang paling nyaman buat kamu
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto"
        >
          {partners.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.03, ease: [0.33, 1, 0.68, 1] }}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:border-primary/20 hover:text-foreground transition-colors cursor-default"
            >
              {name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
