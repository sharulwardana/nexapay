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
    if (latest > 80 && diff > 8) {
      setIsShrunk(true);
    } else if (diff < -6 || latest < 30) {
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
      className="fixed bottom-2 left-0 right-0 z-50 lg:hidden px-3 pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className={cn(
          "pointer-events-auto max-w-[340px] w-full mx-auto rounded-full bg-card/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_15px_rgba(255,115,0,0.1)] px-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
          isShrunk ? "h-11 py-1 scale-95" : "h-13 py-1.5 scale-100"
        )}
      >
        <div className="grid grid-cols-5 items-center h-full relative z-10 w-full">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center w-full h-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none px-1',
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground active:scale-95'
                )}
              >
                {/* Active Glow Pill */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active-pill"
                    className="absolute inset-0 bg-primary/20 rounded-full border border-primary/40 shadow-[0_0_12px_rgba(255,115,0,0.3)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <item.icon className={cn(
                  'w-4.5 h-4.5 relative z-10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  isShrunk ? 'translate-y-0.5 scale-110' : 'translate-y-0 scale-100',
                  isActive ? 'stroke-[2.5] text-primary' : 'opacity-70'
                )} />
                
                {/* Hardware-Accelerated Smooth Opacity & Scale Label */}
                <span className={cn(
                  'text-[10px] relative z-10 tracking-tight leading-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom pointer-events-none',
                  isShrunk
                    ? 'opacity-0 scale-75 -translate-y-1 max-h-0 overflow-hidden mt-0'
                    : 'opacity-100 scale-100 translate-y-0 max-h-4 mt-0.5',
                  isActive ? 'font-black text-primary' : 'font-medium'
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
