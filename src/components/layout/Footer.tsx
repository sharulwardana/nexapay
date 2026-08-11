'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Mail, Phone, Heart, ArrowUpRight, MapPin } from 'lucide-react';

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
  ],
  support: [
    { label: 'Pusat Bantuan & FAQ', href: '/help' },
    { label: 'Hubungi CS 24/7', href: '/contact' },
    { label: 'Lacak Pesanan', href: '/track' },
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
  { name: 'QRIS', icon: '/images/payments/qris.svg' },
  { name: 'GoPay', icon: '/images/payments/gopay.svg' },
  { name: 'OVO', icon: '/images/payments/ovo.svg' },
  { name: 'DANA', icon: '/images/payments/dana.svg' },
  { name: 'ShopeePay', icon: '/images/payments/shopeepay.svg' },
  { name: 'BCA', icon: '/images/payments/bca.svg' },
  { name: 'BNI', icon: '/images/payments/bni.svg' },
  { name: 'BRI', icon: '/images/payments/bri.svg' },
  { name: 'Mandiri', icon: '/images/payments/mandiri.svg' },
  { name: 'Alfamart', icon: '/images/payments/alfamart.svg' },
  { name: 'Indomaret', icon: '/images/payments/indomaret.svg' },
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
            <p className="text-xs tablet:text-sm text-muted-foreground mb-5 max-w-[280px] leading-relaxed font-medium">
              Built for Gamers, Powered by Speed. Top-up secepat kilat dengan keamanan terenkripsi & pemrosesan instan.
            </p>
            <div className="space-y-2.5">
              <a href="mailto:support@nexapay.id" className="group flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all shadow-sm">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                </div>
                support@nexapay.id
              </a>
              <a href="tel:+628001234567" className="group flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all shadow-sm">
                  <Phone className="w-3.5 h-3.5 text-primary" />
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
                  className={`px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] font-bold text-muted-foreground ${social.color} hover:border-primary/40 hover:bg-white/[0.08] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 shadow-sm`}
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
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4 font-heading">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-xs tablet:text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Partners */}
        <div className="border-t border-border/40 pt-6 mb-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-3 font-heading">Partner Pembayaran Resmi & Terenkripsi</p>
          <div className="flex flex-wrap gap-2.5 items-center">
            {paymentLogos.map((item) => (
              <div
                key={item.name}
                className="h-9 px-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-primary/50 hover:bg-white/[0.08] hover:shadow-neon-violet transition-all duration-200 flex items-center justify-center relative min-w-[64px] group"
                title={item.name}
              >
                <div className="relative w-12 h-5 grayscale group-hover:grayscale-0 transition-all duration-300">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
              </div>
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
