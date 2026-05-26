import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Kenali NexaPay — platform top-up game dan produk digital #1 di Indonesia. Misi kami, tim, dan perjalanan kami membangun masa depan digital top-up.',
  openGraph: {
    title: 'Tentang NexaPay',
    description: 'Platform top-up game #1 di Indonesia.',
    url: '/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
