'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Menu, X, User,
  ChevronDown, LogIn, Gamepad2, Zap, Gift, Smartphone, Tv, Wallet, Star, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import { useNotificationStore, useSearchStore } from '@/stores/globalStore';
import { useUserStore, useUserGamification } from '@/store/userStore';
import MarqueePromo from '@/components/shared/MarqueePromo';
import { useSoundEffect } from '@/hooks/useSoundEffect';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  
  const { playHover, playClick } = useSoundEffect();
  const { unreadCount } = useNotificationStore();
  const { setIsOpen: setSearchOpen } = useSearchStore();
  const [mounted, setMounted] = useState(false);
  const user = useUserStore();
  const { rank, nextRank, progressPercent } = useUserGamification();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const productCategories = [
    { name: 'Game Top Up', href: '/topup', icon: Gamepad2 },
    { name: 'Voucher', href: '/products?cat=VOUCHER', icon: Gift },
    { name: 'Pulsa & Data', href: '/products?cat=PULSA', icon: Smartphone },
    { name: 'Token PLN', href: '/products?cat=PLN', icon: Zap },
    { name: 'Streaming', href: '/products?cat=STREAMING', icon: Tv },
    { name: 'E-Wallet', href: '/products?cat=EWALLET_TOPUP', icon: Wallet },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
          isScrolled
            ? 'glass border-b border-border/50'
            : 'bg-transparent'
        )}
      >
        <MarqueePromo />
        <div className="container-app">
          <div className="flex items-center justify-between h-14 tablet:h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-7 h-7 tablet:w-8 tablet:h-8">
                <div className="absolute inset-0 rounded-lg gradient-primary" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-sm tablet:text-base">N</span>
                </div>
              </div>
              <span className="font-heading font-bold text-base tablet:text-lg tracking-tight">
                <span className="text-foreground">Nexa</span>
                <span className="text-muted-foreground">Pay</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                if (link.label === 'Produk Digital') {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => setIsProductDropdownOpen(true)}
                      onMouseLeave={() => setIsProductDropdownOpen(false)}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors',
                          isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {link.label}
                        <ChevronDown className="w-3 h-3" />
                      </Link>

                      <AnimatePresence>
                        {isProductDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.98 }}
                            className="absolute top-full left-0 mt-1 w-56 p-1.5 rounded-xl glass-card border shadow-xl"
                          >
                            {productCategories.map((cat) => (
                              <Link
                                key={cat.href}
                                href={cat.href}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <cat.icon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-[13px] font-medium">{cat.name}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => { playClick(); setSearchOpen(true); }}
                onMouseEnter={playHover}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* User Profile */}
              <div className="hidden lg:block ml-2 relative">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border/50 hover:border-primary/50 bg-card/50 hover:bg-muted transition-all group"
                    >
                      {session?.user?.image ? (
                        <img src={session.user.image} alt="Avatar" className="w-6 h-6 rounded-full bg-primary/20" />
                      ) : (
                        <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-[10px] font-bold">
                          {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="text-[11px] font-bold leading-none max-w-[80px] truncate">{session?.user?.name || 'User'}</span>
                        <span className={cn("text-[9px] font-black tracking-wider uppercase", rank.color)}>{rank.name}</span>
                      </div>
                      <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full right-0 mt-2 w-64 glass-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 p-4"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            {session?.user?.image ? (
                              <img src={session.user.image} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-primary/50" />
                            ) : (
                              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg border-2 border-primary/50">
                                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-bold truncate max-w-[120px]">{session?.user?.name || 'User'}</p>
                              <div className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider", rank.bg, rank.color)}>
                                <Star className="w-3 h-3 fill-current" />
                                {rank.name}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 mb-4">
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                              <span>EXP</span>
                              <span>{user.exp} / {nextRank ? nextRank.minExp : 'MAX'}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div className={cn("h-full transition-all duration-1000", rank.bg.replace('/20', ''))} style={{ width: `${progressPercent}%`, backgroundColor: 'currentColor' }} />
                            </div>
                            <p className="text-[9px] text-muted-foreground text-center">
                              {nextRank ? `Butuh ${nextRank.minExp - user.exp} EXP lagi menuju ${nextRank.name}` : 'Pangkat Tertinggi Tercapai!'}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-border/50 grid grid-cols-2 gap-2">
                            <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary text-xs font-medium transition-colors">
                              <User className="w-3.5 h-3.5" /> Dashboard
                            </Link>
                            <button onClick={() => { signOut(); setIsProfileOpen(false); }} className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors">
                              <LogOut className="w-3.5 h-3.5" /> Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 px-4 py-1.5 rounded-full gradient-primary hover:shadow-lg hover:shadow-primary/20 text-white font-medium text-[13px] transition-all">
                    <LogIn className="w-4 h-4" />
                    <span>Masuk</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors lg:hidden ml-1"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu — clean slide */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] z-50 bg-background border-l border-border overflow-y-auto lg:hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-heading font-bold text-base">
                    Nexa<span className="text-muted-foreground">Pay</span>
                  </span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-muted" aria-label="Close menu">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-0.5 mb-6">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        pathname === link.href
                          ? 'text-foreground bg-muted'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="space-y-0.5 mb-6">
                  <p className="label px-3 mb-2">Kategori</p>
                  {productCategories.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <cat.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{cat.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-muted/30 border border-border">
                        {session?.user?.image ? (
                          <img src={session.user.image} alt="Profile" className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm truncate max-w-[150px]">{session?.user?.name || 'User'}</p>
                          <div className="flex items-center gap-1 mt-0.5 text-primary">
                            <Wallet className="w-3 h-3" />
                            <span className="text-[10px] font-bold font-mono">Rp 0</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-muted/50 text-sm">
                        <User className="w-4 h-4" /> Dashboard Akun
                      </Link>
                      
                      <button onClick={() => signOut()} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-red-500/10 text-red-500 text-sm">
                        <LogOut className="w-4 h-4" /> Keluar
                      </button>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg btn-primary text-sm">
                      <LogIn className="w-4 h-4" /> Login / Daftar
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
