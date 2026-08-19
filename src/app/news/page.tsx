'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, Clock, Newspaper, Terminal, Sparkles, Cpu } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const articles = [
  {
    id: '1', slug: 'nexapay-partnership-moonton', category: 'Official Partnership',
    title: 'NexaPay Engine Direct API Integration dengan Moonton Official',
    excerpt: 'Kerjasama integrasi langsung ke server Moonton untuk pengisian Diamond Mobile Legends dalam hitungan milidetik tanpa hambatan.',
    author: 'Nexa Engineering', date: '25 Mei 2026', readTime: '3 min read',
    color: 'from-violet-600 to-indigo-700', badge: 'Major Milestone',
  },
  {
    id: '2', slug: 'flash-sale-anniversary', category: 'Cyber Boost',
    title: 'Nexa Cyber Anniversary Boost — Diskon Up To 50% & Exclusive Cashback',
    excerpt: 'Event tahunan terbesar NexaPay! Dapatkan potongan harga otomatis dan double poin loyalti untuk semua game top-up.',
    author: 'Growth Team', date: '23 Mei 2026', readTime: '2 min read',
    color: 'from-orange-500 to-amber-600', badge: 'Hot Event',
  },
  {
    id: '3', slug: 'fitur-baru-crypto-payment', category: 'System Upgrade',
    title: 'Deployment System v2.6: Web3 Crypto Payment Engine (USDT/BTC)',
    excerpt: 'Dukungan pembayaran aset digital terenkripsi dengan konversi kurs otomatis tanpa biaya tersembunyi.',
    author: 'Fintech Core', date: '20 Mei 2026', readTime: '4 min read',
    color: 'from-cyan-500 to-blue-600', badge: 'New Feature',
  },
  {
    id: '4', slug: 'tips-hemat-top-up', category: 'Pro Guide',
    title: 'Optimalisasi Diamond Rate: 7 Strategi Maximize Top-Up Value',
    excerpt: 'Panduan lengkap memaksimalkan setiap rupiah nominal transaksi kamu menggunakan jam promo dan loyalty tier.',
    author: 'Gamer Care', date: '18 Mei 2026', readTime: '5 min read',
    color: 'from-emerald-500 to-teal-600', badge: 'Guide',
  },
  {
    id: '5', slug: 'genshin-50-update', category: 'Patch Intelligence',
    title: 'Genshin Impact v5.0 Natlan Release & Bonus Welkin Drop Rate',
    excerpt: 'Rangkuman lengkap update Natlan beserta jaminan bonus pengisian Welkin Moon di Nexa Ecosystem.',
    author: 'Game Intelligence', date: '15 Mei 2026', readTime: '6 min read',
    color: 'from-purple-500 to-rose-600', badge: 'Patch Notes',
  },
  {
    id: '6', slug: 'referral-program-launch', category: 'Community',
    title: 'Nexa Squad Referral Protocol: Dapatkan Rp 10.000 Per Active Friend',
    excerpt: 'Bagikan referral ID kamu kepada teman seperjuangan gaming dan nikmati cashback pasif yang masuk ke wallet.',
    author: 'Community Hub', date: '12 Mei 2026', readTime: '2 min read',
    color: 'from-pink-500 to-rose-600', badge: 'Rewards',
  },
];

export default function NewsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 relative overflow-hidden">
        {/* Glow Ambient */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-app max-w-5xl relative z-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 tablet:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4 shadow-sm">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold tracking-widest text-primary uppercase font-heading">Nexa Patch Notes & Newsroom</span>
            </div>
            <h1 className="heading-1 mb-3">
              Patch Notes & <span className="gradient-text">Cyber Intelligence</span>
            </h1>
            <p className="body-default max-w-xl mx-auto text-muted-foreground">
              Publikasi resmi update sistem, integrasi API publisher terbaru, promo event, serta strategi gaming dari tim Nexa.
            </p>
          </motion.div>

          {/* Featured Hero Article */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link href={`/news/${articles[0].slug}`} className="group block rounded-3xl overflow-hidden mb-8 border border-border/80 hover:border-primary/50 backdrop-blur-2xl shadow-2xl transition-all duration-300 relative">
              <div className={cn('p-6 tablet:p-10 relative bg-gradient-to-br', articles[0].color)}>
                <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold font-heading uppercase">
                      {articles[0].category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase">
                      {articles[0].badge}
                    </span>
                  </div>
                  <h2 className="text-xl tablet:text-2xl lg:text-3xl font-bold font-heading text-white mb-3 group-hover:underline decoration-2 underline-offset-4">
                    {articles[0].title}
                  </h2>
                  <p className="text-xs tablet:text-sm text-white/85 line-clamp-2 mb-6 leading-relaxed">
                    {articles[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-white/70">
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {articles[0].author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {articles[0].date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {articles[0].readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.slice(1).map((article, i) => (
              <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                <Link href={`/news/${article.slug}`} className="group flex flex-col justify-between h-full p-5 rounded-2xl bg-card/40 border border-border/80 hover:border-primary/40 backdrop-blur-md hover:shadow-lg transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-heading">
                        {article.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-muted/60 text-[9px] font-bold text-muted-foreground uppercase">
                        {article.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold font-heading line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 pt-3 border-t border-border/60">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
