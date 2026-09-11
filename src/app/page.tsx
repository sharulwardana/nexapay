import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { digitalProducts } from '@/data/products';
import dynamic from 'next/dynamic';
import Footer from '@/components/layout/Footer';
import PromoCarousel from '@/components/home/PromoCarousel';
import PopularGames from '@/components/home/PopularGames';
import TrendingProducts from '@/components/home/TrendingProducts';
import FlashSale from '@/components/home/FlashSale';
import WhyNexaPay from '@/components/home/WhyNexaPay';
import PaymentPartners from '@/components/home/PaymentPartners';

// Lazy load below-the-fold component
const Testimonials = dynamic(() => import('@/components/home/Testimonials'));

function SectionSkeleton() {
  return (
    <div className="section-padding">
      <div className="container-app h-48 rounded-2xl bg-white/[0.04] animate-pulse" />
    </div>
  );
}

export const revalidate = 120; // ISR: cache homepage for 2 minutes

export default async function HomePage() {
  let games: import('@/types').ProductWithDenominations[] = [];
  let banners: Array<{ id: string; title: string; subtitle?: string | null; image?: string | null; link?: string | null }> = [];

  try {
    // Fetch banners and products in parallel (non-blocking)
    const [bannersData, productsData] = await Promise.all([
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, title: true, subtitle: true, image: true, link: true },
      }).catch(() => []),
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          denominations: {
            where: { isActive: true },
          },
        },
        orderBy: { sortOrder: 'asc' },
      }).catch(() => []),
    ]);

    banners = bannersData;

    if (productsData && productsData.length > 0) {
      const staticMap = new Map(digitalProducts.map((p) => [p.slug, p]));
      const validSlugs = new Set(digitalProducts.map((p) => p.slug));
      const filteredDbProducts = productsData.filter((p) => validSlugs.has(p.slug));
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
    console.warn('Prisma fetch failed on homepage during prerender, falling back to defaults:', error);
  }

  // Fallback to static products if DB failed or empty
  if (games.length === 0) {
    games = digitalProducts as unknown as import('@/types').ProductWithDenominations[];
  }

  return (
    <>
      <main id="main-content" className="min-h-screen pb-20 w-full max-w-full overflow-x-hidden">
        {/* Content-first layout: No bloated hero. Straight to content like Codashop/UniPin. */}
        <div className="relative z-10">
          {/* Spacer for fixed navbar */}
          <div className="pt-16 tablet:pt-18" />
          <PromoCarousel banners={banners} />
          <PopularGames games={games} />
          <FlashSale games={games} />
          <TrendingProducts games={games} />
          <WhyNexaPay />
          <PaymentPartners />
          <Suspense fallback={<SectionSkeleton />}>
            <Testimonials />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
