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
  { name: 'Voucher', href: '/products?cat=VOUCHER', icon: Gift },
  { name: 'Pulsa & Data', href: '/products?cat=PULSA', icon: Smartphone },
  { name: 'Token PLN', href: '/products?cat=PLN', icon: Zap },
  { name: 'Streaming', href: '/products?cat=STREAMING', icon: Tv },
  { name: 'E-Wallet', href: '/products?cat=EWALLET_TOPUP', icon: Wallet },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  return (
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
                    className="absolute top-full left-0 mt-1 w-56 p-1.5 rounded-xl glass-card border shadow-xl z-50"
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
  );
}
