import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'IDR' | 'USD' | 'MYR' | 'SGD' | 'PHP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateFromIdr: number; // Multiply IDR amount by this rate
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    flag: '🇮🇩',
    rateFromIdr: 1,
    decimals: 0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateFromIdr: 0.000063,
    decimals: 2,
  },
  MYR: {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    flag: '🇲🇾',
    rateFromIdr: 0.00028,
    decimals: 2,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    rateFromIdr: 0.000085,
    decimals: 2,
  },
  PHP: {
    code: 'PHP',
    symbol: '₱',
    name: 'Philippine Peso',
    flag: '🇵🇭',
    rateFromIdr: 0.0036,
    decimals: 2,
  },
};

interface CurrencyStore {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountInIdr: number) => string;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: 'IDR',
      setCurrency: (currency) => set({ currency }),
      formatPrice: (amountInIdr: number) => {
        const currentCurrency = get().currency;
        const config = CURRENCIES[currentCurrency] || CURRENCIES.IDR;
        const converted = amountInIdr * config.rateFromIdr;

        if (config.code === 'IDR') {
          return `Rp ${Math.round(converted).toLocaleString('id-ID')}`;
        }

        return `${config.symbol} ${converted.toLocaleString('en-US', {
          minimumFractionDigits: config.decimals,
          maximumFractionDigits: config.decimals,
        })}`;
      },
    }),
    {
      name: 'nexapay-currency-preference',
    }
  )
);
