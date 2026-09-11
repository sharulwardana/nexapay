'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Mail, Phone, Heart, ArrowUpRight, MapPin, ShieldCheck, Zap, Headphones } from 'lucide-react';

const footerLinks = {
  products: [
    { label: 'Game Top Up', href: '/topup' },
    { label: 'Voucher Game', href: '/products?cat=VOUCHER' },
    { label: 'Pulsa & Data', href: '/products?cat=PULSA' },
    { label: 'Token PLN Listrik', href: '/products?cat=PLN' },
    { label: 'Gift Card Digital', href: '/products?cat=GIFT_CARD' },
    { label: 'Langganan Streaming', href: '/products?cat=STREAMING' },
  ],
  company: [
    { label: 'Tentang NexaPay', href: '/about' },
    { label: 'Karir & Lowongan', href: '/careers' },
    { label: 'Berita & Update Game', href: '/news' },
    { label: 'Mitra & Kemitraan', href: '/partner' },
  ],
  support: [
    { label: 'Pusat Bantuan & FAQ', href: '/help' },
    { label: 'Hubungi Customer Care', href: '/contact' },
    { label: 'Lacak Status Pesanan', href: '/track' },
    { label: 'Syarat & Ketentuan Layanan', href: '/terms' },
    { label: 'Kebijakan Privasi', href: '/privacy' },
  ],
};

const socialLinks = [
  { 
    name: 'Instagram', 
    href: 'https://instagram.com/nexapay', 
    color: 'hover:text-[#FF7300] hover:border-[#FF7300]/30 hover:bg-[#FF7300]/10',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    )
  },
  { 
    name: 'Twitter / X', 
    href: 'https://twitter.com/nexapay', 
    color: 'hover:text-[#FF7300] hover:border-[#FF7300]/30 hover:bg-[#FF7300]/10',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  { 
    name: 'Discord', 
    href: 'https://discord.gg/nexapay', 
    color: 'hover:text-[#FF7300] hover:border-[#FF7300]/30 hover:bg-[#FF7300]/10',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z" />
      </svg>
    )
  },
  { 
    name: 'YouTube', 
    href: 'https://youtube.com/@nexapay', 
    color: 'hover:text-[#FF7300] hover:border-[#FF7300]/30 hover:bg-[#FF7300]/10',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
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
    <footer className="relative border-t border-white/[0.08] bg-[#0A0D13]">
      {/* Accent top line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF7300]/30 to-transparent pointer-events-none" />

      <div className="container-app py-12 tablet:py-16 pb-24 tablet:pb-20 relative z-10">
        {/* Links Grid — Balanced 12-Column Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 tablet:grid-cols-12 gap-8 tablet:gap-6 lg:gap-12 mb-12">
          {/* Brand Column: 5 cols on tablet, 4 cols on desktop */}
          <div className="sm:col-span-2 tablet:col-span-5 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF7300] to-[#E66800] flex items-center justify-center shadow-md shadow-[#FF7300]/25 group-hover:shadow-lg group-hover:shadow-[#FF7300]/40 transition-shadow border border-white/20">
                <span className="text-white font-heading font-extrabold text-sm">N</span>
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                <span className="text-foreground">Nexa</span>
                <span className="text-primary">Pay</span>
              </span>
            </Link>
            
            <p className="text-xs tablet:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Platform top-up game dan produk digital terpercaya di Indonesia. Transaksi otomatis 24/7, harga hemat, dan layanan responsif.
            </p>

            <div className="space-y-2 pt-1">
              <a href="mailto:support@nexapay.id" className="group flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all shadow-sm">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                </div>
                support@nexapay.id
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all shadow-sm">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                </div>
                +62 812-8888-NEXA (WhatsApp Care)
              </a>
            </div>

            {/* Social Links — Clean 2x2 grid on tablet */}
            <div className="flex flex-wrap items-center gap-2 pt-2 max-w-xs">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] font-bold text-muted-foreground ${social.color} transition-all duration-200 hover:-translate-y-0.5 shadow-sm`}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns: 7 cols on tablet, 8 cols on desktop with 3 balanced columns */}
          <div className="sm:col-span-2 tablet:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 tablet:gap-6 lg:gap-8">
            {[
              { title: 'Katalog Produk', links: footerLinks.products },
              { title: 'Perusahaan', links: footerLinks.company },
              { title: 'Pusat Bantuan', links: footerLinks.support },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4 font-heading">{col.title}</h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-xs tablet:text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
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
        </div>

        {/* Payment Channels Grid */}
        <div className="border-t border-white/[0.08] pt-6 mb-8">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-3 font-heading">
            Kanal Pembayaran Resmi & Terverifikasi
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            {paymentLogos.map((item) => (
              <div
                key={item.name}
                className="h-9 px-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-primary/40 hover:bg-white/[0.06] hover:shadow-brand transition-all duration-200 flex items-center justify-center relative min-w-[64px]"
                title={item.name}
              >
                <div className="relative w-12 h-5 grayscale hover:grayscale-0 transition-all duration-200">
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

        {/* Bottom Legal Bar */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col tablet:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            © 2026 NexaPay. Platform Top-Up Gaming Indonesia.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">Syarat & Ketentuan</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Kebijakan Privasi</Link>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-primary" /> Jakarta, Indonesia
            </span>
          </div>
        </div>
      </div>

      {/* Mobile nav spacer to ensure no content is occluded by bottom dock */}
      <div className="h-20 sm:h-24 tablet:hidden" />
    </footer>
  );
}
