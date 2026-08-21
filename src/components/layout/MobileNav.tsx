'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
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

  // Instagram iOS 26 dynamic scroll shrink detection
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const diff = latest - lastScrollY.current;
    if (latest > 70 && diff > 8) {
      // Scrolling down -> shrink to compact liquid pill
      setIsShrunk(true);
    } else if (diff < -6 || latest < 25) {
      // Scrolling up or near top -> expand back smoothly
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
        bottom: 'calc(0.6rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* 2026 Instagram-style Liquid Glass Morphing Capsule */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 360,
          damping: 28,
          mass: 0.7,
        }}
        className={cn(
          'pointer-events-auto relative mx-auto transform-gpu will-change-transform touch-manipulation',
          // Dynamic responsive width morphing on Mobile S, M, L
          isShrunk
            ? 'w-[82%] max-w-[270px] xs:max-w-[295px] sm:max-w-[325px]' // Shrunk compact pill
            : 'w-[94%] max-w-[320px] xs:max-w-[365px] sm:max-w-[400px]', // Expanded full pill
          'rounded-full overflow-hidden p-1',
          // Ultra-Premium Liquid Glass Material
          'bg-[#0B0D14]/80 backdrop-blur-3xl backdrop-saturate-200',
          'border border-white/20 dark:border-white/15',
          'shadow-[0_16px_45px_rgba(0,0,0,0.75),0_0_25px_rgba(249,115,22,0.18),inset_0_1px_1.5px_rgba(255,255,255,0.4)]'
        )}
      >
        {/* Top Edge Specular Reflex */}
        <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20" />

        {/* Grid of 5 Navigation Tabs with Ergonomic Touch Targets */}
        <motion.div
          layout
          className={cn(
            'relative grid grid-cols-5 items-center w-full transition-all duration-300',
            isShrunk ? 'h-[38px] sm:h-[40px]' : 'h-[52px] sm:h-[56px]'
          )}
        >
          {/* Active Tab Pill — Completely flush, full-height, zero gaps */}
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
                stiffness: 400,
                damping: 28,
                mass: 0.75,
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
                  'relative z-10 flex flex-col items-center justify-center w-full h-full rounded-full transition-all duration-200 select-none active:scale-90',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {/* Icon Container (Centered & Ergonomic) */}
                <motion.div
                  layout
                  className="relative flex items-center justify-center"
                >
                  <Icon
                    className={cn(
                      'transition-all duration-200',
                      isShrunk
                        ? 'w-[18px] h-[18px] sm:w-[19px] sm:h-[19px]'
                        : 'w-[19px] h-[19px] sm:w-[20px] sm:h-[20px]',
                      isActive
                        ? 'stroke-[2.5] scale-110 text-primary drop-shadow-[0_0_8px_rgba(249,115,22,0.65)]'
                        : 'stroke-[1.8] opacity-75 hover:opacity-100'
                    )}
                  />
                </motion.div>

                {/* Text Label — Smooth Fade Morph with Clean Typography & Zero Letter Clipping */}
                <AnimatePresence initial={false}>
                  {!isShrunk && (
                    <motion.span
                      initial={{ opacity: 0, height: 0, scale: 0.85 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.85 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        'text-[9.5px] xs:text-[10px] sm:text-[10.5px] font-heading tracking-tight leading-tight pb-0.5 text-center mt-0.5 transition-colors duration-200',
                        isActive
                          ? 'font-bold text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                          : 'font-medium opacity-80'
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </motion.div>
      </motion.div>
    </nav>
  );
}
