'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, Receipt, Megaphone, Image as ImageIcon, BarChart3,
  Search, Plus, MoreHorizontal, Edit, Trash2, Power, Zap,
  Menu, X, LogOut, Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { toggleProductStatus, deleteProduct } from '@/actions/product';
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

export default function ProductClient({ products, adminUser }: { products: any[], adminUser: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsProcessing(id);
    const res = await toggleProductStatus(id, currentStatus);
    setIsProcessing(null);
    if (res.success) {
      toast.success('Status produk berhasil diubah');
    } else {
      toast.error('Gagal mengubah status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini? Semua data denominasi dan transaksi terkait bisa ikut terhapus!')) return;
    setIsProcessing(id);
    const res = await deleteProduct(id);
    setIsProcessing(null);
    if (res.success) {
      toast.success('Produk berhasil dihapus');
    } else {
      toast.error('Gagal menghapus produk');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-violet-500/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px]" />
      </div>

      {/* Sidebar */}
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
            const isActive = item.href === '/admin/products';
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
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-white/10 rounded-xl" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-violet-400 rounded-r-full shadow-[0_0_10px_#a78bfa]" />
                )}
                <item.icon className={cn("w-4 h-4 relative z-10 transition-colors duration-300", isActive ? "text-violet-400" : "text-white/40 group-hover:text-white/70")} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-black/20 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold font-heading tracking-tight">Products</h1>
              <p className="text-xs text-white/40 mt-0.5">Manage games and top-up denominations.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-violet-500/25 transition-all hover:scale-105 active:scale-95">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/5 gap-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-violet-400 transition-colors" />
                  <input 
                    type="text"
                    placeholder="Cari nama atau kategori..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-full sm:w-80 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:bg-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-white/30" 
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full min-w-[800px] text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02]">
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5">Product Info</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5">Category</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5 text-center">Items (Denoms)</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5 text-center">Status</th>
                      <th className="font-medium text-[10px] uppercase tracking-wider text-white/40 p-4 border-b border-white/5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-inner flex-shrink-0">
                              {product.image ? (
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
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
                              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border transition-all hover:scale-105',
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
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              disabled={isProcessing === product.id}
                              className="p-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 transition-colors" 
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                          <p className="text-sm font-medium text-white/90">Tidak ada produk ditemukan</p>
                          <p className="text-xs text-white/40 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
