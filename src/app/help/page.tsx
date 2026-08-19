'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronDown, MessageCircle, Mail, Phone, MapPin,
  HelpCircle, ShieldCheck, Clock, CreditCard, Gamepad2, Zap, Sparkles, Cpu,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const faqs = [
  {
    category: 'Umum & Sistem',
    icon: HelpCircle,
    questions: [
      { q: 'Apa keunggulan sistem otomatisasi NexaPay?', a: 'NexaPay terhubung langsung dengan API server resmi publisher game. Transaksi langsung diproses oleh robot pemroses otomatis dalam hitungan milidetik 24/7 tanpa antrean manual.' },
      { q: 'Apakah garansi saldo masuk 100%?', a: 'Ya. Jika sistem memverifikasi bahwa pembayaran telah diterima, diamond atau item akan otomatis terinjeksi ke ID Akun target.' },
      { q: 'Berapa lama rata-rata durasi transaksi?', a: '99.2% transaksi diproses instan dalam waktu kurang dari 5 detik. Untuk pemeliharaan server game tertentu, maksimal pemrosesan 1-15 menit.' },
    ],
  },
  {
    category: 'Pembayaran & Deposit',
    icon: CreditCard,
    questions: [
      { q: 'Metode pembayaran instant apa saja yang didukung?', a: 'Kami mendukung QRIS Bebas Admin, GoPay, OVO, DANA, ShopeePay, Virtual Account BCA/Mandiri/BRI/BNI, Minimarket, serta Crypto USDT.' },
      { q: 'Bagaimana jika pembayaran sudah terdebit tapi status masih pending?', a: 'Beberapa bank memerlukan sinkronisasi mutation log (biasanya 1-3 menit). Jika lebih dari 15 menit belum terupdate, klik tombol "Kirim Struk WA" di halaman status transaksi untuk bantuan instant.' },
    ],
  },
  {
    category: 'Top Up Game & Akun',
    icon: Gamepad2,
    questions: [
      { q: 'Di mana saya bisa menemukan User ID & Zone/Server ID?', a: 'Buka profil game Anda di dalam aplikasi. User ID terletak di bawah nama avatar. Untuk Mobile Legends, contoh: 12345678 (2104).' },
      { q: 'Salah memasukkan User ID, apakah bisa ditarik kembali?', a: 'Item yang sudah terkirim ke User ID tujuan yang valid dari sistem publisher tidak dapat ditarik kembali. Mohon periksa kembali nama akun di konfirmasi pesanan sebelum bayar.' },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [openItems, setOpenItems] = useState<string[]>(['0-0']);

  const toggle = (key: string) => {
    setOpenItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-app max-w-4xl relative z-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 tablet:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md mb-4 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase font-heading">Nexa Knowledge Engine</span>
            </div>
            <h1 className="heading-1 mb-3">
              Pusat Bantuan & <span className="gradient-text">FAQ Gamer</span>
            </h1>
            <p className="body-default max-w-lg mx-auto text-muted-foreground mb-6">
              Temukan jawaban cepat terkait kendala top-up, cara cek User ID, hingga panduan metode pembayaran instan.
            </p>

            {/* Smart Search */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kata kunci kendala (contoh: MLBB, pending, refund)..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card/60 border border-border/80 text-xs tablet:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 backdrop-blur-xl shadow-lg transition-all"
              />
            </div>
          </motion.div>

          {/* Quick Direct Help Cards */}
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-3.5 mb-10">
            {[
              { icon: MessageCircle, title: 'Live Priority CS', desc: 'Sesi chat langsung dengan tim teknisi', action: 'Mulai Chat CS', color: 'from-emerald-500 to-teal-600', link: '/contact' },
              { icon: Mail, title: 'Dispatch Email', desc: 'Respon cepat untuk kendala invoice', action: 'Kirim Email', color: 'from-cyan-500 to-blue-600', link: 'mailto:support@nexapay.id' },
              { icon: Phone, title: 'Hotline 24/7', desc: 'Bebas pulsa bantuan telepon', action: '0800-123-4567', color: 'from-amber-500 to-orange-600', link: 'tel:08001234567' },
            ].map((contact, i) => (
              <motion.a
                key={contact.title}
                href={contact.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-card/40 border border-border/80 hover:border-primary/40 backdrop-blur-md text-center group transition-all duration-300 shadow-md"
              >
                <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br mx-auto mb-3 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform', contact.color)}>
                  <contact.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold font-heading mb-0.5">{contact.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{contact.desc}</p>
                <span className="text-xs font-bold text-primary font-heading group-hover:underline">{contact.action} &rarr;</span>
              </motion.a>
            ))}
          </div>

          {/* FAQ Sections */}
          <div className="space-y-4">
            {faqs.map((section, sectionIdx) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + sectionIdx * 0.1 }}
                className="rounded-2xl bg-card/50 border border-border/80 backdrop-blur-xl overflow-hidden shadow-lg"
              >
                <div className="flex items-center gap-2.5 p-4 bg-white/[0.02] border-b border-border/60">
                  <section.icon className="w-4 h-4 text-amber-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-foreground font-heading">{section.category}</h2>
                </div>
                <div className="divide-y divide-border/60">
                  {section.questions
                    .filter((q) => !search || q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase()))
                    .map((faq, i) => {
                      const key = `${sectionIdx}-${i}`;
                      const isOpen = openItems.includes(key);
                      return (
                        <div key={key} className="p-4 hover:bg-white/[0.02] transition-colors">
                          <button
                            onClick={() => toggle(key)}
                            className="w-full text-left flex items-start justify-between gap-3 focus:outline-none"
                          >
                            <span className="text-xs tablet:text-sm font-bold text-foreground font-heading">{faq.q}</span>
                            <ChevronDown className={cn('w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform mt-0.5', isOpen && 'rotate-180 text-amber-400')} />
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed pl-1 border-l-2 border-amber-500/40">
                                  {faq.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
