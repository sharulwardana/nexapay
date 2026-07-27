'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronDown, MessageCircle, Mail, Phone, MapPin,
  HelpCircle, ShieldCheck, Clock, CreditCard, Gamepad2, Zap,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const faqs = [
  {
    category: 'Umum',
    icon: HelpCircle,
    questions: [
      { q: 'Apa itu NexaPay?', a: 'NexaPay adalah platform top-up game dan pembelian produk digital terpercaya #1 di Indonesia. Kami menyediakan layanan top-up untuk 500+ game dan berbagai produk digital dengan harga termurah dan proses instan.' },
      { q: 'Apakah NexaPay aman?', a: 'Ya, 100% aman. NexaPay menggunakan enkripsi SSL, payment gateway tersertifikasi, dan sistem keamanan berlapis untuk melindungi setiap transaksi kamu.' },
      { q: 'Berapa lama proses top up?', a: 'Mayoritas top-up diproses secara instan dalam waktu kurang dari 30 detik. Untuk beberapa produk tertentu, proses bisa memakan waktu 1-15 menit.' },
    ],
  },
  {
    category: 'Pembayaran',
    icon: CreditCard,
    questions: [
      { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Kami mendukung QRIS, GoPay, OVO, DANA, ShopeePay, Transfer Bank (BCA, BNI, BRI, Mandiri), Alfamart, Indomaret, dan bahkan Cryptocurrency (USDT).' },
      { q: 'Apakah ada biaya admin?', a: 'Untuk pembayaran via QRIS dan E-Wallet tidak ada biaya admin. Untuk transfer bank dikenakan biaya Rp 4.000 dan convenience store Rp 5.000.' },
    ],
  },
  {
    category: 'Top Up Game',
    icon: Gamepad2,
    questions: [
      { q: 'Bagaimana cara top up game?', a: '1. Pilih game yang ingin di top up, 2. Pilih nominal, 3. Masukkan User ID dan Server ID, 4. Pilih metode pembayaran, 5. Selesaikan pembayaran. Diamond/item akan masuk otomatis!' },
      { q: 'Bagaimana cara mengetahui User ID?', a: 'Buka game kamu, masuk ke menu Profile/Settings, dan User ID biasanya ditampilkan di sana. Untuk Mobile Legends, bisa dilihat di kiri atas layar utama.' },
      { q: 'Top up gagal, apa yang harus dilakukan?', a: 'Jangan panik! Jika pembayaran sudah terdebit tapi top up gagal, dana akan dikembalikan dalam 1x24 jam. Kamu juga bisa menghubungi customer service kami 24/7.' },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (key: string) => {
    setOpenItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24">
        <div className="container-app max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 tablet:mb-12">
            <h1 className="heading-2 mb-2">Pusat Bantuan</h1>
            <p className="body-default mb-6">Ada pertanyaan? Kami siap membantu 24/7</p>

            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pertanyaan..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/70 focus:bg-muted/70 shadow-sm transition-all duration-200"
              />
            </div>
          </motion.div>

          {/* Quick Contact */}
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-3 tablet:gap-4 mb-8 tablet:mb-12">
            {[
              { icon: MessageCircle, title: 'Live Chat', desc: 'Chat dengan CS kami', action: 'Chat Sekarang', color: 'from-violet-500 to-purple-600' },
              { icon: Mail, title: 'Email', desc: 'support@nexapay.id', action: 'Kirim Email', color: 'from-cyan-500 to-blue-600' },
              { icon: Phone, title: 'Telepon', desc: '0800-123-4567', action: 'Hubungi', color: 'from-green-500 to-emerald-600' },
            ].map((contact, i) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 tablet:p-5 text-center group cursor-pointer hover:border-primary/30"
              >
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br mx-auto mb-3 flex items-center justify-center', contact.color)}>
                  <contact.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-semibold mb-0.5">{contact.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{contact.desc}</p>
                <span className="text-xs font-medium text-primary">{contact.action}</span>
              </motion.div>
            ))}
          </div>

          {/* FAQ Sections */}
          <div className="space-y-6">
            {faqs.map((section, sectionIdx) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + sectionIdx * 0.1 }}
                className="glass-card overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <section.icon className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-semibold">{section.category}</h2>
                </div>
                <div className="divide-y divide-border">
                  {section.questions
                    .filter((q) => !search || q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase()))
                    .map((faq, i) => {
                      const key = `${sectionIdx}-${i}`;
                      const isOpen = openItems.includes(key);
                      return (
                        <button
                          key={key}
                          onClick={() => toggle(key)}
                          className="w-full text-left p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-medium">{faq.q}</span>
                            <ChevronDown className={cn('w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform mt-0.5', isOpen && 'rotate-180')} />
                          </div>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                  {faq.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      );
                    })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
