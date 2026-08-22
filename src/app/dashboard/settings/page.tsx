'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, User, Mail, Lock, Shield, Save, LogOut, 
  Trash2, Loader2, X, Bell, Sparkles, Upload, RefreshCw, AlertTriangle 
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSession, signOut } from 'next-auth/react';
import { usePushNotification } from '@/hooks/usePushNotification';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [avatar, setAvatar] = useState<string | null>(null);
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Populate from session when available
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      setAvatar(session.user.image || null);
    }
  }, [session]);

  // Handle avatar image selection & compression
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 360;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.85);
          setAvatar(compressedDataUrl);
          toast.success('Foto profil dipilih! Klik "Simpan Perubahan" untuk menyimpan.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRandomizeAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setAvatar(newAvatar);
    toast.info('Avatar acak dibuat!');
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    toast.info('Foto profil di-reset.');
  };

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
          image: avatar || '',
          ...(isChangingPassword && { currentPassword, newPassword })
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Pengaturan & Profil berhasil disimpan! 🎉');
        
        // Update local session immediately
        await update({ 
          name, 
          image: avatar || undefined 
        });
        
        // Reset password fields
        setIsChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Gagal menyimpan pengaturan');
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Akun Anda telah berhasil dihapus');
        setShowDeleteModal(false);
        signOut({ redirectTo: '/' });
      } else {
        toast.error(data.message || 'Gagal menghapus akun');
      }
    } catch {
      toast.error('Gagal memproses permintaan hapus akun');
    } finally {
      setIsDeleting(false);
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
            <h1 className="text-lg tablet:text-xl font-bold font-heading">Pengaturan Akun</h1>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="glass-card p-5 sm:p-6">
              <h2 className="text-sm font-bold font-heading mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Profil Pengguna
              </h2>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarFile} 
                accept="image/png, image/jpeg, image/webp, image/gif" 
                className="hidden" 
              />

              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60">
                  <div className="relative group flex-shrink-0 mx-auto sm:mx-0">
                    {avatar ? (
                      <Image 
                        src={avatar} 
                        alt="Avatar" 
                        width={80} 
                        height={80} 
                        className="w-20 h-20 rounded-2xl border-2 border-primary/40 object-cover shadow-lg" 
                        unoptimized
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                        {name ? name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <p className="text-sm font-bold text-foreground">Foto Profil</p>
                    <p className="text-xs text-muted-foreground">Format JPG, PNG, atau WebP. Maksimal 5MB.</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl gradient-primary text-white text-xs font-semibold shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" /> Ubah Foto
                      </button>
                      <button 
                        type="button"
                        onClick={handleRandomizeAvatar}
                        className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted/50 transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Avatar Acak
                      </button>
                      {avatar && (
                        <button 
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="px-3 py-1.5 rounded-xl border border-red-500/25 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Akun (Terkunci)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="email" 
                      value={email} 
                      readOnly 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-muted-foreground cursor-not-allowed select-none" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Push Notifications Section */}
            <div className="glass-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold font-heading flex items-center gap-2">
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
                Dapatkan notifikasi instan langsung di layar HP/Laptop saat top up Anda berhasil diproses tanpa harus me-refresh halaman.
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
                        type="button"
                        onClick={sendTestNotification}
                        disabled={pushLoading}
                        className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
                      >
                        {pushLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>Kirim Tes</span>
                      </button>
                      <button
                        type="button"
                        onClick={unsubscribe}
                        disabled={pushLoading}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition-all"
                      >
                        Nonaktifkan
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={subscribe}
                      disabled={pushLoading}
                      className="px-4 py-2 rounded-xl gradient-primary text-white text-xs font-bold shadow-sm shadow-primary/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      {pushLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bell className="w-3.5 h-3.5" />}
                      <span>Aktifkan Notifikasi Web Push</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="glass-card p-5 sm:p-6">
              <h2 className="text-sm font-bold font-heading mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Keamanan Akun
              </h2>
              <div className="space-y-3">
                {!isChangingPassword ? (
                  <button 
                    type="button"
                    onClick={() => setIsChangingPassword(true)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-muted/20 hover:bg-muted/40 border border-border transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Ubah Kata Sandi</p>
                        <p className="text-[11px] text-muted-foreground">Perbarui password akun untuk keamanan maksimal</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-primary">Atur →</span>
                  </button>
                ) : (
                  <AnimatePresence>
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className="p-4 rounded-xl bg-muted/30 border border-border space-y-4 relative"
                    >
                      <button 
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <h3 className="text-xs font-bold font-heading">Formulir Ganti Password</h3>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Password Saat Ini</label>
                        <input 
                          type="password" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)} 
                          className="w-full px-4 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Password Baru</label>
                        <input 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          className="w-full px-4 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                          placeholder="Minimal 8 karakter"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Konfirmasi Password Baru</label>
                        <input 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          className="w-full px-4 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
                          placeholder="Ulangi password baru"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Verifikasi Sesi & 2-Factor</p>
                      <p className="text-[11px] text-muted-foreground">Proteksi sesi login aktif dengan JWT Enkripsi</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      toast.success(twoFactorEnabled ? '2FA dinonaktifkan' : 'Proteksi sesi tambahan diaktifkan!');
                    }}
                    className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-bold transition-all",
                      twoFactorEnabled 
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {twoFactorEnabled ? 'Aktif' : 'Standar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button 
                type="button"
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-primary text-white font-bold font-heading hover:shadow-neon-orange transition-all disabled:opacity-50 active:scale-95"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                Simpan Perubahan
              </button>

              <button 
                type="button"
                onClick={() => signOut({ redirectTo: '/' })} 
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition-all text-sm"
              >
                <LogOut className="w-4 h-4" /> Keluar dari Akun
              </button>

              <button 
                type="button"
                onClick={() => setShowDeleteModal(true)} 
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-400 font-medium hover:bg-red-500/10 transition-all text-sm"
              >
                <Trash2 className="w-4 h-4" /> Hapus Akun Permanen
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-md w-full p-6 border-red-500/30 shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold font-heading text-foreground mb-2">
                Hapus Akun Permanen?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Tindakan ini tidak dapat dibatalkan. Seluruh riwayat transaksi, saldo wallet, dan data akun Anda akan dihapus secara permanen dari server.
              </p>

              <div className="mb-5">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Masukkan Password Akun Anda untuk Konfirmasi:
                </label>
                <input 
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Password akun"
                  className="w-full px-4 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted/50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Ya, Hapus Akun</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
