'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, Receipt, Megaphone, Image, BarChart3,
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, UserPlus, Eye,
  ChevronRight, ArrowUpRight, ArrowDownRight, Bell, Settings, LogOut,
  Menu, X, Moon, Sun, Search,
} from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { useTheme } from 'next-themes';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Produk', href: '/admin/products', icon: Package },
  { label: 'Transaksi', href: '/admin/transactions', icon: Receipt },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Promo', href: '/admin/promos', icon: Megaphone },
  { label: 'Banner', href: '/admin/banners', icon: Image },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

const statsCards = [
  { label: 'Total Revenue', value: 1250000000, change: 12.5, icon: DollarSign, color: 'from-green-500 to-emerald-600' },
  { label: 'Total Transaksi', value: 45200, change: 8.3, icon: ShoppingCart, color: 'from-blue-500 to-cyan-600' },
  { label: 'Total Users', value: 2500000, change: 15.2, icon: Users, color: 'from-violet-500 to-purple-600' },
  { label: 'New Users (Today)', value: 1250, change: -2.1, icon: UserPlus, color: 'from-amber-500 to-orange-600' },
];

const recentTx = [
  { id: 'NXP-001', user: 'ahmad.rizky@email.com', product: 'ML 568 Diamonds', amount: 140000, status: 'COMPLETED', time: '2 min ago' },
  { id: 'NXP-002', user: 'sarah@email.com', product: 'Genshin 330 Crystal', amount: 79000, status: 'PROCESSING', time: '5 min ago' },
  { id: 'NXP-003', user: 'budi@email.com', product: 'Pulsa Telkomsel 50K', amount: 50500, status: 'COMPLETED', time: '8 min ago' },
  { id: 'NXP-004', user: 'diana@email.com', product: 'Valorant 1375 VP', amount: 149000, status: 'PENDING', time: '12 min ago' },
  { id: 'NXP-005', user: 'mega@email.com', product: 'Token PLN 100K', amount: 101500, status: 'COMPLETED', time: '15 min ago' },
  { id: 'NXP-006', user: 'john@email.com', product: 'Steam Wallet 250K', amount: 260000, status: 'COMPLETED', time: '20 min ago' },
];

const topProducts = [
  { name: 'Mobile Legends', revenue: 450000000, count: 32000, growth: 18 },
  { name: 'Genshin Impact', revenue: 280000000, count: 15000, growth: 25 },
  { name: 'Free Fire', revenue: 195000000, count: 28000, growth: -5 },
  { name: 'VALORANT', revenue: 120000000, count: 8500, growth: 32 },
  { name: 'Pulsa Telkomsel', revenue: 98000000, count: 45000, growth: 10 },
];

const salesData = [
  { day: 'Sen', value: 45 },
  { day: 'Sel', value: 52 },
  { day: 'Rab', value: 49 },
  { day: 'Kam', value: 63 },
  { day: 'Jum', value: 58 },
  { day: 'Sab', value: 72 },
  { day: 'Min', value: 68 },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const maxSale = Math.max(...salesData.map(d => d.value));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-heading font-bold text-sm">
              <span className="gradient-text">Nexa</span>Pay Admin
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                item.href === '/admin'
                  ? 'gradient-primary text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-white">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Admin NexaPay</p>
              <p className="text-[10px] text-muted-foreground truncate">admin@nexapay.id</p>
            </div>
            <button className="p-1 rounded hover:bg-muted text-muted-foreground">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 glass border-b border-border flex items-center justify-between px-4 tablet:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-muted/50">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold font-heading hidden tablet:block">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden tablet:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input placeholder="Search..." className="pl-9 pr-4 py-2 w-64 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-xl hover:bg-muted/50">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="relative p-2 rounded-xl hover:bg-muted/50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 tablet:p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 tablet:gap-4">
            {statsCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 tablet:p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', stat.color)}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    stat.change >= 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(stat.change)}%
                  </div>
                </div>
                <p className="text-xl tablet:text-2xl font-bold font-heading">
                  {stat.label.includes('Revenue') ? formatCurrency(stat.value) : formatNumber(stat.value)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 tablet:gap-6">
            {/* Sales Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 glass-card p-4 tablet:p-5"
            >
              <h3 className="text-sm font-semibold mb-4">Penjualan Minggu Ini (Juta Rp)</h3>
              <div className="flex items-end gap-2 tablet:gap-3 h-48">
                {salesData.map((d, i) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-muted-foreground">{d.value}M</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.value / maxSale) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
                      className="w-full rounded-t-lg gradient-primary min-h-[4px]"
                    />
                    <span className="text-[10px] text-muted-foreground">{d.day}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card p-4 tablet:p-5"
            >
              <h3 className="text-sm font-semibold mb-4">Produk Terlaris</h3>
              <div className="space-y-3">
                {topProducts.map((product, i) => (
                  <div key={product.name} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatCurrency(product.revenue)} • {formatNumber(product.count)} tx
                      </p>
                    </div>
                    <div className={cn(
                      'text-[10px] font-medium',
                      product.growth >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {product.growth >= 0 ? '+' : ''}{product.growth}%
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-sm font-semibold">Transaksi Terbaru (Realtime)</h3>
              <Link href="/admin/transactions" className="text-xs text-primary hover:underline flex items-center gap-1">
                Lihat Semua <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Invoice</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">User</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Produk</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Amount</th>
                    <th className="text-center text-xs font-medium text-muted-foreground p-3">Status</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentTx.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-sm font-mono font-medium">{tx.id}</td>
                      <td className="p-3 text-sm text-muted-foreground truncate max-w-[150px]">{tx.user}</td>
                      <td className="p-3 text-sm">{tx.product}</td>
                      <td className="p-3 text-sm font-medium text-right">{formatCurrency(tx.amount)}</td>
                      <td className="p-3 text-center">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold',
                          tx.status === 'COMPLETED' && 'bg-green-500/10 text-green-500',
                          tx.status === 'PROCESSING' && 'bg-blue-500/10 text-blue-500',
                          tx.status === 'PENDING' && 'bg-yellow-500/10 text-yellow-500'
                        )}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground text-right">{tx.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
