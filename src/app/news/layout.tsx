import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News & Blog',
  description: 'Baca berita terbaru, tips gaming, update promo, dan informasi seputar NexaPay dan dunia gaming Indonesia.',
  openGraph: {
    title: 'News & Blog — NexaPay',
    description: 'Update terbaru, tips, dan berita gaming.',
    url: '/news',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
