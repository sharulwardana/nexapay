import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login / Daftar',
  description: 'Masuk atau daftar akun NexaPay untuk mulai top up game dan beli produk digital dengan harga termurah.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
