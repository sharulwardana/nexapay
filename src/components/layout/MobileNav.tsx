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

  // Stable scroll threshold: only triggers on deliberate scroll (zero jitter / zero twitching)
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const diff = latest - lastScrollY.current;
    if (latest > 120 && diff > 15) {
      setIsShrunk(true);
    } else if (diff < -15 || latest < 40) {
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
      className="fixed inset-x-0 z-50 lg:hidden pointer-events-none flex justify-center px-3"
      style={{
        // Snug fit: sits right above Safari iOS toolbar and Android gesture bar without huge gap
        bottom: 'max(0.45rem, calc(env(safe-area-inset-bottom, 0px) - 1.25rem))',
      }}
    >
      {/* 2026 Instagram-style Liquid Glass Morphing Capsule (Rock-Solid Stability, Zero Wobble) */}
      <div
        className={cn(
          'pointer-events-auto relative mx-auto transform-gpu will-change-transform touch-manipulation',
          // Ultra-smooth 60/120 FPS CSS transition
          'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          // Stable width across Mobile S, M, L (avoids any horizontal active pill wobble)
          'w-[94%] max-w-[365px] xs:max-w-[400px] sm:max-w-[435px]',
          // Dynamic height morphing: 56px (expanded) -> 42px (compact)
          isShrunk ? 'h-[42px] sm:h-[44px]' : 'h-[56px] sm:h-[60px]',
          'rounded-full overflow-hidden p-1',
          // Ultra-Premium Liquid Glass Material (VisionOS / iOS 26)
          'bg-[#0B0D14]/85 backdrop-blur-2xl backdrop-saturate-200',
          'border border-white/20 dark:border-white/15',
          'shadow-[0_16px_45px_rgba(0,0,0,0.75),0_0_25px_rgba(249,115,22,0.18),inset_0_1px_1.5px_rgba(255,255,255,0.4)]'
        )}
      >
        {/* Top Edge Specular Reflex */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20" />

        {/* Grid of 5 Navigation Tabs with Rock-Solid Position & Ergonomic Touch Targets */}
        <div className="relative grid grid-cols-5 items-center h-full w-full">
          {/* Active Tab Pill — Flush, zero gaps, rock-solid X position */}
          {activeIndex !== -1 && (
            <motion.div
              layoutId="instagramActivePill"
              className={cn(
                'absolute inset-y-0 rounded-full pointer-events-none z-0',
                'bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10',
                'border border-primary/50',
                'shadow-[0_0_20px_rgba(249,115,22,0.35),inset_0_1px_2px_rgba(255,255,255,0.45)]'
              )}
              initial={false}
              animate={{
                left: `${activeIndex * 20}%`,
                width: '20%',
              }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 30,
                mass: 0.7,
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
                {/* Icon Container (Rock-Solid Centered Position) */}
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={cn(
                      'transition-all duration-200',
                      'w-[19px] h-[19px] sm:w-[21px] sm:h-[21px]',
                      isActive
                        ? 'stroke-[2.5] scale-110 text-primary drop-shadow-[0_0_8px_rgba(249,115,22,0.65)]'
                        : 'stroke-[1.8] opacity-75 hover:opacity-100'
                    )}
                  />
                </div>

                {/* Text Label — Smooth Fade (Zero Jitter, Zero Clipping) */}
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
