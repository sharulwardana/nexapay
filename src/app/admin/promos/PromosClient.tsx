'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, Receipt, Megaphone, Image as ImageIcon, BarChart3,
  Tag, Plus, Trash2, Power, Zap, X, LogOut, Menu
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { togglePromoStatus, createPromo, deletePromo } from '@/actions/promo';
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

export default function PromosClient({ promos, adminUser }: { promos: any[]; adminUser: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('PERCENTAGE');
  const [value, setValue] = useState(10);
  const [minPurchase, setMinPurchase] = useState(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setIsProcessing(id);
    const res = await togglePromoStatus(id, currentStatus);
    setIsProcessing(null);
    if (res.success) toast.success('Status promo berhasil diubah');
    else toast.error('Gagal mengubah status promo');
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Hapus kode promo "${code}"?`)) return;
    setIsProcessing(id);
    const res = await deletePromo(id);
    setIsProcessing(null);
    if (res.success) toast.success('Kode promo berhasil dihapus');
    else toast.error('Gagal menghapus promo');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      toast.error('Lengkapi kode dan nama promo');
      return;
    }
    setIsProcessing('create');
    const res = await createPromo({
      code,
      name,
      type,
      value: Number(value),
      minPurchase: Number(minPurchase),
      startDate,
      endDate,
    });
    setIsProcessing(null);
    if (res.success) {
      toast.success(`Promo "${code.toUpperCase()}" berhasil dibuat!`);
      setShowAddModal(false);
      setCode('');
      setName('');
    } else {
      toast.error('Gagal membuat promo');
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
        {/* Header */}
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

        {/* Admin Profile Card AT TOP - Instant access, 0% cut off on mobile/iOS */}
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

        {/* Menu Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto min-h-0 pb-16 lg:pb-4">
          <p className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 mt-2">Menu</p>
          {sidebarItems.map((item) => {
            const isActive = item.href === '/admin/promos';
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
          <h1 className="text-xl font-black font-heading">Kode Promo & Kampanye</h1>
          <div className="ml-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-bold text-xs shadow-lg shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Buat Kode Promo
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promos.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-4',
                  p.isActive ? 'bg-white/[0.03] border-white/10' : 'bg-white/[0.01] border-white/5 opacity-50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-sm font-black text-violet-400 px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/30">
                      {p.code}
                    </span>
                    <h3 className="font-bold text-base text-white mt-2">{p.name}</h3>
                  </div>
                  <button
                    onClick={() => handleToggle(p.id, p.isActive)}
                    disabled={isProcessing === p.id}
                    className={cn(
                      'p-2 rounded-lg transition-all',
                      p.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    )}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 text-xs text-white/50 border-t border-white/5 pt-3">
                  <p>Diskon: <strong className="text-white">{p.type === 'PERCENTAGE' ? `${p.value}%` : formatCurrency(p.value)}</strong></p>
                  <p>Min Belanja: <strong className="text-white">{formatCurrency(p.minPurchase)}</strong></p>
                  <p>Digunakan: <strong className="text-white">{p.usageCount} kali</strong></p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5">
                  <span>Exp: {new Date(p.endDate).toLocaleDateString('id-ID')}</span>
                  <button
                    onClick={() => handleDelete(p.id, p.code)}
                    disabled={isProcessing === p.id}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal Add Promo */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-base font-bold">Buat Kode Promo Baru</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-white/10 text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3 text-xs">
                <div>
                  <label className="text-white/60 font-bold block mb-1">Kode Voucher</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: NEXAWIN10"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="text-white/60 font-bold block mb-1">Nama Promo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Diskon 10% Pengguna Baru"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 font-bold block mb-1">Tipe Diskon</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10"
                    >
                      <option value="PERCENTAGE">Persentase (%)</option>
                      <option value="FIXED">Nominal Tetap (Rp)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 font-bold block mb-1">Nilai Diskon</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/60 font-bold block mb-1">Min. Pembelian (Rp)</label>
                  <input
                    type="number"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 font-bold block mb-1">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 font-bold block mb-1">Tanggal Berakhir</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing === 'create'}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-bold text-sm shadow-lg shadow-violet-500/25 mt-4"
                >
                  Simpan Kode Promo
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
