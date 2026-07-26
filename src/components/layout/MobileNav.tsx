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
      className="fixed bottom-2 left-0 right-0 z-50 lg:hidden px-4 pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className={cn(
          "pointer-events-auto max-w-[350px] w-full mx-auto rounded-full bg-card/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.35),0_0_15px_rgba(255,115,0,0.12)] p-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
          isShrunk ? "h-11 scale-95" : "h-13 scale-100"
        )}
      >
        <div className="grid grid-cols-5 items-center h-full w-full">
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
                {/* Active Indicator Glow Pill - Uniform Size for all slots */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active-pill"
                    className="absolute inset-x-0.5 inset-y-0.5 bg-primary/20 rounded-full border border-primary/45 shadow-[0_0_12px_rgba(255,115,0,0.35)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                
                {/* Geometrically Centered Icon Container */}
                <div className="w-5 h-5 flex items-center justify-center relative z-10">
                  <item.icon className={cn(
                    'w-4.5 h-4.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isShrunk ? 'translate-y-0.5 scale-110' : 'translate-y-0 scale-100',
                    isActive ? 'stroke-[2.5] text-primary' : 'stroke-[1.75] text-muted-foreground opacity-75'
                  )} />
                </div>
                
                {/* Label Text */}
                <span className={cn(
                  'text-[10px] relative z-10 tracking-tight leading-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom pointer-events-none text-center',
                  isShrunk
                    ? 'opacity-0 scale-75 -translate-y-1 max-h-0 overflow-hidden mt-0'
                    : 'opacity-100 scale-100 translate-y-0 max-h-4 mt-0.5',
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
