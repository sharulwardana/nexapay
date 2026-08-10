'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, UserCheck, Search, DollarSign, Award, X, Plus, Minus, Loader2, Wallet
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

const PRESET_AMOUNTS = [
  { value: 10000, label: '10 Rb' },
  { value: 25000, label: '25 Rb' },
  { value: 50000, label: '50 Rb' },
  { value: 100000, label: '100 Rb' },
  { value: 250000, label: '250 Rb' },
  { value: 500000, label: '500 Rb' },
];

export default function UsersClient({ users }: { users: UserItem[] }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Custom Glassmorphic Balance Modal State
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<number>(50000);
  const [balanceMode, setBalanceMode] = useState<'ADD' | 'SUBTRACT'>('ADD');

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

  const handleOpenBalanceModal = (u: UserItem) => {
    triggerHaptic('light');
    setSelectedUser(u);
    setBalanceAmount(50000);
    setBalanceMode('ADD');
  };

  const handleBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (balanceAmount <= 0) {
      triggerHaptic('warning');
      toast.error('Jumlah nominal harus lebih dari 0');
      return;
    }

    const finalAmount = balanceMode === 'ADD' ? balanceAmount : -balanceAmount;

    triggerHaptic('medium');
    setIsProcessing(selectedUser.id);
    const res = await updateUserBalance(selectedUser.id, finalAmount);
    setIsProcessing(null);

    if (res.success) {
      triggerHaptic('success');
      toast.success(`Saldo ${selectedUser.name || selectedUser.email} berhasil diperbarui! Total: ${formatCurrency(res.balance!)}`);
      setSelectedUser(null);
    } else {
      triggerHaptic('error');
      toast.error('Gagal memperbarui saldo');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
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
                  'px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer',
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
                          onClick={() => handleOpenBalanceModal(u)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Wallet className="w-3.5 h-3.5" />
                          <span>+ Saldo</span>
                        </button>
                        <button
                          disabled={isProcessing === u.id}
                          onClick={() => handleToggleRole(u.id, u.role)}
                          className={cn(
                            "px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer",
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

      {/* Modern Glassmorphic Balance Adjustment Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md bg-[#0e0f17] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Kelola Saldo Wallet</h3>
                    <p className="text-xs text-white/40 truncate max-w-[200px]">{selectedUser.name || selectedUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current Balance Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Saldo Saat Ini</p>
                  <p className="text-lg font-black font-mono text-emerald-400 mt-0.5">{formatCurrency(selectedUser.walletBalance)}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  Aktif
                </span>
              </div>

              <form onSubmit={handleBalanceSubmit} className="space-y-4">
                {/* Mode Selector (Add vs Subtract) */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setBalanceMode('ADD');
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer",
                      balanceMode === 'ADD'
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                        : "text-white/50 hover:text-white"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setBalanceMode('SUBTRACT');
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer",
                      balanceMode === 'SUBTRACT'
                        ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/20"
                        : "text-white/50 hover:text-white"
                    )}
                  >
                    <Minus className="w-4 h-4" />
                    <span>Kurangi (-)</span>
                  </button>
                </div>

                {/* Preset Chips */}
                <div>
                  <label className="text-xs font-bold text-white/60 mb-2 block">Pilihan Nominal Cepat</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_AMOUNTS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setBalanceAmount(preset.value);
                        }}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                          balanceAmount === preset.value
                            ? "bg-violet-500/20 border-violet-500/40 text-violet-300 shadow-md"
                            : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1.5 block">Nominal Kustom</label>
                  <div className="flex items-center rounded-2xl bg-white/5 border border-white/10 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all px-4 py-1.5">
                    <span className="font-bold text-sm text-white/40 mr-2 flex-shrink-0 select-none">Rp</span>
                    <input
                      type="number"
                      min="1"
                      value={balanceAmount || ''}
                      onChange={(e) => setBalanceAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      placeholder="50000"
                      className="w-full bg-transparent font-mono font-bold text-white text-base focus:outline-none py-1"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isProcessing === selectedUser.id}
                  className={cn(
                    "w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 mt-2",
                    balanceMode === 'ADD'
                      ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-emerald-500/25 hover:brightness-110"
                      : "bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-rose-500/25 hover:brightness-110"
                  )}
                >
                  {isProcessing === selectedUser.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{balanceMode === 'ADD' ? 'Proses Tambah Saldo' : 'Proses Kurangi Saldo'}</span>
                      <span className="font-mono text-xs opacity-80">({formatCurrency(balanceAmount)})</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
