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

  // Smooth scroll shrink detection (Instagram iOS 26 dynamic morph)
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const diff = latest - lastScrollY.current;
    if (latest > 80 && diff > 10) {
      // Scrolling down steadily -> shrink to compact floating pill
      setIsShrunk(true);
    } else if (diff < -10 || latest < 35) {
      // Scrolling up steadily or near top -> expand back smoothly
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
      className="fixed inset-x-0 z-50 lg:hidden pointer-events-none flex justify-center px-2.5 sm:px-4"
      style={{
        // Snug fit just above Safari toolbar and Android navigation
        bottom: 'max(0.5rem, calc(env(safe-area-inset-bottom, 0px) - 1.2rem))',
      }}
    >
      {/* 2026 Instagram-style Liquid Glass Morphing Capsule (Clean, Airy, Zero Dark Shadow) */}
      <div
        className={cn(
          'pointer-events-auto relative mx-auto transform-gpu will-change-transform touch-manipulation',
          // Ultra-smooth 120 FPS hardware-accelerated CSS transition (Zero jank on Android/iOS)
          'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          // Dynamic responsive width & height morphing on Mobile S, M, L
          isShrunk
            ? 'w-[76%] max-w-[255px] xs:max-w-[280px] sm:max-w-[305px] h-[40px] sm:h-[42px]' // Shrunk compact pill
            : 'w-[94%] max-w-[340px] xs:max-w-[375px] sm:max-w-[415px] h-[54px] sm:h-[58px]', // Expanded generous pill
          'rounded-full overflow-hidden p-1',
          // Ultra-Clean Airy Liquid Glass (VisionOS & iOS 26)
          'bg-[#0B0D14]/80 backdrop-blur-2xl backdrop-saturate-200',
          'border border-white/20 dark:border-white/15',
          // Soft diffuse ambient shadow — NO heavy black murky shadows
          'shadow-[0_10px_30px_rgba(0,0,0,0.35),0_0_15px_rgba(249,115,22,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.35)]'
        )}
      >
        {/* Top Edge Specular Reflex */}
        <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20" />

        {/* Grid of 5 Navigation Tabs with Ergonomic Touch Targets */}
        <div className="relative grid grid-cols-5 items-center h-full w-full">
          {/* Active Tab Pill — 100% PURE Horizontal Glide (Zero diagonal jumping / Zero matrix bugs) */}
          {activeIndex !== -1 && (
            <div
              className={cn(
                'absolute inset-y-0 w-1/5 rounded-full pointer-events-none z-0',
                'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform',
                // Full Capsule Liquid Glow
                'bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10',
                'border border-primary/50',
                'shadow-[0_0_18px_rgba(249,115,22,0.35),inset_0_1px_2px_rgba(255,255,255,0.45)]'
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
                  'transition-all duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {/* Icon Container (Generous & Centered) */}
                <div className="relative flex items-center justify-center transition-transform duration-200">
                  <Icon
                    className={cn(
                      'transition-all duration-200',
                      isShrunk
                        ? 'w-[18px] h-[18px] sm:w-[19px] sm:h-[19px]'
                        : 'w-[19px] h-[19px] sm:w-[21px] sm:h-[21px]',
                      isActive
                        ? 'stroke-[2.5] scale-110 text-primary drop-shadow-[0_0_8px_rgba(249,115,22,0.65)]'
                        : 'stroke-[1.8] opacity-75 hover:opacity-100'
                    )}
                  />
                </div>

                {/* Text Label — Smooth Fade (Clean Typography, Zero Clipping on letter 'g') */}
                <span
                  className={cn(
                    'font-heading tracking-tight leading-tight pb-0.5 text-center transition-all duration-200 origin-center',
                    'text-[9.5px] xs:text-[10px] sm:text-[10.5px]',
                    isShrunk
                      ? 'opacity-0 max-h-0 scale-75 mt-0 pointer-events-none overflow-hidden'
                      : 'opacity-100 max-h-4 scale-100 mt-0.5',
                    isActive
                      ? 'font-bold text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                      : 'font-medium opacity-80'
                  )}
                >
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
