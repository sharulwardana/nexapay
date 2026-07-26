'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, Receipt, Megaphone, Image as ImageIcon, BarChart3,
  Shield, UserCheck, Search, Plus, DollarSign, Award, LogOut, Menu, X, Zap
} from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { toggleUserRole, updateUserBalance } from '@/actions/user';
import { toast } from 'sonner';

const sidebarItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Transactions', href: '/admin/transactions', icon: Receipt },
  { label: 'Customers', href: '/admin/users', icon: Users },
  { label: 'Campaigns', href: '/admin/promos', icon: Megaphone },
  { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export default function UsersClient({ users, adminUser }: { users: any[]; adminUser: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let res = users;
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }
    if (roleFilter !== 'ALL') {
      res = res.filter(u => u.role === roleFilter);
    }
    return res;
  }, [users, search, roleFilter]);

  const handleToggleRole = async (userId: string, currentRole: string) => {
    setIsProcessing(userId);
    const res = await toggleUserRole(userId, currentRole);
    setIsProcessing(null);
    if (res.success) {
      toast.success(`Role pengguna berhasil diubah menjadi ${res.role}`);
    } else {
      toast.error('Gagal mengubah role');
    }
  };

  const handleAddBalance = async (userId: string, name: string) => {
    const input = prompt(`Masukkan jumlah saldo yang ingin ditambahkan untuk ${name} (Contoh: 50000 atau -10000 untuk kurangi):`);
    if (!input) return;
    const amount = parseInt(input, 10);
    if (isNaN(amount)) {
      toast.error('Jumlah tidak valid');
      return;
    }

    setIsProcessing(userId);
    const res = await updateUserBalance(userId, amount);
    setIsProcessing(null);
    if (res.success) {
      toast.success(`Saldo ${name} berhasil diperbarui! Total: ${formatCurrency(res.balance!)}`);
    } else {
      toast.error('Gagal memperbarui saldo');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-violet-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px]" />
      </div>

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 bg-[#0d0d0d] border-r border-white/10 transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) lg:translate-x-0 lg:static flex flex-col',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-heading font-black tracking-tight text-base">
              Nexa<span className="text-violet-400">Admin</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-white/10 bg-white/[0.02] flex-shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white shadow-lg flex-shrink-0">
              {adminUser?.name ? adminUser.name.charAt(0) : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{adminUser?.name || 'Administrator'}</p>
              <p className="text-[10px] text-white/40 truncate font-mono">{adminUser?.email || 'admin@nexapay.id'}</p>
            </div>
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0"
              title="Kembali ke Website Utama"
            >
              <Zap className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-1.5 rounded-lg hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
              title="Keluar Akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto min-h-0 pb-16 lg:pb-4">
          <p className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 mt-2">Menu</p>
          {sidebarItems.map((item) => {
            const isActive = item.href === '/admin/users';
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden',
                  isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                {isActive && <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-white/10 rounded-xl" />}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-violet-400 rounded-r-full shadow-[0_0_10px_#a78bfa]" />}
                <item.icon className={cn("w-4 h-4 relative z-10", isActive ? "text-violet-400" : "text-white/40 group-hover:text-white/70")} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        <header className="sticky top-0 z-40 h-20 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex items-center px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black font-heading">Pelanggan & Akun</h1>
          <div className="ml-auto text-xs text-white/40">{users.length} pengguna terdaftar</div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Controls */}
          <div className="flex flex-col tablet:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {['ALL', 'ADMIN', 'USER'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-xs font-medium transition-all',
                    roleFilter === r
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10 hover:text-white/60'
                  )}
                >
                  {r === 'ALL' ? 'Semua Role' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">User</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Role</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Saldo Wallet</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Loyalty Points</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Transaksi</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-white/90 text-sm">{u.name || 'Gamer'}</p>
                        <p className="text-xs text-white/40 font-mono">{u.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider',
                          u.role === 'ADMIN' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/5 text-white/60 border border-white/10'
                        )}>
                          {u.role === 'ADMIN' ? <Shield className="w-3 h-3 text-violet-400" /> : <UserCheck className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-xs text-emerald-400">
                        {formatCurrency(u.walletBalance)}
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <span className="text-amber-400 font-bold">{formatNumber(u.loyaltyPoints)} pts</span>
                        <span className="text-[10px] text-white/30 block">{u.loyaltyLevel}</span>
                      </td>
                      <td className="px-5 py-4 text-xs text-white/60 font-semibold">
                        {u._count.transactions} pesanan
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={isProcessing === u.id}
                            onClick={() => handleAddBalance(u.id, u.name || u.email)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 active:scale-95 transition-all"
                          >
                            + Saldo
                          </button>
                          <button
                            disabled={isProcessing === u.id || u.email === adminUser?.email}
                            onClick={() => handleToggleRole(u.id, u.role)}
                            className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[10px] font-bold hover:bg-violet-500/20 active:scale-95 transition-all disabled:opacity-30"
                          >
                            {u.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
