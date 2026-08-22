'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, Terminal } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { articles as fallbackArticles, type NewsArticle } from '@/data/news';

export default function NewsClient({ dbArticles = [] }: { dbArticles?: NewsArticle[] }) {
  const displayArticles = dbArticles.length > 0 ? dbArticles : fallbackArticles;

  return (
    <>
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
          {displayArticles.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Link href={`/news/${displayArticles[0].slug}`} className="group block rounded-3xl overflow-hidden mb-8 border border-border/80 hover:border-primary/50 backdrop-blur-2xl shadow-2xl transition-all duration-300 relative">
                <div className={cn('p-6 tablet:p-10 relative bg-gradient-to-br', displayArticles[0].color || 'from-orange-500/20 via-amber-500/10 to-transparent')}>
                  <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                  <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold font-heading uppercase">
                        {displayArticles[0].category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase">
                        {displayArticles[0].badge}
                      </span>
                    </div>
                    <h2 className="text-xl tablet:text-2xl lg:text-3xl font-bold font-heading text-white mb-3 group-hover:underline decoration-2 underline-offset-4">
                      {displayArticles[0].title}
                    </h2>
                    <p className="text-xs tablet:text-sm text-white/85 line-clamp-2 mb-6 leading-relaxed">
                      {displayArticles[0].excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-[11px] sm:text-xs font-medium text-white/70">
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {displayArticles[0].author}</span>
                      <span className="hidden xs:inline">•</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {displayArticles[0].date}</span>
                      <span className="hidden xs:inline">•</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {displayArticles[0].readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid of Remaining Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.slice(1).map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  href={`/news/${article.slug}`}
                  className="group flex flex-col justify-between h-full p-5 rounded-2xl bg-card/60 border border-border/80 hover:border-primary/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider font-heading">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{article.readTime}</span>
                    </div>
                    <h3 className="text-base font-bold font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
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
