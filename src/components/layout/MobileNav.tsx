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
    // Debounced threshold: shrink when scrolling down past 70px
    if (latest > 70 && diff > 10) {
      setIsShrunk(true);
    } else if (diff < -8 || latest < 30) {
      setIsShrunk(false);
    }
    lastScrollY.current = latest;
  });

  // Hide MobileNav on admin pages and on topup detail pages for clean checkout UX
  const isTopUpDetailPage = pathname.startsWith('/topup/') && pathname.split('/').length > 2;
  if (pathname.startsWith('/admin') || isTopUpDetailPage) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-4 left-0 right-0 z-50 lg:hidden px-4 pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <motion.div
        animate={{
          paddingTop: isShrunk ? '4px' : '6px',
          paddingBottom: isShrunk ? '4px' : '6px',
          scale: isShrunk ? 0.96 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="pointer-events-auto max-w-[340px] w-full mx-auto rounded-full bg-background/85 backdrop-blur-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(255,115,0,0.12)] px-2 transition-shadow"
      >
        <div className="grid grid-cols-5 items-center relative z-10 w-full">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center w-full rounded-full transition-all duration-200 select-none py-1',
                  isShrunk ? 'h-9' : 'h-11',
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
                  'w-4.5 h-4.5 relative z-10 transition-all duration-200',
                  isActive ? 'scale-110 stroke-[2.5] text-primary' : 'opacity-70'
                )} />
                
                {/* Smooth Animated Label */}
                <span className={cn(
                  'text-[10px] relative z-10 tracking-tight leading-none transition-all duration-200 origin-top',
                  isShrunk ? 'h-0 opacity-0 mt-0 overflow-hidden scale-75' : 'h-auto opacity-100 mt-1 scale-100',
                  isActive ? 'font-black text-primary' : 'font-medium'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
}
