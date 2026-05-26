import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Mythic';

export interface UserState {
  name: string;
  avatar: string;
  exp: number;
  addExp: (amount: number) => void;
  resetExp: () => void;
}

export const RANKS = [
  { name: 'Bronze', minExp: 0, discount: 0, color: 'text-orange-400', bg: 'bg-orange-400/20' },
  { name: 'Silver', minExp: 500, discount: 1, color: 'text-slate-300', bg: 'bg-slate-300/20' },
  { name: 'Gold', minExp: 2000, discount: 3, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  { name: 'Mythic', minExp: 5000, discount: 5, color: 'text-purple-500', bg: 'bg-purple-500/20' },
] as const;

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: 'Gamer_Nexa',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nexa',
      exp: 0,
      addExp: (amount) => set((state) => ({ exp: state.exp + amount })),
      resetExp: () => set({ exp: 0 }),
    }),
    {
      name: 'nexapay-user-storage',
    }
  )
);

export const useUserGamification = () => {
  const exp = useUserStore((state) => state.exp);
  
  let currentRank: typeof RANKS[number] = RANKS[0];
  let nextRank: typeof RANKS[number] | null = RANKS[1];

  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (exp >= RANKS[i].minExp) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || null;
      break;
    }
  }

  const currentLevelExp = exp - currentRank.minExp;
  const expNeeded = nextRank ? nextRank.minExp - currentRank.minExp : 0;
  const progressPercent = nextRank ? Math.min(100, Math.max(0, (currentLevelExp / expNeeded) * 100)) : 100;

  return {
    rank: currentRank,
    nextRank,
    progressPercent,
    currentLevelExp,
    expNeeded,
  };
};
