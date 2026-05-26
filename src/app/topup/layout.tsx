import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top Up Game — Harga Termurah & Proses Instan',
  description: 'Top up diamond Mobile Legends, Genesis Crystal Genshin Impact, VALORANT Points, Free Fire Diamonds, dan 500+ game lainnya. Proses instan, harga termurah, 100% aman.',
  openGraph: {
    title: 'Top Up Game — NexaPay',
    description: 'Top up 500+ game dengan harga termurah dan proses instan.',
    url: '/topup',
  },
};

export default function TopUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
