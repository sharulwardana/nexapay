'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchStore } from '@/store/globalStore';
import { getLoyaltyRank } from '@/store/userStore';
import { useSoundEffect } from '@/hooks/useSoundEffect';

// Sub-components
import NavLinks from './navbar/NavLinks';
import NavInlineSearch from './navbar/NavInlineSearch';
import NavNotifications from './navbar/NavNotifications';
import NavCart from './navbar/NavCart';
import NavUserMenu from './navbar/NavUserMenu';
import NavMobileMenu from './navbar/NavMobileMenu';
import CurrencySwitcher from '@/components/shared/CurrencySwitcher';

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

  // Loyalty calculations
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
          'bg-[#0B0E14]/80 backdrop-blur-xl border-b border-white/[0.08]',
          'shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
        )}
      >
        {/* Specular top highlight line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        <div className="container-app">
          <div className="flex items-center justify-between h-14 tablet:h-16">
            
            {/* Logo with Canonical Orange */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group select-none min-w-0">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#FF7300] to-[#E66800] flex items-center justify-center shadow-md shadow-[#FF7300]/25 group-hover:shadow-lg group-hover:shadow-[#FF7300]/40 transition-all duration-200 border border-white/20 flex-shrink-0">
                <span className="text-white font-heading font-extrabold text-xs sm:text-base tracking-tight">N</span>
              </div>
              <span className="font-heading font-bold text-sm sm:text-base tablet:text-lg tracking-tight truncate">
                <span className="text-foreground">Nexa</span>
                <span className="text-primary">Pay</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <NavLinks />

            {/* Actions (Search, Currency, Notifications, Cart, Profile, Mobile Menu) */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              <NavInlineSearch />

              <div className="hidden tablet:block">
                <CurrencySwitcher compact />
              </div>

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

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all lg:hidden ml-0.5 sm:ml-1 active:scale-95"
                aria-label="Menu Navigasi"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
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
