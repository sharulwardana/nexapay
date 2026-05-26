import { Product } from '@/types';

export const digitalProducts: Product[] = [
  // PULSA
  {
    id: 'pulsa-tsel',
    name: 'Pulsa Telkomsel',
    slug: 'pulsa-telkomsel',
    category: 'PULSA',
    description: 'Isi pulsa Telkomsel dengan harga terbaik.',
    image: '/images/products/telkomsel.webp',
    publisher: 'Telkomsel',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    denominations: [
      { id: 'pt-1', productId: 'pulsa-tsel', label: 'Pulsa 5.000', value: 5000, price: 6500, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'pt-2', productId: 'pulsa-tsel', label: 'Pulsa 10.000', value: 10000, price: 11500, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'pt-3', productId: 'pulsa-tsel', label: 'Pulsa 25.000', value: 25000, price: 26000, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'pt-4', productId: 'pulsa-tsel', label: 'Pulsa 50.000', value: 50000, price: 50500, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'pt-5', productId: 'pulsa-tsel', label: 'Pulsa 100.000', value: 100000, price: 99500, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
    ],
  },
  {
    id: 'pulsa-xl',
    name: 'Pulsa XL Axiata',
    slug: 'pulsa-xl',
    category: 'PULSA',
    description: 'Isi pulsa XL Axiata murah dan cepat.',
    image: '/images/products/xl.webp',
    publisher: 'XL Axiata',
    isActive: true,
    isFeatured: false,
    isPopular: true,
    denominations: [
      { id: 'px-1', productId: 'pulsa-xl', label: 'Pulsa 5.000', value: 5000, price: 6200, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'px-2', productId: 'pulsa-xl', label: 'Pulsa 10.000', value: 10000, price: 11200, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'px-3', productId: 'pulsa-xl', label: 'Pulsa 25.000', value: 25000, price: 25500, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'px-4', productId: 'pulsa-xl', label: 'Pulsa 50.000', value: 50000, price: 50000, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'px-5', productId: 'pulsa-xl', label: 'Pulsa 100.000', value: 100000, price: 99000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
    ],
  },
  // PLN
  {
    id: 'pln-001',
    name: 'Token PLN',
    slug: 'token-pln',
    category: 'PLN',
    description: 'Beli token listrik PLN prepaid instan.',
    image: '/images/products/pln.webp',
    publisher: 'PLN',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    denominations: [
      { id: 'pln-1', productId: 'pln-001', label: 'Token 20.000', value: 20000, price: 21500, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'pln-2', productId: 'pln-001', label: 'Token 50.000', value: 50000, price: 51500, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'pln-3', productId: 'pln-001', label: 'Token 100.000', value: 100000, price: 101500, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'pln-4', productId: 'pln-001', label: 'Token 200.000', value: 200000, price: 201500, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'pln-5', productId: 'pln-001', label: 'Token 500.000', value: 500000, price: 501500, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'pln-6', productId: 'pln-001', label: 'Token 1.000.000', value: 1000000, price: 1001500, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
    ],
  },
  // Google Play
  {
    id: 'gplay-001',
    name: 'Google Play Gift Card',
    slug: 'google-play',
    category: 'GIFT_CARD',
    subcategory: 'Digital Store',
    description: 'Beli voucher Google Play untuk beli app, game, dan konten digital.',
    image: '/images/products/google-play.webp',
    publisher: 'Google',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    denominations: [
      { id: 'gp-1', productId: 'gplay-001', label: 'Rp 20.000', value: 20000, price: 22000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'gp-2', productId: 'gplay-001', label: 'Rp 50.000', value: 50000, price: 52500, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'gp-3', productId: 'gplay-001', label: 'Rp 100.000', value: 100000, price: 103000, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'gp-4', productId: 'gplay-001', label: 'Rp 150.000', value: 150000, price: 154000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'gp-5', productId: 'gplay-001', label: 'Rp 300.000', value: 300000, price: 306000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'gp-6', productId: 'gplay-001', label: 'Rp 500.000', value: 500000, price: 510000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
    ],
  },
  // Netflix
  {
    id: 'netflix-001',
    name: 'Netflix Gift Card',
    slug: 'netflix',
    category: 'STREAMING',
    subcategory: 'Video',
    description: 'Voucher Netflix untuk langganan streaming film & series.',
    image: '/images/products/netflix.webp',
    publisher: 'Netflix',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    denominations: [
      { id: 'nf-1', productId: 'netflix-001', label: 'Rp 50.000', value: 50000, price: 52000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'nf-2', productId: 'netflix-001', label: 'Rp 100.000', value: 100000, price: 103000, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'nf-3', productId: 'netflix-001', label: 'Rp 200.000', value: 200000, price: 205000, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'nf-4', productId: 'netflix-001', label: 'Rp 300.000', value: 300000, price: 306000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'nf-5', productId: 'netflix-001', label: 'Rp 500.000', value: 500000, price: 510000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
    ],
  },
  // Spotify
  {
    id: 'spotify-001',
    name: 'Spotify Premium',
    slug: 'spotify',
    category: 'STREAMING',
    subcategory: 'Music',
    description: 'Voucher Spotify Premium untuk streaming musik tanpa iklan.',
    image: '/images/products/spotify.webp',
    publisher: 'Spotify',
    isActive: true,
    isFeatured: false,
    isPopular: true,
    denominations: [
      { id: 'sp-1', productId: 'spotify-001', label: '1 Bulan Individual', value: 1, price: 54990, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'sp-2', productId: 'spotify-001', label: '3 Bulan Individual', value: 3, price: 149970, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'sp-3', productId: 'spotify-001', label: '6 Bulan Individual', value: 6, price: 279940, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'sp-4', productId: 'spotify-001', label: '1 Bulan Family', value: 1, price: 86900, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
    ],
  },
  // Paket Data
  {
    id: 'data-tsel',
    name: 'Paket Data Telkomsel',
    slug: 'paket-data-telkomsel',
    category: 'PAKET_DATA',
    description: 'Paket internet Telkomsel dengan kuota besar dan harga hemat.',
    image: '/images/products/telkomsel-data.webp',
    publisher: 'Telkomsel',
    isActive: true,
    isFeatured: false,
    isPopular: true,
    denominations: [
      { id: 'dt-1', productId: 'data-tsel', label: '1GB 30 Hari', value: 1, price: 12000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'dt-2', productId: 'data-tsel', label: '3GB 30 Hari', value: 3, price: 25000, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'dt-3', productId: 'data-tsel', label: '6GB 30 Hari', value: 6, price: 45000, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'dt-4', productId: 'data-tsel', label: '12GB 30 Hari', value: 12, price: 75000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'dt-5', productId: 'data-tsel', label: '25GB 30 Hari', value: 25, price: 120000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'dt-6', productId: 'data-tsel', label: '50GB 30 Hari', value: 50, price: 200000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
    ],
  },
  // E-wallet
  {
    id: 'ew-gopay',
    name: 'Saldo GoPay',
    slug: 'saldo-gopay',
    category: 'EWALLET_TOPUP',
    description: 'Top up saldo GoPay untuk transaksi harian.',
    image: '/images/products/gopay.webp',
    publisher: 'Gojek',
    isActive: true,
    isFeatured: false,
    isPopular: true,
    denominations: [
      { id: 'eg-1', productId: 'ew-gopay', label: 'Rp 10.000', value: 10000, price: 11500, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'eg-2', productId: 'ew-gopay', label: 'Rp 25.000', value: 25000, price: 26500, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'eg-3', productId: 'ew-gopay', label: 'Rp 50.000', value: 50000, price: 51500, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'eg-4', productId: 'ew-gopay', label: 'Rp 100.000', value: 100000, price: 101500, stock: -1, isActive: true, isPopular: true, isFlashSale: false },
      { id: 'eg-5', productId: 'ew-gopay', label: 'Rp 250.000', value: 250000, price: 252000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
      { id: 'eg-6', productId: 'ew-gopay', label: 'Rp 500.000', value: 500000, price: 503000, stock: -1, isActive: true, isPopular: false, isFlashSale: false },
    ],
  },
];

export const allProducts = [...digitalProducts];

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return allProducts.filter((p) => p.category === category && p.isActive);
}

export function getFeaturedProducts(): Product[] {
  return allProducts.filter((p) => p.isFeatured && p.isActive);
}
