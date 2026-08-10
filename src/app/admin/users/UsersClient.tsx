'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, UserCheck, Search, DollarSign, Award
} from 'lucide-react';
import { cn, formatCurrency, formatNumber, triggerHaptic } from '@/lib/utils';
import { toggleUserRole, updateUserBalance } from '@/actions/user';
import { toast } from 'sonner';

type UserItem = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  walletBalance: number;
  loyaltyPoints: number;
  loyaltyLevel: string;
  _count: { transactions: number };
};

export default function UsersClient({ users }: { users: UserItem[] }) {
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
    triggerHaptic('medium');
    setIsProcessing(userId);
    const res = await toggleUserRole(userId, currentRole);
    setIsProcessing(null);
    if (res.success) {
      triggerHaptic('success');
      toast.success(`Role pengguna berhasil diubah menjadi ${res.role}`);
    } else {
      triggerHaptic('error');
      toast.error(res.error || 'Gagal mengubah role');
    }
  };

  const handleAddBalance = async (userId: string, name: string) => {
    const input = prompt(`Masukkan jumlah saldo yang ingin ditambahkan untuk ${name} (Contoh: 50000 atau -10000 untuk kurangi):`);
    if (!input) return;
    const amount = parseInt(input, 10);
    if (isNaN(amount)) {
      triggerHaptic('warning');
      toast.error('Jumlah tidak valid');
      return;
    }

    triggerHaptic('medium');
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
    <>
        <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-10" />
            <h1 className="text-lg sm:text-xl font-bold font-heading tracking-tight">Kelola Pelanggan</h1>
          </div>
          <div className="text-xs text-white/40">{users.length} pengguna terdaftar</div>
        </header>

        <motion.main
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto"
        >
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
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
              {['ALL', 'ADMIN', 'USER'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap',
                    roleFilter === r
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10 hover:text-white/60'
                  )}
                >
                  {r === 'ALL' ? 'Semua Peran' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Pengguna</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Peran</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Saldo Wallet</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-white/30 uppercase tracking-wider">Poin Hadiah</th>
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
                            onClick={() => handleAddBalance(u.id, u.name || u.email || 'User')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 active:scale-95 transition-all"
                          >
                            + Saldo
                          </button>
                          <button
                            disabled={isProcessing === u.id}
                            onClick={() => {
                              handleToggleRole(u.id, u.role);
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all active:scale-95",
                              u.role === 'ADMIN'
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                                : "bg-violet-500/20 border-violet-500/50 text-violet-300 hover:bg-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                            )}
                          >
                            {u.role === 'ADMIN' ? 'Make User' : 'Make Admin ⚡'}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.main>
    </>
  );
}
