'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Mail, Lock, Shield, Save, LogOut, Trash2, Loader2, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSession, signOut } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  // Populate from session when available
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleSave = async () => {
    if (isChangingPassword) {
      if (!currentPassword) return toast.error('Masukkan password saat ini');
      if (!newPassword) return toast.error('Masukkan password baru');
      if (newPassword !== confirmPassword) return toast.error('Konfirmasi password tidak cocok');
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          ...(isChangingPassword && { currentPassword, newPassword })
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Pengaturan berhasil disimpan!');
        
        // Update session with new name
        if (name !== session?.user?.name) {
          await update({ name });
        }
        
        // Reset password fields
        setIsChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Gagal menyimpan pengaturan');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-30 pb-24 aurora-bg">
        <div className="container-app max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg tablet:text-xl font-bold">Pengaturan</h1>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Profil</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="Avatar" className="w-16 h-16 rounded-2xl border-2 border-border object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <button className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/50 transition-all">Ubah Foto</button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email (Tidak dapat diubah)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="email" 
                      value={email} 
                      readOnly 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-muted-foreground cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Keamanan</h2>
              <div className="space-y-3">
                
                {!isChangingPassword ? (
                  <button 
                    onClick={() => setIsChangingPassword(true)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3"><Lock className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Ubah Password</span></div>
                    <span className="text-xs text-muted-foreground">→</span>
                  </button>
                ) : (
                  <AnimatePresence>
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className="p-4 rounded-xl bg-muted/30 border border-border space-y-4 relative"
                    >
                      <button 
                        onClick={() => setIsChangingPassword(false)}
                        className="absolute top-2 right-2 p-1 text-muted-foreground hover:bg-muted rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <h3 className="text-sm font-semibold mb-2">Ubah Password</h3>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password Saat Ini</label>
                        <input 
                          type="password" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)} 
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password Baru</label>
                        <input 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Konfirmasi Password Baru</label>
                        <input 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3"><Shield className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Verifikasi 2 Langkah</span></div>
                  <span className="text-xs text-green-500 font-medium">Aktif</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:shadow-neon-violet transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                Simpan Perubahan
              </button>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition-all">
                <LogOut className="w-4 h-4" /> Keluar
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-500 font-medium hover:bg-red-500/10 transition-all">
                <Trash2 className="w-4 h-4" /> Hapus Akun
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
