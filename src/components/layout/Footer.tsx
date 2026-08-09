'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, Phone, Heart, ArrowUpRight, ExternalLink } from 'lucide-react';

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

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/nexapay', color: 'hover:text-pink-500' },
  { name: 'Twitter', href: 'https://twitter.com/nexapay', color: 'hover:text-sky-500' },
  { name: 'Discord', href: 'https://discord.gg/nexapay', color: 'hover:text-indigo-500' },
  { name: 'YouTube', href: 'https://youtube.com/@nexapay', color: 'hover:text-red-500' },
];

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
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Subtle background mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-violet-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[300px] h-[300px] bg-cyan-500/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="container-app py-12 tablet:py-16 pb-24 tablet:pb-24 relative z-10">
        {/* Links Grid */}
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-8 tablet:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 tablet:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                <span className="text-white font-heading font-bold text-sm">N</span>
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                Nexa<span className="text-muted-foreground">Pay</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-5 max-w-[260px] leading-relaxed">
              Platform top-up game & produk digital terpercaya #1 di Indonesia. Cepat, aman, dan murah.
            </p>
            <div className="space-y-2.5">
              <a href="mailto:support@nexapay.id" className="group flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                support@nexapay.id
              </a>
              <a href="tel:+628001234567" className="group flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                0800-123-4567
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 mt-5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-[11px] font-medium text-muted-foreground ${social.color} hover:border-current/20 transition-all duration-200 hover:-translate-y-0.5`}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {[
            { title: 'Produk', links: footerLinks.products },
            { title: 'Perusahaan', links: footerLinks.company },
            { title: 'Bantuan', links: footerLinks.support },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-50 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Partners */}
        <div className="border-t border-border/40 pt-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-3">Partner Pembayaran Resmi</p>
          <div className="flex flex-wrap gap-2">
            {paymentLogos.map((name) => (
              <span key={name} className="px-3 py-1.5 rounded-lg bg-muted/30 border border-border/40 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-6 flex flex-col tablet:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            © 2026 NexaPay. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Jakarta
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
