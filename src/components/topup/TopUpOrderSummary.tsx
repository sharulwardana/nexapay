'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Gamepad2, Zap, Loader2, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PAYMENT_METHODS } from '@/lib/constants';
import type { ProductWithDenominations, Denomination } from '@/types';

interface TopUpOrderSummaryProps {
  game: ProductWithDenominations;
  userId: string;
  serverId: string;
  denom: Denomination | undefined;
  payment: typeof PAYMENT_METHODS[number] | undefined;
  promoCode: string;
  setPromoCode: (code: string) => void;
  handleApplyPromo: () => void;
  price: number;
  discountAmount: number;
  fee: number;
  total: number;
  rank: { discount: number; name: string };
  isFormComplete: boolean;
  isProcessing: boolean;
  handleCheckout: (e?: React.MouseEvent) => void;
  handleAddToCart: (e?: React.MouseEvent) => void;
}

export default function TopUpOrderSummary({
  game,
  userId,
  serverId,
  denom,
  payment,
  promoCode,
  setPromoCode,
  handleApplyPromo,
  price,
  discountAmount,
  fee,
  total,
  rank,
  isFormComplete,
  isProcessing,
  handleCheckout,
  handleAddToCart,
}: TopUpOrderSummaryProps) {
  return (
    <div className="p-5 xl:p-6 rounded-3xl bg-[#121620] border border-white/10 shadow-xl space-y-4">
      <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-[#FF7300]" />
        Detail Pesanan
      </h3>

      {/* Game Overview */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0B0E14] border border-white/8">
        <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0 bg-slate-900 border border-white/10">
          {game.image ? (
            <Image src={game.image} alt={game.name} fill priority sizes="48px" className="object-cover" />
          ) : (
            <Gamepad2 className="w-6 h-6 text-slate-500 m-auto" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate font-heading">{game.name}</p>
          <p className="text-xs text-slate-400 truncate">{game.publisher}</p>
        </div>
      </div>

      {/* Itemized Info */}
      <div className="space-y-2">
        <div className="flex justify-between p-2.5 rounded-xl bg-[#0B0E14] border border-white/8 text-xs">
          <span className="text-slate-300">Akun Game</span>
          <span className="font-bold text-white text-right">
            {userId ? <>{userId}{serverId ? ` (${serverId})` : ''}</> : <span className="text-rose-400">Belum diisi</span>}
          </span>
        </div>
        <div className="flex justify-between p-2.5 rounded-xl bg-[#0B0E14] border border-white/8 text-xs">
          <span className="text-slate-300">Item Dipilih</span>
          <span className="font-bold text-white text-right truncate max-w-[180px]">
            {denom ? denom.label : <span className="text-rose-400">Pilih Nominal</span>}
          </span>
        </div>
        <div className="flex justify-between p-2.5 rounded-xl bg-[#0B0E14] border border-white/8 text-xs">
          <span className="text-slate-300">Metode Bayar</span>
          <span className="font-bold text-white text-right">
            {payment ? payment.name : <span className="text-rose-400">Pilih Pembayaran</span>}
          </span>
        </div>
      </div>

      {/* Promo Code Input */}
      <div className="pt-2 border-t border-white/8">
        <label htmlFor="order-promo-code-input" className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5 block font-heading">
          Punya Kode Promo? <span className="font-normal text-slate-400">(Opsional)</span>
        </label>
        <div className="flex gap-2">
          <input
            id="order-promo-code-input"
            name="promoCode"
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Contoh: NEXAWIN"
            className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#0B0E14] border border-white/12 text-xs font-mono font-bold text-white uppercase placeholder:text-slate-400 outline-none focus:border-[#FF7300]"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="btn-secondary px-3.5 py-2 text-xs font-bold"
          >
            Klaim
          </button>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="pt-2 border-t border-white/8 space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-300">
          <span>Harga {rank.discount > 0 && `(Diskon ${rank.name})`}</span>
          <span className="font-mono">{formatCurrency(price)}</span>
        </div>

        {rank.discount > 0 && denom && (
          <div className="flex justify-between text-emerald-400 font-medium">
            <span>Diskon Member {rank.discount}%</span>
            <span className="font-mono">-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        {fee > 0 && (
          <div className="flex justify-between text-slate-300">
            <span>Biaya Layanan Admin</span>
            <span className="font-mono">{formatCurrency(fee)}</span>
          </div>
        )}

        <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/8">
          <span>Total Bayar</span>
          <span className="text-[#FF7300] font-mono font-black text-lg">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Guarantee Pill */}
      <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
        <Zap className="w-3.5 h-3.5" />
        <span>Estimasi Pengiriman: &lt; 30 Detik</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleCheckout}
          disabled={!isFormComplete || isProcessing}
          className="btn-primary w-full py-3.5 text-sm font-bold shadow-md shadow-[#FF7300]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Memproses Pesanan...</>
          ) : !isFormComplete ? (
            'Lengkapi Data Pembelian'
          ) : (
            <><Zap className="w-4 h-4" /> Beli Sekarang</>
          )}
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isFormComplete || isProcessing}
          className="btn-secondary w-full py-3 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Tambah ke Keranjang</span>
        </button>
      </div>

      <p className="text-[10px] text-center text-slate-500 pt-1 leading-normal">
        Dengan melanjutkan, kamu menyetujui <Link href="/terms" className="text-[#FF7300] hover:underline">Syarat &amp; Ketentuan</Link> NexaPay.
      </p>
    </div>
  );
}
