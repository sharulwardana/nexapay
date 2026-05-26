'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const routeLabels: Record<string, string> = {
  topup: 'Top Up',
  products: 'Produk Digital',
  promo: 'Promo',
  news: 'News',
  help: 'Help Center',
  contact: 'Kontak',
  about: 'Tentang Kami',
  terms: 'Syarat & Ketentuan',
  privacy: 'Kebijakan Privasi',
  login: 'Login',
  dashboard: 'Dashboard',
  admin: 'Admin',
  transactions: 'Riwayat Transaksi',
  wallet: 'Wallet',
  favorites: 'Favorit',
  referral: 'Referral',
  settings: 'Pengaturan',
  'payment-status': 'Status Pembayaran',
};

function getLabel(segment: string): string {
  // Check if it's a dynamic segment (like a slug)
  if (routeLabels[segment]) return routeLabels[segment];
  // Prettify slug for display
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumb() {
  const pathname = usePathname();

  // Don't show on homepage
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  // Build breadcrumb items
  const items = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    return { label: getLabel(segment), href, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4 tablet:mb-6">
      <ol className="flex items-center gap-1 text-xs text-muted-foreground overflow-x-auto no-scrollbar">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden tablet:inline">Home</span>
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
            {item.isLast ? (
              <span className="font-medium text-foreground truncate max-w-[150px] tablet:max-w-none" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-primary transition-colors truncate max-w-[100px] tablet:max-w-none">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
