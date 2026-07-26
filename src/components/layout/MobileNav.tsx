'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Home, Gamepad2, ShoppingBag, Ticket, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import LiquidGlass from '@/components/shared/LiquidGlass';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/topup', icon: Gamepad2, label: 'Top Up' },
  { href: '/products', icon: ShoppingBag, label: 'Produk' },
  { href: '/promo', icon: Ticket, label: 'Promo' },
  { href: '/dashboard', icon: User, label: 'Akun' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [isShrunk, setIsShrunk] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    // When scrolling down past 80px, shrink dock (Instagram style)
    if (latest > previous && latest > 80) {
      setIsShrunk(true);
    } else if (latest < previous || latest < 40) {
      setIsShrunk(false);
    }
  });

  // Hide MobileNav on admin pages and on topup detail pages for clean 1-bar unified checkout UX
  const isTopUpDetailPage = pathname.startsWith('/topup/') && pathname.split('/').length > 2;
  if (pathname.startsWith('/admin') || isTopUpDetailPage) {
    return null;
  }

  return (
    <motion.nav
      initial={false}
      animate={{
        width: isShrunk ? '320px' : '100%',
        y: 0,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="fixed bottom-3 left-0 right-0 z-50 lg:hidden max-w-md mx-auto px-3 pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Liquid Glass Capsule Floating Dock */}
      <LiquidGlass
        displacementScale={55}
        blurAmount={0.15}
        saturation={140}
        aberrationIntensity={1.8}
        elasticity={0.25}
        cornerRadius={28}
        className="pointer-events-auto w-full shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(255,115,0,0.15)] overflow-hidden"
      >
        <motion.div
          animate={{
            height: isShrunk ? '46px' : '56px',
            paddingTop: isShrunk ? '4px' : '6px',
            paddingBottom: isShrunk ? '4px' : '6px',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="w-full h-full"
        >
        <div className="flex items-center justify-around h-full relative z-10 px-1">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center flex-1 h-full rounded-[20px] transition-all duration-300 select-none px-1',
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground active:scale-95'
                )}
              >
                {/* Floating Liquid Active Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="liquid-dock-pill"
                    className="absolute inset-0 bg-gradient-to-r from-primary/25 via-primary/35 to-accent/25 rounded-[20px] border border-primary/50 shadow-[0_0_15px_rgba(255,115,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon className={cn(
                  'relative z-10 transition-all duration-300',
                  isShrunk ? 'w-5 h-5' : 'w-4.5 h-4.5',
                  isActive ? 'scale-110 stroke-[2.5] text-primary' : 'opacity-80'
                )} />
                
                {/* Text Label - Hidden when shrunk (Instagram Style) */}
                <AnimatePresence initial={false}>
                  {!isShrunk && (
                    <motion.span
                      initial={{ opacity: 0, height: 0, scale: 0.8 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.8 }}
                      transition={{ duration: 0.18, ease: 'easeInOut' }}
                      className={cn(
                        'text-[10px] relative z-10 tracking-tight transition-colors overflow-hidden leading-none mt-0.5 hidden min-[360px]:block',
                        isActive ? 'font-black text-primary' : 'font-medium'
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </LiquidGlass>
  </motion.nav>
  );
}
