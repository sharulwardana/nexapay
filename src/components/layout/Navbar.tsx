'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchStore } from '@/store/globalStore';
import { getLoyaltyRank } from '@/store/userStore';
import MarqueePromo from '@/components/shared/MarqueePromo';
import { useSoundEffect } from '@/hooks/useSoundEffect';

// Refactored Components
import NavLinks from './navbar/NavLinks';
import NavInlineSearch from './navbar/NavInlineSearch';
import NavNotifications from './navbar/NavNotifications';
import NavCart from './navbar/NavCart';
import NavUserMenu from './navbar/NavUserMenu';
import NavMobileMenu from './navbar/NavMobileMenu';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  
  const { playHover, playClick } = useSoundEffect();
  const { setIsOpen: setSearchOpen } = useSearchStore();
  const [mounted, setMounted] = useState(false);

  // Loyalty calculations — use shared getLoyaltyRank() (single source of truth)
  const points = session?.user?.loyaltyPoints || 0;
  const { rank, nextRank, progressPercent } = getLoyaltyRank(points);

  const closeAllMenus = () => {
    setIsProfileOpen(false);
    setIsNotifOpen(false);
    setIsCartOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    closeAllMenus();
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
          'border-b bg-background/90 backdrop-blur-2xl border-border/40',
          'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_20px_rgba(0,0,0,0.03)]',
          'dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_20px_rgba(0,0,0,0.15)]'
        )}
      >
        {/* Gradient accent line at the very top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <MarqueePromo />
        <div className="container-app">
          <div className="flex items-center justify-between h-14 tablet:h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-7 h-7 tablet:w-8 tablet:h-8">
                <div className="absolute inset-0 rounded-lg gradient-primary shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-sm tablet:text-base">N</span>
                </div>
              </div>
              <span className="hidden min-[360px]:inline font-heading font-bold text-base tablet:text-lg tracking-tight">
                <span className="text-foreground">Nexa</span>
                <span className="text-muted-foreground">Pay</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <NavLinks />

            {/* Actions (Search, Notif, Cart, Profile, Mobile Menu) */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <NavInlineSearch />

              <NavNotifications 
                isOpen={isNotifOpen} 
                onToggle={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); setIsCartOpen(false); }} 
              />
              <NavCart 
                isOpen={isCartOpen} 
                onToggle={() => { setIsCartOpen(!isCartOpen); setIsNotifOpen(false); setIsProfileOpen(false); }}
                closeAll={closeAllMenus}
              />

              <div className="hidden lg:block ml-2">
                <NavUserMenu 
                  isOpen={isProfileOpen}
                  onToggle={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); setIsCartOpen(false); }}
                  closeAll={closeAllMenus}
                  isLoggedIn={isLoggedIn}
                  session={session}
                  points={points}
                  rank={rank}
                  nextRank={nextRank}
                  progressPercent={progressPercent}
                />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all lg:hidden ml-1"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mounted && (
        <NavMobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
          isLoggedIn={isLoggedIn} 
          session={session} 
        />
      )}
    </>
  );
}
