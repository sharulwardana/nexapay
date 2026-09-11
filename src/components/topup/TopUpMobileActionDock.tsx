'use client';

import { ShoppingCart, Zap, Loader2, User, Tag, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Denomination } from '@/types';

interface TopUpMobileActionDockProps {
  denom: Denomination | undefined;
  total: number;
  userId: string;
  isVoucherProduct: boolean;
  selectedDenom: string | null;
  selectedPayment: string | null;
  isProcessing: boolean;
  handleCheckout: (e?: React.MouseEvent) => void;
  handleAddToCart: (e?: React.MouseEvent) => void;
}

export default function TopUpMobileActionDock({
  denom,
  total,
  userId,
  isVoucherProduct,
  selectedDenom,
  selectedPayment,
  isProcessing,
  handleCheckout,
  handleAddToCart,
}: TopUpMobileActionDockProps) {
  return (
    <div
      className="fixed inset-x-0 z-50 md:hidden pointer-events-none flex justify-center px-2 xs:px-3 sm:px-4"
      style={{
        bottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="pointer-events-auto relative w-full max-w-[420px] h-[58px] sm:h-[62px] rounded-2xl p-1.5 sm:p-2 bg-[#0E121B]/90 backdrop-blur-2xl border border-white/15 shadow-2xl flex items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Info: Selected Item + Price */}
        <div className="flex-1 min-w-0 pl-2 flex flex-col justify-center">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[120px]">
              {denom ? denom.label : 'Pilih Item'}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-sm font-extrabold text-white font-heading tracking-tight truncate">
              {denom ? formatCurrency(total) : 'Rp 0'}
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isProcessing}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF7300] text-slate-300 hover:text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer flex-shrink-0"
            aria-label="Tambah ke Keranjang"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={isProcessing}
            className="btn-primary h-10 px-3.5 sm:px-4 rounded-xl text-xs font-bold whitespace-nowrap active:scale-95"
          >
            {isProcessing ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Proses</>
            ) : !userId && !isVoucherProduct ? (
              <><User className="w-3.5 h-3.5" /> Isi Akun</>
            ) : !selectedDenom ? (
              <><Tag className="w-3.5 h-3.5" /> Pilih Item</>
            ) : !selectedPayment ? (
              <><CreditCard className="w-3.5 h-3.5" /> Pembayaran</>
            ) : (
              <><Zap className="w-3.5 h-3.5" /> Beli Sekarang</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
