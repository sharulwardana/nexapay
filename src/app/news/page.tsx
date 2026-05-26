'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, Clock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const articles = [
  {
    id: '1', slug: 'nexapay-partnership-moonton', category: 'Partnership',
    title: 'NexaPay Resmi Menjadi Official Top Up Partner Moonton',
    excerpt: 'Kerjasama strategis untuk menghadirkan pengalaman top up Mobile Legends terbaik di Indonesia dengan harga termurah dan promo eksklusif.',
    author: 'NexaPay Team', date: '25 Mei 2026', readTime: '3 menit',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: '2', slug: 'flash-sale-anniversary', category: 'Promo',
    title: 'Flash Sale Anniversary NexaPay — Diskon Hingga 50%!',
    excerpt: 'Rayakan ulang tahun NexaPay dengan flash sale besar-besaran! Diskon hingga 50% untuk semua produk game top up dan voucher digital.',
    author: 'NexaPay Team', date: '23 Mei 2026', readTime: '2 menit',
    color: 'from-red-500 to-orange-600',
  },
  {
    id: '3', slug: 'fitur-baru-crypto-payment', category: 'Update',
    title: 'Fitur Baru: Bayar dengan Crypto di NexaPay',
    excerpt: 'Sekarang kamu bisa bayar top up game dan produk digital menggunakan USDT, Bitcoin, dan cryptocurrency lainnya melalui NexaPay.',
    author: 'NexaPay Tech', date: '20 Mei 2026', readTime: '4 menit',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: '4', slug: 'tips-hemat-top-up', category: 'Tips',
    title: '7 Tips Hemat Top Up Game yang Wajib Kamu Tahu',
    excerpt: 'Pelajari cara mendapatkan harga terbaik saat top up game. Dari memanfaatkan flash sale hingga sistem loyalty NexaPay.',
    author: 'NexaPay Team', date: '18 Mei 2026', readTime: '5 menit',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: '5', slug: 'genshin-50-update', category: 'Game News',
    title: 'Genshin Impact 5.0 — Natlan Region dan Karakter Baru',
    excerpt: 'Update terbesar Genshin Impact tahun ini telah hadir! Kenali region Natlan, karakter baru, dan bonus top up spesial dari NexaPay.',
    author: 'NexaPay Gaming', date: '15 Mei 2026', readTime: '6 menit',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: '6', slug: 'referral-program-launch', category: 'Fitur',
    title: 'Referral Program NexaPay — Ajak Teman, Dapat Bonus!',
    excerpt: 'Bagikan kode referral kamu dan dapatkan Rp 10.000 untuk setiap teman yang melakukan transaksi pertama di NexaPay.',
    author: 'NexaPay Team', date: '12 Mei 2026', readTime: '2 menit',
    color: 'from-pink-500 to-rose-600',
  },
];

export default function NewsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 tablet:pt-24 pb-24">
        <div className="container-app max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="heading-2 mb-2">📰 News & Blog</h1>
            <p className="body-default">Update terbaru, tips, promo, dan berita seputar gaming & NexaPay</p>
          </motion.div>

          {/* Featured Article */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link href={`/news/${articles[0].slug}`} className="group block glass-card overflow-hidden mb-8">
              <div className={cn('h-48 tablet:h-64 bg-gradient-to-br p-6 tablet:p-8 relative', articles[0].color)}>
                <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/5" />
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-3">
                    <Tag className="w-3 h-3" /> {articles[0].category}
                  </span>
                  <h2 className="text-xl tablet:text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:underline decoration-2 underline-offset-4">{articles[0].title}</h2>
                  <p className="text-sm text-white/80 line-clamp-2 mb-4">{articles[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {articles[0].author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {articles[0].date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {articles[0].readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-4 tablet:gap-6">
            {articles.slice(1).map((article, i) => (
              <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                <Link href={`/news/${article.slug}`} className="group block glass-card overflow-hidden h-full">
                  <div className={cn('h-32 bg-gradient-to-br p-4 relative', article.color)}>
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/5" />
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-medium">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </Link>
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
