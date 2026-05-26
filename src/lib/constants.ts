export const APP_NAME = 'NexaPay';
export const APP_TAGLINE = 'Level Up Instantly';
export const APP_DESCRIPTION = 'Platform top-up game & produk digital terpercaya, tercepat, dan teraman di Indonesia. Top up Mobile Legends, Free Fire, Genshin Impact, dan ribuan produk digital lainnya.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nexapay.id';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Top Up', href: '/topup' },
  { label: 'Produk Digital', href: '/products' },
  { label: 'Promo', href: '/promo' },
  { label: 'News', href: '/news' },
  { label: 'Help', href: '/help' },
] as const;

export const MOBILE_NAV_LINKS = [
  { label: 'Home', href: '/', icon: 'Home' },
  { label: 'Top Up', href: '/topup', icon: 'Gamepad2' },
  { label: 'Promo', href: '/promo', icon: 'Percent' },
  { label: 'Riwayat', href: '/dashboard/transactions', icon: 'Receipt' },
  { label: 'Profil', href: '/dashboard', icon: 'User' },
] as const;

export const PAYMENT_METHODS = [
  {
    id: 'qris',
    name: 'QRIS',
    category: 'QRIS',
    icon: '/images/payments/qris.svg',
    description: 'Scan & bayar dengan semua e-wallet',
    fee: 0,
  },
  {
    id: 'gopay',
    name: 'GoPay',
    category: 'E-Wallet',
    icon: '/images/payments/gopay.svg',
    description: 'Bayar dengan GoPay',
    fee: 0,
  },
  {
    id: 'ovo',
    name: 'OVO',
    category: 'E-Wallet',
    icon: '/images/payments/ovo.svg',
    description: 'Bayar dengan OVO',
    fee: 0,
  },
  {
    id: 'dana',
    name: 'DANA',
    category: 'E-Wallet',
    icon: '/images/payments/dana.svg',
    description: 'Bayar dengan DANA',
    fee: 0,
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    category: 'E-Wallet',
    icon: '/images/payments/shopeepay.svg',
    description: 'Bayar dengan ShopeePay',
    fee: 0,
  },
  {
    id: 'bca',
    name: 'BCA Virtual Account',
    category: 'Bank Transfer',
    icon: '/images/payments/bca.svg',
    description: 'Transfer via BCA',
    fee: 4000,
  },
  {
    id: 'bni',
    name: 'BNI Virtual Account',
    category: 'Bank Transfer',
    icon: '/images/payments/bni.svg',
    description: 'Transfer via BNI',
    fee: 4000,
  },
  {
    id: 'bri',
    name: 'BRI Virtual Account',
    category: 'Bank Transfer',
    icon: '/images/payments/bri.svg',
    description: 'Transfer via BRI',
    fee: 4000,
  },
  {
    id: 'mandiri',
    name: 'Mandiri Virtual Account',
    category: 'Bank Transfer',
    icon: '/images/payments/mandiri.svg',
    description: 'Transfer via Mandiri',
    fee: 4000,
  },
  {
    id: 'alfamart',
    name: 'Alfamart',
    category: 'Convenience Store',
    icon: '/images/payments/alfamart.svg',
    description: 'Bayar di Alfamart terdekat',
    fee: 5000,
  },
  {
    id: 'indomaret',
    name: 'Indomaret',
    category: 'Convenience Store',
    icon: '/images/payments/indomaret.svg',
    description: 'Bayar di Indomaret terdekat',
    fee: 5000,
  },
  {
    id: 'usdt',
    name: 'USDT (TRC-20)',
    category: 'Crypto',
    icon: '/images/payments/usdt.svg',
    description: 'Bayar dengan USDT',
    fee: 0,
  },
] as const;

export const CATEGORIES = [
  { id: 'GAME_TOPUP', label: 'Game Top Up', icon: 'Gamepad2', color: 'from-violet-500 to-purple-600' },
  { id: 'VOUCHER', label: 'Voucher', icon: 'Ticket', color: 'from-cyan-500 to-blue-600' },
  { id: 'PULSA', label: 'Pulsa', icon: 'Smartphone', color: 'from-green-500 to-emerald-600' },
  { id: 'PAKET_DATA', label: 'Paket Data', icon: 'Wifi', color: 'from-orange-500 to-amber-600' },
  { id: 'PLN', label: 'Token PLN', icon: 'Zap', color: 'from-yellow-500 to-yellow-600' },
  { id: 'GIFT_CARD', label: 'Gift Card', icon: 'Gift', color: 'from-pink-500 to-rose-600' },
  { id: 'STREAMING', label: 'Streaming', icon: 'Tv', color: 'from-red-500 to-rose-600' },
  { id: 'EWALLET_TOPUP', label: 'E-Wallet', icon: 'Wallet', color: 'from-blue-500 to-indigo-600' },
] as const;

export const STATS = [
  { label: 'Pengguna Aktif', value: 2500000, suffix: '+' },
  { label: 'Transaksi Sukses', value: 15000000, suffix: '+' },
  { label: 'Game Tersedia', value: 500, suffix: '+' },
  { label: 'Partner Payment', value: 50, suffix: '+' },
] as const;

export const LOYALTY_LEVELS = {
  BRONZE: { name: 'Bronze', minPoints: 0, color: '#CD7F32', discount: 0 },
  SILVER: { name: 'Silver', minPoints: 1000, color: '#C0C0C0', discount: 2 },
  GOLD: { name: 'Gold', minPoints: 5000, color: '#FFD700', discount: 5 },
  PLATINUM: { name: 'Platinum', minPoints: 15000, color: '#E5E4E2', discount: 8 },
  DIAMOND: { name: 'Diamond', minPoints: 50000, color: '#B9F2FF', discount: 12 },
} as const;
