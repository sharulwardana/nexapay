'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Copy, Share2, Users, TrendingUp, DollarSign, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ReferralHistoryItem {
  id: string;
  name: string;
  date: string;
  bonus: number;
  status: string;
}

interface ReferralClientProps {
  code: string | null;
  totalEarned: number;
  totalReferrals: number;
  history: ReferralHistoryItem[];
}

export default function ReferralClient({ code, totalEarned, totalReferrals, history }: ReferralClientProps) {
  const displayCode = code || 'TIDAK ADA KODE';

  const copyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success('Kode referral disalin!');
  };

  const shareLink = () => {
    if (!code) return;
    const url = `https://nexapay.id/login?ref=${code}`;
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
      <main className="min-h-screen pt-28 tablet:pt-30 pb-24 aurora-bg">
        <div className="container-app max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg tablet:text-xl font-bold">Referral Program</h1>
          </div>

          {/* Referral Card */}
          <div
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
                <span className="text-xl tablet:text-2xl font-bold font-mono gradient-text tracking-widest">{displayCode}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
              <button
                onClick={copyCode}
                disabled={!code}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-xs tablet:text-sm font-bold shadow-[0_4px_15px_rgba(249,115,22,0.35)] hover:shadow-[0_6px_25px_rgba(249,115,22,0.6)] active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                <Copy className="w-4 h-4 shrink-0" /> Salin Kode
              </button>
              <button
                onClick={shareLink}
                disabled={!code}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card/60 text-xs tablet:text-sm font-bold hover:bg-muted/70 hover:border-primary/40 hover:shadow-[0_4px_15px_rgba(255,115,0,0.15)] active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                <Share2 className="w-4 h-4 shrink-0 text-primary" /> Bagikan Link
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 tablet:gap-4 mb-6">
            <div className="glass-card p-4 text-center">
              <Users className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold">{totalReferrals}</p>
              <p className="text-[10px] text-muted-foreground">Teman Direferensikan</p>
            </div>
            <div className="glass-card p-4 text-center">
              <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-green-500">{formatCurrency(totalEarned)}</p>
              <p className="text-[10px] text-muted-foreground">Total Bonus Diterima</p>
            </div>
          </div>

          {/* How it Works */}
          <div className="glass-card p-5 mb-6">
            <h3 className="text-sm font-semibold mb-4">Cara Kerja</h3>
            <div className="space-y-4">
              {[
                { step: 1, text: 'Bagikan kode referral kamu ke teman' },
                { step: 2, text: 'Teman mendaftar dan memasukkan kode kamu' },
                { step: 3, text: 'Teman melakukan transaksi pertama' },
                { step: 4, text: 'Kamu dapat Rp 10.000!' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </div>
                  <p className="text-sm">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold">Riwayat Referral</h3>
            </div>
            {history.length > 0 ? (
              <div className="divide-y divide-border">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-semibold">{item.name} bergabung</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(item.date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-500">+{formatCurrency(item.bonus)}</p>
                      <p className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full inline-block mt-1",
                        item.status === 'completed' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                      )}>
                        {item.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Belum ada teman yang menggunakan kode referralmu.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
