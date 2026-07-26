import { Suspense } from 'react';
import prisma from '@/lib/prisma';
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
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      denominations: {
        where: { isActive: true },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  const games = products as unknown as import('@/types').ProductWithDenominations[];

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pb-24">
        <PromoCarousel />
        <PopularGames games={games} />
        <FlashSale games={games} />
        <TrendingProducts games={games} />
        <StatsCounter />
        <Suspense fallback={<SectionSkeleton />}>
          <Testimonials />
        </Suspense>
        <PaymentPartners />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
