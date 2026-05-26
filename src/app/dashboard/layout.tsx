import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Kelola akun NexaPay kamu — lihat saldo wallet, riwayat transaksi, loyalty points, dan pengaturan akun.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
