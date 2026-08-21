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

  // Buttery smooth scroll hysteresis filter (Zero flutter / Zero rapid toggle)
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const diff = latest - lastScrollY.current;
    
    // Accumulate directional scroll delta
    if (diff > 0) {
      scrollDelta.current = Math.max(0, scrollDelta.current) + diff;
    } else {
      scrollDelta.current = Math.min(0, scrollDelta.current) + diff;
    }

    // Only morph on sustained, deliberate scrolling
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
      aria-label="Navigasi Mobile Liquid Glass iOS 26"
      className="fixed inset-x-0 z-50 lg:hidden pointer-events-none flex justify-center px-2"
      style={{
        bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* 2026 Proportional Large Stadium Capsule (Enlarged across Mobile S, M, L with 100% Identical Precise Aspect Ratio) */}
      <div
        className={cn(
          'pointer-events-auto relative mx-auto transform-gpu will-change-[width,height] touch-manipulation backface-hidden',
          // Ultra-smooth 120 FPS hardware-accelerated CSS transition
          'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          // Proportionally Enlarged 2D Morphing
          isShrunk
            ? 'w-[80%] max-w-[305px] xs:max-w-[335px] sm:max-w-[365px] h-[48px] sm:h-[50px]' // Shrunk large compact
            : 'w-[96%] max-w-[420px] xs:max-w-[460px] sm:max-w-[500px] h-[62px] sm:h-[66px]', // Expanded Large Stadium Pill
          'rounded-full overflow-hidden p-[3px]', // Exact uniform margin
          // Pure Crystal Translucent Liquid Glass (Zero Black Shadow on ANY page)
          'bg-white/[0.08] dark:bg-white/[0.06] backdrop-blur-2xl backdrop-saturate-150',
          'border border-white/20 dark:border-white/15',
          'shadow-[0_0_20px_rgba(249,115,22,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(255,255,255,0.1)]'
        )}
      >
        {/* Top Edge Specular Reflex */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20" />

        {/* 5 Strictly Equal 20% Columns Grid */}
        <div className="relative grid grid-cols-5 items-center h-full w-full">
          {/* Active Tab Bubble — Large Proportional Stadium Capsule (Identical Shape) */}
          {activeIndex !== -1 && (
            <div
              className={cn(
                'absolute inset-0 w-1/5 h-full rounded-full pointer-events-none z-0',
                'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform',
                // Glowing Cyber Orange Theme Liquid Capsule
                'bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10',
                'border border-primary/50',
                'shadow-[0_0_14px_rgba(249,115,22,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.4)]'
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
                  'relative z-10 flex flex-col items-center justify-center w-full h-full rounded-full select-none active:scale-90',
                  'transition-colors duration-200 px-0.5',
                  isActive ? 'text-primary font-bold' : 'text-zinc-400 hover:text-white'
                )}
              >
                {/* Fixed-Position Icon Container (Enlarged & Immune to any vertical jumps) */}
                <div className="relative flex items-center justify-center w-full">
                  <Icon
                    className={cn(
                      'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      isShrunk
                        ? 'w-[19px] h-[19px] sm:w-[20px] sm:h-[20px]'
                        : 'w-[21px] h-[21px] sm:w-[23px] sm:h-[23px]',
                      isActive
                        ? 'stroke-[2.5] text-primary drop-shadow-[0_0_8px_rgba(249,115,22,0.65)]'
                        : 'stroke-[1.8] opacity-75 hover:opacity-100 text-zinc-300'
                    )}
                  />
                </div>

                {/* Sub-grid CSS Smooth Height Collapse for Label (Enlarged Crisp Typography) */}
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden',
                    isShrunk ? 'grid-rows-[0fr] opacity-0 mt-0' : 'grid-rows-[1fr] opacity-100 mt-1'
                  )}
                >
                  <span
                    className={cn(
                      'font-heading tracking-tight leading-none text-center min-h-0 overflow-hidden pb-0.5',
                      'text-[10px] xs:text-[10.5px] sm:text-[11px]',
                      isActive
                        ? 'font-bold text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                        : 'font-medium text-zinc-300'
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
