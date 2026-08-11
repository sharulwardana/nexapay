import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Patch Notes & Cyber Feed — NexaPay',
  description: 'Update sistem terbaru, patch notes game, promo eksklusif, dan pengumuman resmi NexaPay.',
  openGraph: {
    title: 'Patch Notes & Cyber Feed — NexaPay',
    description: 'Update terbaru, tips, dan berita gaming.',
    url: '/news',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
