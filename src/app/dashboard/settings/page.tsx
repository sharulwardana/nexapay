'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Lock, Bell, Moon, Sun, Globe, Shield, Eye, EyeOff, Save, LogOut, Trash2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState('Ahmad Rizky');
  const [email, setEmail] = useState('ahmad.rizky@email.com');
  const [phone, setPhone] = useState('081234567890');
  const [notifications, setNotifications] = useState({
    email: true, push: true, promo: false, transaction: true,
  });

  const handleSave = () => {
    toast.success('Pengaturan berhasil disimpan!');
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
            <h1 className="text-lg tablet:text-xl font-bold">Pengaturan</h1>
          </motion.div>

          <div className="space-y-6">
            {/* Profile Section */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Profil</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">A</div>
                  <button className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-all">Ubah Foto</button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nama Lengkap</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nomor HP</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Keamanan</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3"><Lock className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Ubah Password</span></div>
                  <span className="text-xs text-muted-foreground">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3"><Shield className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Verifikasi 2 Langkah</span></div>
                  <span className="text-xs text-green-500 font-medium">Aktif</span>
                </button>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Notifikasi</h2>
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Notifikasi Email' },
                  { key: 'push', label: 'Push Notification' },
                  { key: 'transaction', label: 'Update Transaksi' },
                  { key: 'promo', label: 'Promo & Marketing' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl">
                    <span className="text-sm">{item.label}</span>
                    <button
                      onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors',
                        notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-muted'
                      )}
                    >
                      <span className={cn(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                        notifications[item.key as keyof typeof notifications] ? 'left-[22px]' : 'left-0.5'
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>



            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-3">
              <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:shadow-neon-violet transition-all">
                <Save className="w-4 h-4" /> Simpan Perubahan
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition-all">
                <LogOut className="w-4 h-4" /> Keluar
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-500 font-medium hover:bg-red-500/10 transition-all">
                <Trash2 className="w-4 h-4" /> Hapus Akun
              </button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
