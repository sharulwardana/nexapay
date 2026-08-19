'use client';

import { useState, useRef } from 'react';
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

  // Determine active tab index
  const activeIndex = navItems.findIndex((item) => {
    if (item.href === '/') {
      return pathname === '/';
    }
    return pathname === item.href || pathname.startsWith(item.href + '/');
  });

  return (
    <nav
      className="fixed bottom-3 left-0 right-0 z-50 lg:hidden px-3 pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className={cn(
          "pointer-events-auto max-w-[340px] tablet:max-w-[440px] w-[90%] mx-auto rounded-full",
          "bg-[#0e1017] border border-white/15 shadow-none",
          "p-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
          isShrunk ? "h-[44px] tablet:h-[48px] scale-[0.97]" : "h-[54px] tablet:h-[60px] scale-100"
        )}
      >
        <div className="relative grid grid-cols-5 items-center justify-center h-full w-full">
          {/* Persistent Gliding Active Pill (Single DOM Element - 100% Smooth Horizontal Glide) */}
          {activeIndex !== -1 && (
            <motion.div
              className="absolute top-0 bottom-0 rounded-full bg-primary/20 border border-primary/50 pointer-events-none z-0"
              initial={false}
              animate={{
                left: `${activeIndex * 20}%`,
                width: '20%',
              }}
              transition={{
                type: 'spring',
                stiffness: 450,
                damping: 32,
              }}
            />
          )}

          {navItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative z-10 flex flex-col items-center justify-center w-full h-full rounded-full select-none"
              >
                {/* Icon */}
                <div className="flex items-center justify-center relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <item.icon className={cn(
                    'w-5 h-5 tablet:w-[22px] tablet:h-[22px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isActive 
                      ? 'stroke-[2.5] text-primary scale-110 drop-shadow-[0_0_6px_rgba(255,115,0,0.3)]' 
                      : 'stroke-[1.75] text-muted-foreground opacity-60'
                  )} />
                </div>
                
                {/* Label */}
                <span className={cn(
                  'text-[9.5px] tablet:text-xs relative z-10 tracking-tight leading-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center pointer-events-none text-center',
                  isShrunk
                    ? 'opacity-0 scale-50 max-h-0 overflow-hidden mt-0 pointer-events-none hidden'
                    : 'opacity-100 scale-100 max-h-4 mt-0.5 tablet:mt-1',
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
