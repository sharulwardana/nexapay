'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useRef } from 'react';
import { Home, Gamepad2, ShoppingBag, Ticket, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Beranda' },
  { href: '/topup', icon: Gamepad2, label: 'Top Up' },
  { href: '/products', icon: ShoppingBag, label: 'Katalog' },
  { href: '/promo', icon: Ticket, label: 'Promo' },
  { href: '/dashboard', icon: User, label: 'Akun' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [isShrunk, setIsShrunk] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    if (latest > 75 && diff > 7) {
      setIsShrunk(true);
    } else if (diff < -5 || latest < 30) {
      setIsShrunk(false);
    }
    lastScrollY.current = latest;
  });

  const isTopUpDetailPage = pathname.startsWith('/topup/') && pathname.split('/').length > 2;
  if (pathname.startsWith('/admin') || isTopUpDetailPage) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-2.5 left-0 right-0 z-50 lg:hidden px-3 pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Instagram-Style Smooth GPU Floating Dock */}
      <div
        className={cn(
          "pointer-events-auto max-w-[360px] w-[92%] mx-auto rounded-full bg-card/90 backdrop-blur-2xl border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.38),0_0_20px_rgba(255,115,0,0.14)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
          isShrunk ? "h-11 py-1 scale-[0.97] translate-y-1" : "h-14 py-1.5 scale-100 translate-y-0"
        )}
      >
        {/* 100% Perfectly Equidistant 5-Column Grid */}
        <div className="grid grid-cols-5 items-center h-full w-full px-1.5">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-full h-full select-none"
              >
                {/* Active Glow Pill - Perfectly Symmetrical Inset */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active-pill"
                    className="absolute inset-x-1 inset-y-0.5 bg-primary/20 rounded-full border border-primary/45 shadow-[0_0_14px_rgba(255,115,0,0.35)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                
                {/* Fixed Centered Icon Frame */}
                <div className="w-5 h-5 flex items-center justify-center relative z-10">
                  <item.icon className={cn(
                    'w-4.5 h-4.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isShrunk ? 'translate-y-0.5 scale-110' : 'translate-y-0 scale-100',
                    isActive ? 'stroke-[2.5] text-primary' : 'stroke-[1.75] text-muted-foreground opacity-75'
                  )} />
                </div>
                
                {/* Instagram Smooth GPU Fade & Scale Label */}
                <span className={cn(
                  'text-[10px] relative z-10 tracking-tight leading-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom pointer-events-none text-center',
                  isShrunk
                    ? 'opacity-0 scale-75 -translate-y-1 max-h-0 overflow-hidden mt-0'
                    : 'opacity-100 scale-100 translate-y-0 max-h-4 mt-1',
                  isActive ? 'font-black text-primary' : 'font-medium text-muted-foreground'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
