'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, LogOut, User, Wallet, Gamepad2, Gift, Smartphone, Zap, Tv, Receipt, Search, ShieldCheck } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';

interface NavMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  session: any;
}

const productCategories = [
  { name: 'Game Top Up', href: '/topup', icon: Gamepad2 },
  { name: 'Voucher', href: '/products?cat=VOUCHER', icon: Gift },
  { name: 'Pulsa & Data', href: '/products?cat=PULSA', icon: Smartphone },
  { name: 'Token PLN', href: '/products?cat=PLN', icon: Zap },
  { name: 'Streaming', href: '/products?cat=STREAMING', icon: Tv },
  { name: 'E-Wallet', href: '/products?cat=EWALLET_TOPUP', icon: Wallet },
];

export default function NavMobileMenu({ isOpen, onClose, isLoggedIn, session }: NavMobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [invoiceInput, setInvoiceInput] = useState('');

  const handleTrackInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceInput.trim()) return;
    const cleanId = invoiceInput.trim().toUpperCase();
    onClose();
    router.push(`/payment-status/${cleanId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] z-[70] bg-background border-l border-border overflow-y-auto lg:hidden"
          >
            <div className="flex items-center justify-between h-14 pl-4 pr-6 border-b border-border/40 flex-shrink-0 mt-[29px]">
              <span className="font-heading font-bold text-base">
                Nexa<span className="text-muted-foreground">Pay</span>
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>

            <div className="p-4 pb-28 tablet:pb-32">

              {/* User Profile Card / Admin Button at VERY TOP for instant zero-scroll access */}
              <div className="mb-5 space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-br from-card to-muted/60 border border-border shadow-sm">
                      <div className="flex items-center gap-3">
                        {session?.user?.image ? (
                          <img src={session.user.image} alt="Profile" className="w-10 h-10 rounded-full border border-primary/30" />
                        ) : (
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-sm truncate max-w-[130px] text-foreground">{session?.user?.name || 'User'}</p>
                            {session?.user?.role === 'ADMIN' && (
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-black tracking-wider border border-amber-500/30">ADMIN</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5 text-primary">
                            <Wallet className="w-3 h-3" />
                            <span className="text-[11px] font-bold font-mono">{formatCurrency(session?.user?.walletBalance || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {session?.user?.role === 'ADMIN' && (
                      <Link 
                        href="/admin" 
                        onClick={onClose} 
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-primary/20 to-accent/20 text-amber-300 text-xs font-bold border border-amber-500/30 hover:border-amber-500/50 shadow-md transition-all"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" /> Control Panel Admin 🛡️
                      </Link>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link href="/dashboard" onClick={onClose} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted/60 text-xs font-medium hover:bg-muted transition-colors">
                        <User className="w-3.5 h-3.5" /> Dashboard
                      </Link>

                      <button onClick={() => { signOut(); onClose(); }} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors">
                        <LogOut className="w-3.5 h-3.5" /> Keluar
                      </button>
                    </div>
                  </>
                ) : (
                  <Link href="/login" onClick={onClose} className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl gradient-primary text-white text-xs font-bold shadow-neon-violet transition-all hover:shadow-[0_0_15px_rgba(255,115,0,0.5)]">
                    <LogIn className="w-4 h-4" /> Login / Daftar
                  </Link>
                )}
              </div>

              <div className="h-px w-full bg-border/40 mb-4" />

              <nav className="space-y-0.5 mb-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
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
                <p className="px-3 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Kategori</p>
                {productCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={onClose}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <cat.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
