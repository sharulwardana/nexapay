'use client';

import { motion } from 'framer-motion';
import { User, Info, CheckCircle2, Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductWithDenominations } from '@/types';

interface TopUpAccountStepProps {
  game: ProductWithDenominations;
  isVoucherProduct: boolean;
  userId: string;
  setUserId: (val: string) => void;
  serverId: string;
  setServerId: (val: string) => void;
  setIsValidated: (val: boolean) => void;
  isCheckingNickname: boolean;
  verifiedNickname: string | null;
  nicknameRegion: string | null;
  nicknameError: string | null;
  accountSectionRef: React.RefObject<HTMLDivElement | null>;
  onOpenHelpModal: () => void;
}

export default function TopUpAccountStep({
  game,
  isVoucherProduct,
  userId,
  setUserId,
  serverId,
  setServerId,
  setIsValidated,
  isCheckingNickname,
  verifiedNickname,
  nicknameRegion,
  nicknameError,
  accountSectionRef,
  onOpenHelpModal,
}: TopUpAccountStepProps) {
  return (
    <section ref={accountSectionRef} id="step-account">
      <div className="p-3.5 sm:p-5 tablet:p-6 rounded-2xl bg-[#121620] border border-white/10 shadow-sm relative overflow-hidden">
        {/* Step Header */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-3.5 pb-3 border-b border-white/8">
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FF7300]/15 text-[#FF7300] border border-[#FF7300]/30 flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-sm flex-shrink-0">
              1
            </div>
            <User className="w-4 h-4 text-[#FF7300] flex-shrink-0 hidden sm:block" />
            <h2 className="text-[11.5px] xs:text-xs sm:text-sm tablet:text-base font-bold font-heading text-white whitespace-nowrap">
              {isVoucherProduct ? 'Status Voucher' : 'Masukkan Data Akun'}
            </h2>
          </div>

          {!isVoucherProduct && (
            <button
              type="button"
              onClick={onOpenHelpModal}
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#FF7300] hover:text-white bg-[#FF7300]/10 hover:bg-[#FF7300]/20 min-h-[34px] sm:min-h-[38px] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-[#FF7300]/20 transition-all cursor-pointer flex-shrink-0 active:scale-95"
            >
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden min-[360px]:inline">Petunjuk ID</span>
              <span className="min-[360px]:hidden">Petunjuk</span>
            </button>
          )}
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          {isVoucherProduct ? (
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#FF7300]/10 border border-[#FF7300]/20 text-xs text-white space-y-1">
              <div className="font-bold text-[#FF7300] flex items-center gap-2">
                <span>Voucher Otomatis Dikirim ke Kontak WhatsApp / Email</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Produk ini berupa Kode Voucher Resmi ({game.name}). Tidak memerlukan User ID Game. Kode voucher akan dikirimkan otomatis setelah transaksi berhasil.
              </p>
            </div>
          ) : ['mobile-legends'].includes(game.slug) ? (
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              <div className="col-span-3">
                <label htmlFor="topup-user-id" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  User ID <span className="text-rose-500">*</span>
                </label>
                <input
                  id="topup-user-id"
                  name="userId"
                  type="text"
                  aria-required="true"
                  value={userId}
                  onChange={(e) => { setUserId(e.target.value); setIsValidated(false); }}
                  placeholder="12345678"
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#0B0E14] border border-white/12 text-xs sm:text-sm font-semibold text-white placeholder:text-slate-400 outline-none focus:border-[#FF7300] focus:ring-1 focus:ring-[#FF7300]/30 transition-all"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="topup-zone-id" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Zone ID <span className="text-rose-500">*</span>
                </label>
                <input
                  id="topup-zone-id"
                  name="zoneId"
                  type="text"
                  aria-required="true"
                  value={serverId}
                  onChange={(e) => { setServerId(e.target.value); setIsValidated(false); }}
                  placeholder="(2103)"
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#0B0E14] border border-white/12 text-xs sm:text-sm font-semibold text-white placeholder:text-slate-400 outline-none focus:border-[#FF7300] focus:ring-1 focus:ring-[#FF7300]/30 transition-all"
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="topup-general-id" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {['valorant', 'wild-rift'].includes(game.slug) ? 'Riot ID & Tag' : 'User ID / Player ID'} <span className="text-rose-500">*</span>
              </label>
              <input
                id="topup-general-id"
                name="userId"
                type="text"
                aria-required="true"
                value={userId}
                onChange={(e) => { setUserId(e.target.value); setIsValidated(false); }}
                placeholder={['valorant', 'wild-rift'].includes(game.slug) ? 'Contoh: Westbourne#SEA' : 'Masukkan User ID Game'}
                className="w-full px-4 py-3 rounded-xl bg-[#0B0E14] border border-white/12 text-sm font-semibold text-white placeholder:text-slate-400 outline-none focus:border-[#FF7300] focus:ring-1 focus:ring-[#FF7300]/30 transition-all"
              />
            </div>
          )}

          {/* Server Selector for Genshin / Honkai / ZZZ */}
          {['genshin-impact', 'honkai-star-rail', 'zenless-zone-zero'].includes(game.slug) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Server Game <span className="text-rose-500">*</span>
                </label>
                {serverId && (
                  <span className="text-xs text-[#FF7300] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {serverId === 'TW_HK_MO' ? 'TW, HK, MO' : serverId}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'Asia', name: 'Asia', code: 'UID 8 / 9' },
                  { id: 'America', name: 'America', code: 'UID 6' },
                  { id: 'Europe', name: 'Europe', code: 'UID 7' },
                  { id: 'TW_HK_MO', name: 'TW, HK, MO', code: 'UID 9' },
                ].map((srv) => {
                  const isSelected = serverId === srv.id;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => { setServerId(srv.id); setIsValidated(false); }}
                      className={cn(
                        'flex flex-col items-center justify-center p-3 min-h-[56px] rounded-xl border text-center transition-all cursor-pointer',
                        isSelected
                          ? 'bg-[#FF7300]/15 border-[#FF7300] text-white shadow-sm ring-1 ring-[#FF7300]/30'
                          : 'bg-[#0B0E14] hover:bg-white/5 border-white/10 text-slate-300 hover:text-white'
                      )}
                    >
                      <Globe className="w-4 h-4 mb-1 text-[#FF7300]" />
                      <span className="text-xs font-bold font-heading">{srv.name}</span>
                      <span className="text-[10.5px] text-slate-300 font-mono mt-0.5">{srv.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Real-Time Nickname Verification Badge — Fixed Height Container to Eliminate CLS */}
          {!isVoucherProduct && (
            <div className="pt-1 min-h-[44px]">
              {isCheckingNickname ? (
                <div className="flex items-center gap-2.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#FF7300]/10 border border-[#FF7300]/20 text-[#FF7300] text-xs font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span>Memverifikasi akun ke server game...</span>
                </div>
              ) : verifiedNickname ? (
                <div className="p-3 min-h-[44px] rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">NICKNAME:</span>
                        <span className="text-xs sm:text-sm font-extrabold text-white truncate">{verifiedNickname}</span>
                      </div>
                      <p className="text-[10.5px] text-emerald-400 font-medium">Akun Terverifikasi Resmi</p>
                    </div>
                  </div>

                  {nicknameRegion && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30 flex-shrink-0">
                      {nicknameRegion}
                    </span>
                  )}
                </div>
              ) : nicknameError ? (
                <div className="flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-medium">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{nicknameError}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white/[0.02] border border-white/5 text-slate-300 text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400/80 flex-shrink-0" />
                  <span>Nickname akun akan diverifikasi otomatis setelah User ID dimasukkan.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
