import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import PromoCarousel from '@/components/home/PromoCarousel';
import PopularGames from '@/components/home/PopularGames';
import TrendingProducts from '@/components/home/TrendingProducts';
import FlashSale from '@/components/home/FlashSale';
import Testimonials from '@/components/home/Testimonials';
import StatsCounter from '@/components/home/StatsCounter';
import PaymentPartners from '@/components/home/PaymentPartners';
import LiveChat from '@/components/shared/LiveChat';

export default function HomePage() {
  return (
    <>

      <main id="main-content" className="min-h-screen pt-28 tablet:pt-32 pb-24">
        <HeroSection />
        <PromoCarousel />
        <PopularGames />
        <FlashSale />
        <TrendingProducts />
        <StatsCounter />
        <Testimonials />
        <PaymentPartners />
      </main>
      <Footer />
      <MobileNav />
      <LiveChat />
    </>
  );
}
