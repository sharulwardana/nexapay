'use client';

import { Tag, Zap, Star, Gem, Check, ShieldCheck } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { Denomination } from '@/types';

interface TopUpDenomStepProps {
  denomSectionRef: React.RefObject<HTMLDivElement | null>;
  timeLeft: { hours: number; minutes: number; seconds: number };
  denomCategories: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
  denomCategoryFilter: string;
  setDenomCategoryFilter: (id: string) => void;
  filteredDenominations: Denomination[];
  selectedDenom: string | null;
  handleSelectDenom: (id: string) => void;
  rank: { discount: number; name: string };
}

export default function TopUpDenomStep({
  denomSectionRef,
  timeLeft,
  denomCategories,
  denomCategoryFilter,
  setDenomCategoryFilter,
  filteredDenominations,
  selectedDenom,
  handleSelectDenom,
  rank,
}: TopUpDenomStepProps) {
  return (
    <div
      ref={denomSectionRef}
      className="p-4 sm:p-5 tablet:p-6 rounded-2xl bg-[#121620] border border-white/10 shadow-sm relative overflow-hidden scroll-mt-28"
    >
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-2.5 mb-3.5 sm:mb-4 pb-3 border-b border-white/8">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FF7300]/15 text-[#FF7300] border border-[#FF7300]/30 flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-sm flex-shrink-0">
          2
        </div>
        <Tag className="w-4 h-4 text-[#FF7300] flex-shrink-0" />
        <h2 className="text-xs sm:text-sm tablet:text-base font-bold font-heading text-white">
          Pilih Nominal
        </h2>
      </div>

      {/* Flash Sale Urgency Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold">
        <div className="flex items-center gap-1.5 text-rose-400">
          <Zap className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>FLASH SALE TERBATAS</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-xs">
          <span className="text-[10px] text-slate-400">Berakhir:</span>
          <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30 font-bold">
            {String(timeLeft.hours).padStart(2, '0')}j
          </span>
          <span className="text-rose-400">:</span>
          <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30 font-bold">
            {String(timeLeft.minutes).padStart(2, '0')}m
          </span>
          <span className="text-rose-400">:</span>
          <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30 font-bold">
            {String(timeLeft.seconds).padStart(2, '0')}d
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {denomCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = denomCategoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setDenomCategoryFilter(cat.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border flex-shrink-0 cursor-pointer min-h-[44px] active:scale-95 select-none',
                isActive
                  ? 'bg-[#FF7300] text-[#0B0E14] border-[#FF7300] shadow-md shadow-[#FF7300]/25'
                  : 'bg-[#0B0E14] hover:bg-white/5 text-slate-300 hover:text-white border-white/10'
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-[#0B0E14]" : "text-[#FF7300]")} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Denominations Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 tablet:grid-cols-2 laptop:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
        {filteredDenominations.length > 0 ? (
          filteredDenominations.map((d: Denomination) => {
            const isFlash = d.isFlashSale && d.flashSalePrice;
            const displayPrice = isFlash ? d.flashSalePrice! : d.price;
            const isSelected = selectedDenom === d.id;
            const finalPrice = displayPrice - Math.floor(displayPrice * (rank.discount / 100));
            const strikePrice = (d.originalPrice && d.originalPrice > finalPrice)
              ? d.originalPrice
              : (isFlash && d.price > finalPrice)
              ? d.price
              : (rank.discount > 0 && displayPrice > finalPrice)
              ? displayPrice
              : null;

            return (
              <button
                key={d.id}
                onClick={() => handleSelectDenom(d.id)}
                className={cn(
                  'relative flex flex-col items-center justify-between p-2.5 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer overflow-hidden min-h-[135px] sm:min-h-[140px]',
                  isSelected
                    ? 'border-[#FF7300] bg-[#FF7300]/12 ring-2 ring-[#FF7300]/40 shadow-md'
                    : d.isPopular
                    ? 'border-amber-500/30 bg-[#121620] hover:border-amber-500/60'
                    : 'border-white/10 bg-[#0B0E14] hover:border-[#FF7300]/40 hover:bg-[#121620]'
                )}
              >
                {/* Badges — Positioned at Top-Left to prevent overlap with Selection Checkmark */}
                {isFlash ? (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[7.5px] sm:text-[8px] font-black tracking-wider flex items-center gap-0.5 shadow-sm">
                      <Zap className="w-2 h-2 fill-current" /> SALE
                    </span>
                  </div>
                ) : d.isPopular ? (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-[#0B0E14] text-[7.5px] sm:text-[8px] font-black tracking-wider shadow-sm">
                      <Star className="w-2 h-2 fill-current" /> POPULER
                    </span>
                  </div>
                ) : null}

                {/* Center Gem & Label */}
                <div className="flex flex-col items-center gap-1 sm:gap-1.5 w-full pt-2">
                  <div className={cn(
                    'w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all',
                    isSelected ? 'bg-[#FF7300] text-white shadow-sm' : 'bg-white/5 text-[#FF7300] border border-white/10'
                  )}>
                    <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <p className={cn(
                    'text-[11px] sm:text-xs font-bold font-heading line-clamp-2 px-0.5 leading-tight',
                    isSelected ? 'text-[#FF7300]' : 'text-white'
                  )}>
                    {d.label}
                  </p>
                </div>

                {/* Bottom Price */}
                <div className="w-full flex flex-col items-center mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-white/8 space-y-0.5">
                  {strikePrice && (
                    <span className="text-[9.5px] sm:text-[10px] text-slate-300 line-through font-mono font-medium truncate max-w-full">
                      {formatCurrency(strikePrice)}
                    </span>
                  )}
                  <div className={cn(
                    'w-full py-1 px-1.5 sm:px-2 rounded-lg font-mono font-black text-[11px] sm:text-xs transition-all truncate text-center',
                    isSelected ? 'bg-[#FF7300] text-[#0B0E14]' : 'bg-white/5 text-white border border-white/8'
                  )}>
                    {formatCurrency(finalPrice)}
                  </div>
                </div>

                {/* Selected Check Icon */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#FF7300] text-white flex items-center justify-center shadow-sm z-20">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-8 text-center text-slate-400 text-xs font-medium">
            Tidak ada item dalam kategori ini.
          </div>
        )}
      </div>
    </div>
  );
}
