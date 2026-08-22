'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, User, Clock, Share2, Tag,
  ArrowRight, ShieldCheck, Zap, Bookmark
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { NewsArticle } from '@/data/news';

export default function NewsDetailClient({
  article,
  relatedArticles,
}: {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}) {
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Tautan artikel berhasil disalin! 🔗');
    }
  };

  return (
    <>
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-app max-w-4xl relative z-10">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Newsroom</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card/80 border border-border/80 text-xs font-bold text-foreground hover:bg-card hover:border-primary/40 transition-all active:scale-95 cursor-pointer shadow-sm"
              aria-label="Bagikan Artikel"
            >
              <Share2 className="w-3.5 h-3.5 text-primary" />
              <span>Bagikan</span>
            </button>
          </div>

          {/* Article Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden mb-10 border border-border/80 backdrop-blur-2xl shadow-2xl relative"
          >
            <div className={cn('p-6 sm:p-10 relative bg-gradient-to-br', article.color)}>
              <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold font-heading uppercase">
                    {article.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase">
                    {article.badge}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl tablet:text-4xl font-extrabold font-heading text-white mb-4 leading-tight">
                  {article.title}
                </h1>
                <p className="text-sm sm:text-base text-white/90 mb-6 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-white/80 border-t border-white/15 pt-4">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {article.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {article.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {article.readTime}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Article Body */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 sm:p-10 rounded-3xl border border-border/60 shadow-xl mb-12"
          >
            <div className="prose prose-invert max-w-none space-y-6 text-foreground/90 text-sm sm:text-base leading-relaxed">
              {article.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* In-article CTA box */}
            <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-primary/10 border border-primary/25 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-foreground font-heading">Siap Top-Up Sekarang?</h4>
                  <p className="text-xs text-muted-foreground">Nikmati transaksi instan &lt; 3 detik dengan diskon eksklusif.</p>
                </div>
              </div>
              <Link
                href="/topup"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl gradient-primary text-white font-bold text-xs sm:text-sm text-center shadow-md hover:shadow-neon-violet active:scale-95 transition-all flex-shrink-0"
              >
                Mulai Top-Up
              </Link>
            </div>
          </motion.div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h3 className="heading-3">Artikel Terkait</h3>
                <Link
                  href="/news"
                  className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 tablet:grid-cols-3 gap-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/news/${rel.slug}`}
                    className="glass-card p-5 rounded-2xl border border-border/60 hover:border-primary/50 transition-all duration-200 hover:-translate-y-1 group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2 block">
                        {rel.category}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 font-heading leading-snug">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/40 pt-3">
                      <span>{rel.date}</span>
                      <span>{rel.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
