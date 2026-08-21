'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Mail, Lock, Shield, Save, LogOut, Trash2, Loader2, X, Bell, Sparkles } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSession, signOut } from 'next-auth/react';
import { usePushNotification } from '@/hooks/usePushNotification';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    isLoading: pushLoading, 
    subscribe, 
    unsubscribe, 
    sendTestNotification 
  } = usePushNotification();
  
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
                    <Image src={session.user.image} alt="Avatar" width={64} height={64} className="w-16 h-16 rounded-2xl border-2 border-border object-cover" />
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

            {/* Push Notifications Section */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" /> Notifikasi Pop-up (Web Push)
                </h2>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                  isSubscribed 
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                    : "bg-muted text-muted-foreground border-border"
                )}>
                  {isSubscribed ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Terima pembaruan status transaksi instan langsung di layar HP/Laptop Anda secara real-time meskipun browser sedang ditutup.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/30 border border-border">
                <div>
                  <p className="text-xs font-bold text-foreground">Status Izin Browser</p>
                  <p className="text-[11px] text-muted-foreground capitalize mt-0.5">
                    {permission === 'granted' ? 'Izin Diberikan ✅' : permission === 'denied' ? 'Izin Diblokir di Browser ❌' : 'Belum Dikonfigurasi'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isSubscribed ? (
                    <>
                      <button
                        onClick={sendTestNotification}
                        disabled={pushLoading}
                        className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
                      >
                        {pushLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>Kirim Tes</span>
                      </button>
                      <button
                        onClick={unsubscribe}
                        disabled={pushLoading}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition-all"
                      >
                        Nonaktifkan
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={subscribe}
                      disabled={pushLoading}
                      className="px-4 py-2 rounded-xl gradient-primary text-white text-xs font-bold shadow-sm shadow-primary/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      {pushLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bell className="w-3.5 h-3.5" />}
                      <span>Aktifkan Notifikasi Pop-up</span>
                    </button>
                  )}
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
              <button onClick={() => signOut({ redirectTo: '/' })} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition-all">
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
