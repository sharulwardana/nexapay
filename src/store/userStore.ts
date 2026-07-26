import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOYALTY_LEVELS } from '@/lib/constants';

// Re-export LOYALTY_LEVELS as the single source of truth for rank system
// Previously there were two competing rank systems (RANKS vs LOYALTY_LEVELS).
// Now everything uses LOYALTY_LEVELS from constants.ts.

export interface UserState {
  name: string;
  avatar: string;
}

export const useUserStore = create<UserState>()(
  persist(
    () => ({
      name: 'Gamer_Nexa',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nexa',
    }),
    {
      name: 'nexapay-user-storage',
    }
  )
);

/**
 * Derive loyalty rank from session points using the unified LOYALTY_LEVELS system.
 * Use this instead of the old RANKS-based gamification.
 */
export function getLoyaltyRank(points: number) {
  let levelKey: keyof typeof LOYALTY_LEVELS = 'BRONZE';
  if (points >= LOYALTY_LEVELS.DIAMOND.minPoints) levelKey = 'DIAMOND';
  else if (points >= LOYALTY_LEVELS.PLATINUM.minPoints) levelKey = 'PLATINUM';
  else if (points >= LOYALTY_LEVELS.GOLD.minPoints) levelKey = 'GOLD';
  else if (points >= LOYALTY_LEVELS.SILVER.minPoints) levelKey = 'SILVER';

  const rank = LOYALTY_LEVELS[levelKey];
  const nextRank = levelKey === 'DIAMOND' ? null :
    Object.values(LOYALTY_LEVELS).find(v => v.minPoints > points) || null;

  const progressPercent = nextRank
    ? ((points - rank.minPoints) / (nextRank.minPoints - rank.minPoints)) * 100
    : 100;

  return { rank, nextRank, progressPercent, levelKey };
}
