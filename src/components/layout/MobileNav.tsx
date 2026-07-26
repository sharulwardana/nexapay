'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
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
  const [mounted, setMounted] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  if (!mounted || pathname.startsWith('/admin') || isTopUpDetailPage) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-2.5 left-0 right-0 z-50 lg:hidden px-3 pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* 1:1 Instagram Floating Navbar Capsule */}
      <div
        className={cn(
          "pointer-events-auto max-w-[340px] w-[90%] mx-auto rounded-full bg-card/90 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_20px_rgba(255,115,0,0.15)] p-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
          isShrunk ? "h-[42px] scale-[0.97]" : "h-[52px] scale-100"
        )}
      >
        <div className="grid grid-cols-5 items-center justify-center h-full w-full">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-full h-full rounded-full select-none"
              >
                {/* Active Pill (Filling full height like Instagram) */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-primary/25 via-primary/35 to-accent/25 rounded-full border border-primary/50 shadow-[0_0_15px_rgba(255,115,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                
                {/* 100% Vertically & Horizontally Centered Icon */}
                <div className="flex items-center justify-center relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <item.icon className={cn(
                    'w-5 h-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isActive ? 'stroke-[2.5] text-primary scale-110' : 'stroke-[1.75] text-muted-foreground opacity-75'
                  )} />
                </div>
                
                {/* Smooth Animated Text Label */}
                <span className={cn(
                  'text-[9.5px] relative z-10 tracking-tight leading-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center pointer-events-none text-center',
                  isShrunk
                    ? 'opacity-0 scale-50 max-h-0 overflow-hidden mt-0 pointer-events-none hidden'
                    : 'opacity-100 scale-100 max-h-4 mt-0.5',
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
