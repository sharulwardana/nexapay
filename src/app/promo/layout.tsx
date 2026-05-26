import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Promo & Diskon — Hemat Hingga 50%',
  description: 'Jangan lewatkan promo dan diskon terbaik dari NexaPay. Flash sale, cashback, dan bonus spesial untuk top up game dan produk digital.',
  openGraph: {
    title: 'Promo & Diskon — NexaPay',
    description: 'Flash sale, cashback, dan bonus spesial.',
    url: '/promo',
  },
};

export default function PromoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
