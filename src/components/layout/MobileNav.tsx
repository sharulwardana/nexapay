'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScroll, useMotionValueEvent } from 'framer-motion';
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
  const scrollDelta = useRef(0);

  // Smooth scroll hysteresis filter
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const diff = latest - lastScrollY.current;
    
    if (diff > 0) {
      scrollDelta.current = Math.max(0, scrollDelta.current) + diff;
    } else {
      scrollDelta.current = Math.min(0, scrollDelta.current) + diff;
    }

    if (latest > 100 && scrollDelta.current > 35) {
      setIsShrunk(true);
    } else if (scrollDelta.current < -25 || latest < 30) {
      setIsShrunk(false);
    }

    lastScrollY.current = latest;
  });

  // Hide on admin routes and product checkout detail pages
  const isTopUpDetailPage = pathname.startsWith('/topup/') && pathname !== '/topup';
  const isProductDetailPage = pathname.startsWith('/products/') && pathname !== '/products';
  if (pathname.startsWith('/admin') || isTopUpDetailPage || isProductDetailPage) {
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
      aria-label="Navigasi Utama"
      className="fixed inset-x-0 z-50 tablet:hidden pointer-events-none flex justify-center px-2"
      style={{
        bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Refined Contextual Liquid Glass Dock */}
      <div
        className={cn(
          'pointer-events-auto relative mx-auto transform-gpu will-change-[width,height] touch-manipulation',
          'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isShrunk
            ? 'w-[82%] max-w-[310px] xs:max-w-[340px] sm:max-w-[370px] h-[50px]'
            : 'w-[96%] max-w-[420px] xs:max-w-[460px] sm:max-w-[500px] h-[64px]',
          'rounded-full overflow-hidden p-1',
          'bg-[#0E121B]/85 backdrop-blur-2xl backdrop-saturate-150',
          'border border-white/15',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_2px_10px_rgba(0,0,0,0.2)]'
        )}
      >
        {/* Specular Edge Line */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20" />

        {/* 5 Equal Columns */}
        <div className="relative grid grid-cols-5 items-center h-full w-full">
          {/* Active Tab Highlight Pill */}
          {activeIndex !== -1 && (
            <div
              className={cn(
                'absolute inset-0 w-1/5 h-full rounded-full pointer-events-none z-0',
                'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform',
                'bg-gradient-to-b from-[#FF7300]/20 to-[#FF7300]/10',
                'border border-[#FF7300]/40',
                'shadow-[0_0_12px_rgba(255,115,0,0.25),inset_0_1px_0_rgba(255,255,255,0.25)]'
              )}
              style={{
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />
          )}

          {navItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
                className={cn(
                  'relative z-10 flex flex-col items-center justify-center w-full h-full rounded-full select-none active:scale-95',
                  'transition-colors duration-200 px-0.5 min-h-[44px]',
                  isActive ? 'text-[#FF7300] font-bold' : 'text-slate-400 hover:text-white'
                )}
              >
                {/* Icon Container */}
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={cn(
                      'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      isShrunk ? 'w-[18px] h-[18px]' : 'w-[20px] h-[20px]',
                      isActive
                        ? 'stroke-[2.2] text-[#FF7300]'
                        : 'stroke-[1.8] text-slate-400'
                    )}
                  />
                </div>

                {/* Text Label */}
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden',
                    isShrunk ? 'grid-rows-[0fr] opacity-0 mt-0' : 'grid-rows-[1fr] opacity-100 mt-1'
                  )}
                >
                  <span
                    className={cn(
                      'font-heading tracking-tight leading-none text-center min-h-0 overflow-hidden pb-0.5',
                      'text-[10px] xs:text-[11px]',
                      isActive
                        ? 'font-bold text-[#FF7300]'
                        : 'font-medium text-slate-300'
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
