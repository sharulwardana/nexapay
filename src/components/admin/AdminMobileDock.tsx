'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Gamepad2, ReceiptText, Users2, LayoutGrid,
  Megaphone, Image as ImageIcon, BarChart3, LogOut, X, ChevronRight, Shield
} from 'lucide-react';
import { cn, triggerHaptic } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const primaryTabs = [
  { label: 'Utama', href: '/admin', icon: LayoutDashboard },
  { label: 'Produk', href: '/admin/products', icon: Gamepad2 },
  { label: 'Order', href: '/admin/transactions', icon: ReceiptText },
  { label: 'User', href: '/admin/users', icon: Users2 },
];

const secondaryItems = [
  { label: 'Promo & Voucher', href: '/admin/promos', icon: Megaphone, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  { label: 'Banner Hero', href: '/admin/banners', icon: ImageIcon, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { label: 'Analitik Performa', href: '/admin/analytics', icon: BarChart3, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
];

export default function AdminMobileDock({ adminUser }: {
  adminUser?: { name?: string | null; email?: string | null; image?: string | null }
}) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Close sheet on route change
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  const handleTabClick = (href: string) => {
    triggerHaptic('light');
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isMoreActive = secondaryItems.some(item => pathname.startsWith(item.href));

  return (
    <>
      {/* Floating Bottom Dock (Mobile Only - Rock Solid Z-50) */}
      <div
        className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] inset-x-0 mx-auto z-50 lg:hidden w-[calc(100%-2rem)] max-w-[380px] pointer-events-auto"
      >
        <div className="relative p-1.5 rounded-full bg-[#0b0c13]/96 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.95),0_0_24px_rgba(139,92,246,0.2)] grid grid-cols-5 items-center gap-0.5">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || (tab.href !== '/admin' && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => handleTabClick(tab.href)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 px-0.5 rounded-full text-center transition-all duration-300 w-full min-w-0 font-sans",
                  isActive ? "text-white font-bold" : "text-white/40 hover:text-white/70"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeAdminDockTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/40 via-fuchsia-600/30 to-violet-600/40 border border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.35)]"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <Icon className={cn("w-4 h-4 sm:w-4.5 sm:h-4.5 relative z-10 transition-all duration-300", isActive && "scale-110 text-violet-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]")} />
                <span className={cn("text-[9.5px] tracking-tight leading-none mt-1 relative z-10 block w-full text-center truncate px-0.5 font-heading", isActive ? "font-bold text-white" : "font-medium")}>
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* More Menu Trigger */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              setIsMoreOpen(true);
            }}
            className={cn(
              "relative flex flex-col items-center justify-center py-2 px-0.5 rounded-full text-center transition-all duration-300 cursor-pointer w-full min-w-0 font-sans",
              isMoreActive || isMoreOpen ? "text-white font-bold" : "text-white/40 hover:text-white/70"
            )}
          >
            {(isMoreActive || isMoreOpen) && (
              <motion.div
                layoutId="activeAdminDockTab"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-600/40 via-blue-600/30 to-cyan-600/40 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <LayoutGrid className={cn("w-4 h-4 sm:w-4.5 sm:h-4.5 relative z-10 transition-all duration-300", (isMoreActive || isMoreOpen) && "scale-110 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]")} />
            <span className={cn("text-[9.5px] tracking-tight leading-none mt-1 relative z-10 block w-full text-center truncate px-0.5 font-heading", (isMoreActive || isMoreOpen) ? "font-bold text-white" : "font-medium")}>
              Menu
            </span>
          </button>
        </div>
      </div>

      {/* Secondary Items Slide-Up Drawer */}
      <AnimatePresence>
        {isMoreOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Bottom Drawer Card */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="relative w-full max-w-lg bg-[#0e0f17] border-t border-white/10 rounded-t-3xl p-5 sm:p-6 shadow-2xl space-y-5 z-10 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
            >
              {/* Handlebar */}
              <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-1" />

              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-violet-400 font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white font-heading">Menu Admin Lainnya</h3>
                    <p className="text-[11px] text-white/40 font-mono">NexaPay Control Center</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className="p-1.5 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Secondary Navigation List */}
              <div className="space-y-2">
                {secondaryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        triggerHaptic('light');
                        setIsMoreOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer group",
                        isActive
                          ? "bg-white/10 border-white/20 text-white shadow-lg"
                          : "bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2.5 rounded-xl border", item.color)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs sm:text-sm font-heading">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  );
                })}
              </div>

              {/* Profile Card & Logout */}
              {adminUser && (
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-xs text-white shadow-md flex-shrink-0">
                      {adminUser.name?.[0] || 'A'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-white truncate">{adminUser.name || 'Administrator'}</p>
                      <p className="text-[10px] text-white/40 truncate font-mono">{adminUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic('warning');
                      signOut({ callbackUrl: '/' });
                    }}
                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
