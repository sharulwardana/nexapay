'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Copy, Share2, Users, TrendingUp, DollarSign, ChevronRight } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';
import EmptyState from '@/components/shared/EmptyState';

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
      <main className="min-h-screen pt-28 tablet:pt-30 pb-24 bg-background">
        <div className="container-app max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg tablet:text-xl font-bold font-heading">Program Referral</h1>
          </div>

          {/* Referral Card */}
          <div className="bg-[#121620] border border-white/10 rounded-2xl p-6 tablet:p-8 mb-6 text-center shadow-sm">
            <Gift className="w-12 h-12 text-brand-500 mx-auto mb-3" />
            <h2 className="text-lg tablet:text-xl font-bold font-heading mb-2">Ajak Teman, Dapatkan Bonus!</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Bagikan kode referral kamu dan dapatkan <span className="text-brand-500 font-bold">Rp 10.000</span> untuk setiap teman yang melakukan transaksi pertama!
            </p>

            {/* Code Box */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="px-6 py-3 rounded-xl bg-[#181E2B] border-2 border-dashed border-brand-500/30">
                <span className="text-xl tablet:text-2xl font-black font-mono text-brand-500 tracking-widest">{displayCode}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
              <button
                onClick={copyCode}
                disabled={!code}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-white text-xs tablet:text-sm font-bold shadow-brand active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
              >
                <Copy className="w-4 h-4 shrink-0" /> Salin Kode
              </button>
              <button
                onClick={shareLink}
                disabled={!code}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-secondary text-xs tablet:text-sm font-bold active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
              >
                <Share2 className="w-4 h-4 shrink-0 text-brand-500" /> Bagikan Link
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 tablet:gap-4 mb-6">
            <div className="bg-[#121620] border border-white/10 rounded-2xl p-4 text-center shadow-sm">
              <Users className="w-6 h-6 text-brand-500 mx-auto mb-1" />
              <p className="text-xl font-bold font-heading">{totalReferrals}</p>
              <p className="text-[10px] text-muted-foreground">Teman Direferensikan</p>
            </div>
            <div className="bg-[#121620] border border-white/10 rounded-2xl p-4 text-center shadow-sm">
              <DollarSign className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <p className="text-xl font-bold font-heading text-emerald-400">{formatCurrency(totalEarned)}</p>
              <p className="text-[10px] text-muted-foreground">Total Bonus Diterima</p>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-[#121620] border border-white/10 rounded-2xl p-5 mb-6 shadow-sm">
            <h3 className="text-sm font-bold font-heading mb-4">Cara Kerja Referral</h3>
            <div className="space-y-4">
              {[
                { step: 1, text: 'Bagikan kode referral kamu ke teman' },
                { step: 2, text: 'Teman mendaftar dan memasukkan kode kamu' },
                { step: 3, text: 'Teman melakukan transaksi pertama' },
                { step: 4, text: 'Kamu dapat Rp 10.000!' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-500/15 text-brand-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </div>
                  <p className="text-sm text-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="bg-[#121620] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-sm font-bold font-heading text-foreground">Riwayat Referral</h3>
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
              <div className="p-6">
                <EmptyState
                  icon={Users}
                  title="Belum Ada Teman Bergabung"
                  description="Bagikan kode referral kamu ke teman atau grup mabar kamu untuk mulai mengumpulkan bonus saldo!"
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
