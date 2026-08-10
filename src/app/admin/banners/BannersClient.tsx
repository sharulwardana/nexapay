'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Power, X, ExternalLink, Plus, Trash2, Loader2, Image as ImageIcon
} from 'lucide-react';
import { cn, triggerHaptic } from '@/lib/utils';
import { toast } from 'sonner';
import { createBanner, toggleBannerStatus, deleteBanner } from '@/actions/banner';

type BannerItem = {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  isActive: boolean;
  position?: string | null;
};

export default function BannersClient({ banners }: { banners: BannerItem[] }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');

  const handleToggle = async (id: string, currentStatus: boolean) => {
    triggerHaptic('light');
    setIsProcessing(id);
    const res = await toggleBannerStatus(id, currentStatus);
    setIsProcessing(null);
    if (res.success) {
      triggerHaptic('success');
      toast.success('Status banner berhasil diubah');
    } else {
      triggerHaptic('error');
      toast.error(res.error || 'Gagal mengubah status banner');
    }
  };

  const handleDelete = async (id: string, bannerTitle: string) => {
    if (!confirm(`Hapus banner "${bannerTitle}"?`)) return;
    triggerHaptic('warning');
    setIsProcessing(id);
    const res = await deleteBanner(id);
    setIsProcessing(null);
    if (res.success) {
      triggerHaptic('success');
      toast.success('Banner berhasil dihapus');
    } else {
      triggerHaptic('error');
      toast.error(res.error || 'Gagal menghapus banner');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      triggerHaptic('warning');
      toast.error('Judul dan URL Gambar Banner wajib diisi');
      return;
    }
    triggerHaptic('medium');
    setIsProcessing('create');
    const res = await createBanner({
      title: title.trim(),
      subtitle: subtitle.trim(),
      image: image.trim(),
      link: link.trim(),
    });
    setIsProcessing(null);
    if (res.success) {
      triggerHaptic('success');
      toast.success('Banner berhasil dibuat');
      setShowAddModal(false);
      setTitle('');
      setSubtitle('');
      setImage('');
      setLink('');
    } else {
      triggerHaptic('error');
      toast.error(res.error || 'Gagal membuat banner');
    }
  };

  return (
    <>
        <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold font-heading tracking-tight truncate">Banner Hero</h1>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-xs shadow-lg shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Banner</span>
          </button>
        </header>

        <motion.main
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto"
        >
          <div className="grid grid-cols-1 mobile-l:grid-cols-2 gap-4 sm:gap-6">
            {banners.map((b, i) => (
              <motion.div
                key={b.id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4 overflow-hidden group hover:border-violet-500/30 transition-all"
              >
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                  <Image src={b.image} alt={b.title} fill sizes="500px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {b.position || 'Homepage Hero'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-violet-400 transition-colors">{b.title}</h3>
                    <p className="text-xs text-white/40">{b.subtitle || 'Banner Promo Utama'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.link && (
                      <Link href={b.link} target="_blank" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all" title="Buka Link Target">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleToggle(b.id, b.isActive)}
                      disabled={isProcessing === b.id}
                      className={cn(
                        'p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer',
                        b.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                      )}
                      title="Toggle Active/Draft"
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.title)}
                      disabled={isProcessing === b.id}
                      className="p-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 transition-all cursor-pointer disabled:opacity-50"
                      title="Hapus Banner"
                    >
                      {isProcessing === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {banners.length === 0 && (
              <div className="col-span-full py-14 px-6 sm:px-10 text-center space-y-4 rounded-3xl bg-white/[0.01] border border-dashed border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-inner">
                  <ImageIcon className="w-7 h-7 text-white/30" />
                </div>
                <div className="max-w-xs mx-auto space-y-1">
                  <p className="text-sm font-bold text-white/90">Belum ada Hero Banner</p>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Klik tombol di bawah untuk menambahkan slide gambar promo di halaman utama.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs shadow-lg shadow-violet-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Banner Utama</span>
                </button>
              </div>
            )}
          </div>
        </motion.main>

      {/* Add Banner Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div
            onClick={() => setShowAddModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 my-auto cursor-default"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold font-heading">Tambah Hero Banner Homepage</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1 block">Judul Promo Banner</label>
                  <input type="text" required placeholder="Contoh: Diskon MLBB 50% Welkin Moon" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1 block">Sub-Judul / Keterangan Singkat</label>
                  <input type="text" placeholder="Contoh: Promo Terbatas Akhir Bulan" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1 block">URL Gambar Banner (/images/banners/hero-1.jpg)</label>
                  <input type="text" required placeholder="/images/banners/hero-1.jpg" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500 font-mono" />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1 block">Link Target Saat Banner Diklik (Optional)</label>
                  <input type="text" placeholder="/topup/mobile-legends atau /promo" value={link} onChange={(e) => setLink(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500 font-mono" />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-white/70 hover:bg-white/10 cursor-pointer">Batal</button>
                  <button type="submit" disabled={isProcessing === 'create'} className="px-5 py-2 rounded-xl bg-violet-600 text-xs font-bold text-white hover:bg-violet-500 flex items-center gap-2 cursor-pointer">
                    {isProcessing === 'create' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Simpan & Tampilkan Banner</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
