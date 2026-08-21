'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Trash2, ShoppingCart, Gamepad2, Loader2 } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import EmptyState from '@/components/shared/EmptyState';

interface FavoriteItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  category: string;
  publisher: string;
  minPrice: number;
}

export default function FavoritesClient({ initialFavorites }: { initialFavorites: FavoriteItem[] }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(initialFavorites);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const removeFavorite = async (productId: string, name: string) => {
    setLoadingId(productId);
    try {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      
      if (!res.ok) throw new Error('Failed to remove');
      
      setFavorites(prev => prev.filter(f => f.productId !== productId));
      toast.success(`${name} dihapus dari favorit`);
    } catch (e) {
      toast.error('Gagal menghapus favorit');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <main className="min-h-screen pt-28 tablet:pt-30 pb-24 aurora-bg">
        <div className="container-app max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg tablet:text-xl font-bold">Favorit</h1>
              <p className="text-xs text-muted-foreground">{favorites.length} produk tersimpan</p>
            </div>
          </div>

          <div className="space-y-3">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 flex items-center gap-3"
              >
                {/* Icon */}
                <div className="w-12 h-12 tablet:w-14 tablet:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-6 h-6 text-primary/60" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2">{item.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{item.publisher} • {item.category}</p>
                  <p className="text-xs font-bold text-primary mt-0.5">Mulai {formatCurrency(item.minPrice)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={item.category === 'GAME_TOPUP' ? `/topup/${item.slug}` : `/products/${item.slug}`}
                    className="p-2 rounded-lg gradient-primary text-white hover:shadow-neon-violet transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => removeFavorite(item.productId, item.name)}
                    disabled={loadingId === item.productId}
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-50"
                  >
                    {loadingId === item.productId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {favorites.length === 0 && (
            <EmptyState
              icon={Heart}
              title="Belum Ada Game Favorit"
              description="Simpan game dan produk digital favorit kamu agar top-up berikutnya lebih cepat dan mudah!"
              actionHref="/topup"
              actionLabel="Jelajahi Katalog Game"
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
