'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Trash2, ShoppingCart, Gamepad2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';

const favorites = [
  { id: 'f1', name: 'Mobile Legends: Bang Bang', slug: 'mobile-legends', category: 'GAME_TOPUP', publisher: 'Moonton', minPrice: 15500 },
  { id: 'f2', name: 'Genshin Impact', slug: 'genshin-impact', category: 'GAME_TOPUP', publisher: 'HoYoverse', minPrice: 16500 },
  { id: 'f3', name: 'VALORANT', slug: 'valorant', category: 'GAME_TOPUP', publisher: 'Riot Games', minPrice: 15000 },
  { id: 'f4', name: 'Free Fire', slug: 'free-fire', category: 'GAME_TOPUP', publisher: 'Garena', minPrice: 7000 },
  { id: 'f5', name: 'Pulsa Telkomsel', slug: 'pulsa-telkomsel', category: 'PULSA', publisher: 'Telkomsel', minPrice: 5500 },
  { id: 'f6', name: 'Steam Wallet', slug: 'steam-wallet', category: 'VOUCHER', publisher: 'Valve', minPrice: 12000 },
];

export default function FavoritesPage() {
  const removeFavorite = (name: string) => {
    toast.success(`${name} dihapus dari favorit`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 tablet:pt-24 pb-24">
        <div className="container-app max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg tablet:text-xl font-bold">Favorit</h1>
              <p className="text-xs text-muted-foreground">{favorites.length} produk tersimpan</p>
            </div>
          </motion.div>

          <div className="space-y-3">
            {favorites.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center gap-3"
              >
                {/* Icon */}
                <div className="w-12 h-12 tablet:w-14 tablet:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-6 h-6 text-primary/60" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold line-clamp-1">{item.name}</h3>
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
                    onClick={() => removeFavorite(item.name)}
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {favorites.length === 0 && (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-base font-semibold mb-1">Belum ada favorit</h3>
              <p className="text-sm text-muted-foreground mb-4">Tambahkan game atau produk ke daftar favorit kamu</p>
              <Link href="/topup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold">
                <Gamepad2 className="w-4 h-4" /> Jelajahi Game
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
