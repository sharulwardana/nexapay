'use client';

import Image from 'next/image';
import { CreditCard, Check } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { PAYMENT_METHODS } from '@/lib/constants';
import type { Denomination } from '@/types';

interface TopUpPaymentStepProps {
  paymentSectionRef: React.RefObject<HTMLDivElement | null>;
  paymentCategoryPills: Array<{ id: string; label: string }>;
  paymentCategoryFilter: string;
  setPaymentCategoryFilter: (id: string) => void;
  paymentsByCategory: Record<string, typeof PAYMENT_METHODS[number][]>;
  selectedPayment: string | null;
  setSelectedPayment: (id: string) => void;
  denom: Denomination | undefined;
  price: number;
}

export default function TopUpPaymentStep({
  paymentSectionRef,
  paymentCategoryPills,
  paymentCategoryFilter,
  setPaymentCategoryFilter,
  paymentsByCategory,
  selectedPayment,
  setSelectedPayment,
  denom,
  price,
}: TopUpPaymentStepProps) {
  return (
    <div
      ref={paymentSectionRef}
      className="p-4 sm:p-5 tablet:p-6 rounded-2xl bg-[#121620] border border-white/10 shadow-sm relative overflow-hidden scroll-mt-28"
    >
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-2.5 mb-3.5 sm:mb-4 pb-3 border-b border-white/8">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FF7300]/15 text-[#FF7300] border border-[#FF7300]/30 flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-sm flex-shrink-0">
          3
        </div>
        <CreditCard className="w-4 h-4 text-[#FF7300] flex-shrink-0" />
        <h2 className="text-xs sm:text-sm tablet:text-base font-bold font-heading text-white">
          Pilih Metode Pembayaran
        </h2>
      </div>

      {/* Payment Category Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {paymentCategoryPills.map((pill) => {
          const isActive = paymentCategoryFilter === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => setPaymentCategoryFilter(pill.id)}
              className={cn(
                'px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border flex-shrink-0 cursor-pointer min-h-[44px] active:scale-95 select-none',
                isActive
                  ? 'bg-[#FF7300] text-[#0B0E14] border-[#FF7300] shadow-md shadow-[#FF7300]/25'
                  : 'bg-[#0B0E14] hover:bg-white/5 text-slate-300 hover:text-white border-white/10'
              )}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Methods Grouped by Category */}
      <div className="space-y-4 sm:space-y-5">
        {Object.entries(paymentsByCategory)
          .filter(([category]) => {
            if (paymentCategoryFilter === 'ALL') return true;
            const catLower = category.toLowerCase();
            const filterLower = paymentCategoryFilter.toLowerCase();
            if (paymentCategoryFilter === 'Bank Transfer') return catLower.includes('bank') || catLower.includes('virtual');
            if (paymentCategoryFilter === 'Minimarket') return catLower.includes('minimarket') || catLower.includes('convenience');
            return catLower.includes(filterLower);
          })
          .map(([category, methods]) => (
            <div key={category}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-0.5 font-heading">
                {category}
              </h3>
              <div className="space-y-2">
                {methods.map((pm) => {
                  const isPmSelected = selectedPayment === pm.id;
                  const netTotalForPm = denom ? price + pm.fee : null;

                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setSelectedPayment(pm.id)}
                      className={cn(
                        'w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group cursor-pointer',
                        isPmSelected
                          ? 'border-[#FF7300] bg-[#FF7300]/10 shadow-sm ring-1 ring-[#FF7300]'
                          : 'border-white/10 bg-[#0B0E14] hover:border-[#FF7300]/30 hover:bg-[#161D2C]'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-8 rounded-lg bg-white/5 border border-white/10 p-1 flex items-center justify-center flex-shrink-0">
                          <div className="relative w-full h-full">
                            <Image src={pm.icon} alt={pm.name} fill sizes="40px" unoptimized className="object-contain" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn('text-xs sm:text-sm font-bold truncate group-hover:text-[#FF7300] transition-colors font-heading', isPmSelected ? 'text-[#FF7300]' : 'text-white')}>
                            {pm.name}
                          </p>
                          <p className="text-[10.5px] text-slate-300 mt-0.5 font-medium">
                            {pm.fee > 0 ? `Biaya Admin: +${formatCurrency(pm.fee)}` : 'Bebas Biaya Admin'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0 pl-2">
                        {netTotalForPm !== null ? (
                          <span className={cn('text-xs sm:text-sm font-black font-mono', isPmSelected ? 'text-[#FF7300]' : 'text-white')}>
                            {formatCurrency(netTotalForPm)}
                          </span>
                        ) : (
                          <span className="text-[10.5px] text-slate-300 font-semibold">
                            {pm.fee > 0 ? `+${formatCurrency(pm.fee)}` : 'Gratis'}
                          </span>
                        )}

                        <div className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                          isPmSelected ? 'bg-[#FF7300] text-white shadow-sm' : 'border border-white/20'
                        )}>
                          {isPmSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
