export interface NewsArticle {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  date: string;
  readTime: string;
  color: string;
  badge: string;
}

export const articles: NewsArticle[] = [
  {
    id: '1',
    slug: 'nexapay-partnership-moonton',
    category: 'Official Partnership',
    title: 'NexaPay Engine Direct API Integration dengan Moonton Official',
    excerpt: 'Kerjasama integrasi langsung ke server Moonton untuk pengisian Diamond Mobile Legends dalam hitungan milidetik tanpa hambatan.',
    content: [
      'NexaPay secara resmi mengumumkan integrasi Direct API tingkat enterprise dengan Moonton Games, pengembang dan publisher game terpopuler di Asia Tenggara, Mobile Legends: Bang Bang.',
      'Melalui kerjasama strategis ini, seluruh proses transaksi pengisian Diamond MLBB dan Weekly Diamond Pass di platform NexaPay kini terhubung langsung dengan server otentikasi Moonton tanpa melalui pihak ketiga (broker).',
      'Keunggulan integrasi Direct API ini mencakup: kecepatan eksekusi sub-detik (rata-rata 1.2 detik per transaksi), verifikasi otomatis Nickname dan Server ID secara real-time, serta jaminan 100% legalitas tanpa resiko pemotongan diamond atau banned akun.',
      'Sistem Direct API ini juga dilengkapi dengan mekanisme auto-retry multi-node, memastikan pesanan tetap terkirim secara instan meskipun server utama Moonton sedang mengalami lonjakan trafik saat event server maintenance atau rilis skin Collector/Legend.',
    ],
    author: 'Nexa Engineering',
    date: '25 Mei 2026',
    readTime: '3 min read',
    color: 'from-violet-600 to-indigo-700',
    badge: 'Major Milestone',
  },
  {
    id: '2',
    slug: 'flash-sale-anniversary',
    category: 'Cyber Boost',
    title: 'Nexa Cyber Anniversary Boost — Diskon Up To 50% & Exclusive Cashback',
    excerpt: 'Event tahunan terbesar NexaPay! Dapatkan potongan harga otomatis dan double poin loyalti untuk semua game top-up.',
    content: [
      'Merayakan hari jadi NexaPay, kami meluncurkan program Nexa Cyber Anniversary Boost dengan total subsidi cashback senilai ratusan juta rupiah untuk seluruh gamer setia di Indonesia.',
      'Selama periode event, pengguna dapat menikmati diskon kilat hingga 50% pada jam-jam Flash Sale tertentu (12:00 WIB, 18:00 WIB, dan 21:00 WIB) untuk judul game favorit seperti Mobile Legends, Free Fire, Genshin Impact, dan Valorant Points.',
      'Selain itu, seluruh transaksi yang diselesaikan menggunakan NexaPay Wallet akan mendapatkan 2x NexaPoints (Loyalty Multiplier) yang dapat ditukarkan langsung dengan voucher diskon tambahan atau saldo wallet.',
    ],
    author: 'Growth Team',
    date: '23 Mei 2026',
    readTime: '2 min read',
    color: 'from-orange-500 to-amber-600',
    badge: 'Hot Event',
  },
  {
    id: '3',
    slug: 'fitur-baru-crypto-payment',
    category: 'System Upgrade',
    title: 'Deployment System v2.6: Web3 Crypto Payment Engine (USDT/BTC)',
    excerpt: 'Dukungan pembayaran aset digital terenkripsi dengan konversi kurs otomatis tanpa biaya tersembunyi.',
    content: [
      'Sebagai pelopor teknologi fintech gaming di kawasan Asia Tenggara, NexaPay kini resmi mendukung gerbang pembayaran multi-chain Web3 untuk USDT, USDC, dan Bitcoin.',
      'Sistem pembayaran kripto kami memanfaatkan protokol verifikasi on-chain instan dengan estimasi konfirmasi blok di bawah 15 detik pada jaringan Polygon, Arbitrum, dan TRC-20.',
      'Pengguna internasional kini dapat melakukan top-up game favorit mereka dari mana saja di dunia tanpa terhalang batasan mata uang konvensional atau biaya konversi valuta asing yang mahal.',
    ],
    author: 'Fintech Core',
    date: '20 Mei 2026',
    readTime: '4 min read',
    color: 'from-cyan-500 to-blue-600',
    badge: 'New Feature',
  },
  {
    id: '4',
    slug: 'tips-hemat-top-up',
    category: 'Pro Guide',
    title: 'Optimalisasi Diamond Rate: 7 Strategi Maximize Top-Up Value',
    excerpt: 'Panduan lengkap memaksimalkan setiap rupiah nominal transaksi kamu menggunakan jam promo dan loyalty tier.',
    content: [
      'Top-up game secara pintar membutuhkan pemahaman mengenai rotasi event dan optimasi tier cashback. Tim analis NexaPay telah merangkum 7 strategi terbaik untuk menghemat anggaran top-up Anda hingga 35%:',
      '1. Manfaatkan Weekly Diamond Pass daripada pembelian pecahan diamond harian.',
      '2. Kumpulkan NexaPoints setiap hari melalui fitur Daily Check-in dan Scratch Card.',
      '3. Transaksi pada jam Flash Sale (pukul 12:00 dan 20:00 WIB).',
      '4. Gunakan metode pembayaran QRIS atau NexaPay Wallet untuk menghindari biaya admin tambahan.',
      '5. Tingkatkan level loyalty akun Anda ke tier Gold atau Platinum untuk membuka diskon otomatis permanen.',
      '6. Ajak teman menggunakan kode referral Anda untuk mendapatkan passive wallet balance Rp 10.000 per teman.',
      '7. Aktifkan notifikasi Push Browser agar tidak ketinggalan kuota voucher terbatas.',
    ],
    author: 'Gamer Care',
    date: '18 Mei 2026',
    readTime: '5 min read',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Guide',
  },
  {
    id: '5',
    slug: 'genshin-50-update',
    category: 'Patch Intelligence',
    title: 'Genshin Impact v5.0 Natlan Release & Bonus Welkin Drop Rate',
    excerpt: 'Rangkuman lengkap update Natlan beserta jaminan bonus pengisian Welkin Moon di Nexa Ecosystem.',
    content: [
      'HoYoverse resmi merilis wilayah ke-6 Teyvat: Natlan, Negeri Api dan Perang dalam update Genshin Impact v5.0. Bersamaan dengan rilis ini, NexaPay menyediakan kuota Blessing of the Welkin Moon dan Genesis Crystals dengan tarif promo spesial.',
      'Seluruh pengisian Genesis Crystals melalui NexaPay dijamin masuk langsung ke UID game Anda dalam 3 detik, lengkap dengan penggandaan bonus first-topup resmi dari in-game store.',
    ],
    author: 'Game Intelligence',
    date: '15 Mei 2026',
    readTime: '6 min read',
    color: 'from-purple-500 to-rose-600',
    badge: 'Patch Notes',
  },
  {
    id: '6',
    slug: 'referral-program-launch',
    category: 'Community',
    title: 'Nexa Squad Referral Protocol: Dapatkan Rp 10.000 Per Active Friend',
    excerpt: 'Bagikan referral ID kamu kepada teman seperjuangan gaming dan nikmati cashback pasif yang masuk ke wallet.',
    content: [
      'Nexa Squad Referral Protocol kini resmi dibuka untuk seluruh pengguna terdaftar NexaPay!',
      'Cukup salin kode referral unik dari menu Dashboard Anda dan bagikan ke teman, grup Discord, atau media sosial. Setiap kali teman mendaftar dan melakukan top-up pertama, Anda dan teman Anda akan sama-sama menerima saldo instan Rp 10.000.',
    ],
    author: 'Community Hub',
    date: '12 Mei 2026',
    readTime: '2 min read',
    color: 'from-pink-500 to-rose-600',
    badge: 'Rewards',
  },
];
