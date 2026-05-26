// Prisma Seed Script
// Run with: npx tsx prisma/seed.ts

import prisma from '../src/lib/prisma';

async function main() {
  console.log('🌱 Seeding NexaPay database...\n');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexapay.id' },
    update: {},
    create: {
      email: 'admin@nexapay.id',
      name: 'Admin NexaPay',
      role: 'ADMIN',
      walletBalance: 10000000,
      loyaltyLevel: 'DIAMOND',
      loyaltyPoints: 100000,
      referralCode: 'ADMIN2026',
      password: '$2b$10$hashedpassword', // admin123
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'user@nexapay.id' },
    update: {},
    create: {
      email: 'user@nexapay.id',
      name: 'Ahmad Rizky',
      role: 'USER',
      walletBalance: 250000,
      loyaltyLevel: 'GOLD',
      loyaltyPoints: 8500,
      referralCode: 'RIZKY2026',
      password: '$2b$10$hashedpassword', // user123
    },
  });
  console.log('✅ Demo user created:', user.email);

  // Create products
  const mlProduct = await prisma.product.upsert({
    where: { slug: 'mobile-legends' },
    update: {},
    create: {
      name: 'Mobile Legends: Bang Bang',
      slug: 'mobile-legends',
      category: 'GAME_TOPUP',
      subcategory: 'MOBA',
      description: 'Top up Diamond Mobile Legends Bang Bang',
      image: '/images/games/mobile-legends.jpg',
      publisher: 'Moonton',
      isActive: true,
      isFeatured: true,
      isPopular: true,
    },
  });

  // Create denominations
  const denominations = [
    { label: '56 Diamonds', value: 56, price: 15500, originalPrice: 18000, discount: 14, isPopular: true },
    { label: '112 Diamonds', value: 112, price: 30000, originalPrice: 35000, discount: 14 },
    { label: '568 Diamonds', value: 568, price: 140000, originalPrice: 165000, discount: 15, isPopular: true },
    { label: '1136 Diamonds', value: 1136, price: 275000, originalPrice: 320000, discount: 14 },
  ];

  for (const denom of denominations) {
    await prisma.denomination.create({
      data: {
        productId: mlProduct.id,
        label: denom.label,
        value: denom.value,
        price: denom.price,
        originalPrice: denom.originalPrice,
        discount: denom.discount,
        isPopular: denom.isPopular || false,
      },
    });
  }
  console.log('✅ Products and denominations created');

  // Create promos
  await prisma.promo.upsert({
    where: { code: 'NEWUSER15K' },
    update: {},
    create: {
      code: 'NEWUSER15K',
      name: 'New User Bonus Rp 15.000',
      description: 'Bonus saldo Rp 15.000 untuk pengguna baru',
      type: 'FIXED',
      value: 15000,
      minPurchase: 25000,
      maxDiscount: 15000,
      usageLimit: -1,
      perUserLimit: 1,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
    },
  });

  await prisma.promo.upsert({
    where: { code: 'MLFLASH25' },
    update: {},
    create: {
      code: 'MLFLASH25',
      name: 'Flash Sale Mobile Legends',
      description: 'Diskon 25% untuk semua Diamond ML',
      type: 'PERCENTAGE',
      value: 25,
      minPurchase: 15000,
      maxDiscount: 50000,
      usageLimit: 1000,
      perUserLimit: 3,
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-06-01'),
      isActive: true,
    },
  });
  console.log('✅ Promos created');

  // Create banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'Top Up Game Tercepat & Termurah',
        subtitle: 'Proses instan, harga bersahabat, 500+ game tersedia',
        image: '/images/banners/hero-1.jpg',
        link: '/topup',
        position: 'home_hero',
        isActive: true,
        sortOrder: 1,
      },
      {
        title: 'Flash Sale Spesial',
        subtitle: 'Diskon hingga 50% untuk semua produk digital',
        image: '/images/banners/hero-2.jpg',
        link: '/promo',
        position: 'home_hero',
        isActive: true,
        sortOrder: 2,
      },
    ],
  });
  console.log('✅ Banners created');

  // Create sample transactions
  const denomIds = await prisma.denomination.findMany({ where: { productId: mlProduct.id } });
  if (denomIds.length > 0) {
    for (let i = 0; i < 5; i++) {
      const denom = denomIds[i % denomIds.length];
      await prisma.transaction.create({
        data: {
          userId: user.id,
          productId: mlProduct.id,
          denominationId: denom.id,
          amount: denom.price,
          totalAmount: denom.price,
          paymentMethod: ['QRIS', 'EWALLET_GOPAY', 'EWALLET_OVO', 'BANK_BCA', 'EWALLET_DANA'][i] as any,
          status: i < 4 ? 'COMPLETED' : 'PROCESSING',
          gameUserId: '123456789',
          gameServerId: '8001',
          paidAt: i < 4 ? new Date(Date.now() - i * 86400000) : null,
          completedAt: i < 3 ? new Date(Date.now() - i * 86400000 + 30000) : null,
        },
      });
    }
    console.log('✅ Sample transactions created');
  }

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: 'Selamat Datang di NexaPay!',
        message: 'Nikmati bonus Rp 15.000 untuk transaksi pertamamu. Gunakan kode NEWUSER15K.',
        type: 'info',
      },
      {
        userId: user.id,
        title: 'Flash Sale Dimulai!',
        message: 'Diskon 25% untuk top up Mobile Legends berlaku hingga akhir bulan.',
        type: 'promo',
        link: '/promo',
      },
    ],
  });
  console.log('✅ Notifications created');

  // Create news articles
  await prisma.newsArticle.createMany({
    data: [
      {
        title: 'NexaPay Resmi Menjadi Official Top Up Partner Moonton',
        slug: 'nexapay-partnership-moonton',
        excerpt: 'Kerjasama strategis untuk menghadirkan pengalaman top up Mobile Legends terbaik.',
        content: 'NexaPay dengan bangga mengumumkan kerjasama resmi dengan Moonton...',
        author: 'NexaPay Team',
        category: 'partnership',
        tags: JSON.stringify(['partnership', 'moonton', 'mobile-legends']),
        isPublished: true,
        publishedAt: new Date('2026-05-25'),
      },
      {
        title: 'Flash Sale Anniversary NexaPay',
        slug: 'flash-sale-anniversary',
        excerpt: 'Diskon hingga 50% untuk semua produk!',
        content: 'Rayakan ulang tahun NexaPay dengan flash sale besar-besaran...',
        author: 'NexaPay Team',
        category: 'promo',
        tags: JSON.stringify(['promo', 'flash-sale', 'anniversary']),
        isPublished: true,
        publishedAt: new Date('2026-05-23'),
      },
    ],
  });
  console.log('✅ News articles created');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('📧 Admin: admin@nexapay.id / admin123');
  console.log('📧 User: user@nexapay.id / user123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
