import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { digitalProducts } from '@/data/products';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import PromoCarousel from '@/components/home/PromoCarousel';
import PopularGames from '@/components/home/PopularGames';
import TrendingProducts from '@/components/home/TrendingProducts';
import FlashSale from '@/components/home/FlashSale';
import StatsCounter from '@/components/home/StatsCounter';
import PaymentPartners from '@/components/home/PaymentPartners';

// Lazy load heavy / below-fold components to reduce initial JS bundle
const Testimonials = dynamic(() => import('@/components/home/Testimonials'));

function SectionSkeleton() {
  return (
    <div className="section-padding">
      <div className="container-app h-48 rounded-2xl bg-muted/20 animate-pulse" />
    </div>
  );
}

export const revalidate = 60; // ISR: revalidate home page every 60s

export default async function HomePage() {
  let games: import('@/types').ProductWithDenominations[] = [];

  try {
    // Aggregate real-time completed transaction counts per game product (excluding wallet deposits)
    const topSalesRaw = await prisma.transaction.groupBy({
      by: ['productId'],
      where: {
        status: { in: ['COMPLETED', 'PAID'] },
        productId: { not: null }
      },
      _count: { id: true }
    });

    const salesCountMap = new Map(topSalesRaw.map(s => [s.productId, (s._count as { id?: number } | null)?.id ?? 0]));

    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        denominations: {
          where: { isActive: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    if (products && products.length > 0) {
      // Sort products by real transaction volume (most bought games first)
      products.sort((a, b) => {
        const countA = salesCountMap.get(a.id) || 0;
        const countB = salesCountMap.get(b.id) || 0;
        if (countB !== countA) return countB - countA;
        return a.sortOrder - b.sortOrder;
      });

      const staticMap = new Map(digitalProducts.map((p) => [p.slug, p]));
      const validSlugs = new Set(digitalProducts.map((p) => p.slug));
      const filteredDbProducts = products.filter((p) => validSlugs.has(p.slug));
      const dbSlugs = new Set(filteredDbProducts.map((p) => p.slug));
      const missingFromDb = digitalProducts.filter((p) => !dbSlugs.has(p.slug));
      const combined = [...filteredDbProducts, ...missingFromDb];

      games = combined.map((p) => {
        const staticInfo = staticMap.get(p.slug);
        return {
          ...p,
          image: staticInfo?.image || p.image,
          bannerImage: staticInfo?.bannerImage || p.bannerImage || p.image,
          denominations: staticInfo?.denominations || p.denominations,
        };
      }) as unknown as import('@/types').ProductWithDenominations[];
    }
  } catch (error) {
    console.warn('Prisma fetch failed on homepage during prerender, falling back to static products:', error);
  }

  // Fallback to static products if DB failed or empty
  if (games.length === 0) {
    games = digitalProducts as unknown as import('@/types').ProductWithDenominations[];
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pb-24 aurora-bg">
        {/* Aurora decorative orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="floating-orb w-[600px] h-[600px] -top-[200px] -left-[200px] bg-violet-500/[0.06]" />
          <div className="floating-orb w-[500px] h-[500px] top-[40%] -right-[150px] bg-cyan-500/[0.04]" style={{ animationDelay: '3s' }} />
          <div className="floating-orb w-[400px] h-[400px] bottom-[10%] left-[20%] bg-orange-500/[0.04]" style={{ animationDelay: '6s' }} />
        </div>

        {/* Content (relative to be above orbs) */}
        <div className="relative z-10">
          <PromoCarousel />
          <PopularGames games={games} />
          <FlashSale games={games} />
          <TrendingProducts games={games} />
          <StatsCounter />
          <Suspense fallback={<SectionSkeleton />}>
            <Testimonials />
          </Suspense>
          <PaymentPartners />
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
