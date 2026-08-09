'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, Receipt, Megaphone, Image as ImageIcon, BarChart3,
  Power, Zap, X, LogOut, Menu, ExternalLink, Plus, Trash2, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { createBanner, toggleBannerStatus, deleteBanner } from '@/actions/banner';

const sidebarItems = [
  { label: 'Ringkasan', href: '/admin', icon: LayoutDashboard },
  { label: 'Produk', href: '/admin/products', icon: Package },
  { label: 'Transaksi', href: '/admin/transactions', icon: Receipt },
  { label: 'Pelanggan', href: '/admin/users', icon: Users },
  { label: 'Promo & Voucher', href: '/admin/promos', icon: Megaphone },
  { label: 'Banner Hero', href: '/admin/banners', icon: ImageIcon },
  { label: 'Analitik', href: '/admin/analytics', icon: BarChart3 },
];

export default function BannersClient({ banners, adminUser }: { banners: any[]; adminUser: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setIsProcessing(id);
    const res = await toggleBannerStatus(id, currentStatus);
    setIsProcessing(null);
    if (res.success) {
      toast.success('Status banner berhasil diubah');
    } else {
      toast.error(res.error || 'Gagal mengubah status banner');
    }
  };

  const handleDelete = async (id: string, bannerTitle: string) => {
    if (!confirm(`Hapus banner "${bannerTitle}"?`)) return;
    setIsProcessing(id);
    const res = await deleteBanner(id);
    setIsProcessing(null);
    if (res.success) {
      toast.success('Banner berhasil dihapus');
    } else {
      toast.error(res.error || 'Gagal menghapus banner');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      toast.error('Judul dan URL Gambar Banner wajib diisi');
      return;
    }
    setIsProcessing('create');
    const res = await createBanner({
      title: title.trim(),
      subtitle: subtitle.trim(),
      image: image.trim(),
      link: link.trim(),
    });
    setIsProcessing(null);
    if (res.success) {
      toast.success('Hero Banner berhasil ditambahkan!');
      setShowAddModal(false);
      setTitle('');
      setSubtitle('');
      setImage('');
      setLink('');
    } else {
      toast.error(res.error || 'Gagal menambahkan banner');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-violet-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px]" />
      </div>

      {/* Sidebar */}
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

        {/* Admin Profile Card AT TOP */}
        <div className="p-3 border-b border-white/10 bg-white/[0.02] flex-shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white shadow-lg flex-shrink-0">
              {adminUser?.name ? adminUser.name.charAt(0) : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{adminUser?.name || 'Adam Mahfud'}</p>
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
            const isActive = item.href === '/admin/banners';
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden',
                  isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-violet-600/25 via-fuchsia-600/15 to-transparent border border-violet-500/30 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bar"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-violet-400 via-fuchsia-400 to-violet-500 rounded-r-full shadow-[0_0_12px_#c084fc]"
                  />
                )}
                <item.icon className={cn("w-4 h-4 relative z-10 transition-colors duration-300", isActive ? "text-violet-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" : "text-white/40 group-hover:text-white/70")} />
                <span className={cn("relative z-10 transition-colors", isActive ? "text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-white/50 group-hover:text-white")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 flex-shrink-0">
              <Menu className="w-5 h-5" />
            </button>
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
      </div>

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
    </div>
  );
}
