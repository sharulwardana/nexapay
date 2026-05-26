import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produk Digital — Pulsa, Paket Data, Token PLN, Voucher',
  description: 'Beli pulsa murah, paket data internet, token PLN, voucher game, gift card, dan produk digital lainnya di NexaPay. Proses instan, harga termurah.',
  openGraph: {
    title: 'Produk Digital — NexaPay',
    description: 'Beli produk digital dengan harga termurah dan proses instan.',
    url: '/products',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
