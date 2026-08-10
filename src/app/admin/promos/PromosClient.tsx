'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag, Plus, Trash2, Power, X
} from 'lucide-react';
import { cn, formatCurrency, triggerHaptic } from '@/lib/utils';
import { togglePromoStatus, createPromo, deletePromo } from '@/actions/promo';
import { toast } from 'sonner';

type PromoItem = {
  id: string;
  code: string;
  name: string;
  type: string;
  value: number;
  minPurchase: number;
  usageCount: number;
  isActive: boolean;
  startDate: string | Date;
  endDate: string | Date;
};

export default function PromosClient({ promos }: { promos: PromoItem[] }) {
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
    triggerHaptic('light');
    setIsProcessing(id);
    const res = await togglePromoStatus(id, currentStatus);
    setIsProcessing(null);
    if (res.success) {
      triggerHaptic('success');
      toast.success('Status promo berhasil diubah');
    } else {
      triggerHaptic('error');
      toast.error('Gagal mengubah status promo');
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Hapus kode promo "${code}"?`)) return;
    triggerHaptic('warning');
    setIsProcessing(id);
    const res = await deletePromo(id);
    setIsProcessing(null);
    if (res.success) {
      triggerHaptic('success');
      toast.success('Kode promo berhasil dihapus');
    } else {
      triggerHaptic('error');
      toast.error('Gagal menghapus promo');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      triggerHaptic('warning');
      toast.error('Lengkapi kode dan nama promo');
      return;
    }
    triggerHaptic('medium');
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
      triggerHaptic('success');
      toast.success(`Promo "${code.toUpperCase()}" berhasil dibuat!`);
      setShowAddModal(false);
      setCode('');
      setName('');
    } else {
      triggerHaptic('error');
      toast.error('Gagal membuat promo');
    }
  };

  return (
    <>
        <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold font-heading tracking-tight truncate">Promo & Voucher</h1>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-xs shadow-lg shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Promo</span>
          </button>
        </header>

        <motion.main
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto"
        >
          <div className="grid grid-cols-1 mobile-l:grid-cols-2 laptop-l:grid-cols-3 gap-3 sm:gap-4">
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
        </motion.main>

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
    </>
  );
}
