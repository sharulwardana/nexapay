'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  products: [
    { label: 'Game Top Up', href: '/topup' },
    { label: 'Voucher', href: '/products?cat=VOUCHER' },
    { label: 'Pulsa & Data', href: '/products?cat=PULSA' },
    { label: 'Token PLN', href: '/products?cat=PLN' },
    { label: 'Gift Card', href: '/products?cat=GIFT_CARD' },
    { label: 'Streaming', href: '/products?cat=STREAMING' },
  ],
  company: [
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Karir', href: '/careers' },
    { label: 'Blog & News', href: '/news' },
    { label: 'Mitra & Partner', href: '/partner' },
    { label: 'Kontak', href: '/contact' },
  ],
  support: [
    { label: 'Pusat Bantuan', href: '/help' },
    { label: 'Lacak Pesanan', href: '/track' },
    { label: 'Hubungi Kami', href: '/contact' },
    { label: 'Syarat & Ketentuan', href: '/terms' },
    { label: 'Kebijakan Privasi', href: '/privacy' },
  ],
};

const paymentLogos = [
  'QRIS', 'GoPay', 'OVO', 'DANA', 'ShopeePay',
  'BCA', 'BNI', 'BRI', 'Mandiri', 'Alfamart', 'Indomaret',
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative border-t border-border bg-background">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container-app py-12 tablet:py-16 pb-24 tablet:pb-24">
        {/* Links Grid */}
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-8 tablet:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 tablet:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">N</span>
              </div>
              <span className="font-heading font-bold text-base tracking-tight">
                Nexa<span className="text-muted-foreground">Pay</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-[240px] leading-relaxed">
              Platform top-up game & produk digital terpercaya #1 di Indonesia.
            </p>
            <div className="space-y-2">
              <a href="mailto:support@nexapay.id" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-3.5 h-3.5" /> support@nexapay.id
              </a>
              <a href="tel:+628001234567" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-3.5 h-3.5" /> 0800-123-4567
              </a>
            </div>
          </div>

          {/* Links columns */}
          {[
            { title: 'Produk', links: footerLinks.products },
            { title: 'Perusahaan', links: footerLinks.company },
            { title: 'Bantuan', links: footerLinks.support },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Partners */}
        <div className="border-t border-border/40 pt-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80 mb-3">Partner Pembayaran Resmi</p>
          <div className="flex flex-wrap gap-2">
            {paymentLogos.map((name) => (
              <span key={name} className="px-2.5 py-1 rounded-lg bg-muted/30 border border-border/40 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-6 flex flex-col tablet:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 NexaPay. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 text-primary" /> Jakarta, ID
            </span>
          </div>
        </div>
      </div>

      {/* Mobile nav spacer */}
      <div className="h-20 lg:hidden" />
    </footer>
  );
}
