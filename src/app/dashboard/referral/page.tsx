'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Copy, Share2, Users, TrendingUp, DollarSign, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';

const referralHistory = [
  { id: 'r1', name: 'Diana K.', date: '25 Mei 2026', bonus: 10000, status: 'completed' },
  { id: 'r2', name: 'Budi S.', date: '23 Mei 2026', bonus: 10000, status: 'completed' },
  { id: 'r3', name: 'Sarah M.', date: '20 Mei 2026', bonus: 10000, status: 'completed' },
  { id: 'r4', name: 'Andi P.', date: '18 Mei 2026', bonus: 10000, status: 'pending' },
  { id: 'r5', name: 'Mega F.', date: '15 Mei 2026', bonus: 10000, status: 'completed' },
];

export default function ReferralPage() {
  const code = 'RIZKY2026';
  const totalEarned = 50000;
  const totalReferrals = 5;

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Kode referral disalin!');
  };

  const shareLink = () => {
    const url = `https://nexapay.id/register?ref=${code}`;
    if (navigator.share) {
      navigator.share({ title: 'NexaPay Referral', text: `Daftar NexaPay pakai kode ${code} dan dapatkan bonus!`, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link referral disalin!');
    }
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
            <h1 className="text-lg tablet:text-xl font-bold">Referral Program</h1>
          </motion.div>

          {/* Referral Card */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="glass-card p-6 tablet:p-8 bg-gradient-to-br from-primary/5 to-accent/5 mb-6 text-center"
          >
            <Gift className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="text-lg tablet:text-xl font-bold mb-2">Ajak Teman, Dapat Bonus!</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Bagikan kode referral kamu dan dapatkan <span className="text-primary font-bold">Rp 10.000</span> untuk setiap teman yang melakukan transaksi pertama!
            </p>

            {/* Code Box */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="px-6 py-3 rounded-xl bg-muted/50 border-2 border-dashed border-primary/30">
                <span className="text-xl tablet:text-2xl font-bold font-mono gradient-text tracking-widest">{code}</span>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row items-center justify-center gap-3">
              <button onClick={copyCode} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:shadow-neon-violet transition-all">
                <Copy className="w-4 h-4" /> Salin Kode
              </button>
              <button onClick={shareLink} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-semibold hover:bg-muted/50 transition-all">
                <Share2 className="w-4 h-4" /> Bagikan Link
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 tablet:gap-4 mb-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 text-center">
              <Users className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold">{totalReferrals}</p>
              <p className="text-[10px] text-muted-foreground">Teman Direferensikan</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4 text-center">
              <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-green-500">{formatCurrency(totalEarned)}</p>
              <p className="text-[10px] text-muted-foreground">Total Bonus Diterima</p>
            </motion.div>
          </div>

          {/* How it Works */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 mb-6">
            <h3 className="text-sm font-semibold mb-4">Cara Kerja</h3>
            <div className="space-y-4">
              {[
                { step: 1, text: 'Bagikan kode referral kamu ke teman' },
                { step: 2, text: 'Teman mendaftar dan memasukkan kode kamu' },
                { step: 3, text: 'Teman melakukan transaksi pertama' },
                { step: 4, text: 'Kamu dan teman masing-masing dapat Rp 10.000!' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <p className="text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Referral History */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold">Riwayat Referral</h3>
            </div>
            <div className="divide-y divide-border">
              {referralHistory.map((ref) => (
                <div key={ref.id} className="flex items-center gap-3 p-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary">
                    {ref.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{ref.name}</p>
                    <p className="text-[10px] text-muted-foreground">{ref.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-500">+{formatCurrency(ref.bonus)}</p>
                    <p className={cn('text-[10px] font-medium', ref.status === 'completed' ? 'text-green-500' : 'text-yellow-500')}>
                      {ref.status === 'completed' ? 'Diterima' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
