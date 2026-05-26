import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center — Pusat Bantuan',
  description: 'Temukan jawaban untuk pertanyaan kamu tentang top up game, pembayaran, refund, dan layanan NexaPay lainnya. Tim kami siap membantu 24/7.',
  openGraph: {
    title: 'Help Center — NexaPay',
    description: 'Pusat bantuan dan FAQ NexaPay.',
    url: '/help',
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
