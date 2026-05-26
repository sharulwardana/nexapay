import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hubungi Kami — Kontak',
  description: 'Hubungi tim NexaPay melalui email, telepon, atau live chat. Kami siap membantu kamu 24/7.',
  openGraph: {
    title: 'Kontak — NexaPay',
    description: 'Hubungi tim NexaPay 24/7.',
    url: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
