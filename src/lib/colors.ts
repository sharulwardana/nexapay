/** Per-game brand colors to avoid monotone "AI look" */
export const GAME_COLORS: Record<string, { from: string; to: string; accent: string }> = {
  'mobile-legends':    { from: 'from-blue-600',    to: 'to-indigo-800',    accent: 'text-blue-400' },
  'free-fire':         { from: 'from-orange-500',   to: 'to-red-700',       accent: 'text-orange-400' },
  'genshin-impact':    { from: 'from-amber-500',    to: 'to-yellow-700',    accent: 'text-amber-400' },
  'valorant':          { from: 'from-rose-500',     to: 'to-red-800',       accent: 'text-rose-400' },
  'pubg-mobile':       { from: 'from-yellow-500',   to: 'to-amber-700',     accent: 'text-yellow-400' },
  'honkai-star-rail':  { from: 'from-violet-500',   to: 'to-purple-800',    accent: 'text-violet-400' },
  'call-of-duty-mobile':{ from: 'from-emerald-600', to: 'to-green-900',     accent: 'text-emerald-400' },
  'roblox':            { from: 'from-red-500',      to: 'to-rose-700',      accent: 'text-red-400' },
  'steam-wallet':      { from: 'from-slate-600',    to: 'to-gray-900',      accent: 'text-slate-300' },
  'wild-rift':         { from: 'from-cyan-500',     to: 'to-teal-800',      accent: 'text-cyan-400' },
  'arena-of-valor':    { from: 'from-purple-500',   to: 'to-violet-800',    accent: 'text-purple-400' },
  'zenless-zone-zero': { from: 'from-zinc-500',     to: 'to-neutral-900',   accent: 'text-zinc-300' },
};

export function getGameColor(slug: string) {
  return GAME_COLORS[slug] || { from: 'from-primary/40', to: 'to-primary/60', accent: 'text-primary' };
}

/** Per-category colors for digital products */
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'PULSA':          { bg: 'bg-blue-500/10',    text: 'text-blue-600 dark:text-blue-400',    border: 'border-blue-500/20' },
  'PLN':            { bg: 'bg-yellow-500/10',   text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/20' },
  'VOUCHER':        { bg: 'bg-purple-500/10',   text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20' },
  'STREAMING':      { bg: 'bg-rose-500/10',     text: 'text-rose-600 dark:text-rose-400',    border: 'border-rose-500/20' },
  'EWALLET_TOPUP':  { bg: 'bg-emerald-500/10',  text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
  'GIFT_CARD':      { bg: 'bg-orange-500/10',   text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20' },
  'GAME_TOPUP':     { bg: 'bg-indigo-500/10',   text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20' },
};

export function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] || { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
}

/** Game abbreviations for card display */
export const GAME_INITIALS: Record<string, string> = {
  'mobile-legends': 'ML',
  'free-fire': 'FF',
  'genshin-impact': 'GI',
  'valorant': 'VL',
  'pubg-mobile': 'PB',
  'honkai-star-rail': 'HSR',
  'call-of-duty-mobile': 'COD',
  'roblox': 'RBX',
  'steam-wallet': 'STM',
  'wild-rift': 'WR',
  'arena-of-valor': 'AoV',
  'zenless-zone-zero': 'ZZZ',
};
