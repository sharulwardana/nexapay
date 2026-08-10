'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Search, Plus, Power, Edit, Trash2, Loader2, Image as ImageIcon,
  ChevronDown, Gamepad2, Tv, Smartphone, Gift, Wallet, X, Zap
} from 'lucide-react';
import { cn, triggerHaptic } from '@/lib/utils';
import { toast } from 'sonner';
import { toggleProductStatus, deleteProduct, createProduct, updateProduct } from '@/actions/product';

const CATEGORY_OPTIONS = [
  { id: 'GAME_TOPUP', label: 'GAME TOP UP', icon: Gamepad2, color: 'text-violet-400 bg-violet-500/10 border-violet-500/30' },
  { id: 'STREAMING', label: 'STREAMING VOUCHER', icon: Tv, color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
  { id: 'PULSA', label: 'PULSA & PAKET DATA', icon: Smartphone, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'PLN', label: 'TOKEN PLN', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'GIFT_CARD', label: 'GIFT CARD & STORE', icon: Gift, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { id: 'EWALLET_TOPUP', label: 'E-WALLET TOP UP', icon: Wallet, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
];

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  publisher: string | null;
  image: string | null;
  isActive: boolean;
  _count?: { denominations: number };
};

function CustomCategorySelect({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = CATEGORY_OPTIONS.find(c => c.id === value) || CATEGORY_OPTIONS[0];
  const Icon = selected.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white flex items-center justify-between hover:bg-white/10 focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className={cn("p-1.5 rounded-lg border", selected.color)}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs tablet:text-sm tracking-wide">{selected.label}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-violet-400 transition-transform duration-300 ml-2 flex-shrink-0", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#161616] border border-white/10 rounded-2xl p-2 shadow-2xl space-y-1 backdrop-blur-2xl max-h-60 overflow-y-auto custom-scrollbar"
          >
            {CATEGORY_OPTIONS.map((cat) => {
              const CatIcon = cat.icon;
              const isSel = cat.id === value;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { onChange(cat.id); setOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer",
                    isSel
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className={cn("p-1.5 rounded-lg border", cat.color)}>
                    <CatIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>{cat.label}</span>
                  {isSel && <div className="ml-auto w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductClient({ products }: { products: ProductItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Form States
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('GAME_TOPUP');
  const [formPublisher, setFormPublisher] = useState('');
  const [formImage, setFormImage] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    triggerHaptic('light');
    setIsProcessing(id);
    const res = await toggleProductStatus(id, currentStatus);
    setIsProcessing(null);
    if (res.success) {
      triggerHaptic('success');
      toast.success('Status produk berhasil diubah');
    } else {
      triggerHaptic('error');
      toast.error(res.error || 'Gagal mengubah status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini? Semua data terkait bisa ikut terhapus!')) return;
    triggerHaptic('warning');
    setIsProcessing(id);
    const res = await deleteProduct(id);
    setIsProcessing(null);
    if (res.success) {
      triggerHaptic('success');
      toast.success('Produk berhasil dihapus');
    } else {
      triggerHaptic('error');
      toast.error(res.error || 'Gagal menghapus produk');
    }
  };

  const handleOpenAddModal = () => {
    setFormName('');
    setFormSlug('');
    setFormCategory('GAME_TOPUP');
    setFormPublisher('');
    setFormImage('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormCategory(p.category);
    setFormPublisher(p.publisher || '');
    setFormImage(p.image || '');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      toast.error('Nama dan Slug produk wajib diisi');
      return;
    }
    setIsProcessing('create');
    const res = await createProduct({
      name: formName.trim(),
      slug: formSlug.trim().toLowerCase().replace(/\s+/g, '-'),
      category: formCategory,
      publisher: formPublisher.trim(),
      image: formImage.trim(),
    });
    setIsProcessing(null);
    if (res.success) {
      toast.success('Produk baru berhasil ditambahkan!');
      setIsAddModalOpen(false);
    } else {
      toast.error(res.error || 'Gagal menambahkan produk');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsProcessing('update');
    const res = await updateProduct(editingProduct.id, {
      name: formName.trim(),
      category: formCategory,
      publisher: formPublisher.trim(),
      image: formImage.trim(),
    });
    setIsProcessing(null);
    if (res.success) {
      toast.success('Data produk berhasil diperbarui!');
      setEditingProduct(null);
    } else {
      toast.error(res.error || 'Gagal memperbarui produk');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-black/20 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="lg:hidden w-10" />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold font-heading tracking-tight truncate">Kelola Produk</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs font-bold shadow-lg shadow-violet-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </header>

        {/* Dashboard Grid */}
        <motion.main
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar"
        >
          <div className="max-w-[1400px] mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/5 gap-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Cari nama, slug, atau kategori..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-full sm:w-80 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:bg-white/10 focus:border-violet-500/50 transition-all placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full min-w-[800px] text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02]">
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5">Info Produk</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5">Kategori</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5 text-center">Varian Item</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5 text-center">Status</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative flex-shrink-0">
                              {product.image ? (
                                <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-white/20" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white/90 group-hover:text-violet-400 transition-colors">{product.name}</p>
                              <p className="text-[10px] text-white/40 font-mono">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-white/70">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm font-bold text-white/90">{product._count?.denominations || 0}</span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleStatus(product.id, product.isActive)}
                            disabled={isProcessing === product.id}
                            className={cn(
                              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border transition-all hover:scale-105 cursor-pointer',
                              product.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10',
                              isProcessing === product.id && 'opacity-50 cursor-not-allowed'
                            )}
                          >
                            {isProcessing === product.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Power className="w-3 h-3" />
                            )}
                            {product.isActive ? 'Active' : 'Draft'}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={isProcessing === product.id}
                              className="p-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 transition-colors cursor-pointer disabled:opacity-50"
                              title="Delete Product"
                            >
                              {isProcessing === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            onClick={() => setIsAddModalOpen(false)}
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
                <h3 className="text-lg font-bold font-heading">Tambah Produk Baru</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1 block">Nama Produk</label>
                  <input type="text" required placeholder="Contoh: Mobile Legends" value={formName} onChange={(e) => { setFormName(e.target.value); setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1 block">Slug URL</label>
                  <input type="text" required placeholder="mobile-legends" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-mono focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1.5 block">Kategori Produk</label>
                  <CustomCategorySelect value={formCategory} onChange={setFormCategory} />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1 block">Publisher / Developer</label>
                  <input type="text" placeholder="Contoh: Moonton / Garena" value={formPublisher} onChange={(e) => setFormPublisher(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1 block">URL Gambar (/images/games/nama.webp)</label>
                  <input type="text" placeholder="/images/games/mobile-legends.webp" value={formImage} onChange={(e) => setFormImage(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-white/70 hover:bg-white/10 cursor-pointer">Batal</button>
                  <button type="submit" disabled={isProcessing === 'create'} className="px-5 py-2 rounded-xl bg-violet-600 text-xs font-bold text-white hover:bg-violet-500 flex items-center gap-2 cursor-pointer">
                    {isProcessing === 'create' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Simpan Produk</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div
            onClick={() => setEditingProduct(null)}
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
                <h3 className="text-lg font-bold font-heading">Edit Produk: {editingProduct.name}</h3>
                <button onClick={() => setEditingProduct(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1 block">Nama Produk</label>
                  <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1.5 block">Kategori Produk</label>
                  <CustomCategorySelect value={formCategory} onChange={setFormCategory} />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1 block">Publisher / Developer</label>
                  <input type="text" value={formPublisher} onChange={(e) => setFormPublisher(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 mb-1 block">URL Gambar</label>
                  <input type="text" value={formImage} onChange={(e) => setFormImage(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500" />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-white/70 hover:bg-white/10 cursor-pointer">Batal</button>
                  <button type="submit" disabled={isProcessing === 'update'} className="px-5 py-2 rounded-xl bg-violet-600 text-xs font-bold text-white hover:bg-violet-500 flex items-center gap-2 cursor-pointer">
                    {isProcessing === 'update' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Update Produk</span>
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
