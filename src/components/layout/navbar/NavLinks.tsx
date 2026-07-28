'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Gamepad2, Gift, Smartphone, Zap, Tv, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';

const productCategories = [
  { name: 'Game Top Up', href: '/topup', icon: Gamepad2 },
  { name: 'Voucher', href: '/products?category=VOUCHER', icon: Gift },
  { name: 'Pulsa & Data', href: '/products?category=PULSA', icon: Smartphone },
  { name: 'Token PLN', href: '/products?category=PLN', icon: Zap },
  { name: 'Streaming', href: '/products?category=STREAMING', icon: Tv },
  { name: 'E-Wallet', href: '/products?category=EWALLET', icon: Wallet },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  return (
    <nav className="hidden lg:flex items-center gap-0.5 laptop-l:gap-1 flex-shrink-0">
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
                  'flex items-center gap-1 px-2 laptop-l:px-3 py-1.5 rounded-lg text-xs laptop-l:text-[13px] font-medium transition-colors whitespace-nowrap',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
                <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', isProductDropdownOpen && 'rotate-180')} />
              </Link>

              <AnimatePresence>
                {isProductDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="absolute top-full left-0 mt-1 w-56 p-1.5 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl z-50"
                  >
                    {productCategories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className="group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <cat.icon className="w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
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
              'px-2 laptop-l:px-3 py-1.5 rounded-lg text-xs laptop-l:text-[13px] font-medium transition-colors whitespace-nowrap',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
